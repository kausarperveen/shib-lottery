const Sequelize = require('sequelize');
let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Use the CLEARDB_DATABASE_URL environment variable provided by Heroku
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    dialect: 'mysql'
  });
} else {
  // Use the local MySQL database for development
  sequelize = new Sequelize('shib_lottery', 'root', 'your_current_password', {
    host: 'localhost',
    dialect: 'mysql'
  });
}

module.exports = sequelize;

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
