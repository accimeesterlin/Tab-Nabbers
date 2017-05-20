module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('user', {

            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            firstname: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },

            lastname: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },

            username: {
                type: Sequelize.TEXT,
                allowNull: true,
                validate: {
                    notEmpty: true
                }
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },

            phoneNumber: {
                type: Sequelize.STRING,
                allowNull: true
                    // validate: {
                    //     notEmpty: true,
                    //     len: [10]
                    // }
            },

            photo: {
                type: Sequelize.STRING
            },

            github: {
                type: Sequelize.STRING
            },

            about: {
                type: Sequelize.TEXT
            },

            last_login: {
                type: Sequelize.DATE
            },

            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                defaultValue: 'active'
            },

            //Skills
            HTML: {
                type: Sequelize.BOOLEAN,
                defaultValue: false

            },
            CSS: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            JavaScript: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Nodejs: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            mySQL: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Express: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Handlebars: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Bootstrap: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Python: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Angular: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Ruby: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Flask: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Java: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            Cplusplus: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }

        },

        //Associations
        {
            classMethods: {
                associate: function(models) {
                    User.belongsTo(models.cohort, {
                        foreignKey: {
                            allowNull: false
                        },
                        onDelete: "CASCADE"
                    });

                    User.belongsTo(models.bootcamp, {
                        foreignKey: {
                            allowNull: false
                        },
                        onDelete: "CASCADE"
                    });
                }
            }
        });

    return User;

};
