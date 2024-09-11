/**
 * 微信支付 - 申请退款
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const { data } = event
        const res = await cloud.callFunction({
            name: 'cloudbase_module',
            data: {
                name: 'wxpay_refund',
                data: {
                    // transaction_id: '1217752501201407033233368018', // 微信订单号
                    out_trade_no: data.outTradeNo,  // 商户内部退款单号
                    amount: {
                        refund: 1, // 退款金额
                        total: 1, // 原订单金额,
                        currency: 'CNY',
                    },
                },
            },
        })
        return {
            success: true,
            data: res.result
        }
    } catch (error) {
        return {
            success: false,
            errMsg: error
        }
    }
    
};