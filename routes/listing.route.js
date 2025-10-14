const express = require('express');
const multer = require('multer')
const { storage } = require('../cloudeConfig.js');
const upload = multer({ storage });

const { getListing, getOneList, createList, addList, editList, updateList, deleteList } = require('../controllers/listing.controller.js');

const router = express.Router();
const isLoggedIn = require('../middleware/middleware.js');
const { isAuthor, validationSchema } = require('../middleware/middleware.js');

//router.route() method is used to create chainable route handlers for a route path.
//The path for the route is specified as the first argument to the router.route() method, and subsequent HTTP methods (like .get(), .post(), etc.) can be chained to define handlers for those methods on that path.
router.route('/')
    .get(getListing)
    .post(validationSchema, upload.single('listing[image][url]'), addList);


//Create a new list:
//Add this route before the given below route which is for specific listing details:
router.get('/new', isLoggedIn, createList);

router.route('/:id')
    //get specific listing details:
    .get(getOneList)
    //update existing list:
    .put(isLoggedIn, isAuthor, upload.single('listing[image][url]'), updateList)

    //delete the specific list:
    .delete(isLoggedIn, isAuthor, deleteList);


//Edit the existing list:
router.get('/:id/edit', isLoggedIn, isAuthor, editList);

module.exports = router;

