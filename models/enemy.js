var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Enemies = sequelize.define("Enemies", {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING, 
    }, 
    picture: {
      type: DataTypes.STRING
    }, 
    about: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function (models) {
        Enemies.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Enemies;

}