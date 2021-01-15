module.exports = (sequelize, DataTypes) => {
    const RegisteredChannel = sequelize.define('RegisteredChannel', {
        channelId: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.TEXT,
            field: 'channelid'
        },
        lastMessageId: {
            allowNull: true,
            type: DataTypes.TEXT,
            field: 'lastmessageid'
        },
        messageDate: {
            allowNull: true,
            type: DataTypes.DATE,
            field: 'messagedate'
        },
        dailyMessage: {
            allowNull: true,
            type: DataTypes.TEXT,
            field: 'dailymessage'
        },
        emojis: {
            allowNull: true,
            type: DataTypes.ARRAY(DataTypes.TEXT),
            field: 'emojis'
        },
        startTime: {
            allowNull: true,
            type: DataTypes.SMALLINT,
            field: 'starttime'
        },
    }, {
        tableName: 'registeredchannels',
        timestamps: false,
    });

    return RegisteredChannel;
};
