const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../auth/check-auth');

const Service = require("../models/services");

router.get('/', checkAuth,(req, res, next) => {
    Service.find()
    .select('_id name type userId')
    .populate('wiki')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            services: docs.map(doc => {
                return{
                    name: doc.name,
                    userId: doc.userId,
                    _id: doc._id,
                    type: doc.type,
                    request: {
                        type: 'GET',
                        url: 'http://localhost/services/' + doc._id
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


router.post('/', (req, res, next) => {
    const service = new Service({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type,
        userId: req.body.userId
    });
    service.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Services were created',
            createdService: {
                name: result.name,
                userId: result.userId,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost/services/" + result._id
                }
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

router.get('/:serviceId', (req, res, next) => {
    const id = req.params.serviceId;
    Service.findById(id)
    .select('name _id userId type')
    .populate('wiki')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json({
                service: doc,
                request:{
                    type: 'GET',
                    description: 'Get all services',
                    url: 'http://localhost/services'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            });
        }
        res.status(200).json(doc);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

router.patch("/:serviceId", (req, res, next) => {
    const id = req.params.serviceId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Service.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Service updated',
            request: {
                type: 'GET',
                url: 'http://localhost/services/' + id
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

router.delete('/:serviceId', (req, res, next) => {
    const id = req.params.serviceId;
    Service.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Service delted',
            request: {
                type: 'POST',
                url: 'http://localhost/services',
                body: {name: 'String', userId: 'Number', type: 'String'}
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status.apply(500).json({
            error: error
        })
    });
})

module.exports = router;