module.exports = (sequelize, DataTypes) => {
    const MoodHistory = sequelize.define('MoodHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        channelId: {
            allowNull: true,
            type: DataTypes.TEXT,
            field: 'channelid'
        },
        moodDate: {
            allowNull: true,
            type: DataTypes.DATEONLY,
            field: 'mooddate'
        },
        reactions: {
            allowNull: true,
            type: DataTypes.JSON,
            field: 'reactions'
        }
    }, {
        tableName: 'moodhistory',
        timestamps: false,
    });

    return MoodHistory;
};
