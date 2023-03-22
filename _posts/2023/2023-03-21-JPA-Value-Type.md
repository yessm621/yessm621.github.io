---
layout: post
title: "값 타입"
date: 2023-03-22 15:00:00
categories: [JPA]
tags:
  - JPA
author: "유자"
---

## 개요

JPA의 데이터 타입을 크게 분류하면 `엔티티 타입`과 `값 타입`이 있다.

1. 엔티티 타입
    - @Entity로 정의하는 객체
    - 데이터가 변해도 **식별자**를 통해 **추적 가능**
    - 예) 회원 엔티티의 키나 나이 값을 변경해도 식별자로 인식 가능
2. 값 타입
    - int, Integer, String 처럼 단순히 값으로 사용하는 **자바 기본 타입이나 객체**를 의미
    - 식별자가 없고 숫자나 문자 같은 속성만 있기 때문에 **추적이 불가능**
    - 예) 숫자 100을 200으로 변경하면 완전히 다른 값으로 대체

값 타입은 3가지로 나눌 수 있다.

1. 기본값 타입
    - 자바 기본 타입 (int, double)
    - 래퍼 클래스 (Integer, Long)
    - String
2. 임베디드 타입 (embedded type, 복합 값 타입)
    - 커스텀한 타입
3. 컬렉션 값 타입 (collection value type)

값 타입 중 `임베디드 타입`과 `값 타입 컬렉션` 두 파트가 중요하다. 값 타입에 대해 하나씩 알아보자.

## 기본값 타입

```java
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private int age;
    ...
}
```

- 위 코드에서 String, int 가 값 타입이다.
- Member 엔티티는 id 라는 식별자 값을 가지고 생명주기도 있지만, **값 타입은 식별자 값도 없고 생명주기도 회원 엔티티에 의존**한다. 따라서, 회원 엔티티가 제거되면 name, age 값도 제거된다.
- 값 타입은 공유하면 안된다.
    - 예) 회원 이름 변경 시 다른 회원의 이름도 함께 변경되면 안됨

> **참고** 자바의 기본 타입은 절대 공유X
<br>
int, double 같은 기본 타입(primitive type)은 절대 공유하면 안된다. 기본 타입은 항상 값을 복사한다.
> 
> 
> ```java
> int a = 10;
> // 값을 복사
> int b = a;
> 
> a = 20;
> 
> // 값이 공유가 되지 않음
> //a=20, b=10
> ```
> 
> Integer같은 래퍼 클래스나 String 같은 특수한 클래스는 공유 가능한 객체이지만 변경X
> 
> ```java
> Integer a = new Integer(10);
> // 주소값만 넘어가는 것 (참조값만)
> Integer b = a;
> 
> a.setValue(20);
> 
> // 값이 공유됨
> // a=20, b=20
> ```
> 

## 임베디드 타입(복합 값 타입)

**새로운 값 타입을 직접 정의해서 사용할 수 있는데 JPA에서는 이것을 `임베디드 타입`이라 한다.** 중요한 것은 직접 정의한 임베디드 타입도 int, String 처럼 값 타입이라는 것이다.

**임베디드 적용 전**

아래 코드는 객체지향적이지 않고 응집력만 떨어뜨린다. 이를 근무 기간, 주소 같은 타입이 있다면 코드가 더 명확해질 것이다.

```java
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private int age;

    // 근무 기간
    @Temporal(TemporalType.DATE) java.util.Date startDate;
    @Temporal(TemporalType.DATE) java.util.Date endDate;

    // 집 주소
    private String city;
    private String street;
    private String zipcode;
}
```

**임베디드 적용 후**

새로운 값 타입을 정의하여 회원 엔티티가 의미있고 응집력 있게 변했다. 새로 정의한 값 타입들은 재사용할 수 없고 응집도도 아주 높다.

```java
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private int age;

    // 근무 기간
    @Embedded Period workPeriod;

    // 집 주소
    @Embedded Address homeAddress;
}
```

```java
@Embeddable
public class Period {
    @Temporal(TemporalType.DATE) java.util.Date startDate;
    @Temporal(TemporalType.DATE) java.util.Date endDate;
}
```

```java
@Embeddable
public class Address {
    private String city;
    private String street;
    private String zipcode;
}
```

