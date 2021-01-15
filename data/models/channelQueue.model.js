module.exports = (sequelize, DataTypes) => {
    const ChannelQueue = sequelize.define('ChannelQueue', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        channelId: {
            allowNull: false,
            type: DataTypes.TEXT,
            field: 'channelid'
        },
        messageId: {
            allowNull: true,
            type: DataTypes.TEXT,
            field: 'messageid'
        },
        startTime: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'starttime'
        },
        startDate: {
            allowNull: true,
            type: DataTypes.DATEONLY,
            field: 'startdate'
        }
    }, {
        tableName: 'channelqueue',
        timestamps: false,
    });

    return ChannelQueue;
};
