const { client, sender } = require('./mailtrap');

let WelcomeEmail = async (email, name) => {
  let recipients  = [{ email }];
  try {
    let res = await client.send({
      from: sender,
      to: recipients ,
      template_uuid: 'cc1dd10d-abb6-4b70-b49c-811720ae05a6',
      template_variables: {
        name: name,
      },
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
module.exports = WelcomeEmail;
