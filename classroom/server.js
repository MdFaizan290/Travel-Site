const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const { convertProcessSignalToExitCode } = require("util");

const sessionOption = {secret:"mysecret", resave:false, saveUninitialized:true}
app.use(session(sessionOption));
app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.get("/register",(req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully!")
    // res.send(name);
    res.redirect("/hello");
});

app.get("/hello",(req,res) => {
    // res.send(`hello, ${req.session.name}`);
    // console.log(req.flash("success"));
    res.locals.message = req.flash("success");
    res.render("page.ejs",{name:req.session.name});
})

console.log(process.env.NODE_ENV);


// app.get("/reqcount",(req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     // console.log(req.sessionID);
//     // req.session.count = 1;
//     res.send(`You sent a request ${req.session.count} times`);
// })

// app.get("/session",(req,res) => {
//     res.send("Session Running");
// })

app.listen(3000,() => {
    console.log("Server Listening on port 3000....");
})