var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Posts = sequelize.define("Posts", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    }
  }, {
    classMethods: {
      associate: function (models) {
        Posts.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Posts;

}