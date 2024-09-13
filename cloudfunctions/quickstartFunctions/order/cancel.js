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
      const coachInfoRes = await db.collection('coaches').doc(data.coachId).get();
      const selectedDates = coachInfoRes.data.selectedDates
      const monthlyOrderInfo = coachInfoRes.data.monthlyOrderInfo
      selectedDates.forEach((item) => {
        if (data.orderTime === item.year + '-' + item.date) {
          item.timePeriods.splice(item.timePeriods.indexOf(data.orderTimePeriod), 1)
        }
      })
      const dateSplits = data.orderTime.split('-');
      monthlyOrderInfo[`_${dateSplits[0]}_${dateSplits[1]}`] -= 1
      await db.collection('coaches').doc(data.coachId).update({
        data: {
          selectedDates,
          monthlyOrderInfo,
          studentCount: db.command.inc(-1)
        },
      });
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
