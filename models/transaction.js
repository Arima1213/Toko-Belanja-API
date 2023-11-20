const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    static associate(models) {
      TransactionHistory.belongsTo(models.Product);
      TransactionHistory.belongsTo(models.User);
    }
  }

  TransactionHistory.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'TransactionHistory',
    }
  );

  return TransactionHistory;
};
