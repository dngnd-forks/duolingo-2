# duolingo

[![Keep my Duolingo streak](https://github.com/rfoel/duolingo/actions/workflows/streak-keeper.yml/badge.svg?branch=main)](https://github.com/rfoel/duolingo/actions/workflows/streak-keeper.yml)

<img src="duo.svg" width="128px"/>

Streak keeper and XP farm for Duolingo. Never get demoted again!

## Usage

To make it work, you need to make get an authorization token from the [Duoliongo](duolingo.com) web app. Simply run the following script in the browser's console while logged in:

```js
document.cookie
  .split(';')
  .find(cookie => cookie.includes('jwt_token'))
  .split('=')[1]
```

Then copy the token given and set a (repository secret)[https://docs.github.com/actions/learn-github-actions/variables] with the name `DUOLINGO_JWT` in your GitHub Actions settings.

## Workflows

### 🔥 Streak Keeper

This project uses GitHub Actions scheduled workflow to keep your streak alive. The workflow can be viewed [here](.github/workflows/streak-keeper.yml).

### 📚 Study

This repository can also "study" lessons for you. This will give you XP so you won't get demoted never again! This workflow uses [workflow_dispatch](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch) to trigger the study session. You can choose the number of lessons to be done. The workflow can be viewed [here](.github/workflows/study.yml).

## Caveats

- This project won't help with your daily or friend quests, it can only earn XP to move up the league rank;
- This project won't do real lessons or stories, only practices, so it won't affect your learning path;
