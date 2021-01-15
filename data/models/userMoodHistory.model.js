module.exports = (sequelize, DataTypes) => {
	const UserMoodHistory = sequelize.define('UserMoodHistory', {
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
		userId: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'userid'
		},
		moodDate: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'mooddate'
		},
		moodReaction: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'moodreaction'
		},
		comment: {
			allowNull: true,
			type: DataTypes.TEXT,
		},
	}, {
		tableName: 'usermoodhistory',
		timestamps: false,
	});

	return UserMoodHistory;
};
