---
title: "트랜잭션 매니저(추상화, 동기화)"
# last_modified_at: 2022-10-29T01:00:00
last_modified_at: 2022-10-29T18:20:00
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

스프링은 트랜잭션 추상화 기술을 `트랜잭션 매니저` 객체를 통해 제공한다. 스프링 트랜잭션 추상화의 핵심은 `PlatformTransactionManager 인터페이스`이다.

**PlatformTransactionManager 인터페이스**

```java
package org.springframework.transaction;

public interface PlatformTransactionManager extends TransactionManager {
    // 트랜잭션 시작
    TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
    // 트랜잭션 커밋
    void commit(TransactionStatus status) throws TransactionException;
    // 트랜잭션 롤백
    void rollback(TransactionStatus status) throws TransactionException;
}
```

## 트랜잭션 동기화

트랜잭션 매니저의 역할은 크게 2가지 이다. 

- 트랜잭션 추상화 (위에서 언급)
- 리소스 동기화

### 리소스 동기화

트랜잭션을 유지하려면 트랜잭션의 시작부터 끝까지 **같은 데이터베이스 커넥션을 유지**해야 한다.

같은 커넥션을 동기화(맞추어 사용)하기 위해 이전에는 파라미터로 커넥션을 전달하는 방법을 사용했으나 이 방법은 코드가 지저분하고 커넥션을 넘기는 메서드와 넘기지 않는 메서드를 중복해서 만들어야 하는 등 여러가지 단점들이 많다.

이러한 문제를 해결하기 위해 스프링은 `트랜잭션 동기화 매니저`를 제공한다. 트랜잭션 동기화 매니저는 `쓰레드 로컬(ThreadLocal)`을 사용해서 커넥션을 동기화 해준다. 그렇기 때문에 멀티 쓰레드 상황에서도 안전하게 커넥션을 동기화 할 수 있다. 따라서, 커넥션이 필요하면 트랜잭션 동기화 매니저를 통해 커넥션을 획득하면 된다.

> **참고** 쓰레드 로컬
<br>
여러개의 쓰레드가 존재할 때, 해당 쓰레드만 접근할 수 있는 특별한 저장소를 의미한다. ThreadLocal 클래스는 오직 한 쓰레드에 의해 읽고/쓰여질 수 있는 변수를 생성한다.
> 

### 트랜잭션 매니저 동작 흐름

![1](https://user-images.githubusercontent.com/79130276/198823147-f9950097-07fb-47f2-9e56-57afa8da7248.png)

클라이언트의 요청으로 서비스 로직을 실행한다.

1. 서비스 계층에서 transactionManager.getTransaction()을 호출해서 트랜잭션을 시작한다.
2. 트랜잭션을 시작하려면 먼저 데이터베이스 커넥션이 필요하다. 트랜잭션 매니저는 내부에서 데이터소스를 사용해서 **커넥션을 생성**한다.
3. 커넥션을 **수동 커밋 모드**로 변경해서 데이터베이스 트랜잭션을 시작한다.
4. 커넥션을 **트랜잭션 동기화 매니저**에 보관한다.
5. 트랜잭션 동기화 매니저는 **쓰레드 로컬**에 커넥션을 보관한다. 이제 멀티 쓰레드 환경에 안전하게 커넥션을 보관할 수 있다.
6. 서비스는 비즈니스 로직을 실행하면서 리포지토리의 메서드들을 호출한다. 이때 커넥션을 파라미터로 전달하지 않는다.
7. 리포지토리 메서드들은 **트랜잭션이 시작된 커넥션**이 필요하다. 리포지토리는 DataSourceUtils.getConnection()을 사용해서 **트랜잭션 동기화 매니저에 보관된 커넥션을 사용**한다. 이 과정을 통해서 자연스럽게 같은 커넥션을 사용하고, 트랜잭션도 유지된다.
8. 획득한 커넥션을 사용해서 SQL을 데이터베이스에 전달해서 실행한다.


### 트랜잭션 매니저를 적용한 코드

```java
/**
 * MemberRepositoryV3
 */
// 커넥션을 얻을 때
DataSourceUtils.getConnection(dataSource);

// 커넥션을 닫을 때, 유지할 때
DataSourceUtils.releaseConnection(con, dataSource);
```

트랜잭션 동기화를 사용하려면 `DataSourceUtils`를 사용해야 한다.

DataSourceUtils.getConnection()은 트랜잭션 동기화 매니저가 관리하는 커넥션이 있으면 해당 커넥션을 반환하고 없으면 새로운 커넥션을 생성해서 반환한다.

커넥션을 con.close()를 사용해서 직접 닫아버리면 커넥션이 유지되지 않는 문제가 발생한다. 따라서, DataSourceUtils.releaseConnection()를 사용한다. DataSourceUtils.releaseConnection()을 사용하면 트랜잭션을 사용하기 위해 동기화된 커넥션은 커넥션을 닫지 않고 그대로 유지하며 트랜잭션 동기화 매니저가 관리하는 커넥션이 없는 경우 해당 커넥션을 닫는다.

```java
@Slf4j
@RequiredArgsConstructor
public class MemberServiceV3_1 {

    private final PlatformTransactionManager transactionManager;
    private final MemberRepositoryV3 memberRepository;

    public void accountTransfer(String fromId, String toId, int money) {
        // 트랜잭션 시작, 트랜잭션 상태값을 반환
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        try {
            // 비즈니스 로직
            bizLogic(fromId, toId, money);
            transactionManager.commit(status); // 성공 시 commit
        } catch (Exception e) {
            transactionManager.rollback(status); //실패 시 rollback
            throw new IllegalStateException(e);
        }
        // transactionManager가 commit, rollback 할 때 close 해주므로 따로 close 해줄 필요 없다.
    }

    ...
}
```

`PlatformTransactionManager` 트랜잭션 매니저를 주입받는다. PlatformTransactionManager은 인터페이스이기 때문에 JDBC 기술에서 JPA로 변경해도 문제가 없다. new DefaultTransactionDefinition()은 트랜잭션과 관련된 옵션을 지정할 수 있다.

```java
@BeforeEach
void before() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);
    // PlatformTransactionManager의 구현체
    DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(dataSource);
    postRepository = new PostRepositoryV3(dataSource);
    // PlatformTransactionManager에 transactionManager 주입
    postService = new PostServiceV3_1(transactionManager, postRepository);
}
```