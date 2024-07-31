const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  const collectionName = event.collectionName;
  const _id = event._id;
  try {
    const res = await db.collection(collectionName).doc(_id).remove();
    return {
      success: true,
      data: res
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: '删除失败',
      error: e
    };
  }
};
