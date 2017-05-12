module.exports = function(sequelize, Sequelize) {

    var Recruiter = sequelize.define('recruiter', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        firstname: {
            type: Sequelize.STRING,
            validate: {
                allowNull: false,
                notEmpty: true
            }
        },

        lastname: {
            type: Sequelize.STRING,
            validate: {
                allowNull: false,
                notEmpty: true
            }
        },

        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },

        company: {
            type: Sequelize.STRING,
            validate: {
                allowNull: false,
                notEmpty: true
            }
        },

        phone: {
            type: Sequelize.STRING,
            validate: {
                allowNull: false,
                notEmpty: true,
                len: [10]
            }
        },

        photo: {
            type: Sequelize.STRING
        }
    });

    return Recruiter;
}
