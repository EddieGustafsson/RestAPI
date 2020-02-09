
# RestAPI
## Introduction
This is a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) API based on [TP](https://github.com/Shrimpis/TP)'s web services, which is a backend for a wiki, blogg and calender. 
To see the current documentation for this API then see the [wiki](https://github.com/EddieGustafsson/RestAPI/wiki), please remember that this API still is under development, therefore some documentation and functions are missing or deprecated.

## Installation
### 1. MongoDB Cluster
This API uses a mongoDB cluster, therefore you need to create your own mongoDB localy or use a [mongoDB atlas cluster](https://www.mongodb.com/download-center).

### 2. Nodemon.json
In order to test this RestAPI you have to create a nodemon.json file in the root directory with the following contents:

```json
{
    "env":{
        "MONGO_ATLAS_PWD": "YOUR PASSWORD"
    }
}
```

### 3. Start the API
In order to start he API type this in a command line:
```npm start```
