export async function onRequest(context) {
  return new Response(JSON.stringify({
    status: 'ok',
    message: '微信支付服务运行正常'
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}