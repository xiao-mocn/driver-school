const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const { data } = event;
  try {
    if (data.coachId) {
      const coacheResp = await db.collection('coaches').where({
        _id: data.coachId,
      }).get();
      const selectedDates = coacheResp.data[0].selectedDates || []
      const monthlyOrderInfo = coacheResp.data[0].monthlyOrderInfo || {}
      const currentMonth = `_${data.orderTime.split('-')[0]}_${data.orderTime.split('-')[1]}`
      if (!monthlyOrderInfo[currentMonth]) {
        monthlyOrderInfo[currentMonth] = 1
      } else {
        monthlyOrderInfo[currentMonth] += 1
      }
      const filterItem = selectedDates.filter((item) => `${item.year}-${item.date}` === data.orderTime)[0]
      if (filterItem) {
        if (filterItem.timePeriods.indexOf(data.orderTimePeriod) !== -1) {
          return {
            success: false,
            errMsg: '该时间段已预约，请选择其他时间段'
          }
        } else {
          filterItem.timePeriods.push(data.orderTimePeriod)
        }
      } else {
        const orderTimeArr = data.orderTime.split('-')
        selectedDates.push({
          year: orderTimeArr[0],
          date: `${orderTimeArr[1]}-${orderTimeArr[2]}`,
          timePeriods: [data.orderTimePeriod]
        })
      }
      await db.collection('coaches').where({
        _id: data.coachId
      }).update({
        data: {
          selectedDates,
          monthlyOrderInfo,
          studentCount: db.command.inc(1),
          totalOrdNum: db.command.inc(1),
        },
      })
    }
    const res = await db.collection('orders').add({
      // data 字段表示需新增的 JSON 数据
      data: { ...data }
    });
    return {
      success: true,
      data: res._id
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};
