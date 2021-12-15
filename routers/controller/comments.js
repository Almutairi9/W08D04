const commentsModel = require("../../db/models/comment");
const postModel = require("../../db/models/post");
const roleModel = require("./../../db/models/role");

//Done 
const createComments = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params; // post id 
    const { comment } = req.body;

    const newComment = new commentsModel({
      comment,
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
    const { id } = req.params; // comment id user: req.token.id,
 
    commentsModel
      .findOne({ _id: id, deleted: false })
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
    const { id } = req.params; // comment id ..
  
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

const delComments = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params; // comment id ..
  
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
// const deleteComments = async (req, res) => {
//   const { _id } = req.body;
//   const reqUserId = req.token.id; //user
//   const userId = req.token.role;
//   const Result = await roleModel.findById(userId); //admin -- Result.role =="adimn"
//   const Result2 = await commentsModel.findById(_id).populate("post"); //post owner -- Result2.onPost.postedBy
//   const Result3 = await commentsModel.findById(_id); // comment owner
//   if (
//     Result.role == "adimn" ||
//     Result2.post.user == reqUserId ||
//     Result3.by == reqUserId
//   ) {
//     commentsModel.deleteOne({ _id }, function (err, result) {
//       if (err) return handleError(err);
//       if (result.deletedCount !== 0) {
//         return res.status(200).json("deleted");
//       } else {
//         return res.status(404).json("not found");
//       }
//     });
//   } else {
//     return res.status(403).json({ message: "forbidden" });
//   }
// };
//Done 
const updateComments = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params;
    const { comment } = req.body;

    commentsModel
      .findOneAndUpdate(
        { _id: id, user: req.token.id, deleted: false }, // filters
        { comment: comment },
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
  delComments,
}; 