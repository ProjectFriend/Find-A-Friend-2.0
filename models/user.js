module.exports = function(sequelize, DataTypes) {
 
    var User = sequelize.define('User', {
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
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
 
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Posts, {
                     onDelete: "cascade"
                }); 
            }
        }
    });
 
    return User;
 
}

// implement nodemailer to recognize when a user has signed in using 
// email sent back via auth0 