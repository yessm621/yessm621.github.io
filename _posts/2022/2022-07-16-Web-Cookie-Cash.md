---
title:  "쿠키와 캐시"
last_modified_at: 2022-07-16T23:15:00
categories: 
  - web
tags:
  - web
toc: true
toc_label: "Index"
toc_sticky: true
---

## 쿠키

- Set-Cookie: 서버에서 클라이언트로 쿠키 전달(응답)
- Cookie: 클라이언트가 서버에서 받은 쿠키를 저장하고, HTTP 요청시 서버로 전달

<br>

### Stateless

- HTTP는 무상태 프로토콜
- 클라이언트와 서버가 요청과 응답을 주고 받으면 연결이 끊어짐
- 클라이언트가 다시 요청하면 서버는 이전 요청을 기억하지 못함
- 클라이언트와 서버는 서로 상태를 유지하지 않는다

<br>

대안으로 모든 요청에 정보를 넘기는 방법이 있지만 이 방법은 문제가 있다. 모든 요청에 사용자 정보가 포함되도록 개발해야함. 이를 해결하기 위한 방법이 `쿠키`

<br>

### 사용법

서버 측에서 Set-Cookie라는 필드에 정보들을 담아 응답하면 웹 브라우저는 해당 정보를 쿠키에 저장함. 쿠키는 보통 로그인 세션관리에서 많이 사용된다.

![스크린샷 2022-07-16 오전 12 14 16](https://user-images.githubusercontent.com/79130276/179342695-b4709d82-0440-4770-ac55-e448220f3793.png)

![스크린샷 2022-07-16 오전 12 14 26](https://user-images.githubusercontent.com/79130276/179342696-a8048939-53e2-49de-b278-1c7ffccbc2fd.png)

<br>

### 주의사항

1. 쿠키 정보는 항상 서버에 전송되기때문에  네트워크 트래픽 추가로 발생된다. 따라서, 최소한의 정보만 사용(세션 id, 인증 토큰)하는 것이 좋다.
    - 서버에 전송하지 않고, 웹 브라우저 내부에 데이터를 저장하고 싶으면 웹 스토리지 (localStorage, sessionStorage) 참고
2. 보안에 민감한 데이터는 쿠키에 저장하면 안됨(주민번호, 신용카드 번호 등등)

<br>

### [참고] 웹 스토리지(Web Storage)

서버에 전송할 필요없이 클라이언트 측에서만 관리하면 되는 민감하지 않 은 데이터들은 웹 스토리지(localStorage, sessionStorage)를 사용할 수 있음.

<br>

1. Local Storage

- 데이터의 지속성이 영구적이다
- window.localStorage에 위치함
- 모든 값은 문자열로 변환되어 저장됨
- Object 타입도 toString의 결과가 저장된([object Object])
    - JSON.stringify를 이용해 직렬화 하여 사용할 수 있다

2. Session Storage

- 윈도우&브라우저 탭을 닫을 경우 모두 삭제됨
- window.sessionStorage에 위치함
- 사용법은 LocalStorage와 동일함

<br>

### 쿠키의 생명주기

- ****Expires, max-age****를 이용해 생명주기를 관리
- Set-Cookie: **expires**=Sat, 26-Dec-2020 04:39:21 GMT
    - 만료일이 되면 쿠키 삭제
- Set-Cookie: **max-age**=3600 (3600초)
    - 3600초 이후 삭제됨
    - 0이나 음수를 지정하면 쿠키 삭제
- 세션 쿠키: 만료 날짜를 생략하면 브라우저 종료시 까지만 유지
- 영속 쿠키: 만료 날짜를 입력하면 해당 날짜까지 유지

<br>

### 쿠키의 도메인

- domain 필드에 명시한 도메인 (+ 서브 도메인)정보로 쿠키의 접근 가능여부가 결정됨
- domain=example.org
    - example.org는 쿠키가 접근이 가능하다
    - dev.example.org도 서브도메인으로 포함되기에 쿠키 접근이 가능함
- 해당 필드 생략 시 현재 문서 기준 도메인만 적용됨
    - example.org에서 쿠키를 생성하면 해당 domain만 쿠키 접근이 가능하고 그 외 서브 도메인은 쿠키 접근이 불가하다
        - example.org 에서만 쿠키 접근
        - dev.example.org는 쿠키 미접근

<br>

### 쿠키 경로 지정

- path 필드에 작성한 경로와 그 하위 경로 페이지만 쿠키 접근이 가능
- **일반적으로 path=/ 루트로 지정**
- 예)
    - **path=/home 지정**
    - /home -> 가능
    - /home/level1 -> 가능
    - /home/level1/level2 -> 가능
    - /hello -> 불가능

<br>

### 쿠키 보안 지정

- Secure
    - 쿠키는 http, https를 구분하지 않고 전송
    - Secure를 적용하면 https인 경우에만 전송
- HttpOnly
    - XSS 공격 방지
    - 자바스크립트에서 접근 불가(document.cookie)
    - HTTP 전송에만 사용
- SameSite
    - XSRF 공격 방지
    - 요청 도메인과 쿠키에 설정된 도메인이 같은 경우만 쿠키 전송

<br>

> **참고** XSS(Cross-Site Scripting)
<br>
관리자가 아닌 기타 사용자가 웹 사이트에 스크립트를 삽입(Injection)하는 공격 기법
> 

<br>

> **참고** XSRF(Cross-Site Request Forgery)
<br>
CSRF라고도 함. 쿠키만으로 인증하는 서비스의 취약점을 이용해 서비스에 특정 명령을 요청하는 공격
>

<br>

