const express = require('express');
const { addReview, deleteReview } = require('../controllers/reviews.controller');
const reviewsRouter = express.Router({ mergeParams: true });
const isLoggedIn = require('../middleware/middleware.js');
const { reviewvalidationSchema, isReviewAuthor } = require('../middleware/middleware.js');

//Review Routes:
//Create a new review:
reviewsRouter.post('/', reviewvalidationSchema, addReview);

//Delete the existing review:
reviewsRouter.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview);

module.exports = reviewsRouter;
