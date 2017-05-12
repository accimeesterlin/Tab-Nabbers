module.exports = function(sequelize, Sequelize) {

    var Bootcamp = sequelize.define('bootcamp', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            institution: {
                type: Sequelize.STRING,
                notEmpty: true
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
        },
        //Associations
        {
            classMethods: {
                associate: function(models) {
                    Bootcamp.hasMany(models.user, {
                        onDelete: "cascade"
                    });
                }
            }
        });

    return Bootcamp;

}
