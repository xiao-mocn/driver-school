const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  try {
    const limit = event.limit || 999; // 默认限制返回10条数据，如果没有传入limit参数
    const coachesResp = await db.collection('coaches').limit(limit).get();
    const  bannerResp = await db.collection('banners').get();
    return {
      success: true,
      data: {
        coachList: coachesResp.data || [],
        bannerList: bannerResp.data || []
      }
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e.errMsg
    };
  }
};
