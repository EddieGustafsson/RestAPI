const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
    image: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Upload', uploadSchema);