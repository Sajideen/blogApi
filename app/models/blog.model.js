const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: String,
    subtitle: String,
    content: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
