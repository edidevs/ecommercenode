let authController = require('../controllers/authcontroller.js');


let mkdirp = require("mkdirp");
let fs = require("fs-extra");
let resizeImg = require("resize-img");


 
module.exports = function(app, passport, page, category, product) {
    
    let Page = page; 
    let Category = category; 
    let Product = product; 
    // let Category = category; 
    app.get("/", authController.indexPage);
 
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.post("/signup", passport.authenticate('local-signup', {

        successRedirect: "/dashboard",
        failureRedirect: "/signup",
        // failureFlash: true
    }));


    //get product model 




    app.get("/dashboard", authController.dashboard);

    // app.get("/logout", authController.logout);
    // app.get('/dashboard/pages', isLoggedIn, authController.dashboardPage);

    function isLoggedIn(req, res, next){

        if(req.isAuthenticated()){

            return next();
        }

        res.redirect("/signin");


    }
    //oAuth login 
    // app.get("/loginAuth", function(req,res){

    //     res.render("loginG");

    // });

    //logout oAuth 
    app.get('/logout', function(req, res) {
        delete req.session.cart; 
        req.app.locals.cart = []; 
        req.session.destroy(function(e){
            req.logout();
            // res.redirect("https://appengine.google.com/_ah/logout?continue=http://localhost:4000");
            // // res.render('index');

            res.redirect("https://mail.google.com/mail/u/0/?logout&hl=en");
           
           
            
            // res.redirect("/");
            
        });


    });

    // app.get("/auth/google", function(req,res){

    //     let express = require('express');
    //     let passport1 = require('passport');
    //     let router = express.Router();


    //     router.route('/google/callback')
    //         .get(passport1.authenticate('google', { 
    //             successRedirect: '/users/',
    //             failure: '/error/'
    //     }));


    //     router.route('/google')
    //         .get(passport1.authenticate('google', {
    //             scope: ['https://www.googleapis.com/auth/userinfo.profile',
    //                 'https://www.googleapis.com/auth/userinfo.email']
    //     }));

    // });

    

    app.post("/signin", passport.authenticate('local-signin', {

        successRedirect: "/dashboard",
        failureRedirect: '/signin'

    }));

    app.get("/dashboard/pages", authController.dashboardPage);

    //Get add-pages index 
    app.get("/dashboard/pages/add-page", authController.addPage);

    app.post("/dashboard/pages/add-page", function(req, res){
        let Res = res; 
        let Req = req;

        req.checkBody("title", "Title must have value").notEmpty();

        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        if(slug == ""){
            slug = title.replace(/\s+/g,"-").toLowerCase();
        }
        let content = req.body.content; 

        let errors = req.validationErrors();

        if(errors){

            res.render("addPage", {
                errors : errors,
                title : title,
                slug : slug,
                content: content 

            });


        }else{
            console.log("something else, no error");

            Page.count({ where : {slug:slug}}).then(function(count){

                if(count != 0){
                    console.log("page exists");

                    Req.flash("danger", "Page slug exists, choose another");
                    Res.render("addPage", {

                        title: title,
                        slug:slug,
                        content:content
                    })
                }else{

                    console.log("page added");

                    let data = {

                        title : title,
                        slug : slug,
                        content : content,
                        

                    }; 

                    // let page = new Page({
                    //     title:title,
                    //     slug:slug,
                    //     content:content,
                    //     sorting:0
                    // });

                    Page.create(data).then(function(err, pages){

                        req.app.locals.page = pages; 
                        console.log("page saved and added");
                        Req.flash("success", "Page has been added");
                        Res.redirect("/dashboard/pages");
                        

                    }).catch(function(err){

                        if(err){
                            console.log(err);
                        }
                    });

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

        }

        
    });

    // //get reorder page 

    // app.post("/reorderPage", function(){

    //     Page.find({}).then(function(pages){

    //         res.render("dashboard/pages", {
    //             pages: pages
    //         });

    //     }).catch(function(err){

    //         console.log(err);
    //     });
    // });

    //get edit pages 
    app.get("/dashboard/pages/edit-page/:pageId", authController.editPage);

    //post edit page 
    app.post("/dashboard/pages/edit-page/:pageId", function(req, res){
        let Res = res; 
        let Req = req;

        req.checkBody("title", "Title must have value").notEmpty();

        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        if(slug == ""){
            slug = title.replace(/\s+/g,"-").toLowerCase();
        }
        let content = req.body.content; 
        let pageId = req.params.pageId; 

        

        let errors = req.validationErrors();

        if(errors){
            console.log(errors);

            res.render("dashboardPage", {
                errors : errors,
                title : title,
                slug : slug,
                content: content,
                pageId : pageId 

            });

            

        }else{
            console.log("something else, no error");

            Page.findOne({ where : {slug:slug} }).then(function(pages){

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

        }

       
        

    });

    //get delete page 

    app.get("/dashboard/pages/delete-page/:pageId", authController.deletePage);


    //get admin category index 
    app.get("/dashboard/categories", authController.categoryPage);

    //get add admin category 
    app.get("/dashboard/categories/add-cat", authController.addCategory);

    //post add admin category 

    app.post("/dashboard/categories/add-cat", function(req, res){
        
        
        let Res = res; 
        let Req = req;

        req.checkBody("title", "Title must have value").notEmpty();

        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        if(slug == ""){
            slug = title.replace(/\s+/g,"-").toLowerCase();
        }
        

        let errors = req.validationErrors();

        if(errors){

            res.render("addCategory", {
                errors : errors,
                title : title,
                slug : slug,
                

            });


        }else{
            console.log("something else, no error");

            Category.count({ where : {slug:slug}}).then(function(count){

                if(count != 0){
                    console.log("page exists");

                    Req.flash("danger", "Page slug exists, choose another");
                    Res.render("addCategory", {

                        title: title,
                        slug:slug,
                        
                    })
                }else{

                    console.log("Category added");

                    let data = {

                        title : title,
                        slug : slug
                        
                        

                    }; 

                    // let page = new Page({
                    //     title:title,
                    //     slug:slug,
                    //     content:content,
                    //     sorting:0
                    // });

                    Category.create(data).then(function(err, categories){

                        req.app.locals.categories = categories; 
                        console.log("Categories saved and added");
                        Req.flash("success", "A new category has been added");
                        Res.redirect("/dashboard/categories");
                        

                    }).catch(function(err){

                        if(err){
                            console.log(err);
                        }
                    });

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

        }




    }); 

     //get edit category 
     app.get("/dashboard/categories/edit-cat/:categoryId", authController.editCategory);

     //post edit category 
     app.post("/dashboard/categories/edit-cat/:categoryId", function(req, res){
        let Res = res; 
        let Req = req;

        req.checkBody("title", "Title must have value").notEmpty();

        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
        if(slug == ""){
            slug = title.replace(/\s+/g,"-").toLowerCase();
        }
        
        let categoryId = req.params.categoryId; 

        

        let errors = req.validationErrors();

        if(errors){
            console.log(errors);

            res.render("categories", {
                errors : errors,
                title : title,
                slug : slug,
                categoryId : categoryId 

            });

            

        }else{
            console.log("something else, no error");

            Category.findOne({ where : {slug:slug} }).then(function(categories){

                if(categories){
                    console.log("slug already exists, you can't edit");

                    Req.flash("danger", "Category slug exists, choose another");
                    Res.render("editCategory", {
                        categories:categories,
                        title: title,
                        slug:slug,
                        categoryId: categoryId
                    })
                }else{

                    console.log("page added");

                    Category.findById(categoryId).then(function(category){
                        console.log("select");
                        category.title = title;
                        category.slug = slug;
                       

                        category.save().then(function(category){


                            console.log("updated");
                        }); 

                        // Page.find({}).then(function (err, pages) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         req.app.locals.pages = pages;
                        //     }
                        // });
                        res.redirect("/dashboard/categories");

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

        }

       
        

    });

    //get delete category 

    app.get("/dashboard/categories/delete-cat/:categoryId", authController.deleteCategory);


    //get front end all products 
    app.get("/product", authController.allProducts);

    //get products by category 

    app.get("/:category", function(req, res){


        let categorySlug ; 

    });

    //get product details 
    // app.get("/:category/:product", function (req, res){
        
    //     let galleryImage = null; 

    //     Product.findOne({
    //         slurg: req.params.product
    //     }).then(function(err, product){

    //         if(err){

    //             console.log(err);
    //         }else{

    //             let galleryDir = "public/product-images/"+product._id + "/gallery";

    //             fs.readdir(galleryDir, function(err, files){

    //                 if(err){

    //                     console.log(err);
    //                 }else{
    //                     galleryImages = files; 
    //                     res.render("/products", {

    //                         title:product.title,
    //                         p : product,
    //                         galleryImages : galleryImages 
    //                     });
    //                 }

    //             }); 
    //         }
    //     });


    // });


    //get admin product 
    app.get("/dashboard/products", authController.adminProducts);

    //get add admin category 
    app.get("/dashboard/products/add-product", authController.addProduct);

    app.post("/dashboard/products/add-product", function(req, res){
        let Res = res; 
        let Req = req;
        let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : console.log("please image");

         

        req.checkBody("title", "Title must have value").notEmpty();

        let title = req.body.title;
        let slug = title.replace(/\s+/g, "-").toLowerCase();
        if(slug == ""){
            slug = title.replace(/\s+/g,"-").toLowerCase();
        }
        let desc = req.body.desc; 
        let price = req.body.price; 
        let errors = req.validationErrors();
        let category = req.body.category; 
        if(errors){
            Product.find(function (err, products){
                res.render("dashboard/products/add-product", {

                    errors: errors,
                    title: title,
                    desc :desc,
                    categories: categories,
                    price : price
                })

            }).catch(function(err){

                console.log(err);
            });
            


        }else{
            console.log("something else, no error");

            Product.count({ where : {slug:slug}}).then(function(count){

                if(count != 0){
                    console.log("product exists");

                    Req.flash("danger", "Page slug exists, choose another");
                    Res.render("addProduct", {

                        title: title,
                        slug:slug,
                        title: title,
                    desc :desc,
                    category: category,
                    price : price
                        
                    })
                }else{

                    console.log("product added");
                    let price2 = parseFloat(price).toFixed(2);


                    let data = {

                        title : title,
                        slug : slug,
                        desc : desc,
                        price : price2,
                        image: imageFile,
                        category : category
                        

                    }; 

                    // let page = new Page({
                    //     title:title,
                    //     slug:slug,
                    //     content:content,
                    //     sorting:0
                    // });

                    Product.create(data).then(function(products){

                        req.app.locals.products = products; 
                        console.log("The product saved and added");
                        //create directory folder
                        mkdirp("app/public/product_images/" +products.productId, function(err){
                            console.log("IMage moved mkdirp");
                            return console.log(err);
                        });

                        // mkdirp("public/product_images/" +product._id, function(err){

                        //     return console.log(err);
                        // });

                        // mkdirp("public/product_images/" +product._id, function(err){

                        //     return console.log(err);
                        // });

                        if(imageFile != ""){
                            console.log("There is an image");
                            let productImage = req.files.image;
                            let path = "app/public/product_images/" + products.productId + "/" + imageFile; 
                            productImage.mv(path, function(err){
                                return console.log(err); 

                            });
                        
                        }else{

                            console.log("error there is no image");
                        }



                        Req.flash("success", "Product has been added");
                        Res.redirect("/dashboard/products");
                        

                    }).catch(function(err){

                        if(err){
                            console.log(err);
                        }
                    });

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

        }

        
    });

    //get edit products 
    app.get("/dashboard/products/edit-product/:productId", authController.editProduct);

    //post edit product 
    app.post("/dashboard/products/edit-product/:productId", function(req, res){
        let Res = res; 
        let Req = req;

        let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : ""; 

        req.checkBody("title", "Title must have value").notEmpty();

        let title = Req.body.title;
        let slug = Req.body.slug.replace(/\s+/g, "-").toLowerCase();
        if(slug == ""){
            slug = title.replace(/\s+/g,"-").toLowerCase();
        }
        
        let productId = req.params.productId;
        let desc = req.body.desc;
        let price = req.body.price;
        let category = req.body.category; 
        let pimage = req.body.pimage; 
        



        

        let errors = req.validationErrors();

        if(errors){
            
            req.session.errors = errors; 
            res.redirect("/dashboard/products/edit-product/"+ productId);

            

        }else{
            console.log("something else, no error");

            Product.findOne({where:{productId:productId, image:imageFile}}).then(function(products){
               
                if(products){
                    console.log("slug already exists, you can't edit");

                    Req.flash("danger", "The image already exists, choose another");
                    Res.render("editProduct", {
                        products:products,
                        title: products.title,
                        slug:products.slug,
                        productId: products.productId,
                        price: products.price,
                        desc: products.desc,
                        category: product.category,
                        image:product.image
                    })
                }else{

                    console.log("product updated");

                    Product.findById(productId).then(function(product){
                        console.log("select");
                        product.title = title;
                        product.slug = slug;
                        product.price = parseFloat(price).toFixed(2); 
                        product.desc = desc; 
                         
                        product.category = category; 
                        if(imageFile != ""){ //replace the previous image only if there is a new image available 

                            product.image = imageFile; 
                        }


                       

                        product.save().then(function(product){

                            req.app.locals.products = product; 
                            console.log("updated");

                            if(imageFile != ""){ //remove the image in the folder 

                                if(pimage != ""){

                                    fs.remove("app/public/product_images/" + productId + "/" + pimage, function(err){
                                        if(err){
                                            console.log(err);
                                        }
                                    });

                                }
                            }
                            let productImage = req.files.image; 
                            let path = "app/public/product_images/" + productId + "/" + imageFile;

                            productImage.mv(path, function(err){

                                if(err){
                                    console.log(err);
                                }
                            });

                        }); 

                        // Page.find({}).then(function (err, pages) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         req.app.locals.pages = pages;
                        //     }
                        // });
                        res.redirect("/dashboard/products");

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

        }

       
        

    });

    app.get("/dashboard/products/delete-product/:productId", authController.deleteProduct);



    //cart route 

    app.get("*", function(req, res, next){

        res.locals.cart = req.session.cart; 
        next();


    });

    //get product by id 

    app.get("/products/:product", function(req, res){

        Product.findOne({where:{slug: req.params.product}}).then(function(products){

           res.render("singleDetails", {

                    title:products.title,
                    p:products
                })


        }).catch(function(err){

            if(err){

                console.log(err);
            }
        });

    });

    // add product to cart 

    app.get("/cart/add/:product", function(req, res){

        let slug = req.params.product; 

        Product.findOne({where:{slug:slug}}).then(function(p){

            if(typeof req.session.cart == "undefined"){
                console.log("undefined cart");
                req.session.cart = [];
                req.app.locals.cart = req.session.cart; 
                req.session.cart.push({

                    title:slug,
                    qty:1,
                    price:parseFloat(p.price).toFixed(2),
                    image: "/product_images/" + p.productId + "/" + p.image 
                });
            }else{


                let cart = req.session.cart; 
                let newItem = true; 

                for(var i = 0; i<cart.length; i++){

                    if (cart[i].title == slug) {
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                
                if (newItem) {
                    cart.push({
                        title: slug,
                        qty: 1,
                        price: parseFloat(p.price).toFixed(2),
                        image: '/product_images/' + p.productId + '/' + p.image
                    });


                }

                req.app.locals.cart = req.session.cart; 
            }
            
            // req.flash('success', 'Product added!');
            res.redirect('back');


        }).catch(function(err){

            if(err){

                console.log(err);
            }
        });

        

    });

    // //cart js 
    // /*
        // * GET checkout page
        // */
    app.get('/cart/checkout', function (req, res) {

        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect('/cart/checkout');
        } else {
            res.render('checkout', {
                title: 'Checkout',
                cart: req.session.cart
            });
        }

    });

    //get update page for the cart 
    app.get("/cart/update/:product", function(req, res){

        let slug = req.params.product; 
        let cart = req.session.cart; 
        let action = req.query.action; 

        for(let i=0; i<cart.length; i++){
            if(cart[i].title == slug){

                switch(action){


                    case "add":
                        cart[i].qty++;
                        break; 
                    case "remove":
                        cart[i].qty--;
                        if(cart[i].qty < 1){
                            cart.splice(i, 1);
                            req.app.locals.cart = cart; 
                        }
                        break; 
                    case "clear":
                        cart.splice(i, 1);
                        if(cart.length == 0) {
                            delete req.session.cart; 
                        }

                        req.app.locals.cart = cart; 
                        break; 
                    default: 
                        console.log("error updating the cart"); 
                        break; 
                }
                break; 
            }


        }

        res.redirect("back");

    });

    


    // get clear cart 
    app.get("/cart/clear", function(req, res){

        delete req.session.cart; 
        res.redirect("/cart/checkout");
        req.app.locals.cart = req.session.cart; 

    });

    // app.get("/log", function(req, res){

    //     res.render("index");
    // });

    

    //login oAuth 
    // app.get("/loginG", function(req, res){

    //     res.render("loginG", {
           
    //     });
    // });



    

    


    //     /*
    //     * GET update product
    //     */
    //     app.get('/update/:product', function (req, res) {

    //         var slug = req.params.product;
    //         var cart = req.session.cart;
    //         var action = req.query.action;

    //         for (var i = 0; i < cart.length; i++) {
    //             if (cart[i].title == slug) {
    //                 switch (action) {
    //                     case "add":
    //                         cart[i].qty++;
    //                         break;
    //                     case "remove":
    //                         cart[i].qty--;
    //                         if (cart[i].qty < 1)
    //                             cart.splice(i, 1);
    //                         break;
    //                     case "clear":
    //                         cart.splice(i, 1);
    //                         if (cart.length == 0)
    //                             delete req.session.cart;
    //                         break;
    //                     default:
    //                         console.log('update problem');
    //                         break;
    //                 }
    //                 break;
    //             }
    //         }

    //         req.flash('success', 'Cart updated!');
    //         res.redirect('/cart/checkout');

    //     });

    //     /*
    //     * GET clear cart
    //     */
    //     app.get('/clear', function (req, res) {

    //         delete req.session.cart;
            
    //         req.flash('success', 'Cart cleared!');
    //         res.redirect('/cart/checkout');

    //     });

    //     /*
    //     * GET buy now
    //     */
    //     app.get('/buynow', function (req, res) {

    //         delete req.session.cart;
            
    //         res.sendStatus(200);

    //     });

            


 
}



