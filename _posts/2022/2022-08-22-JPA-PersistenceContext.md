---
title: "영속성 컨텍스트"
last_modified_at: 2022-08-22T23:30:00
categories:
  - JPA
tags:
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

## JPA에서 가장 중요한 2가지

- 객체와 관계형 데이터베이스 매핑하기(ORM, Object Relation Mapping)
- 영속성 컨텍스트

## 영속성 컨텍스트

JPA를 이해하는데 가장 중요한 용어이다.

영속성 컨텍스트란 `엔티티를 영구 저장하는 환경`이라는 뜻이다. 애플리케이션과 DB 사이에서 객체를 보관하는 가상의 DB 같은 역할을 한다. (영속성 컨텍스트는 논리적인 개념. 눈에 보이지 않는다.) 엔티티 매니저를 통해 영속성 컨텍스트에 접근할 수 있다.

**엔티티를 영속성 컨텍스트에 저장**

```java
entityManager.persist(entity);
```

**J2SE 환경**

엔티티 매니저와 영속성 컨텍스트가 1:1

![1](https://user-images.githubusercontent.com/79130276/185946817-01ac2498-5fbb-4d95-9eeb-4a2d11018875.png)

**J2EE, 스프링 프레임워크 같은 컨테이너 환경**

엔티티 매니저와 영속성 컨텍스트가 N:1

![2](https://user-images.githubusercontent.com/79130276/185946814-6fb78587-f454-40c1-a33f-5cbe507b4adb.png)

> **참고** J2SE(Standard Edition)
<br>
기본적인 Java의 개발/실행 환경으로 Java언어를 이용하여 어플리케이션(Application), 애플릿(Applet) 그리고 컴포넌트(Component) 등을 개발하고 실행할 수 있는 환경을 제공하는 플랫폼이다.
> 

> **참고** Java EE(Enterprise Edition)
<br>
자바 엔터프라이즈 에디션은 자바를 이용한 서버측 개발을 위한 플랫폼이다. Java EE는 표준 플랫폼인 Java SE를 사용하는 서버를 위한 플랫폼이다. 전사적 차원(대규모의 동시 접속과 유지가 가능한 다양한 시스템의 연동 네트워크 기반 총칭)에서 필요로 하는 도구로 EJB, JSP, Servlet, JNDI 같은 기능을 지원하며 WAS(Web Application Server)를 이용한 프로그램 개발 시 사용된다.
> 

<br>

## 엔티티의 생명주기

### 비영속(new/transient)

영속성 컨텍스트와 전혀 관계가 없는 새로운 상태이며 객체를 생성만 한 상태이다.

```java
//객체를 생성한 상태(비영속) 
Member member = new Member(); 
member.setId("member1"); 
member.setUsername("회원1");
```

### 영속(managed)

영속성 컨텍스트에 저장된 상태이다. 엔티티가 영속성 컨텍스트에 의해 관리되는 상태

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

영속 상태에서는 바로 DB에 저장되지 않는다. **트랜잭션의 commit 시점**에 영속성 컨텍스트에 있는 정보들이 DB에 저장된다.

### 준영속(detached)

영속성 컨텍스트에 저장되었다가 분리된 상태이다.

```java
//회원 엔티티를 영속성 컨텍스트에서 분리, 준영속 상태 
em.detach(member);
```

### 삭제(removed)

삭제된 상태, 실제 DB 삭제를 요청한 상태이다.

```java
//객체를 삭제한 상태(삭제) 
em.remove(member);
```

![3](https://user-images.githubusercontent.com/79130276/185946812-e071cdea-ee79-444b-a780-5e8ef49e4a35.png)

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

## 영속성 컨텍스트의 이점

### 1차 캐시

엔티티를 조회할 때 바로 DB에 접근하는 것이 아니라 1차 캐시를 먼저 조회한다. 이후 DB를 조회하여 데이터가 있다면 1차 캐시에 저장하고 반환한다. 사용자가 10명 있다고 했을 때 1차 캐시를 공유하는 것이 아닌 각각 **개별의 1차 캐시를 가지고** 있다. 따라서, 성능 상 큰 장점은 없다. (매커니즘의 이점이 있는 것..)

![4](https://user-images.githubusercontent.com/79130276/185946810-9d0ae5cd-102a-41bc-93f5-00ef8990ee47.png)

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

### 영속 엔티티의 동일성 보장

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

### 트랜잭션을 지원하는 쓰기 지연

```java
EntityManager em = emf.createEntityManager();

EntityTransaction tx = em.getTransaction();
tx.begin(); // 트랜잭션 시작

Member member1 = new Member(150L, "A");
Member member2 = new Member(160L, "B");

em.persist(member1);
em.persist(member2);
// 여기까지 Insert 쿼리를 데이터베이스에 보내지 않는다.
// 1차 캐시에만 저장
System.out.println("============================");

// 커밋하는 순간 데이터베이스에 Insert 쿼리를 보낸다
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

![5](https://user-images.githubusercontent.com/79130276/185946803-0b8456a6-ffab-43ee-a3a7-e7fcc16bd4f2.png)

![6](https://user-images.githubusercontent.com/79130276/185946799-c00097bb-d574-4025-baee-f00d627abf83.png)

### 변경 감지(dirty check)

`변경 감지`란 영속성 컨텍스트에 있는 엔티티가 **변경**될 때 이루어진다. 엔티티를 수정 후 트랜잭션이 커밋되고 flush()가 호출되면 엔티티와 스냅샷을 비교한다. 비교했을때 값이 다르다면 영속성 컨텍스트가 자동으로 update 쿼리문을 보낸다.

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

![7](https://user-images.githubusercontent.com/79130276/185946780-4b3002ee-1252-46e2-9641-f26fe892717d.png)

> **참고** 스냅샷
값을 읽어 올때 최초 시점의 데이터
>