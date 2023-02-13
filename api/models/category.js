const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: {type: String, required: true},
    isDeleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Category', categorySchema);