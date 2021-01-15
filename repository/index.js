const { User, UserMoodHistory, RegisteredChannel, MoodHistory, ChannelQueue } = require('../data');

const addToRegisteredChannels = async (channelId) => {
  await RegisteredChannel.findOrCreate({ where: { channelId } });
}

const getLastMessages = async () => {
  const channels = await RegisteredChannel.findAll();

  return { channels };
}

const getRegisteredChannel = async (channelId) => {
  const registeredChannel = await RegisteredChannel.findByPk(channelId);

  return registeredChannel;
}

const addMessageToChannel = async (channelId, lastMessageId) => {
  await RegisteredChannel.update({ lastMessageId }, { where: { channelId } });
}

const addUpdateRegisteredChannel = async (dailyMessage, channelId) => {
  const values = {};
  values.channelId = channelId;
  if (typeof dailyMessage !== 'undefined') {
    values.dailyMessage = dailyMessage;
  }

  await RegisteredChannel.upsert(values, { where: { channelId } });
}

const updateRegisteredChannelTime = async (startTime, channelId) => {
  await RegisteredChannel.upsert({ channelId, startTime });
}

const addToMoodHistory = async (channelId, moodDate, reactions) => {
  await MoodHistory.create({ channelId, moodDate, reactions });
}

const addToUserMoodHistory = async (channelId, userId, moodDate, moodReaction) => {
  await UserMoodHistory.findOrCreate({ where: { channelId, userId, moodDate, moodReaction } });
}

const updateUserMoodHistoryComment = async (channelId, userId, moodDate, comment) => {
  await UserMoodHistory.update({ comment }, { where: { channelId, userId, moodDate } });
}

const addNewUsers = async (userId, username) => {
  await User.findOrCreate({ where: { userId, username } });
}

const getChannelQueue = async () => {
  const channelQueue = await ChannelQueue.findAll();

  return { channelQueue };
}

const addToChannelQueue = async (channelId, messageId, startTime, startDate) => {
  await ChannelQueue.create({ channelId, messageId, startTime, startDate });
}

const removeQueueItem = async (channelId, messageId) => {
  await ChannelQueue.destroy({ where: { channelId, messageId } });
}

exports.addToRegisteredChannels = addToRegisteredChannels;
exports.getLastMessages = getLastMessages;
exports.addMessageToChannel = addMessageToChannel;
exports.addToMoodHistory = addToMoodHistory;
exports.addToUserMoodHistory = addToUserMoodHistory;
exports.addNewUsers = addNewUsers;
exports.addUpdateRegisteredChannel = addUpdateRegisteredChannel;
exports.updateRegisteredChannelTime = updateRegisteredChannelTime;
exports.getChannelQueue = getChannelQueue;
exports.getRegisteredChannel = getRegisteredChannel;
exports.updateUserMoodHistoryComment = updateUserMoodHistoryComment;
exports.addToChannelQueue = addToChannelQueue;
exports.removeQueueItem = removeQueueItem;