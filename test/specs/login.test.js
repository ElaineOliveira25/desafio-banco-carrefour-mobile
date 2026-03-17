'use strict';

const { expect } = require('chai');
const allure     = require('@wdio/allure-reporter').default;
const { resetApp } = require('../helpers/appHelper');
const LoginPage    = require('../pageobjects/login.page');
const dataLogin    = require('../data/dataLogin.json');

describe('Tela de Login', () => {
    beforeEach(async () => {
        allure.addFeature('Tela de Login');
        await resetApp();
    });

    it('[TC-01] Deve realizar login com sucesso utilizando credenciais válidas', async () => {
        allure.addStory('Login válido');
        allure.addSeverity('critical');

        await LoginPage.acessarTelaLogin();

        await (await LoginPage.loginSignUpTitle).waitForDisplayed({ timeout: 10000 });

        await LoginPage.login(dataLogin.validUser.email, dataLogin.validUser.password);

        const alertTitle = await LoginPage.alertTitle;
        await alertTitle.waitForDisplayed({ timeout: 20000 });
        expect(await alertTitle.getText()).to.equal('Success');

        await (await LoginPage.alertMessage).waitForDisplayed({ timeout: 10000 });
        await (await LoginPage.alertOkButton).waitForDisplayed({ timeout: 10000 });

        await LoginPage.fecharModalSucesso();
    });

    it('[TC-02] Deve exibir mensagens de erro ao tentar logar sem preencher email e senha', async () => {
        allure.addStory('Validação de campos obrigatórios');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await LoginPage.clicarLoginSemPreencher();

        await (await LoginPage.errorEmailMsg).waitForDisplayed({ timeout: 10000 });
        await (await LoginPage.errorPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-03] Deve exibir mensagem de erro ao informar email inválido', async () => {
        allure.addStory('Validação de email inválido');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await LoginPage.login(dataLogin.invalidEmail.email, dataLogin.invalidEmail.password);

        await (await LoginPage.errorEmailMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-04] Deve exibir mensagem de erro quando a senha não for preenchida', async () => {
        allure.addStory('Senha obrigatória');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await LoginPage.login(dataLogin.validEmailEmptyPassword.email, '');

        await (await LoginPage.errorPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-05] Deve exibir erro quando a senha possuir menos de 8 caracteres', async () => {
        allure.addStory('Validação de tamanho da senha');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await LoginPage.login(dataLogin.shortPassword.email, dataLogin.shortPassword.password);

        await (await LoginPage.errorPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });
});
