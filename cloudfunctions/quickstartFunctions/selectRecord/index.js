const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const collectionName = event.collectionName;
  console.log('collectionName ===', collectionName);
  const data = event.data;
  const limit = event.limit || 999; // 默认限制返回10条数据，如果没有传入limit参数
  const checkResult = await db.collection(collectionName).where({
    ...data
  }).limit(limit).get();
  if (checkResult.data.length > 0) {
    return {
      success: true,
      data: checkResult.data
    };
  } else {
    return {
      success: false,
      data: []
    };
  }
};
