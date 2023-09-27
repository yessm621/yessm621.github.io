---
title: "JPA Intro"
categories:
  - JPA
tags:
  - Java
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

## JPA

```java
package jpabook.start;

import javax.persistence.*;
import java.util.List;


public class JpaMain {

    public static void main(String[] args) {

        //엔티티 매니저 팩토리 생성
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpabook");
        EntityManager em = emf.createEntityManager(); //엔티티 매니저 생성

        EntityTransaction tx = em.getTransaction(); //트랜잭션 기능 획득

        try {

            tx.begin(); //트랜잭션 시작
            logic(em);  //비즈니스 로직
            tx.commit();//트랜잭션 커밋

        } catch (Exception e) {
            e.printStackTrace();
            tx.rollback(); //트랜잭션 롤백
        } finally {
            em.close(); //엔티티 매니저 종료
        }

        emf.close(); //엔티티 매니저 팩토리 종료
    }

    // 비즈니스 로직
    public static void logic(EntityManager em) {

        String id = "id1";
        Member member = new Member();
        member.setId(id);
        member.setUsername("지한");
        member.setAge(2);

        //등록
        em.persist(member);

        //수정
        member.setAge(20);

        //한 건 조회
        Member findMember = em.find(Member.class, id);
        System.out.println("findMember=" + findMember.getUsername() + ", age=" + findMember.getAge());

        //목록 조회
        List<Member> members = em.createQuery("select m from Member m", Member.class).getResultList();
        System.out.println("members.size=" + members.size());

        //삭제
        em.remove(member);

    }
}
```

코드는 크게 3부분으로 나뉘어 있다.

- 엔티티 매니저 설정
- 트랜잭션 관리
- 비즈니스 로직

<br>
<br>

## 엔티티 매니저 설정

1. 엔티티 매니저 팩토리 생성

    → 애플리케이션 전체에서 딱 한 번만 생성하고 공유해서 사용

2. 엔티티 매니저 생성

    → 엔티티 매니저 팩토리에서 엔티티 매니저 생성

    → 엔티티 매니저를 사용해서 엔티티를 데이터베이스에 등록/수정/삭제/조회 할 수 있다.

    → 엔티티 매니저는 db 커넥션과 밀접한 관계가 있으므로 스레드간에 공유하거나 재사용하면 안된다.

3. 종료

    → 엔티티 매니저 종료

    → 엔티티 매니저 팩토리 종료

<br>
<br>

## 트랜잭션 관리

JPA 를 사용하면 항상 트랜잭션 안에서 데이터를 변경해야 한다.

트랜잭션 없이 데이터를 변경하면 예외 발생

트랜잭션 API 를 사용해서 비즈니스 로직이 정상동작하면 트랜잭션을 commit 하고 예외가 발생하면 rollback 한다.

<br>
<br>

## 비즈니스 로직

### JPQL

사용이유?

→ JPA 는 엔티티 객체를 중심으로 개발하므로 검색을 할 때도 테이블이 아닌 엔티티 객체를 대상으로 검색해야 한다.

→ 테이블이 아닌 엔티티 객체를 대상으로 검색하려면 db 의 모든 데이터를 애플리케이션으로 불러와서 엔티티 객체로 변경한 다음 검색해야하는데 이는 사실상 불가능

→ 따라서, 이 문제를 해결하기 위해 JPA 는 JPQL 이라는 쿼리 언어 사용

**JPQL vs SQL**

* JPQL: 엔티티 객체를 대상으로 쿼리한다

* SQL: DB 테이블을 대상

```java
...

//목록 조회
List<Member> members = em.createQuery("select m from Member m", Member.class).getResultList();
System.out.println("members.size=" + members.size());

...
```

위의 코드의 `select m from Member m` 에서 `from Member` 는 테이블이 아닌 엔티티 객체를 의미
