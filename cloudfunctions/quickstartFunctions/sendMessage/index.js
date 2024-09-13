const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  try {
    const { data } = event;
    cloud.callFunction({
      name: 'cloudbase_module',
      data: {
        name: 'wx_message_send_message',
        data: {
          template_id: "9gYLIXnaZszuCzgDVZ8etibeCGA_iJBww7NN7i7q1GQ", // 所需下发的订阅模板id
          page: "pages/orderList/index", //点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转
          touser: data.opopenId, //接收者（用户）的 openid
          data: {
            character_string5: { value: data.orderId }, // 确保字段名称和类型与模板一致
            date3: { value: data.orderTime }, // 根据实际情况填写
            thing1: { value: data.school },
            thing15: { value: '两件咖啡' },
            thing4: { value: '已支付' }
          }, // 模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }的object
          miniprogram_state:"developer", //跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
          lang:"zh_CN" //进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
        },
      },
      success: (res) => {
        return {
          success: true,
          data: res.result,
        }
      },
      fail: (err) => {
        return {
          success: false,
          errMsg: err,
        }
      }
    });

    return response.data;
  } catch (error) {
    console.error('发送订阅消息失败：', error);
    return { error: '发送失败' };
  }
};