const { sender, client } = require('./mailtrap');
require('dotenv').config();
let sendEmail = async (email, code, name) => {
  let recipients  = [{ email }];
  try {
    let res = await client.send({
      from: sender,
      to: recipients ,
      template_uuid: '69e31ef1-b00f-4f14-bda6-840b23962a38',
      template_variables: {
        name: name,
        zip_code: code,
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
