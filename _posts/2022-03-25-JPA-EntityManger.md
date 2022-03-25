---
title:  "영속성 컨텍스트"
last_modified_at: 2022-03-25T16:44:00
categories: 
  - JPA
tags:
  - JPA
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

## 자바 ORM 표준 JPA 프로그래밍

[1. JPA 시작](https://yessm621.github.io/jpa/JPA-Jpa-Start/)

[2. 영속성 컨텍스트](https://yessm621.github.io/jpa/JPA-EntityManager/)

<br>
<br>

# 영속성 관리

### JPA에서 가장 중요한 2가지

- 객체와 관계형 데이터베이스 매핑하기(Object Relation Mapping)
- 영속성 컨텍스트

<br>

## 1. 엔티티 매니저 팩토리와 엔티티 매니저

![Untitled](https://user-images.githubusercontent.com/79130276/160080160-d647b115-0019-4544-acaf-bc540ec6b6f8.png)

<br>

### 1.1 영속성 컨텍스트

- JPA를 이해하는데 가장 중요한 용어
- ‘엔티티를 영구 저장하는 환경’이라는 뜻
- EntityManager.persist(entity);

<br>

### 1.2 엔티티 매니저? 영속성 컨텍스트?

- 영속성 컨텍스트는 논리적인 개념
- 눈에 보이지 않는다.
- 엔티티 매니저를 통해서 영속성 컨텍스트에 접근

<br>

**J2SE 환경**

엔티티 매니저와 영속성 컨텍스트가 1:1

![Untitled2](https://user-images.githubusercontent.com/79130276/160080157-1c147c97-d8d1-4381-b0a5-896f1151aed6.png)

<br>

**J2EE, 스프링 프레임워크 같은 컨테이너 환경**

엔티티 매니저와 영속성 컨텍스트가 N:1

![Untitled3](https://user-images.githubusercontent.com/79130276/160080152-4dc1a055-6ed7-40ef-a845-9bf5ee4ff12c.png)

<br>

### 1.3 엔티티의 생명주기

- 비영속(new/transient)
    - 영속성 컨텍스트와 전혀 관계가 없는 새로운 상태
- 영속(managed)
    - 영속성 컨텍스트에 관리되는 상태
- 준영속(detached)
    - 영속성 컨텍스트에 저장되었다가 분리된 상태
- 삭제(removed)
    - 삭제된 상태

![Untitled4](https://user-images.githubusercontent.com/79130276/160080148-448f0f4a-204f-4043-9669-75003560065a.png)

<br>

**비영속**

```java
//객체를 생성한 상태(비영속) 
Member member = new Member(); 
member.setId("member1"); 
member.setUsername("회원1");
```

<br>

**영속**

```java
//객체를 생성한 상태(비영속) 
Member member = new Member(); 
member.setId("member1"); 
member.setUsername(“회원1”);

EntityManager em = emf.createEntityManager();
em.getTransaction().begin();

//객체를 저장한 상태(영속)
em.persist(member);
```

<br>

**준영속과 삭제**

```java
//회원 엔티티를 영속성 컨텍스트에서 분리, 준영속 상태 
em.detach(member);

//객체를 삭제한 상태(삭제) 
em.remove(member);
```

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
            //비영속
            Member member = new Member();
            member.setId(100L);
            member.setName("HelloJPA");

            //영속
            System.out.println("=== BEFORE ===");
            em.persist(member);
            System.out.println("=== AFTER ===");

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

```
=== BEFORE ===
=== AFTER ===
Hibernate: 
    /* insert hellojpa.Member
        */ insert 
        into
            Member
            (name, id) 
        values
            (?, ?)
```

<br>

### 1.4 영속성 컨텍스트의 이점

**1.4.1 1차 캐시**

- 엔티티를 조회할 때 바로 DB에 접근하는 것이 아니라 1차 캐시를 먼저 조회함
- 이후 DB를 조회하여 데이터가 있다면 1차 캐시에 저장하고 반환함

![5](https://user-images.githubusercontent.com/79130276/160080146-438e427d-e86b-4594-8145-12c1bfbf8899.png)

**JpaMain.java**

```java
// 엔티티를 생성한 상태(비영속)
Member member = new Member();
member.setId(2L);
member.setName("HelloJPA");

System.out.println("=== BEFORE ===");
// 엔티티를 영속
// 1차 캐시에 저장됨
em.persist(member);
System.out.println("=== AFTER ===");

// 1차 캐시에서 조회하기 때문에 select문이 없다
Member findMember = em.find(Member.class, 2L);

System.out.println("findMember.id = " + findMember.getId());
System.out.println("findMember.name = " + findMember.getName());
```

```
=== BEFORE ===
=== AFTER ===
findMember.id = 2
findMember.name = HelloJPA
Hibernate: 
    /* insert hellojpa.Member
        */ insert 
        into
            Member
            (name, id) 
        values
            (?, ?)
```

<br>

**1.4.2 영속 엔티티의 동일성 보장**

**JpaMain.java**

```java
// DB에서 조회 후 1차 캐시에 저장
Member findMember1 = em.find(Member.class, 2L);
// 1차 캐시에서 조회
Member findMember2 = em.find(Member.class, 2L);

System.out.println("result = " + (findMember1 == findMember2));
```

```
Hibernate: 
    select
        member0_.id as id1_0_0_,
        member0_.name as name2_0_0_ 
    from
        Member member0_ 
    where
        member0_.id=?
result = true
```

<br>

**1.4.3 트랜잭션을 지원하는 쓰기 지연**

**JpaMain.java**

```java
EntityManager em = emf.createEntityManager();

EntityTransaction tx = em.getTransaction();
tx.begin(); // 트랜잭션 시작

Member member1 = new Member(150L, "A");
Member member2 = new Member(160L, "B");

em.persist(member1);
em.persist(member2);
// 여기까지 Insert Sql을 데이터베이스에 보내지 않는다
System.out.println("============================");

// 커밋하는 순간 데이터베이스에 Insert Sql을 보낸다
tx.commit();
```

```
============================
Hibernate: 
    /* insert hellojpa.Member
        */ insert 
        into
            Member
            (name, id) 
        values
            (?, ?)
Hibernate: 
    /* insert hellojpa.Member
        */ insert 
        into
            Member
            (name, id) 
        values
            (?, ?)
```

![6](https://user-images.githubusercontent.com/79130276/160080144-7e981a76-6300-41b1-845b-91dbf068bf2b.png)

![7](https://user-images.githubusercontent.com/79130276/160080139-1218aa3e-11b5-48f2-99c5-d3526843d52e.png)

<br>

**1.4.4 변경 감지(dirty check)**

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();
transaction.begin(); // [트랜잭션] 시작

// 영속 엔티티 조회
Member memberA = em.find(Member.class, "memberA");

// 영속 엔티티 데이터 수정
memberA.setUsername("hi");
memberA.setAge(10);

//em.update(member) 이런 코드가 있어야 하지 않을까?

transaction.commit(); // [트랜잭션] 커밋
```

트랜잭션 커밋 후 flush() 호출되고 엔티티와 스냅샷을 비교한다

(스냅샷이란 값을 읽어 올때 최초 시점의 데이터)

![8](https://user-images.githubusercontent.com/79130276/160080132-14093d93-e39e-4b92-92d2-6a7bbaeab305.png)

<br>

1.4.5 **지연 로딩**