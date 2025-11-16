const Listing = require("../models/listing.model");
const { listingSchema } = require('../listingSchema.js');
const { reviewSchema } = require('../listingSchema.js');
const Review = require("../models/review.model.js");
const ExpressError = require("../ExpressError.js");

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
    console.log(process.env.SECRET);
}


module.exports = isLoggedIn = (req, res, next) => {
   // console.log(req.path + " " + req.originalUrl);
    if (!req.isAuthenticated()) {

        //After user logged in it will redirect to the page which user wanted to visit:
        req.session.redirectTo = req.originalUrl;

        //console.log("redirect to: " + req.session.redirectTo);

        req.flash('err', 'You must be signed-in first!');
        res.redirect('/login');

    } else {
        next();
    }
}

module.exports.saveUrl = (req, res, next) => {

    if (req.session.redirectTo) {
        //console.log("saved url: " + req.session.redirectTo);

        res.locals.redirectTo = req.session.redirectTo;
        console.log("Redirect to: " + res.locals.redirectTo);
    }

    next();
};

module.exports.isAuthor = async (req, res, next) => {

    const { id } = req.params;

    const list = await Listing.findById(id);
    console.log(list);

    if (!list.owner.equals(res.locals.currentUser._id)) {
        req.flash('err', 'You do not have permission to do that!');
        return res.redirect(`/listing/${id}`);
    }

    next();

}

//Listing Schema Validation middleware:
module.exports.validationSchema = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        next(new ExpressError(400, msg));
    } else {
        next();
    }
    console.log(error)
}


//Review Schema Validation middleware:
module.exports.reviewvalidationSchema = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body.data);

    console.log("data", req.body.data);
    // console.log(error);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        next(new ExpressError(400, msg));
    } else {
        next();
    }

}

module.exports.isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash('err', 'You do not have permission to delete the review!');
        return res.redirect(`/listing/${id}`);
    }

    next();

};

