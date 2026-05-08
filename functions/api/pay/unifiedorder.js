async function md5Hash(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('MD5', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function generateNonceStr() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonceStr = '';
  for (let i = 0; i < 32; i++) {
    nonceStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonceStr;
}

function generateTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

function formatXml(params) {
  let xml = '<xml>';
  for (const key of Object.keys(params).sort()) {
    xml += `<${key}>${params[key]}</${key}>`;
  }
  xml += '</xml>';
  return xml;
}

async function sign(params, key) {
  // 过滤掉 sign 字段和空值字段
  const filteredParams = {};
  for (const k in params) {
    if (k !== 'sign' && params[k] !== '' && params[k] !== undefined && params[k] !== null) {
      filteredParams[k] = params[k];
    }
  }
  
  // 按字典序排序
  const sortedKeys = Object.keys(filteredParams).sort((a, b) => a.localeCompare(b));
  let signStr = '';
  for (const k of sortedKeys) {
    const value = filteredParams[k];
    signStr += `${k}=${value}&`;
  }
  signStr += `key=${key}`;
  
  console.log('=== 签名调试 ===');
  console.log('原始参数:', params);
  console.log('过滤后参数:', filteredParams);
  console.log('排序后键:', sortedKeys);
  console.log('签名字符串:', signStr);
  
  const hash = await md5Hash(signStr);
  const upperHash = hash.toUpperCase();
  console.log('签名结果:', upperHash);
  
  return upperHash;
}

export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'OPTIONS') {
    return new Response('', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  const body = await request.json();
  const { openid, total_fee, body: orderBody, out_trade_no } = body;
  
  if (!openid || !total_fee || !orderBody || !out_trade_no) {
    return new Response(JSON.stringify({
      success: false,
      message: '参数不全'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  const appId = env.WECHAT_APPID || 'wxcff48cc05e7788dc';
  const mchId = env.WECHAT_MCHID || '1112300874';
  const key = env.WECHAT_KEY || 'lhj875312875312liliA875312875312';
  const notifyUrl = 'https://xianyu-order.pages.dev/api/pay/notify';
  
  const params = {
    appid: appId,
    mch_id: mchId,
    nonce_str: generateNonceStr(),
    sign_type: 'MD5',
    body: orderBody,
    out_trade_no: out_trade_no,
    total_fee: Math.round(total_fee * 100).toString(),
    spbill_create_ip: '127.0.0.1',
    notify_url: notifyUrl,
    trade_type: 'JSAPI',
    openid: openid
  };
  
  params.sign = await sign(params, key);
  
  const xmlData = formatXml(params);
  
  console.log('=== 微信支付统一下单请求 ===');
  console.log('URL:', 'https://api.mch.weixin.qq.com/pay/unifiedorder');
  console.log('参数:', params);
  console.log('签名:', params.sign);
  console.log('XML数据:', xmlData);
  
  try {
    const response = await fetch('https://api.mch.weixin.qq.com/pay/unifiedorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml'
      },
      body: xmlData
    });
    
    const xmlText = await response.text();
    
    console.log('=== 微信支付统一下单响应 ===');
    console.log('响应状态:', response.status);
    console.log('响应文本:', xmlText);
    
    // 检查响应是否为空
    if (!xmlText || xmlText.trim() === '') {
      return new Response(JSON.stringify({
        success: false,
        message: '微信支付接口返回为空',
        error: {
          responseStatus: response.status,
          responseText: xmlText
        },
        debug: {
          xmlData: xmlData,
          sign: params.sign,
          params: params
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    const result = {};
    // 修复XML解析，支持CDATA标签
    const regex = /<(\w+)>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/\1>/g;
    let match;
    while ((match = regex.exec(xmlText)) !== null) {
      result[match[1]] = match[2];
    }
    
    // 检查解析结果是否为空
    if (Object.keys(result).length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: '微信支付接口响应解析失败',
        error: {
          responseStatus: response.status,
          responseText: xmlText,
          parseError: '无法解析XML响应'
        },
        debug: {
          xmlData: xmlData,
          sign: params.sign,
          params: params,
          rawResponse: xmlText
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      const prepayParams = {
        appId: appId,
        timeStamp: generateTimestamp(),
        nonceStr: generateNonceStr(),
        package: `prepay_id=${result.prepay_id}`,
        signType: 'MD5'
      };
      
      prepayParams.paySign = await sign(prepayParams, key);
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          appId: prepayParams.appId,
          timeStamp: prepayParams.timeStamp,
          nonceStr: prepayParams.nonceStr,
          package: prepayParams.package,
          signType: prepayParams.signType,
          paySign: prepayParams.paySign
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: result.return_msg || result.err_code_des || '统一下单失败',
        error: result,
        debug: {
          xmlData: xmlData,
          sign: params.sign,
          params: params
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: '服务器错误',
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
}
