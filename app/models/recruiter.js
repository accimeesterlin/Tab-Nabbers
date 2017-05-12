module.exports = function(sequelize, Sequelize) {

    var Recruiter = sequelize.define('recruiter', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        firstname: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        lastname: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        username: {
            type: Sequelize.STRING,
            allowNull:
        },

        company: {
            type: Sequelize.STRING,
        },
    });

    return Recruiter;
}
