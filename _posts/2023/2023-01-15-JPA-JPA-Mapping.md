---
layout: post
title: "연관 관계 매핑"
date: 2023-01-15 16:00:00
categories: [JPA]
tags:
  - JPA
author: "유자"
---

연관 관계를 매핑할 때 생각해야 할 것 3가지

1. 방향: 단방향, 양방향
2. 연관 관계의 주인: 양방향일 때, 연관 관계에서 관리 주체
3. 다중성: 다대일(N:1), 일대다(1:N), 일대일(1:1), 다대다(N:M)

## 단방향, 양방향

DB 테이블은 **외래 키** 하나로 양 쪽 테이블 조인이 가능하다. 따라서, DB는 단방향, 양방향을 나눌 필요가 없다.

그러나, 객체는 **참조용 필드**가 있는 객체만 다른 객체를 참조하는 것이 가능하다. 따라서, 한쪽만 참조하면 `단방향` 관계, 양쪽이 서로 참조하면 `양방향` 관계이다. 엄밀하게 말하면 양방향 관계는 없고 두 객체가 단방향 참조를 각각 가져서 양방향 관계처럼 사용하고 말하는 것이다. 

JPA를 사용해서 DB와의 **패러다임**을 맞추기 위해서 객체는 단방향 연관 관계를 가질지, 양방향 연관 관계를 가질지 선택해야 한다.

선택은 비즈니스 로직에서 두 객체가 참조가 필요한지 여부를 고민하면 된다. 비즈니스 로직에 맞게 선택했을 때 두 객체가 서로 단방향 참조를 했다면 양방향 연관 관계가 된다.

### 무조건 양방향 관계로 하면 좋을까?

객체 입장에서 양방향 매칭을 했을 때 오히려 복잡해진다. 예를 들어 일반적인 비스니스 애플리케이션에서 User 엔티티는 다양한 엔티티와 연관 관계를 갖는다. 이런 경우 모든 엔티티를 양방향으로 설정하면 User 클래스가 복잡해지고, 불필요한 연관 관계 매핑으로 인해 **복잡성**이 증가할 수 있다. 따라서, 양방향으로 할지 단방향으로 할지 구분해줘야 한다.

기본적으로 **단방향 매핑으로 설계**하고 추후에 역방향 객체 탐색이 **필요하면 추가**하는 것이 좋다.

## 연관 관계의 주인[(링크)](https://yessm621.github.io/jpa/2022/08/22/JPA-MappedBy/)

양방향 연관 관계의 경우 `연관 관계의 주인`을 정해야 한다. 연관 관계의 주인을 지정하는 것은 두 단방향 관계 중 **제어의 권한**을 갖는 실질적인 관계가 어떤 것인지 JPA에게 알려주는 것이라고 생각하면 된다.

연관 관계의 주인은 연관 관계를 갖는 두 객체 사이에서 조회, 저장, 수정, 삭제를 할 수 있지만, 연관 관계의 주인이 아니면 조회만 가능하다. 연관 관계의 주인이 아닌 객체에서 mappedBy 속성을 사용해서 주인을 지정해줘야 한다. 보통 `외래 키`가 있는 곳을 **연관 관계의 주인**으로 정한다.

### 왜 연관 관계의 주인을 정해야할까?

예를 들어 Member 객체와 Order 객체가 있고 양방향 연관 관계라고 가정하자.

사용자의 주문을 수정하려고 할 때 Member 객체에서 setOrder() 같은 메서드를 이용해서 수정하는게 좋을지 Order 객체에서 getMember() 같은 메서드를 이용해서 수정하는게 좋은지 헷갈릴 수 있다.

두 객체 입장에서는 두 방법 다 맞는 방법이지만, JPA 입장에서는 혼란이 온다. 즉, Member에서 Order를 수정할때 FK를 수정할 지, Order에서 Member를 수정할 때 FK를 수정할 지를 결정하기 어렵다. 때문에 두 객체 사이의 **연관 관계의 주인**을 정해서 명확하게 정하는 것이다.

### 연관 관계의 주인만 제어하면 되나?

