const express = require('express');
const app = express();
const Listing = require('../models/listing.model.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../ExpressError.js');
const passport = require('passport');
const { geocode } = require('../utils/geocode.js');


//middleware for the req.flash method:
// const checkNewList = (req, res, next) => {

//     if (req.flash('success')) {
//         res.locals.success = req.flash('success');
//         next();
//     }
// }

const getListing = wrapAsync(async (req, res, next) => {

    const listings = await Listing.find({});

    if (!listings) {
        next(new ExpressError(400, "List not found!"));
    }

    //console.log(listings);
    res.render('./listings/listing.ejs', { listings });

})

const getOneList = wrapAsync(async (req, res, next) => {
    // console.log("Method is excuted..");

    const { id } = req.params;
    const list = await Listing.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author',
        }
    }).populate('owner');

    if (!list) {
        // req.flash('errorMsg', 'The listing you are requesting does not exist');
        req.flash('err', 'The listing you are requesting does not exist');
        res.redirect('/listing');
        //next(new ExpressError(400, 'data not found!'));
    } else {
        //  console.log(list);
        res.render('./listings/show.ejs', { list })

    }

})

//create new list:
const createList = (req, res) => {

    // console.log(req.user);
    res.render('./listings/new.ejs');
}

//Add new list:
const addList = wrapAsync(async (req, res, next) => {

    const { location, country } = req.body.listing;
    console.log(location + ", " + country);

    // const fullAddress = `${location}, ${country}`;
    // const coordinates = await geocode(fullAddress);

    //const { latitude, longitude } = coordinates || {};
    // console.log("Coordinates: ", coordinates);
    // console.log(req.file.path + ".." + req.file.filename);

    const newList = req.body.listing;
    //console.log(req.user);
    newList.owner = req.user._id;
    newList.image = { url: req.file.path, filename: req.file.filename };
   // newList.geomatry = { type: 'Point', coordinates: [latitude, longitude] };
    //console.log(newList);

    if (!newList) {
        next(new ExpressError(400, "list can't be inserted.."));
    }

    await Listing.insertOne(newList);
    // console.log(newList);

    req.flash('scsmsg', 'New listing is created!');

    res.redirect('/listing');

});

//Edit the list:
const editList = wrapAsync(async (req, res, next) => {

    // console.log('success!');
    const { id } = req.params;
    let list = await Listing.findById(id);
    // res.redirect('./listings/edit.ejs', { list });
    if (!list) {

        req.flash('err', 'The listing you are requesting does not exist');
        res.redirect('/listing');
    } else {
        list.image.url = list.image.url.replace('/upload', '/upload/r_20:20:20:20,w_500,h_400,c_fill,g_auto/');
        res.status(200).render('./listings/edit.ejs', { list });
    }

})

//Update the list:
const updateList = wrapAsync(async (req, res) => {

    const { id } = req.params;

    const editedList = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if (req.file) {
        editedList.image = { url: req.file.path, filename: req.file.filename };
    }
    console.log(editedList);

    if (!editedList) {

        next(new ExpressError(400, "list can't be update.."));
    }
    await editedList.save();
    req.flash('scsmsg', 'List updated...');

    res.redirect(`/listing/${id}`);

})

//Delete the list:
const deleteList = wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash('scsmsg', 'list deleted..');

    res.redirect('/listing');
})


module.exports = {
    getListing,
    getOneList,
    createList,
    addList,
    editList,
    updateList,
    deleteList,

}