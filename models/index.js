const Sequelize = require('sequelize');
const sequelize = new Sequelize('shib_lottery', 'root', 'your_current_password', {
  host: 'localhost',
  dialect: 'mysql'
});

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