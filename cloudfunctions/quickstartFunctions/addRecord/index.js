const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  const collectionName = event.collectionName;
  console.log('collectionName ===', collectionName);
  const data = event.data;
  console.log('data ===', data);
  try {
    // 先查询是否存在相同的 IDCard
    const checkResult = await db.collection(collectionName).where({
      idCard: data.idCard
    }).get();
    console.log('checkResult ===', checkResult);
    if (checkResult.data.length > 0) {
      // 如果存在相同的 IDCard，返回不能重复添加的提示
      return {
        success: false,
        message: '身份证号Z已存在，不能重复添加'
      };
    }
    await db.collection(collectionName).add({
      // data 字段表示需新增的 JSON 数据
      data: { ...data }
    });
    return {
      success: true,
      message: '新增成功'
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: false,
      message: '新增失败'
    };
  }
};
