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
            }
        },
        //Associations
        {
            classMethods: {
                associate: function(models) {
                    Bootcamp.hasMany(models.cohort, {
                        foreignKey: {
                            allowNull: false
                        },
                        onDelete: "CASCADE"
                    });

                    Bootcamp.hasMany(models.user, {
                        foreignKey: {
                            allowNull: false
                        },
                        onDelete: "CASCADE"
                    });
                }
            }
        });

    return Bootcamp;

}
