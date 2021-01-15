const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    database: 'slackBots',
    schema: 'niko',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    ssl: true,
    dialectOptions: {
        ssl: true
    }
});

const User = sequelize.import('./models/user.model');
const UserMoodHistory = sequelize.import('./models/userMoodHistory.model');
const RegisteredChannel = sequelize.import('./models/registeredChannel.model');
const MoodHistory = sequelize.import('./models/moodHistory.model');
const ChannelQueue = sequelize.import('./models/channelQueue.model');

exports.User = User;
exports.UserMoodHistory = UserMoodHistory;
exports.RegisteredChannel = RegisteredChannel;
exports.MoodHistory = MoodHistory;
exports.ChannelQueue = ChannelQueue;