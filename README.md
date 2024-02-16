# duolingo

[![Keep my Duolingo streak](https://github.com/rfoel/duolingo/actions/workflows/streak-keeper.yml/badge.svg?branch=main)](https://github.com/rfoel/duolingo/actions/workflows/streak-keeper.yml)

<img src="duo.svg" width="128px"/>

Streak keeper and XP farm for Duolingo. Never get demoted again!

### How to use

1. [Fork this repository](https://github.com/rfoel/duolingo/fork)
2. Go to [Duolingo](https://www.duolingo.com)
3. While logged in, open the browser's console (Option (⌥) + Command (⌘) + J (on macOS) or Shift + CTRL + J (on Windows/Linux))
4. Get the JWT token by pasting this in the console, and copy the value ( without `'`)

```js
document.cookie
  .split(';')
  .find(cookie => cookie.includes('jwt_token'))
  .split('=')[1]
 ```
  
  5. Go to your forked repository
  6. Go to Settings > Secrets and Variables > Actions . And click the button `New Repository secret`
  7. For the secret name use `DUOLINGO_JWT` for the secret value use the copied value from step 4.
  8. Go the your forked repository and go the Actions tab and press the button `I understand my workflows, go ahead and enable them`

## Workflows

### 🔥 Streak Keeper

This project uses GitHub Actions scheduled workflow to keep your streak alive. The workflow can be viewed [here](.github/workflows/streak-keeper.yml).

### 📚 Study

This repository can also "study" lessons for you. This will give you XP so you won't get demoted never again! This workflow uses [workflow_dispatch](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch) to trigger the study session. You can choose the number of lessons to be done. The workflow can be viewed [here](.github/workflows/study.yml).

## Caveats

- This project won't help with your daily or friend quests, it can only earn XP to move up the league rank;
- This project won't do real lessons or stories, only practices, so it won't affect your learning path;

## Running as a standalone script

You can run this script outside GitHub if you want to. You can have an `.env` file with the `DUOLINGO_JWT` and run the script like so:

```
node --env-file=.env index.js
```

> Node v20.6.0 or later is needed to use the `--env-file` flag.

You can also load the env in the terminal like so:

```
DUOLINGO_JWT=... node index.js
```