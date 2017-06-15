var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Scores = sequelize.define("Scores", {
    Question1: {
      type: DataTypes.INTEGER,
    },
   Question2: {
      type: DataTypes.INTEGER,
    },
    Question3: {
      type: DataTypes.INTEGER,
    },
    Question4: {
      type: DataTypes.INTEGER,
    },
    Question5: {
      type: DataTypes.INTEGER,
    },
    Question6: {
      type: DataTypes.INTEGER,
    },
    Question7: {
      type: DataTypes.INTEGER,
    },
    Question8: {
      type: DataTypes.INTEGER,
    },
    Question9: {
      type: DataTypes.INTEGER,
    },
    Question10: {
      type: DataTypes.INTEGER,
    },
  }, {
    classMethods: {
      associate: function (models) {
        Scores.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Scores;

}