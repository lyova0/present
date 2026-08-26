# HeartStory — Standalone Gift ❤️

Սա HeartStory-ի հիմնական կայքից լրիվ անկախ մեկ կոնկրետ նվերի խաղ/interactive story է։

## Ինչ փոխել

Բացիր `config.js` և փոխիր միայն `GIFT` օբյեկտի տվյալները.

- `recipientName`
- `senderName`
- `letterTitle`
- `letterText`
- `finalMessage`
- `musicUrl`
- `songTitle`
- `songDescription`
- `photos`

## Երաժշտության կարևոր նշում

`musicUrl`-ը պետք է լինի **ուղիղ audio ֆայլի հղում**, օրինակ.

`https://example.com/music/song.mp3`

Սովորական YouTube կամ Spotify էջի URL-ը `<audio>` element-ով չի նվագարկվի։

Եթե ուզում ես YouTube/Spotify երգ, դրա համար պետք է առանձին embed տարբերակ։

## Նկարներ

Կարող ես նկարները պահել `assets/images/` պանակում.

Օրինակ՝

`assets/images/photo1.jpg`

և config-ում գրել.

`src: "assets/images/photo1.jpg"`

Կամ կարող ես օգտագործել ուղիղ image URL։

## GIF

Դիր GIF-երը `assets/gifs/` պանակում.

- `bunny-love.gif`
- `bunny-happy.gif`

Եթե GIF-ը չկա, էջը ցույց կտա պարզ fallback կերպար։

## Story flow

1. Սիրո՞ւմ ես ինձ
2. Այո → անմիջապես հաջորդ էջ
3. Ոչ → YES-ը մեծանում է, NO-ն փոքրանում
4. Բացել նվերը
5. Հիշողություններ
6. Երաժշտություն
7. Նամակ
8. Վերջ

## Բացել

Պարզապես բացիր `index.html` browser-ում։

Production-ում խորհուրդ է տրվում տեղադրել static hosting-ի վրա, օրինակ GitHub Pages, Netlify կամ Vercel։

## Երաժշտության browser սահմանափակում

Browser-ները թույլ չեն տալիս անակնկալ autoplay անել առանց user interaction-ի։ Դրա համար երգը սկսվում է «▶» կոճակը սեղմելուց հետո։
