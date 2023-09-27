---
title: "JDBC와 최신 데이터 접근 기술(SQL Mapper, ORM)"
categories:
  - SpringBoot
tags:
  - SpringBoot
  - DB
toc: true
toc_sticky: true
---

최근에는 JDBC를 직접 사용하기 보다 `SQL Mapper`, `ORM`을 통해 JDBC를 편리하게 사용할 수 있다.

## SQL Mapper

`SQL Mapper`는 JDBC를 편리하게 사용할 수 있도록 도와준다. SQL 응답 결과를 객체로 편리하게 변환해주고 JDBC의 반복 코드를 제거해준다. 하지만 개발자가 직접 SQL을 작성해야 한다는 단점도 있다. 대표적으로 **JdbcTemplate, MyBatis**가 SQL Mapper에 해당한다.

![4](https://user-images.githubusercontent.com/79130276/197540320-00b379ec-6ac4-4c36-a081-15eba164580c.png)

## ORM 기술

`ORM(Object Relational Mapper)`은 객체를 관계형 데이터베이스 테이블과 매핑해주는 기술이다. ORM 덕분에 개발자는 SQL을 직접 작성하지 않는다. 또한, 개발자 대신 ORM 기술이 SQL을 동적으로 생성해준다. 대표적으로 **JPA, 하이버네이트, 이클립스 링크**가 있다.

이 중에서 `JPA`는 자바 진영의 **ORM 표준 인터페이스**이고 이것을 구현하는 기술이 **하이버네이트**와 이클립스 링크가 있다. 주로 하이버네이트를 사용한다.

![5](https://user-images.githubusercontent.com/79130276/197540323-d1661631-3f72-4499-82b7-3111201e6a37.png)

그렇다면 SQL Mapper과 ORM 기술 중 어느 것을 사용하는 것이 좋을까?

SQL Mapper는 SQL만 직접 작성하면 나머지 번거로운 일은 SQL Mapper가 대신 해결해준다. ORM 기술은 SQL을 직접 작성하지 않아도 되서 개발 생산성이 높다. 편리한 반면 쉬운 기술은 아니므로 실무에서 사용하려면 깊이있는 학습이 필요하다.

**SQL Mapper와 ORM 기술은 모두 JDBC를 사용**한다. JDBC가 어떻게 동작하는지 알고 기본 원리를 알아야 해당 기술을 더 깊이 있게 이해할 수 있고 문제가 발생했을 때 근본적인 문제를 찾아 해결할 수 있다.