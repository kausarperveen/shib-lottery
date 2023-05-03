const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    dialect: 'mysql'
  });
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  });
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

 //Define your models here
db.user = require('./user')(sequelize,Sequelize)
db.lottery = require('./lottery')(sequelize,Sequelize)
db.user.hasMany(db.lottery, { foreignKey: 'user_id' });
db.lottery.belongsTo(db.user, { foreignKey: 'user_id' });
db.passwordRestToken=require('./PasswordResetToken')(sequelize,Sequelize)
//db.passwordRestToken.hasMany(db.user, { foreignKey: 'user_id' });
//db.user.belongsTo(db.passwordRestToken, { foreignKey: 'user_id' });

module.exports = db;
