# 🐰 Yeonwoo's English Friends

만 7세 연우를 위한 **놀이형 영어 앱**입니다. 세 친구(분홍 토끼 Momo, 구름 강아지 Puff, 하트 요정 Lulu)와 함께
아침부터 잠들 때까지의 **생활 상황** 속에서 영어를 듣고, 만지고, 말하고, 몸으로 따라 하며 익힙니다.

- 만 7세 수준에 맞춰 듣기·말하기에 더해 **읽기, 철자, 문장 만들기**와 숫자 11~20을 함께 다룹니다.
- 아이 화면에는 **한국어 번역이 없습니다.** 뜻은 그림, 애니메이션, 상황, 몸짓으로 전달합니다.
- 일방적으로 보여 주기보다 **아이가 직접 하는 활동**(탭, 드래그, 문지르기, 말하기, 몸 움직이기)이 중심입니다.
- 틀려도 혼나는 화면이 없습니다. 틀린 그림을 누르면 그 그림의 이름을 알려 주고, 두 번 틀리면 정답이 반짝입니다.
- 설치 없이 브라우저(태블릿/휴대폰)에서 실행되고, 홈 화면에 추가하면 앱처럼 쓰고 오프라인에서도 동작합니다.

## 단원 (연우의 하루)

| # | 단원 | 핵심 표현 | 활동 |
|---|------|-----------|------|
| 1 | 👋 Hello, Friends! | Hello! / My name is… / Nice to meet you! | 친구 만나기 대화, 친구 찾기, 말하기, 문장 만들기 |
| 2 | 🌞 Good Morning! | I wake up at seven. / I brush my teeth. | 톡톡 깨우기, 양치·세수 문지르기, 문장 만들기 |
| 3 | 🍓 Yummy Breakfast | Can I have some milk, please? / I like strawberries. | 먹여 주기, 주고받기 대화, 단어 읽기, 철자 |
| 4 | 👗 Get Dressed! | Put on your shoes. / It is cold today. | 옷 입히기, 날씨 물건 고르기, 날씨 문장 읽기 |
| 5 | 🎒 At School | Stand up! / Can I borrow your pencil? / I have a book. | 교실 지시 따라 하기, 빌려주기 대화, 철자, 문장 |
| 6 | 🎈 Colors & Toys | I like pink! / Clean up! | 풍선 터뜨리기, 장난감 정리, 색깔 철자, 읽기 |
| 7 | 🐶 Animal Friends | Who says "Moo"? / Hop like a bunny! | 울음소리 맞히기, 동물 흉내, 읽기, 철자 |
| 8 | 👀 My Body | Where is my nose? / Touch your nose. | 몸 만지기, 몸 동작, 철자, 문장 만들기 |
| 9 | 💖 How Do You Feel? | I am happy today. / Don't be sad. | 친구 위로하기, 오늘 기분 말하기, 읽기, 문장 |
| 10 | 🏡 My Family | This is my mom. / I love my family. | 가족 소개 대화, 읽기, 문장 만들기, 말하기 |
| 11 | 🔢 Let's Count! | eleven … twenty / Jump ten times! | 20까지 세기, 숫자 고르기, 건네기, 숫자 철자 |
| 12 | 🌙 Good Night! | It is time for bed. / Good night! | 손 씻기·헹구기, 불 끄고 잠자기, 문장 만들기 |

단원마다 활동을 모두 마치면 **스티커**를 받고, 활동마다 ⭐을 모읍니다.

### 활동 종류

| 아이콘 | 종류 | 하는 일 |
|---|---|---|
| 👀 | learn | 선물 상자를 눌러 열면 그림과 함께 단어를 듣고, 마지막에 함께 따라 말해요 |
| 👂 | listen | 친구의 질문을 듣고 맞는 그림을 눌러요 |
| ✋ | drag | 친구에게 음식·옷·장난감을 끌어다 줘요 (탭해도 돼요) |
| 👆 | touch | 친구의 코·눈·귀를 눌러요, 그리고 내 코도 만져요 |
| 🧼 | scrub | 칫솔·비누를 문질러 세균과 진흙을 없애요 |
| 🔢 | count | 하나씩 눌러 세고 "How many?"에 답해요 |
| 🎤 | say | 듣고 마이크를 눌러 따라 말해요 |
| 💬 | talk | 짧은 상황극. 친구를 톡톡 깨우고, 말풍선 그림을 골라 대답해요 |
| 🕺 | move | 친구 동작을 보고 실제로 손뼉 치고 점프해요 |
| 🎈 | balloons | 말한 색깔의 풍선을 터뜨려요 |
| 📖 | read | 영어 단어·문장을 읽고 맞는 그림을 골라요 (🔊로 도움 듣기) |
| 🔤 | spell | 그림을 보고 글자를 순서대로 눌러 철자를 완성해요 (처음 두 단어는 흐린 글자가 보여요) |
| 🧩 | build | 문장을 듣고 단어 카드를 순서대로 놓아 문장을 만들어요 |

