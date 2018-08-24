var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
let expressValidator = require("express-validator");
router.use(expressValidator());

// Get Users model
let models = require('../models');

/*
 * GET register
 */
router.get('/register', function (req, res) {

    res.render('signup', {
        title: 'Register'
    });

});

/*
 * POST register
 */
router.post('/register', function (req, res) {
    let Req = req; 
    let Res = res; 
    let User = models.user;  
    let firstname = req.body.firstname;
    let lastname = req.body.lastname; 
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    // var password2 = req.body.password2;

    req.checkBody('firstname', 'FirstName is required!').notEmpty();
    req.checkBody('lastname', 'LasttName is required!').notEmpty();
    req.checkBody('email', 'Email is required!').notEmpty();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    // req.checkBody('password2', 'Passwords do not match!').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('signup', {
            errors: errors,
            user: null,
            title: 'Register'
        });
    } else {
        
        User.findOne({where:{username:username}}).then(function(user){

            if(user){

                Req.flash("danger", "Username exists, choose another");
                Res.redirect("/users/register");
            }else{

                let user = {
                    firstname: firstname,
                                lastname: lastname,
                                email: email,
                                username: username,
                                password: password,

                };

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        User.create(user).then(function(err, users){

                            Req.app.locals.users = users; 
                            console.log("user saved and added");
                            
                            Res.redirect("/dashboard");
                            
    
                        }).catch(function(err){
    
                            if(err){
                                console.log(err);
                            }
                        });
    

                        // user.save(function (err) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         req.flash('success', 'You are now registered!');
                        //         res.redirect('/users/login')
                        //     }
                        // });
                    });
                });



            }});

        }

});

/*
 * GET login
 */
router.get('/signin', function (req, res) {

    if (res.locals.user) {
        
        res.redirect('/');
        console.log("user exists, no need to signin");
    }
    res.render('signin', {
        title: 'Log in'
    });

});

/*
 * POST login
 */
router.post('/signin', function (req, res, next) {
    let email = req.body.email; 
    let password = req.body.password; 

    let passwordEnc = 

    User.findOne({ where : {email:email} }).then(function(pages){

        if(pages){
            console.log("slug already exists, you can't edit");

            Req.flash("danger", "Page slug exists, choose another");
            Res.render("editPage", {
                pages:pages,
                title: title,
                slug:slug,
                content:content,
                pageId: pageId
            })
        }else{

            console.log("page added");

            Page.findById(pageId).then(function(page){
                console.log("select");
                page.title = title;
                page.slug = slug;
                page.content = content;

                page.save().then(function(page){


                    console.log("updated");
                }); 

                // Page.find({}).then(function (err, pages) {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         req.app.locals.pages = pages;
                //     }
                // });
                res.redirect("/dashboard/pages/");

            }).catch(function(err){

                console.log(err);
            });

            

            // let page = new Page({
            //     title:title,
            //     slug:slug,
            //     content:content,
            //     sorting:0
            // });

            // Page.update(data, {where:{pageId:pageId}}).then(function(page){

                
            //     console.log("page saved and edited");
            //     Req.flash("success", "Page has been edited");
            //     Res.redirect("/dashboard/pages");
                

            // }).catch(function(err){

            //     if(err){
            //         console.log(err);
            //     }
            // });

            // page.save(function(req, res, err){

            //     if(err){
            //         return console.log(err);
            //     }

            //     req.flash("success", "page added");
            //     res.redirect("/dashboard");
            //     console.log("page added");
            //     s
            // });

        }

    });




    // passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/users/login',
    //     failureFlash: true
    // })(req, res, next);
    
});

/*
 * GET logout
 */
router.get('/logout', function (req, res) {

    req.logout();
    
    
    res.redirect('/signin');

});

// Exports
module.exports = router;


