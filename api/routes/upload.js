const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Upload = require('../models/upload');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
    // reject a file¨
    if(file.MimeType === 'image/jpeg' || file.MimeType === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/', upload.single('profileImage'),(req, res, next) => {
    console.log(req.file);
    const upload = new Upload({
        //name: req.file.filename, TODO:Fix this error:"Cannot read property 'filename' of undefined"
        //image: req.file.path
    });
    upload
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Image uploaded!'
        });
    })
    .catch(error => {
        console.log(error);
            res.status(500).json({
            error: error
        });
    });
});



module.exports = router;