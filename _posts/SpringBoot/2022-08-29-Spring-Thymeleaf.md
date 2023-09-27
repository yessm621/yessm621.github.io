---
title: "타임리프(thymleaf)"
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Thymeleaf
toc: true
toc_sticky: true
---

**공식 사이트**

[Tutorial: Using Thymeleaf](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html)

## 타임리프 특징

### 1. 서버 사이드 HTML 렌더링 (SSR)

타임리프는 백엔드 서버에서 HTML을 동적으로 렌더링 하는 용도로 사용된다.

백엔드 개발자라면 jsp, thymeleaf 중 하나는 알아두는게 좋다!

### 2. 네츄럴 템플릿

타임리프는 순수 HTML을 최대한 유지하는 특징이 있다.

타임리프로 작성한 파일은 HTML을 유지하기 때문에 웹 브라우저에서 파일을 직접 열어도 내용을 확인할 수 있고, 서버를 통해 뷰 템플릿을 거치면 동적으로 변경된 결과를 확인할 수 있다.

JSP를 포함한 다른 뷰 템플릿들은 해당 파일을 열면, 예를 들어서 JSP 파일 자체를 그대로 웹 브라우저에서 열어보면 JSP 소스코드와 HTML이 뒤죽박죽 섞여서 웹 브라우저에서 정상적인 HTML 결과를 확인할 수 없다. 오직 서버를 통해서 JSP가 렌더링 되고 HTML 응답 결과를 받아야 화면을 확인할 수 있다.

반면에, 타임리프로 작성된 파일은 해당 파일을 그대로 웹 브라우저에서 열어도 정상적인 HTML 결과를 확인할 수 있다. 물론 이 경우 동적으로 결과가 렌더링 되지는 않는다. 하지만 HTML 마크업 결과가 어떻게 되는지 파일만 열어도 바로 확인할 수 있다.

이렇게 **순수 HTML을 그대로 유지하면서 뷰 템플릿도 사용할 수 있는 타임리프의 특징을** `네츄럴 템플릿`(natural templates)이라 한다.

### 3. 스프링 통합 지원

타임리프는 스프링과 자연스럽게 통합되고, 스프링의 다양한 기능을 편리하게 사용할 수 있게 지원한다.

## 라이브러리

### 타임리프 사용하기 위한 라이브러리 추가

```
implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
```

### HTML에 타임리프 사용 선언

```html
<html xmlns:th="http://www.thymeleaf.org">
```

## 기본 표현식

```html
th:
```

태그 안의 값을 서버에서 전달 받은 값에 따라서 표현하고자 할 때 사용

## 텍스트 출력

### th:text

```html
<span th:text="${data}">
```

태그의 속성에 기능을 정의하여 텍스트를 출력

### [[…]]

```html
<li>컨텐츠 안에서 직접 출력하기 = [[${data}]]</li>
```

태그의 속성이 아닌 콘텐츠 영역안에서 직접 데이터 출력

```html
<!-- ${data} = “Hello <b>Spring</b>” -->

<h1>text vs utext</h1>
<ul>
  <li>th:text = <span th:text="${data}"></span></li>
  <li>th:utext = <span th:utext="${data}"></span></li>
</ul>
<h1><span th:inline="none">[[...]] vs [(...)]</span></h1>
<ul>
  <li><span th:inline="none">[[...]] = </span>[[${data}]]</li>
  <li><span th:inline="none">[(...)] = </span>[(${data})]</li>
</ul>
```

