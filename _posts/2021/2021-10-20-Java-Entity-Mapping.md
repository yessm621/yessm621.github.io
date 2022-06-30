---
title: "엔티티 매핑"
categories:
  - JPA
tags:
  - Java
  - SpringBoot
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

JPA 를 사용하는 데 가장 중요한 일은 엔티티와 테이블을 정확히 매핑하는 것. 따라서, 매핑 어노테이션을 숙지하고 사용해야 함

`대표 어노테이션`

- 객체와 테이블 매핑: @Entity, @Table
- 기본 키 매핑: @Id
- 필드와 컬럼 매핑: @Column
- 연관관계 매핑: @ManyToOne, @JoinColumn

<br>

## @Entity

JPA 를 사용해서 테이블과 매핑할 클래스는 @Entity 어노테이션을 필수로 붙여야함

@Entity 가 붙은 클래스는 JPA 가 관리

<br>

## @Table

엔티티와 매핑할 테이블을 지정. 생략하면 매핑한 엔티티의 이름을 테이블 이름으로 사용

<br>

## 다양한 매핑 사용

다음의 요구사항을 만족하는 회원 엔티티를 생성하자

```
1. 회원은 일반 회원과 관리자로 구분해야 한다.
2. 회원 가입일과 수정일이 있어야 한다.
3. 회원을  설명할 수 있는 필드가 있어야 한다. 이 필드는 길이 제한이 없다.
```

```java
package jpabook.start;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "MEMBER")
@Getter
@Setter
public class Member {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "NAME")
    private String username;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private RoleType roleType;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastModifiedDate;

    @Lob
    private String description;
}
```

```java
package jpabook.start;

public enum RoleType {
	ADMIN, USER
}
```

1. roleType
    
    → 자바의 enum 타입을 사용해서 회원의 타입을 구분
    
    → 일반 회원은 USER, 관리자는 ADMIN
    
    → 자바의 enum 타입을 사용하려면 `@Enumerated` 어노테이션으로 매핑해야 함
    
2. createdDate, lastModifiedDate
    
    → 자바의 날짜 타입을 `@Temporal` 을 사용해서 매핑
    
3. description
    
    → 길이 제한 없애고 싶을 때 `@Lob` 을 사용하면 CLOB, BLOB 타입을 매핑할 수 있다

<br>

## DDL 생성 기능

```
1. 회원이름은 필수로 입력
2. 10자를 초과하면 안 된다
```

```java
package jpabook.start;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "MEMBER")
@Getter
@Setter
public class Member {

	@Id
	@Column(name = "ID")
	private String id;

	@Column(name = "NAME", nullable = false, length = 10)
	private String username;

	...
}
```

1. nullable 속성
2. length 속성

<br>

유니크 제약조건 @Table uniqueConstraints 속성

```java
package jpabook.start;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "MEMBER", uniqueConstraints = {@UniqueConstraint(
	name="NAME_AGE_UNIQUE",
	columnNames = {"NAME", "AGE"} )})
public class Member {

	@Id
	@Column(name = "ID")
	private String id;

	@Column(name = "NAME", nullable = false, length = 10)
	private String username;

	...
}
```

length, nullable, unique 속성들은 DDL을 자동 생성할 때만 사용되고 JPA의 실행 로직에는 영향을 주지 않는다.

<br>

## 필드와 컬럼 매핑: 레퍼런스

**@Column**

→ 객체 필드를 테이블 컬럼에 매핑함

→ 속성 중 name, nullable 이 주로 사용

**@Enumerated**

**@Lob**

<br>

**책 예제 4.25**

Member.java

```java
package jpabook.model.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by holyeye on 2014. 3. 11..
 */

@Entity
@Getter
@Setter
public class Member {

    @Id @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;

    private String name;

    private String city;
    private String street;
    private String zipcode;
}
```

Order.java

```java
package jpabook.model.entity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by holyeye on 2014. 3. 11..
 */
@Entity
@Getter
@Setter
@Table(name = "ORDERS")
public class Order {

    @Id
    @GeneratedValue
    @Column(name = "ORDER_ID")
    private Long id;

    @Column(name = "MEMBER_ID")
    private Long memberId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;     //주문시간

    @Enumerated(EnumType.STRING)
    private OrderStatus status;//주문상태
}
```

OrderStatus.java

```java
package jpabook.model.entity;

/**
 * Created by holyeye on 2014. 3. 11..
 */
public enum OrderStatus {
    ORDER, CANCEL

}
```

OrderItem.java

```java
package jpabook.model.entity;

import javax.persistence.*;

/**
 * Created by holyeye on 2014. 3. 11..
 */
@Entity
@Getter
@Setter
@Table(name = "ORDER_ITEM")
public class OrderItem {

    @Id
    @GeneratedValue
    @Column(name = "ORDER_ITEM_ID")
    private Long id;

    @Column(name = "ITEM_ID")
    private Long itemId;
    @Column(name = "ORDER_ID")
    private Long orderId;

    private int orderPrice; //주문 가격
    private int count;      //주문 수량

    @Override
    public String toString() {
        return "OrderItem{" +
                "id=" + id +
                ", buyPrice=" + orderPrice +
                ", count=" + count +
                '}';
    }
}
```

Item.java

```java
package jpabook.model.entity;

import javax.persistence.*;

/**
 * Created by holyeye on 2014. 3. 11..
 */

@Entity
@Getter
@Setter
public class Item {

    @Id @GeneratedValue
    @Column(name = "ITEM_ID")
    private Long id;

    private String name;        //이름
    private int price;          //가격
    private int stockQuantity;  //재고수량

    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                '}';
    }
}
```

이 예제는 객체 설계를 테이블 설계에 맞춘 방법이다 (데이터 중심 설계)

특히 테이블의 외래 키를 객체에 그대로 가져온 부분이 문제다. 관계형 DB 에서는 연관된 객체를 찾을 때 외래 키를 사용해서 조인하면 되지만 객체에는 조인기능이 없다. 

객체는 연관된 객체를 찾을 때 참조를 사용해야 한다.

예를 들어,

주문을 조회한 다음 주문과 연관된 회원을 조회하려면 다음처럼 외래 키를 사용해서 다시 조회해야 한다.

```java
Order order = em.find(Order.class, orderId);
// 외래 키로 다시 조회
Member member = em.find(Member.class, order.getMemberId());
```

객체는 참조를 사용해서 연관관계를 조회 할 수 있다. 다음처럼 참조를 사용하는 것이 객체지향적인 방법이다.

```java
Order order = em.find(Order.class, orderId);
Member member = order.getMember(); // 참조 사용
```

객체는 참조를 사용해서 연관된 객체를 찾고 테이블은 외래 키를 사용해서 연관된 테이블을 찾으므로 둘 사이에는 큰 차이가 있다

JPA 는 객체의 참조와 테이블의 외래 키를 매핑해서 객체에서는 참조를 사용하고 테이블에서는 외래 키를 사용할 수 있도록 한다.
