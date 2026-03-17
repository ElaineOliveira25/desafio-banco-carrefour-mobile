'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// BasePage — base class extended by all page objects.
// Contains shared helpers for element interaction.
// ─────────────────────────────────────────────────────────────────────────────

class BasePage {
    async waitForDisplayed(selector, timeout = 15000) {
        const el = await $(selector);
        await el.waitForDisplayed({ timeout });
        return el;
    }

    async click(selector) {
        const el = await this.waitForDisplayed(selector);
        await el.click();
    }

    async setValue(selector, value) {
        const el = await this.waitForDisplayed(selector);
        await el.clearValue();
        await el.setValue(value);
    }

    async getText(selector) {
        const el = await this.waitForDisplayed(selector);
        return el.getText();
    }

    async getAttribute(selector, attribute) {
        const el = await this.waitForDisplayed(selector);
        return el.getAttribute(attribute);
    }

    async hideKeyboard() {
        try {
            await driver.hideKeyboard();
        } catch {
            // Keyboard may not be open; safe to ignore
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// HomeComponent — bottom navigation bar and Home screen elements.
// ─────────────────────────────────────────────────────────────────────────────

class HomeComponent extends BasePage {
    get homeButton() {
        return $('~Home');
    }

    get homeImage() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().className("android.widget.ImageView").instance(0)');
        }
        return $('~home-screen-logo');
    }

    get webdriverTitle() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("WEBDRIVER")');
        }
        return $('~WEBDRIVER');
    }

    get supportText() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Support")');
        }
        return $('~Support');
    }

    get demoText() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Demo app for the appium-boilerplate")');
        }
        return $('~Demo app for the appium-boilerplate');
    }

    async acessarTelaHome() {
        const btn = await this.homeButton;
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// NavigationComponent — Webview, Swipe and Drag screens.
// ─────────────────────────────────────────────────────────────────────────────

class NavigationComponent extends BasePage {
    // ─── Webview ──────────────────────────────────────────────────────────────

    get webviewButton() {
        return $('~Webview');
    }

    get toggleNavigationBar() {
        if (driver.isAndroid) {
            return $('//*[@text="Toggle navigation bar" or @content-desc="Toggle navigation bar"]');
        }
        return $('~toggle-navigation-bar');
    }

    get closeNavigationBar() {
        if (driver.isAndroid) {
            return $('//*[@text="Close navigation bar" or @content-desc="Close navigation bar"]');
        }
        return $('~close-navigation-bar');
    }

    // ─── Swipe ────────────────────────────────────────────────────────────────

    get swipeButton() {
        return $('~Swipe');
    }

    get swipeTitle() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Swipe horizontal")');
        }
        return $('~Swipe-screen');
    }

    get swipeSubtitle() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Or swipe vertical to find what I\'m hiding.")');
        }
        return $('~swipe-subtitle');
    }

    get swipeCard() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().description("card").instance(0)');
        }
        return $('~card');
    }

    // ─── Drag ─────────────────────────────────────────────────────────────────

    get dragButton() {
        return $('~Drag');
    }

    get dragTitle() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Drag and Drop")');
        }
        return $('~drag-drop-screen');
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async acessarTelaWebview() {
        const btn = await this.webviewButton;
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    async abrirBarraNavegacao() {
        const btn = await this.toggleNavigationBar;
        await btn.waitForDisplayed({ timeout: 25000 });
        await btn.click();
    }

    async fecharBarraNavegacao() {
        const btn = await this.closeNavigationBar;
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    async acessarTelaSwipe() {
        const btn = await this.swipeButton;
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    async acessarTelaDrag() {
        const btn = await this.dragButton;
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }
}

module.exports = {
    BasePage,
    homePage:       new HomeComponent(),
    navigationPage: new NavigationComponent(),
};
