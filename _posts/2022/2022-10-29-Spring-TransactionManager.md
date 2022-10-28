---
title: "트랜잭션 추상화"
last_modified_at: 2022-10-29T01:00:00
categories:
  - Spring
tags:
  - Spring
  - DB
toc: true
toc_label: "Index"
toc_sticky: true
---

## 트랜잭션 추상화

트랜잭션을 사용하는 코드는 데이터 접근 기술(JDBC, JPA 등)마다 다르다. 따라서 데이터 접근 기술이 변경되면 서비스 코드도 변경해야 하므로 OCP 원칙을 위반하고 유지보수 측면에서도 좋지 않다. 이 문제를 해결하기 위해 `트랜잭션 기능을 추상화`한다.

**트랜잭션 추상화 인터페이스**

트랜잭션은 단순하다. 트랜잭션을 시작하고, 비즈니스 로직의 수행이 끝나면 커밋, 롤백하면 된다.

```java
public interface TxManager {
    begin();
    commit();
    rollback();
}
```

트랜잭션을 추상화하면 서비스는 특정 트랜잭션 기술에 직접 의존하는 것이 아닌 추상화된 인터페이스에 의존하게 된다.(DI) 따라서, `OCP 원칙`을 지키게 된다. 트랜잭션을 사용하는 서비스 코드를 전혀 변경하지 않고 트랜잭션 기술을 변경할 수 있다.

![1](https://user-images.githubusercontent.com/79130276/198681134-dea09de3-f4c8-42d9-b529-0b40dc5b4d12.png)

### 스프링의 트랜잭션 추상화

스프링은 트랜잭션 추상화 기술을 제공한다. 스프링 트랜잭션 추상화의 핵심은 `Platform TransactionManager 인터페이스`이다.

PlatformTransactionManager 인터페이스와 구현체를 `트랜잭션 매니저`라고도 한다.

**PlatformTransactionManager 인터페이스**

```java
package org.springframework.transaction;

public interface PlatformTransactionManager extends TransactionManager {
    TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
    void commit(TransactionStatus status) throws TransactionException;
    void rollback(TransactionStatus status) throws TransactionException;
}
```