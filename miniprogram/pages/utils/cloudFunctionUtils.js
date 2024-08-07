// utils/cloudFunctionUtils.js
import { envId } from "../const/index"
/**
 * 调用云函数的通用方法
 * @param {string} functionName - 云函数的名称
 * @param {object} data - 传递给云函数的参数
 * @param {string} envId - 环境ID
 * @returns {Promise} - 返回一个Promise对象
 */
function callCloudFunction(functionName, data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: functionName,
      config: {
        env: envId
      },
      data: data,
      success: res => {
        console.log(`云函数${functionName}调用成功`, res);
        if (res.result.success) {
          resolve(res.result.data);
        } else {
          reject(res.result.errMsg);
        }
      },
      fail: error => {
        console.error(`云函数${functionName}调用失败`, error);
        reject(error);
      }
    })
  })
}

export default callCloudFunction;