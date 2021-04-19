<div align="center">
  <img src="assets/LogoPodcast.png">
</div>

[![Author](https://img.shields.io/badge/Author-FelippeChemello-%237895B0)](https://github.com/FelippeChemello)

<h4 align="center">
   A fully automated news Podcast maker <br>
   Um criador de podcasts de notícias totalmente automatizado
</h4>

## Tecnologies | Tecnologias

<div align="center">
  <img src="assets/TechLogos.png" style="height='128px'">
</div>

This project was developed using:
Este projeto foi desenvolvido utilizando:

-   [Typescript](https://www.typescriptlang.org/)
-   [NodeJS](https://nodejs.dev/)
-   [ReactJS](https://reactjs.org/)
-   [Remotion](https://www.remotion.dev/)

## Examples | Exemplos

| [YouTube](https://www.youtube.com/channel/UCEQb3ajJgTK_Xr33OE0jeoQ) | [Instagram](https://www.instagram.com/codestackme/) | [Podcast](https://anchor.fm/codestack) |
| --- | --- | --- |
| <iframe width="426" height="240" src="https://www.youtube.com/embed/ePc9ljAkIjc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> | <iframe src="https://instagram.com/tv/CN2jdC4Aelc/embed" frameborder="0" allowfullscreen scrolling="no" allowtransparency width="300" height="535"></iframe> |  <iframe src="https://anchor.fm/codestack/embed/episodes/CodeStack-News-Primeira-Ferrari-eltrica--Arma-futurista-derruba-drones-militares--Europa-quer-banir-parcialmente-IAs-ev1p36" height="102px" width="400px" frameborder="0" scrolling="no"></iframe> |

## 💻 Getting started | Iniciando

### Requirements | Requisitos

#### English
-   You need to install both NodeJS, Yarn, FFMPEG and Full Google Chrome to run this project (To run it on as Server Side, check actions workflow [here](https://github.com/FelippeChemello/podcast-maker/blob/master/.github/workflows/main.yml))
-   Access to YouTube API, Account on Instagram or on AnchorFM

#### Portuguese
-   Você precisa instalar NodeJS, Yarn, FFMPEG e Google Chrome Completo (Para executar com servidor, verifique o workflow do Github Actions [aqui](https://github.com/FelippeChemello/podcast-maker/blob/master/.github/workflows/main.yml)).
-   Acesso a API do YouTube, conta do Instagram ou no AnchorFM

**Clone the project and access the folder | Clone o projeto e acesse o diretório**

```bash
$ git clone https://github.com/FelippeChemello/podcast-maker.git && cd podcast-maker
```

**Install dependencies | Instale as dependencias**

```bash
$ yarn
```

**Copy .env.local to .env and edit environment variables | Copie .env.local para .env e edite as variáveis de ambiente**

```bash
$ cp .env.local .env
$ vim .env
```

**Create content file and edit it | Crie arquivo de conteúdo e edite-o**

```bash
$ yarn content:create <description>
$ vim json/*-<description>.json
```

**Create video to your favorite platform | Crie o video para a plataforma desejada**

```bash

yarn video:make:tts # Only TTS text from content
yarn video:make:youtube # Only create YouTube video from content (expects TTS has already been created)
yarn video:make:instagram # Only create Instagram video from content (expects TTS has already been created)
yarn video:make:podcast # Only create PodCast audio from content (expects TTS has already been created)
yarn video:upload:youtube # Only upload video to YouTube (expects video has been created)
yarn video:upload:instagram # Only upload video to instagram (expects video has been created)
yarn video:upload:anchor # Only audio video to AnchorFM (expects podcast audio has been created)
yarn video:full:youtube # TTS, Create video and upload to YouTube
yarn video:full:instagram # TTS, create video and upload to IGTV
yarn video:full:anchor # TTS, create audio and upload to AnchorFM
yarn tmp:clean # Clean tmp/ except example files
yarn content:create # Create content JSON file - You should edit it adding your data and news
yarn content:validate # Pre-commit command, validates if content file has been filled correctly
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💜 by Felippe Chemello 👋 [Check out my LinkedIn](https://www.linkedin.com/in/felippechemello/)
