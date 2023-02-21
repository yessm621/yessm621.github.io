---
layout: post
title: "TailwindCSS 설정"
date: 2022-12-07 14:50:00
categories: [TailwindCSS]
tags:
  - TailwindCSS
  - CSS
author: "유자"
---

tailwindCSS를 사용하기 위해서는 node를 먼저 설치해야 한다.

## node 설치

node 버전은 14로 설치하였다.

```bash
brew install node@14
```

각자의 환경변수 설정 파일에 아래 코드를 입력하면 된다.

```bash
# 환경변수 설정하기 위해 zshrc 열기
vi ~/.zshrc
```

```bash
export PATH="/usr/local/opt/node@14/bin:$PATH"
```

```bash
# 환경변수 적용
source ~/.zshrc
```

node를 설치하였다. node와 npm 버전을 확인하여 잘 설치되었는지 확인하자.

```bash
node -v
npm -v
```

## tailwindCSS 설치

이제 tailwindCSS를 설치할 건데 에러도 많이 나고 많은 시도 끝에 성공하였다.

여기서 `gulp`라는 것을 사용할 건데 scss 파일은 웹브라우저가 이해할 수 없는 언어라고 한다. 따라서, 컴파일을 통해 css 파일로 변경해줘야 하는데 이때 gulp를 사용한다.

프로젝트 경로로 가서 아래 명령어를 입력한다.

```bash
npm init -y
```

그 후 package.json, gulpfile.js, assets/scss/styles.scss, tailwind.config.js 파일을 수동으로 만들어주자.

**package.json**

```json
// devDependencies 버전을 주의하자
{
  "name": "haedal-css",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "css": "gulp"
  },
  "devDependencies": {
    "autoprefixer": "^9.8.8",
    "gulp": "^4.0.2",
    "gulp-concat": "^2.6.1",
    "gulp-csso": "^4.0.1",
    "gulp-postcss": "^9.0.0",
    "gulp-sass": "^5.0.0",
    "node-sass": "^4.14.0",
    "postcss": "^8.4.14",
    "sass": "^1.45.0",
    "tailwindcss": "^2.2.19"
  }
}
```

> **주의**
node 버전에 따라 node-sass 버전이 달라지므로 아래 이미지를 참고하여 설치한다.
> 
> 
> ![1](https://user-images.githubusercontent.com/79130276/206098830-c9ed39af-bac5-4e0b-bf62-c7fef2928c50.png)
> 

**gulpfile.js**

```jsx
const gulp = require('gulp')

const css = () => {
    const postCSS = require('gulp-postcss')
    const sass = require('gulp-sass')(require('sass'));
    const minify = require('gulp-csso')
    sass.compiler = require('node-sass')

    return gulp
        .src('assets/scss/styles.scss', {allowEmpty: true})
        .pipe(sass().on('error', sass.logError))
        .pipe(postCSS([
            require('tailwindcss'),
            require('autoprefixer')
        ]))
        .pipe(minify())
        .pipe(gulp.dest('static/css'))
};

exports.default = css
```

**assets/scss/styles.scss**

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**tailwind.config.js**

```jsx
module.exports = {
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
```

이제 npm i를 통해 devDependencies로 설정한 라이브러리들을 설치한다. 만약, 이미 생성된 node_modules, package-lock.json 파일이 있다면 삭제하고 설치를 진행한다.

```bash
npm i
```

그러나, 오류가 발생했다…😢

```bash
gyp WARN install got an error, rolling back install
gyp ERR! configure error 
gyp ERR! stack Error: unable to get local issuer certificate
gyp ERR! stack     at TLSSocket.onConnectSecure (_tls_wrap.js:1515:34)
gyp ERR! stack     at TLSSocket.emit (events.js:400:28)
gyp ERR! stack     at TLSSocket._finishInit (_tls_wrap.js:937:8)
gyp ERR! stack     at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:709:12)
gyp ERR! System Darwin 22.1.0
gyp ERR! command "/usr/local/Cellar/node@14/14.21.1/bin/node" "/usr/local/Cellar/node@14/14.21.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/seungmi/dev/haedal/haedal-css/node_modules/fsevents
gyp ERR! node -v v14.21.1
gyp ERR! node-gyp -v v5.1.0
gyp ERR! not ok
```

구글링을 통해 해결하였다. 아래 명령어들을 순서대로 입력하면 된다.

```bash
$ cd ~

$ echo quit | openssl s_client -showcerts -servername www.naver.com -connect www.naver.com:443 > cacert.pem

$ npm config set cafile ~/cacert.pem --global

$ export NODE_EXTRA_CA_CERTS=~/cacert.pem

$ cd ~/workspace/myApp

$ npm i
```

이제 아래 명령어를 통해 컴파일 한다. 컴파일이 완료되면 static/css/styles.css 파일이 생성된다.

```bash
npm run css
```

이제 tailwindCSS를 사용할 준비가 완료되었다. css가 잘 적용되는지 아래 코드를 통해 확인해보자. 그림과 같이 나오면 잘 적용된 것이다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./static/css/styles.css" rel="stylesheet">
    <title>Document</title>
</head>
<body>
    <div class="block m-4">
        <button class="px-4 py-2 mr-2 text-white bg-red-500 rounded-3xl">빨간색 버튼</button>
        <button class="px-8 py-3 mr-2 font-semibold text-white bg-green-700">녹색 버튼</button>
        <button class="px-16 py-5 text-2xl text-white bg-black rounded-2xl">검은색 버튼</button>
    </div>
</body>
</html>
```

![2](https://user-images.githubusercontent.com/79130276/206098953-5fb11720-90dc-4665-a063-e2c8ad6d87c0.png)