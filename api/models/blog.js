const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, index: true},
    slug: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category"},
    description: {type: String, required: true},
    publishDate: {type: Date, required: true},
    blogImage: {type: String, required: true}
});

module.exports = mongoose.model('Blog', blogSchema);