const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//Mongo DB Connection
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

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

//Home Route
app.get("/", (req, res) => {
    // res.render("listings/home.ejs");
    res.send("Home Page");
})


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// //cookies 
// app.get("/getcookie",(req,res) => {
//     res.cookie("name","wanderlust");
//     res.send("Cookie Sent");
// })


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})

// app.get("/demouser",async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     })
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);

// })



//listings routes
app.use("/listings", listingRouter);
//review routes
app.use("/listings/:id/reviews", reviewRouter);
//user routes
app.use("/",userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

//Error Handling MiddleWare
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server Is Running At Port 8080...");
})
