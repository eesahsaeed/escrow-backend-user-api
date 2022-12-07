
const Api = require('claudia-api-builder');
const api = new Api();

const register = require('./handlers/register-user');
const update = require("./handlers/update-user");
const login = require("./handlers/login");

api.post("/users/register", (request) => {
  return register(request);
});

api.post("/users/update-user", (request) => {
  return update(request);
});

api.post("/users/login", (request) => {
  return login(request);
});

module.exports = api;
