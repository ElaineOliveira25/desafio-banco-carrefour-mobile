'use strict';

/**
 * Reinicia o app no dispositivo atual.
 * Compatível com Appium local (terminateApp/activateApp)
 * e BrowserStack (clearApp/startActivity).
 */
async function resetApp() {
    const appId = driver.isAndroid ? 'com.wdiodemoapp' : 'org.wdiodemoapp';

    try {
        await driver.execute('mobile: terminateApp', { appId });
    } catch {
        await driver.execute('mobile: clearApp', { appId }).catch(() => {});
    }

    try {
        await driver.execute('mobile: activateApp', { appId });
    } catch {
        await driver.execute('mobile: startActivity', {
            intent: `${appId}/.MainActivity`,
        }).catch(() => {});
    }
}

module.exports = { resetApp };
