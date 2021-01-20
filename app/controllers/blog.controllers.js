const Blog = require("../models/blog.model.js");
const multer = require("multer");

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./upload/images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: Storage });

exports.uploadImage = (req, res) => {
  console.log(req.file);
  // upload(req, res, (err) => {
  //   if (err) {
  //     return res.end("Something went wrong!");
  //   }
  //   return res.end("File uploaded successfully");
  // });
};

// Create and Save a new Blog
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Blog content can not be empty",
    });
  }
  if (req.body.title.length < 3 || req.body.title.length > 30) {
    return res.status(400).send({
      message: "Blog title must have min length 3, max length 30",
    });
  }
  if (req.body.subtitle.length < 3 || req.body.subtitle.length > 40) {
    return res.status(400).send({
      message: "Blog sub title must have min length 3, max length 40",
    });
  }
  if (req.body.content.length < 50 || req.body.content.length > 1000) {
    return res.status(400).send({
      message: "Blog content must have min length 50, max length 1000",
    });
  }

  console.log("NEW BLOG ==>> ", req.body);
  // Create a Blog
  const blog = new Blog({
    title: req.body.title || "Untitled Blog",
    subtitle: req.body.subtitle,
    content: req.body.content,
  });

  // Save Blog in the database
  blog
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Blog.",
      });
    });
};

// Retrieve and return all Blogs from the database.
exports.findAll = (req, res) => {
  Blog.find()
    .then((blogs) => {
      res.send(blogs);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving blog.",
      });
    });
};

// Find a single Blog with a blogId
exports.findOne = (req, res) => {
  console.log("BLOG ID ==>> ", req.params.blogId);
  Blog.findById(req.params.blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      res.send(blog);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving blog with id " + req.params.blogId,
      });
    });
};

// Update a blog identified by the blogId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Blog content can not be empty",
    });
  }

  // Find blog and update it with the request body
  Blog.findByIdAndUpdate(
    req.params.blogId,
    {
      title: req.body.title || "Untitled Blog",
      subtitle: req.body.subtitle,
      content: req.body.content,
    },
    { new: true }
  )
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      res.send(blog);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      return res.status(500).send({
        message: "Error updating blog with id " + req.params.blogId,
      });
    });
};

// Delete a blog with the specified blogId in the request
exports.delete = (req, res) => {
  Blog.findByIdAndRemove(req.params.blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      res.send({ message: "Blog deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      return res.status(500).send({
        message: "Could not delete blog with id " + req.params.blogId,
      });
    });
};
