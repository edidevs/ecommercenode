module.exports = function(sequelize, Sequelize) {
 
    var Page = sequelize.define('page', {
 
        pageId: {
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
        },
 
        content: {
            type: Sequelize.STRING
        },
 
        sorting: {
            type: Sequelize.INTEGER
        },
 
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
 
 
    });
 
    return Page;
 
}