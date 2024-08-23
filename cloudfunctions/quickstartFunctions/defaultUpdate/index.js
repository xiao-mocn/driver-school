const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const  { _id, collectionName, data } = event
    delete data._id;
    await db.collection(collectionName).doc(_id).update({
      data,
    });
    return {
      success: true,
      data: data
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};