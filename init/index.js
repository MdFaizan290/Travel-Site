const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("Connected To DB");
    }).catch(err => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(mongoUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"6a0ebb82b33fc8f97173c9f9"}));
    await Listing.insertMany(initData.data);
    console.log("Data Was Intialized ")
}

initDB();