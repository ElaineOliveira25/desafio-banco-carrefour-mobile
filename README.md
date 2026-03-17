# Desafio Banco Carrefour — Automação de Testes Mobile

> Guia completo para entender, configurar e executar o projeto do zero.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Objetivo do Projeto](#2-objetivo-do-projeto)
3. [Aplicativo Testado](#3-aplicativo-testado)
4. [Tecnologias Utilizadas](#4-tecnologias-utilizadas)
5. [Estrutura de Pastas](#5-estrutura-de-pastas)
6. [Papel de Cada Arquivo](#6-papel-de-cada-arquivo)
7. [Pré-requisitos e Instalação](#7-pré-requisitos-e-instalação)
8. [Configuração do Ambiente](#8-configuração-do-ambiente)
9. [Como Executar os Testes](#9-como-executar-os-testes)
10. [Cenários de Teste](#10-cenários-de-teste)
11. [Page Objects — Como Funcionam](#11-page-objects--como-funcionam)
12. [Helpers e Utilitários](#12-helpers-e-utilitários)
13. [Massa de Dados (Fixtures)](#13-massa-de-dados-fixtures)
14. [Validações Implementadas](#14-validações-implementadas)
15. [Fluxo de Execução Completo](#15-fluxo-de-execução-completo)
16. [Relatórios com Allure](#16-relatórios-com-allure)
17. [BrowserStack — Testes em Nuvem](#17-browserstack--testes-em-nuvem)
18. [CI/CD — GitHub Actions](#18-cicd--github-actions)
19. [Boas Práticas Adotadas](#19-boas-práticas-adotadas)
20. [Guia de Manutenção](#20-guia-de-manutenção)
21. [Glossário](#21-glossário)

---

## 1. Visão Geral

Este projeto é uma **suíte de testes automatizados mobile** criada para validar o funcionamento do aplicativo nativo de demonstração do WebdriverIO (`android.wdio.native.app.v2.0.0.apk`).

Automação de testes significa que, em vez de uma pessoa abrir o aplicativo manualmente e clicar em cada botão para verificar se tudo funciona, um programa faz isso automaticamente. Ele abre o app, preenche campos, clica em botões, lê mensagens na tela e verifica se o resultado é o esperado — tudo sem intervenção humana.

O projeto foi desenvolvido como parte do **Desafio Banco Carrefour**, com foco em qualidade de software mobile.

---

## 2. Objetivo do Projeto

- Garantir que as funcionalidades principais do app funcionam corretamente
- Detectar regressões automaticamente (quando uma mudança quebra algo que já funcionava)
- Documentar o comportamento esperado de cada tela através dos testes
- Demonstrar boas práticas de automação mobile com WebdriverIO + Appium

---

## 3. Aplicativo Testado

| Item | Detalhe |
|------|---------|
| **Nome** | WebdriverIO Native Demo App |
| **Versão** | 2.0.0 |
| **Plataforma** | Android (APK) e iOS (.app) |
| **Package ID Android** | `com.wdiodemoapp` |
| **Bundle ID iOS** | `org.wdiodemoapp` |
| **Download** | [github.com/webdriverio/native-demo-app/releases](https://github.com/webdriverio/native-demo-app/releases) |
| **Tipo** | App de demonstração — não é um app real de produção |

O app possui 5 telas acessíveis pela barra de navegação inferior:
- **Home** — tela inicial com logo e informações
- **Webview** — abre uma página web dentro do app
- **Login / Sign Up** — formulários de autenticação
- **Forms** — componentes de formulário (input, switch, dropdown, modal)
- **Swipe / Drag** — telas de gestos mobile

---

## 4. Tecnologias Utilizadas

| Tecnologia | Para que serve | Versão |
|-----------|---------------|--------|
| **Node.js** | Ambiente de execução JavaScript | ≥ 18 |
| **WebdriverIO** | Framework de automação que controla o app | 8.x |
| **Appium** | Servidor que faz a ponte entre o teste e o dispositivo | 2.x |
| **UiAutomator2** | Driver Android que executa as ações no app | 2.x |
| **Mocha** | Framework de testes (organiza describes e its) | bundled |
| **Chai** | Biblioteca de asserções (expect, assert) | 4.x |
| **Allure** | Geração de relatórios HTML bonitos com screenshots | 2.x |
| **dotenv** | Carrega variáveis de ambiente do arquivo `.env` | 17.x |
| **BrowserStack** | Plataforma cloud para rodar testes em dispositivos reais | — |

---

## 5. Estrutura de Pastas

```
desafio-banco-carrefour/
│
├── app/
│   ├── android/
│   │   └── android.wdio.native.app.v2.0.0.apk  ← APK Android (não versionado)
│   ├── ios/
│   │   └── wdio-native-app.v2.0.0.app           ← App iOS (não versionado)
│   └── readme.txt                                ← Instruções para baixar os apps
│
├── test/
│   ├── data/
│   │   ├── dataLogin.json                    ← Dados de teste para login
│   │   └── dataSignUp.json                   ← Dados de teste para cadastro
│   │
│   ├── helpers/
│   │   ├── appHelper.js                      ← Função para reiniciar o app
│   │   └── screenshotHelper.js               ← Captura screenshots em falhas
│   │
│   ├── pageobjects/
│   │   ├── common.component.js               ← Base + Home + Navegação
│   │   ├── login.page.js                     ← Tela de Login
│   │   ├── signUp.page.js                    ← Tela de Sign Up
│   │   └── forms.page.js                     ← Tela de Forms
│   │
│   └── specs/
│       ├── login.test.js                     ← Testes da tela de Login
│       ├── signUp.test.js                    ← Testes da tela de Sign Up
│       ├── navigation.test.js                ← Testes de navegação entre telas
│       └── forms.test.js                     ← Testes do formulário
│
├── scripts/
│   └── open-report.js                        ← Abre o relatório Allure no browser
│
├── .env                                      ← Credenciais locais (não versionado)
├── .env.example                              ← Modelo do .env para novos devs
├── .eslintrc.json                            ← Regras de qualidade de código
├── .gitignore                                ← Arquivos ignorados pelo Git
├── .github/workflows/android.yml            ← Pipeline CI/CD (GitHub Actions)
├── package.json                              ← Dependências e scripts npm
├── package-lock.json                         ← Versões exatas das dependências
├── README.md                                 ← Este arquivo
└── wdio.conf.js                              ← Configuração central do WebdriverIO
```

---

## 6. Papel de Cada Arquivo

### `wdio.conf.js` — O Cérebro do Projeto

É o arquivo de configuração central. Ele define:
- Quais arquivos de teste executar
- Qual dispositivo/emulador usar
- Qual framework de testes usar (Mocha)
- Onde salvar os relatórios
- O que fazer antes e depois dos testes (hooks)
- Se roda local ou no BrowserStack

```
RUN_ON_BS=false → usa emulador local
RUN_ON_BS=true  → usa BrowserStack (dispositivo real na nuvem)
```

### `package.json` — Central de Comandos

Lista todas as dependências do projeto e os atalhos de comando (`scripts`):

```json
"test"                  → roda todos os testes (Android) + gera relatório
"test:login"            → roda só os testes de login (Android)
"test:signup"           → roda só os testes de cadastro (Android)
"test:navigation"       → roda só os testes de navegação (Android)
"test:forms"            → roda só os testes de formulário (Android)
"test:android"          → roda toda a suíte explicitamente em Android
"test:ios"              → roda toda a suíte em iOS
"test:ios:login"        → roda só os testes de login (iOS)
"test:ios:signup"       → roda só os testes de cadastro (iOS)
"test:ios:navigation"   → roda só os testes de navegação (iOS)
"test:ios:forms"        → roda só os testes de formulário (iOS)
"test:browserstack"     → roda no BrowserStack Android (nuvem)
"test:browserstack:ios" → roda no BrowserStack iOS (nuvem)
"allure:report"         → gera e abre o relatório HTML
"clean"                 → limpa pastas de resultados
```

### `test/specs/` — Os Testes em Si

São os arquivos que contêm os casos de teste. Cada `it(...)` é um cenário de teste.

### `test/pageobjects/` — Mapa do Aplicativo

Cada arquivo representa uma tela do app. Em vez de escrever o seletor do botão diretamente no teste, ele fica aqui. Isso facilita a manutenção: se o botão mudar de nome, você corrige em um lugar só.

### `test/helpers/` — Funções de Suporte

Funções genéricas usadas por vários testes:
- `appHelper.js` → reinicia o app
- `screenshotHelper.js` → tira screenshot quando um teste falha

### `test/data/` — Massa de Dados

Arquivos JSON com os dados usados nos testes (emails, senhas, etc.). Centralizar os dados aqui facilita atualizá-los sem mexer no código dos testes.

### `.env` / `.env.example`

O `.env` guarda informações sensíveis (credenciais do BrowserStack) que **não devem ir para o Git**. O `.env.example` é o modelo que os desenvolvedores copiam ao configurar o projeto.

---

## 7. Pré-requisitos e Instalação

### 7.1 Ferramentas Necessárias

#### Node.js (versão 18 ou superior)
Ambiente que executa o JavaScript do projeto.

```bash
# Verificar se já está instalado:
node --version   # deve mostrar v18.x.x ou superior
npm --version    # deve mostrar 9.x.x ou superior

# Instalar: https://nodejs.org/en/download
```

#### Java JDK (versão 11 ou superior)
Necessário para o Android SDK funcionar.

```bash
# Verificar:
java -version   # deve mostrar openjdk 11 ou superior

# Instalar no Ubuntu/Debian:
sudo apt install openjdk-17-jdk
```

#### Android SDK e ADB
Ferramentas para comunicar com o emulador Android.

```bash
# Verificar:
adb --version

# Instalar via Android Studio:
# https://developer.android.com/studio
# Após instalar, adicionar ao PATH:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

#### Appium 2
Servidor que recebe os comandos do WebdriverIO e os executa no dispositivo.

```bash
# Instalar globalmente:
npm install -g appium

# Verificar:
appium --version   # deve mostrar 2.x.x

# Instalar o driver Android:
appium driver install uiautomator2

# Verificar drivers instalados:
appium driver list --installed
```

#### Allure CLI
Ferramenta para gerar os relatórios HTML.

```bash
# Instalar globalmente:
npm install -g allure-commandline

# Verificar:
allure --version
```

### 7.2 Configurar o Emulador Android

#### Opção A — Android Studio (recomendado para iniciantes)

1. Baixe e instale o [Android Studio](https://developer.android.com/studio)
2. Abra o Android Studio → **More Actions** → **Virtual Device Manager**
3. Clique em **Create Device**
4. Escolha: **Pixel 4** (ou qualquer modelo)
5. Selecione a imagem do sistema: **API 30** (Android 11) ou superior
6. Finalize e clique em ▶ para iniciar o emulador
7. Confirme que está rodando:

```bash
adb devices
# Deve mostrar: emulator-5554   device
```

#### Opção B — Linha de comando

```bash
# Listar emuladores disponíveis:
emulator -list-avds

# Iniciar um emulador:
emulator -avd nome_do_seu_avd &

# Aguardar boot completo:
adb wait-for-device
adb shell getprop sys.boot_completed   # aguarda retornar "1"
```

### 7.3 Instalar o Projeto

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd desafio-banco-carrefour

# 2. Instale as dependências
npm ci

# 3. Baixe o app
# Acesse: https://github.com/webdriverio/native-demo-app/releases
# Android: baixe android.wdio.native.app.v2.0.0.apk → coloque em app/android/
# iOS:     baixe wdio-native-app.v2.0.0.app         → coloque em app/ios/

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações (veja seção 8)
```

---

## 8. Configuração do Ambiente

Copie o `.env.example` para `.env` e preencha os valores:

```bash
# ─── Execução ─────────────────────────────────────────────────────────────────
RUN_ON_BS=false          # false = emulador local | true = BrowserStack
PLATFORM=android         # android (padrão) | ios

# ─── Appium local ────────────────────────────────────────────────────────────
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723

# ─── Dispositivo Android local ───────────────────────────────────────────────
DEVICE_NAME=Android Emulator

# ─── Dispositivo iOS local (só necessário quando PLATFORM=ios) ───────────────
IOS_VERSION=17.0         # versão do simulador iOS
IOS_UDID=                # UDID do simulador (opcional, auto-detectado)

# ─── BrowserStack Android (só necessário quando RUN_ON_BS=true) ──────────────
BROWSERSTACK_USER=seu_usuario
BROWSERSTACK_KEY=sua_chave
BROWSERSTACK_ANDROID_APP=bs://hash_do_app_android
BS_ANDROID_DEVICE=Google Pixel 8
BS_ANDROID_VERSION=14.0

# ─── BrowserStack iOS (só necessário quando RUN_ON_BS=true e PLATFORM=ios) ───
BROWSERSTACK_IOS_APP=bs://hash_do_app_ios
BS_IOS_DEVICE=iPhone 15
BS_IOS_VERSION=17

# ─── Build name (aparece no relatório BrowserStack) ──────────────────────────
BUILD_NAME=Mobile Regression

# ─── Timeouts opcionais ──────────────────────────────────────────────────────
LOG_LEVEL=error
WAIT_TIMEOUT=15000
MOCHA_TIMEOUT=120000
```

> **Importante:** o arquivo `.env` nunca deve ser commitado no Git. Ele já está listado no `.gitignore`.

---

## 9. Como Executar os Testes

### Pré-condição
O emulador deve estar rodando antes de executar qualquer teste local:

```bash
adb devices
# Deve mostrar: emulator-5554   device
```

### Rodar toda a suíte

```bash
npm test
```

Isso executa todos os 4 arquivos de spec em sequência (Android) e abre o relatório Allure ao final.

### Rodar um grupo específico — Android

```bash
npm run test:login        # só testes de login
npm run test:signup       # só testes de cadastro
npm run test:navigation   # só teste de navegação
npm run test:forms        # só teste de formulário
npm run test:android      # suíte completa (equivalente a npm test com PLATFORM=android)
```

### Rodar em iOS (Simulador)

Requer Xcode, simulador configurado e driver XCUITest instalado (`appium driver install xcuitest`).

```bash
npm run test:ios              # suíte completa em iOS
npm run test:ios:login        # só testes de login (iOS)
npm run test:ios:signup       # só testes de cadastro (iOS)
npm run test:ios:navigation   # só teste de navegação (iOS)
npm run test:ios:forms        # só teste de formulário (iOS)
```

### Rodar no BrowserStack

```bash
npm run test:browserstack        # Android no BrowserStack
npm run test:browserstack:ios    # iOS no BrowserStack
```

Certifique-se de que as variáveis BrowserStack estão preenchidas no `.env` (veja seção 8).

### Gerar e abrir o relatório manualmente

```bash
npm run allure:report
```

### Limpar artefatos gerados

```bash
npm run clean
```

Remove as pastas `allure-results/`, `allure-report/` e `errorShots/`.

---

## 10. Cenários de Teste

### Login (`test/specs/login.test.js`) — 4 testes

| ID | Cenário | Dados usados | Resultado esperado |
|----|---------|-------------|-------------------|
| TC-01 | Login com credenciais válidas | `validUser` | Modal "Success" aparece |
| TC-02 | Login sem preencher nenhum campo | — | Mensagens de erro para email e senha |
| TC-03 | Login com email em formato inválido | `invalidEmail` | Mensagem de erro no campo email |
| TC-04 | Login com senha menor que 8 caracteres | `shortPassword` | Mensagem de erro no campo senha |

**Exemplo de como o TC-01 funciona:**
1. O app é reiniciado (`resetApp`)
2. O teste navega até a tela de Login
3. Preenche email: `teste@teste.com` e senha: `12345678`
4. Clica no botão LOGIN
5. Aguarda aparecer o modal de sucesso
6. Verifica que o título do modal é exatamente `"Success"`
7. Fecha o modal

---

### Sign Up (`test/specs/signUp.test.js`) — 4 testes

| ID | Cenário | Dados usados | Resultado esperado |
|----|---------|-------------|-------------------|
| TC-01 | Cadastro com dados válidos | `validSignUpUser` | Modal "Signed Up!" aparece |
| TC-02 | Cadastro com todos os campos vazios | — | 3 mensagens de erro (email, senha, confirmação) |
| TC-03 | Senha com menos de 8 caracteres | `shortPasswordSignUpUser` | Erro no campo senha |
| TC-04 | Senha e confirmação diferentes | `mismatchedPasswordSignUpUser` | Erro "Please enter the same password" |

---

### Navegação (`test/specs/navigation.test.js`) — 1 teste com 7 steps

| ID | Cenário | O que valida |
|----|---------|-------------|
| TC-06 | Navegação completa por todas as telas | Home, Webview, Login, Sign Up, Forms, Swipe, Drag |

Este teste percorre todas as telas do app em sequência, verificando que cada uma carrega corretamente seus elementos. Cada tela é um **step** no relatório Allure.

**Fluxo:**
```
Home → valida logo e textos
  ↓
Webview → abre e fecha barra de navegação
  ↓
Login → valida campos de email, senha e botão
  ↓
Sign Up → valida campos de cadastro
  ↓
Forms → valida input, switch, dropdown
  ↓
Swipe → valida título e cards
  ↓
Drag → valida tela de drag and drop
```

---

### Forms (`test/specs/forms.test.js`) — 1 teste com 6 steps

| ID | Cenário | Steps |
|----|---------|-------|
| TC-10 | Preenchimento completo do formulário | Acessar tela → Input → Switch → Dropdown → Abrir modal → Fechar modal |

**Fluxo detalhado:**
1. Acessa a tela Forms e verifica que o título "Form components" está visível
2. Preenche o campo de texto com `"Teste de QA"` e verifica que o resultado espelha o texto digitado
3. Verifica que o switch começa desligado (`checked="false"`), clica nele e verifica que ficou ligado (`checked="true"`)
4. Abre o dropdown e seleciona `"webdriver.io is awesome"`, verifica o valor selecionado
5. Clica em "Inactive" depois em "Active" para abrir o modal, verifica título, mensagem e 3 botões
6. Fecha o modal clicando no botão principal e verifica que sumiu da tela

---

## 11. Page Objects — Como Funcionam

O padrão **Page Object Model (POM)** é uma prática que separa o código dos testes da localização dos elementos na tela.

### Sem POM (ruim):
```js
// O seletor está misturado com a lógica do teste
await $('android=new UiSelector().className("android.widget.EditText").instance(0)').setValue('teste@teste.com');
await $('android=new UiSelector().text("LOGIN")').click();
```

### Com POM (bom):
```js
// No page object (login.page.js):
get emailField() {
    return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
}

// No teste (login.test.js):
await LoginPage.login('teste@teste.com', '12345678');
```

Se o seletor do campo email mudar, você só precisa atualizar `login.page.js` — todos os testes continuam funcionando.

### Hierarquia de classes

```
BasePage (common.component.js)
   └── HomeComponent     → tela Home
   └── NavigationComponent → barras de navegação
   └── LoginPage         → tela Login
   └── SignUpPage         → tela Sign Up
   └── FormsPage          → tela Forms
```

`BasePage` contém métodos genéricos usados por todos:

| Método | O que faz |
|--------|-----------|
| `waitForDisplayed(selector)` | Aguarda o elemento aparecer na tela (timeout: 15s) |
| `click(selector)` | Aguarda e clica no elemento |
| `setValue(selector, value)` | Aguarda, limpa e preenche um campo |
| `getText(selector)` | Aguarda e retorna o texto do elemento |
| `getAttribute(selector, attr)` | Retorna um atributo do elemento (ex: `checked`) |
| `hideKeyboard()` | Fecha o teclado virtual |

---

## 12. Helpers e Utilitários

### `appHelper.js` — Reiniciar o App

```js
await resetApp();
```

Usado no `beforeEach` de cada spec para garantir que o app começa do zero a cada teste. Isso é necessário porque o app mantém o estado anterior (mensagens de erro, campos preenchidos).

**Como funciona:**
1. Tenta encerrar o app com `mobile: terminateApp` (Appium local)
2. Se falhar, usa `mobile: clearApp` (BrowserStack)
3. Tenta abrir o app com `mobile: activateApp` (Appium local)
4. Se falhar, usa `mobile: startActivity` (BrowserStack)

Esse design de fallback garante que o mesmo código funciona tanto no emulador local quanto no BrowserStack.

---

### `screenshotHelper.js` — Screenshots em Falhas

Quando um teste falha, este helper é chamado automaticamente pelo `afterTest` do `wdio.conf.js`:

```js
await screenshotHelper.captureAndAttach('nome_do_teste');
```

**O que acontece:**
1. Tira uma screenshot da tela atual do dispositivo
2. Salva o arquivo em `errorShots/nome_do_teste.png`
3. Anexa a imagem ao relatório Allure para visualização

Isso facilita muito o diagnóstico de falhas: você abre o relatório e já vê uma foto de como estava a tela quando o teste quebrou.

---

### `scripts/open-report.js` — Abrir Relatório

Soluciona um problema específico deste ambiente Linux: o comando `allure serve` falha por incompatibilidade com Java/snap. Este script:

1. Pede uma porta aleatória disponível ao sistema operacional
2. Sobe um servidor HTTP simples (`http-server`) nessa porta
3. Abre o browser automaticamente na URL gerada (ex: `http://localhost:42731`)

Como a porta muda a cada execução, o browser nunca usa cache do relatório anterior.

---

## 13. Massa de Dados (Fixtures)

Os dados de teste ficam centralizados em arquivos JSON na pasta `test/data/`.

### `dataLogin.json`

```json
{
  "validUser": {
    "email": "teste@teste.com",
    "password": "12345678"
  },
  "invalidEmail": {
    "email": "teste.com",
    "password": "12345678"
  },
  "validEmailEmptyPassword": {
    "email": "teste@teste.com",
    "password": ""
  },
  "shortPassword": {
    "email": "teste@teste.com",
    "password": "1234567"
  }
}
```

### `dataSignUp.json`

```json
{
  "validSignUpUser": {
    "email": "teste@teste.com",
    "password": "12345678",
    "confirmPassword": "12345678"
  },
  "invalidEmailSignUpUser": { "email": "teste.com", ... },
  "shortPasswordSignUpUser": { "password": "1234567", ... },
  "emptyPasswordSignUpUser": { "password": "", ... },
  "emptyEmailSignUpUser":    { "email": "", ... },
  "mismatchedPasswordSignUpUser": {
    "password": "12345678",
    "confirmPassword": "87654321"
  }
  ...
}
```

### Por que usar arquivos JSON separados?

- **Manutenção**: se a regra de validação mudar (ex: senha mínima passar de 8 para 10 caracteres), você atualiza só o JSON, não o código dos testes
- **Legibilidade**: o teste fica mais limpo, sem dados hardcoded no meio do código
- **Reuso**: o mesmo dado pode ser usado em vários testes

> **Nota:** O `validUser` precisa ser uma conta que já existe no app. O app de demonstração aceita qualquer email/senha com formato válido para cadastro, mas o login valida credenciais já registradas. Nos testes de Sign Up, o email gerado com `Date.now()` garante unicidade a cada execução.

---

## 14. Validações Implementadas

### Estratégias de seleção de elementos

O projeto usa três estratégias diferentes para localizar elementos no Android:

#### 1. UiSelector (Android nativo)
```js
$('android=new UiSelector().text("LOGIN")')
$('android=new UiSelector().className("android.widget.EditText").instance(0)')
$('android=new UiSelector().resourceId("android:id/button1")')
$('android=new UiSelector().description("button-sign-up-container")')
```
Localiza elementos pelo texto visível, classe, ID de recurso ou descrição de acessibilidade.

#### 2. Accessibility ID
```js
$('~Home')
$('~Forms')
$('~Swipe')
```
O prefixo `~` indica Accessibility ID. Funciona tanto no Android quanto no iOS.

#### 3. XPath
```js
$('//*[@text="Toggle navigation bar" or @content-desc="Toggle navigation bar"]')
```
Expressão mais flexível, usada quando nenhuma das outras estratégias é suficiente.

### Asserções com Chai

```js
expect(await alertTitle.getText()).to.equal('Success');
expect(await sw.getAttribute('checked')).to.equal('false');
```

O `expect(...).to.equal(...)` verifica se o valor obtido é exatamente igual ao esperado. Se não for, o teste falha com uma mensagem clara informando o valor esperado versus o obtido.

---

## 15. Fluxo de Execução Completo

```
npm test
    │
    ▼
wdio.conf.js é carregado
    │
    ├─ dotenv carrega o .env (só no processo principal)
    │
    ▼
onPrepare() executa
    ├─ Limpa allure-results/ e allure-report/
    ├─ Copia histórico anterior de relatórios
    ├─ Cria categories.json (categorias de falha)
    └─ Cria errorShots/
    │
    ▼
4 workers são criados (um por spec file)
    │
    ▼
Para cada spec (em sequência — maxInstances: 1):
    │
    ├─ before() → resetApp() (reinicia o app uma vez)
    │
    ├─ beforeEach() → resetApp() + allure.addFeature()
    │
    ├─ it() → executa o teste
    │   ├─ Navega nas telas
    │   ├─ Preenche campos
    │   ├─ Clica em botões
    │   └─ Verifica resultados com expect()
    │
    └─ afterTest() → se falhou:
        ├─ Tira screenshot
        ├─ Salva em errorShots/
        └─ Anexa ao Allure
    │
    ▼
onComplete() executa
    ├─ Copia appium.log para allure-results/
    └─ Exibe mensagem de conclusão
    │
    ▼
npm run allure:report
    ├─ allure generate → cria allure-report/
    └─ node scripts/open-report.js → abre no browser
```

---

## 16. Relatórios com Allure

O Allure é uma ferramenta que transforma os resultados dos testes em relatórios HTML interativos com gráficos, screenshots e histórico de execuções.

### Como gerar

```bash
# Após rodar os testes (já incluso no npm test):
npm run allure:report

# Ou separadamente:
npm run allure:generate   # cria os arquivos HTML
npm run allure:open       # abre no browser
```

### O que aparece no relatório

| Seção | Descrição |
|-------|-----------|
| **Overview** | Resumo geral: passou/falhou/quebrado/ignorado com gráfico de rosca |
| **Suites** | Testes organizados por arquivo de spec |
| **Behaviors** | Testes organizados por Feature e Story (definidos via `allure.addFeature/addStory`) |
| **Timeline** | Linha do tempo de execução de cada teste |
| **Categories** | Falhas agrupadas por tipo (AssertionError, TimeoutError, etc.) |
| **Test Details** | Cada teste com seus steps, screenshots em falha, e mensagem de erro |

### Categorias de falha configuradas

| Categoria | Quando aparece |
|-----------|---------------|
| Falha de Validação (AssertionError) | Quando um `expect()` falha — o app retornou valor diferente do esperado |
| Falha de Automação (Driver/Timeout) | Quando o elemento não apareceu no tempo esperado ou o driver crashou |
| Testes Pendentes (Skipped) | Testes marcados como `pending` ou `skip` |
| Erro de Execução (Broken) | Erros inesperados não relacionados à lógica do teste |

### Histórico entre execuções

O `onPrepare` copia automaticamente o histórico da execução anterior para a nova, permitindo que o Allure mostre **tendências ao longo do tempo** (teste que estava passando e passou a falhar, por exemplo).

---

## 17. BrowserStack — Testes em Nuvem

O BrowserStack é uma plataforma que oferece dispositivos reais (não emuladores) na nuvem para executar testes.

### Configuração — Android

1. Crie uma conta em [browserstack.com](https://www.browserstack.com)
2. Acesse **App Automate** → faça upload do APK
3. Copie a URL no formato `bs://hash_gerado`
4. Preencha o `.env`:

```bash
RUN_ON_BS=true
BROWSERSTACK_USER=seu_usuario
BROWSERSTACK_KEY=sua_chave_de_acesso
BROWSERSTACK_ANDROID_APP=bs://hash_do_app_android
```

5. Execute:

```bash
npm run test:browserstack
```

### Configuração — iOS

1. Faça upload do `.app` iOS para o BrowserStack App Automate
2. Copie a URL no formato `bs://hash_gerado`
3. Preencha o `.env`:

```bash
RUN_ON_BS=true
PLATFORM=ios
BROWSERSTACK_USER=seu_usuario
BROWSERSTACK_KEY=sua_chave_de_acesso
BROWSERSTACK_IOS_APP=bs://hash_do_app_ios
```

4. Execute:

```bash
npm run test:browserstack:ios
```

### Dispositivos configurados

| Plataforma | Dispositivo | Sistema | Driver |
|-----------|-------------|---------|--------|
| **Android** | Google Pixel 8 | Android 14.0 | UiAutomator2 |
| **iOS** | iPhone 15 | iOS 17 | XCUITest |

Os dispositivos podem ser substituídos pelas variáveis `BS_ANDROID_DEVICE`, `BS_ANDROID_VERSION`, `BS_IOS_DEVICE` e `BS_IOS_VERSION` no `.env`.

### Diferenças entre local e BrowserStack

| Aspecto | Local | BrowserStack |
|---------|-------|-------------|
| Dispositivo | Emulador/Simulador (virtual) | Dispositivo real |
| Velocidade de setup | Rápida | Mais lenta (upload do app) |
| Custo | Gratuito | Pago (plano gratuito disponível) |
| `resetApp()` | terminateApp + activateApp | clearApp + startActivity |

---

## 18. CI/CD — GitHub Actions

O arquivo `.github/workflows/android.yml` define um pipeline automático que executa os testes no BrowserStack sempre que há um push ou pull request para a branch `main`.

### Etapas do pipeline

```
push/PR para main
      │
      ▼
1. Checkout do código
      │
      ▼
2. Setup Node.js 20
      │
      ▼
3. npm ci (instala dependências)
      │
      ▼
4. Upload do APK para o BrowserStack
   └─ Recebe o bs:// URL do app
      │
      ▼
5. npm run test:browserstack
   └─ Usa o bs:// URL recebido no passo anterior
      │
      ▼
6. npx allure generate (sempre executa, mesmo com falhas)
      │
      ▼
7. Upload do relatório como artefato
   └─ Disponível por 7 dias na aba Actions do GitHub
```

### Secrets necessários no GitHub

Acesse: **Settings → Secrets and variables → Actions**

| Secret | Valor |
|--------|-------|
| `BROWSERSTACK_USERNAME` | Seu usuário do BrowserStack |
| `BROWSERSTACK_ACCESS_KEY` | Sua chave de acesso |

---

## 19. Boas Práticas Adotadas

### Isolamento de testes
Cada teste começa com `resetApp()` para garantir um estado limpo. Testes não dependem um do outro.

### Page Object Model
Seletores centralizados nos page objects. Mudanças no app exigem atualização em apenas um lugar.

### Dados separados do código
Massa de dados em arquivos JSON (`test/data/`). Fácil de atualizar sem mexer nos testes.

### Um único `maxInstances: 1`
Garante que apenas uma sessão Appium roda por vez. Evita crash do emulador por sobrecarga de memória.

### dotenv carregado uma única vez
O `.env` é carregado apenas no processo principal (não em cada worker), usando a verificação `process.env.WDIO_WORKER_ID`.

### Screenshots automáticas em falha
O hook `afterTest` captura automaticamente uma screenshot quando um teste falha, facilitando o diagnóstico.

### Relatório com histórico
O `onPrepare` copia o histórico do relatório anterior, permitindo rastrear tendências de estabilidade ao longo das execuções.

### Semicolons em vez de `&&` nos scripts
```json
"test": "wdio run wdio.conf.js; npm run allure:report"
```
O `;` garante que o relatório é gerado mesmo quando os testes falham. Com `&&`, o relatório seria pulado se algum teste falhasse.

### Fallback para BrowserStack
O `resetApp()` tenta os comandos locais primeiro e cai para os do BrowserStack em caso de falha, sem precisar de configuração diferente.

---

## 20. Guia de Manutenção

### Como adicionar um novo teste

1. **Identificar a tela** — qual page object corresponde?
2. **Verificar se o seletor existe** — o elemento já está mapeado no page object?
   - Se não: adicionar o getter no arquivo `.page.js` correspondente
3. **Criar o `it()`** no arquivo de spec correto
4. **Adicionar os dados** no JSON em `test/data/` se necessário
5. **Executar isoladamente** para validar: `npm run test:login` (por exemplo)

### Como atualizar um seletor que mudou

1. Abra o page object correspondente à tela (ex: `login.page.js`)
2. Localize o getter do elemento
3. Atualize o seletor
4. Execute o spec específico para validar

### Como depurar um teste que está falhando

1. Verifique o relatório Allure — a screenshot mostra o estado da tela no momento da falha
2. Cheque o `allure-results/appium.log` para logs do servidor Appium
3. Execute só o spec que falhou: `npm run test:login`
4. Se necessário, aumente o `LOG_LEVEL` no `.env` para `verbose`

### O emulador travou / testes falhando com "session not found"

```bash
# Reiniciar o emulador
adb reboot

# Aguardar boot
adb shell getprop sys.boot_completed   # aguarda "1"

# Matar processos Appium zumbis
pkill -f appium

# Executar os testes novamente
npm test
```

### Atualizar a versão do app testado

1. Baixe o novo APK / `.app`
2. Substitua em `app/android/` (Android) ou `app/ios/` (iOS)
3. Se usar BrowserStack, faça upload do novo app e atualize `BROWSERSTACK_ANDROID_APP` ou `BROWSERSTACK_IOS_APP` no `.env`
4. Verifique se os seletores ainda funcionam executando a suíte completa

---

## 21. Glossário

| Termo | Explicação simples |
|-------|--------------------|
| **APK** | Arquivo de instalação de aplicativo Android (como um `.exe` no Windows) |
| **Appium** | Programa que fica "no meio" entre o teste e o celular/emulador, traduzindo comandos |
| **Asserção** | Verificação que o teste faz. Ex: "o texto deve ser igual a Success" |
| **Automation Driver** | Software que controla o app no dispositivo. No Android: UiAutomator2 |
| **BrowserStack** | Plataforma online que disponibiliza celulares reais para rodar testes |
| **Chai** | Biblioteca JavaScript para escrever verificações de forma legível (`expect(x).to.equal(y)`) |
| **CI/CD** | Integração e Entrega Contínua — pipeline automático que roda testes a cada mudança no código |
| **describe / it** | Estrutura do Mocha: `describe` agrupa testes, `it` é um teste individual |
| **dotenv** | Biblioteca que lê o arquivo `.env` e carrega as variáveis como `process.env.VARIAVEL` |
| **Emulador** | Celular virtual que roda no computador. Mais lento que dispositivo real, porém gratuito |
| **Fixture** | Dados de teste pré-definidos (ex: emails e senhas em arquivos JSON) |
| **Hook** | Função que roda automaticamente em um momento específico: antes/depois de cada teste (`beforeEach`, `afterTest`) |
| **Massa de dados** | Conjunto de dados usados nos testes (usuários, senhas, formulários) |
| **Mocha** | Framework que organiza os testes em suítes e casos |
| **npm ci** | Instala as dependências do projeto exatamente como definido no `package-lock.json` |
| **Page Object** | Arquivo que representa uma tela do app, centralizando seletores e ações |
| **POM** | Page Object Model — padrão de projeto que separa testes de seletores |
| **Regressão** | Quando uma mudança no código quebra algo que já funcionava antes |
| **Relatório Allure** | Relatório HTML gerado após os testes com gráficos, screenshots e histórico |
| **resetApp** | Ação de fechar e reabrir o app para começar do zero |
| **Selector / Seletor** | "Endereço" de um elemento na tela. Pode ser por texto, ID, classe, etc. |
| **Severity** | Gravidade do teste: `critical` (quebra o fluxo principal), `high` (importante), `normal`, `low` |
| **spec file** | Arquivo que contém os casos de teste (`.test.js`) |
| **UiAutomator2** | Driver do Android que executa ações como tocar, digitar, rolar |
| **UiSelector** | Sintaxe Android para localizar elementos por características (texto, classe, ID) |
| **WebdriverIO** | Framework JavaScript que orquestra os testes e se comunica com o Appium |
| **Worker** | Processo paralelo que o WebdriverIO cria para executar cada spec file |
| **XPath** | Linguagem para navegar em estruturas de árvore (como a hierarquia de elementos do app) |

---

<div align="center">

**Desafio Banco Carrefour — Mobile Test Automation**
WebdriverIO v8 · Appium 2 · Mocha · Chai · Allure · Android & iOS

</div>
