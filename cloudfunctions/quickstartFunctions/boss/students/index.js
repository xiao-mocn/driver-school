const add = require('./add')
const update = require('./update')
const queryList = require('./queryList')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.functionType) {
    case 'add':
      return await add.main(event, context);
    case 'update':
      return await update.main(event, context);
    case 'queryList':
      return await queryList.main(event, context);
  }
};