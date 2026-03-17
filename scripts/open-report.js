'use strict';

const { spawn, exec } = require('child_process');
const net  = require('net');
const path = require('path');

function getFreePort() {
    return new Promise((resolve, reject) => {
        const srv = net.createServer();
        srv.listen(0, () => {
            const port = srv.address().port;
            srv.close(() => resolve(port));
        });
        srv.on('error', reject);
    });
}

function openBrowser(url) {
    const cmds = { darwin: 'open', win32: 'start', linux: 'xdg-open' };
    const cmd = cmds[process.platform] || 'xdg-open';
    exec(`${cmd} ${url}`);
}

async function main() {
    const port      = await getFreePort();
    const reportDir = path.resolve(__dirname, '..', 'allure-report');

    spawn('npx', ['--yes', 'http-server', reportDir, '-p', String(port), '--cors'], {
        detached: true,
        stdio: 'ignore',
    }).unref();

    await new Promise(r => setTimeout(r, 2000));

    const url = `http://localhost:${port}`;
    openBrowser(url);
    console.log(`\n📊  Allure Report: ${url}\n`);
}

main().catch(console.error);
