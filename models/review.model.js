const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Listing = require('../models/listing.model.js');

const reviewSchema = new Schema({

    comment: {
        type: String,
        trim: true,
        required: true,
    }
    ,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

reviewSchema.post('findOneAndDelete', async function (review) {
    console.log('Post middleware!');
    console.log(review);

    // if(review){
    //     await Listing.findByIdAndDelete(id,{reviews:{review}})
    // }

});

const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;
