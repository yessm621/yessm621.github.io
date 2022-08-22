---
title: "JPA 조회 성능 최적화"
last_modified_at: 2022-08-16T11:00:00
categories:
  - JPA
tags:
  - JPA
  - SpringBoot
toc: true
toc_label: "Index"
toc_sticky: true
---

조회 성능 최적화 부분은 매우 중요하다. 실무에서 JPA를 사용하려면 100% 이해해야 한다.

## 페치 조인(fetch join) [(링크)](https://yessm621.github.io/jpa/JPA-Fetch-Join/)

페치 조인이란 JPQL에서 성능 최적화를 위해 제공하는 기능이다. 페치 조인은 JPA에만 있는 문법으로 SQL의 조인 종류와는 다르다. 페치 조인으로 데이터를 가져오면 지연로딩으로 설정되어 있어도 무시하고 프록시 객체가 아닌 진짜 객체를 가져온다. 

예제. Order와 Member는 다대일 연관관계(양방향), Order와 Delivery는 다대일 연관관계(양방향)가 되어있고, Member와 Delivery는 지연 로딩이 설정되어 있다.

```java
@GetMapping("/api/v2/simple-orders")
public List<SimpleOrderDto> ordersV2() {
    List<Order> orders = orderRepository.findAllByString(new OrderSearch());
    List<SimpleOrderDto> result = orders.stream()
            .map(o -> new SimpleOrderDto(o))
            .collect(Collectors.toList());

    return result;
}

@Data
static class SimpleOrderDto {
    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;

    public SimpleOrderDto(Order order) {
        orderId = order.getId();
        name = order.getMember().getName();
        orderDate = order.getOrderDate();
        orderStatus = order.getStatus();
        address = order.getDelivery().getAddress();
    }
}
```

엔티티를 DTO로 변환하는 일반적인 방법이다. 위의 코드는 쿼리가 총 1 + N + N번 실행된다. 

- 1번: Order 조회 1번
- N번: Order → Member 지연 로딩 조회 N번
- N번: Order → Delivery 지연 로딩 조회 N번

지연 로딩은 영속성 컨텍스트에서 조회하므로, 이미 조회된 경우 쿼리를 생략한다. 그러나, 이 경우에는 id값이 달랐기 때문에 N번 조회한다.

정리하자면, 쿼리가 1 + N + N번 실행되는 원인은 JPA의 지연로딩 매커니즘 때문이다.

그렇다면 이 문제를 어떻게 해결해야 할까?

페치 조인 적용

```java
@GetMapping("/api/v3/simple-orders")
public List<SimpleOrderDto> ordersV3() {
    List<Order> orders = orderRepository.findAllWithMemberDelivery();
    List<SimpleOrderDto> result = orders.stream()
            .map(o -> new SimpleOrderDto(o))
            .collect(toList());
    return result;
}
```

```java
// memberRepository에 추가
// jpql
public List<Order> findAllWithMemberDelivery() {
      return em.createQuery(
              "select o from Order o" +
              " join fetch o.member m" +
              " join fetch o.delivery d", Order.class)
             .getResultList();
}
```

엔티티를 페치 조인을 사용해서 가져오면 쿼리 1번에 조회가 가능하다. 페치 조인으로 데이터를 가져오면 지연 로딩으로 설정되어 있어도 무시하고 프록시 객체가 아닌 진짜 객체를 가져온다.

> **참고**
원래는 List로 반환하면 안되고 Result로 감싸서 반환해야 한다. 지금은 예제이기 때문에 이렇게 진행한다.
> 

## JPA에서 DTO 직접 조회

DTO로 바로 조회하면 선택한 컬럼만 가져올 수 있다. 일반적인 SQL을 사용할 때처럼 원하는 값을 선택해서 조회할 수 있다. new 명령어를 사용해서 JPQL의 결과를 DTO로 즉시 변환한다. 선택한 컬럼만 가져오면 성능 최적화를 할 수 있다는 장점이 있지만 리포지토리 재사용성이 떨어진다는 단점이 있다.

```java
@GetMapping("/api/v4/simple-orders")
public List<OrderSimpleQueryDto> ordersV4() {
    return orderSimpleQueryRepository.findOrderDtos();
}
```

```java
@Repository
@RequiredArgsConstructor
public class OrderSimpleQueryRepository {

    private final EntityManager em;

    public List<OrderSimpleQueryDto> findOrderDtos() {
        return em.createQuery(
                        "select new jpabook.jpashop.repository.order.simplequery.OrderSimpleQueryDto(o.id, m.name, o.orderDate, o.status, d.address) " +
                                " from Order o" +
                                " join o.member m" +
                                " join o.delivery d", OrderSimpleQueryDto.class)
                .getResultList();
    }
}
```

```java
@Data
public class OrderSimpleQueryDto {
    private Long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;

    public OrderSimpleQueryDto(Long orderId, String name, LocalDateTime orderDate, OrderStatus orderStatus, Address address) {
        this.orderId = orderId;
        this.name = name;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.address = address;
    }
}
```

DTO 조회 전용 리포지토리를 만든 이유는 유지보수 라이프 사이클이 다르기 때문이다. 엔티티를 반환하는 핵심 로직과 특정 API에 의존적인 로직의 라이프 사이클은 다르다. 따라서, 엔티티 반환 로직과 DTO 반환 로직을 분리하는게 좋다.

- OrderRepository: 엔티티만 조회, 특정 API에 의존적이지 않다.
- OrderSimpleQueryRepository: DTO 조회 전용, 특정 API에 의존적이다.

### 쿼리 방식 선택 권장 순서

1. 우선 엔티티를 DTO로 변환하는 방법을 선택한다.
2. 필요하면 페치 조인으로 성능을 최적화 한다. 대부분의 성능 이슈가 해결된다.
3. 그래도 안되면 DTO로 직접 조회하는 방법을 사용한다.
4. 최후의 방법은 JPA가 제공하는 네이티브 SQL이나 스프링 JDBC Template을 사용해서 SQL을 직접 사용한다.