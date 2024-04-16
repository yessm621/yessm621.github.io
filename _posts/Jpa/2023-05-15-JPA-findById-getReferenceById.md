---
title: "findById() vs getReferenceById() (feat. getOne())"
categories:
  - Jpa
toc: true
toc_sticky: true
---

findById()와 getReferenceById()는 검색할 때 사용하며 비슷한 기능을 한다. 하지만 조회하는 기본 메커니즘이 다르다.

## findById()

findById()는 실제 DB를 바로 조회해서 필요한 데이터를 가져온다. (EAGER) 당연히 반환되는 객체도 데이터가 매핑되어있는 실제 엔티티 객체이다.

## getReferenceById()

getReferenceById()는 주어진 **식별자를 가진 엔티티에 대한 참조를 반환**한다. 이 메소드는 데이터베이스에 충돌하지 않고 항상 `프록시`를 반환한다. LAZY로 가져온 엔티티가 데이터베이스에 존재하지 않으면 실제 엑세스 시 EntityNotFountException을 발생 시킨다.

getReferenceById()가 낯설을 수도 있는데 이전에 사용하던 **getOne()**과 같다. 현재 getOne()은 deprecate되었고 getOne() 대신 getReferenceById()를 사용하라고 공식 문서에 나와있다. (스프링부트 2.7 버전부터 삭제되었다.)

## findById() vs getReferenceById()

이 방법들의 차이점은 `성능`이다. getReferenceById()는 프록시로 반환하며 실제로 액세스 할 때까지 DB에 도달하지 않으므로 성능적인 면에서 좋다.