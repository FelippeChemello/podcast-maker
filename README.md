<div align="center">
  <img src="assets/LogoPodcast.png">
</div>

[![Author](https://img.shields.io/badge/Author-FelippeChemello-%237895B0)](https://github.com/FelippeChemello)

<p align="center">
    <a href="https://github.com/FelippeChemello">
        <img alt="Author" src="https://img.shields.io/badge/Author-FelippeChemello-blue?style=for-the-badge&logo=appveyor">
    </a> 
    <br/>
    <a href="https://github.com/FelippeChemello/sync.video/actions">
        <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/felippechemello/podcast-maker/Create%20content%20file?label=generate%20content%20file%20from%20email&style=for-the-badge">
    </a>
    <a href="https://github.com/FelippeChemello/sync.video/actions">
        <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/felippechemello/podcast-maker/Auto%20Merge%20Pull%20Requests?style=for-the-badge&label=Auto%20Merge%20content%20files">
    </a>
    <a href="https://github.com/FelippeChemello/sync.video/actions">
        <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/felippechemello/podcast-maker/Create%20video?style=for-the-badge&label=Render%20and%20publish%20videos">
    </a>
</p>

## Tecnologies

<div align="center">
  <img src="assets/TechLogos.png" style="height='128px'">
</div>

This project was developed using:

-   [Typescript](https://www.typescriptlang.org/)
-   [NodeJS](https://nodejs.dev/)
-   [ReactJS](https://reactjs.org/)
-   [Remotion](https://www.remotion.dev/)

## Examples

[YouTube](https://www.youtube.com/channel/UCEQb3ajJgTK_Xr33OE0jeoQ) 
[Instagram](https://www.instagram.com/codestackme/)

## 💻 Getting started

**Requirements**

-   You need to install both NodeJS, Yarn, FFMPEG and Full Google Chrome to run this project (To run it on as Server Side, check actions workflow [here](https://github.com/FelippeChemello/podcast-maker/blob/master/.github/workflows/main.yml))
-   Access to YouTube API and/or Account on Instagram

### Install and Usage

```sh-session
$ npm install -g podcast-maker
$ podcast-maker COMMAND
running command...
$ podcast-maker --version
podcast-maker/2.0.0
$ podcast-maker --help [COMMAND]
USAGE
  $ podcast-maker COMMAND
...
```

### Contribute

**Clone the project and access the folder**

```bash
$ git clone https://github.com/FelippeChemello/podcast-maker.git && cd podcast-maker
```

**Install dependencies**

```bash
$ yarn
```

**Copy .env.local to .env and edit environment variables**

```bash
$ cp .env.local .env
$ vim .env
```

**Use it**

```bash
$ podcast-maker -h
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💜 by Felippe Chemello 👋 [Check out my LinkedIn](https://www.linkedin.com/in/felippechemello/)



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)