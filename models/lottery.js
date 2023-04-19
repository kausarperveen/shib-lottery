
const { Sequelize, DataTypes,literal } = require('sequelize');
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
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set the default value to the current date
    },
    end_time: {
      type: DataTypes.DATE,
      defaultValue: function() {
        if (this.purchase_date) {
          return new Date(this.purchase_date.getTime() + (24 * 60 * 60 * 1000));
        } else {
          return null;
        }
      }
    },
      
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

