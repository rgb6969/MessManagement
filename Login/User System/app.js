
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');    // to authenticate
const LocalStrategy = require('passport-local');  // to authenticate
const User = require('./models/user');
const { Router } = require('express');



mongoose.connect('mongodb://localhost:27017/mess_management', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// const sessionConfig = {
//     secret: 'thisshouldbeabettersecret!',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }

// app.use(session(sessionConfig))
// app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());   // to store the user in some way
passport.deserializeUser(User.deserializeUser());  // to store the user in alternate way

// app.use((req, res, next) => {
//     console.log(req.session)
//     res.locals.currentUser = req.user; //to have that user then flash it
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })





app.get('/', (req, res) => {
    res.render('landing');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post("/login",passport.authenticate("local",{
    successRedirect:"/user",
    failureRedirect:"/login"
}),function(req,res){

});
app.get('/register',(req,res)=>{
    res.render('register');
})
app.post('/register',function(req,res){
    User.register(new User({username:req.body.username,email: req.body.email,name: req.body.name,contact:req.body.contact}),req.body.password,function(err,user){
        if(err){
        return res.send(err);
    }
        passport.authenticate("local")(req,res,function(){
            res.redirect('/user');
        });
    });
})
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})
app.get('/user',(req,res)=>{
    res.render('user');
})
app.get('/passwordforget_checkemail',(req,res)=>{
    res.render('passwordforget_checkemail');
})
app.get('/passwordforget_enterOTP',(req,res)=>{
    res.render('passwordforget_enterOTP');
})
app.get('/passwordforget_resetpassword',(req,res)=>{
    res.render('passwordforget_resetpassword');
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})
