const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    const data = event.data
    // 先查询是否存在相同的 IDCard
    const checkResult = await db.collection('students').where({
      idCard: data.idCard
    }).get();
    if (checkResult.data.length > 0) {
      // 如果存在相同的 IDCard，返回不能重复添加的提示
      return {
        success: false,
        errMsg: '身份证号已存在，不能重复添加'
      };
    }
    await db.collection('students').add({
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
