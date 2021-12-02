const express = require("express");

const { createRole, roles } = require("./../controller/role");
const authentication = require("./../Middelware/Authentication");
const authorization = require("./../Middelware/authorization");

const roleRouter = express.Router();

roleRouter.post("/createrole", authentication, authorization, createRole);
roleRouter.get("/roles", authentication, authorization, roles);

module.exports = roleRouter;
