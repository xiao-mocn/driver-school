const login = require('./login/index');
const home = require('./home/index');
const manager = require('./boss/index');
const order = require('./order/index');
const deleteRecord = require('./deleteRecord/index');
const editPassWord = require('./editPassWord/index');
const selectRecord = require('./selectRecord/index');
const defaultQueryList = require('./defaultQueryList/index');

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log('start ===== ', event);
  switch (event.type) {
    case 'login':
      return await login.main(event, context);
    case 'home':
      return await home.main(event, context);
    case 'manager':
      return await manager.main(event, context);
    case 'deleteRecord':
      return await deleteRecord.main(event, context);
    case 'editPassWord':
      return await editPassWord.main(event, context);
    case 'order':
      return await order.main(event, context);
    case 'selectRecord':
      return await selectRecord.main(event, context);
    case 'defaultQueryList':
      return await defaultQueryList.main(event, context);
  }
};

