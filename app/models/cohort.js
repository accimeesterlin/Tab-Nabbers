module.exports = function(sequelize, Sequelize) {
    var cohort = sequelize.define('cohort', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        cohort: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        startDate: {
            type: Sequelize.DATE,
            validate: {
                allowNull: false
            }
        },

        endDate: {
            type: Sequelize.DATE,
            validate: {
                allowNull: false
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                cohort.belongsTo(models.bootcamp, {
                    foreignKey: {
                        allowNull: false
                    },
                    onDelete: "CASCADE"
                });
            }
        }

    });
    return cohort;
}
