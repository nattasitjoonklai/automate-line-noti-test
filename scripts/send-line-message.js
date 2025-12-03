const https = require('https');

const userId = process.argv[2];
const messageText = process.argv[3];
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!userId || !messageText) {
    console.error('Usage: node send-line-message.js <userId> <message>');
    process.exit(1);
}

if (!channelAccessToken) {
    console.error('Error: LINE_CHANNEL_ACCESS_TOKEN environment variable is required.');
    process.exit(1);
}

const message = {
    to: userId,
    messages: [
        {
            type: 'text',
            text: messageText
        }
    ]
};

const options = {
    hostname: 'api.line.me',
    path: '/v2/bot/message/push',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${channelAccessToken}`
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ Successfully sent message to LINE.');
        } else {
            console.error(`❌ Failed to send to LINE. Status: ${res.statusCode}, Body: ${data}`);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
    process.exit(1);
});

req.write(JSON.stringify(message));
req.end();
