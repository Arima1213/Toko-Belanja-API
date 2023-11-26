// Assuming you have a User model defined
const { Model } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
const formatCurrency = require('../helpers/FormatCurrency');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }

  User.init(
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 10],
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['male', 'female']],
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'customer',
        allowNull: false,
        validate: {
          isIn: [['admin', 'customer']],
        },
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          isInt: true,
          max: 100000000, // Max value set to 100 million
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: (user) => {
          user.role = 'customer';
          user.balance = 0;
          const hashedPassword = hashPassword(user.password);
          user.password = hashedPassword;
        },
      },
      getterMethods: {
        formattedBalance() {
          return formatCurrency(this.balance);
        },
      },
    }
  );

  return User;
};
