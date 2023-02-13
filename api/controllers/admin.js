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

const Admin = require('../models/admin');
const Blog = require('../models/blog');
const Category = require('../models/category');
const { json } = require('body-parser');


// restoring category
exports.restoreCategory = async (req, res, next) => {
    try {
        let _id = req.params._id;
        console.log(_id);
        await Category.findOneAndUpdate({ _id: _id }, {isDeleted: false});
        console.log("Restored");
        return res.status(200).json({
            message: 'Restored'
        })
    } catch (error) {
        console.log(error);
    }
}

// login page
exports.loginPageRender = (req, res, next) => {
    console.log("render page");
    res.render('loginSignup', { message: '', err: null });
}

// admin dashboard page
exports.dashboardPageRender = (req, res, next) => {
    console.log("dashboard render page");
    Blog.find()
        .select('name publishDate description blogImage slug')
        .populate('category')
        .exec()
        .then(docs => {
        res.status(200).render('dashboard', {blogs: docs});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.render('dashboard');
}

// view each blog 
exports.eachBlogPageRender = async (req, res, next) => {
    console.log("each blog render page");
    let slug = req.params.slug;
    console.log(slug);
    const blogs = await Blog.findOne({slug: slug}).populate('category');
    console.log(blogs);
    res.status(200).render('eachBlog',{ blogs:blogs, slug: slug });

}

// all blogs in admin dashboard
exports.allBlogsInDashBoardPageRender = (req, res, next) => {
    console.log("all blog page render");
    res.render('partials/allBlogs');
}

// show all blogs in tabular format
exports.blogTabularRender = (req, res, next) => {
    console.log("blogs in tabular format");
    Blog.find()
        .select('name category description publishDate blogImage')
        .populate('category')
        .exec()
        .then(docs => {
            console.log(docs);
        //   const response = {
        //     count: docs.length,
        //     blogs: docs.map(doc => {
        //         return {
        //             name: doc.name,
        //             category: doc.category,
        //             description: doc.description,
        //         }
        //     })
        //   };
        //   res.render('homePage', { blogs: response });
        //   res.status(200).json(response);  
        res.render('blogTabular', {blogs: docs});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.render('blogTabular');
}

// show all categories in tabular format
exports.categoryTabularRender = (req, res, next) => {
    console.log("categories in tabular format");
    Category.find()
        .exec()
        .then(docs => {
        //   const response = {
        //     count: docs.length,
        //     categories: docs.map(doc => {
        //         return {
        //             category: doc.category,
        //         }
        //     })
        //   };
        //   res.status(200).json(response);  
        // console.log(docs);
          res.render('categoryTabular', {categories: docs});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.render('categoryTabular', {categories: categories});
}

// add category form
exports.addCategoryFormRender = (req, res, next) => {
    console.log("Add category form");
    res.render('addCategory', { message: '', err: null });
}

// add blog form
exports.addBlogFormRender = (req, res, next) => {
    console.log("Add Blog Form");
    Category.find({isDeleted: false})
        .exec()
        .then(docs => {
          res.render('addBlog',{categories: docs, message: '', err: null});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.render('addBlog', { message: '', err: null });
}

// deleting a blog
exports.deleteBlog = async (req, res, next) =>{
    try {
        let _id = req.params._id;
        console.log(_id);
        await Blog.findOneAndDelete({ _id: _id });
        console.log("Deleted");
        return res.status(200).json({
            message: 'Deleted'
        })
    } catch (error) {
        console.log(error);
    }
}

// update a category concept
exports.updateCategory = async (req, res, next) =>{
    try {
        let _id = req.params._id;
        const data = req.body;
        console.log(data);
        let categories = await Category.findOneAndUpdate( {_id: _id}, { category: req.body.category });
        console.log("Update Category Form");
        return res.status(200).json({
            message: 'Updated',
            data: categories
        })
       
        // res.render('categoryTabular', {categories:categories});
    } catch (error) {
        console.log(error);
    }
   
}

// update category form
exports.updateCategoryFormRender = async (req, res, next) => {
    let _id = req.params._id
    console.log(_id);
    const categories =await Category.findById(_id);
    console.log(categories.category);
    res.render('updateCategory', {categories:categories,  message: ' ', err: null});
}

// delete a category concept
exports.deleteCategory = async (req, res, next) =>{
    try {
        let _id = req.params._id;
        console.log(_id);
        await Category.findOneAndUpdate({ _id: _id }, {isDeleted: true});
        console.log("Deleted");
        return res.status(200).json({
            message: 'Deleted'
        })
    } catch (error) {
        console.log(error);
    }
}

// update a blog concept
exports.updateBlog = async (req, res, next) =>{
    try {
        let _id = req.params._id;
        const data = req.body;
        console.log("requested data",data);

        console.log("Update Blog Form");
        const file = req?.files?.blogImage;

        const updateParams = {
            name:req.body.name, 
            category:req.body.category, 
            description:req.body.description, 
            publishDate: req.body.publishDate,  
            slug: slug(req.body.name,'-')
        }

        if(file){
        cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
            console.log(err);
            console.log("url",result);
            updateParams.blogImage = result.url;
            let blogs = await Blog.findOneAndUpdate( {_id: _id}, updateParams);
           
            return res.status(200).redirect(`/admin/displayBlogForm/${_id}`)
        });
        }
        else{
            let blogs = await Blog.findOneAndUpdate( {_id: _id}, updateParams);
            return res.status(200).redirect(`/admin/displayBlogForm/${_id}`)
        }
            // res.render('categoryTabular', {categories:categories});
        } catch (error) {
            console.log(error);
        }
        
   
}

// update blog form
exports.updateBlogFormRender = async (req, res, next) => {
    let _id = req.params._id
    console.log(_id);
    const blogs = await Blog.findById(_id);
    console.log(blogs);
    Category.find({isDeleted: false}).exec().then(docs => {
        console.log(docs);
        res.status(200).render('updateBlog',{err:null ,categories:docs, blogs:blogs});
    })
    // res.render('updateBlog', {blogs: blogs});
}

// login concept
exports.adminLogin = (req, res, next) => {

    Admin.find({email: req.body.email})
        .exec()
        .then(admin => {
            if(admin.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
 
                if(!result) {
                    console.log('wrong auth cred');
                    console.log(err);

                    return res.render('loginSignup', { message: 'Error in login credentials', err: 'Wrong credentials' })

                    // return res.status(401).json({
                    //     message: 'Auth failed'
                    // });
                } else {
                    const token = jwt.sign({
                        email: admin[0].email,
                        adminId: admin[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                  );
                  res.cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                  })
                  
                  return res.redirect('/admin/dashboard');
                    // return res.status(200).json({
                    //     message: 'Auth successful',
                    //     token: token
                    // });
                }
                // res.cookie("access_token", token, {
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV === "production",
                //   })
                //   .status(200).json({ 
                //         message: "Logged in successfully"
                //   });
                // res.status(401).json({
                //     message: 'Auth failed'
                // });
            });
        })
        .catch( err => {
            console.log(err);
        //     res.status(500).json({
        //     error: err
        // });
        return res.render('loginSignup', { message: 'Error in login credentials', err: err })
    });
}

// logout concept
exports.adminLogout = (req, res, next) => {
    return res.clearCookie("access_token")
        .status(200)
        .redirect('/admin/adminLogin')
        // .json({
        //     message: "Successfully logged out"
        // });
}

// adding blog concept
exports.blogsCreateBlog = (req, res, next) => {
    console.log("requested data ",req.body.publishDate);
    console.log(req.files.blogImage);
    const file = req.files.blogImage;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(err);
        console.log("url",result);
        const blog = new Blog({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            slug: slug(req.body.name,'-'),
            category: req.body.category,
            description: req.body.description,
            publishDate: req.body.publishDate,
            blogImage: result.url
        });
        blog
            .save()
            .then(result => {
                console.log(result);
                // res.status(201).json({
                //     message: 'Created blog successfully',
                //     createdBlog: {
                //         name: result.name,
                //         slug: result.slug,
                //         category: result.category,
                //         description: result.description,
                //         publishDate: result.publishDate,
                //         _id: result._id,
                //     }
                // });
                // res.status(200).json({
                //     message: 'Blog added successfully',
                // })
                Category.find({}).exec().then(docs => {
                        console.log(docs);
                        res.status(200).render('addBlog',{categories:docs, message: 'Blog added successfully', err: ''});
                     
                })
                // res.redirect('/admin/addBlog')
                // res.redirect('/admin/show-all-blogs');
                // res.render('addBlog', { message: 'Blog added successfully', err: ''})
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
                return res.render('addBlog', { message: 'Error in adding blog', err: err })
            });
    });
}

// adding category concept
exports.categoryCreateCategory = (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        category: req.body.category
    });
    category
        .save()
        .then(result => {
            console.log(result);
            // res.status(201).json({
            //     message: 'Created category successfully',
            //     createdCategory : {
            //         category: result.category,
            //         _id: result._id,
            //     }
            // });
            // res.redirect('/admin/show-all-categories');
            res.render('addCategory', { message: 'Category added successfully', err: ''})
        })
        .catch(err => {
            console.log(err);
            // res.status(500).json({
            //     error: err
            // });

            return res.render('addCategory', { message: 'Error in adding category', err: err })
        });
}

// sinup concept
// exports.admin_signup = (req, res, next) => {
//         Admin.find({email: req.body.email})
//             .exec()
//             .then(admin => {
//                 if(admin.length >= 1){
//                     return res.status(409).json({
//                         message: 'Mail exists'
//                     });
//                 } else {
//                     bcrypt.hash(req.body.password, 10, (err, hash) => {
//                         if(err) {
//                             return res.status(500).json({
//                                 error: err
//                             });
//                         } else{
//                             const admin = new Admin({
//                                 _id: new mongoose.Types.ObjectId(),
//                                 email: req.body.email,
//                                 password: hash
//                             });
//                             admin
//                                 .save()
//                                 .then(result => {
//                                     console.log(result);
//                                     res.status(201).json({
//                                         message: 'Admin created'
//                                     });
//                                 })
//                                 .catch(err => {
//                                     console.log(err);
//                                     res.status(500).json({
//                                         error: err
//                                 });
//                             })
//                         }
//                     });
//                 }
//             })
    
//     }