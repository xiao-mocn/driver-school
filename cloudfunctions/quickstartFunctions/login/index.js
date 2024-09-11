const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  const { collectionName, username, password, wxInfo, registerType } = event;
  const wxContext = cloud.getWXContext();
  try {
    // 遍历修改数据库信息
    const resp = await db.collection(collectionName).where({
      idCard: username
    }).get()
    const info = resp.data[0];
    const _id = info._id;
    delete info._id;
    if (!info.password) {
      // 如果初次登录，则密码与账号一样，都是身份证号
      if (password !== username) {
        return {
          success: false,
          errMsg: '密码错误'
        }
      }
    } else {
      if (password !== info.password) {
        return {
          success: false,
          errMsg: '密码错误'
        }
      }
    }
    await db.collection(collectionName).where({
      _id: _id
    }).update({
      data: {
        ...info,
        password,
        registerType,
        avatarUrl: wxInfo.avatarUrl,
        nickName: wxInfo.nickName,
        province: wxInfo.province,
        city: wxInfo.city,
        country: wxInfo.country,
        openId: wxContext.OPENID
      }
    })
    return {
      success: true,
      data: {
        ...info,
        _id,
        password,
        registerType,
        avatarUrl: wxInfo.avatarUrl,
        nickName: wxInfo.nickName,
        province: wxInfo.province,
        city: wxInfo.city,
        country: wxInfo.country,
        openId: wxContext.OPENID
      }
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};
