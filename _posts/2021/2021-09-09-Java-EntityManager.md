---
title: "EntityManager 와 영속성 컨텍스트 (PersistenceContext)"
categories:
  - JPA
tags:
  - Java
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

## 엔티티 매니저 (EntityManager)

엔티티를 저장, 수정, 삭제, 조회 등 엔티티와 관련된 작업을 수행

@PersistenceContext 를 통해 EntityManager 를 주입 받아 사용

```java
@Repository
public class Repository {

	@PersistenceContext
	EntityManager em;

	em.find();     // 엔티티 조회
	em.persist();  // 엔티티 저장
	em.remove();   // 엔티티 삭제
	em.flush();    // 영속성 컨텍스트 내용을 데이터베이스에 반영
	em.detach();   // 엔티티를 준영속 상태로 전환
	em.merge();    // 준영속 상태의 엔티티를 영속상태로 변경
	em.clear();    // 영속성 컨텍스트 초기화
	em.close();    // 영속성 컨텍스트 종료
}
```

<br>

## 영속성 컨텍스트 (PersistenceContext)

논리적인 개념으로, 눈에 보이지 않는다.

`Entity 를 영구 저장하는 환경`

ex) 

EntityManager.persist(entity);

→ 실제로 DB 에 저장하는 것이 아니라 영속성 컨텍스트를 통해서 Entity 를 영속화

→ 정확히 말하면 persist() 시점에서 Entity 를 영속성 컨텍스트에 저장하는 것

<br>

### 엔티티의 생명주기 (Entity LifeCycle)

- 비영속

    → 영속성 컨텍스트와 전혀 관계 없음

    → 객체를 생성만 한 상태

    ```java
    Member member = new Member();
    member.setId("member1");
    ```

- 영속

    → 영속성 컨텍스트에 저장된 상태

    → Entity 가 영속성 컨텍스트에 의해 관리되는 상태

    ```java
    @PersistentContext
    EntityManager em;

    // 비영속
    Member member = new Member();
    member.setId("member1");

    // 영속
    em.persist(member);
    ```

    영속 상태에서는 바로 DB 에 저장되지 않는다.

    transaction.commit();

    → 트랜잭션의 commit 시점에 영속성 컨텍스트에 있는 정보들이 DB에 저장됨.

- 준영속 (detached)

    → 영속성 컨텍스트에 저장되었다가 분리된 상태

    → 영속성 컨텍스트에서 지운상태

    ```java
    entityManager.detach(member);
    ```

- 삭제 (removed)

    → 실제 DB 삭제를 요청한 상태

    ```java
    entityManager.remove(member);
    ```

<br>

MemberRepository.java

```java
package jpabook.jpashop.repository;

import jpabook.jpashop.domain.Member;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

// Repository 어노테이션 사용해서 스프링 빈에 등록
@Repository
public class MemberRepository {

	// 영속성 컨텍스트
    @PersistenceContext
    private EntityManager em;

    public void save(Member member) {
		// 엔티티를 영속성 컨텍스트에 저장, DB에 저장되진 않는다
        em.persist(member);
    }

    public Member findOne(Long id) {
        // em.find(TYPE, PK); : 1건 조회
        return em.find(Member.class, id);
    }

    public List<Member> findAll() {
        // jpql 사용
		// em.createQuery(Query, TYPE)
        return em.createQuery("select m from Member m", Member.class)
                .getResultList();
    }

    public List<Member> findByName(String name) {
        return em.createQuery("select m from Member m where m.name = :name", Member.class)
                .setParameter("name", name)
                .getResultList();
    }
}
```
