const mongoose = require('mongoose');
const Review = require('./review.model');
const { required } = require('joi');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: Object,
        default: "https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg",
        set: (v) =>
            v == "" ? "https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg" : v,

    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    geomatry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

listingSchema.post('findOneAndDelete', async function (list) {

    console.log('post middleware!');

    console.log(list);

    if (list.reviews.length) {
        await Review.deleteMany({ _id: { $in: list.reviews } });
    }

})

const Listing = new mongoose.model('Listing', listingSchema);

module.exports = Listing;