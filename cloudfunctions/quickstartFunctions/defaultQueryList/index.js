const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('event ===', event)
    const { data, collectionName } = event;
    const whereCondition = {} // 初始化筛选条件
    if (data.name) {
      whereCondition.name = db.RegExp({ regexp: '.*' + data.name + '.*', options: 'i' })
    }
    if (data.coachName) {
      whereCondition.coachName = db.RegExp({ regexp: '.*' + data.coachName + '.*', options: 'i' })
    }
    if (data.studentName) {
      whereCondition.studentName = db.RegExp({ regexp: '.*' + data.studentName + '.*', options: 'i' })
    }
    const limit = data.limit || 999; // 默认限制返回10条数据，如果没有传入limit参数
    const queryResp = await db.collection(collectionName).where({
      ...data,
      ...whereCondition
    }).limit(limit).get();
    console.log('queryResp ===', queryResp)
    return {
      success: true,
      data: queryResp.data || []
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      errMsg: e.errMsg
    }
  }
};
