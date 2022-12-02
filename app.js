
const Api = require('claudia-api-builder');
const register = require('./handlers/register-user');
const api = new Api()

api.post("/users/register", (request) => {
  return register(request);
});

api.post("/users/second-register", (request) => {
  return update(request);
});

module.exports = api;
