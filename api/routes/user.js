const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const checkAuth = require('../middleware/check-auth');
const Blog = require('../models/blog');

const UserController = require('../controllers/user');

router.get('/search', UserController.searchBlog);

// show each blog for user
router.get('/userDisplayBlog/:slug', UserController.userEachBlogRender);

// home page
router.get('/homePage', UserController.homePageRender);

module.exports = router;