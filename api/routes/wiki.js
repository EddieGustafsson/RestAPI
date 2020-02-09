const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Wiki = require('../models/wiki');
const Service = require('../models/services');

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
                            url: 'http://localhost/wiki/' + doc._id
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
                    url: 'http://localhost/wiki/' + result._id
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
                url: "http://localhost/wikis"
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:error
        });
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
                url: "http://localhost/wikis",
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

module.exports = router;