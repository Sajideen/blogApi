module.exports = (app) => {
  const blogs = require("../controllers/blog.controllers");

  // Create a new Note
  app.post("/blogs", blogs.create);

  // Retrieve all blogs
  app.get("/blogs", blogs.findAll);

  // Retrieve a single Note with blogId
  app.get("/blogs/:blogId", blogs.findOne);

  // Update a Note with blogId
  app.put("/blogs/:blogId", blogs.update);

  // Delete a Note with blogId
  app.delete("/blogs/:blogId", blogs.delete);
  // Delete a Note with blogId
  app.post("/uploadImage", blogs.uploadImage);
};
