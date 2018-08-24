module.exports = function(sequelize, Sequelize) {
 
    var Product = sequelize.define('product', {
 
        productId: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        category:{

            type:Sequelize.STRING,
            notEmpty:true 
        },

        slug:{

            type:Sequelize.STRING,
            notEmpty:true 
        },
 
        desc: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        price: {
            type: Sequelize.INTEGER
        },
 
        image: {
            type: Sequelize.STRING
        }
 
        
 
 
    });
 
    return Product;
 
}