![1](https://user-images.githubusercontent.com/79130276/226816851-b5fa8202-86b6-4825-8615-95f2e5a68212.png)

회원 - 컴포지션 관계 UML

### 임베디드 타입 사용법

임베디드 타입을 사용하려면 2가지 어노테이션이 필요하다.

- **@Embeddable**: 값 타입을 정의하는 곳에 표시
- **@Embedded**: 값 타입을 사용하는 곳에 표시

그리고 임베디드 타입은 **기본 생성자가 필수**이다. 임베디드 타입을 포함한 모든 값 타입은 엔티티의 생명주기에 의존하므로 엔티티와 임베디드 타입의 관계를 UML 다이어그램으로 표현하면 컴포지션 관계가 된다.

> **참고** 하이버네이트는 임베디드 타입을 컴포넌트라 한다.
> 

### 임베디드 타입의 장점

- 재사용성
- 높은 응집도
- Period.isWork()처럼 해당 값 타입만 사용하는 의미 있는 메소드를 만들 수 있음
- 임베디드 타입을 포함한 모든 값 타입은, 값 타입을 소유한 엔티티에 생명주기를 의존함

### 임베디드 타입과 테이블 매핑

임베디드 타입은 DB의 테이블에 어떻게 매핑할까? 임베디드 타입은 엔티티의 값일 뿐이다. 임베디드 타입을 사용하기 전과 후에 **매핑하는 테이블은 같다**. 임베디드 타입 덕분에 객체와 테이블을 아주 세밀하게 매핑하는 것이 가능하다. 잘 설계한 ORM 애플리케이션은 매핑한 테이블의 수보다 클래스의 수가 더 많다.

![2](https://user-images.githubusercontent.com/79130276/226816858-c488b2cb-32a6-4513-8d00-7cb73ed27130.png)

### 임베디드 타입과 연관관계

임베디드 타입은 값 타입을 포함하거나 엔티티를 참조할 수 있다.

> **참고**
<br>
엔티티는 공유될 수 있으므로 참조한다고 표현하고, 값 타입은 특정 주인에 소속되고 논리적인 개념상 공유되지 않아 포함된다고 표현했다.
> 

![3](https://user-images.githubusercontent.com/79130276/226816859-8599d4f1-11c9-455f-8881-15a8bb67fe94.png)

아래 코드와 같이 embeddable 안에 엔티티를 정의할 수 있다.

```java
@Embeddable
public class Address {
    private String city;
    private String street;
    @Column(name = "ZIPCODE")
    private String zipcode;

    private Member member; // 엔티티
}
```

### @AttributeOverride: 속성 재정의

한 엔티티에서 같은 임베디드 타입을 사용하면 컬럼명이 중복된다. 이때 엔티티에 AttributeOverrides, @AttributeOverride를 사용해서 컬럼명 속성을 재정의하면 중복되게 사용할 수 있다.

```java
@Entity
public class Member {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @Embedded
    Address homeAddress;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "city", column = @Column(name = "company_city")),
        @AttributeOverride(name = "street", column = @Column(name = "company_street")),
        @AttributeOverride(name = "zipcode", column = @Column(name = "company_zipcode"))
    })
    Address companyAddress;
}
```

### 임베디드 타입과 null

임베디드 타입의 값이 null이면 매핑한 컬럼 값은 모두 null이 된다.

```java
member.setAddress(null);
em.persist(member);
```

회원 테이블의 주소와 관련된 city, street, zipcode 컬럼 값은 모두 null이 된다.

## 값 타입과 불변 객체

값 타입은 복잡한 객체 세상을 조금이라도 단순화하려고 만든 개념이다. 따라서, 값 타입은 단순하고 안전하게 다룰 수 있어야 한다.

### 값 타입 공유 참조

임베디드 타입 같은 값 타입을 여러 엔티티에서 공유하면 위험하다.

![4](https://user-images.githubusercontent.com/79130276/226816861-95347912-292a-4e44-86de-1d44240808a0.png)

아래코드는 값 타입을 공유 시 발생할 수 있는 문제점을 나타내었다.

```java
Address address = new Address("city", "street", "10000");

Member member = new Member();
member.setUsername("member1");
member.setHomeAddress(address);
em.persist(member);

Member member2 = new Member();
member2.setUsername("member2");
member2.setHomeAddress(address);
em.persist(member2);

member.getHomeAddress().setCity("newCity");
```

member에 대한 주소값을 변경하려고 했지만 실제론 member2에 있는 주소값까지 변경이 된다. 이런 버그는 찾아내기 매우 힘들다. 이렇듯 뭔가를 수정했는데 예상치 못한 곳에서 문제가 발생하는 것을 부작용(side effect)이라 한다. 부작용을 막으려면 값을 복사해서 사용하면 된다.

### 값 타입 복사

값 타입의 실제 인스턴스인 값을 공유하는 것은 위험하다. 대신 값(인스턴스)을 복사해서 사용해야 한다.

![5](https://user-images.githubusercontent.com/79130276/226816864-1312fc69-42b3-4b0e-8232-3f27a110323e.png)

```java
Address address = new Address("city", "street", "10000");

Member member = new Member();
member.setUsername("member1");
member.setHomeAddress(address);
em.persist(member);

Address copyAddress = new Address(address.getCity(), address.getStreet(), address.getZipcode());

Member member2 = new Member();
member2.setUsername("member2");
member2.setHomeAddress(copyAddress);
em.persist(member2);

member.getHomeAddress().setCity("newCity");
```

항상 값을 복사해서 사용하면 공유 참조로 인해 발생하는 부작용을 피할 수 있다. 문제는 임베디드 타입처럼 **직접 정의한 값 타입은 자바의 기본 타입이 아니라 객체 타입**이다. 따라서, 한계가 발생한다.

**기본 타입 값 복사**

자바 기본 타입에 값을 대입하면 값을 복사한다.

```java
int a = 10;
int b = a;
b = 4;
// a = 10, b = 4
```

**객체 타입 참조 복사**

객체를 복사할 땐 참조 값을 넘겨주기 때문에 인스턴스가 공유된다. **객체 타입은 참조 값을 직접 대입하는 것을 막을 방법이 없다. 객체의 공유 참조는 피할 수 없다.**

```java
Address a = new Address("old");
Address b = a;
b.setCity("new");
```

### 불변 객체

객체 타입을 수정할 수 없게 만들면 **부작용을 원천 차단**할 수 있다. 따라서, **값 타입은 불변 객체(immutable object)로 설계**해야 한다.

**`불변 객체`란 생성 시점 이후 절대 값을 변경할 수 없는 객체를 의미**한다. 생성자로만 값을 설정하고 수정자(Setter)를 만들지 않으면 된다. 즉, Setter를 없애거나 Setter를 public에서 private로 만들면 된다. **불변**이라는 작은 제약으로 부작용이라는 큰 재앙을 막을 수 있다.

> **참고**
<br>
Integer, String은 자바가 제공하는 대표적인 불변 객체이다.
> 

## 값 타입의 비교

값 타입은 인스턴스가 달라도 그 안에 값이 같으면 같은 것으로 봐야 한다. 따라서 값 타입을 비교할 때는 a.equals(b)를 사용해서 동등성 비교를 해야 한다. 물론 Address의 equals() 메소드를 재정의해야 한다. 값 타입의 equals() 메소드를 재정의할 때는 보통 모든 필드의 값을 비교하도록 구현한다.

```java
// a==b : true
int a = 10;
int b = 10;

// a==b : false
Address a = new Address("서울시");
Address b = new Address("서울시");

System.out.println("a == b: " + (a == b)); // false
System.out.println("a equals b: " + (a.equals(b))); // false
// equals의 기본 비교는 == 이기 때문에 false가 나온다

// equals 를 오버라이드 해서 사용해야 true가 나옴
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Address address = (Address) o;
    return Objects.equals(city, address.city) &&
            Objects.equals(street, address.street) &&
            Objects.equals(zipcode, address.zipcode);
}
System.out.println("a equals b: " + (a.equals(b))); // true
```

> **참고**
> 
> - **동일성(identity) 비교:** 인스턴스의 참조값을 비교, == 사용
> - **동등성(equivalence) 비교**: 인스턴스의 값을 비교, equals() 사용

> **참고**
<br>
자바에서 equals()를 재정의하면 hashCode()도 재정의하는 것이 안전하다. 그렇지 않으면 해시를 사용하는 컬렉션(HashSet, HashMap)이 정상 동작하지 않는다. 자바 IDE에는 대부분 equals, hashCode 메소드를 자동으로 생성해주는 기능이 있다.
> 

## 값 타입 컬렉션

값 타입을 하나 이상 저장할 때 사용한다. @ElementCollection, @CollectionTable 어노테이션을 사용하면 된다.

데이터베이스는 컬렉션을 같은 테이블에 저장할 수 없기 때문에 컬렉션을 저장하기 위한 별도의 테이블이 필요하다.

![6](https://user-images.githubusercontent.com/79130276/226816866-471f6a55-2688-43a5-946d-72522738eba3.png)

```java
@Entity
@Getter
public class Member extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;
    private String username;

    @Embedded
    private Address homeAddress;

    @ElementCollection
    @CollectionTable(name = "FAVORITE_FOOD", joinColumns = @JoinColumn(name = "MEMBER_ID"))
    @Column(name = "FOOD_NAME")
    private Set<String> favoriteFoods = new HashSet<>();

		// 결론적으로 사용하면 안된다
    @ElementCollection
    @CollectionTable(name = "ADDRESS", joinColumns = @JoinColumn(name = "MEMBER_ID"))
    private List<Address> addressHistory = new ArrayList<>();
}
```

```java
Member member = new Member();
member.setUsername("member1");
member.setHomeAddress(new Address("homeCity", "street", "10000"));

member.getFavoriteFoods().add("치킨");
member.getFavoriteFoods().add("족발");
member.getFavoriteFoods().add("피자");

member.getAddressHistory().add(new Address("old1", "street", "10000"));
member.getAddressHistory().add(new Address("old2", "street", "10000"));

em.persist(member);
```

```
Hibernate: 
    /* insert jpabook.jpashop.domain.Member
        */ insert 
        into
            Member
            (city, street, zipcode, username, MEMBER_ID) 
        values
            (?, ?, ?, ?, ?)
Hibernate: 
    /* insert collection
        row jpabook.jpashop.domain.Member.addressHistory */ insert 
        into
            ADDRESS
            (MEMBER_ID, city, street, zipcode) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* insert collection
        row jpabook.jpashop.domain.Member.addressHistory */ insert 
        into
            ADDRESS
            (MEMBER_ID, city, street, zipcode) 
        values
            (?, ?, ?, ?)
Hibernate: 
    /* insert collection
        row jpabook.jpashop.domain.Member.favoriteFoods */ insert 
        into
            FAVORITE_FOOD
            (MEMBER_ID, FOOD_NAME) 
        values
            (?, ?)
Hibernate: 
    /* insert collection
        row jpabook.jpashop.domain.Member.favoriteFoods */ insert 
        into
            FAVORITE_FOOD
            (MEMBER_ID, FOOD_NAME) 
        values
            (?, ?)
Hibernate: 
    /* insert collection
        row jpabook.jpashop.domain.Member.favoriteFoods */ insert 
        into
            FAVORITE_FOOD
            (MEMBER_ID, FOOD_NAME) 
        values
            (?, ?)
5월 02, 2022 10:20:42 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]

Process finished with exit code 0
```

### 값 타입 컬렉션 사용

- 값 타입 저장 예제
- 값 타입 조회 예제
    - 값 타입 컬렉션도 **지연 로딩** 전략 사용
    
    ```java
    Member member = new Member();
    member.setUsername("member1");
    member.setHomeAddress(new Address("homeCity", "street", "10000"));
    
    member.getFavoriteFoods().add("치킨");
    member.getFavoriteFoods().add("족발");
    member.getFavoriteFoods().add("피자");
    
    member.getAddressHistory().add(new Address("old1", "street", "10000"));
    member.getAddressHistory().add(new Address("old2", "street", "10000"));
    
    em.persist(member);
    
    em.flush();
    em.clear();
    
    System.out.println("=============== START ==============");
    Member findMember = em.find(Member.class, member.getId());
    
    List<Address> addressHistory = findMember.getAddressHistory();
    for (Address address : addressHistory) {
        System.out.println("address = " + address.getCity());
    }
    
    Set<String> favoriteFoods = findMember.getFavoriteFoods();
    for (String favoriteFood : favoriteFoods) {
        System.out.println("favoriteFood = " + favoriteFood);
    }
    
    tx.commit();
    ```
    
    ```
    Hibernate: 
        /* insert jpabook.jpashop.domain.Member
            */ insert 
            into
                Member
                (city, street, zipcode, username, MEMBER_ID) 
            values
                (?, ?, ?, ?, ?)
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.addressHistory */ insert 
            into
                ADDRESS
                (MEMBER_ID, city, street, zipcode) 
            values
                (?, ?, ?, ?)
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.addressHistory */ insert 
            into
                ADDRESS
                (MEMBER_ID, city, street, zipcode) 
            values
                (?, ?, ?, ?)
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.favoriteFoods */ insert 
            into
                FAVORITE_FOOD
                (MEMBER_ID, FOOD_NAME) 
            values
                (?, ?)
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.favoriteFoods */ insert 
            into
                FAVORITE_FOOD
                (MEMBER_ID, FOOD_NAME) 
            values
                (?, ?)
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.favoriteFoods */ insert 
            into
                FAVORITE_FOOD
                (MEMBER_ID, FOOD_NAME) 
            values
                (?, ?)
    =============== START ==============
    Hibernate: 
        select
            member0_.MEMBER_ID as member_i1_7_0_,
            member0_.city as city2_7_0_,
            member0_.street as street3_7_0_,
            member0_.zipcode as zipcode4_7_0_,
            member0_.username as username5_7_0_ 
        from
            Member member0_ 
        where
            member0_.MEMBER_ID=?
    Hibernate: 
        select
            addresshis0_.MEMBER_ID as member_i1_0_0_,
            addresshis0_.city as city2_0_0_,
            addresshis0_.street as street3_0_0_,
            addresshis0_.zipcode as zipcode4_0_0_ 
        from
            ADDRESS addresshis0_ 
        where
            addresshis0_.MEMBER_ID=?
    address = old1
    address = old2
    Hibernate: 
        select
            favoritefo0_.MEMBER_ID as member_i1_5_0_,
            favoritefo0_.FOOD_NAME as food_nam2_5_0_ 
        from
            FAVORITE_FOOD favoritefo0_ 
        where
            favoritefo0_.MEMBER_ID=?
    favoriteFood = 족발
    favoriteFood = 치킨
    favoriteFood = 피자
    5월 02, 2022 10:48:36 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
    INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]
    
    Process finished with exit code 0
    ```
    
- 값 타입 수정 예제
    
    **[예제1] Set<기본값 타입> 수정**
    
    ```java
    System.out.println("=============== START ==============");
    Member findMember = em.find(Member.class, member.getId());
    
    // homeCity -> newCity
    // findMember.getHomeAddress().setCity("newCity");
    
    // 위의 코드처럼 setter를 사용해서 값을 변경하면 부작용(side effect) 발생
    // side effect 와 같은 버그는 매우 잡기 힘들다.
    // 따라서, 아래와 같이 아예 새로 넣어줘야 한다.
    Address a = findMember.getHomeAddress();
    findMember.setHomeAddress(new Address("newCity", a.getStreet(), a.getZipcode()));
    
    //치킨 -> 한식
    findMember.getFavoriteFoods().remove("치킨");
    findMember.getFavoriteFoods().add("한식");
    ```
    
    ```
    =============== START ==============
    Hibernate: 
        select
            member0_.MEMBER_ID as member_i1_7_0_,
            member0_.city as city2_7_0_,
            member0_.street as street3_7_0_,
            member0_.zipcode as zipcode4_7_0_,
            member0_.username as username5_7_0_ 
        from
            Member member0_ 
        where
            member0_.MEMBER_ID=?
    Hibernate: 
        select
            favoritefo0_.MEMBER_ID as member_i1_5_0_,
            favoritefo0_.FOOD_NAME as food_nam2_5_0_ 
        from
            FAVORITE_FOOD favoritefo0_ 
        where
            favoritefo0_.MEMBER_ID=?
    Hibernate: 
        /* update
            jpabook.jpashop.domain.Member */ update
                Member 
            set
                city=?,
                street=?,
                zipcode=?,
                username=? 
            where
                MEMBER_ID=?
    Hibernate: 
        /* delete collection row jpabook.jpashop.domain.Member.favoriteFoods */ delete 
            from
                FAVORITE_FOOD 
            where
                MEMBER_ID=? 
                and FOOD_NAME=?
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.favoriteFoods */ insert 
            into
                FAVORITE_FOOD
                (MEMBER_ID, FOOD_NAME) 
            values
                (?, ?)
    5월 02, 2022 11:16:33 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
    INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]
    
    Process finished with exit code 0
    ```
    
    **[예제2] List<임베디드 타입> 수정**
    
    Set<기본값 타입>처럼 삭제 후 수정이 잘 될 것 같지만 그렇지 않다.
    
    해당되는 값을 모두 삭제 후 모든 값을 다시 넣어준다
    
    ```java
    //remove 는 equals()로 비교함. 따라서, equals()와 hashcode()를 잘 정의해야 함
    findMember.getAddressHistory().remove(new Address("old1", "street", "10000"));
    findMember.getAddressHistory().add(new Address("newCity1", "street", "10000"));
    ```
    
    ```
    =============== START ==============
    Hibernate: 
        select
            member0_.MEMBER_ID as member_i1_7_0_,
            member0_.city as city2_7_0_,
            member0_.street as street3_7_0_,
            member0_.zipcode as zipcode4_7_0_,
            member0_.username as username5_7_0_ 
        from
            Member member0_ 
        where
            member0_.MEMBER_ID=?
    Hibernate: 
        select
            addresshis0_.MEMBER_ID as member_i1_0_0_,
            addresshis0_.city as city2_0_0_,
            addresshis0_.street as street3_0_0_,
            addresshis0_.zipcode as zipcode4_0_0_ 
        from
            ADDRESS addresshis0_ 
        where
            addresshis0_.MEMBER_ID=?
    Hibernate: 
        /* delete collection jpabook.jpashop.domain.Member.addressHistory */ delete 
            from
                ADDRESS 
            where
                MEMBER_ID=?
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.addressHistory */ insert 
            into
                ADDRESS
                (MEMBER_ID, city, street, zipcode) 
            values
                (?, ?, ?, ?)
    Hibernate: 
        /* insert collection
            row jpabook.jpashop.domain.Member.addressHistory */ insert 
            into
                ADDRESS
                (MEMBER_ID, city, street, zipcode) 
            values
                (?, ?, ?, ?)
    5월 02, 2022 11:16:56 오전 org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl$PoolState stop
    INFO: HHH10001008: Cleaning up connection pool [jdbc:h2:tcp://localhost/~/test]
    
    Process finished with exit code 0
    ```
    
- 참고: 값 타입 컬렉션은 영속성 전에(Cascade) + 고아 객체 제거 기능을 필수로 가진다고 볼 수 있다.

### 값 타입 컬렉션의 제약사항

값 타입은 엔티티와 다르게 식별자 개념이 없기 때문에 값을 변경하면 추적이 어렵다. 값 타입 컬렉션에 변경 사항이 발생하면, 주인 엔티티와 연관된 모든 데이터를 삭제하고, 값 타입 컬렉션에 있는 현재 값을 모두 다시 저장한다.

값 타입 컬렉션을 매핑하는 테이블은 모든 컬럼을 묶어서 기본키를 구성해야 한다. (null 입력X, 중복 저장X)

### 값 타입 컬렉션 대안

실무에서는 상황에 따라 **값 타입 컬렉션 대신에 일대다 관계를 고려**한다. 일대다 관계를 위한 엔티티를 만들고, 여기에서 값 타입을 사용하면 영속성 전이(Cascade) + 고아 객체 제거를 사용해서 값 타입 컬렉션 처럼 사용할 수 있다. 예) AddressEntity

**[전] 값 타입 컬렉션**

```java
@Entity
@Getter
@Setter
public class Member {

    @Id
    @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;
    private String username;

    @Embedded
    private Address homeAddress;

    @ElementCollection
    @CollectionTable(name = "FAVORITE_FOOD", joinColumns = @JoinColumn(name = "MEMBER_ID"))
    @Column(name = "FOOD_NAME")
    private Set<String> favoriteFoods = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "ADDRESS", joinColumns = @JoinColumn(name = "MEMBER_ID"))
    private List<Address> addressHistory = new ArrayList<>();
}
```

```java
@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String city;
    private String street;
    private String zipcode;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Address address = (Address) o;
        return Objects.equals(city, address.city) &&
                Objects.equals(street, address.street) &&
                Objects.equals(zipcode, address.zipcode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(city, street, zipcode);
    }
}
```

**[후] 일대다로 변경 (실무에서 많이 사용)**

```java
@Entity
@Getter
@Setter
public class Member {

    @Id
    @GeneratedValue
    @Column(name = "MEMBER_ID")
    private Long id;
    private String username;

    @Embedded
    private Address homeAddress;

    @ElementCollection
    @CollectionTable(name = "FAVORITE_FOOD", joinColumns = @JoinColumn(name = "MEMBER_ID"))
    @Column(name = "FOOD_NAME")
    private Set<String> favoriteFoods = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "MEMBER_ID")
    private List<AddressEntity> addressHistory = new ArrayList<>();
}
```

```java
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "ADDRESS")
public class AddressEntity {

    @Id
    @GeneratedValue
    private Long id;

    private Address address;

    public AddressEntity(String city, String street, String zipcode) {
        this.address = new Address(city, street, zipcode);
    }
}
```