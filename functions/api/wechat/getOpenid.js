export async function onRequest(context) {
  const { request, env } = context;
  
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
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
    
    if (!tokenData.openid) {
      return new Response(JSON.stringify({
        success: false,
        message: '获取 openid 失败',
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
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        openid: tokenData.openid,
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        refresh_token: tokenData.refresh_token,
        scope: tokenData.scope
      }
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