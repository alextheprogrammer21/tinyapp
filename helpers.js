const getUserByEmail = function(email, database, IDbyEmail) {
  if (IDbyEmail[email]) {
  let user = IDbyEmail[email];
  console.log(IDbyEmail);
  return user;
  }
  return undefined;
};

function generateRandomString() {
  return (Math.random().toString(36).substring(2, 15)).slice(0,6);
};

module.exports = { getUserByEmail, generateRandomString };