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