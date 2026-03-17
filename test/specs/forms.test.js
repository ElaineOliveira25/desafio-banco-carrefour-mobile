'use strict';

const { expect } = require('chai');
const allure = require('@wdio/allure-reporter').default;
const { resetApp } = require('../helpers/appHelper');
const FormsPage = require('../pageobjects/forms.page');

describe('Preenchimento do formulário', () => {
    before(async () => {
        await resetApp();
    });

    it('Deve preencher o formulário, interagir com switch e dropdown, e validar o modal', async () => {
        allure.addStory('Preenchimento do Forms');
        allure.addSeverity('critical');
        allure.addDescription(
            'Verifica o preenchimento do campo de texto, alteração do switch, seleção do dropdown '
            + 'e exibição/fechamento do modal ao selecionar Active.',
        );

        // ── Acessar tela Forms ────────────────────────────────────────────────
        allure.startStep('Clicar em Forms e validar elementos principais da tela');
        await FormsPage.acessarTelaForms();
        await (await FormsPage.formComponentsTitle).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');

        // ── Preencher campo de texto ──────────────────────────────────────────
        allure.startStep('Preencher o campo text-input e validar o texto refletido');
        await FormsPage.preencherTextInput('Teste de QA');
        const inputResult = await FormsPage.inputTextResult;
        await inputResult.waitForDisplayed({ timeout: 15000 });
        expect(await inputResult.getText()).to.equal('Teste de QA');
        allure.endStep('passed');

        // ── Interagir com switch ──────────────────────────────────────────────
        allure.startStep('Validar estado inicial do switch, clicar e validar mudança');
        const sw = await FormsPage.switchButton;
        await sw.waitForDisplayed({ timeout: 15000 });
        expect(await sw.getAttribute('checked')).to.equal('false');
        await FormsPage.clicarSwitch();
        await driver.waitUntil(
            async () => (await (await FormsPage.switchButton).getAttribute('checked')) === 'true',
            { timeout: 15000, timeoutMsg: 'Switch não passou para ON após 15s' },
        );
        expect(await (await FormsPage.switchButton).getAttribute('checked')).to.equal('true');
        allure.endStep('passed');

        // ── Selecionar opção no dropdown ──────────────────────────────────────
        allure.startStep('Selecionar opção no dropdown e validar valor selecionado');
        await FormsPage.selecionarOpcaoDropdown();
        expect(await (await FormsPage.dropdownField).getText()).to.equal('webdriver.io is awesome');
        allure.endStep('passed');

        // ── Abrir modal ───────────────────────────────────────────────────────
        allure.startStep('Clicar em Inactive, depois em Active e validar exibição do modal');
        await FormsPage.abrirModal();
        await (await FormsPage.modalTitle).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.modalMessage).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.modalButton1).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.modalButton2).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.modalButton3).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');

        // ── Fechar modal ──────────────────────────────────────────────────────
        allure.startStep('Clicar no botão principal do modal e validar que foi fechado');
        await FormsPage.fecharModal();
        await (await FormsPage.modalTitle).waitForDisplayed({ timeout: 5000, reverse: true });
        await (await FormsPage.modalMessage).waitForDisplayed({ timeout: 5000, reverse: true });
        allure.endStep('passed');
    });
});
