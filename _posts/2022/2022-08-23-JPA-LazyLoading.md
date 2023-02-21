---
layout: post
title: "즉시 로딩과 지연 로딩"
date: 2022-08-23 17:55:00
categories: [JPA]
tags:
  - JPA
author: "유자"
---

Member를 조회할 때 Team도 함께 조회해야 할까?

### 지연 로딩 LAZY을 사용해서 프록시로 조회

지연로딩은 연관된 것(Team)을 프록시로 가져온다.

![1](https://user-images.githubusercontent.com/79130276/186117175-97919d51-44da-477e-a497-d02195263135.png)

![2](https://user-images.githubusercontent.com/79130276/186117181-12ebb41b-6d9c-4f1f-ab9e-81d555c15a95.png)

```java
public class Member {
    ...

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TEAM_ID")
    private Team team;
}
```

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
```

Member와 Team을 자주 함께 사용한다면?

### 즉시 로딩 EAGER를 사용해서 함께 조회

![3](https://user-images.githubusercontent.com/79130276/186117187-d9274a37-c989-498d-881c-69a08c50265a.png)

![4](https://user-images.githubusercontent.com/79130276/186117191-12b33993-c046-4920-b689-91df10c7a318.png)

```java
public class Member {
    ...

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "TEAM_ID")
    private Team team;
}
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
```

### 프록시와 즉시로딩 주의

실무에선 **가급적 지연 로딩만 사용**하고 즉시로딩은 무조건 쓰지말자. 즉시 로딩을 적용하면 예상하지 못한 SQL이 발생할 가능성이 높다. 또한, **즉시 로딩은 JPQL에서 N+1 문제**를 일으킨다. **@ManyToOne, @OneToOne**은 default가 즉시 로딩이므로 `LAZY로 설정`해줘야 한다. @OneToMany, @ManyToMany는 default가 지연 로딩이다.

**[참고] JPQL의 N+1 문제**

즉시로딩으로 설정하면 연관관계에 있는 엔티티를 모두 Join 하여 select 쿼리를 가져온다. 그러나, JPQL은 SQL 그대로 번역되므로 EAGER로 설정해도 Member만 먼저 select 한 후, Member 엔티티에 Team이 연관관계로 설정되있으니 Team도 select 한다.

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
```

JPQL을 사용해 Member를 조회(1)했지만 Member에 해당하는 개수(N)만큼 Team을 조회한다. 이를 N + 1 문제라고 한다.

**N+1을 해결하는 방법**

일단 Lazy로 다 설정. 3가지 방법이 있는데 대부분 fetch 조인 사용해서 해결함

```java
List<Member> members = em.createQuery("select m from Member m join fetch m.team", Member.class)
                    .getResultList();
```

### 지연로딩을 실무에서 사용할 때

모든 연관관계에 `지연 로딩`을 사용하고 실무에서 즉시 로딩을 사용하지 말자. JPQL fetch 조인이나, 엔티티 그래프 기능을 사용해라! (뒤에서 설명) 즉시 로딩은 상상하지 못한 쿼리가 나간다.