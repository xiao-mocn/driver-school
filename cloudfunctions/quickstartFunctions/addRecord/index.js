const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  const collectionName = event.collectionName;
  const data = event.data;
  const coachId = data.coachId
  try {
    // 先查询是否存在相同的 IDCard
    if (collectionName === 'students' || collectionName === 'coaches') {
      const checkResult = await db.collection(collectionName).where({
        idCard: data.idCard
      }).get();
      if (checkResult.data.length > 0) {
        // 如果存在相同的 IDCard，返回不能重复添加的提示
        return {
          success: false,
          errMsg: '身份证号已存在，不能重复添加'
        };
      }
    }
    if (collectionName === 'orders' && coachId) {
      const checkResult = await db.collection('coaches').where({
        _id: coachId,
      }).get();
      const selectedDates = checkResult.data[0].selectedDates || []
      const monthlyOrderInfo = checkResult.data[0].monthlyOrderInfo || {}
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
        _id: coachId
      }).update({
        data: {
          selectedDates,
          monthlyOrderInfo,
          studentCount: db.command.inc(1),
          totalOrdNum: db.command.inc(1),
        },
      })
    }
    await db.collection(collectionName).add({
      // data 字段表示需新增的 JSON 数据
      data: { ...data }
    });
    return {
      success: true,
      data: '新增成功'
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};
