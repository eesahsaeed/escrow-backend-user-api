
const Api = require('claudia-api-builder');
const api = new Api();

const register = require('./handlers/register-user');
const update = require("./handlers/update-user");

api.post("/users/register", (request) => {
  return register(request);
});

api.post("/users/update-user", (request) => {
  return update(request);
});

module.exports = api;
