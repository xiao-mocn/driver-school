const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const { data } = event;
  const _id = data._id;
  delete data._id;
  try {
    if (data.coachId) {
      const coachInfo = await db.collection('coaches').doc(data.coachId).get();
      // const selectedDates = coachInfo.selectedDates || []
      // const monthlyOrderInfo = coachInfo.monthlyOrderInfo || {}
      // if (selectedDates.includes(data.date)) {
      //   // 删除日期
      //   selectedDates.splice(selectedDates.indexOf(data.date), 1);
      //   // 更新月订单信息
      //   monthlyOrderInfo[data.date] = 0;
      // }
      // await db.collection('coaches').doc(data.coachId).update({
      //   data: {
      //     incomeNum: db.command.inc(-data.prices * 0.8),
      //     withdrawableIncome: db.command.inc(-data.prices * 0.8),
      //   },
      // });
    }
    await db.collection('orders').where({
      _id: _id
    }).update({
      data: {
        ...data
      }
    })
    return {
      success: true,
      data: {
        _id: _id
      }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errMsg: error.message
    };
  }
};
