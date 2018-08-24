//We are going to use user models and passprt 

let bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user){

    let User = user; 
    let LocalStrategy = require("passport-local").Strategy; 

    passport.serializeUser(function(user, done){

        done(null, user.id);

    });

    passport.deserializeUser(function(id, done){

        User.findById(id).then(function(user){

            if(user){

                done(null, user.get());
            }else{
                done(user.errors, null);
            }
        });
    });

    //local strategy for signup 

    passport.use("local-signup", new LocalStrategy({


            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true 
        }, 
    
        function(req, email, password, done){
        
            var generateHash = function(password){
        
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            }; 

            User.findOne({

                where:{email:email}
            }).then(function(user){

                if(user){

                    return done(null, false, {
                        message:"the mail is taken"
                    });
                }else{

                    let userPassword = generateHash(password);

                    let data = {

                        email: email,
                        password : userPassword,
                        firstname : req.body.firtname,
                        lastname: req.body.lastname
                    }; 

                    User.create(data).then(function(newUser, created){

                        if(!newUser){

                            return done(null, false);
                        }

                        if(newUser){

                            return done(null, newUser); 
                        }
                    });
                }
            })
        
            
        }
    
    
    ));


    //Local strategy for signin 
    passport.use("local-signin", new LocalStrategy({


            //it uses username and password by default 
            usernameField : "email",
            passwordField : "password",
            passReqToCallback: true



        }, 

        function(req, email, password, done){

            let User = user; 

            let isValidPassword = function(userpass, password){
                
                return bCrypt.compareSync(password, userpass);

            };   
            
            User.findOne({

                where:{
                    email:email
                }
            }).then(function(user){
                if(!user){
                    return done(null, false, {
                        message: "Sorry, your email doesn't exist, try to use another email"
                    });

                }

                if(!isValidPassword(user.password, password)){
                    return done(null, false, {
                        message:"You have entered the wrong password, please try again"
                    });
                }

                 userinfo = user.get();
                return done(null, userinfo);
                
            }).catch(function(err){

                console.log("Error:", err);

                return done(null, false, {
                    message : "Ooops, something went wrong"
                }); 

            });


        }    
    ));


}

