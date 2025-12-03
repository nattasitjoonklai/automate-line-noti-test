const fs = require('fs');
const https = require('https');

const REPORT_PATH = 'playwright-report/results.json';
const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

// Get arguments
const userId = process.argv[2];
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!userId) {
    console.error('Error: User ID is required.');
    process.exit(1);
}

if (!channelAccessToken) {
    console.error('Error: LINE_CHANNEL_ACCESS_TOKEN environment variable is required.');
    process.exit(1);
}

// Read and parse report
try {
    if (!fs.existsSync(REPORT_PATH)) {
        throw new Error(`Report file not found at ${REPORT_PATH}`);
    }

    const reportRaw = fs.readFileSync(REPORT_PATH, 'utf8');
    const report = JSON.parse(reportRaw);

    const total = report.stats.expected + report.stats.unexpected + report.stats.flaky + report.stats.skipped;
    const passed = report.stats.expected;
    const failed = report.stats.unexpected;
    const skipped = report.stats.skipped;
    const duration = (report.stats.duration / 1000).toFixed(2);

    // Construct message
    const message = {
        to: userId,
        messages: [
            {
                type: 'flex',
                altText: 'Playwright Test Results',
                contents: {
                    type: 'bubble',
                    header: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'text',
                                text: 'Test Results',
                                weight: 'bold',
                                size: 'xl',
                                color: '#ffffff'
                            }
                        ],
                        backgroundColor: failed > 0 ? '#ff4b4b' : '#00c853'
                    },
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                            {
                                type: 'box',
                                layout: 'horizontal',
                                contents: [
                                    { type: 'text', text: 'Total', size: 'sm', color: '#555555', flex: 1 },
                                    { type: 'text', text: `${total}`, size: 'sm', color: '#111111', align: 'end' }
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                contents: [
                                    { type: 'text', text: 'Passed', size: 'sm', color: '#555555', flex: 1 },
                                    { type: 'text', text: `${passed}`, size: 'sm', color: '#00c853', align: 'end' }
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                contents: [
                                    { type: 'text', text: 'Failed', size: 'sm', color: '#555555', flex: 1 },
                                    { type: 'text', text: `${failed}`, size: 'sm', color: '#ff4b4b', align: 'end' }
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                contents: [
                                    { type: 'text', text: 'Skipped', size: 'sm', color: '#555555', flex: 1 },
                                    { type: 'text', text: `${skipped}`, size: 'sm', color: '#aaaaaa', align: 'end' }
                                ]
                            },
                            {
                                type: 'separator',
                                margin: 'md'
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                margin: 'md',
                                contents: [
                                    { type: 'text', text: 'Duration', size: 'xs', color: '#aaaaaa', flex: 1 },
                                    { type: 'text', text: `${duration}s`, size: 'xs', color: '#aaaaaa', align: 'end' }
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    };

    // Send to LINE
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${channelAccessToken}`
        }
    };

    const req = https.request(LINE_API_URL, options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ Successfully sent results to LINE.');
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

} catch (error) {
    console.error(`❌ Error processing report: ${error.message}`);
    process.exit(1);
}
