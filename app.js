const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const {getUserByEmail, generateRandomString} = require('./helpers');

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

let IDbyEmail = {};
let emailByPassword = {};
let registeredEmails = {};


//********************** MIDDLEWEAR   ********************/
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(methodOverride('_method'));


//******************* GETS  *******************************/
app.get('/', (req, res) => {
  res.redirect('/register');
});

///GET /URLS
app.get("/urls/new", (req, res) => {

  let idkey = req.session.userid;
  if (users[idkey]) {

    let templateVars = { username: users[idkey] };
    res.render("urls_new", templateVars);

  } else {
    res.redirect('/login');
  }
});

app.get("/urls", (req, res) => {
  let idkey = req.session.userid;
  let templateVars = { urls: urlDatabase, username: users[idkey], idkey: idkey };
  if (users[idkey]) {
    res.render("urls_index", templateVars);
  } else {
    let templateVars = { ErrorMessage: "Please login at /login to create urls", username: users[idkey] };
    res.render("Errors", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  shortURL = req.params.shortURL;
  let idkey = req.session.userid;
  if (urlDatabase[shortURL].userID == idkey) { 
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL].longURL, username: users[idkey] };
    res.render("urls_show", templateVars);
  } else {
    let templateVars = { ErrorMessage: "Please login at /login with the email that created this shortURL", username: users[idkey] };
    res.render("Errors", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const website = urlDatabase[req.params.shortURL].longURL;
  let prefix = 'http://';
  let url = urlDatabase[req.params.shortURL].longURL;
  if (url[0] == 'h' && url[1] == 't' && url[2] == 't' && url[3] =='p') {
    res.status(301).redirect(url);
  }
  res.status(301).redirect(prefix+url);
});


//GET /REGISTERS AND LOGINS
app.get('/register', (req, res) => {
  let idkey = req.session.userid;
  let templateVars = { username: users[idkey] };
  res.render("register",templateVars);
});

app.get('/login', (req, res) => {
  let idkey = req.session.userid;
  let templateVars = { username: users[idkey] };
  res.render("login",templateVars);
});
//******************* POSTS  *******************************/
//POST LOGINS AND REGISTERS
app.post('/register', (req, res) => {
  let idkey = req.session.userid;
  if (!req.body.email || !req.body.password) {
    res.status(400);
    let templateVars = { ErrorMessage: "Error 400: Email and password cannot be empty", username: users[idkey] };
    res.render("Errors", templateVars);
  }

  if (registeredEmails[req.body.email]) {
    let templateVars = { ErrorMessage: "Error 400: this email already exists", username: users[idkey] };
    res.render("Errors", templateVars);
  }
  
  id = generateRandomString(); users[id] = {}; user = users[id]; user.id = id; registeredEmails[req.body.email] = true; IDbyEmail[req.body.email] = id;
  let password = req.body.password; const hashedpassword = bcrypt.hashSync(password, 10);
  user.email = req.body.email; user.password = hashedpassword;
  emailByPassword[req.body.email] = hashedpassword;
  req.session.userid = id;
  res.redirect('/urls');
});

app.post('/logout', (req,res) => {
  req.session.userid = null;  
  res.redirect('/urls');
});

app.post('/login', (req,res) => {
  let idkey = req.session.userid;
  let email = req.body.email;
  let pass = req.body.password;
  let hashedpassword = emailByPassword[email];
  if (registeredEmails[email] && bcrypt.compareSync(pass, hashedpassword)) {
    req.session.userid = IDbyEmail[email];
    res.redirect('/urls');
  }
  let templateVars = { ErrorMessage: "Incorrect email or password", username: users[idkey] };
  res.render("Errors", templateVars);
});

//******************* PUTS  *******************************/

app.put('/urls', (req, res) => {
  let idkey = req.session.userid;
  shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body['longURL'], userID: idkey };
  res.redirect(`/urls/${shortURL}`);
  res.send("Ok");
});

app.put('/urls/:shortURL', (req,res) => {
  let idkey = req.session.userid;
  
  if (users[idkey]) {
    console.log(req.params);
    console.log(req.body.longURL);
    console.log(urlDatabase);
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }
  res.redirect('/urls');
});

//******************* DELETES  *******************************/

app.del('/urls/:shortURL', (req,res) => {
  let idkey = req.session.userid;
  
  if (users[idkey]) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});

//LISTEN
app.listen(process.env.PORT || 8080, 
	() => console.log("Server is running on port 8080"));
