module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.TEXT,
            field: 'userid'
        },
        username: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'users',
        timestamps: false,
    });

    return User;
};
