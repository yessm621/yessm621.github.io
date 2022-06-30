---
title:  "JPA 시작하기"
last_modified_at: 2022-03-25T16:44:00
categories: 
  - JPA
tags:
  - JPA
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
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

## 1. Hello JPA - 프로젝트 생성

[Your relational data. Objectively. - Hibernate ORM](https://hibernate.org/orm/)

보통 hibernate 만 단독으로 사용하기 보다 SpringBoot 와 같이 사용하므로 버전을 같이 맞춰줘야함

<br>

### 1.1 JPA와 관련된 라이브러리 import

**pom.xml**

```xml
<dependencies>
	<!-- JPA 하이버네이트 -->
	<dependency>
		<groupId>org.hibernate</groupId>
		<artifactId>hibernate-entitymanager</artifactId>
		<version>5.6.3.Final</version>
	</dependency>
	<!-- H2 데이터베이스 -->
	<dependency>
		<groupId>com.h2database</groupId>
		<artifactId>h2</artifactId>
		<version>1.4.200</version>
	</dependency>
</dependencies>
```

<br>

### 1.2 JPA 설정하기 - persistence.xml

표준 위치가 정해져 있다

→ /META-INF/persistence.xml

<br>

**persistence.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="hello">
        <properties>
            <!-- 필수 속성 -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/test"/>
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>

            <!-- 옵션 -->
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
            <property name="hibernate.use_sql_comments" value="true"/>
            <!--<property name="hibernate.hbm2ddl.auto" value="create" />-->
        </properties>
    </persistence-unit>
</persistence>
```

<br>

### 1.3 데이터베이스 방언

- JPA는 특정 데이터베이스에 종속 X
    
    → oracle 을 쓰다가 mysql 을 써도 문제가 없다.
    
- 각각의 데이터베이스가 제공하는 SQL 문법과 함수는 조금씩 다름
    - 가변 문자: MySQL은 VARCHAR, Oracle은 VARCHAR2
    - 문자열을 자르는 함수: SQL 표준은 SUBSTRING(), Oracle은 SUBSTR()
    - 페이징: MySQL은 LIMIT, Oracle은 ROWNUM
- 방언: SQL 표준을 지키지 않는 특정 **데이터베이스만의 고유한 기능**
    
    → 방언은 persistence.xml의 `hibernate.dialect 속성`에 지정
    
<br>

hibernate.show_sql: sql 문을 보여줌

hibernate.format_sql: sql 문을 포맷팅

hibernate.use_sql_comments: sql 문에 대한 코멘트를 달아줌

<br>

## 2. Hello JPA - 애플리케이션 개발

### 2.1 JPA 구동 방식

![Untitled](https://user-images.githubusercontent.com/79130276/160078417-819bfd74-f305-4944-a6ac-4dee963b82a7.png)

<br>

### 2.2 JPA 동작 확인

**Member.java**

```java
package hellojpa;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Member {

    @Id
    private Long id;
    private String name;

    //getter, setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

**JpaMain.java**

```java
package hellojpa;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class JpaMain {

    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");

        EntityManager em = emf.createEntityManager();

        //트랜잭션
        EntityTransaction tx = em.getTransaction();
        tx.begin();

        //code
        try {
            Member member = new Member();

            member.setId(1L);
            member.setName("HelloA");

            em.persist(member);

            tx.commit();
        } catch (Exception e) {
            tx.rollback();
        } finally {
            em.close();
        }

        emf.close();
    }
}
```

<br>

- 엔티티 매니저 팩토리는 하나만 생성해서 애플리케이션 전체에서 공유
- 엔티티 매니저는 **쓰레드간에 공유 X**
- JPA의 모든 `데이터를 변경`하는 작업은 `트랜잭션 안에서 실행`

<br>

**JpaMain.java**

```java
package hellojpa;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class JpaMain {

    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");

        EntityManager em = emf.createEntityManager();

        //트랜잭션
        EntityTransaction tx = em.getTransaction();
        tx.begin();

        //code
        try {
            Member findMember = em.find(Member.class, 1L);
            //조회
            System.out.println("findMember.id = " + findMember.getId());
            System.out.println("findMember.name = " + findMember.getName());

            //삭제
            //em.remove(findMember);

            //수정
            findMember.setName("HelloJPA");
            //persist를 안하고 객체에서 set만 해도 DB에 저장된 값이 바뀐다.
            //em.persist(findMember);

            tx.commit();
        } catch (Exception e) {
            tx.rollback();
        } finally {
            em.close();
        }

        emf.close();
    }
}
```

JPA로 엔티티 수정 시 persist 를 해야할 것 같지만 안하고 객체에서 set만 해도 DB에 저장된 값이 변경된다.

→ JPA를 통해서 entity를 가져오면 JPA가 관리를 함

→ 이후 데이터가 변경이 됬는지 transaction 하는 시점에 체크

→ 데이터가 변경됐으면 transaction 직전에 update 쿼리를 날리고 transaction commit 을 함

<br>

### 2.3 JPQL

- 가장 단순한 조회 방법
- JPA를 사용하면 엔티티 객체를 중심으로 개발
- 문제는 검색 쿼리
- 검색을 할 때도 테이블이 아닌 엔티티 객체를 대상으로 검색
- 모든 DB 데이터를 객체로 변환해서 검색하는 것은 불가능
- 애플리케이션이 필요한 데이터만 DB에서 불러오려면 결국 검색 조건이 포함된 SQL이 필요
- JPA는 SQL을 추상화한 JPQL이라는 객체 지향 쿼리 언어 제공
- SQL과 문법 유사, SELECT, FROM, WHERE, GROUP BY, HAVING, JOIN 지원
- **JPQL은 엔티티 객체**를 대상으로 쿼리
- **SQL은 데이터베이스 테이블**을 대상으로 쿼리
- 테이블이 아닌 `객체를 대상으로 검색하는 객체 지향 쿼리`
- SQL을 추상화해서 특정 데이터베이스 SQL에 의존X
- JPQL을 한마디로 정의하면 객체 지향 SQL