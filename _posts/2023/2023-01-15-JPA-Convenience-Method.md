---
title: "연관관계 편의 메서드"
last_modified_at: 2023-01-15T17:00:00
categories:
  - JPA
tags:
  - JPA
# toc: true
# toc_label: "Index"
# toc_sticky: true
---

`연관관계 편의 메서드`는 **양방향 연관관계**일 경우에 해당된다.

연관관계 편의 메서드에 설명하기 위해 Member 객체와 Order 객체가 있고 이 둘은 양방향 연관관계라고 가정하자. Order 입장에선 다대일 관계이고 Member 입장에선 일대다 관계이다.

양방향 연관관계의 경우 각각 객체에 다른 객체를 참조할 수 있는 참조용 필드를 정의한다.

```java
// Member 엔티티
public class Member {

    @Id
    @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    ...

    @OneToMany(mappedBy = "member")
    private List<Order> orders = new ArrayList<>();
}

// Order 엔티티
public class Order {

    @Id
    @GeneratedValue
    @Column(name = "order_id")
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    ...
}
```

양방향 연관관계는 양 쪽 객체를 모두 신경써야 한다. 만약, Member 객체와 Order 객체를 저장한다고 하면 아래 코드와 같이 입력해야 한다.

```java

Order order = new Order();
order.setName("order")
em.persist(order);

Member member = new Member();
member.setName("memberA");

// 양방향 연관관계 시 양쪽에 연관관계 설정
member.getOrders().add(order);
order.setMember(member);

em.persist(member);
```

JPA 입장에서는 연관관계 설정을 위해 주인 쪽에만 연관관계를 설정하면 된다. 하지만, 객체 입장에서 보면 양쪽에 연관관계를 모두 넣어주는게 좋다. 따라서, 순수 객체 상태를 고려하여 항상 **양쪽**에 값을 넣어주자.

하지만, 개발을 하다보면 까먹는 경우가 생길 수 밖에 없다. 따라서, `연관관계 편의 메서드`(createMember())를 새로 정의하여 한번만 호출해도 두 줄의 코드를 수행할 수 있게 만든다.

```java
public void createMember(Member member) {
    this.member = member;
    member.getOrders().add(this);
}
// 여기서 this는 현재 인스턴스를 의미한다.
```

> **참고** 
연관관계 편의 메서드를 정의하는 곳은 핵심 로직을 가진 쪽에 정의하는 것이 좋다.
> 

> **참고** 연관관계 편의 메서드 삭제
양방향 연관관계인 경우 삭제할 때도 연관관계 편의 메서드를 만들어야 할까? 이론적인 관점에서 보면 삭제를 위한 연관관계 편의 메서드를 정의하는 것이 맞으나 실용적인 관점에서 생각하면 삭제한 이후 삭제한 객체를 활용하는 로직이 대부분 없기 때문에 편의 메서드는 생략해도 상관없다.
또한, 실무에선 삭제를 하는 경우는 거의 없고 삭제 yn 필드를 변경하는 방식을 사용하기 때문에 이러한 고민을 크게 하지 않는다.
>