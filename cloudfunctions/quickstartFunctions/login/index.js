const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  const collectionName = event.collectionName;
  const data = event.data;
  const _id = data._id;
  delete data._id;
  try {
    // 遍历修改数据库信息
    await db.collection(collectionName).where({
      _id: _id
    }).update({
      data: {
        ...data
      },
    })
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
