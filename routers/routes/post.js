const express = require("express");
const {
  createPosts,
  getOnePosts,
  deletePosts,
  updatePosts,
  getDeletedPosts,
  getAllPosts,
  newLike, 
} = require("./../controller/post");
const authentication = require("../Middelware/Authentication");
const authorization = require("./../Middelware/authorization");

const postsRouter = express.Router();

postsRouter.post("/posts", authentication, createPosts);  
postsRouter.post("/Likeposts/:id", authentication, newLike);
postsRouter.get("/posts/:id", authentication, getOnePosts);  
postsRouter.put("/posts/:id", authentication, updatePosts); 
postsRouter.delete("/posts/:id", authentication, authorization, deletePosts);
postsRouter.get("/posts", authentication, getAllPosts);
postsRouter.get("/delete", authentication, getDeletedPosts);

module.exports = postsRouter;