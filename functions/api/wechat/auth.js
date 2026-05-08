export async function onRequest(context) {
  const { request, env } = context;
  
  const appId = env.WECHAT_APPID || 'wxcff48cc05e7788dc';
  const callbackUrl = 'https://order2-8kn.pages.dev';
  
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${encodeURIComponent(appId)}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  
  return new Response(JSON.stringify({
    success: true,
    auth_url: authUrl
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}