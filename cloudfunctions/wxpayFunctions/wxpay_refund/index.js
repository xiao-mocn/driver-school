/**
 * 微信支付 - 申请退款
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
    function generateUniqueRefundNumber() {
        const timestamp = Date.now(); // 当前时间戳
        const random = Math.floor(Math.random() * 10000); // 生成 4 位随机数
        return `${timestamp}${random}`; // 组合时间戳和随机数
    }
    const currentRefoundNo = generateUniqueRefundNumber();
    try {
        const { data } = event
        const wxpay_refund_res = await cloud.callFunction({
            name: 'cloudbase_module',
            data: {
                name: 'wxpay_refund',
                data: {
                    out_refund_no: currentRefoundNo, // 商户退款单号
                    out_trade_no: data.outTradeNo,  // 商户内部退款单号
                    amount: data.amount,
                },
            },
        })
        if (wxpay_refund_res.result.code !== 0) {
            return {
                success: false,
                errMsg: wxpay_refund_res.result.errmsg
            }
        }
        return {
            success: true,
            data: {
                ...wxpay_refund_res.result,
                out_refund_no: currentRefoundNo,
            }
        }
    } catch (error) {
        return {
            success: false,
            errMsg: error
        }
    }
    
};