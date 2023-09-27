---
title:  "스프링 부트 SQL문 로깅 옵션"
categories:
  - SpringBoot
tags:
  - SpringBoot
toc: true
toc_sticky: true
---

스프링부트 설정 파일에서 **SQL문에 대한 로깅 옵션**에 대해 정리했다.

```yaml
# application.yml
spring:
  jpa:
    properties:
      hibernate:
        show_sql: true
        format_sql: true
        use_sql_comments: true
logging:
  level:
    org:
      hibernate:
        type:
          descriptor:
            sql: trace
```

- SQL 확인
    - spring.jpa.properties.hibernate.show_sql: true
- SQL 포맷팅 확인
    - spring.jpa.properties.hibernate.format_sql: true
- 추가적인 주석 표시
    - spring.jpa.properties.hibernate.use_sql_comments: true
- ?에 있는 값 확인
    - logging.level.org.hibernate.type.descriptor.sql: trace