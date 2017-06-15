var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Matches = sequelize.define("Matches", {
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
        Matches.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Matches;

}