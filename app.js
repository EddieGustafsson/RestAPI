const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const wikiRoutes = require('./api/routes/wiki')
const serviceRoutes = require('./api/routes/services');
const uploadRoutes = require('./api/routes/upload');
const userRoutes = require('./api/routes/user');

mongoose.connect(
    "mongodb+srv://"+ process.env.MONGO_ATLAS_USERNAME +":" +
      process.env.MONGO_ATLAS_PWD +
      "@cluster0-fb0ts.gcp.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
  );

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Acces-Controll-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        if(req.method === "OPTIONS"){
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
            return res.status(200).json({});
        }
        next();
});

//Routes which should handle requests
app.use('/v1/wiki', wikiRoutes);
app.use('/v1/services', serviceRoutes);
app.use('/v1/upload', uploadRoutes);
app.use('/v1/user', userRoutes);

//Handles errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;