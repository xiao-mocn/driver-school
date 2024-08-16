const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  const collectionName = event.collectionName;
  const data = event.data;
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
          message: '身份证号已存在，不能重复添加'
        };
      }
    }
    if (collectionName === 'orders') {
      const coachInfo = data.coachInfo
      if (coachInfo._id) {
        const _id = coachInfo._id
        delete coachInfo._id
        const checkResult = await db.collection('coaches').where({
          _id,
        }).get();
        const { selectedDates } = checkResult.data[0] || []
        for (let i = 0; i < selectedDates.length; i++) {
          const item = selectedDates[i];
          const itemDate = `${item.weekday}:${item.year}:${item.date}`
          if (itemDate === data.selectedDate && item.timePeriods.indexOf(data.selectedTimePeriod) !== -1) {
            return {
              success: false,
              errMsg: '该时间段已预约，请选择其他时间段'
            };
          }
        }
        await db.collection('coaches').where({
          _id
        }).update({
          data: {
            ...coachInfo,
            selectedTimePeriod: data.selectedTimePeriod,
            selectedDate: data.selectedDate,
          },
        })
      }
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
