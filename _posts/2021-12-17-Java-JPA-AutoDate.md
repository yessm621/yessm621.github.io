---
title:  "JPA 자동으로 처리되는 날짜/시간 설정"
last_modified_at: 2021-12-17T21:00:04-04:00
categories: 
  - JPA
tags:
  - JAVA
  - SpringBoot
  - JPA
# toc: true
# toc_label: "Getting Started"
---

엔티티와 관련된 작업을 하다 보면, 데이터의 등록/수정 시간을 자동으로 처리할 수 있도록 어노테이션을 이용해서 설정


entity/BaseEntity.java

```java
package org.zerock.ex2.entity;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(value = {AuditingEntityListener.class})
@Getter
abstract class BaseEntity {

    @CreatedDate
    @Column(name = "regdate", updatable = false)
    private LocalDateTime regDate;

    @LastModifiedDate
    @Column(name = "moddate")
    private LocalDateTime modDate;
}
```

**@MappedSuperclass**

해당 어노테이션이 적용된 클래스는 테이블로 생성하지 않음
실제 테이블은  BaseEntity 클래스를 상속한 엔티티의 클래스로 데이터베이스 테이블이 생성됨

Jpa 는 고유한 메모리 공간(context) 을 이용해서 엔티티 객체를 관리함
기존의 MyBatis 기반의 프로그램과 달리 단계가 하나 더 있음

MyBatis 와 달리 JPA 에서 사용하는 엔티티 객체들은 영속 컨텍스트라는 곳에서 관리되는 객체
이 객체들이 변경되면 결과적으로 데이터베이스에 이를 반영하는 방식

엔티티 객체에 어떤 변화가 일어나는 것을 감지하는 리스너가 있다
JPA 내부에서 엔티티 객체가 생성/변경되는 것을 감지하는 역할은 AuditingEntityListener 로 이루어짐
이를 통해 regDate, modDate 에 적절한 값이 지정됨

@CreatedDate 는 생성시간, @LastModifiedDate 는 최종 수정 시간을 처리
속성으로 insertable, updateable 등이 있는데 updateable = false 로 지정하면 객체를 데이터베이스에 반영할 때 regdate 칼럼값은 변경되지 않음

JPA 이용하면서 AuditingEntityListener 를 활성화시키기 위해 프로젝트의 `@EnableJpaAuditing` 설정을 추가

<br>

프로젝트명Application.java

```java
package org.zerock.board;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BoardApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoardApplication.class, args);
    }

}
```

