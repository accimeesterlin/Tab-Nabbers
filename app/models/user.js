module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('user', {

            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            firstname: {
                type: Sequelize.STRING,
                notEmpty: true
                // validate: {
                //     allowNull: false
                // }
            },

            lastname: {
                type: Sequelize.STRING,
                notEmpty: true
                // validate: {
                //     allowNull: false
                // }
            },

            username: {
                type: Sequelize.TEXT
                // notEmpty: true
                // validate: {
                //     allowNull: false
                // }
            },

            password: {
                type: Sequelize.STRING,
                // notEmpty: true,
                // validate: {
                    allowNull: false
                // }
            },

            email: {
                type: Sequelize.STRING,
                validate: {
                    isEmail: true
                }
            },

            phoneNumber: {
                type: Sequelize.STRING
                // notEmpty: true
                // validate: {
                //     allowNull: false,
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
            html: {
                type: Sequelize.BOOLEAN
                // validate: {
                //     defaultValue: false
                // }
            },
            css: {
                type: Sequelize.BOOLEAN
                // validate: {
                //     defaultValue: false
                // }
            },

            javascript: {
                type: Sequelize.BOOLEAN
                // validate: {
                //     defaultValue: false
                // }
            },

            node: {
                type: Sequelize.BOOLEAN
                // validate: {
                //     defaultValue: false
                // }
            },

            database: {
                type: Sequelize.BOOLEAN
                // validate: {
                //     defaultValue: false
                // }
            }
        },
        //Associations
        {
            classMethods: {
                associate: function(models) {
                    User.belongsTo(models.bootcamp, {
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        });

    return User;

};
