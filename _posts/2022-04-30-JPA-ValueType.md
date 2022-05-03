---
title:  "값 타입"
# last_modified_at: 2022-04-30T14:35:00
last_modified_at: 2022-05-02T13:35:00
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


임베디드 타입, 값 타입 컬렉션 두 파트가 중요함

<br>

## 1. 기본값 타입

### 1.1 JPA의 데이터 타입 분류

- 엔티티 타입
    - @Entity로 정의하는 객체
    - 데이터가 변해도 **식별자**로 지속해서 **추적 가능**
    - 예) 회원 엔티티의 키나 나이 값을 변경해도 식별자로 인식 가능
- 값 타입
    - int, Integer, String 처럼 단순히 값으로 사용하는 자바 기본 타입이나 객체
    - 식별자가 없고 값만 있으므로 변경 시 추적 불가
    - 예) 숫자 100을 200으로 변경하면 완전히 다른 값으로 대체

<br>

### 1.2 값 타입 분류

- 기본값 타입
    - 자바 기본 타입(int, double)
    - 래퍼 클래스(Integer, Long)
    - Stirng
- 임베디드 타입(embedded type, 복합 값 타입)
    - 커스텀한 타입
- 컬렉션 값 타입(collection value type)

<br>

### 1.3 기본값 타입

- 예) String name, int age
- 생명주기를 엔티티에 의존
    - 예) 회원을 삭제하면 이름, 나이 필드도 함께 삭제
- 값 타입은 공유하면 X
    - 예) 회원 이름 변경 시 다른 회원의 이름도 함께 변경되면 안됨

<br>

### 1.4 참고: 자바의 기본 타입은 절대 공유X

- int, double 같은 기본 타입(primitive type)은 절대 공유X
- 기본 타입은 항상 값을 복사함

```java
int a = 10;
// 값을 복사
int b = a;

a = 20;

// 값이 공유가 되지 않음
//a=20, b=10
```

- Integer같은 래퍼 클래스나 String 같은 특수한 클래스는 공유 가능한 객체이지만 변경X

```java
Integer a = new Integer(10);
// 주소값만 넘어가는 것 (참조값만)
Integer b = a;

a.setValue(20);

// 값이 공유됨
// a=20, b=20
```

<br>

## 2. 임베디드 타입(복합 값 타입)

### 2.1 임베디드 타입

- 새로운 값 타입을 직접 정의할 수 있음
- JPA는 임베디드 타입(embedded type)이라 함
- 주로 기본 값 타입을 모아서 만들어서 복합 값 타입이라고도 함
- int, String과 같은 값 타입

**[예시]**

- 회원 엔티티는 이름, (근무 시작일, 근무 종료일), (주소 도시, 주소 번지, 주소 우편번호)를 가짐

