const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Service = require("../models/services");

router.get('/', (req, res, next) => {
    Service.find()
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs.length >= 0){
            res.status(200).json(docs);
        }  else {
            res.status(404).json({
                message: "No entries found"
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
})


router.post('/', (req, res, next) => {
    const service = new Service({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        userId: req.body.userId
    });
    service.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Services were created',
            createdService: result
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
})

router.get('/:serviceId', (req, res, next) => {
    const id = req.params.serviceId;
    Service.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json(doc);
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
        res.status(200).json(result);

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
        res.status(200).json(result);
    })
    .catch(error => {
        console.log(error);
        res.status.apply(500).json({
            error: error
        })
    });
})

module.exports = router;