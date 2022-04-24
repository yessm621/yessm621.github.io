---
title:  "다양한 연관관계 매핑"
last_modified_at: 2022-04-16T17:30:00
categories: 
  - JPA
tags:
  - JPA
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

# 다양한 연관관계 매핑

## 1. 연관관계 매핑시 고려사항 3가지

### 1.1 다중성

- 다대일 @ManyToOne
- 일대다 @OneToMany
- 일대일 @OneToOne
- 다대다 @ManyToMany (실무에서 쓰면 안됨)

<br>

### 1.2 단방향, 양방향

- 테이블
    - 외래 키 하나로 양쪽 조인 가능
    - 사실 방향이라는 개념이 없음
- 객체
    - 참조용 필드가 있는 쪽으로만 참조 가능
    - 한쪽만 참조하면 단방향
    - 양쪽이 서로 참조하면 양방향
        
        → 양방향은 단방향이 두개인 것

<br>    

### 1.3 연관관계의 주인

- 테이블은 **외래키 하나**로 두 테이블이 연관관계를 맺음
- 객체 양방향 관계는 A → B, B → A 처럼 **참조가 2군데**
- 객체 양방향 관계는 참조가 2군데 있음. 둘중 테이블의 외래 키를 관리할 곳을 지정해야함
- 연관관계의 주인: 외래 키를 관리하는 참조
- 주인의 반대편: 외래 키에 영향을 주지 않음, 단순 조회만

<br>

## 2.다대일 [N:1]

다대일 다 쪽에 외래키가 존재

<br>

### 2.1 다대일 단방향

- 가장 많이 사용하는 연관관계
- 다대일의 반대는 일대다

![1](https://user-images.githubusercontent.com/79130276/163668033-62cad913-9484-4c59-af8f-2865ce8932d3.png)

<br>

### 2.2 다대일 양방향

- 외래키가 있는 쪽이 연관관계의 주인
- 양쪽을 서로 참조하도록 개발

![2](https://user-images.githubusercontent.com/79130276/163668032-2528680c-4384-44d6-a870-fcbc373ea122.png)

<br>

## 3.일대다 [1:N] : 사용 많이 안함

### 3.1 일대다 단방향

![3](https://user-images.githubusercontent.com/79130276/163668031-4e2979ed-4aec-4008-a023-46318fb25d26.png)

- 일대다 단방향은 일대다(1:N)에서 **일(1)이 연관관계의 주인**
- 테이블 일대다 관계는 **항상 다(N)쪽에 외래 키가 있음**
- 객체와 테이블의 차이 때문에 반대편 테이블의 외래 키를 관리하는 특이한 구조
- @JoinColumn을 꼭 사용해야 함. 그렇지 않으면 조인 테이블 방식을 사용함 (중간에 테이블을 하나 추가함)

<br>

### 3.2 일대다 단방향 매칭의 단점

- 엔티티가 관리하는 외래 키가 다른 테이블에 있음
- 연관관계 관리를 위해 추가로 UPDATE SQL 실행
- 일대다 단방향 매핑보다는 다대일 양방향 매핑을 사용하자

<br>

### 3.3 일대다 양방향

- 이런 매핑은 공식적으로 존재X
- @JoinColumn(insertable=false, updatable=false)
- 읽기 전용 필드를 사용해서 양방향 처럼 사용하는 방법
- 다대일 양방향을 사용하자

<br>

## 4.일대일 [1:1]

- 일대일 관계는 그 반대도 일대일
- 주 테이블이나 대상 테이블 중에 외래 키 선택 가능
    - 주 테이블에 외래 키
    - 대상 테이블에 외래 키
- 외래 키에 데이터베이스 유니크(UNI) 제약조건 추가

<br>

### 4.1 일대일 단방향

- 다대일 단방향 매핑과 유사

<br>

### 4.2 일대일 양방향

- 다대일 양방향 매핑처럼 외래 키가 있는 곳이 연관관계의 주인
- 반대편은 mappedBy 적용
- 주 테이블에 외래 키
    - 주 객체가 대상 객체의 참조를 가지는 것 처럼 주 테이블에 외래 키를 두고 대상 테이블을 찾음
    - 객체지향 개발자 선호
    - JPA 매핑 편리
    - 장점: 주 테이블만 조회해도 대상 테이블에 데이터가 있는지 확인 가능
    - 단점: 값이 없으면 외래 키에 null 허용
- 대상 테이블에 외래 키
    - 대상 테이블에 외래 키가 존재
    - 전통적인 데이터베이스 개발자 선호
    - 장점: 주 테이블과 대상 테이블을 일대일에서 일대다 관계로 변경할 때 테이블 구조 유지
    - 단점: 프록시 기능의 한계로 **지연 로딩으로 설정해도 항상 즉시 로딩됨**(프록시는 뒤에서 설명)

<br>

## 5. 다대다 [N:M]

- 관계형 데이터베이스는 정규화된 테이블 2개로 다대다 관계를 표현할 수 없음
- 연결 테이블을 추가해서 일대다, 다대일 관계로 풀어내야 함
- 객체는  컬랙션을 사용해서 객체 2개로 다대다 관계 가능

![4](https://user-images.githubusercontent.com/79130276/163668030-37cd6b45-dd52-4280-a574-39c3c5ebdea9.png)

- @ManyToMany 사용
- @JoinTable로 연결 테이블 지정
- 다대다 매핑: 단방향, 양방향 가능

<br>

### 5.1 다대다 단방향

Member.java

```java
@ManyToMany
@JoinTable(name = "MEMBER_PRODUCT")
private List<Product> products = new ArrayList<>();
```

<br>

### 5.2 다대다 양방향

Product.java

```java
@ManyToMany(mappedBy = "products")
private List<Member> members = new ArrayList<>();
```

<br>

### 5.3 다대다 매핑의 한계

- 편리해 보이지만 실무에서 사용X
- 연결 테이블이 단순히 연결만 하고 끝나지 않음
- 주문시간, 수량 같은 데이터가 들어올 수 있음

![5](https://user-images.githubusercontent.com/79130276/163668029-f652d97e-eb16-462b-9dc5-8cc458edc408.png)

참고) PK는 따로 작성하는게 좋다. 위의 테이블 설계도 처럼 FK 두개를 PK로 설정하면 제약조건을 설정할 땐 좋은데 운영을 하면서 보면 유연성이 떨어져 쉽지 않다..

<br>

### 5.4 다대다 한계 극복

- 연결 테이블용 엔티티 추가(`연결 테이블은 엔티티로 승격`)
- @ManyToMany → @OneToMany, @ManyToOne

![6](https://user-images.githubusercontent.com/79130276/163668025-13e5b707-9981-4a65-b7cb-f6a8675820c2.png)

Member.java

```java
@OneToMany(mappedBy = "member")
private List<MemberProduct> memberProducts = new ArrayList<>();
```

MemberProduct.java

```java
@ManyToOne
@JoinColumn(name = "MEMBER_ID")
private Member member;

@ManyToOne
@JoinColumn(name = "PROUDCT_ID")
private Product product;
```

Product.java

```java
@OneToMany(mappedBy = "product")
private List<MemberProduct> memberProducts = new ArrayList<>();
```

<br>

### 5.5 실전 예제 3 - 다양한 연관관계 매핑

**N:M 관계는 1:N, N:1 로**

- 테이블의 N:M 관계는 중간 테이블을 이용해서 1:N, N:1
- 실전에서는 중간 테이블이 단순하지 않다.
- @ManyToMany 는 제약: 필드 추가X, 엔티티 테이블 불일치
- 실전에서는 `@ManyToMany 사용X`