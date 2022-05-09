---
title:  "Flex 반응형 컬럼"
categories:
  - CSS
tags:
  - CSS
toc: true
toc_label: "Getting Started"
page_hidden: true
---

## Flex 반응형 컬럼 예제

**base.html**

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>CSS Flex</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div class="flex-container">
    <div class="flex-item">AAAAAAAAAAAAAAA</div>
    <div class="flex-item">BB</div>
		<div class="flex-item">AAAAAAAAAAAAAAA</div>
    <div class="flex-item">BB</div>
		<div class="flex-item">AAAAAAAAAAAAAAA</div>
    <div class="flex-item">BB</div>
		<div class="flex-item">AAAAAAAAAAAAAAA</div>
    <div class="flex-item">BB</div>
		<div class="flex-item">AAAAAAAAAAAAAAA</div>
    <div class="flex-item">BB</div>
		<div class="flex-item">AAAAAAAAAAAAAAA</div>
    <div class="flex-item">BB</div>
		<div class="flex-item">AAAAAAAAAAAAAAA</div>
    <div class="flex-item">BB</div>
		<div class="flex-item">AAAAAAAAAAAAAAA</div>
  </div>
</body>
</html>
```

**base.css**

```css
.flex-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	/* border: 10px solid red; */
}
.flex-item {
	flex: 1 auto;
}

@media (min-width: 600px) {
	.flex-container {
		flex-direction: row;
		flex-wrap: wrap;
	}

	.flex-item {
		width: 50%;
		/* flex-grow: 0; */
		/* flex: 0 auto; */
		/* flex-basis: 50%; */
	}
}

@media (min-width: 900px) {
	.flex-item {
		width: 30%;
	}
}
```

<br>
<br>

## 1단 컬럼

```css
.flex-container {
	display: flex;
	flex-direction: column;
	/* height: 100vh; */
	min-height: 100vh;
	border: 10px solid red;
}
```

`height 와 min-height 의 차이점?`

→ 스크롤에 따라 달라짐

→ height: 100vh; 일때, 현재 창 크기에 맞춰 border 의 height 를 측정

→ min-height: 100vh; 일때, 현재 창 크기와 상관없이 스크롤 마지막에 맞춰 border 의 height 를 측정

height: 100vh;

![Untitled](https://user-images.githubusercontent.com/79130276/130557212-d2de2b8d-c844-4e9d-bf8e-ec160c2de008.png)

<br>

min-height: 100vh;

![Untitled2](https://user-images.githubusercontent.com/79130276/130557219-f57ec195-8478-41ed-a150-5f1ad2d148f0.png)

<br>
<br>

## 1단 컬럼: 높이를 꽉차게

flex-item 에 flex: 1 auto; 값을 넣어주면 화면에 꽉차게 flex-item 을 구성

```css
.flex-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	border: 10px solid red;
}

.flex-item {
	flex: 1 auto;
}
```

![Untitled3](https://user-images.githubusercontent.com/79130276/130557220-bc3df759-eebe-4387-8a19-22b1501ee6fd.png)

<br>
<br>

## 2단 컬럼

2단으로 컬럼을 구성하고 싶을 땐, 

flex-direction 을 row 로 주고 크기를 벗어나면 아래행으로 가도록 flex-wrap 을 wrap 으로 준다

그리고 반반의 크기로 가야하니 width: 50%; 로 설정해준다.

```css
.flex-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
.flex-item {
	flex: 1 auto;
}

@media (min-width: 600px) {
	.flex-container {
		flex-direction: row;
		flex-wrap: wrap;
	}
	.flex-item {
		width: 50%;
	}
}
```

![Untitled4](https://user-images.githubusercontent.com/79130276/130557222-9646464a-acbb-4423-80a8-f8f9d397fb8a.png)

<br>

- width 와 flex-basis 의 차이점?

    → width 는 단순히 가로 길이를 의미한다면 flex-basis 는 기본값이 width 이다.

    → 즉, width 가 50% 이면 flex-basis의 기본값이 50% 이다. 


<br>
<br>

## 3단 컬럼

```css
.flex-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
.flex-item {
	flex: 1 auto;
}

@media (min-width: 600px) {
	.flex-container {
		flex-direction: row;
		flex-wrap: wrap;
	}
	.flex-item {
		width: 50%;
	}
}

@media (min-width: 900px) {
	.flex-item {
		width: 30%;
	}
}
```

![Untitled5](https://user-images.githubusercontent.com/79130276/130557224-252e168a-f482-4450-a1a0-2fa8017aad0f.png)
