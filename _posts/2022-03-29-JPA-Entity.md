---
title:  "엔티티 매핑"
last_modified_at: 2022-03-29T16:50:00
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


### 엔티티 매핑 소개

- 객체와 테이블 매핑: @Entity, @Table
- 필드와 컬럼 매핑: @Column
- 기본 키 매핑: @Id
- 연관관계 매핑: @ManyToOne, @JoinColumn

<br>

## 1. 객체와 테이블 매핑

### 1.1 @Entity

- @Entity가 붙은 클래스는 JPA가 관리, 엔티티라 함
- JPA를 사용해서 테이블과 매핑할 클래스는 **@Entity** 필수
- 주의
    - **기본 생성자 필수**
    - final 클래스, enum, interface, inner 클래스 사용 x
    - 저장할 필드에 final 사용 x

<br>

### 1.2 @Entity 속성 정리

- name
    - JPA에서 사용할 엔티티 이름을 지정
    - 기본값: 클래스 이름을 그대로 사용 (가급적 기본값 사용)
- @Table: 엔티티와 매핑할 테이블 지정

<br>

## 2. 데이터베이스 스키마 자동 생성

- DDL을 애플리케이션 실행 시점에 자동 생성
    - 운영 시에는 이렇게 사용하면 안되고 개발 시에 이점이 있다.
- 테이블 중심 → 객체 중심
- 데이터베이스 방언을 활용해서 데이터베이스에 맞는 적절한 DDL 생성
- 이렇게 생성된 DDL은 개발 장비에서만 사용
- 생성된 DDL은 운영서버에서는 사용하지 않거나, 적절히 다듬은 후 사용

<br>

### 2.1 속성

**hibernate.hbm2ddl.auto**

- create: 기존 테이블 삭제 후 다시 생성 (DROP+CREATE)
- create-drop: create와 같으나 종료시점에 테이블 DROP
- update: alter, 변경분만 반영, 컬럼 삭제는 안됨 (운영 DB에는 사용하면 안됨)
- validate: 엔티티와 테이블이 정상 매핑되었는지만 확인
- none: 사용하지 않음

<br>

### 2.2 주의

- **운영 장비에는 절대 create, create-drop, update 사용하면 안됨**
- 개발 초기 단계는 create 또는 update
- (여러명이 쓰는)테스트 서버는 update 또는 validate (테스트 서버도 update는 가급적 사용하지 말자)
- 스테이징과 운영 서버는 validate 또는 none

<br>

> update를 운영서버에서 사용하면 테이블 락이 걸림 (서비스가 몇 분 동안 중단될 수도 있다)
> 

<br>

### 2.3 DDL 생성 기능

- 제약조건 추가: 회원 이름은 필수, 10자 초과 X
    - @Column(nullable = false, length = 10)
- 유니크 제약조건 추가
- DDL 생성 기능은 DDL을 자동 생성할 때만 사용되고 JPA의 실행 로직에는 영향을 주지 않음

<br>

## 3. 필드와 컬럼 매핑

### 3.1 매핑 어노테이션 정리

**hibernate.hbm2ddl.auto**

- @Column: 컬럼 매핑
- @Temporal: 날짜 타입 매핑
- @Enumerated: enum 타입 매핑
- @Lob: BLOB, CLOB 매핑
- @Transient:특정 필드를 컬럼에 매핑하지 않음 (매핑 무시)

<br>

### 3.2 @Column

- name: 필드와 매핑할 테이블의 컬럼 이름
- insertable, updatable: 등록, 변경 가능 여부
- nullable(DDL): null 값의 허용 여부를 설정한다. false로 설정하면 DDL 생성 시에
not null 제약조건이 붙는다.
- unique(DDL): @Table의 uniqueConstraints와 같지만 한 컬럼에 간단히 유니크 제
약조건을 걸 때 사용한다.
- columnDefinition(DDL): 데이터베이스 컬럼 정보를 직접 줄 수 있다.
    - ex) varchar(100) default ‘EMPTY'
    필드의 자바 타입과 방언 정보를 사용해서 적절한 컬럼 타입
