const cloud = require('wx-server-sdk');
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext();
    console.log(OPENID)
    console.log(event.data)
    console.log(event.templateId)
    //发送消息
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: 'index',
      data: event.data,
      templateId: event.templateId,
    })
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};