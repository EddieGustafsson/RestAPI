const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Wiki = require('../models/wiki');
const Service = require('../models/services');
const WikiArticle = require('../models/wiki_article');
const WikiArticleHistory = require('../models/wiki_article_history');

/* Wiki specific requests */

router.get('/', (req, res, next) => {
    Wiki.find()
        .select('service private _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                wiki: docs.map(doc => {
                    return {
                        _id: doc._id,
                        wiki: doc.wiki,
                        private: doc.private,
                        request:{
                            type: 'GET',
                            url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/' + doc._id
                        }

                    }
                }),
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        });
});

router.get("/:wikiId", (req, res, next) => {
    Wiki.findById(req.params.wikiId)
    .exec()
    .then(wiki => {
        if(!wiki){
            return res.status(404).json({
                message: "Wiki not found"
            });
        }

        res.status(200).json({
            wiki: wiki,
            request: {
                type: "GET",
                url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:error
        });
    });
});

router.post('/', (req, res, next) => {
    Service.findById(req.body.serviceId)
        .then(wikis => {
            if(!Service){
                return res.status(404).json({
                    message: "Service not found"
                });
            }
            const wiki = new Wiki({
                _id: mongoose.Types.ObjectId(),
                private: req.body.private,
                service: req.body.serviceId
            });
            return wiki.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Wiki created',
                createdWiki:{
                    _id: result._id,
                    wiki: result.wiki,
                    private: result.private
                },
                request: {
                    type: 'GET',
                    url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/' + result._id
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error            
            })
        });
});

router.delete("/:wikiId", (req, res, next) => {
    Wiki.remove({_id: req.params.wikiId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Wiki deleted",
            request: {
                type: "POST",
                url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki',
                body: {serviceId: "Id", type: "String", userId:"Number"}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:error
        });
    });
});

/* Wiki articles specific requests */

router.get("/articles/:wikiId", (req, res, next) => {
    WikiArticle.find({wiki_id: req.params.wikiId})
    .select()
    .populate('wiki')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            articles: docs.map(doc => {
                return{
                    _id: doc._id,
                    created_user_id: doc.created_user_id,
                    accepted_user_id: doc.accepted_user_id,
                    title: doc.title,
                    date: doc.date,
                    hidden: doc.hidden,
                    locked: doc.locked,
                    source: doc.source,
                    tags: doc.tags,
                    request: {
                        type: 'GET',
                        url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

router.get("/article/:articleId", (req, res, next) => {
    WikiArticle.find({_id: req.params.articleId})
    .select()
    .populate('wiki')
    .exec()
    .then(docs => {
        const response = {
            article: docs.map(doc => {
                return{
                    _id: doc._id,
                    created_user_id: doc.created_user_id,
                    accepted_user_id: doc.accepted_user_id,
                    title: doc.title,
                    date: doc.date,
                    hidden: doc.hidden,
                    locked: doc.locked,
                    source: doc.source,
                    tags: doc.tags,
                    request: {
                        message: 'Retrive all articles from one wiki',
                        type: 'GET',
                        url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/articles/' + doc.wiki_id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

router.get("/article/:articleId/history/", (req, res, next) =>{
    WikiArticleHistory.find({article_id: req.params.articleId})
    .select()
    .populate('WikiArticleHistory')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            history: docs.map(doc => {
                return{
                    _id: doc._id,
                    article_id: doc.article_id,
                    created_user_id: doc.created_user_id,
                    title: doc.title,
                    date: doc.date,
                    request: {
                        type: 'GET',
                        url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article/history/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

router.get("/article/history/:historyId/", (req, res, next) => {
    WikiArticleHistory.find({_id: req.params.historyId})
    .select()
    .populate('WikiArticleHistory')
    .exec()
    .then(docs => {
        const response = {
            history: docs.map(doc => {
                return{
                    _id: doc._id,
                    article_id: doc.article_id,
                    created_user_id: doc.created_user_id,
                    title: doc.title,
                    date: doc.date,
                    source: doc.source,
                    request: {
                        type: 'GET',
                        url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article/'+ doc.article_id +'/history/'
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

router.post('/article', (req, res, next) => {
    Wiki.findById(req.body.wikiId)
        .then(articles => {
            if(!Wiki){
                return res.status(404).json({
                    message: "Wiki not found"
                });
            }
            const article = new WikiArticle({
                _id: mongoose.Types.ObjectId(),
                wiki_id: req.body.wikiId,
                created_user_id: req.body.createdUserId,
                accepted_user_id: req.body.acceptedUserId,
                title: req.body.title,
                date: req.body.date,
                hidden: req.body.hidden,
                locked: req.body.locked,
                source: req.body.source,
                tags: req.body.tags
            });
            return article.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Article created',
                createdArticle:{
                    _id: result._id,
                    wiki_id: result.wikiId,
                    created_user_id: result.createdUserId,
                    accepted_user_id: result.acceptedUserId,
                    title: result.title,
                    date: result.date,
                    hidden: result.hidden,
                    locked: result.locked,
                    source: result.source,
                    tags: result.tags
                },
                request: {
                    type: 'GET',
                    url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article/' + result._id
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error            
            })
        });
});

router.post('/article/history', (req, res, next) => {
    WikiArticle.findById(req.body.articleId)
        .then(articles => {
            if(!WikiArticle){
                return res.status(404).json({
                    message: "Article not found"
                });
            }
            const articleHistory = new WikiArticleHistory({
                _id: mongoose.Types.ObjectId(),
                article_id: req.body.articleId,
                created_user_id: req.body.createdUserId,
                title: req.body.title,
                date: req.body.date,
                source: req.body.source
            });
            return articleHistory.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Article history created',
                createdArticleHistory:{
                    _id: result._id,
                    article_id: result.articleId,
                    created_user_id: result.createdUserId,
                    title: result.title,
                    date: result.date,
                    source: result.source
                },
                request: {
                    type: 'GET',
                    url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article/' + req.body.articleId + '/history/'
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error            
            })
        });
});

router.patch("/article/:articleId", (req, res, next) => {
    const id = req.params.articleId;
    WikiArticle.updateMany({_id: id}, {$set: req.body})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Article updated',
            request: {
                type: 'GET',
                url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article/' + id
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

router.delete("/article/:articleId", (req, res, next) => {
    WikiArticle.remove({_id: req.params.articleId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Article deleted",
            request: {
                message: 'Create a new article',
                type: "POST",
                url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article',
                body: {wikiId: "Id", createdUserId: "Number", acceptedUserId:"Number", title: "String", date: "Date", source: "String"}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
});

router.delete("/article/history/:historyId/", (req, res, next) => {
    WikiArticleHistory.remove({_id:req.params.historyId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "History item deleted",
            request: {
                message: "Create a new history item",
                type: "POST",
                url: 'http://'+ process.env.HOST + ":" + process.env.PORT +'/v1/wiki/article/history',
                body: {
                    articleId: "Id",
                    createdUserId: "Id",
                    title: "String",
                    date: "Date",
                    source: "String"
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
});

module.exports = router;