'use strict';

const { expect } = require('chai');
const allure     = require('@wdio/allure-reporter').default;
const { resetApp } = require('../helpers/appHelper');
const LoginPage    = require('../pageobjects/login.page');
const SignUpPage    = require('../pageobjects/signUp.page');
const dataSignUp   = require('../data/dataSignUp.json');

describe('Tela de Sign Up', () => {
    beforeEach(async () => {
        allure.addFeature('Tela de Sign Up');
        await resetApp();
    });

    it('[TC-01] Deve realizar cadastro com sucesso ao informar dados válidos', async () => {
        allure.addStory('Cadastro válido');
        allure.addSeverity('critical');

        await LoginPage.acessarTelaLogin();
        await (await LoginPage.loginSignUpTitle).waitForDisplayed({ timeout: 10000 });

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
        await (await SignUpPage.alertOkButton).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-02] Deve exibir mensagens de erro ao tentar cadastrar com todos os campos vazios', async () => {
        allure.addStory('Validação de campos obrigatórios');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorEmailMsg).waitForDisplayed({ timeout: 10000 });
        await (await SignUpPage.errorPasswordMsg).waitForDisplayed({ timeout: 10000 });
        await (await SignUpPage.errorConfirmPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-03] Deve exibir mensagem de erro ao informar email inválido', async () => {
        allure.addStory('Validação de email inválido');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.invalidEmailSignUpUser.email,
            dataSignUp.invalidEmailSignUpUser.password,
            dataSignUp.invalidEmailSignUpUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorEmailMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-04] Deve exibir erro quando o password possuir menos de 8 caracteres', async () => {
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

        await (await SignUpPage.errorPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-05] Deve exibir erro quando o confirm password possuir menos de 8 caracteres', async () => {
        allure.addStory('Validação de tamanho do confirm password');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.shortConfirmPasswordUser.email,
            dataSignUp.shortConfirmPasswordUser.password,
            dataSignUp.shortConfirmPasswordUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorConfirmPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-06] Deve exibir erro quando o password não for preenchido', async () => {
        allure.addStory('Password obrigatório');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.emptyPasswordSignUpUser.email,
            dataSignUp.emptyPasswordSignUpUser.password,
            dataSignUp.emptyPasswordSignUpUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-07] Deve exibir erro quando o confirm password não for preenchido', async () => {
        allure.addStory('Confirm Password obrigatório');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.emptyConfirmPasswordSignUpUser.email,
            dataSignUp.emptyConfirmPasswordSignUpUser.password,
            dataSignUp.emptyConfirmPasswordSignUpUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorConfirmPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-08] Deve exibir erro quando o email não for preenchido', async () => {
        allure.addStory('Email obrigatório');
        allure.addSeverity('high');

        await LoginPage.acessarTelaLogin();
        await SignUpPage.acessarAbaSignUp();
        await SignUpPage.preencherCampos(
            dataSignUp.emptyEmailSignUpUser.email,
            dataSignUp.emptyEmailSignUpUser.password,
            dataSignUp.emptyEmailSignUpUser.confirmPassword,
        );
        await SignUpPage.clicarSignUp();

        await (await SignUpPage.errorEmailMsg).waitForDisplayed({ timeout: 10000 });
    });

    it('[TC-09] Deve exibir erro quando password e confirm password forem diferentes', async () => {
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

        await (await SignUpPage.errorConfirmPasswordMsg).waitForDisplayed({ timeout: 10000 });
    });
});
