---
title:  "HTTP API"
# last_modified_at: 2022-07-08T23:50:00
# last_modified_at: 2022-07-10T20:00:00
last_modified_at: 2022-07-11T10:50:00
categories: 
  - web
tags:
  - web
toc: true
toc_label: "Index"
toc_sticky: true
---

## 1. API URI 설계 시 포인트

회원과 관련된 HTTP API를 만들어본다고 가정하자

요구사항은 다음과 같다

→ 회원 목록 조회, 회원 조회, 회원 등록, 회원 수정, 회원 삭제

<br>

요구사항에 맞게 **API URI 설계**해야 함

URI를 설계시 가장 중요한 것은 `리소스 식별`이다.

<br>

### 리소스란?

*동작을 제외한 자원 그 자체를 리소스라 함.* 

예) 회원이라는 개념 자체가 바로 리소스

<br>

**리소스를 어떻게 식별하는게 좋을까?**

- 회원을 등록하고 수정하고 조회하는 것을 모두 배제
- **회원이라는 리소스만 식별하면 된다 → 회원 리소스를 URI에 매핑**

<br>

### 리소스와 행위를 분리

- URI는 리소스만 식별
- 리소스와 해당 리소스를 대상으로 하는 행위를 분리
    - 리소스: 회원
    - 행위: 조회, 등록, 삭제, 변경
- 리소스는 명사(회원), 행위는 동사 (회원을 조회하라)
- 행위(메서드)는 어떻게 구분?
    - HTTP 메서드로 구분 (GET, POST, PUT, PATCH, DELETE…)

<br>

**회원 관리 URI 예시**

- 회원 목록 조회: /members
- 회원 조회: /members/{id}
- 회원 등록: /members
- 회원 수정: /members/{id}
- 회원 삭제: /members/{id}

<br>

> **참고**
계층 구조상 상위를 컬렉션으로 보고 복수단어 사용 권장(member → members)
> 

<br>

## 2. HTTP 메서드

**HTTP 메서드 종류 - 주요 메서드**

- GET: 리소스 조회
- POST: 요청 데이터 처리, 주로 등록에 사용
- PUT: 리소스를 대체, 해당 리소스가 없으면 삭제, 있으면 덮어쓰기
- PATCH: 리소스 부분 변경
- DELETE: 리소스 삭제

<br>

**HTTP 메서드 종류 - 기타 메서드**

- HEAD: GET과 동일하지만 메시지 부분을 제외하고 상태 줄과 헤더만 반환
- OPTIONS: 대상 리소스에 대한 통신 가능 옵션(메서드)을 설명(주로 CORS에서 사용)
- CONNECT: 대상 자원으로 식별되는 서버에 대한 터널을 설정
- TRACE: 대상 리소스에 대한 경로를 따라 메시지 루프백 테스트를 수행
    - CONNECT, TRACE는 거의 사용하지 않음

<br>

> **참고**
리소스라는 표현이 최근에는 레프리젠테이션(Representation)으로 바뀜
> 

<br>

### 2.1 GET

