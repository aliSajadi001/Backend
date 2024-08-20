const { client, sender } = require('./mailtrap');

let resetPassword = async (email, port, token) => {
  console.log(email, port, token);
  let recipients  = [{ email }];
  try {
    let res = await client.send({
      from: sender,
      to: recipients ,
      template_uuid: "61194d9d-e3d2-4b2c-92cf-0764691221c2",
      template_variables: {
        "company_info_website_url":     `http://localhost:${port}/reset-password/${token}`
      }
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

module.exports = resetPassword;

