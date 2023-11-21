const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product);
    }
  }

  Category.init(
    {
      type: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      sold_product_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      hooks: {
        beforeCreate: (category) => {
          category.sold_product_amount = 0;
        },
      },
    }
  );

  return Category;
};
