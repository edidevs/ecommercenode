module.exports = function(sequelize, Sequelize) {
 
    let Category = sequelize.define('category', {
 
        categoryId: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        slug: {
            type: Sequelize.STRING,
            notEmpty: true
        }
 
        
 
    });
 
    return Category;
 
}