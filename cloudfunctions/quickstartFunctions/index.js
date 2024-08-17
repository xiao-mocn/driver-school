const getOpenId = require('./getOpenId/index');
const getMiniProgramCode = require('./getMiniProgramCode/index');
const addRecord = require('./addRecord/index');
const selectRecord = require('./selectRecord/index');
const updateRecord = require('./updateRecord/index');
const sumRecord = require('./sumRecord/index');
const genMpQrcode = require('./genMpQrcode/index');
const deleteRecord = require('./deleteRecord/index');
const login = require('./login/index');
const editPassWord = require('./editPassWord/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context);
    case 'addRecord':
      return await addRecord.main(event, context);
    case 'selectRecord':
      return await selectRecord.main(event, context);
    case 'updateRecord':
      return await updateRecord.main(event, context);
    case 'sumRecord':
      return await sumRecord.main(event, context);
    case 'genMpQrcode':
      return await genMpQrcode.main(event, context);
    case 'deleteRecord':
      return await deleteRecord.main(event, context);
    case 'login':
      return await login.main(event, context);
    case 'editPassWord':
      return await editPassWord.main(event, context);
  }
};

