// 云函数入口文件
const cloud = require('wx-server-sdk');
const tencentcloud = require("tencentcloud-sdk-nodejs");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const { phoneNumber, templateId, templateParams } = event; // 从前端传入的参数

  const SmsClient = tencentcloud.sms.v20210111.Client;

  const clientConfig = {
    credential: {
      secretId: "你的SecretId",
      secretKey: "你的SecretKey",
    },
    region: "ap-guangzhou",
    profile: {
      httpProfile: {
        endpoint: "sms.tencentcloudapi.com",
      },
    },
  };

  const client = new SmsClient(clientConfig);

  const params = {
    PhoneNumberSet: [`+86${phoneNumber}`],
    SmsSdkAppId: "你的SmsSdkAppId",
    SignName: "你的短信签名",
    TemplateId: templateId,
    TemplateParamSet: templateParams,
  };

  try {
    const data = await client.SendSms(params);
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
