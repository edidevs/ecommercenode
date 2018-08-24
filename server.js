let express = require('express');
let app = express();

let router = express.Router();




let passport   = require('passport');
let session    = require('express-session');
let bodyParser = require('body-parser');
let env = require('dotenv').load();
let connectFlash = require("connect-flash");
require("req-flash");
let path = require("path");

let fileUpload = require("express-fileupload");

//ejs templating engine 
let ejs = require("ejs");

let expressValidator = require("express-validator");
router.use(expressValidator());

//sorry I decided to change the template engine n
// let exphbs = require('express-handlebars'); 

// //OAUTH Google 
// let GoogleOauth = require("passport-google-oauth").OAuth2Strategy; 

// passport.use(new GoogleOauth({

//     clientID : "955958553738-4igt6skqbhhc0sgb947f1vb9po3aoovl.apps.googleusercontent.com ",
//     clientSecret : "Ibn-ncT2QqOmklnyF9m2eCYY ",
//     callbackURL : "http://localhost:3000/auth/google/callback" 
   



// },  function(req, accessToken, refreshToken, profile, done){

//     done(null, profile);

// }));




app.use(express.static(__dirname + '/public'));


//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let test = require("./routes/users"); 

app.use("/users", test);

// For Passport
 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

//For handlebars 
app.set("views", "./views");
// app.engine("hbs", exphbs({
//     extname: '.hbs'
// }));

app.set("view engine", "ejs");

// app.get('/', function(req, res) {
 
//     res.send('Welcome to Passport with Sequelize');
 
// });

//models 
let models = require("./models");


// //get categories models so that they are available to header 
// models.category.findAll({limit:5}).then(function(categories){

//     app.locals.categories = categories; 

// }).catch(function(err){

//     if(err){

//         console.log(err);
//     }
// });

//get page models so that they are available to header 

models.page.findAll({}).then(function(pages){

    app.locals.pages = pages; 

}).catch(function(err){

    console.log(err);
});

models.category.findAll({}).then(function(categories){

    app.locals.categories = categories; 

}).catch(function(err){

    console.log(err);
});

models.product.findAll({}).then(function(products){

    app.locals.products = products; 

}).catch(function(err){

    console.log(err);
});

passport.serializeUser(function(user, done){

    done(null, user);
});


passport.deserializeUser(function(user, done){
    
    done(null, user);
});



// //get page models so that they are available to header 

// models.product.findAll({limit:5}).then(function(products){

//     app.locals.products = products; 

// }).catch(function(err){

//     console.log(err);
// });

//set FIleupload express middleware 
app.use(fileUpload());


//get all the page models 




//for express validator 
app.use(expressValidator({

    errorFormatter: function(param, msg, value){

        let namespace = param.split(".");
        let root = namespace.shift();
        let formParam = root; 

        while(namespace.length){
            formParam += "[" + namespace.shift() + "]";
        }

        return {

            param : formParam,
            msg : msg,
            value : value 
        };
    }
}));

//For express messages 
app.use(connectFlash());
app.use(function(req, res, next){

    res.locals.messages = require("express-messages")(req, res);
    next();
});

//Express Messages middleware 
// app.use(require("connect-flash"));
app.use(function(req, res, next){

    res.locals.messages = require("express-messages")(req, res);
    next();
});

//Import routes to server.js 
let authRoute = require("./routes/auth.js")(app, passport, models.page, models.category, models.product);
// let apiRoute = require("./app/routes/api.js")(app, passport, models.page, models.category, models.product);
// let auth = require("./app/routes/route");
//import passport js to server js 
require("./config/passport/passport.js")(passport, models.user);
// let cartRoute = require("./app/routes/cart.js")(app, passport, models.page, models.category, models.product);



app.get("*", function(req, res, next){

    res.locals.cart = req.session.cart; 
    next();

});

let auth = require("./routes/route"); 


// //oAuth google 
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(new GoogleStrategy({

    clientID:"908733208304-nffbrr36nudvqj1kl9k1du1akb0v159m.apps.googleusercontent.com",
    clientSecret: "kuunOHUhlo0HX1sKXUg-L3UY",
    callbackURL : "http://localhost:4000/auth/google/callback"

}, 
function(req, accessToken, refreshToken, profile, done){

    // User.findOrCreate({googleId: profile.id}, function(err, user){
    //     return cb(err, user);
    // });

    done(null, profile); 

}));

app.use("/auth", auth); 


// let routes = require("./app/routes/route.js"); 


// app.use("/", routes); 


// // app.use("/auth", auth);
// app.use("/cart", cartRoute);

//sync database 
models.sequelize.sync().then(function(){

    console.log("Database is working");
}).catch(function(err){

    console.log(err, "Something is wrong");
});
 
 

 
app.listen(4000, function(err) {
 
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});