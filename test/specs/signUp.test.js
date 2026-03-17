'use strict';

const { expect } = require('chai');
const allure = require('@wdio/allure-reporter').default;
const { resetApp } = require('../helpers/appHelper');
const LoginPage = require('../pageobjects/login.page');
const SignUpPage = require('../pageobjects/signUp.page');
const dataSignUp = require('../data/dataSignUp.json');

describe('Tela de Sign Up', () => {
    beforeEach(async () => {
        allure.addFeature('Tela de Sign Up');
        await resetApp();
    });

    it('Deve realizar cadastro com sucesso ao informar dados válidos', async () => {
        allure.addStory('Cadastro válido');
        allure.addSeverity('critical');

        await LoginPage.acessarTelaLogin();
        await (await LoginPage.loginSignUpTitle).waitForDisplayed({ timeout: 15000 });

        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.validSignUpUser.email,
            dataSignUp.validSignUpUser.password,
            dataSignUp.validSignUpUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        const alertTitle = await SignUpPage.alertTitle;
        await alertTitle.waitForDisplayed({ timeout: 20000 });
        expect(await alertTitle.getText()).to.equal('Signed Up!');
        await (await SignUpPage.alertOkButton).waitForDisplayed({ timeout: 15000 });
    });

    it('Deve exibir mensagens de erro ao tentar cadastrar com todos os campos vazios', async () => {
        allure.addStory('Validação de campos obrigatórios');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorEmailMsg).waitForDisplayed({ timeout: 15000 });
        await (await SignUpPage.errorPasswordMsg).waitForDisplayed({ timeout: 15000 });
        await (await SignUpPage.errorConfirmPasswordMsg).waitForDisplayed({ timeout: 15000 });
    });

    it('Deve exibir erro quando o password possuir menos de 8 caracteres', async () => {
        allure.addStory('Validação de tamanho do password');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.shortPasswordSignUpUser.email,
            dataSignUp.shortPasswordSignUpUser.password,
            dataSignUp.shortPasswordSignUpUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorPasswordMsg).waitForDisplayed({ timeout: 15000 });
    });

    it('Deve exibir erro quando password e confirm password forem diferentes', async () => {
        allure.addStory('Validação de confirmação de password');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.mismatchedPasswordSignUpUser.email,
            dataSignUp.mismatchedPasswordSignUpUser.password,
            dataSignUp.mismatchedPasswordSignUpUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorConfirmPasswordMsg).waitForDisplayed({ timeout: 15000 });
    });
});
