---
title: "Transactional 이란"
last_modified_at: 2021-09-13T14:00:00
categories:
  - Spring
tags:
  - Java
  - Spring
  - DB
toc: true
toc_label: "Index"
toc_sticky: true
---

## 트랜잭션이란?

- 데이터베이스의 상태를 변경하는 작업
- 한번에 수행되어야 하는 연산들을 의미
- begin, commit 을 자동으로 수행
- 예외 발생 시  rollback 처리를 자동으로 수행

<br>

## 트랜잭션의 4가지 성질

- 원자성

    → 한 트랜잭션 내에서 실행한 작업들은 하나의 단위로 처리함. 즉, 모두 성공 또는 모두 실패

- 일관성

    → 일관성 있는 데이터베이스 상태를 유지

- 격리성

    → 동시에 실행되는 트랜잭션들이 서로 영향을 미치지 않도록 격리

- 영속성

    → 트랜잭션을 성공적으로 마치면 결과가 항상 저장되어야 함

<br>

## 트랜잭션 처리 방법

스프링에서는 어노테이션 방식으로 사용

@Transactional 을 메소드, 클래스, 인터페이스 위에 추가하여 사용 (선언적 트랜잭션)

적용된 범위에서는 트랜잭션 기능이 포함된 프록시 객체가 생성되어 자동으로 commit 혹은 rollback 을 진행 해준다.

```java
@Transactional
public class MemberService { }
```

<br>

## @Transactional 옵션

### 1. isolation

### 2. propagation

### 3. noRollbackFor (예외무시)

특정 예외 발생 시 Rollback 처리 하지 않음.

```java
@Transactional(noRollbackFor=Exception.class)
public void addMember(Member member) throws Exception { }
```

### 4. rollbackFor (예외추가)

특정 예외 발생 시 강제로 Rollback

```java
@Transactional(rollbackFor=Exception.class)
public void addMember(Member member) throws Exception { }
```

### 5. timeout (시간지정)

지정한 시간 내에 해당 메소드 수행이 완료되지 않을 경우 rollback 수행 (default=-1)

```java
@Transactional(timeout=10)
public void addMember(Member member) throws Exception { }
```

### 6. readOnly (읽기전용)

true 시 insert, update, delete 실행 시 예외 발생 (default=false)

```java
@Transactional(readonly=true)
public void addMember(Member member) throws Exception { }
```

<br>

## @Transactional 만 붙이면 롤백이 안되는 이유?

@Transactional 은 기본적으로 unchecked Exception, Error 만을 롤백한다

따라서, 모든 예외에 대해 롤백을 진행하고 싶을 경우 @Transactional(rollbackFor = Exception.class) 를 써야한다.
