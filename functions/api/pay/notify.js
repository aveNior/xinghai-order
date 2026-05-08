export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'OPTIONS') {
    return new Response('', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  try {
    const xmlText = await request.text();
    
    const result = {};
    const regex = /<(\w+)>([^<]+)<\/\w+>/g;
    let match;
    while ((match = regex.exec(xmlText)) !== null) {
      result[match[1]] = match[2];
    }
    
    if (result.return_code === 'SUCCESS') {
      console.log('支付成功:', result);
      
      return new Response('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>', {
        headers: {
          'Content-Type': 'text/xml'
        }
      });
    } else {
      console.log('支付失败:', result);
      
      return new Response('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>', {
        headers: {
          'Content-Type': 'text/xml'
        }
      });
    }
    
  } catch (error) {
    console.error('支付回调错误:', error);
    
    return new Response('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[服务器错误]]></return_msg></xml>', {
      headers: {
        'Content-Type': 'text/xml'
      }
    });
  }
}