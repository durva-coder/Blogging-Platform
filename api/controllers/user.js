const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const slug = require('slug');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dnouztkzs', 
    api_key: '248588959544136', 
    api_secret: 'SYCOkcfZwcDGj8BYSDN3b6-Tkxw' 
});


const Blog = require('../models/blog');
const Category = require('../models/category');
const { json } = require('body-parser');


// search bar concept
exports.searchBlog = async (req, res, next) => {
    console.log('search running');
    const { name } = req.query;
    console.log(name);
    const blogs = await Blog.find({name : {$regex : req.query.name}});
    console.log(blogs);
    res.render('homePage', { blogs });

}

// home page 
exports.homePageRender = (req, res, next) => {
    console.log("home page render");
    Blog.find()
        .select('_id name publishDate description blogImage slug')
        .populate('category')
        .exec()
        .then(docs => {
            // console.log(docs);
        res.status(200).render('homePage', {blogs: docs});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.render('homePage');
}


// user viewing each blog
exports.userEachBlogRender = async (req, res, next) => {
    console.log("User each blog render page");

    let slug = req.params.slug;
    console.log(slug);
    const blogs = await Blog.findOne({slug: slug}).populate('category');
    console.log(blogs);
    res.status(200).render('userEachBlog',{ blogs:blogs, slug: slug });

}