const express = require("express");
const {
    createComments,
    getOneComments,
    deleteComments,
    updateComments,
    getDeletedComments,
    getAllComments,
    delComments,
} = require("./../controller/comments");
const authentication = require("../Middelware/Authentication");
const authorization = require("./../Middelware/authorization");

const commentsRouter = express.Router();

commentsRouter.post("/comments/:id", authentication, createComments); 
commentsRouter.get("/comments", authentication, getAllComments);
commentsRouter.get("/deletedComments", authentication, getDeletedComments);
commentsRouter.get("/comments/:id", authentication, getOneComments);  
commentsRouter.put("/comments/:id", authentication, updateComments); 
commentsRouter.delete("/comments/:id", authentication, deleteComments);

// Admin .....
commentsRouter.delete("/delcomments/:id", authentication, authorization, delComments);
module.exports = commentsRouter;