---
title: "Transform"
categories:
  - CSS
tags:
  - CSS
toc: true
toc_label: "Index"
published : false
---

## CSS Transform

→ css3 부터 적용됨

→ 크기 위치 변경

<br>


기존의 css 는 왼쪽 위를 기준으로 크기나 위치를 변경했다면

css transform 의 경우 기준점이 중앙이고 기준점 변경도 가능하다

<br>


아래의 예제를 살펴보면,


```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Interactive Web</title>
  <link rel="stylesheet" href="css/reset.css">
  <style>
    .box-container {
      display: flex;
    }

    .box {
      width: 100px;
      height: 100px;
      border: 2px solid black;
      background: rgba(255,255,0,0.7);
    }

    .box:hover {
      /* width: 200px;
      height: 200px; */
      transform: scale(2) rotate(45deg);
    }
  </style>
</head>
<body>
  <h1>CSS Transform</h1>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate nesciunt temporibus reprehenderit sint modi deserunt voluptates nihil magnam incidunt quo. Vitae, quo provident laboriosam blanditiis fugiat cumque modi corporis reiciendis.
  </p>
  <div class="box-container">
    <div class="box">A</div>
    <div class="box">B</div>
    <div class="box">C</div>
    <div class="box">D</div>
    <div class="box">E</div>
  </div>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque excepturi doloribus quia, adipisci pariatur maxime deserunt rem, doloremque repellat, consequuntur voluptas cupiditate facilis vitae, velit repudiandae cumque nihil? Tenetur, libero.
  </p>
</body>
</html>
```

<br>

### 마우스오버 시 변화를 주고 싶다면 `hover` 를 사용

<br>

**단순히 width, height 에 변화를 주었을 때**

```css
.box:hover {
  width: 200px;
  height: 200px;
}
```
<br>


**transfrom 의 scale 을 두배로 하였을 때 (크기를 2배)**

```css
.box:hover {
  transform: scale(2);
}
```


width, height 를 사용하게 되면 주변 블록에 모두 영향을 준다.

transform 을 사용하게 되면 단순히 D 블록에만 영향을 주고 다른 블록에는 영향이 안가기 때문에 훨씬 빠르고 효율적이다.

<br>

**rotate: 회전**

```css
.box:hover {
  transform: scale(2) rotate(45deg);
}
/* rotate: 회전, deg 가 단위이다. */
/* 즉, rotate(45deg); 은 회전기울기를 45도 기울이겠다는 뜻! */
```

<br>


**skew: 비틀기**

```css
.box:hover {
	transform: skew(30deg);
}
/* skew: 수평 비틀기, deg 가 단위이다. */

.box:hover {
	transform: skewY(30deg);
}
/* skewY: 수직 비틀기 */
```

<br>


**translate: 이동**

```css
.box:hover {
	transform: translate(30px, 10px);
	/* transform: translateX(30px); */
	/* transform: translateY(10px); */
	/* transform: translateY(-10px); */
}
/* translate: 이동 */
/* 첫번째줄 처럼 , 로 쓰면 x축, y축 */
/* 두번째, 세번째줄 처럼 쓰면 각각 x축, y축 */
```

<br>


**기준점을 바꾸는 법**

→ transform 의 default 기준점은 중앙이다.

```css
.box:hover {
  transform: scale(1.5);
  /* transform-origin: left top;
  transform-origin: right bottom; */
  transform-origin: 50% 0%;
}
```

transform-origin 으로 변경이 가능한데 left, right / top, bottom 을 사용할 수도 있지만

% 를 더 선호한다. → 애매한 값도 설정 가능하기 때문!
