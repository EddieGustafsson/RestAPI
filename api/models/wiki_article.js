const mongoose = require('mongoose');

const wikiArticleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    wiki_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Wiki', required: true},
    created_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accepted_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: true},
    date: {type: Date, required: true},
    hidden: {type: Boolean, default: false},
    locked: {type: Boolean, defualt: false},
    source: {type: String, required: true}
});

module.exports = mongoose.model('WikiArticle', wikiArticleSchema);