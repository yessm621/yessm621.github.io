---
title: "컬렉션 조회 최적화"
last_modified_at: 2022-08-16T13:30:00
categories:
  - JPA
tags:
  - JPA
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

컬렉션인 일대다 관계(OneToMany)를 조회하고, 최적화하는 방법을 알아보자. (*ToOne 보다 신경 쓸게 많다.)

[예제] Order와 Member는 다대일 연관관계(양방향), Order와 Delivery는 다대일 연관관계(양방향)가 되어있고, Member와 Delivery는 지연 로딩이 설정되어 있다. 주문내역에서 추가로 주문한 상품 정보를 추가로 조회하자. Order 기준으로 컬렉션인 OrderItem 와 Item 이 필요하다.

엔티티를 DTO로 변환하면 마찬가지로 1 + N + N 문제가 생긴다. 이를 해결하기 위해 fetch join을 사용한다.

> **참고**
<br>
DTO로 만들어야 한다는 것은 단순하게 겉 껍질(order)만 DTO로 만들라는게 아니다. 내부의 엔티티(orderItems)까지 모두 DTO로 만들어야 한다는 것을 의미한다.
> 

> **참고**
<br>
지연 로딩은 영속성 컨텍스트에 있으면 영속성 컨텍스트에 있는 엔티티를 사용하고 없으면 SQL을 실행한다. 따라서 같은 영속성 컨텍스트에서 이미 로딩한 회원 엔티티를 추가로 조회하면 SQL을 실행하지 않는다.
> 

## 엔티티를 DTO로 변환 - 페치 조인 최적화

### 페치 조인 최적화

```java
// OrderApiController.java
@GetMapping("/api/v3/orders")
public List<OrderDto> ordersV3() {
    List<Order> orders = orderRepository.findAllWithItem();

    List<OrderDto> result = orders.stream()
            .map(o -> new OrderDto(o))
            .collect(Collectors.toList());
    return result;
}
```

일대다 조인을 하면 다에 초점이 맞춰져 데이터 개수가 증가한다. 예를 들어 조인문 앞에 테이블의 row가 2, 조인문 뒤에 테이블의 row가 4라면 4로 증가한다.

