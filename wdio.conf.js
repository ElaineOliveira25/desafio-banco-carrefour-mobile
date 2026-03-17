'use strict';

if (!process.env.WDIO_WORKER_ID) {
    require('dotenv').config();
}


const fs = require('fs');
const path = require('path');
const screenshotHelper = require('./test/helpers/screenshotHelper');

// ─── Ambiente de execução ─────────────────────────────────────────────────────
// RUN_ON_BS=true        → BrowserStack
// RUN_ON_BS=false       → dispositivo/emulador local (padrão)
// PLATFORM=android      → Android (padrão)
// PLATFORM=ios          → iOS
const isBrowserStack = process.env.RUN_ON_BS === 'true';
const platform = (process.env.PLATFORM || 'android').toLowerCase();
const isIOS = platform === 'ios';
const appiumHost = process.env.APPIUM_HOST || '127.0.0.1';
const appiumPort = parseInt(process.env.APPIUM_PORT) || 4723;

// ─────────────────────────────────────────────────────────────────────────────

const config = {
    runner: 'local',

    specs: ['./test/specs/**/*.test.js'],
    exclude: [],

    maxInstances: 1,
    maxInstancesPerCapability: 1,

    logLevel: process.env.LOG_LEVEL || 'error',
    bail: 0,
    waitforTimeout: parseInt(process.env.WAIT_TIMEOUT) || 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 1,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: parseInt(process.env.MOCHA_TIMEOUT) || 120000,
    },

    // ─── Reporters ────────────────────────────────────────────────────────────

    reporters: [
        'spec',
        [
            '@wdio/allure-reporter',
            {
                outputDir: path.resolve(__dirname, 'allure-results'),
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: false,
                setLogFile: (cid) =>
                    path.resolve(__dirname, 'allure-results', `wdio-${cid}-allure-reporter.log`),
            },
        ],
    ],

    // ─── Hooks ────────────────────────────────────────────────────────────────

    onPrepare() {
        const resultsDir = path.resolve(process.cwd(), 'allure-results');
        const historySource = path.resolve(process.cwd(), 'allure-report', 'history');

        if (fs.existsSync(resultsDir)) {
            fs.rmSync(resultsDir, { recursive: true, force: true });
        }
        fs.mkdirSync(resultsDir, { recursive: true });

        if (fs.existsSync(historySource)) {
            fs.cpSync(historySource, path.join(resultsDir, 'history'), { recursive: true });
        }

        const categories = [
            {
                name: 'Falha de Validação (AssertionError)',
                messageRegex: '.*AssertionError.*',
                matchedStatuses: ['failed'],
            },
            {
                name: 'Falha de Automação (Driver/Timeout)',
                messageRegex: '.*(WebDriverError|TimeoutError|NoSuchElementError|StaleElementReferenceError).*',
                matchedStatuses: ['failed', 'broken'],
            },
            {
                name: 'Testes Pendentes (Skipped)',
                matchedStatuses: ['skipped'],
            },
            {
                name: 'Erro de Execução (Broken)',
                matchedStatuses: ['broken'],
            },
        ];
        fs.writeFileSync(
            path.join(resultsDir, 'categories.json'),
            JSON.stringify(categories, null, 2),
        );

        const errorShotsPath = path.resolve(process.cwd(), 'errorShots');
        if (!fs.existsSync(errorShotsPath)) {
            fs.mkdirSync(errorShotsPath, { recursive: true });
        }

        console.log('\n🚀  Starting WebdriverIO mobile test suite\n');
    },

    before(capabilities) {
        const platform = capabilities.platformName || process.env.PLATFORM || 'Unknown';
        const device = capabilities['appium:deviceName'] || 'Unknown';
        const udid = capabilities['appium:udid'] || 'N/A';
        const automation = capabilities['appium:automationName'] || 'Unknown';
        const appName = path.basename(capabilities['appium:app'] || '') || 'Unknown';
        const runner = isBrowserStack ? 'BrowserStack' : 'Local';

        const resultsDir = path.resolve(process.cwd(), 'allure-results');

        fs.writeFileSync(
            path.join(resultsDir, 'environment.properties'),
            [
                `Platform=${platform}`,
                `Device=${device}`,
                `UDID=${udid}`,
                `Automation=${automation}`,
                `App=${appName}`,
                `Runner=${runner}`,
                `Node.js=${process.version}`,
                `WebdriverIO=8.x`,
            ].join('\n'),
        );

        fs.writeFileSync(
            path.join(resultsDir, 'executor.json'),
            JSON.stringify({
                name: process.env.EXECUTOR_NAME || runner,
                type: 'local',
                buildName: `Run ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`,
                buildOrder: Date.now(),
            }, null, 2),
        );
    },

    afterTest: async function (test, _context, { passed, error }) {
        if (!passed) {
            const testTitle = test?.title || 'unknown_test';
            try {
                await screenshotHelper.captureAndAttach(testTitle);
            } catch {
                console.log('Não foi possível salvar screenshot: sessão encerrada.');
            }

            if (error?.message) {
                try {
                    const allureReporter = require('@wdio/allure-reporter').default;
                    allureReporter.addAttachment(
                        'Mensagem de Erro',
                        Buffer.from(error.message, 'utf8'),
                        'text/plain',
                    );
                } catch {
                    // Allure pode não estar disponível em todos os ambientes
                }
            }
        }
    },

    onComplete() {
        const resultsDir = path.resolve(process.cwd(), 'allure-results');
        const appiumLog = path.resolve(process.cwd(), 'app', 'appium.log');

        if (fs.existsSync(resultsDir) && fs.existsSync(appiumLog)) {
            try {
                fs.copyFileSync(appiumLog, path.join(resultsDir, 'appium.log'));
                console.log('📋  Appium log copiado para allure-results/');
            } catch {
                // Não bloquear o fluxo se a cópia falhar
            }
        }

        console.log('\n✅  Test run complete. Generate report: npm run allure:report\n');
    },
};

