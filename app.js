const express = require("express");
const bodyParser = require("body-parser");
var Session = require("express-session");
const https = require("https");
const path = require('path');
var { OAuth2Client } = require("google-auth-library");
const keys = require("./oauth2.keys.json");

const Student = require("./modules/student");
const workerRoute = require("./router");
const { checkAttr, sendMail } = require("./utils");
require("./utils/mongo");

const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

const app = express();
app.use(
  Session({
    secret: "654321secret123456",
    resave: false,
    saveUninitialized: false,
  })
);

app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "/public")));

app.use("/workers", workerRoute);


app.get("/", async (req, res) => {
  if (req.session.isLogin) {
    res.redirect('/detail')
  } else {
    var url = getAuthurl();
    res.render("login.html", {
      url,
    });
  }
});

app.post('/login',  (async (req, res) => {
  const body = req.body;
  console.log(body, 'login');
  if (body.email) {
    const temp = await Student.find({email: body.email, password: body.password});
    console.log(temp);
    if (temp.length) {
      if (body.save === 'on') {
        res.session.isLogin = true;
      }
      res.redirect('/detail');
    }
  }
}))

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/register", (req, res) => {
  const temp = checkAttr(req.body);
  if (temp) {
    Student.create(req.body)
      .then(async () => {
        const isSend = await sendMail(req.body);
        console.log(isSend);
        if (isSend.id) {
          // res.sendFile(__dirname + "/success.html");
          res.redirect('/')
        } else {
          res.json(isSend);
        }
      })
      .catch((err) => {
        console.log(err, 121);
        res.json({
          status: 400,
          msg: "register error, plz check mongoDb",
        });
      });
  } else {
    res.json({
      status: 400,
      msg: "field not match, plz check",
    });
  }
});

app.get("/oauth2callback", async function (req, res) {
  try {
    var code = req.query.code;
    var session = req.session;
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);
    session.isLogin = true;
    session.token = r.tokens.access_token;
    res.redirect('/')
  } catch (e) {
    console.log(e)
    res.format({
      'text/html': () => res.end('Error: invalid_token! <a href="/">back</a>')
    })
  }

});

app.get("/detail", async function (req, res) {
  if (req.session.isLogin) {
    const list = await Student.find({}, 'country fname lname email address city stateInfo postCode mobilePhone');
    res.render("detail.html", {
      list,
    });
  } else {
    res.redirect('/')
  }
});

app.listen(process.env.PORT || 2020, (req, res) => {
  console.log("Server is running successfullly!");
});

function getAuthenticatedClient() {
  return new Promise(async (resolve, reject) => {

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/userinfo.profile",
    });

    resolve(authorizeUrl);
  });
}

function getAuthurl() {
  var url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile",
  });

  return url;
}
