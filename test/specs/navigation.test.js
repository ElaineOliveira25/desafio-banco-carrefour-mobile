'use strict';

const allure = require('@wdio/allure-reporter').default;
const { resetApp } = require('../helpers/appHelper');
const { homePage, navigationPage } = require('../pageobjects/common.component');
const LoginPage = require('../pageobjects/login.page');
const SignUpPage = require('../pageobjects/signUp.page');
const FormsPage = require('../pageobjects/forms.page');

describe('Navegação entre telas', () => {
    before(async () => {
        await resetApp();
    });

    it('Deve navegar por todas as telas do app e validar seus elementos', async () => {
        allure.addFeature('Navegação entre telas');
        allure.addStory('Fluxo completo de navegação');
        allure.addSeverity('critical');

        allure.startStep('Home — validar elementos da tela inicial');
        await homePage.acessarTelaHome();
        await (await homePage.homeImage).waitForDisplayed({ timeout: 15000 });
        await (await homePage.webdriverTitle).waitForDisplayed({ timeout: 15000 });
        await (await homePage.supportText).waitForDisplayed({ timeout: 15000 });
        await (await homePage.demoText).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');

        allure.startStep('Webview — abrir e fechar barra de navegação');
        await navigationPage.acessarTelaWebview();
        await navigationPage.abrirBarraNavegacao();
        await navigationPage.fecharBarraNavegacao();
        allure.endStep('passed');

        allure.startStep('Login — validar campos da tela de login');
        await LoginPage.acessarTelaLogin();
        await (await LoginPage.loginSignUpTitle).waitForDisplayed({ timeout: 15000 });
        await (await LoginPage.emailField).waitForDisplayed({ timeout: 15000 });
        await (await LoginPage.passwordField).waitForDisplayed({ timeout: 15000 });
        await (await LoginPage.loginButton).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');

        allure.startStep('Sign Up — validar campos da aba de cadastro');
        await SignUpPage.acessarAbaSignUp();
        await (await SignUpPage.emailField).waitForDisplayed({ timeout: 15000 });
        await (await SignUpPage.passwordField).waitForDisplayed({ timeout: 15000 });
        await (await SignUpPage.confirmPasswordField).waitForDisplayed({ timeout: 15000 });
        await (await SignUpPage.signUpButton).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');

        allure.startStep('Forms — validar elementos do formulário');
        await FormsPage.acessarTelaForms();
        await (await FormsPage.formComponentsTitle).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.textInput).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.inputTextResult).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.switchLabel).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.dropdownLabel).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.dropdownDefaultOption).waitForDisplayed({ timeout: 15000 });
        await (await FormsPage.formsViewGroup).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');

        allure.startStep('Swipe — validar tela de gestos');
        await navigationPage.acessarTelaSwipe();
        await (await navigationPage.swipeTitle).waitForDisplayed({ timeout: 15000 });
        await (await navigationPage.swipeSubtitle).waitForDisplayed({ timeout: 15000 });
        await (await navigationPage.swipeCard).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');

        allure.startStep('Drag — validar tela de drag and drop');
        await navigationPage.acessarTelaDrag();
        await (await navigationPage.dragTitle).waitForDisplayed({ timeout: 15000 });
        allure.endStep('passed');
    });
});
