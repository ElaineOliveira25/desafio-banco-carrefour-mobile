'use strict';

const { BasePage } = require('./common.component');

/**
 * SignUpPage — selectors and actions for the Sign Up screen.
 */
class SignUpPage extends BasePage {
    // ─── Navegação ────────────────────────────────────────────────────────────

    get signUpTab() {
        return $('android=new UiSelector().description("button-sign-up-container")');
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

    get confirmPasswordField() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().className("android.widget.EditText").instance(2)');
        }
        return $('~input-repeat-password');
    }

    // ─── Botões ───────────────────────────────────────────────────────────────

    get signUpButton() {
        return $('android=new UiSelector().text("SIGN UP")');
    }

    // ─── Modal de sucesso ─────────────────────────────────────────────────────

    get alertTitle() {
        return $('id=com.wdiodemoapp:id/alert_title');
    }

    get alertOkButton() {
        return $('android=new UiSelector().resourceId("android:id/button1")');
    }

    // ─── Mensagens de erro ────────────────────────────────────────────────────

    get errorEmailMsg() {
        return $('android=new UiSelector().text("Please enter a valid email address")');
    }

    get errorPasswordMsg() {
        return $('android=new UiSelector().text("Please enter at least 8 characters")');
    }

    get errorConfirmPasswordMsg() {
        return $('android=new UiSelector().text("Please enter the same password")');
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async acessarAbaSignUp() {
        const tab = await this.signUpTab;
        await tab.waitForDisplayed({ timeout: 15000 });
        await tab.click();
    }

    async preencherCampos(email, password, confirmPassword) {
        const emailEl = await this.emailField;
        await emailEl.waitForDisplayed({ timeout: 15000 });
        await emailEl.setValue(email);

        const passEl = await this.passwordField;
        await passEl.waitForDisplayed({ timeout: 15000 });
        await passEl.setValue(password);

        const confirmEl = await this.confirmPasswordField;
        await confirmEl.waitForDisplayed({ timeout: 15000 });
        await confirmEl.setValue(confirmPassword);
    }

    async clicarSignUp() {
        const btn = await this.signUpButton;
        await btn.waitForDisplayed({ timeout: 15000 });
        await btn.click();
    }
}

module.exports = new SignUpPage();
