module.exports = function(sequelize, DataTypes) {
 
    var User = sequelize.define('User', {
        // id_token: {
        //   type: DataTypes.TEXT, 
        // }, 

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

         provider: {
            type: DataTypes.STRING,
            allowNull: true
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
 
    });
 
    return User;
 
}