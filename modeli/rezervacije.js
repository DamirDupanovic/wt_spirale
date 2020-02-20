const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    const rezervacije = sequelize.define('rezervacije',{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
    return rezervacije;
}