
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
    wallet_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }, 
    checked_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
  }, 
},{
    tableName: 'lottery',
    timestamps: false,
  });

  Lottery.associate = (models) => {
  Lottery.belongsTo(models.User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE' });
  }

  console.log(Lottery === sequelize.models.Lottery); // true

  return Lottery;
}