DB에 외래 키가 있는 테이블을 수정하려면 연관 관계의 주인만 변경하면 된다. 그러나, 객체를 생각했을 때는 두 군데에서 변경하는 것이 좋다. (이 부분은 [`연관관계 편의 메서드`](https://yessm621.github.io/jpa/2023/01/15/JPA-Convenience-Method/)를 사용하면 편리하다.)

## 다중성

DB를 기준으로 다중성을 결정한다.

### 다대일

게시판(Post)과 게시글(Board)을 예로 들면, 게시글이 N이고 게시판이 1이다. 외래 키를 게시글이 관리하는 일반적인 형태이다.

**다대일 단방향 연관 관계**

다대일 단방향에선 다 쪽인 Post에서 @ManyToOne만 추가해줬다. 반대로 Board에서는 참조하지 않았다. (단방향)

```java
@Entity
public class Post {
    @Id @GeneratedValue
    @Column(name = "POST_ID")
    private Long id;

    @Column(name = "TITLE")
    private String title;

    @ManyToOne
    @JoinColumn(name = "BOARD_ID")
    private Board board;
    //... getter, setter
}

@Entity
public class Board {
    @Id @GeneratedValue
    private Long id;
    private String title;
    //... getter, setter
}
```

**다대일 양방향 연관 관계**

다대일 양방향은 1 쪽에 @OneToMany를 추가하고 연관관계의 주인을 설정하기 위해 주인이 아닌 쪽에 mappedBy를 지정한다. mappedBy로 지정할 때 값은 대상이 되는 변수명을 따라 지정하면 된다. 여기서는 Post 객체의 board라는 이름의 변수이기 때문에 똑같이 board로 지정했다.

```java
@Entity
public class Post {
    @Id @GeneratedValue
    @Column(name = "POST_ID")
    private Long id;

    @Column(name = "TITLE")
    private String title;

    @ManyToOne
    @JoinColumn(name = "BOARD_ID")
    private Board board;
    //... getter, setter
}

@Entity
public class Board {
    @Id @GeneratedValue
    private Long id;
    private String title;

    @OneToMany(mappedBy = "board")
    List<Post> posts = new ArrayList<>();
    //... getter, setter
}
```

### 일대다

일대다와 다대일은 다르다. 다대일의 기준은 연관관계의 주인 다(N)쪽에 둔 것이고 이번에 언급할 일대다의 기준은 연관관계의 주인을 1 쪽에 둔 것이다.

**일대다 단방향 연관 관계**

> **참고**
실무에서는 일대다 단방향은 거의 쓰지 않는다.
> 

DB 입장에서는 무조건 다쪽에서 외래키를 관리한다. 하지만 일대다 단방향은 1쪽 객체에서 다쪽 객체를 조작(생성, 수정, 삭제)하는 방법이다. 

```java
@Entity
public class Post {
    @Id @GeneratedValue
    @Column(name = "POST_ID")
    private Long id;

    @Column(name = "TITLE")
    private String title;
    //... getter, setter
}

@Entity
public class Board {
    @Id @GeneratedValue
    private Long id;
    private String title;

    @OneToMany(mappedBy = "board")
    List<Post> posts = new ArrayList<>();
    //... getter, setter
}
```

```java
Post post = new Post();
post.setTitle("hello");
em.persist(post);

Board board = new Board();
board.setTitle("Free Board");
board.getPosts().add(post);
em.persist(board);
```

post를 저장할 때 insert 쿼리가 실행된다. 그 후 board를 저장할 때 board를 insert하는 쿼리가 나간 후에 post를 update하는 쿼리가 실행된다. board.getPosts().add(post); 부분 때문이다.

Board 엔티티는 Board 테이블에 매핑되기 때문에 Board 테이블에 직접 지정할 수 있으나 Post 테이블의 FK를 저장할 방법이 없으므로 조인 및 업데이트 쿼리를 날려야 하는 문제가 있다.

따라서, 일대다 단방향은 다대일 양방향 연관 관계로 매핑하는 것이 추후에 유지보수에 훨씬 수월하다.

일대다 양방향 연관 관계는 공식적으로 존재하지 않는다. 결론은 일대다 단방향, 양방향을 사용할 거면 `다대일 양방향`을 사용하는 것이 맞다.

### 일대일

주 테이블에 외래키를 넣을 수도 있고 대상 테이블에 외래키를 넣을 수도 있다. (일대일이기 때문에 테이블 A, B가 있을때 주 테이블이 A면 대상 테이블이 B이다.)

아래 예제는 Post가 하나의 Attach를 가지고 있다고 가정한다.

**일대일 단방향**

1. 외래 키를 주 테이블이 갖고 있을 때 (Post: 주 테이블, Attach: 대상 테이블)
    
    ```java
    @Entity
    public class Post {
        @Id @GeneratedValue
        @Column(name = "POST_ID")
        private Long id;
    
        @Column(name = "TITLE")
        private String title;
        @OneToOne
        @JoinColumn(name = "ATTACH_ID")
        private Attach attach;
        //... getter,setter
    }
    @Entity
    public class Attach {
        @Id @GeneratedValue
        @Column(name = "ATTACH_ID")
        private Long id;
        private String name;
      //... getter, setter
    }
    ```
    
2. 외래 키를 대상 테이블이 갖고 있을 때: JPA에서는 지원을 하지 않는다.

**일대일 양방향**

1. 외래키를 주 테이블이 갖고 있을 때
    
    단순하게 똑같이 @OneToOne 설정 후 mappedBy 설정만 해서 읽기 전용으로 만들어주면 양방향도 간단하다.
    
    ```java
    @Entity
    public class Attach {
        @Id @GeneratedValue
        @Column(name = "ATTACH_ID")
        private Long id;
        private String name;
    
        @OneToOne(mappedBy = "attach")
        private Post post;
      //... getter, setter
    }
    ```
    
2. 외래키를 대상 테이블이 갖고 있을 때
    
    이럴때는 어차피 양 쪽이 일대일이기 때문에 위에서 정의한 대로 처리하면 된다. 하지만 논란의 여지가 있다. 외래키를 Post에서 관리하는 것이 좋은 지 Attach에서 관리하는 것이 좋은 지 생각해봐야 한다.
    
    비즈니스가 변경되어 하나의 Post가 Attach를 여러개 가질 수 있다고 가정하자. 그렇다면 외래 키는 다쪽인 Attach에 있는게 비즈니스 변경에 유리하다. 그렇다고 무조건 다가 될 확률이 높은 테이블에 외래 키를 놓는 것이 좋은게 아니다. Post 쪽에 외래 키를 두면 성능상 이득이 있기 때문이다.
    
    결론은 종합적으로 판단하고 결정해야 한다.
    

### 다대다

실무에서 사용하면 안된다. 다대다는 일대다 - 다대일로 풀어서 만드는 것 (중간 테이블을 Entity로 만드는 것)이 추후 변경에도 유연하게 대처할 수 있다.