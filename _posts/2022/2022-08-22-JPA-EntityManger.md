---
title:  "엔티티 매니저 팩토리와 엔티티 매니저"
last_modified_at: 2022-08-22T23:20:00
categories: 
  - JPA
tags:
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

## 엔티티 매니저 팩토리

엔티티 매니저 팩토리는 애플리케이션 전체에서 **딱 한 번만 생성**하고 공유해서 사용한다.

## 엔티티 매니저

엔티티 매니저 팩토리에서 엔티티 매니저 생성한다. 

`엔티티 매니저`를 사용해서 엔티티를 데이터베이스에 등록, 수정, 삭제, 조회 등 엔티티와 관련된 작업을 수행한다. 엔티티 매니저는 DB 커넥션과 밀접한 관계가 있으므로 **쓰레드간에 공유하거나 재사용하면 안된다**. JPA의 모든 데이터를 `변경`하는 작업은 `트랜잭션 안에서 사용`해야 한다.

`@PersistenceContext`를 통해 EntityManager를 주입 받아 사용한다.

```java
@PersistenceContext
EntityManager em;
```

![Untitled](https://user-images.githubusercontent.com/79130276/185944715-7dabc423-98d3-489a-a670-216e969c24f4.png)

<br>

### JPA 동작 예제

```java
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class JpaMain {

    public static void main(String[] args) {
        // 엔티티 매니저 팩토리 생성
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        // 엔티티 매니저 생성
        EntityManager em = emf.createEntityManager();

        //트랜잭션
        EntityTransaction tx = em.getTransaction();
        tx.begin();

        //code
        try {
            ...
            tx.commit();
        } catch (Exception e) {
            tx.rollback();
        } finally {
            em.close(); // 엔티티 매니저 종료
        }

        emf.close();// 엔티티 매니저 팩토리 종료
    }
}
```