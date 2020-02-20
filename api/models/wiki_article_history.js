const mongoose = require('mongoose');

const wikiArticleHistorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    article_id:{type: mongoose.Schema.Types.ObjectId, ref: 'WikiArticle', required: true},
    created_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: true},
    date: {type: Date, required: true},
    source: {type: String, required: true}
});

module.exports = mongoose.model('WikiArticleHistory', wikiArticleHistorySchema);