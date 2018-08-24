let authController = require('../controllers/authcontroller.js');

module.exports = (app, passport, page, category, product) =>{

    let Page = page;
    let Category = category;
    let Product = product; 

    //Pages 
    //Create a new page 
    app.post("/dashboard/pages/add", function(req, res){
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

            res.send("Error");


        }else{
            console.log("something else, no error");

            Page.count({ where : {slug:slug}}).then(function(count){

                if(count != 0){
                    console.log("page exists");

                    Req.flash("danger", "Page slug exists, choose another");
                    Res.send("Page slug already exists");
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
                        Res.send(pages);
                        

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

    //retrieve all pages 
    app.get("/dashboard/pages/", authController.apiDashboardPage);

    //update a  page with pageId 
    app.put("/dashboard/pages/edit/:pageId", function(req, res){
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


                            res.send(page);
                        }); 

                        // Page.find({}).then(function (err, pages) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         req.app.locals.pages = pages;
                        //     }
                        // });
                        

                    }).catch(function(err){

                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Note."
                        });
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

    //Delete a page with pageId 
    app.delete("/dashboard/pages/delete/:pageId", authController.apiDeletePage);

    //retrieve a single page with pageId 
    app.get("/dashboard/pages/:pageId", authController.apiSinglePageId);








}