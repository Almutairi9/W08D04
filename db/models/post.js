const mongoose = require("mongoose");

const post = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    pic: {
      type: String,
      require: true,
      default:
        "https://thumbs.dreamstime.com/b/female-user-avatar-profile-picture-icon-isolated-vector-illustration-flat-design-people-character-white-background-woman-146472409.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", post);