![스크린샷 2022-04-30 오후 1 40 26](https://user-images.githubusercontent.com/79130276/166092986-8179df8d-c9c2-4a66-a2c2-8fe1e30c503d.png)

- 회원 엔티티는 이름, 근무 기간, 집 주소를 가짐

![스크린샷 2022-04-30 오후 1 40 39](https://user-images.githubusercontent.com/79130276/166092985-aaba7507-b922-4c35-919c-92b473218762.png)

![스크린샷 2022-04-30 오후 1 40 56](https://user-images.githubusercontent.com/79130276/166092984-3dc35405-8df5-4fd7-9007-843c17495573.png)

<br>

### 2.2 임베디드 타입 사용법

- @Embeddable: 값 타입을 정의하는 곳에 표시
- @Embedded: 값 타입을 사용하는 곳에 표시
- 기본 생성자 필수

<br>

### 2.3 임베디드 타입의 장점

- 재사용
- 높은 응집도
- Period.isWork()처럼 해당 값 타입만 사용하는 의미 있는 메소드를 만들 수 있음
- 임베디드 타입을 포함한 모든 값 타입은, 값 타입을 소유한 엔티티에 생명주기를 의존함

<br>

### 2.4 임베디드 타입과 테이블 매핑

![스크린샷 2022-04-30 오후 1 44 51](https://user-images.githubusercontent.com/79130276/166092980-824066e7-e51c-44c6-a1fa-ef3d69f438f1.png)

JpaMain.java

```java
Member member = new Member();
member.setUsername("hello");
member.setHomeAddress(new Address("city", "street", "10000"));
member.setWorkPeriod(new Period());

em.persist(member);
```

Member.java

```java
package hellojpa.domain.example;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

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
    private Period workPeriod;

    @Embedded
    private Address homeAddress;

}
```

Period.java

```java
package hellojpa.domain.example;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Period {

    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
```

Address.java

```java
package hellojpa.domain.example;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String city;
    private String street;
    private String zipcode;
}
```

- 임베디드 타입은 엔티티의 값일 뿐이다
- 임베디드 타입을 사용하기 전과 후에 **매핑하는 테이블은 같다**
- 객체와 테이블을 아주 세밀하게 매핑하는 것이 가능
- 잘 설계한 ORM 애플리케이션은 매핑한 테이블의 수보다 클래스의 수가 더 많음

<br>

### 2.5 임베디드 타입과 연관관계

![스크린샷 2022-04-30 오후 2 21 51](https://user-images.githubusercontent.com/79130276/166092977-6db22601-e71e-456f-80d3-8465f59b4710.png)

embeddable 안에 엔티티 정의 가능하다

Address.java

```java
package hellojpa.domain.example;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String city;
    private String street;
    @Column(name = "ZIPCODE")
    private String zipcode;

    private Member member;
}
```

<br>

### 2.6 @AttributeOverride: 속성 재정의

- 한 엔티티에서 같은 값 타입을 사용하면?
- 컬럼 명이 중복됨
- @AttributeOverrides, @AttributeOverride를 사용해서 컬럼명 속성을 재정의

[예시] Address 를 두군데서 사용하고 싶을 때

Member.java

```java
@Embedded
private Address homeAddress;
    
@Embedded
@AttributeOverrides({
        @AttributeOverride(name = "city", column = @Column(name = "work_city")),
        @AttributeOverride(name = "street", column = @Column(name = "work_street")),
        @AttributeOverride(name = "zipcode", column = @Column(name = "work_zipcode"))
})
private Address workAddress;
private Address workAddress;
```

<br>

### 2.7 임베디드 타입과 null

- 임베디드 타입의 값이 null이면 매핑한 컬럼 값은 모두 null

```java
@Embedded
private Period workPeriod = null;

// Period 에 있는 컬럼들도 null 로 초기화됨
```

<br>

## 3. 값 타입과 불변 객체

값 타입은 복잡한 객체 세상을 조금이라도 단순화하려고 만든 개념이다. 따라서, 값 타입은 단순하고 안전하게 다룰 수 있어야 한다

<br>

### 3.1 값 타입 공유 참조

- 임베디드 타입 같은 값 타입을 여러 엔티티에서 공유하면 위험함
- 부작용(side effect) 발생

![스크린샷 2022-05-01 오후 6 12 46](https://user-images.githubusercontent.com/79130276/166142572-59b3c74d-7e45-48c3-b932-d3914c11a477.png)

JpaMain.java

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

member에 대한 주소값을 변경하려고 했지만 실제론 member2에 있는 주소값까지 변경이 된다

이런 버그는 잡기 매우 힘들다

<br>

### 3.2 값 타입 복사

- 값 타입의 실제 인스턴스인 값을 공유하는 것은 위험
- 대신 값(인스턴스)를 복사해서 사용

![스크린샷 2022-05-01 오후 6 13 01](https://user-images.githubusercontent.com/79130276/166142571-e5321ffc-8217-400c-b032-9b0d3a43ea38.png)

JpaMain.java

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

<br>

### 3.3 객체 타입의 한계

- 항상 값을 복사해서 사용하면 공유 참조로 인해 발생하는 부작용을 피할 수 있다.
- 문제는 임베디드 타입처럼 **직접 정의한 값 타입은 자바의 기본 타입이 아니라 객체 타입**이다
- 자바 기본 타입에 값을 대입하면 값을 복사한다
- **객체 타입은 참조 값을 직접 대입하는 것을 막을 방법이 없다**
- **객체의 공유 참조는 피할 수 없다**

![스크린샷 2022-05-01 오후 6 15 05](https://user-images.githubusercontent.com/79130276/166142568-8928ea35-c33b-4802-a991-c846a5d5ae53.png)

<br>

### 3.4 불변 객체

- 객체 타입을 수정할 수 없게 만들면 **부작용을 원천 차단**
- **값 타입은 불변 객체(immutable object)로 설계해야 함**
- **불변 객체: 생성 시점 이후 절대 값을 변경할 수 없는 객체**
- 생성자로만 값을 설정하고 수정자(Setter)를 만들지 않으면 됨
- 참고: Integer, String은 자바가 제공하는 대표적인 불변 객체
- 즉, setter를 없애거나 setter를 public → private로 만들기

<br>

불변이라는 작은 제약으로 부작용이라는 큰 재앙을 막을 수 있다

<br>

## 4. 값 타입의 비교

- 값 타입: 인스턴스가 달라도 그 안에 값이 같으면 같은 것으로 봐야 함
    
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
    
- **동일성(identity) 비교**: 인스턴스의 참조값을 비교, == 사용
- **동등성(equivalence) 비교**: 인스턴스의 값을 비교, equals() 사용
- 값 타입은 a.equals(b)를 사용해서 동등성 비교를 해야 함
- 값 타입의 equals() 메소드를 적절하게 재정의(주로 모든 필드 사용)

<br>

## 5. 값 타입 컬렉션

- 값 타입을 하나 이상 저장할 때 사용
- @ElementCollection, @CollectionTable 사용
- 데이터베이스는 컬렉션을 같은 테이블에 저장할 수 없다.
- 컬렉션을 저장하기 위한 별도의 테이블이 필요함

![Untitled1](https://user-images.githubusercontent.com/79130276/166185011-9ef125d9-9d9e-4d85-977e-3fad7f19f68b.png)

**Member.java**

```java
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
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

**JpaMain.java**

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

**결과**

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

<br>

### 5.1 값 타입 컬렉션 사용

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

<br>

### 5.2 값 타입 컬렉션의 제약사항

- 값 타입은 엔티티와 다르게 식별자 개념이 없다.
- 값은 변경하면 추적이 어렵다.
- 값 타입 컬렉션에 변경 사항이 발생하면, 주인 엔티티와 연관된 모든 데이터를 삭제하고, 값 타입 컬렉션에 있는 현재 값을 모두 다시 저장한다.
- 값 타입 컬렉션을 매핑하는 테이블은 모든 컬럼을 묶어서 기본키를 구성해야 함: **null 입력X, 중복 저장X**

<br>

### 5.3 값 타입 컬렉션 대안

- 실무에서는 상황에 따라 **값 타입 컬렉션 대신에 일대다 관계를 고려**
- 일대다 관계를 위한 엔티티를 만들고, 여기에서 값 타입을 사용
- 영속성 전이(Cascade) + 고아 객체 제거를 사용해서 값 타입 컬렉션 처럼 사용
- EX) AddressEntity

<br>

**[전] 값 타입 컬렉션**

Member.java

```java
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

Address.java

```java
package jpabook.jpashop.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import java.util.Objects;

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

<br>

**[후] 일대다로 변경 (실무에서 많이 사용)**

Member.java

```java
package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

Address.java

```java
package jpabook.jpashop.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

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

<br>

### 5.4 정리

- 엔티티 타입의 특징
    - 식별자O
    - 생명 주기 관리
    - 공유
- 값 타입의 특징
    - 식별자X
    - 생명 주기를 엔티티에 의존
    - 공유하지 않는 것이 안전(복사해서 사용)
    - 불변 객체로 만드는 것이 안전
    
<br>

값 타입은 정말 값 타입이라 판단될 때만 사용

엔티티와 값 타입을 혼동해서 엔티티를 값 타입으로 만들면 안됨

식별자가 필요하고, 지속해서 값을 추적, 변경해야 한다면 그것은 값 타입이 아닌 엔티티

<br>

## 6. 실전 예제 - 값 타입 매핑

값 타입 만들때

1. @Embeddable 정의
2. @Getter 설정
3. Setter 는 정의하지 않거나 private 로 정의
4. equals()와 hashCode() 정의 (Use getters during code generation에 체크, 프록시로 접근할 때)

```java
package jpabook.jpashop2.domain;

import lombok.Getter;

import javax.persistence.Embeddable;
import java.util.Objects;

@Embeddable
@Getter
public class Address {

    private String city;
    private String street;
    private String zipcode;

    private void setCity(String city) {
        this.city = city;
    }

    private void setStreet(String street) {
        this.street = street;
    }

    private void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Address address = (Address) o;
        return Objects.equals(getCity(), address.getCity()) &&
                Objects.equals(getStreet(), address.getStreet()) &&
                Objects.equals(getZipcode(), address.getZipcode());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getCity(), getStreet(), getZipcode());
    }
}
```

<br>

**[참고] 값 타입 만들때 장점**

- validation rule
- 비즈니스 로직

```java
@Embeddable
@Getter
public class Address {

    @Column(length = 10)
    private String city;
    @Column(length = 20)
    private String street;
    @Column(length = 5)
    private String zipcode;

    // 비즈니스 로직
    private String fullAddress() {
        return getCity() + " " + getStreet() + " " + getZipcode();
    }

...

}
```