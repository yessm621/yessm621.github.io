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

<br>

## 2. 즉시 로딩과 지연 로딩

Member를 조회할 때 Team도 함께 조회해야 할까?

<br>

### 2.1 지연 로딩 LAZY을 사용해서 프록시로 조회

→ 지연로딩은 연관된 것(Team)을 프록시로 가져옴

![Untitled1](https://user-images.githubusercontent.com/79130276/165674219-f0c8e22b-f00f-406c-9740-d6a3f7cda677.png)

![Untitled2](https://user-images.githubusercontent.com/79130276/165674223-b631cf8d-92d2-43ee-aa8f-24bef802a040.png)

Member.java

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "TEAM_ID")
private Team team;
```

JpaMain.java

```java
Team team = new Team();
team.setName("teamA");
 em.persist(team);

Member member1 = new Member();
member1.setUsername("member1");
member1.setTeam(team);
em.persist(member1);

em.flush();
em.clear();

// Member만 조회
Member m = em.find(Member.class, member1.getId());

// Team은 Proxy
System.out.println("m = " + m.getTeam().getClass());

System.out.println("===================");
// 이땐 조회 안됨. 아래 처럼 실제로 사용할 때
m.getTeam();
// Team 조회
m.getTeam().getName();
System.out.println("===================");
```

```
Hibernate: 
    /* insert jpabook.jpashop.domain.Team
        */ insert 
        into
            Team
            (name, TEAM_ID) 
        values
            (?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Member
        */ insert 
        into
            Member
            (createdBy, createdDate, lastModifiedBy, modifiedDate, city, name, street, TEAM_ID, username, zipcode, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        member0_.zipcode as zipcode10_4_0_ 
    from
        Member member0_ 
    where
        member0_.MEMBER_ID=?
m = class jpabook.jpashop.domain.Team$HibernateProxy$Y5Aao7FO
===================
Hibernate: 
    select
        team0_.TEAM_ID as team_id1_7_0_,
        team0_.name as name2_7_0_ 
    from
        Team team0_ 
    where
        team0_.TEAM_ID=?
===================
4월 27, 2022 11:02:50 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0
```

<br>

Member와 Team을 자주 함께 사용한다면?

### 2.2 즉시 로딩 EAGER를 사용해서 함께 조회

![Untitled3](https://user-images.githubusercontent.com/79130276/165674224-e7b7934b-74f5-4e35-a3bb-d668d3e3fd4c.png)

![Untitled4](https://user-images.githubusercontent.com/79130276/165674228-f888681b-11f1-48ed-b25a-007fb4166318.png)

Member.java

```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "TEAM_ID")
private Team team;
```

```
Hibernate: 
    /* insert jpabook.jpashop.domain.Team
        */ insert 
        into
            Team
            (name, TEAM_ID) 
        values
            (?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Member
        */ insert 
        into
            Member
            (createdBy, createdDate, lastModifiedBy, modifiedDate, city, name, street, TEAM_ID, username, zipcode, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        team1_.TEAM_ID as team_id1_7_1_,
        team1_.name as name2_7_1_ 
    from
        Member member0_ 
    left outer join
        Team team1_ 
            on member0_.TEAM_ID=team1_.TEAM_ID 
    where
        member0_.MEMBER_ID=?
m = class jpabook.jpashop.domain.Team
===================
===================
4월 27, 2022 11:21:28 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0
```

<br>

### 2.3 프록시와 즉시로딩 주의

- **가급적 지연 로딩만 사용 (특히 실무에서)** → 가급적이라고 했지만 즉시로딩은 무조건 쓰지말자
- 즉시 로딩을 적용하면 예상하지 못한 SQL이 발생
- **즉시 로딩은 JPQL에서 N+1 문제**를 일으킨다.
- **@ManyToOne, @OneToOne**은 기본이 즉시 로딩 → `LAZY로 설정`
- @OneToMany, @ManyToMany는 기본이 지연 로딩

<br>

**[참고] JPQL의 N+1 문제**

즉시로딩으로 설정하면 연관관계에 있는 엔티티를 모두 Join 하여 select 쿼리를 가져온다.

그러나, JPQL은 SQL 그대로 번역되므로 EAGER로 설정해도 Member만 먼저 select 한 후, Member 엔티티에 Team이 연관관계로 설정되있으니 Team도 select

```java
Team team = new Team();
team.setName("teamA");
em.persist(team);

Member member1 = new Member();
member1.setUsername("member1");
member1.setTeam(team);
em.persist(member1);

em.flush();
em.clear();

// em.find()는 pk를 지정해서 가져오는 것이기 때문에 내부적으로 최적화 가능
// Member m = em.find(Member.class, member1.getId());

List<Member> members = em.createQuery("select m from Member m", Member.class)
                    .getResultList();

// SQL: select * from Member;
// SQL: select * from Team where Team_id = member.team.id;
```

여기서 문제가 발생!

Member가 1,2,3...N 있다면 그에 해당하는 Team을 조회하기 위해 N번 쿼리 날림

최초의 쿼리가 1이면 이에 해당하는 연관관계의 쿼리를 N번 날린다고 하여 **N+1**이라함

```java
Team team = new Team();
team.setName("teamA");
em.persist(team);

Team teamB = new Team();
teamB.setName("teamB");
em.persist(teamB);

Member member1 = new Member();
member1.setUsername("member1");
member1.setTeam(team);
em.persist(member1);

Member member2 = new Member();
member2.setUsername("member2");
member2.setTeam(teamB);
em.persist(member2);

em.flush();
em.clear();

List<Member> members = em.createQuery("select m from Member m", Member.class)
                    .getResultList();
```

```
Hibernate: 
    /* select
        m 
    from
        Member m */ select
            member0_.MEMBER_ID as member_i1_4_,
            member0_.createdBy as createdb2_4_,
            member0_.createdDate as createdd3_4_,
            member0_.lastModifiedBy as lastmodi4_4_,
            member0_.modifiedDate as modified5_4_,
            member0_.city as city6_4_,
            member0_.name as name7_4_,
            member0_.street as street8_4_,
            member0_.TEAM_ID as team_id11_4_,
            member0_.username as username9_4_,
            member0_.zipcode as zipcode10_4_ 
        from
            Member member0_
Hibernate: 
    select
        team0_.TEAM_ID as team_id1_7_0_,
        team0_.name as name2_7_0_ 
    from
        Team team0_ 
    where
        team0_.TEAM_ID=?
Hibernate: 
    select
        team0_.TEAM_ID as team_id1_7_0_,
        team0_.name as name2_7_0_ 
    from
        Team team0_ 
    where
        team0_.TEAM_ID=?
4월 27, 2022 12:52:11 오후 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0
```

JPQL을 사용해 Member를 조회(1)했지만 Member에 해당하는 개수(N)만큼 Team을 조회함

<br>

**N+1을 해결하는 방법**

일단 Lazy로 다 설정. 3가지 방법이 있는데 대부분 fetch 조인 사용해서 해결함

```java
List<Member> members = em.createQuery("select m from Member m join fetch m.team", Member.class)
                    .getResultList();
```

<br>

### 2.4 지연로딩 - 실무

- 모든 연관관계에 `지연 로딩`을 사용해라!
- 실무에서 즉시 로딩을 사용하지 마라!
- JPQL fetch 조인이나, 엔티티 그래프 기능을 사용해라! (뒤에서 설명)
- 즉시 로딩은 상상하지 못한 쿼리가 나간다.

<br>

## 3. 영속성 전이: CASCADE

- 특정 엔티티를 영속 상태로 만들 때 연관된 엔티티도 함께 영속상태로 만들고 싶을 때
- 예) 부모 엔티티를 저장할 때 자식 엔티티도 함께 저장

![Untitled5](https://user-images.githubusercontent.com/79130276/165674229-89ed8209-7638-49a6-8eb7-3566ac11e8c3.png)

<br>

**Parent.java**

```java
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Parent {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToMany(mappedBy = "parent")
    private List<Child> childList = new ArrayList<>();

    public void addChild(Child child) {
        childList.add(child);
        child.setParent(this);
    }
}
```

**Child.java**

```java
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Child {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;
}
```

**JpaMain.java**

```java
package jpabook.jpashop;

import jpabook.jpashop.domain.Child;
import jpabook.jpashop.domain.Parent;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class JpaMain {

    public static void main(String[] args) {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");

        EntityManager em = emf.createEntityManager();

        EntityTransaction tx = em.getTransaction();
        tx.begin();

        try {
            Child child1 = new Child();
            Child child2 = new Child();

            Parent parent = new Parent();
            parent.addChild(child1);
            parent.addChild(child2);

						// 영속성 전이 하기 위해 3번 em.persist()
            em.persist(parent);
            em.persist(child1);
            em.persist(child2);

            tx.commit();
        } catch (Exception e) {
            tx.rollback();
            e.printStackTrace();
        } finally {
            em.close();
        }

        emf.close();
    }

}
```

```
Hibernate: 
    /* insert jpabook.jpashop.domain.Parent
        */ insert 
        into
            Parent
            (name, id) 
        values
            (?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)
```

<br>

Parent에서 cascade 를 설정하면 한번만 em.persist() 해도 모두 영속성 전이

**Parent.java**

```java
@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
private List<Child> childList = new ArrayList<>();
```

**JpaMain.java**

```java
Child child1 = new Child();
Child child2 = new Child();

Parent parent = new Parent();
parent.addChild(child1);
parent.addChild(child2);

em.persist(parent);
```

```
Hibernate: 
    /* insert jpabook.jpashop.domain.Parent
        */ insert 
        into
            Parent
            (name, id) 
        values
            (?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)
```

<br>

### 3.1 영속성 전이: 저장

```java
@OneToMany(mappedBy="parent", cascade=CascadeType.PERSIST)
```

![Untitled6](https://user-images.githubusercontent.com/79130276/165674232-2c7b1efd-f536-4073-97b5-6738c5fc88c0.png)

<br>

### 3.2 영속성 전이: CASCADE - 주의

- 영속성 전이는 연관관계를 매핑하는 것과 아무 관련이 없음
- 엔티티를 영속화할 때 연관된 엔티티도 함께 영속화 하는 편리함을 제공할 뿐

<br>

### 3.3 CASCADE의 종류

- ALL: 모두 적용
- PERSIST: 영속
- REMOVE: 삭제
- MERGE: 병합
- REFRESH: REFRESH
- DETACH: DETACH

<br>

**CASCADE**

사용하는 경우: 게시판, 게시물에 대한 첨부파일 등..

사용하면 안되는 경우: 첨부파일을 여러군데에서 사용

**즉, 소유자가 하나일 때 사용가능**

<br>

## 4. 고아객체

- 고아 객체 제거: 부모 엔티티와 연관관계가 끊어진 자식 엔티티를 자동으로 삭제
- **orphanRemoval = true**
- Parent parent1 = em.find(Parent.class, id);
parent1.getChildren().remove(0);
//자식 엔티티를 컬렉션에서 제거
- DELETE FROM CHILD WHERE ID=?

<br>

**Parent.java**

```java
@OneToMany(mappedBy = "parent", orphanRemoval = true)
private List<Child> childList = new ArrayList<>();
```

**JpaMain.java**

```java
Child child1 = new Child();
Child child2 = new Child();

Parent parent = new Parent();
parent.addChild(child1);
parent.addChild(child2);

em.persist(parent);
em.persist(child1);
em.persist(child2);

em.flush();
em.clear();

Parent findParent = em.find(Parent.class, parent.getId());
findParent.getChildList().remove(0);
```

```
Hibernate: 
    /* insert jpabook.jpashop.domain.Parent
        */ insert 
        into
            Parent
            (name, id) 
        values
            (?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)
Hibernate: 
    /* insert jpabook.jpashop.domain.Child
        */ insert 
        into
            Child
            (name, parent_id, id) 
        values
            (?, ?, ?)
Hibernate: 
    select
        parent0_.id as id1_8_0_,
        parent0_.name as name2_8_0_ 
    from
        Parent parent0_ 
    where
        parent0_.id=?
Hibernate: 
    select
        childlist0_.parent_id as parent_i3_2_0_,
        childlist0_.id as id1_2_0_,
        childlist0_.id as id1_2_1_,
        childlist0_.name as name2_2_1_,
        childlist0_.parent_id as parent_i3_2_1_ 
    from
        Child childlist0_ 
    where
        childlist0_.parent_id=?
Hibernate: 
    /* delete jpabook.jpashop.domain.Child */ delete 
        from
            Child 
        where
            id=?
```

<br>

### 4.1 고아 객체 - 주의

- 참조가 제거된 엔티티는 다른 곳에서 참조하지 않는 고아 객체로 보고 삭제하는 기능
- **참조하는 곳이 하나일 때 사용해야 함**
- **특정 엔티티가 개인 소유할 때 사용**
- @OneToOne, @OneToMany만 가능
- 참고: 개념적으로 부모를 제거하면 자식은 고아가 된다. 따라서, 고아 객체 제거 기능을 활성화 하면, 부모를 제거할 때 자식도 함께 제거된다. 이것은 CascadeType.REMOVE처럼 동작한다.

<br>

### 4.2 영속성 전이 + 고아 객체, 생명주기

- **CascadeType.ALL + orphanRemovel=true**
- 스스로 생명주기를 관리하는 엔티티는 em.persist()로 영속화, em.remove()로 제거
- 두 옵션을 모두 활성화 하면 부모 엔티티를 통해서 자식의 생명주기를 관리할 수 있음
    - 부모를 삭제하면 자식까지 삭제됨
    
    ```java
    Parent findParent = em.find(Parent.class, parent.getId());
    findParent.getChildList().remove(0);
    
    // em.remove(findParent);
    ```
    
- 도메인 주도 설계(DDD)의 Aggregate Root개념을 구현할 때 유용