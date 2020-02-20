const { assert } = require('chai');

const { getUserByEmail, generateRandomString} = require('../helpers.js');

const testUsers = {
  "userRandomID" : {
    id: "userRandomID",
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const IDbyEmails = {
  "user@example.com": "userRandomID",
  "user2@example.com": "user2RandomID"
}

describe('getUsersByEmail', function() {

  it('should return a user with a valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers, IDbyEmails) 
    const expectedOutput = "userRandomID"

    assert(user, expectedOutput);
  });

  it('should return a user with a valid email', function() {
    const user = getUserByEmail("notexistent@example.com", testUsers, IDbyEmails) 
    const expectedOutput = "undefined"

    assert.isUndefined(user, 'undefined');
  });

});