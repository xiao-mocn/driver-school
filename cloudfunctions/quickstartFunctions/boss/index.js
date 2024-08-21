const coach = require('./coaches/index')
const student = require('./students/index')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('manage ===', event);
  switch (event.moduleType) {
    case 'coach':
      return await coach.main(event, context);
    case 'student':
      return await student.main(event, context);
  }
};