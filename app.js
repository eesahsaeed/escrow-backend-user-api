
const Api = require('claudia-api-builder');
const api = new Api();

const register = require('./handlers/register-user');
const update = require("./handlers/update-user");
const login = require("./handlers/login");
const allUsers = require("./handlers/allUsers");
const verifyToken = require("./handlers/verifyToken");
const forgotPassword = require("./handlers/forgotPassword");
const changePassword = require("./handlers/changePassword");

api.post("/users/register", (request) => {
  return register(request);
});

api.post("/users/update-user", (request) => {
  return update(request);
});

api.post("/users/login", (request) => {
  return login(request);
});

api.get("/users/all-users", (request) => {
  return allUsers(request);
});

api.post("/users/forgot-password", (request) => {
  return forgotPassword(request);
});

api.post("/users/verify-token", (request) => {
  return verifyToken(request);
});

api.post("/users/change-password", (request) => {
  return changePassword(request);
});

module.exports = api;
