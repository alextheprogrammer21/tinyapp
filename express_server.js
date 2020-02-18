const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello");
});

app.get('/urls.json', (req,res) => {
  res.json(urlDatabase);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get('/hello', (req,res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get('/set', (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/urls/:shortURL", (req, res) => {
  shortURL = req.params.shortURL;
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL] };
  res.render("urls_show", templateVars);

});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get('/fetch', (req, res) => {
  res.send(`a = ${a}`);
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  console.log(req.body['longURL']);
  shortURL = generateRandomString();
urlDatabase[shortURL] = req.body['longURL'];
res.redirect(`/urls/${shortURL}`);
res.send("Ok");
});

app.post('/urls/:shortURL/update', (req,res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req,res) => {
  console.log(req.params);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


app.listen(PORT, () => {
console.log("Listening on port", PORT);
});

function generateRandomString() {
  let randomString = '';
  randomString += Math.round(Math.random()*10);
  randomString += Math.round(Math.random()*10);
  randomString += Math.round(Math.random()*10);
  randomString += Math.round(Math.random()*10);
  randomString += Math.round(Math.random()*10);
  randomString += Math.round(Math.random()*10);

  return randomString;
}

module.exports = {urlDatabase};