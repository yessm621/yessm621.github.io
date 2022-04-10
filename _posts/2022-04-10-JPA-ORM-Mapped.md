---
title:  "연관관계 매핑 기초"
last_modified_at: 2022-04-10T14:40:00
categories: 
  - JPA
tags:
  - JPA
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

# 연관관계 매핑 기초

- 객체와 테이블 연관관계의 차이를 이해
- 객체의 참조와 테이블의 외래 키를 매핑
- 용어 이해
    - 방향(Direction): 단방향, 양방향
    - 다중성(Multiplicity): 다대일, 일대다, 일대일
    - 연관관계의 주인: 객체 양방향 연관관계는 관리 주인이 필요
    
<br>

## 1. 연관관계가 필요한 이유

객체를 테이블에 맞춰 모델링 즉, 연관관계가 없는 객체는 객체지향적인 코드 작성이 안된다.

<br>

외래 키 식별자를 직접 다룸

```java
// 팀 저장
Team team = new Team();
team.setName("TeamA");
em.persist(team);

// 회원 저장
Member member = new Member();
member.setName("member1");
member.setTeamId(team.getId());
em.persist(member);
```

<br>

식별자로 다시 조회, 객체 지향적인 방법이 아님

```java
// 조회
Member findMember = em.find(Member.class, member.getId()); 
// 연관관계가 없음
Team findTeam = em.find(Team.class, team.getId());
```

<br>

단방향 연관관계

```java
// 팀 저장
Team team = new Team();
team.setName("TeamA");
em.persist(team);

// 회원 저장
Member member = new Member();
member.setName("member1");
member.setTeam(team); //단방향 연관관계 설정, 참조 저장
em.persist(member)
```

<br>

```java
// 조회
Member findMember = em.find(Member.class, member.getId());

// 참조를 사용해서 연관관계 조회
Team findTeam = findMember.getTeam();
```

<br>

## 2. 양방향 연관관계와 연관관계의 주인1 - 기본

객체와 테이블의 패러다임의 차이를 이해해야 한다.

<br>

### 2.1 양방향 매핑

Member.java

```java
@Entity
public class Member {

    @Id
    @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column(name = "USERNAME")
    private String username;

    @ManyToOne
    @JoinColumn(name = "TEAM_ID")
    private Team team;

}
```

Team.java

```java
@Entity
public class Team {

    @Id@GeneratedValue
    @Column(name = "TEAM_ID")
    private Long id;
    private String name;

    @OneToMany(mappedBy = "team")
    // 초기화 시켜놓으면 add 할때 오류가 안나기 때문에 관례로 이렇게 쓴다
    private List<Member> members = new ArrayList<>();
}
```

JpaMain.java

```java
// member가 연관관계의 주인
// 조회
Team findTeam = em.find(Team.class, team.getId()); 
// 역방향 조회
int memberSize = findTeam.getMembers().size();
```

<br>

### 2.2 연관관계의 주인과 mappedBy

- mappedBy 를 이해하기 위해선 객체와 테이블간에 연관관계를 맺는 차이를 이해해야 한다.

<br>

### 2.3 객체와 테이블이 관계를 맺는 차이

- 객체 연관관계 = 2개
    - 회원 → 팀 연관관계 1개 (단방향)
    - 팀 → 회원 연관관계 1개 (단방향)
- 테이블 연관관계 = 1개
    - 회원 ↔ 팀의 연관관계 1개 (양방향)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/de2c1249-b397-4f91-bf67-cb355fcef6ad/Untitled.png)

<br>

### 2.4 객체의 양방향 관계

- 객체의 양방향 관계는 서로 다른 단방향 관계 2개이다.
- 객체를 양방향으로 참조하려면 단방향 연관관계를 2개 만들어야 한다.
    - A → B (a.getB())
    - B → A (b. getA())

<br>

### 2.5 테이블의 양방향 연관관계

- 테이블은 외래 키 하나로 두 테이블의 연관관계를 관리
- MEMBER.TEAM_ID 외래 키 하나로 양방향 연관관계 가짐 (양쪽으로 조인 가능)

<br>

여기서 딜레마가 온다

객체는 참조값이 두개다 → Member에서 Team으로, Team에서 Member로

Member에 있는 Team 값이 업데이트 되었을때 외래키값을 업데이트?

Team에 있는 Member값이 업데이트 되었을때 외래키값을 업데이트?

<br>

### 2.6 연관관계의 주인 (Owner)

**양방향 매핑 규칙**