## 실행 방법

빌드 과정이 없는 정적 웹앱입니다(HTML/CSS/JS 모듈).

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 을 엽니다. 같은 와이파이의 태블릿에서 열려면 컴퓨터 IP 주소로 접속하세요.
(마이크와 오프라인 기능은 `https` 또는 `localhost`에서만 동작합니다.)

### GitHub Pages로 배포하기

`.github/workflows/pages.yml` 이 들어 있습니다.

1. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 바꿉니다.
2. 기본 브랜치(`claude/ecstatic-archimedes-8i24of` 또는 `main`)에 새 커밋이 올라오면 자동으로 배포됩니다. (Actions 탭에서 수동 실행도 가능)
3. `https://momokjy.github.io/yeonwoo_english/` 를 태블릿 Safari/Chrome에서 열고 **공유 → 홈 화면에 추가** 하면 앱처럼 쓸 수 있습니다.

## 부모님 페이지

홈 화면 오른쪽 위 ⚙️ 를 **1.5초 길게 누르면** 열립니다(아이가 실수로 들어가지 않도록).

- 아이 이름과 **영어 발음용 철자**(기본값 `Yun-woo`) — 영어 음성이 이름을 자연스럽게 부르도록
- 영어 목소리 선택(어리게 들리는 목소리에 ⭐ 표시), **목소리 높이**, 말하기 속도
- 마이크 사용 여부
- 친구 캐릭터 **이름 바꾸기 / 사진 넣기** (사진은 이 기기 안에만 저장)
- 학습 기록과 스티커
- **생활 영어 가이드**: 단원별 핵심 표현(영어 + 한국어 뜻 + 생활 속 활용 팁, 🔊 발음 듣기)

## 캐릭터에 대해

마이멜로디·시나모롤·하츄핑은 각 회사의 저작권 캐릭터라서 앱에 그 그림을 그대로 넣지 않았습니다.
대신 아이들이 좋아하는 느낌(분홍 토끼, 하늘색 구름 강아지, 하트 요정)을 살린 **오리지널 친구 세 명**을 SVG로 직접 그렸습니다.
부모님 페이지에서 이름과 사진을 바꿀 수 있으니, 집에 있는 인형 사진 등을 넣어 가정에서 즐겨 주세요.
(표정이 바뀌어야 하는 활동과 몸 활동에는 기본 그림이 쓰입니다.)

## 기술 메모

- 음성: 브라우저 내장 TTS(`speechSynthesis`). 기기별 목소리 중 자연스러운 영어 음성을 자동 선택합니다.
- 말하기: `SpeechRecognition`이 있으면 단어를 느슨하게 확인하고, 없으면 마이크 소리 크기로, 그것도 없으면 잠시 들어 주는 척한 뒤 칭찬합니다. 5세 발음을 엄격하게 채점하지 않습니다.
- 효과음: WebAudio로 합성(오디오 파일 없음). 그림: 이모지 + SVG(외부 이미지 없음).
- 진행 상황: `localStorage` (기기별 저장).

### 폴더 구조

```
index.html, css/style.css, manifest.webmanifest, sw.js, assets/
js/main.js                 라우터
js/characters.js           세 친구 SVG, 표정, 말하기, 옷 입기
js/core/                   음성·마이크·효과음·드래그·공통 UI·저장
js/content/vocab.js        단어와 그림
js/content/units.js        단원·활동·대화 대본·부모님 가이드
js/activities/             활동 엔진 13종
js/screens/                시작·홈·단원·스티커·부모님·활동 화면
tests/playthrough.cjs      모든 활동 자동 플레이 테스트
```

### 콘텐츠 추가하기

`js/content/units.js` 에 단원이나 활동을 추가하면 됩니다. 새 단어는 `js/content/vocab.js` 에 그림(이모지)과 함께 넣습니다.
대화(talk) 대본에 쓰는 단계는 `js/activities/talk.js` 맨 위 주석에 정리되어 있습니다.
파일을 추가했다면 `sw.js` 의 `CORE` 목록에도 넣고 `CACHE` 버전을 올려 주세요.

### 테스트

```bash
python3 -m http.server 8765 &
node tests/playthrough.cjs           # 태블릿 가로 크기로 75개 활동 전부 자동 플레이
node tests/playthrough.cjs "" 390 844  # 휴대폰 세로
```

Playwright가 필요합니다. `?fast` 테스트 모드에서는 음성을 기다리지 않고 정답 위치를 표시합니다.
