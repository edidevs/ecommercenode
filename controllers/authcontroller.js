let page = require("../models/");




let exportsFile = module.exports = {}

exportsFile.indexPage = function(req, res){

    res.render("index");

}
 
exportsFile.signup = function(req, res) {
 
    res.render('signup');
 
}

exportsFile.signin = function(req, res){


    res.render("signin");
}

exportsFile.logout = function(req, res){

    req.session.destroy(function(err){

        res.redirect('/');
       
    });

};

exportsFile.dashboard = function(req, res){

    res.render("dashboard", {


    });
}

exportsFile.dashboardPage = function(req, res){
   let Page = page.page;

//    res.render('dashboardPage');
    
    // Page.findAll({}).then(function (err, pages) {
    //     
    // });
    let prod_all_promise = new Promise((res, req) => {
        Page.findAll({limit:5})
        .then((pages) => {
            res(pages)
        })
        .catch(err => {
            req(err)
        })
    }); 

    prod_all_promise
    .then(data => {
        res.render('dashboardPage', {
            pages: data})
    })
    .catch(e => {
        res.writeHeader(500).send('internal server error occured')
    })


    


    

};

exportsFile.apiDashboardPage = function(req, res){
    let Page = page.page;
 
 //    res.render('dashboardPage');
     
     // Page.findAll({}).then(function (err, pages) {
     //     
     // });
     let prod_all_promise = new Promise((res, req) => { // 
         Page.findAll({limit:5})
         .then((pages) => {
             res(pages)
         })
         .catch(err => {
             req(err)
         })
     }); 
 
     prod_all_promise
     .then(data => {
         res.send(data);
     })
     .catch(e => {
         res.writeHeader(500).send('internal server error occured')
     })
 
 
     
 
 
     
 
 };



exportsFile.addPage = function(req, res){

    let title = "";
    let slug = "";
    let content = "";
    let pageId = ""

    res.render("addPage", {
        title : title,
        slug: slug,
        content : content,
        pageId : pageId 

    });
}



exportsFile.editPage = function(req, res){
    let Page = page.page; 

    console.log(req.params.pageId);
    
   Page.findById(req.params.pageId).then(function(page){

        res.render("editPage", {
            pages:page,

            title:page.title,
            content:page.content,
            slug:page.slug,
            pageId:page.pageId
        });


   });


}

exportsFile.deletePage = function(req, res){

   let Page = page.page; 

   Page.destroy({where:{pageId:req.params.pageId}}).then(function(page){

        console.log("page deleted"); 
        res.redirect("/dashboard/pages"); 


   }).catch(function(err){


        if(err){

            console.log(err);
        }   

   });

  
}

exportsFile.apiDeletePage = function(req, res){

    let Page = page.page; 
 
    Page.destroy({where:{pageId:req.params.pageId}}).then(function(page){
 
         console.log("page deleted"); 
         res.send({message:"The page has been deleted"});
 
 
    }).catch(function(err){
 
 
         if(err){
 
             console.log(err);
         }   
 
    });
 
   
 }

 exportsFile.apiSinglePageId = function(req, res){
     let Page = page.page; 
     Page.findOne({where: {pageId:req.params.pageId}}).then(function(pages){

        res.send(pages);

     });


 };



exportsFile.categoryPage = function(req, res){

        let Category = page.category; 

        let prod_all_promise = new Promise((res, req) => {
            Category.findAll({limit:5})
            .then((categories) => {
                res(categories)
            })
            .catch(err => {
                req(err)
            })
        }); 
    
        prod_all_promise
        .then(data => {
            req.app.locals.categories = data; 
            res.render('categories', {
                categories: data})
        })
        .catch(e => {
            res.writeHeader(500).send('internal server error occured')
        })
        

        // Category.findAll({}).then(function(err, categories){

        //     if(err){

        //         console.log("Categories error" + err);
        //     }
        //     res.render("categories"); 

            

        //     console.log(categories);
            
        // });

   };

//get add admin category 
exportsFile.addCategory = function(req, res){

    let title = "";
    let slug = "";
    let content = "";
    let pageId = ""

    res.render("addCategory", {
        title : title,
        slug: slug
        

    });
    



};

//get edit category 
exportsFile.editCategory = function(req, res){


    let Category = page.category; 

    console.log(req.params.categoryId);
    
    Category.findById(req.params.categoryId).then(function(category){

        res.render("editCategory", {
            categories:category,

            title:category.title,
            slug:category.slug,
            categoryId:category.categoryId
        });


    });



};

//delete category 

exportsFile.deleteCategory = function(req, res){


    let Category = page.category; 

    Category.destroy({where:{categoryId:req.params.categoryId}}).then(function(category){

            console.log("category deleted"); 
            res.redirect("/dashboard/categories"); 


    }).catch(function(err){


            if(err){

                console.log(err);
            }   

    });

  
};






//get front end all products 
exportsFile.allProducts = function(req, res){

    let Product = page.product; 

    let count = "";

    let prod_all_promise = new Promise((res, req) => {
        Product.findAll()
        .then((products) => {
            res(products)
        })
        .catch(err => {
            req(err)
        })
    })

    Product.count(function(err, c){

        count = c; 

        
        
    });


    prod_all_promise
    .then(data => {
        req.app.locals.products = data; 
        res.render('product', {
            products: data, 
            count: count})
    })
    .catch(e => {
        res.writeHeader(500).send('internal server error occured')
    })

   

}


exportsFile.adminProducts = function(req, res){
    console.log( "first product added"   );
    
    let Product = page.product; 

    let count = "";

    let prod_all_promise = new Promise((res, req) => {
        Product.findAll()
        .then((products) => {
            res(products)
        })
        .catch(err => {
            req(err)
        })
    })

    Product.count(function(err, c){

        count = c; 

        
        
    });


    prod_all_promise
    .then(data => {
        console.log("show product all");
        req.app.locals.products = data; 
        res.render('dashboardProducts', {
            products: data, 
            count: count})
    })
    .catch(e => {
        res.writeHeader(500).send('internal server error occured')
    })

    // // Product.findAll().then(function(products){
    // //     // if(err){

    // //     //     console.log("Error: " + err);
    // //     // }
    // //     console.log("Products" + page.product.title);
    // //     console.log("Count" + count);
    // //     res.render("dashboardProducts", {

    // //         count: count,
    // //         products: products

    // //     });
    // // });

    

    


};

//get add admin product 
exportsFile.addProduct = function(req, res){

    let title = "";
    let slug = "";
    let category = "";
    let desc = "";
    let price = "";
    let image = "";
    let productId = "";

    res.render("addProduct", {
        title : title,
        slug: slug,
        category:category,
        desc: desc,
        price:price,
        image:image,
        productId: productId 
        

    });

    
    



};

//get edit category 
exportsFile.editProduct = function(req, res){

    let errors = "";
    if(req.session.errors){

        errors = req.session.errors; 
    }

    req.session.errors = null;
    let Product = page.product; 

    console.log(req.params.productId);
    
    Product.findById(req.params.productId).then(function(product){

        res.render("editProduct", {
            products:product,

            title:product.title,
            slug:product.slug,
            productId:product.productId,
            category:product.category,
            desc:product.desc,
            price:product.price,
            prodImage: product.image
        });


    });



};

exportsFile.deleteProduct = function(req, res){

    let Product = page.product; 

    Product.destroy({where:{productId:req.params.productId}}).then(function(category){

            console.log("product deleted"); 
            res.redirect("/dashboard/products"); 


    }).catch(function(err){


            if(err){

                console.log(err);
            }   

    });





};