- 객체의 두 관계 중 하나를 연관관계의 주인으로 지정
- 연관관계의 주인만이 외래키를 관리 (등록, 수정)
- `주인이 아닌 쪽은 읽기만 가능`
- 주인은 mappedBy 속성 사용X
- 주인이 아니면 mappedBy 속성으로 주인 지정

<br>

**누구를 주인으로?**

- `외래키`가 있는 곳을 주인으로 함
- 여기서는 Member.team이 연관관계의 주인

<br>

DB 입장에서 보면 외래키가 있는곳이 무조건 다, 외래키가 없는 곳이 1이다

`N쪽인 곳이 연관관계의 주인이 되면 된다!`

<br>

### 2.7 양방향 매핑 시 가장 많이 하는 실수

- 연관관계의 주인에 값을 입력하지 않음

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

// 역방향(주인이 아닌 방향)만 연관관계 설정
// team은 연관관계의 주인이 아니기 때문에 member값을 넣어줘도 JPA에서 실행하지 않음
team.getMembers().add(member);

em.persist(member);
```

- 순수한 객체 관계를 고려하면 항상 양쪽 다 값을 입력해야 함

```java
Team team = new Team();
team.setName("TeamA");
em.persist(team);

Member member = new Member();
member.setName("member1");

team.getMembers().add(member);
// 연관관계의 주인에 값 설정
member.setTeam(team); //**

em.persist(member);
```

<br>

### 2.8 양방향 연관관계  주의

- 순수 객체 상태를 고려해서 항상 양쪽에 값을 설정하자
    - JPA입장에서 보면 member.setTeam(team)만 해주는게 맞지만, 객체지향의 입장에서 보면 양쪽에 값을 다 줘야한다. 결론은 양방향 연관관계일 때는 양쪽에 값을 다 설정 해주자
    
    JpaMain.java
    
    ```java
    Team team = new Team();
    team.setName("TeamA");
    em.persist(team);
    
    Member member = new Member();
    member.setUsername("member1");
    member.setTeam(team); //**연관관계 설정1
    em.persist(member);
    
    team.getMember().add(member); //**연관관계 설정2
    
    em.flush();
    em.clear();
    
    Member findMember = em.find(Member.class, member.getId()); // 1차 캐시
    List<Member> members = findMember.getTeam().getMembers();
    
    for (Member m : members) {
        System.out.println("m = " + m.getUsername());
    }
    ```
    
- 연관관계 편의 메소드를 생성하자
    - 양쪽을 다 설정해주다보면 사람이기 때문에 실수를 할 수 있다. 따라서, 연관관계 편의 메소드를 이용한다.
    
    Member.java
    
    ```java
    @Entity
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public class Member {
    
        @Id
        @GeneratedValue
        @Column(name = "MEMBER_ID")
        private Long id;
    
        @Column(name = "USERNAME")
        private String username;
    
        @ManyToOne
        @JoinColumn(name = "TEAM_ID")
        private Team team;
    
    		// 연관관계 편의 메소드
        public void changeTeam(Team team) {
            this.team = team;
            team.getMembers().add(this);
        }
    }
    ```
    
    JpaMain.java
    
    ```java
    Team team = new Team();
    team.setName("TeamA");
    em.persist(team);
    
    Member member = new Member();
    member.setUsername("member1");
    member.changeTeam(team); //연관관계 편의 메소드
    em.persist(member);
    
    em.flush();
    em.clear();
    
    Member findMember = em.find(Member.class, member.getId()); // 1차 캐시
    List<Member> members = findMember.getTeam().getMembers();
    
    for (Member m : members) {
        System.out.println("m = " + m.getUsername());
    }
    ```
    
- 양방향 매핑시에 무한 루프를 조심하자
    - 예: toString(), lombok, JSON 생성 라이브러리
    - lombok의 toString은 가급적 사용하지 말자
    - API를 만들때 entity는 반드시 dto로 변경해서 반환해야 함
    - 실제 실무에서는 가급적 controller에서 entity를 사용하지 말자

<br>    

### 2.9 양방향 매핑 정리

- 단방향 매핑만으로도 이미 연관관계 매핑은 완료
- 양방향 매핑은 반대 방향으로 조회(객체 그래프 탐색) 기능이 추가된 것 뿐
- JPQL에서 역방향으로 탐색할 일이 많음
- 단방향 매핑을 잘 하고 양방향은 필요할 때 추가해도 됨 (테이블에 영향을 주지 않음)

→ 일단 단방향으로 설계 후 양방향은 개발하면서 필요할 때 추가한다

- 연관관계의 주인은 외래키의 위치를 기준으로 정함