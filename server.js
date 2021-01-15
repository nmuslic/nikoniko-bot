const { App } = require('@slack/bolt');
const schedule = require('node-schedule');
const {
    addToMoodHistory,
    addToUserMoodHistory,
    addNewUsers,
    updateRegisteredChannelTime,
    addUpdateRegisteredChannel,
    getChannelQueue,
    getRegisteredChannel,
    updateUserMoodHistoryComment,
    addToChannelQueue,
    removeQueueItem,
} = require('./repository');

const config = require('./config');

// Initializes your app with your bot token and signing secret
const app = new App({
    token: config.slackToken,
    signingSecret: config.slackSecret
});

app.action('button-action', async ({ body, ack, say }) => {
    ack();

    let responseResult = await app.client.conversations.replies({
        token: config.slackToken,
        channel: body.channel.id,
        ts: body.message.ts,
        limit: 30
    });

    const responseReplies = responseResult.messages.find(x => x.parent_user_id != null);

    const dailyMessage = typeof responseReplies !== 'undefined' ? responseReplies.text : responseReplies;

    await addUpdateRegisteredChannel(dailyMessage, body.channel.id);

    await app.client.chat.update({
        token: config.slackToken,
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "Thanks. You're all set.",
                    "emoji": true
                }
            },
        ]
    });

    say(`<@${body.user.id}> confirmed everything. Niko-Niko is ready. Have an amazing day.`);

    let registeredChannel = await getRegisteredChannel(body.channel.id);
    await processNewDailyMessage(registeredChannel);
});


app.action('timepicker-action', async ({ body, ack, say }) => {
    // Acknowledge the action
    ack();
    await updateRegisteredChannelTime(body.actions[0].selected_time.substring(0, 2), body.channel.id);

    say(`<@${body.user.id}> picked ${body.actions[0].selected_time.substring(0, 2)} hours UTC. You can still change your mind and pick another time.`);
});

app.message('Welcome Niko', async ({ message, say }) => {

    try {
        const registeredChannel = await getRegisteredChannel(message.channel);
        console.log(JSON.stringify(registeredChannel));

        if (registeredChannel == null) {

            say({
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "plain_text",
                            "text": "Hi there. I'm Niko-Niko. Please help me with setting up the daily message for this channel. It only takes 2 steps.\n You can also skip the steps and just click confirm to stick with the predefined options.",
                            "emoji": true
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "1. Pick the hour of the day that Niko-Niko should run each day in *UTC* :clock1:"
                        },
                        "accessory": {
                            "type": "timepicker",
                            "initial_time": "09:00",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select time",
                                "emoji": true
                            },
                            "action_id": "timepicker-action"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "2. Reply to this message in a thread with the daily message you want the Niko-Niko bot to send (i.e. Hi there! Tell me how are you feeling today using just one of the three emojis below. :arrow_right:"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Confirm your choices to start Niko-Niko.*"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Confirm",
                                "emoji": true
                            },
                            "value": "confirm",
                            "action_id": "button-action"
                        }
                    }
                ]
            });
        }
    }
    catch (error) {
        console.error(error);
    }
});

var hourlyChecker = schedule.scheduleJob('00 0-23 * * 1-5', async function () {
    let channelQueue = (await getChannelQueue()).channelQueue;

    if (channelQueue.length > 0) {
        channelQueue = channelQueue.filter(x => x.startTime === new Date().getUTCHours() && new Date().toISOString().slice(0, 10) > x.startDate);

        if (channelQueue.length > 0) {
            await processMessagesForChannel(channelQueue);
        }
    }
});

async function processMessagesForChannel(channelQueue) {
    try {
        for (let channel of channelQueue) {

            let registeredChannel = await getRegisteredChannel(channel.channelId);

            await saveUserResponses(channel, registeredChannel);

            await processNewDailyMessage(registeredChannel);

            await removeQueueItem(channel.channelId, channel.messageId);
        }
    }
    catch (error) {
        console.error(error);
    }
}

async function processNewDailyMessage(registeredChannel) {

    const postedMessageResult = await app.client.chat.postMessage({
        token: config.slackToken,
        channel: registeredChannel.channelId,
        text: registeredChannel.dailyMessage,
    });

    for (let emoji of registeredChannel.emojis) {
        await app.client.reactions.add({
            token: config.slackToken,
            channel: postedMessageResult.channel,
            timestamp: postedMessageResult.ts,
            name: emoji
        });
    }

    await addToChannelQueue(registeredChannel.channelId, postedMessageResult.ts, registeredChannel.startTime, new Date(postedMessageResult.ts * 1000));
}

async function saveUserResponses(channel, registeredChannel) {
    let responseResult = await app.client.conversations.replies({
        token: config.slackToken,
        channel: channel.channelId,
        ts: channel.messageId,
        limit: 30
    });

    const botUserId = config.botUserId;

    let reactions = responseResult.messages.find(x => x.user == botUserId).reactions;
    try {
        if (reactions && reactions.length > 0) {
            await addToMoodHistory(channel.channelId, channel.startDate, JSON.stringify(reactions));

            for (let reaction of reactions) {
                if (registeredChannel.emojis.indexOf(reaction.name) !== -1) {
                    for (let user of reaction.users) {
                        if (user != botUserId) {
                            await addToUserMoodHistory(channel.channelId, user, channel.startDate, reaction.name);

                            let userResponse = await app.client.users.info({
                                token: config.slackToken,
                                user: user
                            });
                            await addNewUsers(user, userResponse.user.real_name);
                        }
                    }
                }
            }
        }

        let replies = responseResult.messages.filter(x => x.parent_user_id != null);

        if (replies && replies.length > 0) {
            for (let reply of replies) {
                await updateUserMoodHistoryComment(channel.channelId, reply.user, channel.startDate, reply.text);
            }
        }

    }
    catch (error) {
        console.error(error);
    }
}

(async () => {
    await app.start(config.port);
})();