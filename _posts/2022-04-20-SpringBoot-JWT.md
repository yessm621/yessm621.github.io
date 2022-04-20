---
title:  "JWT(Json Web Token) 인증"
last_modified_at: 2022-04-20T17:20:00
categories: 
  - SpringBoot
tags:
  - Java
  - SpringBoot
  - JPA
toc: true
toc_label: "Getting Started"
---

# 인증

## 1. REST API 인증 기법

- Basic 인증
- Bearer 인증
- JSON 웹 토큰

<br>

### 1.1 Basic 인증

**Basic 인증이란**

- 상태가 없는 웹 애플리케이션(Todo 앱)에서 인증을 구현하는 가장 간단한 방법

<br>

**Basic 인증 절차**

1. 모든 HTTP 요청에 아이디와 비밀번호를 같이 보냄
2. 최초 로그인 후 HTTP 요청 헤더의 `Authorization: ‘Basic <ID>:<Password>’` 처럼 Base64로 인코딩한 문자열을 함께 보냄

<br>

**Basic Auth 예**

```
Authorization : Basic a2FpemVuOjEyMzQ1 (ID:Password)
```

3. HTTP 요청을 수신한 서버는 인코딩된 문자열을 디코딩하여 아이디와 비밀번호가 일치하면 요청받은 일을 수행하고, 아니면 거부함

<br>

**Basic 인증의 단점**

1. 아이디와 비밀번호를 노출한다. 
    - 디코딩을 통해 아이디와 비밀번호를 확인할 수 있다.
    - 따라서 보안을 위해 반드시 HTTPS를 사용해야 한다.
2. 사용자를 로그아웃시킬 수 없다
    - 모든 요청이 일종의 로그인 요청이기 때문
    - 여러 디바이스에서 로그인이 가능한 경우 한꺼번에 로그아웃을 하거나 디바이스 별로 로그아웃을 할 수 있는 기능을 Basic 인증은 제공하기 힘들다
3. 사용자 계정 정보가 있는 저장 장소(인증 서버, 인증 DB)의 경우 과부하가 걸릴 확률이 높다
    - 큰 서비스일 수록 문제 발생
4. 인증 서버가 단일 장애점(시스템의 한 부분이 오류가 나는 경우 전체 시스템을 가동 불가하게 함)

<br>

### 1.2 토큰 기반 인증

**토큰 기반 인증이란?**

- 토큰은 최초 로그인 시 서버가 만들어 줌.
- 서버가 토큰을 만들어 반환하면 클라이언트는 이후 요청에 아이디와 비밀번호 대신 토큰을 넘겨 자신이 인증된 사용자임을 알림
- 토큰 기반 요청은 헤더에 `Authorization: Bearer <TOKEN>` 명시

**Bearer Token 예**

```
Authorization: Bearer eyJhbGciOiJIUzUMyIsInJvbGUiOiJST0xFX1VTRVIiLCJpc3MiOiJkZ
```

<br>

**토큰 기반 인증 장점**

1. Basic Auth 에 비해 보안 측면에서 안전하다
2. 서버가 토큰을 마음대로 생성할 수 있으므로 사용자의 인가 정보, 유효 시간을 정해 관리할 수 있다
3. 디바이스마다 다른 토큰을 생성해 주고 유효 시간을 다르게 정하거나 임의로 로그아웃을 할 수 있다

<br>

**토큰 기반 인증 단점**

Basic 인증에서 마주한 스케일 문제를 해결할 수 없다. 즉,  토큰 이용만으로 스케일 문제를 해결할 수 없다

<br>

### 1.3 JSON 웹 토큰 (JWT)

전자 서명된 토큰 중 하나가 **JSON 웹 토큰 (JWT)**

서버에서 전자 서명된 토큰을 이용하면 인증에 따른 스케일 문제를 해결할 수 있다

JWT 토큰은 `{header}.{payload}.{signature}`

**JWT 예**

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzMyIsInJvbGUiOiJST0xFX1VTRVIiLCJpc3MiOiJkZWJyYWlucyIsImlhdCI6MTY0NzQ3NjgzMSwiZXhwIjoxNjQ3NDgwNDMxfQ.IXv1DKfaBNGWzTPEzuinyJV789PnWg8EwZQAI6GVCwYvbb6KQKmevvScHPjIHde8fwVz2J2zGcLAuh2QLqUSmw
```

<br>

JWT 를 디코딩하면 다음과 같다

```json
{ // header
	"typ": "JWT",
	"alg": "HS512"
}.
{ // payload
	"sub": "absdcsdfdfsdfds",
	"iss": "demo app",
	"exp": 1595733647,
	"iat": 1595733657
}.
IXv1DKfaBNGWzTPEzuinyJV789PnWg8EwZQAI6GVCwYvbb6KQKmevvScHPjIHde8fwVz2J2zGcLAuh2QLqUSmw
// signature
```

**Header**

- typ(type): 토큰의 타입을 의미
- alg(algorithm): 토큰의 서명을 발행하는데 사용된 해시 알고리즘의 종류를 의미

**Payload**

- sub(subject): 토큰의 주인을 의미. sub는 ID처럼 유일한 식별자
- iss(issuer): 토큰을 발행한 주체를 의미. 페이스북이 발행했다면 facebook 이 됨
- iat(issued at): 토큰일 발행된 날짜와 시간
- exp(expiration): 토큰이 만료되는 시간

**Signature**

- 토큰을 발행한 주체 Issuer가 발행한 서명으로 토큰의 유효성 검사에 사용

<br>

JWT에서 전자 서명이란 {헤더}.{페이로드}와 시크릿키를 이용해 해시 함수에 돌린 암호화한 결과 값

**시크릿키**란 나만 알고있는 문자열, 비밀번호 같은 것

<br>

**JWT 인증 절차**

1. 최초 로그인 시 서버는 사용자의 아이디와 비밀번호를 서버에 저장된 값과 비교해 인증
2. 인증된 사용자의 경우 사용자의 정보를 이용해 {헤더}.{페이로드} 부분을 작성, 시크릿키로 {헤더}.{페이로드} 부분을 전자 서명
3. 전자 서명의 결과로 나온 값을 {헤더}.{페이로드}.{서명}으로 이어붙이고 Base64로 인코딩 후 반환
4. 이후 이 토큰으로 리소스 접근 요청하면 서브는 토큰을 디코딩해 {헤더}.{페이로드}와 {서명} 부분으로 나눔
5. 서버는 {헤더}.{페이로드}와 시크릿키로 전자 서명을 만든 후 방금 만든 전자 서명을 HTTP 요청이 갖고 온 {서명} 부분과 비교해 이 토큰의 유효성을 검사

<br>

위 과정을 통해 JWT 인증 방식은 인증 서버에 토큰의 유효성에 대해 물어볼 필요가 없다. 따라서 인증 서버에 부하를 일으키지 않는다. 즉, 인증 서버가 단일 장애점이 아니다.

<br>

토큰을 훔쳐가면 해당 계정의 리소스에 접근 할 수 있기 때문에 이를 방지하기 위해 HTTPS를 통해 통신해야 함.
