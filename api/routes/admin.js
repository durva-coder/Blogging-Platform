const express = require('express');
const router = express.Router();
// const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const Blog = require('../models/blog');

const AdminController = require('../controllers/admin');


// admin login
router.post('/login', AdminController.adminLogin);

// admin logout
router.get('/logout', checkAuth, AdminController.adminLogout);


// creating blogs by admin
router.post('/addBlog', checkAuth, AdminController.blogsCreateBlog);


// adding a category by admin
router.post('/addCategory', checkAuth, AdminController.categoryCreateCategory);


// login web page
router.get('/adminLogin' , AdminController.loginPageRender);

// admin dashboard web page
router.get('/dashboard',  checkAuth, AdminController.dashboardPageRender);

// showing all blogs in a web page
router.get('/all-blogs',  checkAuth,AdminController.allBlogsInDashBoardPageRender);

// showing all blogs in table format in web page
router.get('/show-all-blogs', checkAuth, AdminController.blogTabularRender);

// showing all categories in table format in web page
router.get('/show-all-categories', checkAuth, AdminController.categoryTabularRender);

// category form web page
router.get('/categoryForm', checkAuth, AdminController.addCategoryFormRender);

// blog form web page
router.get('/blogForm', checkAuth, AdminController.addBlogFormRender);

// delete blog
router.delete('/deleteBlog/:_id', checkAuth, AdminController.deleteBlog);

// update blog 
router.post('/updateBlog/:_id', checkAuth, AdminController.updateBlog);

// show update blogs
router.get('/displayBlogForm/:_id', checkAuth, AdminController.updateBlogFormRender);

// show each blog
router.get('/displayBlog/:slug', checkAuth, AdminController.eachBlogPageRender);


// update category 
router.put('/updateCategory/:_id', checkAuth, AdminController.updateCategory);

// show categories
router.get('/displayCategoryForm/:_id', checkAuth, AdminController.updateCategoryFormRender);

// delete category
router.delete('/deleteCategory/:_id', checkAuth, AdminController.deleteCategory);

// restoring category
router.put('/restoringCategory/:_id', checkAuth, AdminController.restoreCategory);


// router.post('/signup', AdminController.admin_signup);

module.exports = router;