![1](https://user-images.githubusercontent.com/79130276/178015361-ae44d6c2-f35d-4bd5-a8bb-b1d462e01192.png)

- 리소스 조회
- 서버에 전달하고 싶은 데이터는 query(쿼리 파라미터, 쿼리 스트링)를 통해서 전달
- 메시지 바디를 사용해서 데이터를 전달할 수 있지만, 지원하지 않는 곳이 많아서 권장하지 않음

<br>

**프로세스 흐름**

클라이언트가 GET 메시지를 전달하면 서버에서 메시지를 받아 데이터를 조회후 응답 데이터를 만들어 클라이언트에 전달

<br>

### 2.2 POST

![2](https://user-images.githubusercontent.com/79130276/178015366-ecee13f1-bbb1-40ab-ab1c-cc3fca7f3401.png)

- **메시지 바디를 통해 서버로 요청 데이터 전달**하면 서버가 해당 데이터를 처리함
    - 메시지 바디를 통해 들어온 데이터를 처리하는 모든 기능을 수행함
- 주로 전달된 데이터로 **신규 리소스 등록, 프로세스 처리**에 사용

<br>

> **참고** GET과 POST의 차이점?
클라이언트에서 서버로 요청을 할 때, GET은 보통 **데이터를 전달하지 않음**. 하지만, POST는 클라이언트에서 **서버로 데이터를 전달**하고 서버에게 처리해달라고 요청함
> 

<br>

**프로세스 흐름**

클라이언트에서 서버로 메시지를 전달하면 서버가 신규 리소스 생성하여 응답 데이터에 신규 리소스 식별자를 생성하여 보냄

1. POST /members 로 메시지 전달, 전달 데이터: {”username”: “young”, “age”: 20}
2. 서버에서 전달 받은 데이터를 등록하고 신규 리소스 식별자를 생성
    - /members 로 데이터 등록
    - /members/100 신규 리소스 식별자 생성
3. 응답 데이터에 **Location(신규 리소스 식별자)**를 포함해 클라이언트에 전달한다

<br>

**POST - 요청 데이터를 어떻게 처리한다는 뜻일까? 예시**

POST를 데이터를 등록한다고만 알고 있는 사람도 있는데 그렇지 않고 더 많은 의미가 있다

- 스펙: POST 메서드는 **대상 리소스가 리소스의 고유한 의미 체계에 따라 요청에 포함된 표현을 처리하도록 요청**합니다
- 예를 들어 POST는 다음과 같은 기능에 사용됩니다
    - HTML 양식에 입력 된 필드와 같은 데이터 블록을 데이터 처리 프로세스에 제공
        - 예) HTML FORM에 입력한 정보로 회원 가입, 주문 등에서 사용
    - 게시판, 뉴스 그룹, 메일링 리스트, 블로그 또는 유사한 기사 그룹에 메시지 게시
        - 예) 게시판 글쓰기, 댓글 달기
    - 서버가 아직 식별하지 않은 새 리소스 생성
        - 예) 신규 주문 생성, 신규 회원 생성
    - 기존 자원에 데이터 추가
        - 예) 한 문서 끝에 내용 추가하기
- 정리: 이 리소스 URI에 POST 요청이 오면 요청 데이터를 어떻게 처리할지 리소스마다 따로 정해야 함 → 정해진 것이 없음

<br>

**POST를 사용하는 경우**

**1. 새 리소스 생성(등록)**

- 서버가 아직 식별하지 않은 새 리소스 생성

**2. 요청 데이터 처리**

- 단순히 데이터를 생성하거나, 변경하는 것을 넘어서 프로세스를 처리해야 하는 경우
- 예) 주문에서 결제완료 -> 배달시작 -> 배달완료 처럼 단순히 값 변경을 넘어 프로세스의 상태가 변경되는 경우
- POST의 결과로 새로운 리소스가 생성되지 않을 수도 있음
- 예) POST /orders/{orderId}/start-delivery (**컨트롤 URI**)

**3. 다른 메서드로 처리하기 애매한 경우**

- 예) JSON으로 조회 데이터를 넘겨야 하는데, GET 메서드를 사용하기 어려운 경우
- 애매하면 POST

<br>

> **참고** 컨트롤 URI
URI를 리소스만 가지고 설계하기 힘들 때 URI에 동사를 넣어 설계하는 것을 컨트롤 URI라 한다
> 

<br>

### 2.3 PUT

