---
title:  "ORM과 JPA, Hibernate"
categories: 
  - Jpa
tags:
  - Jpa
---

## ORM

ORM이란 Object(객체)와 DB의 테이블을 매핑하여 데디터를 객체화하는 기술을 말한다. ORM을 사용하면 개발자가 반복적인 SQL을 직접 작성하지 않아도 되므로 생산성이 높아지고 DBMS에 종속적이지 않다는 장점이 있다. 그러나, 쿼리가 복잡해지면 ORM으로 표현하는데 한계가 있고, 성능이 raw query에 비해 느리다는 단점이 있다.

## JPA

`JPA`란 **자바 ORM 기술에 대한 API 표준 명세**를 의미한다. JPA는 ORM을 사용하기 위한 인터페이스를 모아둔 것이며, JPA를 사용하기 위해서는 JPA를 구현한 `Hibernate`, EclipseLink, DataNucleus 같은 ORM 프레임워크를 사용해야 한다.

**Hibernate는 JPA의 구현체**이다. 즉, JPA는 인터페이스고 Hibernate는 JPA를 구현하는 구현체이다. 많은 구현체 중에서 Hibernate를 주로 사용한다.

JPA를 사용하면 SQL을 직접 작성하지 않아도 되고 객체 중심으로 개발이 가능하다. 또한, 유지보수도 용이하다는 장점이 있다. 하지만, 앞에서 말한 ORM의 단점과 마찬가지로 쿼리가 복잡해지면 한계가 있다. JPA에서는 이를 보완하기 위해 JPQL, QueryDSL 등을 사용하거나 한 프로젝트 내에서 Mybatis와 JPA를 같이 사용하기도 한다.

> **참고** SQL Mapper
Object와 SQL의 필드를 매핑하여 데이터를 객체화 하는 기술이다. SQL문을 직접 작성하고 쿼리 수행 결과를 어떠한 객체에 매핑할지 바인딩 하는 방법이며, DBMS에 종속적인 문제가 있다. 주로 JdbcTemplate, MyBatis 등에서 사용한다.
> 

### Hibernate 공식 문서

[Your relational data. Objectively. - Hibernate ORM](https://hibernate.org/orm/)