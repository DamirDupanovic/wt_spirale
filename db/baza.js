const Sequelize = require("sequelize");
const sequelize = new Sequelize('DBWT19', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging:false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
        timestamps: false
    }
  });
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import model

db.osoblje= sequelize.import('../modeli/osoblje.js');
db.rezervacije= sequelize.import('../modeli/rezervacije.js');
db.termin= sequelize.import('../modeli/termin.js');
db.sala= sequelize.import('../modeli/sala.js');


//Rezervacija - jedan na jedan - Termin
db.rezervacije.belongsTo(db.termin, {as: "termin", foreignKey: 'terminId'});

//Rezervacija - više na jedan - Sala
db.sala.hasMany(db.rezervacije);
db.rezervacije.belongsTo(db.sala, {as: "sala", foreignKey: 'salaId'})

//osoblje - jedan na više - rezervacija
db.osoblje.hasMany(db.rezervacije, {as: "osoblje", foreignKey: 'osobljeId'});
db.rezervacije.belongsTo(db.osoblje);

//Sala - jedan na jedan - Osoblje
db.sala.belongsTo(db.osoblje, {as: "osoblje", foreignKey: 'zaduzenaOsoba'})

module.exports=db;