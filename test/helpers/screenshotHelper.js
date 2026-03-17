'use strict';

const path = require('path');
const fs   = require('fs');

/**
 * ScreenshotHelper — captura screenshots e anexa ao Allure.
 * Screenshots também são salvas em ./errorShots/ para artefatos de CI.
 */
class ScreenshotHelper {
    constructor() {
        this.dir = path.resolve(process.cwd(), 'errorShots');
        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir, { recursive: true });
        }
    }

    async captureAndAttach(testName) {
        const safeName = (testName || 'screenshot').replace(/[^a-z0-9_-]/gi, '_').substring(0, 100);
        const filePath = path.join(this.dir, `${safeName}.png`);

        const base64 = await browser.takeScreenshot();
        fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
        console.log(`📸  Screenshot saved: ${filePath}`);

        try {
            const allureReporter = require('@wdio/allure-reporter').default;
            allureReporter.addAttachment(
                `Failure Screenshot — ${testName}`,
                Buffer.from(base64, 'base64'),
                'image/png',
            );
        } catch {
            // Allure pode não estar disponível em todos os ambientes
        }

        return filePath;
    }
}

module.exports = new ScreenshotHelper();
