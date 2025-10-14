const Listing = require('../models/listing.model.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../ExpressError.js');
const Review = require('../models/review.model.js');
//Review Routes:
//Create the review:

const addReview = wrapAsync(async (req, res) => {

    const { id } = req.params;

    let listing = await Listing.findById(id);

    //console.log(listing);

    //console.log(req.body);

    let review = new Review(req.body.reviews);
    review.author = req.user._id;
    //console.log("author:", review.author._id);
    // console.log(req.body.reviews);

    //console.log(review);

    listing.reviews.push(review);

    await listing.save();
    await review.save();

    req.flash('scsmsg', 'New review added..');

    res.redirect(`/listing/${id}`);

});

//Delete the review:
const deleteReview = wrapAsync(async (req, res) => {

    let { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash('scsmsg', 'review deleted!');

    res.redirect(`/listing/${id}`);

})

module.exports = {
    addReview,
    deleteReview,
};