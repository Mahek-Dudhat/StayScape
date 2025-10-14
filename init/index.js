const mongoose = require('mongoose');
const Listing = require('../models/listing.model.js');
const listingData = require('./data.js');
const { geocode } = require('../utils/geocode.js');

mongodb_url = "mongodb+srv://mahekdudhat:mahek123@cluster0.a0avsub.mongodb.net/airbnbclone?retryWrites=true&w=majority";

async function main() {
    await mongoose.connect(mongodb_url);
}

main().then(res => console.log('Connection succesfully made..')).catch(err => console.error(err));

const initListing = async () => {

    // await Listing.deleteMany({});
     
    let fullAddress;
    let coordinates;
    listingData.data = await listingData.data.map(async (doc) => {
        //   console.log(doc.location, doc.country);
        fullAddress = `${doc.location}, ${doc.country}`;
        coordinates = await geocode(fullAddress);
        console.log(coordinates);

        const { latitude, longitude } = coordinates || {};
        doc.geomatry = { type: 'Point', coordinates: [latitude, longitude] };
        return {
            ...doc,
            owner: "68d69d898af835a7a5044a94",
            geomatry: { type: 'Point', coordinates: [latitude, longitude] }
        }
    });

    console.log(listingData.data);
    listingData.data = await Promise.all(listingData.data);
    console.log("After: ", listingData.data);

   await Listing.insertMany(listingData.data).then((res) => {
        console.log("Data initializied!");
    }).catch((err) => {
        console.error(err.message);
    })

}

initListing();