- length(DDL): 문자 길이 제약조건, String 타입에만 사용한다.
- precision, scale(DDL): BigDecimal 타입에서 사용(BigInteger도 사용 가능)
    - precision은 소수점을 포함한 전체 자릿수를, scale은 소수의 자릿수다. 참고로 double, float 타입에는 적용되지 않는다. 아주 큰 숫자나 정밀한 소수를 다루어야 할 때만 사용한다.

<br>

### 3.3 @Enumerated

자바 enum 타입을 매핑할 때 사용

**주의! ORDINAL 사용 X**

- value
    - EnumType.ORDINAL: enum 순서를 데이터베이스에 저장
    - EnumType.STRING: enum 이름을 데이터베이스에 저장

<br>

### 3.4 @Temporal

날짜 타입(java.util.Date, java.util.Calendar)을 매핑할 때 사용

참고: LocalDate, LocalDateTime을 사용할 때는 생략 가능(최신 하이버네이트 지원)

- value
    - TemporalType.DATE: 날짜, 데이터베이스 date 타입과 매핑 (예: 2013–10–11)
    - TemporalType.TIME: 시간, 데이터베이스 time 타입과 매핑 (예: 11:11:11)
    - TemporalType.TIMESTAMP: 날짜와 시간, 데이터베이스 timestamp 타입과 매핑 (예: 2013–10–11 11:11:11)

<br>

### 3.5 @Lob

데이터베이스 BLOB, CLOB 타입과 매핑

- @Lob에는 지정할 수 있는 속성이 없다.
- 매핑하는 필드 타입이 문자면 CLOB 매핑, 나머지는 BLOB 매핑
    - CLOB: String, char[], java.sql.CLOB
    - BLOB: byte[], java.sql.BLOB

<br>

### 3.6 @Transient

- 필드 매핑X
- 데이터베이스에 저장X, 조회X
- 주로 메모리 상에서만 임시로 어떤 값을 보관하고 싶을 때 사용

<br>

## 4. 기본 키 매핑

### 4.1 기본 키 매핑 어노테이션

- @Id
- @GeneratedValue

```java
@Id @GeneratedValue(strategy = GenerationType.AUTO)
private Long id;
```

<br>

### 4.2 기본 키 매핑 방법

- 직접 할당: @Id만 사용
- 자동 생성(@GeneratedValue)
    - IDENTITY: 데이터베이스에 위임, MYSQL
    - SEQUENCE: 데이터베이스 시퀀스 오브젝트 사용, ORACLE
        - @SequenceGenerator 필요
    - TABLE: 키 생성용 테이블 사용, 모든 DB에서 사용
        - @TableGenerator 필요
    - AUTO: 방언에 따라 자동 지정, 기본값

<br>

### 4.3 IDENTITY 전략 - 특징

기본 키 생성을 데이터베이스에 위임

- 주로 MySQL, PostgreSQL, SQL Server, DB2에서 사용
(예: MySQL의 AUTO_ INCREMENT)
- JPA는 보통 트랜잭션 커밋 시점에 INSERT SQL 실행
- AUTO_ INCREMENT는 데이터베이스에 INSERT SQL을 실행
한 이후에 ID 값을 알 수 있음
- IDENTITY 전략은 em.persist() 시점에 즉시 INSERT SQL 실행
하고 DB에서 식별자를 조회

<br>

### 4.4 SEQUENCE 전략 - 특징

- 데이터베이스 시퀀스는 유일한 값을 순서대로 생성하는 특별한 데이터베이스 오브젝트(예. 오라클 시퀀스)
- 오라클, PostgreSQL, DB2, H2 데이터베이스에서 사용

```java
@Entity
@SequenceGenerator(
	name = "MEMBER_SEQ_GENERATOR",
	sequenceName = "MEMBER_SEQ", //매핑할 데이터베이스 시퀀스 이름
initialValue = 1, allocationSize = 1)
public class Member {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE,
					generator = "MEMBER_SEQ_GENERATOR")
	private Long id;
```

<br>

### 4.5 권장하는 식별자 전략

- 기본 키 제약 조건: null 아님, 유일, 변하면 안된다.
- 미래까지 이 조건을 만족하는 자연키는 찾기 어렵다. 대리키(대체키)를 사용하자
- 권장: Long형 + 대체키 + 키 생성전략 사용