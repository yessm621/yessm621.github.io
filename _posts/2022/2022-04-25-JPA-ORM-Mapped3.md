---
title:  "고급 매핑"
last_modified_at: 2022-04-25T14:30:00
categories: 
  - JPA
tags:
  - JPA
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
published : false
---

## 자바 ORM 표준 JPA 프로그래밍

[1. JPA 시작](https://yessm621.github.io/jpa/JPA-Jpa-Start)

[2. 영속성 컨텍스트 - 내부 동작 방식](https://yessm621.github.io/jpa/JPA-EntityManager/)

[3. 엔티티 매핑](https://yessm621.github.io/jpa/JPA-Entity/)

[4. 연관관계 매핑 기초](https://yessm621.github.io/jpa/JPA-ORM-Mapped/)

[5. 다양한 연관관계 매핑](https://yessm621.github.io/jpa/JPA-ORM-Mapped2/)

[6. 고급 매핑](https://yessm621.github.io/jpa/JPA-ORM-Mapped3/)

[7. 프록시와 연관관계 관리](https://yessm621.github.io/jpa/JPA-ProxyMapped/)

[8. 값 타입](https://yessm621.github.io/jpa/JPA-ValueType/)

[9. 객체지향 쿼리 언어(JPQL)](https://yessm621.github.io/jpa/JPA-JPQL/)

<br>
<br>


## 1. 상속관계 매핑

- 관계형 데이터베이스는 상속관계X
- 슈퍼타입 서브타입 관계라는 모델링 기법이 객체 상속과 유사
- 상속관계 매핑: 객체의 상속 구조와 DB의 슈퍼타입 서브타입 관계를 매핑
    
    ![1](https://user-images.githubusercontent.com/79130276/165026481-e836a034-c085-4ee1-b00f-baa54566fdc6.png)
    
- 슈퍼타입 서브타입 논리 모델을 실제 물리 모델로 구현하는 방법
    - 각각 테이블로 변환 → 조인 전략
    - 통합 테이블로 변환 → 단일 테이블 전략
    - 서브타입 테이블로 변환 → 구현 클래스마다 테이블 전략

<br>

### 1.1 주요 어노테이션

- @Inheritance(strategy=IngeritanceType.xxx)
    - JOINED: 조인 전략
    - SINGLE_TABLE: 단일 테이블 전략
    - TABLE_PER_CLASS: 구현 클래스마다 테이블 전략
    
- @DiscriminatorColumn(name=”DTYPE”)
- @DiscriminatorValue(”xxx”)

<br>

### 1.2 조인 전략

→ 비즈니스 적으로 중요한 로직일 때 조인 전략 사용

→ 조회(find)하면 Jpa 가 알아서 조인해줌

![2](https://user-images.githubusercontent.com/79130276/165026484-66c110e2-c51b-4236-8c55-eec321c3d3c0.png)

**장점**

- 테이블 정규화
- 외래 키 참조 무결성 제약조건 활용가능
- 저장공간 효율화

**단점**

- 조회시 조인을 많이 사용, 성능 저하
- 조회 쿼리가 복잡함
- 데이터 저장시 INSERT SQL 2번 호출

**Item.java**

```java
package jpabook.jpashop;

import javax.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Item {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int price;
}
```

```
Hibernate: 
    
    create table Album (
       artist varchar(255),
        id bigint not null,
        primary key (id)
    )
Hibernate: 
    
    create table Book (
       author varchar(255),
        isbn varchar(255),
        id bigint not null,
        primary key (id)
    )
Hibernate: 
    
    create table Item (
       id bigint not null,
        name varchar(255),
        price integer not null,
        primary key (id)
    )
Hibernate: 
    
    create table Movie (
       actor varchar(255),
        director varchar(255),
        id bigint not null,
        primary key (id)
    )
Hibernate: 
    
    alter table Album 
       add constraint FKcve1ph6vw9ihye8rbk26h5jm9 
       foreign key (id) 
       references Item
Hibernate: 
    
    alter table Book 
       add constraint FKbwwc3a7ch631uyv1b5o9tvysi 
       foreign key (id) 
       references Item
Hibernate: 
    
    alter table Movie 
       add constraint FK5sq6d5agrc34ithpdfs0umo9g 
       foreign key (id) 
       references Item
```

**JpaMain.java**

```java
...

Movie movie = new Movie();
movie.setDirector("aaa");
movie.setActor("bbbb");
movie.setName("바람과함께");
movie.setPrice(10000);

em.persist(movie);

em.flush();
em.clear();

Movie findMovie = em.find(Movie.class, movie.getId());
System.out.println("findMovie = " + findMovie);

...
```

```
Hibernate: 
    /* insert jpabook.jpashop.Movie
        */ insert 
        into
            Item
            (name, price, id) 
        values
            (?, ?, ?)
Hibernate: 
    /* insert jpabook.jpashop.Movie
        */ insert 
        into
            Movie
            (actor, director, id) 
        values
            (?, ?, ?)
Hibernate: 
    select
        movie0_.id as id1_2_0_,
        movie0_1_.name as name2_2_0_,
        movie0_1_.price as price3_2_0_,
        movie0_.actor as actor1_4_0_,
        movie0_.director as director2_4_0_ 
    from
        Movie movie0_ 
    inner join
        Item movie0_1_ 
            on movie0_.id=movie0_1_.id 
    where
        movie0_.id=?
findMovie = jpabook.jpashop.Movie@56cfe111
```

<br>

부모 테이블에 **@DiscriminatorColumn** 을 쓰면 default 인 **DTYPE** 이란 컬럼이 생성되고 

자식 테이블에 **@DiscriminatorValue** 을 지정하지 않으면 entity 이름이 들어간다. (여기선 Movie)

**@DiscriminatorValue(value = "M")** value 값을 통해 구분값을 지정할 수도 있다.

→ `운영상 DTYPE 은 있는게 좋다!`

**Item.java**

```java
package jpabook.jpashop;

import javax.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn
public class Item {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int price;
}
```

**Movie.java**

```java
package jpabook.jpashop;

import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value = "M")
public class Movie extends Item {
    private String director;
    private String actor;
}
```

```
Hibernate: 
    
    create table Item (
       DTYPE varchar(31) not null,
        id bigint not null,
        name varchar(255),
        price integer not null,
        primary key (id)
    )
```

<br>

### 1.3 단일 테이블 전략

→ 기본값이 **SINGLE_TABLE** 전략

→ 단순하고 더 이상 확장될 것 같지 않을 때 사용

**장점**

- 조인이 필요 없으므로 일반적으로 조회 성능이 빠름
- 조회 쿼리가 단순함

**단점**

- 자식 엔티티가 매핑한 컬럼은 모두 null 허용
- 단일 테이블에 모든 것을 저장하므로 테이블이 커질 수 있다. 상
황에 따라서 조회 성능이 오히려 느려질 수 있다.

![3](https://user-images.githubusercontent.com/79130276/165026485-a7bb581e-eb1c-4837-9adf-594bed80e11f.png)

**Item.java**

```java
package jpabook.jpashop;

import javax.persistence.*;

@Entity
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Item {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int price;
}
```

**Album.java**

```java
package jpabook.jpashop;

import javax.persistence.Entity;

@Entity
public class Album extends Item {
    private String artist;
}
```

**Movie.java**

```java
package jpabook.jpashop;

import javax.persistence.Entity;

@Entity
public class Movie extends Item {
    private String director;
    private String actor;
}
```

**Book.java**

```java
package jpabook.jpashop;

import javax.persistence.Entity;

@Entity
public class Book extends Item {
    private String author;
    private String isbn;
}
```

```
Hibernate: 
    
    create table Item (
       DTYPE varchar(31) not null,
        id bigint not null,
        name varchar(255),
        price integer not null,
        actor varchar(255),
        director varchar(255),
        artist varchar(255),
        author varchar(255),
        isbn varchar(255),
        primary key (id)
    )
```

<br>

### 1.4 구현 클래스마다 테이블 전략 (쓰면 안되는 전략!)

→ 이 전략은 데이터베이스 설계자와 ORM 전문가 **둘 다 추천X**
**장점**

- 서브 타입을 명확하게 구분해서 처리할 때 효과적
- not null 제약조건 사용 가능

**단점**

- 여러 자식 테이블을 함께 조회할 때 성능이 느림(UNION SQL 필요)
- 자식 테이블을 통합해서 쿼리하기 어려움

![4](https://user-images.githubusercontent.com/79130276/165026483-c5112092-e2ef-448c-99c7-8c13d0dac2ac.png)

```java
package jpabook.jpashop;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn
public abstract class Item {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int price;
}
```

```
Hibernate: 
    
    create table Album (
       id bigint not null,
        name varchar(255),
        price integer not null,
        artist varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Book (
       id bigint not null,
        name varchar(255),
        price integer not null,
        author varchar(255),
        isbn varchar(255),
        primary key (id)
    )
Hibernate: 
    
    create table Locker (
       LOCKER_ID bigint not null,
        name varchar(255),
        primary key (LOCKER_ID)
    )
Hibernate: 
    
    create table Movie (
       id bigint not null,
        name varchar(255),
        price integer not null,
        actor varchar(255),
        director varchar(255),
        primary key (id)
    )
4월 25, 2022 2:06:00 오후 org.hibernate.resource.transaction.backend.jdbc.internal.DdlTransactionIsolatorNonJtaImpl getIsolatedConnection
INFO: HHH10001501: Connection obtained from JdbcConnectionAccess [org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator$ConnectionProviderJdbcConnectionAccess@63b3ee82] for (non-JTA) DDL execution was not in auto-commit mode; the Connection 'local transaction' will be committed and the Connection will be set into auto-commit mode.
4월 25, 2022 2:06:00 오후 org.hibernate.resource.transaction.backend.jdbc.internal.DdlTransactionIsolatorNonJtaImpl getIsolatedConnection
INFO: HHH10001501: Connection obtained from JdbcConnectionAccess [org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator$ConnectionProviderJdbcConnectionAccess@7cea0110] for (non-JTA) DDL execution was not in auto-commit mode; the Connection 'local transaction' will be committed and the Connection will be set into auto-commit mode.
4월 25, 2022 2:06:00 오후 org.hibernate.engine.transaction.jta.platform.internal.JtaPlatformInitiator initiateService
INFO: HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert jpabook.jpashop.Movie
        */ insert 
        into
            Movie
            (name, price, actor, director, id) 
        values
            (?, ?, ?, ?, ?)
Hibernate: 
    select
        movie0_.id as id1_2_0_,
        movie0_.name as name2_2_0_,
        movie0_.price as price3_2_0_,
        movie0_.actor as actor1_4_0_,
        movie0_.director as director2_4_0_ 
    from
        Movie movie0_ 
    where
        movie0_.id=?
findMovie = jpabook.jpashop.Movie@1b1c538d
```

<br>

구현 클래스마다 테이블 전략이 좋은 전략같지만 데이터를 조회할 때 문제가 발생한다

→ **Union all**로 조회함

```java
// 아래코드는 문제 발생안함 (명확하게 조회할때)
Movie findMovie = em.find(Movie.class, movie.getId());
System.out.println("findMovie = " + findMovie);

// 문제 발생 (Union all로 조회)
Item item = em.find(Item.class, movie.getId());
System.out.println("item = " + item);
```

```
Hibernate: 
    select
        item0_.id as id1_2_0_,
        item0_.name as name2_2_0_,
        item0_.price as price3_2_0_,
        item0_.actor as actor1_4_0_,
        item0_.director as director2_4_0_,
        item0_.artist as artist1_0_0_,
        item0_.author as author1_1_0_,
        item0_.isbn as isbn2_1_0_,
        item0_.clazz_ as clazz_0_ 
    from
        ( select
            id,
            name,
            price,
            actor,
            director,
            null as artist,
            null as author,
            null as isbn,
            1 as clazz_ 
        from
            Movie 
        union
        all select
            id,
            name,
            price,
            null as actor,
            null as director,
            artist,
            null as author,
            null as isbn,
            2 as clazz_ 
        from
            Album 
        union
        all select
            id,
            name,
            price,
            null as actor,
            null as director,
            null as artist,
            author,
            isbn,
            3 as clazz_ 
        from
            Book 
    ) item0_ 
where
    item0_.id=?
item = jpabook.jpashop.Movie@29a98d9f
```

<br>

> 참고
JPA를 사용하면 조인 전략에서 단일 테이블 전략으로 변경할때 코드의 딱 한 부분만 고치면 된다 → JPA의 장점!
> 

<br>

## 2. @MappedSuperclass

**공통 매핑 정보**가 필요할 때 사용

- 상속관계 매핑X
- 엔티티X, 테이블과 매핑X
- 부모 클래스를 상속 받는 **자식 클래스에 매핑 정보만 제공**
- 조회, 검색 불가(**em.find(BaseEntity) 불가**)
- 직접 생성해서 사용할 일이 없으므로 **추상 클래스** 권장
- 테이블과 관계 없고, 단순히 엔티티가 공통으로 사용하는 매핑 정보를 모으는 역할
- 주로 등록일, 수정일, 등록자, 수정자 같은 전체 엔티티에서 공통으로 적용하는 정보를 모을 때 사용
- 참고: @Entity 클래스는 엔티티나 @MappedSuperclass로 지정한 클래스만 상속 가능

```java
package me.yessm.airbnbjava.domain;

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
public abstract class BaseEntity {

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```