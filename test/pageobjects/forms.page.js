'use strict';

const { BasePage } = require('./common.component');

/**
 * FormsPage — selectors and actions for the Forms screen.
 */
class FormsPage extends BasePage {
    // ─── Navegação ────────────────────────────────────────────────────────────

    get formsMenuButton() {
        return $('~Forms');
    }

    // ─── Título ───────────────────────────────────────────────────────────────

    get formComponentsTitle() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Form components")');
        }
        return $('~Form components');
    }

    // ─── Campo de texto ───────────────────────────────────────────────────────

    get textInput() {
        return $('~text-input');
    }

    get inputTextResult() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().description("input-text-result")');
        }
        return $('~input-text-result');
    }

    // ─── Switch ───────────────────────────────────────────────────────────────

    get switchLabel() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Switch:")');
        }
        return $('~Switch:');
    }

    get switchButton() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().className("android.widget.Switch")');
        }
        return $('~switch');
    }

    // ─── Dropdown ─────────────────────────────────────────────────────────────

    get dropdownLabel() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Dropdown:")');
        }
        return $('~Dropdown:');
    }

    get dropdownField() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().resourceId("text_input")');
        }
        return $('~text_input');
    }

    get dropdownOptionAwesome() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("webdriver.io is awesome")');
        }
        return $('~webdriver.io is awesome');
    }

    get dropdownDefaultOption() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Active")');
        }
        return $('~Active');
    }

    // ─── Botões Active / Inactive ─────────────────────────────────────────────

    get inactiveButton() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Inactive")');
        }
        return $('~Inactive');
    }

    get activeButton() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().text("Active")');
        }
        return $('~Active');
    }

    get formsViewGroup() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().className("android.view.ViewGroup").instance(20)');
        }
        return $('~forms-view-group');
    }

    // ─── Modal ────────────────────────────────────────────────────────────────

    get modalTitle() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().resourceId("com.wdiodemoapp:id/alert_title")');
        }
        return $('~alert-title');
    }

    get modalMessage() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().resourceId("android:id/message")');
        }
        return $('~alert-message');
    }

    get modalButton1() {
        if (driver.isAndroid) {
            return $('//android.widget.Button[@resource-id="android:id/button1"]');
        }
        return $('~button1');
    }

    get modalButton2() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().resourceId("android:id/button2")');
        }
        return $('~button2');
    }

    get modalButton3() {
        if (driver.isAndroid) {
            return $('android=new UiSelector().resourceId("android:id/button3")');
        }
        return $('~button3');
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async acessarTelaForms() {
        const btn = await this.formsMenuButton;
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    async preencherTextInput(text) {
        const input = await this.textInput;
        await input.waitForDisplayed({ timeout: 10000 });
        await input.click();
        await input.clearValue();
        await input.setValue(text);
        await driver.hideKeyboard().catch(() => {});
    }

    async clicarSwitch() {
        const sw = await this.switchButton;
        await sw.waitForDisplayed({ timeout: 10000 });
        await sw.click();
    }

    async selecionarOpcaoDropdown() {
        const field = await this.dropdownField;
        await field.waitForDisplayed({ timeout: 10000 });
        await field.click();
        const option = await this.dropdownOptionAwesome;
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async abrirModal() {
        // Clica em Inactive para deselecionar, depois em Active para acionar o modal
        const inactive = await this.inactiveButton;
        await inactive.waitForDisplayed({ timeout: 10000 });
        await inactive.click();
        const active = await this.activeButton;
        await active.waitForDisplayed({ timeout: 10000 });
        await active.click();
    }

    async fecharModal() {
        const btn = await this.modalButton1;
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }
}

module.exports = new FormsPage();
