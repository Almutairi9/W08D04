const postModel = require("../../db/models/post");
const commentsModel = require("../../db/models/comment");
const likeModle = require("./../../db/models/like");

//Done
const createPosts = (req, res) => {
  if (!req.token.deleted) {
    const { pic, description } = req.body;

    const newPost = new postModel({
      pic,
      description,
      user: req.token.id,
    });

    newPost
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted .." });
  }
};
//Done
const getOnePosts = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params; //Post id 
// console.log(req.token.id);
    postModel
      .findOne({ _id: id, user: req.token.id, deleted: false })
      .then(async (result) => {
        if (result) {
          const commnet = await commentsModel.find({ post:id , deleted: false })
          const like = await likeModle.find({ post:id , deleted: false })
          //  console.log(commnet);
          if (commnet.length > 0 ){
            res.status(200).json({result, commnet ,like });
          }
          else{
          // console.log("mmmm");
          res.status(200).json({result });
          }
        } else {
          res
            .status(404)
            .json({ message: `post is deleted ${id}` });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted .. " });
  }
};

const getAllPosts = (req, res) => {
  if (!req.token.deleted) {
    postModel
      .find({ user: req.token.id, deleted: false })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: "there is no add tasks !" });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted .." });
  }
};

const getDeletedPosts = (req, res) => {
  if (!req.token.deleted) {
    postModel
      .find({ user: req.token.id, deleted: true })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: "There is no deleted tasks !" });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted" });
  }
};

const deletePosts = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params;

    postModel
      .findOneAndUpdate(
        { _id: id, user: req.token.id, deleted: false },
        { deleted: true },
        { new: true }
      )
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: `there is no task with ID: ${id}` });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted" });
  }
};

const updatePosts = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params;
    const { pic, description } = req.body;

    postModel
      .findOneAndUpdate(
        { _id: id, user: req.token.id, deleted: false }, // filters
        { pic: pic , description: description },
        { new: true }
      )
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: `there is no task with ID: ${id}` });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted" });
  }
};

const newLike = (req, res) => {
  const { id } = req.params; // post id 
  try {
    likeModle
      .findOneAndDelete({
        $and: [{ post: id }, { user: req.token.id }],
      })
      .then((result) => {
        if (result) {
          res.status(200).json("unliked successfuly");
        } else {
          const newLike = new likeModle({
            post: id,
            user: req.token.id,
          });

          newLike
            .save()
            .then((result) => {
              res.status(201).json(result);
            })
            .catch((err) => {
              res.status(404).json(err);
            });
        }
      });
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = {
  createPosts,
  getOnePosts,
  deletePosts,
  updatePosts,
  getDeletedPosts,
  getAllPosts,
  newLike, 
};