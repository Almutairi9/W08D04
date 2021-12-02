const likeModle = require("./../../db/models/like");

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
  newLike,
};





























// const createLike = (req, res) => {
//   if (!req.token.deleted) {
//     const { like } = req.body;

//     if(like){ // like
//     const newLike = new likeModle({
//         post:id,
//         user: req.token.id,
//       });
//     newLike
//       .save()
//       .then((result) => {
//         res.status(201).json(result);
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } else {
//     res.status(200).json({ message: " like successfuly .." });
//   }
// }else { // dislike
//     likeModle
//     .findOneAndDelete({
//       $and: [{ postId: id }, { userId: req.addedToken.id }],
//     })
//     .then((result) => {
//         if (result) {
//           res.status(400).send("unliked successfuly");
//         }
// }

// };
// }

// module.exports = {
//     createLike,
//   };
