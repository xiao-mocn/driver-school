const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const collectionName = event.collectionName;
    const docId = event._id;
    const res = await db.collection(collectionName).doc(docId).get();
    if (res.data) {
      return {
        success: true,
        data: res.data
      };
    } else {
      return {
        success: true,
        data: {}
      };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};