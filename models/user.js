const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    wallet_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    checked_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
  console.log(User === sequelize.models.User)
  return User;
}




