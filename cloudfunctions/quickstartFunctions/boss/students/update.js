const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  try {
    const data = event.data
    const _id = data._id
    delete data._id
    await db.collection('students').doc(_id).update({
      data,
    });
    return {
      success: true,
      data: '更新成功'
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};
