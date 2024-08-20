const coachHome = require('./coach/index')
const studentHome = require('./student/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.loginType) {
    case 'coach':
      return await coachHome.main(event, context);
    case 'student':
      return await studentHome.main(event, context);
  }
};