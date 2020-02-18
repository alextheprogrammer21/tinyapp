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
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.get('/fetch', (req, res) => {
  res.send(`a = ${a}`);
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  res.send("Ok");
})
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
}

module.exports = {urlDatabase};