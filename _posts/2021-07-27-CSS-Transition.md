---
title:  "Transition"
categories:
  - CSS
tags:
  - CSS
toc: true
toc_label: "Getting Started"
---

## Transition 이란?

→ css 속성을 변경할 때 애니메이션 속도를 조절하는 방법을 제공

→ 값이 있을때 그값이 변화한다면 그 중간과정을 정의한 애니메이션

<br>

**transform 에 적용한 transition**

```css
.box {
  width: 100px;
  height: 100px;
  border: 2px solid black;
  background: rgba(255,255,0,0.7);
  transition: 1s;
}

.box:hover {
  transform: scale(1.5);
}
```

<br>

**width와 background 에 적용한 transition**

```css
.box {
  width: 100px;
  height: 100px;
  border: 2px solid black;
  background: rgba(255,255,0,0.7);
  transition: 1s;
}

.box:hover {
  transform: scale(1.5);
	background: red;
}
```

<br>

**width 를 auto 로 준다면 transition 이 적용될까?**

→ No!!

→ auto 는 수치가 아니다. 따라서, 적용이 안된다.

```css
.box {
	width: auto;
  height: 100px;
  border: 2px solid black;
  background: rgba(255,255,0,0.7);
  transition: 1s;
}

.box:hover {
  width: 200px;
  background: red;
}

/* 위의 코드는 적용이 안됨. */
```

<br>

## Transition 속성

`transition` : 이 속성은 축약된 것!

→ 개발자도구에서 해당 속성을 살펴보면 아래와 같은 속성이 나온다

- transition-property

    → 트랜지션을 적용해야하는 대상

- transition-duration

    → 애니메이션 속도

- transition-timing-function

    → 애니메이션 진행 속도

    → 예를 들면, 어디부분은 빠르고 어디부분은 느리고 (0~0.3s까진 빠르고, 그이후엔 느리고..)

    → default: ease (가속도), linear: 등속도

- transition-delay

    → 지연 시키는 것

    → 0s 후에 애니메이션 진행

    ```css
    transition: 1s 2s;
    /* 2s 후에 1s 동안 애니메이션하겠다는 뜻! */
    ```
