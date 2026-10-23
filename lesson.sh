#!/usr/bin/env bash
set -euo pipefail

LESSONS="${LESSONS:-1}"
JWT="${DUOLINGO_JWT:-}"

if [[ -z "$JWT" ]]; then
	echo "❌ DUOLINGO_JWT is not set" >&2
	exit 1
fi

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
CURL=(curl -fsS -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" -H "user-agent: $UA")

SUB=$(jq -Rr '
	split(".")[1]
	| gsub("-"; "+")
	| gsub("_"; "/")
	| . + (if length % 4 == 2 then "==" elif length % 4 == 3 then "=" else "" end)
	| @base64d
	| fromjson
	| .sub
' <<<"$JWT")

LANGS=$("${CURL[@]}" "https://www.duolingo.com/2017-06-30/users/$SUB?fields=fromLanguage,learningLanguage")
FROM=$(jq -r .fromLanguage <<<"$LANGS")
TO=$(jq -r .learningLanguage <<<"$LANGS")

CHALLENGES='["assist","characterIntro","characterMatch","characterPuzzle","characterSelect","characterTrace","characterWrite","completeReverseTranslation","definition","dialogue","extendedMatch","extendedListenMatch","form","freeResponse","gapFill","judge","listen","listenComplete","listenMatch","match","name","listenComprehension","listenIsolation","listenSpeak","listenTap","orderTapComplete","partialListen","partialReverseTranslate","patternTapComplete","radioBinary","radioImageSelect","radioListenMatch","radioListenRecognize","radioSelect","readComprehension","reverseAssist","sameDifferent","select","selectPronunciation","selectTranscription","svgPuzzle","syllableTap","syllableListenTap","speak","tapCloze","tapClozeTable","tapComplete","tapCompleteTable","tapDescribe","translate","transliterate","transliterationAssist","typeCloze","typeClozeTable","typeComplete","typeCompleteTable","writeComprehension"]'

XP=0
for ((i = 0; i < LESSONS; i++)); do
	SESSION=$("${CURL[@]}" -X POST \
		-d "$(jq -n --arg from "$FROM" --arg to "$TO" --argjson types "$CHALLENGES" \
			'{challengeTypes: $types, fromLanguage: $from, isFinalLevel: false, isV2: true, juicy: true, learningLanguage: $to, smartTipsVersion: 2, type: "GLOBAL_PRACTICE"}')" \
		"https://www.duolingo.com/2017-06-30/sessions")
	ID=$(jq -r .id <<<"$SESSION")
	NOW=$(date +%s)
	BODY=$(mktemp)
	jq --argjson start $((NOW - 60)) --argjson end "$NOW" \
		'. + {heartsLeft: 0, startTime: $start, enableBonusPoints: false, endTime: $end, failed: false, maxInLessonStreak: 9, shouldLearnThings: true}' <<<"$SESSION" >"$BODY"
	RESULT=$("${CURL[@]}" -X PUT -d @"$BODY" \
		"https://www.duolingo.com/2017-06-30/sessions/$ID")
	rm -f "$BODY"
	XP=$((XP + $(jq .xpGain <<<"$RESULT")))
done

echo "🎉 You won $XP XP"