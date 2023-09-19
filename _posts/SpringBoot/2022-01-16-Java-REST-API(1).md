---
title:  "REST API with SpringBoot(1)"
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Jpa
  - RestAPI
toc: true
toc_sticky: true
---

## REST

- 인터넷 상의 시스템 간의 상호 운용성을 제공하는 방법 중 하나
- 시스템 제 각각의 독립적인 진화를 보장하기 위한 방법

## REST의 조건

- Client-Server
- Stateless
- Cache
- Uniform Interface
- Layered System
- Code-on-Demand(optional)


대개, REST API가 아닌 이유는 Uniform Interface 조건을 만족하지 못하기 때문이다.

## Uniform Interface 조건

1. Identification of resources
    - 리소스가 URI로 식별이 되는지
2. Manipulation of resources through representations
    - 서버가 클라이언트에서 이해할 수 있는 형식으로 응답하는지
        
        → json형식으로 정보를 표현해서 응답하는지
        
3. Self-descriptive messages
4. Hypermedia as the engine of application state(HATEOAS)

대부분 3, 4번을 만족하지 못해 REST API가 아니다.

### 1. self-descriptive messages

- 메시지 스스로 메시지에 대한 설명이 가능해야 한다.
- 서버가 변해서 메시지가 변해도 클라이언트는 그 메시지를 보고 해석이 가능하다.
- 확장 가능한 커뮤니케이션

방법1 - Media Type을 정의하는 방법 (Content-type으로 지정)

```json
HTTP/1.1 200 OK
Content-Type: application/ecsimsw.subways+json
{"id":1, "name":"잠실역"}
```

방법2 - link header에 명세를 확인할 수 있는 링크를 넣음

```json
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://ecsimsw.com/docs/subway>; rel="profile"
{"id":1, "name":"잠실역"}
```

→ 브라우저들이 아직 스팩을 지원하지 않는다. 따라서, 대안으로 HAL의 링크 데이터에 profile 링크 추가

### 2. HATEOAS

- 하이퍼미디어(링크)를 통해 애플리케이션 상태 변화가 가능해야 한다.
- 링크 정보를 동적으로 바꿀 수 있다.

방법1 - 데이터에 링크 제공 (HAL)

HAL: Hypertext Application Language 으로 json,xml코드 내의 외부 리소스에 대한 링크를 추가하기 위한 특별한 데이터 타입

1. application/hal+json
2. application/hal+xml

```json
{
  "data": { // HAL JSON의 리소스 필드
    "id": 1000,
    "name": "게시글 1",
    "content": "HAL JSON을 이용한 예시 JSON"
  },
  "_links": { // HAL JSON의 링크 필드
    "self": {
      "href": "http://localhost:8080/api/article/1000" // 현재 api 주소
    },
    "profile": {
      "href": "http://localhost:8080/docs#query-article" // 해당 api의 문서
    },
    "next": {
      "href": "http://localhost:8080/api/article/1001" // article 의 다음 api 주소
    },
    "prev": {
      "href": "http://localhost:8080/api/article/999" // article의 이전 api 주소
    }
  }
}
```

방법2 - 링크 헤더나 Location을 제공

```json
HTTP/1.1 200 OK
Content-Type: application/json
Link:</subways/1/times>; rel="times",
     </subways/1/detail>; rel="detail"

{"id":1,"name":"잠실역"}
```