module.exports = function (sequelize, DataTypes) {

    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        }, 
    
        email: {
            type: DataTypes.STRING,
        },

        name: {
            type: DataTypes.STRING,
            notEmpty: true
        },

        nickname: {
            type: DataTypes.TEXT
        },

        picture: {
            type: DataTypes.STRING,
        },

        last_login: {
            type: DataTypes.DATE
        },

        about: {
            type: DataTypes.TEXT
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: "friend"
        },

    }, {
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Posts, {
                    onDelete: "cascade"
                });
                User.hasMany(models.Scores);
                User.hasMany(models.Matches);
            }
        }
    });

    return User;

}