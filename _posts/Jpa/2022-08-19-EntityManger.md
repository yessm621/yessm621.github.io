---
title:  "엔티티 매니저 팩토리와 엔티티 매니저"
categories:
  - Jpa
toc: true
toc_sticky: true
---

## 개요

JPA가 제공하는 기능은 크게 두가지 이다.

1. 엔티티(객체)와 테이블을 매핑하는 설계 부분
2. 매핑한 엔티티를 실제 사용하는 부분

엔티티 매니저는 그 중 두번째, 매핑한 엔티티를 사용하는 부분과 관련된 용어이다.

## 엔티티 매니저 팩토리

*엔티티 매니저 팩토리는 엔티티 매니저를 생성하는 공장이다.* **비용이 비싸**기 때문에 엔티티 매니저 팩토리는 애플리케이션 전체에서 **딱 한 번만 생성**하고 **공유해서 사용**한다.

**엔티티 매니저 팩토리 생성 코드**

```java
// 엔티티 매니저를 만드는 공장, 비용이 비싸다.
EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpabook");
```

## 엔티티 매니저

매핑한 엔티티는 엔티티 매니저를 통해 사용한다. *엔티티 매니저를 사용해서 엔티티를 DB에 등록, 수정, 삭제, 조회 등 엔티티와 관련된 작업을 수행한다. 이름 그대로 엔티티를 관리하는 관리자다. 개발자 입장에서 엔티티 매니저는 엔티티를 저장하는 가상의 데이터베이스로 생각하면 된다.* 엔티티 매니저는 실제 트랜잭션 단위가 수행될 때마다 생성된다.

**엔티티 매니저 생성 코드**

```java
EntityManager em = emf.createEntityManager();
```

엔티티 매니저 팩토리는 생성하는 비용이 비싼 반면, 엔티티 매니저는 생성하는 비용이 거의 들지 않는다. 그리고 엔티티 매니저 팩토리는 서로 다른 스레드 간에 공유해도 되지만, 엔티티 매니저는 DB 커넥션과 밀접한 관계가 있고 **동시성 문제가 발생할 수 있으므로 쓰레드간에 공유하거나 재사용하면 안된다**.

## 엔티티 트랜잭션

JPA의 데이터를 변경하는 모든 작업은 반드시 트랜잭션 안에서 이루어져야 한다.

```java
EntityTransaction tx = em.getTransaction();

tx.begin(); //트랜잭션 시작
tx.commit(); //트랜잭션 수행
tx.rollback(); // 작업에 문제 발생 시 롤백
```

![Untitled](https://user-images.githubusercontent.com/79130276/185944715-7dabc423-98d3-489a-a670-216e969c24f4.png)

위의 그림은 일반적인 웹 애플리케이션을 표현한다. 그림의 EntityManager1은 아직 데이터베이스 커넥션을 사용하지 않았는데 엔티티 매니저는 데이터베이스 연결이 필요한 시점까지 커넥션을 얻지 않고 트랜잭션을 시작할 때 커넥션을 얻는다. 

## 예제

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

        // 엔티티 트랜잭션
        EntityTransaction tx = em.getTransaction();
        tx.begin(); // 트랜잭션 시작

        //code
        try {
            ...
            tx.commit(); // 트랜잭션 수행
        } catch (Exception e) {
            tx.rollback(); // 문제 발생 시 롤백
        } finally {
            em.close(); // 엔티티 매니저 종료
        }
        emf.close();// 엔티티 매니저 팩토리 종료
    }
}
```