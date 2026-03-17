'use strict';

const { BasePage } = require('./common.component');

/**
 * LoginPage — selectors and actions for the Login screen.
 */
class LoginPage extends BasePage {
    // ─── Navegação ────────────────────────────────────────────────────────────

    get loginMenuButton() {
        return $('~Login');
    }

    get loginSignUpTitle() {
        return $('android=new UiSelector().text("Login / Sign up Form")');
    }

    // ─── Campos ───────────────────────────────────────────────────────────────

    get emailField() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
        }
        return $('~input-email');
    }

    get passwordField() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().className("android.widget.EditText").instance(1)');
        }
        return $('~input-password');
    }

    // ─── Botões ───────────────────────────────────────────────────────────────

    get loginButton() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("LOGIN")');
        }
        return $('~button-LOGIN');
    }

    // ─── Mensagens de erro ────────────────────────────────────────────────────

    get errorEmailMsg() {
        return $('android=new UiSelector().text("Please enter a valid email address")');
    }

    get errorPasswordMsg() {
        return $('android=new UiSelector().text("Please enter at least 8 characters")');
    }

    // ─── Modal de sucesso ─────────────────────────────────────────────────────

    get alertTitle() {
        return $('id=com.wdiodemoapp:id/alert_title');
    }

    get alertMessage() {
        return $('android=new UiSelector().resourceId("android:id/message")');
    }

    get alertOkButton() {
        return $('android=new UiSelector().resourceId("android:id/button1")');
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async acessarTelaLogin() {
        const menuBtn = await this.loginMenuButton;
        await menuBtn.waitForDisplayed({ timeout: 15000 });
        await menuBtn.click();
        await (await this.loginSignUpTitle).waitForDisplayed({ timeout: 15000 });
    }

    async login(email, password) {
        const emailEl = await this.emailField;
        await emailEl.waitForDisplayed({ timeout: 15000 });
        await emailEl.clearValue();
        if (email) await emailEl.setValue(email);

        const passEl = await this.passwordField;
        await passEl.waitForDisplayed({ timeout: 15000 });
        await passEl.clearValue();
        if (password) await passEl.setValue(password);

        await (await this.loginButton).click();
    }

    async clicarLoginSemPreencher() {
        const btn = await this.loginButton;
        await btn.waitForDisplayed({ timeout: 15000 });
        await btn.click();
    }

    async fecharModalSucesso() {
        const btn = await this.alertOkButton;
        await btn.waitForDisplayed({ timeout: 15000 });
        await btn.click();
    }
}

module.exports = new LoginPage();
