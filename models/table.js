/**
 * Created by esterlingaccime on 5/7/17.
 */

module.exports  = function (sequelize, DataTypes) {
    var table = sequelize.define("table", {
        name: {
            type: DataTypes.STRING,
            allowNull:false

        }
    });

    return table;
};