![1](https://user-images.githubusercontent.com/79130276/187162024-0fbbc5b8-d71f-42c4-8c15-c20adbff38c8.png)

th:utext와 [(…)]은 Unesacpe 해준다.

> **참고** 
<br>
Escape(이스케이프)
HTML에서 이스케이프한다는 것은, 몇가지 특별한 문자들을 교체하는 것이다. <, >, ", &등이 여기에 해당한다. (< → &lt;, > → &gt;)
> 

> **주의**
<br>
실제 서비스를 개발하다 보면 escape를 사용하지 않아서 HTML이 정상 렌더링 되지 않는 수 많은 문제가 발생한다. escape를 기본으로 하고, 꼭 필요한 때만 unescape를 사용하자.
> 

## SpringEL

### Object

```html
<li>${user.username} = <span th:text="${user.username}"></span></li>
<li>${user['username']} = <span th:text="${user['username']}"></span></li>
<li>${user.getUsername()} = <span th:text="${user.getUsername()}"></span></li>
```

### List

```html
<li>${users[0].username} = <span th:text="${users[0].username}"></span></li>
<li>${users[0]['username']} = <span th:text="${users[0]['username']}"></span></li>
<li>${users[0].getUsername()} = <span th:text="${users[0].getUsername()}"></span></li>
```

### Map

```html
<li>${userMap['userA'].username} = <span th:text="${userMap['userA'].username}"></span></li>
<li>${userMap['userA']['username']} = <span th:text="${userMap['userA']['username']}"></span></li>
<li>${userMap['userA'].getUsername()} = <span th:text="${userMap['userA'].getUsername()}"></span></li>
```

### 지역 변수 선언 (th:with)

```html
<div th:with="first=${users[0]}">
  <p>처음 사람의 이름은 <span th:text="${first.username}"></span></p>
</div>
```

## 기본 객체들

```java
@GetMapping("/basic-objects")
public String basicObjects(HttpSession session) {
    session.setAttribute("sessionData", "Hello Session");
    return "basic/basic-objects";
}

@Component("helloBean")
static class HelloBean {
    public String hello(String data) {
        return "Hello" + data;
    }
}
```

```html
<h1>식 기본 객체 (Expression Basic Objects)</h1>
<ul>
  <li>request = <span th:text="${#request}"></span></li>
  <li>response = <span th:text="${#response}"></span></li>
  <li>session = <span th:text="${#session}"></span></li>
  <li>servletContext = <span th:text="${#servletContext}"></span></li>
  <li>locale = <span th:text="${#locale}"></span></li>
</ul>
<h1>편의 객체</h1>
<ul>
  <li>Request Parameter = <span th:text="${param.paramData}"></span></li>
  <li>session = <span th:text="${session.sessionData}"></span></li>
  <li>spring bean = <span th:text="${@helloBean.hello('Spring!')}"></span></li>
</ul>
```

## 유틸리티 객체와 날짜

### 타임리프 유틸리티 객체들

- #message : 메시지, 국제화 처리
- #uris : URI 이스케이프 지원
- #dates : java.util.Date 서식 지원
- #calendars : java.util.Calendar 서식 지원
- #temporals : 자바8 날짜 서식 지원
- #numbers : 숫자 서식 지원
- #strings : 문자 관련 편의 기능
- #objects : 객체 관련 기능 제공
- #bools : boolean 관련 기능 제공
- #arrays : 배열 관련 기능 제공
- #lists , #sets , #maps : 컬렉션 관련 기능 제공
- #ids : 아이디 처리 관련 기능 제공, 뒤에서 설명

### 자바8 날짜

```html
<h1>LocalDateTime</h1>
<ul>
  <li>default = <span th:text="${localDateTime}"></span></li>
  <li>yyyy-MM-dd HH:mm:ss = <span th:text="${#temporals.format(localDateTime, 'yyyy-MM-dd HH:mm:ss')}"></span></li>
</ul>
<h1>LocalDateTime - Utils</h1>
<ul>
  <li>${#temporals.day(localDateTime)} = <span th:text="${#temporals.day(localDateTime)}"></span></li>
  <li>${#temporals.month(localDateTime)} = <span th:text="${#temporals.month(localDateTime)}"></span></li>
  <li>${#temporals.monthName(localDateTime)} = <span th:text="${#temporals.monthName(localDateTime)}"></span></li>
  <li>${#temporals.monthNameShort(localDateTime)} = <span th:text="${#temporals.monthNameShort(localDateTime)}"></span></li>
  <li>${#temporals.year(localDateTime)} = <span th:text="${#temporals.year(localDateTime)}"></span></li>
  <li>${#temporals.dayOfWeek(localDateTime)} = <span th:text="${#temporals.dayOfWeek(localDateTime)}"></span></li>
  <li>${#temporals.dayOfWeekName(localDateTime)} = <span th:text="${#temporals.dayOfWeekName(localDateTime)}"></span></li>
  <li>${#temporals.dayOfWeekNameShort(localDateTime)} = <span th:text="${#temporals.dayOfWeekNameShort(localDateTime)}"></span></li>
  <li>${#temporals.hour(localDateTime)} = <span th:text="${#temporals.hour(localDateTime)}"></span></li>
  <li>${#temporals.minute(localDateTime)} = <span th:text="${#temporals.minute(localDateTime)}"></span></li>
  <li>${#temporals.second(localDateTime)} = <span th:text="${#temporals.second(localDateTime)}"></span></li>
  <li>${#temporals.nanosecond(localDateTime)} = <span th:text="${#temporals.nanosecond(localDateTime)}"></span></li>
</ul>
```

## URL 링크

```html
<!-- /hello -->
<li><a th:href="@{/hello}">basic url</a></li>
```

```java
@GetMapping("/link")
public String link(Model model) {
    model.addAttribute("param1", "data1");
    model.addAttribute("param2", "data2");
    return "basic/link";
}
```

```html
<h1>URL 링크</h1>
<ul>
  <!-- /hello -->
  <li><a th:href="@{/hello}">basic url</a></li>
  <!-- /hello?param1=data1&param2=data2 -->
  <li><a th:href="@{/hello(param1=${param1}, param2=${param2})}">hello query param</a></li>
  <!-- /hello/data1/data2 -->
  <li><a th:href="@{/hello/{param1}/{param2}(param1=${param1}, param2=${param2})}">path variable</a></li>
  <!-- /hello/data1?param2=data2 -->
  <li><a th:href="@{/hello/{param1}(param1=${param1}, param2=${param2})}">path variable + query parameter</a></li>
</ul>
```

## Literals

```html
<h1>리터럴</h1>
<ul>
  <!--주의! 다음 주석을 풀면 예외가 발생함-->
  <!--    <li>"hello world!" = <span th:text="hello world!"></span></li>-->
  <li>'hello' + ' world!' = <span th:text="'hello' + ' world!'"></span></li>
  <li>'hello world!' = <span th:text="'hello world!'"></span></li>
  <li>'hello ' + ${data} = <span th:text="'hello ' + ${data}"></span></li>
  <li>리터럴 대체 |hello ${data}| = <span th:text="|hello ${data}|"></span></li>
</ul>
```

> **주의** 타임리프에서 문자 리터럴은 항상 '(작은 따옴표)로 감싸야 한다.
> 

## 속성 값 설정

### 속성 설정

```html
<input type="text" name="mock" th:name="userA"/>
<!-- 렌더링 후 -->
<input type="text" name="userA"/>
```

### 속성 추가

```html
- th:attrappend = <input type="text" class="text" th:attrappend="class=' large'"/><br/>
- th:attrprepend = <input type="text" class="text" th:attrprepend="class='large'"/><br/>
- th:classappend = <input type="text" class="text" th:classappend="large"/><br/>
```

### checked 처리

```html
- checked o <input type="checkbox" name="active" th:checked="true"/><br/>

<!-- th:checked 는 값이 false 인 경우 checked 속성 자체를 제거 -->
- checked x <input type="checkbox" name="active" th:checked="false"/><br/>

<!-- 이 경우에도 checked 속성이 있기 때문에 checked 처리가 되어버린다. -->
- checked=false <input type="checkbox" name="active" checked="false"/><br/>
```

## 반복

```html
<tr th:each="user, userStat : ${users}">
  <td th:text="${userStat.count}">username</td>
  <td th:text="${user.username}">username</td>
  <td th:text="${user.age}">0</td>
  <td>
    index = <span th:text="${userStat.index}"></span>
    count = <span th:text="${userStat.count}"></span>
    size = <span th:text="${userStat.size}"></span>
    even? = <span th:text="${userStat.even}"></span>
    odd? = <span th:text="${userStat.odd}"></span>
    first? = <span th:text="${userStat.first}"></span>
    last? = <span th:text="${userStat.last}"></span>
    current = <span th:text="${userStat.current}"></span>
  </td>
</tr>
```

```html
<tr th:each="user, userStat : ${users}">

<!-- 위와 같은 표현 -->
<tr th:each="user : ${users}">
```

## 조건부 평가

### if, unless

```html
<span th:text="'미성년자'" th:if="${user.age lt 20}"></span>
<span th:text="'미성년자'" th:unless="${user.age ge 20}"></span>
```

만약 조건이 false인 경우 <span>...<span> 부분 자체가 렌더링 되지 않고 사라진다.

### switch

```html
<tr th:each="user, userStat : ${users}">
  <td th:text="${userStat.count}">1</td>
  <td th:text="${user.username}">username</td>
  <td th:switch="${user.age}">
    <span th:case="10">10살</span>
    <span th:case="20">20살</span>
    <span th:case="*">기타</span>
  </td>
</tr>
```

## 주석

```html
<h1>1. 표준 HTML 주석</h1>
<!-- 타임리프가 렌더링 하지 않고, 그대로 남겨둔다. -->
<!--
<span th:text="${data}">html data</span>
 -->

<h1>2. 타임리프 파서 주석</h1>
<!-- 렌더링에서 주석 부분을 제거한다. -->
<!--/* [[${data}]] */-->

<!--/*-->
<span th:text="${data}">html data</span>
<!--*/-->

<h1>3. 타임리프 프로토타입 주석</h1>
<!-- HTML 파일을 그대로 열어보면 주석처리가 되지만, 타임리프를 렌더링 한 경우에만 보이는 기능 -->
<!--/*/
<span th:text="${data}">html data</span>
/*/-->
```

![2](https://user-images.githubusercontent.com/79130276/187162026-2fece25d-7a63-49fc-952c-63b180339294.png)

## 블록

`<th:block>` 은 HTML 태그가 아닌 타임리프의 유일한 자체 태그

```html
<th:block th:each="user : ${users}">
  <div>
    사용자 이름1 <span th:text="${user.username}"></span>
  </div>
</th:block>
```


## 자바스크립트 인라인

```html
<script th:inline="javascript">
```

```html
<!-- 자바스크립트 인라인 사용 전 -->
<script>
    var username= [[${user.username}]];
    var age= [[${user.age}]];

    //자바스크립트 내추럴 템플릿
    var username2= /*[[${user.username}]]*/ "test username";

    //객체
    var user= [[${user}]];
</script>

<!-- 자바스크립트 인라인 사용 후 -->
<script th:inline="javascript">
    var username= [[${user.username}]];
    var age= [[${user.age}]];

    //자바스크립트 내추럴 템플릿
    var username2= /*[[${user.username}]]*/ "test username";

    //객체
    var user= [[${user}]];
</script>
```

![3](https://user-images.githubusercontent.com/79130276/187162029-3e4eec5e-9fd5-4955-823f-0572262972b9.png)



## 템플릿 조각

th:fragment 가 있는 태그는 다른곳에 포함되는 코드 조각으로 이해하면 된다.

```html
<html xmlns:th="http://www.thymeleaf.org">
<head th:fragment="common_header(title,links)">

  <title th:replace="${title}">레이아웃 타이틀</title>

  <!-- 공통 -->
  <link rel="stylesheet" type="text/css" media="all" th:href="@{/css/awesomeapp.css}">
  <link rel="shortcut icon" th:href="@{/images/favicon.ico}">
  <script type="text/javascript" th:src="@{/sh/scripts/codebase.js}"></script>

  <!-- 추가 -->
  <th:block th:replace="${links}" />
</head>
```

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">

<head th:replace="template/layout/base :: common_header(~{::title},~{::link})">
  <title>메인 타이틀</title>
  <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
  <link rel="stylesheet" th:href="@{/themes/smoothness/jquery-ui.css}">
</head>

<body>
메인 컨텐츠
</body>
</html>
```