// ─── BrowserStack ─────────────────────────────────────────────────────────────

if (isBrowserStack) {
    config.user = process.env.BROWSERSTACK_USER;
    config.key = process.env.BROWSERSTACK_KEY;
    config.hostname = 'hub.browserstack.com';
    config.port = 443;
    config.path = '/wd/hub';
    config.protocol = 'https';

    config.services = [
        ['browserstack', { browserstackLocal: false }],
    ];

    if (isIOS) {
        // ─── BrowserStack — iOS ───────────────────────────────────────────────
        config.capabilities = [{
            'bstack:options': {
                deviceName: process.env.BS_IOS_DEVICE || 'iPhone 15',
                osVersion: process.env.BS_IOS_VERSION || '17',
                projectName: 'Desafio Banco Carrefour',
                buildName: process.env.BUILD_NAME || 'Mobile Regression - iOS',
                local: 'false',
            },
            'appium:app': process.env.BROWSERSTACK_IOS_APP,
            'appium:automationName': 'XCUITest',
        }];
    } else {
        // ─── BrowserStack — Android ───────────────────────────────────────────
        config.capabilities = [{
            'bstack:options': {
                deviceName: process.env.BS_ANDROID_DEVICE || 'Google Pixel 8',
                osVersion: process.env.BS_ANDROID_VERSION || '14.0',
                projectName: 'Desafio Banco Carrefour',
                buildName: process.env.BUILD_NAME || 'Mobile Regression - Android',
                local: 'false',
            },
            'appium:app': process.env.BROWSERSTACK_ANDROID_APP,
            'appium:automationName': 'UiAutomator2',
        }];
    }

// ─── Local ────────────────────────────────────────────────────────────────────

} else {
    config.hostname = appiumHost;
    config.port = appiumPort;
    config.path = '/';

    config.services = [
        ['appium', {
            command: 'appium',
            args: {
                relaxedSecurity: true,
                log: path.resolve(__dirname, 'app', 'appium.log'),
            },
        }],
    ];

    if (isIOS) {
        // ─── Local — iOS Simulator ────────────────────────────────────────────
        config.capabilities = [{
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:deviceName': process.env.DEVICE_NAME || 'iPhone 15',
            'appium:platformVersion': process.env.IOS_VERSION || '17.0',
            'appium:udid': process.env.IOS_UDID || '',
            'appium:app': path.resolve(__dirname, 'app', 'ios', 'wdio-native-app.v2.0.0.app'),
            'appium:noReset': false,
            'appium:fullReset': false,
            'appium:newCommandTimeout': 240,
            'appium:wdaLaunchTimeout': 120000,
            'appium:wdaConnectionTimeout': 120000,
            'appium:simulatorStartupTimeout': 120000,
        }];
    } else {
        // ─── Local — Android Emulator ─────────────────────────────────────────
        config.capabilities = [{
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
            'appium:udid': 'emulator-5554',
            'appium:app': path.resolve(__dirname, 'app', 'android', 'android.wdio.native.app.v2.0.0.apk'),
            'appium:autoGrantPermissions': true,
            'appium:noReset': false,
            'appium:fullReset': false,
            'appium:newCommandTimeout': 240,
            'appium:adbExecTimeout': 120000,
            'appium:androidInstallTimeout': 120000,
            'appium:uiautomator2ServerInstallTimeout': 120000,
            'appium:uiautomator2ServerLaunchTimeout': 120000,
            'appium:appWaitDuration': 30000,
            'appium:disableWindowAnimation': true,
        }];
    }
}

exports.config = config;
