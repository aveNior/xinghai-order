export async function onRequest(context) {
  const { request, env } = context;
  
  let code = null;
  
  if (request.method === 'GET') {
    const url = new URL(request.url);
    code = url.searchParams.get('code');
  } else if (request.method === 'POST') {
    try {
      const body = await request.json();
      code = body.code;
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: '请求体格式错误'
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
  
  if (!code) {
    return new Response(JSON.stringify({
      success: false,
      message: '缺少 code 参数'
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
  const appSecret = env.WECHAT_APPSECRET || '8ae3a634418baabd2075df8f66db1d3d';
  
  try {
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${encodeURIComponent(appId)}&secret=${encodeURIComponent(appSecret)}&code=${encodeURIComponent(code)}&grant_type=authorization_code`;
    
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return new Response(JSON.stringify({
        success: false,
        message: '获取 access_token 失败',
        error: tokenData
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${encodeURIComponent(tokenData.access_token)}&openid=${encodeURIComponent(tokenData.openid)}&lang=zh_CN`;
    
    const userResponse = await fetch(userInfoUrl);
    const userData = await userResponse.json();
    
    if (!userData.openid) {
      return new Response(JSON.stringify({
        success: false,
        message: '获取用户信息失败',
        error: userData
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: '登录成功',
      user_id: 'wx_' + userData.openid,
      openid: userData.openid,
      nickname: userData.nickname,
      avatar: userData.headimgurl
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
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