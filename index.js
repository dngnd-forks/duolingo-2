try {
    // 设置每次完成的课程数，默认为1
    process.env.LESSONS = process.env.LESSONS ?? 1;
    
    // 获取修复的天数，默认为30天
    const daysToRepair = parseInt(process.env.DAYS_TO_REPAIR) || 30;

    // 请求头部设置，包含JWT令牌
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DUOLINGO_JWT}`,
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    };

    // 解析JWT令牌，获取用户ID (sub)
    const { sub } = JSON.parse(Buffer.from(process.env.DUOLINGO_JWT.split(".")[1], "base64").toString());

    // 获取用户正在学习的语言对 (fromLanguage 和 learningLanguage)
    const { fromLanguage, learningLanguage } = await fetch(`https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage`, { headers })
        .then(response => response.json());

    // 累积经验值 (XP)
    let xp = 0;

    // 开始修复连胜的循环
    for (let i = 0; i < daysToRepair; i++) {
        // 计算需要修复的日期，从昨天开始
        const repairDate = new Date();
        repairDate.setDate(repairDate.getDate() - (i + 1)); // 例如 i=0 代表昨天

        // 模拟课程开始
        const session = await fetch("https://www.duolingo.com/2017-06-30/sessions", {
            body: JSON.stringify({
                challengeTypes: [
                    "assist", "characterIntro", "characterMatch", "characterPuzzle", "characterSelect",
                    "characterTrace", "characterWrite", "completeReverseTranslation", "definition", 
                    "dialogue", "extendedMatch", "extendedListenMatch", "form", "freeResponse", 
                    "gapFill", "judge", "listen", "listenComplete", "listenMatch", "match", 
                    "name", "listenComprehension", "listenIsolation", "listenSpeak", "listenTap", 
                    "orderTapComplete", "partialListen", "partialReverseTranslate", "patternTapComplete", 
                    "radioBinary", "radioImageSelect", "radioListenMatch", "radioListenRecognize", 
                    "radioSelect", "readComprehension", "reverseAssist", "sameDifferent", "select", 
                    "selectPronunciation", "selectTranscription", "svgPuzzle", "syllableTap", 
                    "syllableListenTap", "speak", "tapCloze", "tapClozeTable", "tapComplete", 
                    "tapCompleteTable", "tapDescribe", "translate", "transliterate", 
                    "transliterationAssist", "typeCloze", "typeClozeTable", "typeComplete", 
                    "typeCompleteTable", "writeComprehension"
                ],
                fromLanguage,
                isFinalLevel: false,
                isV2: true,
                juicy: true,
                learningLanguage,
                smartTipsVersion: 2,
                type: "GLOBAL_PRACTICE",
            }),
            headers,
            method: "POST",
        }).then(response => response.json());

        // 模拟完成课程的请求
        const response = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
            body: JSON.stringify({
                ...session,
                heartsLeft: 0,
                startTime: (repairDate.getTime() - 60000) / 1000, // 开始时间设置为模拟时间
                enableBonusPoints: false,
                endTime: repairDate.getTime() / 1000, // 结束时间设置为模拟时间
                failed: false,
                maxInLessonStreak: 9,
                shouldLearnThings: true,
            }),
            headers,
            method: "PUT",
        }).then(response => response.json());

        // 增加获得的经验值 (XP)
        xp += response.xpGain;
    }

    // 打印获得的经验值
    console.log(`🎉 You won ${xp} XP`);
} catch (error) {
    console.log("❌ Something went wrong");
    if (error instanceof Error) {
        console.log(error.message);
    }
}