![1](https://user-images.githubusercontent.com/79130276/184794480-5492bf64-65dc-4b82-bcdc-37611572ca01.png)

JPQL에서 `distinct`를 사용하면 **중복을 제거**해준다.

```java
// OrderRepository.java
public List<Order> findAllWithItem() {
    return em.createQuery(
            "select distinct o from Order o" +
                    " join fetch o.member m" +
                    " join fetch o.delivery d" +
                    " join fetch o.orderItems oi" +
                    " join fetch oi.item i", Order.class)
            .getResultList();
}
```

SQL의 distinct는 row의 모든 필드가 중복되어야 중복을 제거해준다. 그러나, JPA의 distinct는 JPA에서 자체적으로 기준이 되는 엔티티가 중복이 되면 제거를 해준다. 여기선 기준이 되는 엔티티가 Order 엔티티이다. (from 다음에 나오는 엔티티, root entity라고도 한다.)

> **참고**
<br>
실무에서 복잡한 쿼리를 짤때는 QueryDSL을 이용하자
문자열로 짜는 JPQL은 오류를 잡기 어렵지만 QueryDSL을 사용하면 문자열 오류, 공백 등을 신경쓰지 않고 코드를 작성할 수 있다는 장점이 있다.
> 

페치 조인으로 SQL이 1번만 실행된다. distinct를 사용한 이유는 일대다 조인이 있으므로 데이터베이스 row가 증가한다. 그 결과 같은 order 엔티티의 조회 수도 증가하게 된다. JPA의 distinct는 SQL에 distinct를 추가하고, 더해서 같은 엔티티가 조회되면, 애플리케이션에서 중복을 걸러준다. 이 예제에선 order가 컬렉션 페치 조인 때문에 중복 조회 되는 것을 막아준다.

하지만, **페이징이 불가능**하다는 치명적인 단점이 있다. setFirstResult(), setMaxResults() 적용이 안된다.

> **참고**
<br>
컬렉션 페치 조인을 사용하면 페이징이 불가능하다. 하이버네이트는 경고 로그를 남기면서 모든
데이터를 DB에서 읽어오고, **메모리에서 페이징 해버린다** (매우 위험하다).
> 

> **참고**
<br>
컬렉션 페치 조인은 1개만 사용할 수 있다. 컬렉션 둘 이상에 페치 조인을 사용하면 안된다. 데이터가 부정합하게 조회될 수 있다.
> 

`일대다 페치조인에서는 페이징을 절대 사용하면 안된다.`

### 페이징과 한계 돌파

대부분의 페이징 + 컬렉션 엔티티 조회 문제는 다음에서 설명하는 방법으로 해결할 수 있다.

먼저, ***ToOne**(OneToOne, ManyToOne) 관계를 모두 페치조인 한다. ToOne 관계는 row수를
증가시키지 않으므로 페이징 쿼리에 영향을 주지 않는다. 그 후, 컬렉션(*ToMany)은 지연 로딩으로 조회한다. 지연 로딩 성능 최적화를 위해 `hibernate.default_batch_fetch_size`, @BatchSize 를 적용한다.

- hibernate.default_batch_fetch_size: 글로벌 설정
- @BatchSize: 개별 최적화

이 옵션을 사용하면 컬렉션이나, 프록시 객체를 한꺼번에 **설정한 size 만큼 IN 쿼리로 조회**한다.

### default_batch_fetch_size 설정

application.yml

```
jpa.hibernate.properties.hibernate.default_batch_fetch_size: 100
```

설정 후 쿼리 결과

```
...
2022-08-14 01:10:22.984  INFO 31396 --- [nio-8080-exec-4] p6spy                                    : #1660407022984 | took 1ms | statement | connection 8| url jdbc:h2:tcp://localhost/~/jpashop
select orderitems0_.order_id as order_id5_5_1_, orderitems0_.order_item_id as order_it1_5_1_, orderitems0_.order_item_id as order_it1_5_0_, orderitems0_.count as count2_5_0_, orderitems0_.item_id as item_id4_5_0_, orderitems0_.order_id as order_id5_5_0_, orderitems0_.order_price as order_pr3_5_0_ from order_item orderitems0_ where orderitems0_.order_id in (?, ?)
select orderitems0_.order_id as order_id5_5_1_, orderitems0_.order_item_id as order_it1_5_1_, orderitems0_.order_item_id as order_it1_5_0_, orderitems0_.count as count2_5_0_, orderitems0_.item_id as item_id4_5_0_, orderitems0_.order_id as order_id5_5_0_, orderitems0_.order_price as order_pr3_5_0_ from order_item orderitems0_ where orderitems0_.order_id in (4, 11);
2022-08-14 01:10:22.996 DEBUG 31396 --- [nio-8080-exec-4] org.hibernate.SQL                        : 
...
2022-08-14 01:10:22.998  INFO 31396 --- [nio-8080-exec-4] p6spy                                    : #1660407022998 | took 0ms | statement | connection 8| url jdbc:h2:tcp://localhost/~/jpashop
select item0_.item_id as item_id2_3_0_, item0_.name as name3_3_0_, item0_.price as price4_3_0_, item0_.stock_quantity as stock_qu5_3_0_, item0_.artist as artist6_3_0_, item0_.etc as etc7_3_0_, item0_.author as author8_3_0_, item0_.isbn as isbn9_3_0_, item0_.actor as actor10_3_0_, item0_.director as directo11_3_0_, item0_.dtype as dtype1_3_0_ from item item0_ where item0_.item_id in (?, ?, ?, ?)
select item0_.item_id as item_id2_3_0_, item0_.name as name3_3_0_, item0_.price as price4_3_0_, item0_.stock_quantity as stock_qu5_3_0_, item0_.artist as artist6_3_0_, item0_.etc as etc7_3_0_, item0_.author as author8_3_0_, item0_.isbn as isbn9_3_0_, item0_.actor as actor10_3_0_, item0_.director as directo11_3_0_, item0_.dtype as dtype1_3_0_ from item item0_ where item0_.item_id in (2, 3, 9, 10);
```

default_batch_fetch_size를 설정하면 쿼리 호출 수가 1 + N → 1 + 1로 최적화 된다. 조인보다 DB 데이터 전송량이 최적화 된다. (Order와 OrderItem을 조인하면 Order가 OrderItem 만큼 중복해서 조회된다. 이 방법은 각각 조회하므로 전송해야할 중복 데이터가 없다.) 페치 조인 방식과 비교해서 쿼리 호출 수가 약간 증가하지만, DB 데이터 전송량이 감소한다. 컬렉션 페치 조인은 페이징이 불가능 하지만 이 방법은 `페이징이 가능`하다.

정리하자면, ToOne 관계는 페치 조인해도 페이징에 영향을 주지 않는다. 따라서 ToOne 관계는 페치조인으로 쿼리 수를 줄이고 해결하고, 나머지(컬렉션)는 hibernate.default_batch_fetch_size로 최적화 하자.

### @BatchSize

개별로 설정하려면 @BatchSize를 적용하면 된다. (컬렉션은 컬렉션 필드에, 엔티티는 엔티티 클래스에 적용)

```java
// Order.java

// ToMany 일 때는 연관관계 위치에 작성한다.
@BatchSize(size = 1000)
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
private List<OrderItem> orderItems = new ArrayList<>();

// ToOne 일 때는 엔티티 class 부분에서 작성한다.
@BatchSize(size = 100)
@Entity
@Getter @Setter
public abstract class Item {}

```

그냥 default_batch_fetch_size 사용하자!

> **참고**
<br>
default_batch_fetch_size 의 크기는 적당한 사이즈를 골라야 하는데, 100~1000 사이를 선택하는 것을 권장한다. 이 전략을 SQL IN 절을 사용하는데, 데이터베이스에 따라 IN 절 파라미터를 1000으로 제한하기도 한다. 1000으로 잡으면 한번에 1000개를 DB에서 애플리케이션에 불러오므로 DB 에 순간 부하가 증가할 수 있다. 하지만 애플리케이션은 100이든 1000이든 결국 전체 데이터를 로딩해야 하므로 메모리 사용량이 같다. 1000으로 설정하는 것이 성능상 가장 좋지만, 결국 DB든 애플리케이션이든 순간 부하를 어디까지 견딜 수 있는지로 결정하면 된다.
> 

여기까지 하면 JPA와 관련된 성능최적화는 90%는 해결이 된다.

## JPA에서 DTO 직접 조회

쿼리는 루트 1번, 컬렉션 N 번 실행된다. ToOne(N:1, 1:1) 관계들을 먼저 조회하고, ToMany(1:N) 관계는 각각 별도로 처리한다. 

이런 방식을 선택한 이유는 다음과 같다. 

- ToOne 관계는 조인해도 데이터 row 수가 증가하지 않는다.
- ToMany(1:N) 관계는 조인하면 row 수가 증가한다.

row 수가 증가하지 않는 ToOne 관계는 조인으로 최적화하기 쉬우므로 한번에 조회하고, ToMany
관계는 최적화 하기 어려우므로 findOrderItems() 같은 별도의 메서드로 조회한다.

```java
public List<OrderQueryDto> findOrderQueryDtos() {
    List<OrderQueryDto> result = findOrders(); // query 1번 -> N개
    result.forEach(o -> {
        List<OrderItemQueryDto> orderItems = findOrderItems(o.getOrderId()); // Query N번
        o.setOrderItems(orderItems);
    });
    return result;
}

private List<OrderQueryDto> findOrders() {
    return em.createQuery(
                    "select new jpabook.jpashop.repository.order.query.OrderQueryDto(o.id, m.name, o.orderDate, o.status, d.address)" +
                            " from Order o" +
                            " join o.member m" +
                            " join o.delivery d", OrderQueryDto.class)
            .getResultList();
}

private List<OrderItemQueryDto> findOrderItems(Long orderId) {
    return em.createQuery(
                    "select new jpabook.jpashop.repository.order.query.OrderItemQueryDto(oi.order.id, i.name, oi.orderPrice, oi.count)" +
                            " from OrderItem oi" +
                            " join oi.item i" +
                            " where oi.order.id = :orderId", OrderItemQueryDto.class
            )
            .setParameter("orderId", orderId)
            .getResultList();
}
```

### 컬렉션 조회 최적화

쿼리는 루트 1번, 컬렉션 1번 실행된다. ToOne 관계들을 먼저 조회하고, 여기서 얻은 식별자 orderId로 ToMany 관계인 OrderItem을 한꺼번에 조회하자. MAP을 사용해서 매칭 성능 향상(O(1))

### 플랫 데이터 최적화

쿼리는 1번 실행된다. 하지만, 조인으로 인해 DB에서 애플리케이션에 전달하는 데이터에 중복 데이터가 추가되므로 상황에 따라 컬렉션 조회 최적화 보다 더 느릴 수 도 있다. 또한 애플리케이션에서 추가 작업이 크다. 페이징 불가능하다.

## 정리

### 엔티티 조회 방식 접근 순서

1. 엔티티 조회 방식으로 우선접근
    1. 페치조인으로 쿼리 수를 최적화
    2. 컬렉션 최적화
        1. 페이징 필요 → hibernate.default_batch_fetch_size , @BatchSize 로 최적화
        2. 페이징 필요X → 페치 조인 사용
2. 엔티티 조회 방식으로 해결이 안되면 DTO조회 방식 사용
3. DTO 조회 방식으로 해결이 안되면 NativeSQL or 스프링 JdbcTemplate

> **참고**
엔티티 조회 방식은 페치 조인이나, hibernate.default_batch_fetch_size , @BatchSize 같이 코드를 거의 수정하지 않고, 옵션만 약간 변경해서, 다양한 성능 최적화를 시도할 수 있다. 반면에 DTO를 직접 조회하는 방식은 성능을 최적화 하거나 성능 최적화 방식을 변경할 때 많은 코드를 변경해야 한다.
> 

> **참고**
개발자는 성능 최적화와 코드 복잡도 사이에서 줄타기를 해야 한다. 항상 그런 것은 아니지만, 보통 성능 최적화는 단순한 코드를 복잡한 코드로 몰고간다. 엔티티 조회 방식은 JPA가 많은 부분을 최적화 해주기 때문에, 단순한 코드를 유지하면서, 성능을 최적화 할 수 있다. 반면에 DTO 조회 방식은 SQL을 직접 다루는 것과 유사하기 때문에, 둘 사이에 줄타기를 해야 한다.
> 

### DTO 조회 방식의 선택지

- DTO로 조회하는 방법도 각각 장단이 있다. V4, V5, V6에서 단순하게 쿼리가 1번 실행된다고 V6이 항상 좋은 방법인 것은 아니다.
- V4는 코드가 단순하다. 특정 주문 한건만 조회하면 이 방식을 사용해도 성능이 잘 나온다. 예를 들어서 조회한 Order 데이터가 1건이면 OrderItem을 찾기 위한 쿼리도 1번만 실행하면 된다.
- V5는 코드가 복잡하다. 여러 주문을 한꺼번에 조회하는 경우에는 V4 대신에 이것을 최적화한 V5 방식을 사용해야 한다. 예를 들어서 조회한 Order 데이터가 1000건인데, V4 방식을 그대로 사용하면, 쿼리가 총 1 + 1000번 실행된다. 여기서 1은 Order 를 조회한 쿼리고, 1000은 조회된 Order의 row 수다. V5 방식으로 최적화 하면 쿼리가 총 1 + 1번만 실행된다. 상황에 따라 다르겠지만 운영 환경에서 100배 이상의 성능 차이가 날 수 있다.
- V6는 완전히 다른 접근방식이다. 쿼리 한번으로 최적화 되어서 상당히 좋아보이지만, Order를 기준으로 페이징이 불가능하다. 실무에서는 이정도 데이터면 수백이나, 수천건 단위로 페이징 처리가 꼭 필요하므로, 이 경우 선택하기 어려운 방법이다. 그리고 데이터가 많으면 중복 전송이 증가해서 V5와 비교해서 성능 차이도 미비하다.