/**
 * 微信支付 - 下单
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();

    // 商户自行生成商户订单号，此处仅为代码示例
    const outTradeNo = Math.round(Math.random() * 10 ** 13) + Date.now();

    // 商户存储订单号到数据库，便于后续与微信侧订单号关联。例如使用云开发云存储能力：
    await db.collection('orders').doc(event.order_id).update({
      data: {
        outTradeNo
      },
    })

    const res = await cloud.callFunction({
      name: 'cloudbase_module',
      data: {
        name: 'wxpay_order',
        data: {
          description: '训练订单',
          amount: {
            total: event.payNum, // 订单金额
            currency: 'CNY',
          },
          // 商户生成的订单号
          out_trade_no: outTradeNo,
          payer: {
            // 服务端云函数中直接获取当前用户openId
            openid: wxContext.OPENID,
          },
        },
      },
    });
    return {
      success: true,
      data: res.result.data
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }
  
};