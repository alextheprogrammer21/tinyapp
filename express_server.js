const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const users = {
  "userID": {
    id:"userID",
    email: "testhaxers@example.com",
    password: "blue123"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const IDbyEmail = {};

const registeredEmails = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");



//******************* GETS  *******************************/
app.get('/', (req, res) => {
  res.redirect('/register');
});


///GET /URLS
app.get("/urls/new", (req, res) => {

  let idkey = req.cookies["userid"];
  if (users[idkey]) {

    let templateVars = { username: users[idkey] };
    res.render("urls_new", templateVars);

  } else {
      res.redirect('/login');
  }
});

app.get('/urls.json', (req,res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let idkey = req.cookies["userid"];
  let templateVars = { urls: urlDatabase, username: users[idkey], idkey: idkey };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  shortURL = req.params.shortURL;
  let idkey = req.cookies["userid"];
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL].longURL, username: users[idkey] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const website = urlDatabase[req.params.shortURL].longURL;
  res.status(301).redirect(urlDatabase[req.params.shortURL].longURL);
});


//GET /REGISTERS AND LOGINS
app.get('/register', (req, res) => {
  let idkey = req.cookies["userid"];
  let templateVars = { username: users[idkey] };
  res.render("register",templateVars);
});

app.get('/login', (req, res) => {
  let idkey = req.cookies["userid"];
  let templateVars = { username: users[idkey] };
  res.render("login",templateVars);
})
//******************* POSTS  *******************************/
//POST URLS
app.post('/urls/:shortURL/update', (req,res) => {
  let idkey = req.cookies["userid"];
  
  if (users[idkey]) {
  urlDatabase[req.params.shortURL.longURL] = req.body.longURL;
  }
  res.redirect('/urls');
});

app.post('/urls', (req, res) => {
  let idkey = req.cookies["userid"];
  shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body['longURL'], userID: idkey };
  res.redirect(`/urls/${shortURL}`);
  res.send("Ok");
});

app.post('/urls/:shortURL/delete', (req,res) => {
  let idkey = req.cookies["userid"];
  
  if (users[idkey]) {
  delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});


//POST LOGINS AND REGISTERS
app.post('/register', (req, res) => {
  
  if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send('Error 400: email and password cannot be empty');
  }

  if (registeredEmails[req.body.email]) {
    res.status(400);
    res.send("Error 400: this email already exists");
  }
  id = generateRandomString(); users[id] = {}; user = users[id]; user.id = id; registeredEmails[req.body.email] = true; IDbyEmail[req.body.email] = id;
  user.email = req.body.email; user.password = req.body.password;
  res.cookie('userid', id);
  res.redirect('/urls');
});

app.post('/logout', (req,res) => {
  res.clearCookie('userid');
  res.redirect('/urls');
});

app.post('/login', (req,res) => {
  if (registeredEmails[req.body.email] && IDbyEmail[req.body.email]) {
    res.cookie('userid', id);
    res.redirect('/urls');
  }
  res.send("403: Incorrect email or password");
});


//LISTEN
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});


//MISC FUNCTIONS
function generateRandomString() {
  return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).slice(0,6);
}