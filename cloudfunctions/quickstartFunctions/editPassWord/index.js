const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  const { collectionName, oldPassword, newPassword, userId} = event;
  console.log('event ===', event);
  try {
    // 遍历修改数据库信息
    const resp = await db.collection(collectionName).where({
      _id: userId
    }).get()
    console.log('resp ===', resp);
    const userInfo = resp.data[0];
    if (!userInfo) {
      return {
        success: false,
        errMsg: '用户不存在'
      }
    }
    if (userInfo.password !== oldPassword) {
      return {
        success: false,
        errMsg: '旧密码错误'
      }
    }
    await db.collection(collectionName).doc(userId).update({
      data: {
        password: newPassword
      }
    })
    return {
      success: true
    }
  } catch (e) {
    console.log('e ===', e)
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};
