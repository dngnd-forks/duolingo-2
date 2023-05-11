const id = document.cookie
  .split(';')
  .find(cookie => cookie.includes('logged_out_uuid'))
  .split('=')[1]

const { fromLanguage, learningLanguage, xpGains } = await fetch(
  `https://www.duolingo.com/2017-06-30/users/${id}?fields=fromLanguage,learningLanguage,xpGains`,
  {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  },
).then(response => response.json())

const session = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
  body: JSON.stringify({
    challengeTypes: [
      'assist',
      'characterIntro',
      'characterMatch',
      'characterPuzzle',
      'characterSelect',
      'characterTrace',
      'completeReverseTranslation',
      'definition',
      'dialogue',
      'form',
      'freeResponse',
      'gapFill',
      'judge',
      'listen',
      'listenComplete',
      'listenMatch',
      'match',
      'name',
      'listenComprehension',
      'listenIsolation',
      'listenTap',
      'partialListen',
      'partialReverseTranslate',
      'readComprehension',
      'select',
      'selectPronunciation',
      'selectTranscription',
      'syllableTap',
      'syllableListenTap',
      'speak',
      'tapCloze',
      'tapClozeTable',
      'tapComplete',
      'tapCompleteTable',
      'tapDescribe',
      'translate',
      'typeCloze',
      'typeClozeTable',
      'typeCompleteTable',
    ],
    fromLanguage,
    isFinalLevel: false,
    isV2: true,
    juicy: true,
    learningLanguage,
    skillId: xpGains.find(xpGain => xpGain.skillId).skillId,
    smartTipsVersion: 2,
    type: 'SPEAKING_PRACTICE',
  }),
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'POST',
}).then(response => response.json())

const response = await fetch(
  `https://www.duolingo.com/2017-06-30/sessions/${session.id}`,
  {
    body: JSON.stringify({
      ...session,
      heartsLeft: 0,
      startTime: (+new Date() - 60000) / 1000,
      enableBonusPoints: false,
      endTime: +new Date() / 1000,
      failed: false,
      maxInLessonStreak: 9,
      shouldLearnThings: true,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  },
).then(response => response.json())

response.xpGain
