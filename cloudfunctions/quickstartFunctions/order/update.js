const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 获取openId云函数入口函数
exports.main = async (event, context) => {
  const { data } = event;
  const _id = data._id
  delete data._id
  try {
    if (data.status === 'complete') {
      await db.collection('coaches').doc(data.coachId).update({
        data: {
          incomeNum: db.command.inc(data.price * 0.8),
          withdrawableIncome: db.command.inc(data.price * 0.8),
        },
      });
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
    }
    const coacheResp = await db.collection('coaches').where({
      _id: data.coachId,
    }).get();
    const selectedDates = coacheResp.data[0].selectedDates || []
    const monthlyOrderInfo = coacheResp.data[0].monthlyOrderInfo || {}
    const currentMonth = `${data.orderTime.split('-')[0]}-${data.orderTime.split('-')[1]}`
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
