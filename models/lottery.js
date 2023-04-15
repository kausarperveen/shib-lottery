
const { Sequelize, DataTypes } = require('sequelize');
const uuidv4 = require('uuid').v4;
const User = require('./user')
module.exports = (sequelize) => {
  const Lottery = sequelize.define('Lottery', {
    lottery_number: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    purchase_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'lottery',
    timestamps: false,
  });

  Lottery.associate = (models) => {
    Lottery.belongsTo(models.User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE' });
  }

  console.log(Lottery === sequelize.models.Lottery); // true

  return Lottery;
}

