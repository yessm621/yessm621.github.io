---
title:  "프록시와 연관관계 관리"
last_modified_at: 2022-04-27T10:30:00
categories: 
  - JPA
tags:
  - JPA
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

# 프록시와 연관관계 관리

## 1.프록시

Member를 조회할 때 Team도 함께 조회해야 할까?

![Untitled1](https://user-images.githubusercontent.com/79130276/165419428-686d1086-b1be-4d92-b1fb-4ff57e8ad5bc.png)

Member와 Team이 둘다 필요한 경우도 있지만 Member만 필요할 경우엔?

→ Team까지 조회하는건 불필요한 과정

<br>

### 1.1 프록시 기초

- em.find() vs em.**getReference()**
- em.find(): 데이터베이스를 통해서 실제 엔티티 객체 조회
- em.getReference(): 데이터베이스 조회를 미루는 `가짜(프록시) 엔티티 객체 조회`
    
    : 하이버네이트가 어떤 라이브러리를 사용하여 가짜를 조회함
    

![Untitled2](https://user-images.githubusercontent.com/79130276/165419419-3cad527d-6e85-4bfb-a657-be3740214737.png)

<br>

**[예시] em.find()**

**JpaMain.java**

```java
Member member = new Member();
member.setUsername("hello");

em.persist(member);

// 영속성 컨텍스트가 깨끗해짐
em.flush();
em.clear();

Member findMember = em.find(Member.class, member.getId());
System.out.println("findMember.id = " + findMember.getId());
System.out.println("findMember.username = " + findMember.getUsername());
```

**결과**

```
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert jpabook.jpashop.domain.Member
        */ insert 
        into
            Member
            (createdBy, createdDate, lastModifiedBy, modifiedDate, city, name, street, username, zipcode, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    select
        member0_.MEMBER_ID as member_i1_4_0_,
        member0_.createdBy as createdb2_4_0_,
        member0_.createdDate as createdd3_4_0_,
        member0_.lastModifiedBy as lastmodi4_4_0_,
        member0_.modifiedDate as modified5_4_0_,
        member0_.city as city6_4_0_,
        member0_.name as name7_4_0_,
        member0_.street as street8_4_0_,
        member0_.TEAM_ID as team_id11_4_0_,
        member0_.username as username9_4_0_,
        member0_.zipcode as zipcode10_4_0_,
        team1_.TEAM_ID as team_id1_7_1_ 
    from
        Member member0_ 
    left outer join
        Team team1_ 
            on member0_.TEAM_ID=team1_.TEAM_ID 
    where
        member0_.MEMBER_ID=?
findMember.id = 1
findMember.username = hello
4월 26, 2022 5:14:40 오후 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0
```

<br>

**[예시] em.getReference() 만 작성 했을 때: 조회 안함**

**JpaMain.java**

```java
Member member = new Member();
member.setUsername("hello");

em.persist(member);

em.flush();
em.clear();

Member findMember = em.getReference(Member.class, member.getId());
```

**결과**

```
Hibernate: 
    call next value for hibernate_sequence
Hibernate: 
    /* insert jpabook.jpashop.domain.Member
        */ insert 
        into
            Member
            (createdBy, createdDate, lastModifiedBy, modifiedDate, city, name, street, username, zipcode, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
4월 26, 2022 5:14:40 오후 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0
```

<br>

**[예시] em.getReference() println 했을 때**

**JpaMain.java**

```java
Member member = new Member();
member.setUsername("hello");

em.persist(member);

em.flush();
em.clear();
// 영속성 컨텍스트가 깨끗해짐

Member findMember = em.getReference(Member.class, member.getId());
System.out.println("findMember = " + findMember);
System.out.println("findMember.id = " + findMember.getId());
System.out.println("findMember.username = " + findMember.getUsername());
```

**결과**

```
Hibernate: 
    /* insert jpabook.jpashop.domain.Member
        */ insert 
        into
            Member
            (createdBy, createdDate, lastModifiedBy, modifiedDate, city, name, street, username, zipcode, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
Hibernate: 
    select
        member0_.MEMBER_ID as member_i1_4_0_,
        member0_.createdBy as createdb2_4_0_,
        member0_.createdDate as createdd3_4_0_,
        member0_.lastModifiedBy as lastmodi4_4_0_,
        member0_.modifiedDate as modified5_4_0_,
        member0_.city as city6_4_0_,
        member0_.name as name7_4_0_,
        member0_.street as street8_4_0_,
        member0_.TEAM_ID as team_id11_4_0_,
        member0_.username as username9_4_0_,
        member0_.zipcode as zipcode10_4_0_,
        team1_.TEAM_ID as team_id1_7_1_ 
    from
        Member member0_ 
    left outer join
        Team team1_ 
            on member0_.TEAM_ID=team1_.TEAM_ID 
    where
        member0_.MEMBER_ID=?
findMember = jpabook.jpashop.domain.Member@6bcb12e6
findMember.id = 1
findMember.username = hello
4월 26, 2022 5:42:04 오후 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0
```

<br>

### 1.2 프록시 특징

- 실제 클래스(엔티티)를 **상속** 받아서 만들어짐
- 실제 클래스와 겉 모양이 같다.
- 사용하는 입장에서는 진짜 객체인지 프록시 객체인지 구분하지 않고 사용하면 됨 (이론상)

![Untitled3](https://user-images.githubusercontent.com/79130276/165419423-d6dcb603-e402-41ce-8992-26657fce15f7.png)

- 프록시 객체는 실제 객체의 `참조(target)`를 보관
- 프록시 객체를 호출하면 프록시 객체는 실제 객체의 메소드 호출

![Untitled4](https://user-images.githubusercontent.com/79130276/165419425-73096c88-f85a-42c7-9e2c-5f3244763600.png)

<br>

### 1.3 프록시 객체의 초기화

```java
Member member = em.getReference(Member.class, "id1");
// 실제 값을 호출할 때 초기화가 진행됨
member.getName();
```

1. getName()을 불러옴. 처음엔 Member target 에 값이 없음
2. JPA가 영속성 컨텍스트에 값을 요청함
3. 영속성 컨텍스트가 DB를 조회
4. 실제 DB 객체를 가져옴
5. MemberProxy에 있는 `target에 엔티티를 연결`해줌

![Untitled5](https://user-images.githubusercontent.com/79130276/165419426-2ef93d94-3fc2-4b1d-9349-8a0750f330e2.png)

<br>

### 1.4 프록시의 특징

- 프록시 객체는 처음 사용할 때 **한 번만 초기화**
- 프록시 객체를 초기화 할 때, 프록시 객체가 실제 엔티티로 바뀌는 것은 아님, 초기화되면 프록시 객체를 통해서 실제 엔티티에 접근 가능
- 프록시 객체는 원본 엔티티를 상속받음, 따라서 타입 체크시 주의해야함 (== 비교 실패, 대신 **instance of 사용**)
    
    ```java
    Member member1 = new Member();
    member1.setUsername("member1");
    em.persist(member1);
    
    Member member2 = new Member();
    member2.setUsername("member2");
    em.persist(member2);
    
    em.flush();
    em.clear();
    
    Member m1 = em.find(Member.class, member1.getId());
    Member m2 = em.getReference(Member.class, member2.getId());
    
    System.out.println("m1 == m2: " + (m1.getClass() == m2.getClass()));
    System.out.println("m1 == m2: " + (m1 instanceof Member));
    System.out.println("m1 == m2: " + (m2 instanceof Member));
    ```
    
    ```
    m1 == m2: false
    m1 == m2: true
    m1 == m2: true
    ```
    
- 영속성 컨텍스트에 찾는 엔티티가 이미 있으면 em.getReference()를 호출해도 실제 엔티티 반환
    
    [예시] 엔티티 조회 후 Proxy 객체 조회할 때
    
    ```java
    Member m1 = em.find(Member.class, member1.getId());
    System.out.println("m1 = " + m1.getClass());
    
    Member reference = em.getReference(Member.class, member1.getId());
    System.out.println("reference = " + reference.getClass());
    ```
    
    ```
    m1 = class jpabook.jpashop.domain.Member
    reference = class jpabook.jpashop.domain.Member
    ```
    
    [예시] Proxy 객체 조회 후 엔티티 조회 할 때
    
    ```java
    Member refMember = em.getReference(Member.class, member1.getId());
    System.out.println("refMember = " + refMember.getClass());
    
    // Member 를 가져올 것 같지만 위에서 Proxy를 한번 호출했기 때문에
    // em.find를 해도 Proxy를 가져온다
    Member findMember = em.find(Member.class, member1.getId());
    System.out.println("findMember = " + findMember.getClass());
    
    System.out.println("refMember == findMember: " + (refMember == findMember));
    ```
    
    ```
    refMember = class jpabook.jpashop.domain.Member$HibernateProxy$VJEp6TpB
    Hibernate: 
        select
            member0_.MEMBER_ID as member_i1_4_0_,
            member0_.createdBy as createdb2_4_0_,
            member0_.createdDate as createdd3_4_0_,
            member0_.lastModifiedBy as lastmodi4_4_0_,
            member0_.modifiedDate as modified5_4_0_,
            member0_.city as city6_4_0_,
            member0_.name as name7_4_0_,
            member0_.street as street8_4_0_,
            member0_.TEAM_ID as team_id11_4_0_,
            member0_.username as username9_4_0_,
            member0_.zipcode as zipcode10_4_0_,
            team1_.TEAM_ID as team_id1_7_1_ 
        from
            Member member0_ 
        left outer join
            Team team1_ 
                on member0_.TEAM_ID=team1_.TEAM_ID 
        where
            member0_.MEMBER_ID=?
    findMember = class jpabook.jpashop.domain.Member$HibernateProxy$VJEp6TpB
    refMember == findMember: true
    4월 27, 2022 9:28:02 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
    INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]
    
    Process finished with exit code 0
    ```
    
- 영속성 컨텍스트의 도움을 받을 수 없는 준영속 상태일 때, 프록시를 초기화하면 문제 발생 (하이버네이트는 org.hibernate.LazyInitializationException 예외를 터트림)
    
    ```java
    Member refMember = em.getReference(Member.class, member1.getId());
    System.out.println("refMember = " + refMember.getClass());
    
    // 준영속 상태로 전환
    em.detach(refMember);
    
    // 프록시 초기화
    refMember.getUsername();
    ```
    
    ```
    refMember = class jpabook.jpashop.domain.Member$HibernateProxy$jeLlOsNZ
    org.hibernate.LazyInitializationException: could not initialize proxy [jpabook.jpashop.domain.Member#1] - no Session
    	at org.hibernate.proxy.AbstractLazyInitializer.initialize(AbstractLazyInitializer.java:176)
    	at org.hibernate.proxy.AbstractLazyInitializer.getImplementation(AbstractLazyInitializer.java:322)
    	at org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor.intercept(ByteBuddyInterceptor.java:45)
    	at org.hibernate.proxy.ProxyConfiguration$InterceptorDispatcher.intercept(ProxyConfiguration.java:95)
    	at jpabook.jpashop.domain.Member$HibernateProxy$jeLlOsNZ.getUsername(Unknown Source)
    	at jpabook.jpashop.JpaMain.main(JpaMain.java:38)
    4월 27, 2022 9:33:31 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
    INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]
    
    Process finished with exit code 0
    ```

<br>    

### 1.5 프록시 확인

- 프록시 인스턴스의 초기화 여부 확인
    - PersistenceUnitUtil.isLoaded(Object entity)
    
    ```java
    Member refMember = em.getReference(Member.class, member1.getId());
    System.out.println("refMember = " + refMember.getClass());
    
    System.out.println("isLoaded = " + emf.getPersistenceUnitUtil().isLoaded(refMember));
    
    // 프록시 초기화 시킴
    refMember.getUsername();
    System.out.println("isLoaded = " + emf.getPersistenceUnitUtil().isLoaded(refMember));
    ```
    
    ```
    refMember = class jpabook.jpashop.domain.Member$HibernateProxy$4UHDPuSB
    isLoaded = false
    Hibernate: 
        select
            member0_.MEMBER_ID as member_i1_4_0_,
            member0_.createdBy as createdb2_4_0_,
            member0_.createdDate as createdd3_4_0_,
            member0_.lastModifiedBy as lastmodi4_4_0_,
            member0_.modifiedDate as modified5_4_0_,
            member0_.city as city6_4_0_,
            member0_.name as name7_4_0_,
            member0_.street as street8_4_0_,
            member0_.TEAM_ID as team_id11_4_0_,
            member0_.username as username9_4_0_,
            member0_.zipcode as zipcode10_4_0_,
            team1_.TEAM_ID as team_id1_7_1_ 
        from
            Member member0_ 
        left outer join
            Team team1_ 
                on member0_.TEAM_ID=team1_.TEAM_ID 
        where
            member0_.MEMBER_ID=?
    isLoaded = true
    4월 27, 2022 9:45:36 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
    INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]
    
    Process finished with exit code 0
    ```
    
- 프록시 클래스 확인 방법
    - entity.getClass().getName() 출력(..javasist.. or HibernateProxy…)
- 프록시 강제 초기화
    - org.hibernate.Hibernate.initialize(entity);
- 참고: JPA 표준은 강제 초기화 없음
    - 강제 호출: member.getName()