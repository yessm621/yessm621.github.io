---
title: "스프링 부트 실행 시 DB에 데이터 삽입"
categories:
  - Spring
tags:
  - DB
toc: true
toc_sticky: true
---

## 개요

애플리케이션을 실행 할 때 DB에 데이터가 미리 들어가 있으면 편할 때가 있다. 이때 데이터를 넣는 방법에 대해 알아보자.

## 설정

application.yml 또는 application.properties를 `resource 폴더` 밑에 두고 아래와 같이 수정한다.

### application.yml

```yaml
spring:
  jpa:
    defer-datasource-initialization: true
  sql:
    init:
      mode: always
```

- spring.jpa.defer-datasource-initialization: true
    - spring boot 2.5 버전 이상부터는 data.sql 스크립트는 Hibernate가 초기화되기 전에 실행된다고 한다. data.sql을 사용하여 Hibernate에 의해 생성된 스키마를 채우려면 해당 값을 true로 설정해야 한다.
- sql.init.mode: always
    - 스크립트 동작 설정
    - 모든 데이터베이스에 SQL 스크립트를 동작시킨다.

### 스크립트 작성

스크립트는 schema.sql, data.sql로 작성할 수 있는데 암묵적으로 schema.sql은 DDL을 작성하고 data.sql은 DML을 작성한다.

data.sql

```sql
INSERT INTO HOUSE_RULE(name) VALUES
    ('반려동물'),
    ('흡연');
```

이제 애플리케이션을 실행하면 data.sql이 실행되어 DB에 데이터가 자동으로 들어간다.

> **참고**
<br>
스프링 릴리즈 노트에서 데이터 초기화 기술을 섞는 것을 추천하지 않는다고 되어있다. 운영 단계에서는 data.sql을 사용하지 말고 개발 단계에서만 사용하자.
>