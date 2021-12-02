const commentsModel = require("../../db/models/comment");
const postModel = require("../../db/models/post");

//Done 
const createComments = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params; // post id 
    const { description } = req.body;

    const newComment = new commentsModel({
      description,
      user: req.token.id,
      post : id, 
    });

    newComment
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
const getOneComments = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params; // comment id 

    commentsModel
      .findOne({ _id: id, user: req.token.id, deleted: false })
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res
            .status(404)
            .json({ message: `there is no todo with the ID: ${id}` });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted .. " });
  }
};

const getAllComments = (req, res) => {
  if (!req.token.deleted) {
    commentsModel
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

const getDeletedComments = (req, res) => {
  if (!req.token.deleted) {
    commentsModel
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

const deleteComments = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params;

    commentsModel
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

const updateComments = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params;
    const { pic, description } = req.body;

    commentsModel
      .findOneAndUpdate(
        { _id: id, user: req.token.id, deleted: false }, // filters
        { pic: pic, description: description },
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

module.exports = {
  createComments,
  getOneComments,
  deleteComments,
  updateComments,
  getDeletedComments,
  getAllComments,
};