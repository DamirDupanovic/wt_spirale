const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    const osoblje = sequelize.define('osoblje',{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ime: Sequelize.STRING,
        prezime: Sequelize.STRING,
        uloga: Sequelize.STRING
    });
    return osoblje;
}