![3](https://user-images.githubusercontent.com/79130276/178015369-877a87a8-adf1-4ee5-80fb-2cc1df47c41f.png)

- 리소스를 대체
    - 리소스가 있으면 **완전히** 대체 (주의)
    - 리소스가 없으면 생성
    - 쉽게 이야기해서 덮어버림
- 중요! 클라이언트가 리소스를 식별
    - 클라이언트가 리소스 위치를 알고 URI 지정(PUT /member/100)
        - POST는 클라이언트가 리소스의 위치를 모름(POST /members)
        - 100에 저장될지 200에 저장될지 모른다

<br>

### 2.4 PATCH

![4](https://user-images.githubusercontent.com/79130276/178015370-7d59114f-d383-4633-b244-90f41fb06e0b.png)

- 리소스 **부분 변경**
- 만약, PATCH를 지원하지 않는다면 POST를 사용하면 된다 (물론 요즘은 대부분 지원함)

<br>

### 2.5 DELETE

![5](https://user-images.githubusercontent.com/79130276/178015376-e86de974-b3c3-4658-a201-d33d58fc4a18.png)

- 리소스 제거

<br>

## 3. HTTP API 설계 개념

### 3.1 컬렉션(collection)
- 서버가 관리하는 리소스 디렉터리
- `서버가 리소스의 URI를 생성하고 관리`
    - HTTP/1.1 201 Created
    - Location: /members/100
- 예) /members

<br>

### 3.2 스토어(store)
- 클라이언트가 관리하는 자원 저장소
- `클라이언트가 리소스의 URI를 알고 관리`
    - 파일 등록 /files/{filename} -> PUT
    - PUT **/files/star.jpg**
- 예) /files

<br>

API를 설계할때 크게 두가지로 분류할 수 있다. 첫번째가 POST 기반의 등록을 하는 것이고 컬렉션이라 한다. 두번째는 PUT 기반의 등록을 하는 것이고 이것을 스토어라 한다.

<br>

대부분 컬렉션을 사용하고 파일 업로드 같은 경우엔 스토어를 사용하기도 함.

<br>

### 3.3 컨트롤러(controller), 컨트롤 URI
- 문서, 컬렉션, 스토어로 해결하기 어려운 추가 프로세스 실행
- 동사를 직접 사용
- /new, /edit, /delete가 컨트롤 URI
- 예) /members/{id}/delete

<br>

> **참고** 컨트롤 URI란?
<br>
URI를 리소스만 가지고 설계하기 힘들 때 URI에 동사를 넣어 설계하는 것을 컨트롤 URI라 한다
> 

<br>

### 3.4 문서(document)
- 단일 개념(파일 하나, 객체 인스턴스, 데이터베이스 row)
- 예) /members/100, /files/star.jpg

<br>

정리하면, HTTP API 설계할 때 최대한 리소스라는 개념을 가지고 URI를 설계하고 그게 안될 때 대체제로 컨트롤 URI를 사용

<br>

## 4. HTTP 상태코드

**상태 코드란**

*클라이언트가 보낸 요청의 처리 상태를 응답에서 알려주는 기능*

- 1xx (Informational): 요청이 수신되어 처리중
- 2xx (Successful): 요청 정상 처리
- 3xx (Redirection): 요청을 완료하려면 추가 행동이 필요
- 4xx (Client Error): 클라이언트 오류, 잘못된 문법등으로 서버가 요청을 수행할 수 없음
- 5xx (Server Error): 서버 오류, 서버가 정상 요청을 처리하지 못함

<br>

> **참고** 모르는 상태코드가 나타나면?
<br>
클라이언트가 인식할 수 없는 상태코드를 서버가 반환한다면 상위 상태코드로 해석해서 처리함. 따라서, 미래에 새로운 상태 코드가 추가되어도 클라이언트를 변경하지 않아도 됨.
<br>
예) 299 ??? → 2xx (Successful), 451 ??? → 4xx (Client Error), 599 ??? → 5xx (Server Error)
> 

<br>

### 4.1 1xx (Informational)

*요청이 수신되어 처리중*

→ 거의 사용하지 않으므로 생략

<br>

### 4.2 2xx (Successful)

*클라이언트의 요청을 성공적으로 처리*

<br>

**200 OK**

*요청 성공*

![스크린샷 2022-07-11 오전 10 37 42](https://user-images.githubusercontent.com/79130276/178173589-f27cf810-93d3-4de8-9384-f082ccd97061.png)

<br>

**201 Created**

*요청 성공해서 새로운 리소스가 생성됨*

![스크린샷 2022-07-11 오전 10 37 59](https://user-images.githubusercontent.com/79130276/178173591-a13d4e5b-f90e-4faf-81d7-1b8e43260c14.png)

<br>

**202 Accepted**

*요청이 접수되었으나 처리가 완료되지 않았음*

- 배치 처리 같은 곳에서 사용
- 예) 요청 접수 후 1시간 뒤에 배치 프로세스가 요청을 처리함

<br>

**204 No Content**

*서버가 요청을 성공적으로 수행했지만, 응답 페이로드 본문에 보낼 데이터가 없음*

- 예) 웹 문서 편집기에서 save 버튼
- save 버튼의 결과로 아무 내용이 없어도 된다
- save 버튼을 눌러도 같은 화면을 유지해야 한다
- 결과 내용이 없어도 204 메시지(2xx)만으로 성공을 인식할 수 있다.