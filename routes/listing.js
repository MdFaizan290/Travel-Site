const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))  //Index Route
    .post(isLoggedIn,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))  //Create Route

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))   //Show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))   //Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))   //Delete Route



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "Near The Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("Sample Was Saved");
//     res.send("Succesful Testing");
// })

module.exports = router;