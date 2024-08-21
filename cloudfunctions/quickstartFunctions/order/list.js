const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const { orderTime, coachId, status} = event;
  const params = {
    status
  }
  if (coachId) {
    params.coachId = coachId;
  }
  if (orderTime) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(orderTime)) {
      return {
        success: false,
        errMsg: 'Invalid start time format. Expected format: YYYY-MM-DD'
      };
    }
    params.orderTime = db.command.gte(orderTime);
  }
  try {
    // 查询指定时间范围内的订单
    console.log('Query parameters:', params); // 输出调试信息
    const result = await db.collection('orders')
      .where({
        ...params
      })
      .get();
    console.log('Query result:', result); // 输出调试信息
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      errMsg: error.message
    };
  }
};
