const http = require('http');
const https = require('https');

// Configuration
const PORT = process.env.PORT || 3000;
const GITHUB_OWNER = process.env.GITHUB_OWNER; // e.g., 'your-username'
const GITHUB_REPO = process.env.GITHUB_REPO;   // e.g., 'crm-automate'
const GITHUB_WORKFLOW_ID = 'playwright-line.yml';
const GITHUB_PAT = process.env.GITHUB_PAT;     // Personal Access Token with 'repo' scope

if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_PAT) {
    console.error('Error: GITHUB_OWNER, GITHUB_REPO, and GITHUB_PAT env vars are required.');
    process.exit(1);
}

const server = http.createServer((req, res) => {
    // Global Request Logging
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers));

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end('Webhook Server is Running');
        return;
    }

    if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const event = JSON.parse(body).events[0];

                if (event && event.type === 'message' && event.message.type === 'text') {
                    const userMessage = event.message.text.toLowerCase();
                    const userId = event.source.userId;

                    if (userMessage.includes('run test') || userMessage.includes('test')) {
                        let project = '';
                        let grep = '';

                        // Check for project
                        if (userMessage.includes('contact')) {
                            project = 'contact';
                        } else if (userMessage.includes('agent')) {
                            project = 'agentdesktop';
                        }

                        // Check for specific test case (e.g., CRM_AG00001)
                        const match = userMessage.match(/(crm_[a-z0-9]+)/i);
                        if (match) {
                            grep = match[1].toUpperCase();
                        }

                        console.log(`Received command from ${userId}. Project: ${project || 'ALL'}, Grep: ${grep || 'NONE'}. Triggering GitHub Action...`);
                        triggerGitHubAction(userId, project, grep);
                        res.writeHead(200);
                        res.end('OK');
                    } else {
                        console.log(`Ignored message: ${userMessage}`);
                        res.writeHead(200);
                        res.end('OK');
                    }
                } else {
                    res.writeHead(200);
                    res.end('OK');
                }
            } catch (e) {
                console.error('Error parsing webhook:', e);
                res.writeHead(400);
                res.end('Bad Request');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

function triggerGitHubAction(userId, project, grep) {
    const data = JSON.stringify({
        ref: 'main', // or 'master'
        inputs: {
            userId: userId,
            project: project || '',
            grep: grep || ''
        }
    });

    const options = {
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW_ID}/dispatches`,
        method: 'POST',
        headers: {
            'User-Agent': 'Node.js-Webhook-Server',
            'Authorization': `Bearer ${GITHUB_PAT}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        if (res.statusCode === 204) {
            console.log('✅ GitHub Action triggered successfully.');
        } else {
            console.error(`❌ Failed to trigger Action. Status: ${res.statusCode}`);
            res.on('data', d => process.stdout.write(d));
        }
    });

    req.on('error', (e) => {
        console.error(`❌ Request error: ${e.message}`);
    });

    req.write(data);
    req.end();
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
});
