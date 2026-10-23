# duolingo

[![Learn Duolingo](https://github.com/dngnd-forks/duolingo-2/actions/workflows/duolingo.yml/badge.svg?branch=main)](https://github.com/dngnd-forks/duolingo-2/actions/workflows/duolingo.yml)

<img src="duo.svg" width="128px"/>

Streak keeper and XP farm for Duolingo. Never get demoted again!

### How to use

1. [Fork this repository](https://github.com/dngnd-forks/duolingo-2/fork)
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

## Workflow

### 🦉 Learn Duolingo

A single workflow keeps your streak alive and lets you farm XP. It runs twice daily (9 AM and 10 PM UTC) and completes 1 lesson per run. You can also trigger it manually via [workflow_dispatch](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch) and choose the number of lessons to be done. Old workflow runs are cleaned up automatically. The workflow can be viewed [here](.github/workflows/duolingo.yml).

## Caveats

- This project won't help with your daily or friend quests, it can only earn XP to move up the league rank;
- This project won't do real lessons or stories, only practices, so it won't affect your learning path;

## Running as a standalone script

You can run this script outside GitHub if you want to. You need `bash`, `curl` and `jq` installed, and a `DUOLINGO_JWT` env var:

```
DUOLINGO_JWT=... bash lesson.sh
```

You can also set the number of lessons:

```
DUOLINGO_JWT=... LESSONS=5 bash lesson.sh
```
