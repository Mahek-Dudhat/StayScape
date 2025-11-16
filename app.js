if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const listingsRouter = require('./routes/listing.route.js');
const reviewsRouter = require('./routes/review.route.js');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./ExpressError.js');
// const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user.model.js');
const userRouter = require('./routes/user.route.js');
const MongoStore = require('connect-mongo');

//Built-in middlewares:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser('secretcode'));

let store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600 //in seconds
});

store.on("error", (err) => {
    console.log("session store error", err);
})

let sessionOptions = {
    store,
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions),()=>{
    console.log("session created!");
});

//Note: Must add given below line before you are creating or defining different types of routes:
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//Given below defines that we are using local strategy for authentication:
passport.use(new LocalStrategy(User.authenticate()));

//When user is authenticated then we are storing the user in the session:
passport.serializeUser(User.serializeUser());

//When user is loged out then given below line will remove the memory of that particular user from the session:
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/js')));

atlas_url = process.env.ATLAS_URL;

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ATLAS_URL:', process.env.ATLAS_URL);
console.log('ATLAS_URL is undefined?', process.env.ATLAS_URL === undefined);

async function main() {
    await mongoose.connect(atlas_url);
}

main().then(res => console.log('Connection established..')).catch(err => console.error(err));

//Middleware for the new listing msg:
app.use((req, res, next) => {
    console.log(req.user);
   // console.log(process.env.SECRET);
    res.locals.currentUser = req.user;

    // console.log("id:", res.locals.currentUser?._id);
    console.log('middleware executed!');
    //  console.log(req.flash('scsmsg'));
    //  console.log(req.flash('err'));
    res.locals.scsmsg = req.flash('scsmsg');
    res.locals.err = req.flash('err');
    next();
})

//Important note: Remenber if you are creating a separate routes in the routes folder then you must use app.use() method in the main js file:
//For listing:
app.use('/listing', listingsRouter);

//For reviews:
app.use('/listing/:id/reviews', reviewsRouter);

//For user Sign-up:
app.use('/', userRouter);

//Create a session id automatically and stored in the client browser as a cookie:
app.get('/test', (req, res) => {
    res.send('test is implemented!');
})

//Count the request of how many times client/user send the request to the server:
app.get('/testcount', (req, res) => {

    if (req.session.count) {
        req.session.count++;
    } else { req.session.count = 1; }

    res.send(`req sent ${req.session.count} times!`);
})

app.get('/demouser', async (req, res) => {
    const demoUser = new User({
        email: "mahek25@yahoo.com",
        username: "mahek"
    })

    const registredUser = await User.register(demoUser, 'df43nnf');

    res.status(200).json(registredUser);
})

app.get('/register', (req, res) => {

    const { name = 'anonymous' } = req.query;

    req.session.name = name;
    //  console.log(req.session.name);
    if (req.session.name == 'anonymous') {
        req.flash('error', 'User have not registred yet!');
    } else {
        req.flash('success', 'User Registerd successfully..');
        // req.flash('msg', 'hello! msg..');
    }
    res.redirect('/heloroute');
})

app.get('/heloroute', (req, res) => {

    //  res.end(`Hello, ${req.session.name} count: ${req.session.count}`);
    //  console.log(req.flash('success'));

    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    // console.log(res.locals);
    res.render('./listings/hello.ejs', { name: req.session.name });

})

// app.get('/getcookies', (req, res) => {
//    // res.cookie('greet', 'Welcome');
//     //res.cookie('name', "mahek");
//     //console.log(res.cookie);
//     res.end('Cookie is set!');
// })

//Signed Cookies:
// app.get('/getsignedcookie', (req, res) => {

//     res.cookie('username', "krish", { signed: true });

//     res.end('Signed cookie sent..');

// })

// app.get('/verify', (req, res) => {
//     console.log(req.signedCookies);
//     res.end('verified!');
// })

// app.get('/', (req, res) => {
//     // console.log(req.cookies);
//     // const { greet, name } = req.cookies;

//     // res.end(`<h1>${greet}, ${name}</h1>`)
//     res.end('home root');
// })

//If user searched for wrong page:
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

//Error handling middleware:
app.use((err, req, res, next) => {

    const { status = 500, message = "Something went wrong!" } = err;
    console.log(err);
    console.log("error handling middleware executed..");
    res.status(status).render('./listings/error.ejs', { err });
    //res.status(status).send(message);
    //res.end('Oops, something went wrong!');
    // next(err);
})

app.listen(5173, () => {
    console.log("server is listining on http://localhost:5173/listing");
})