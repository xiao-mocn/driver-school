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
  const checkResult = await db.collection(collectionName).where({
    ...data
  }).get();
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
