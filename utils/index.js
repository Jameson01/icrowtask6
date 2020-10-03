const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: "65af4fe7fbe3843d04d7d1cc2334b5fd-us17",
  server: "us17",
});

async function sendMail(subscribingUser) {
  try {
    const listId = "7e7cbc438f";

    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    return response;
  } catch (e) {
    return e.response ? e.response.body : e;
  }
}

function checkAttr(data) {
  const fileList = {
    country: {
      require: true,
      type: 'string'
    },
    firstName: {
      require: true,
      type: 'string'
    },
    lastName: {
      require: true,
      type: 'string'
    },
    email: {
      require: true,
      type: 'string',
      regExp: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    },
    password: {
      require: true,
      type: 'string',
      func: data => typeOf(data.password, 'string') && data.password.length >=8 && data.password === data.rePassword
    },
    address: {
      type: 'string'
    },
    city: {
      require: true,
      type: 'string'
    },
    stateInfo: {
      require: true,
      type: 'string'
    },
    postCode: {
      require: true,
      type: 'string'
    },
    mobilePhone: {
      require: true,
      type: 'string'
    },
  };

  return Object.entries(fileList).every(item => {
    if (!item[1].require) return true;
    if(item[1].regExp) {
      const reg = new RegExp(item[1].regExp);
      return reg.test(data[item[0]])
    } else if(item[1].func) {
      return item[1].func(data);
    } else {
      return typeOf(data[item[0]], item[1].type)
    }
  })
}

function typeOf(data, type) {
  return (typeof data) === type
}

module.exports = {
  checkAttr,
  sendMail
}
