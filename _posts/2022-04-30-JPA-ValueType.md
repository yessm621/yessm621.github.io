---
title:  "값 타입"
last_modified_at: 2022-04-30T14:35:00
categories: 
  - JPA
tags:
  - JPA
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

# 값 타입

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