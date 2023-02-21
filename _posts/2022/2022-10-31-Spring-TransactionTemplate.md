---
layout: post
title: "트랜잭션 템플릿"
date: 2022-10-31 13:50:00
categories: [Spring]
tags:
  - Spring
  - DB
author: "유자"
---

## 트랜잭션 템플릿

트랜잭션 템플릿을 사용하면 JDBC의 같은 패턴이 **반복되는 것을 제거**할 수 있다.

트랜잭션을 시작하려면 try, catch, finally를 포함한 성공시 커밋, 실패시 롤백 코드가 반복된다.

이런 형태는 각각의 서비스에서 반복되며 달라지는 부분은 비즈니스 로직 뿐이다. 이때 `템플릿 콜백 패턴`을 사용하면 **중복을 제거**할 수 있다.

**템플릿 콜백 패턴**을 적용하려면 템플릿을 제공하는 클래스를 작성해야 하는데 스프링은 `TransactionTemplate`라는 템플릿 클래스를 제공한다.

```java
public class TransactionTemplate {
    private PlatformTransactionManager transactionManager;
    // 응답값이 있을 때 사용
    public <T> T execute(TransactionCallback<T> action){..}
    // 응답값이 없을 때 사용
    void executeWithoutResult(Consumer<TransactionStatus> action){..}
}
```

```java
/**
 * 트랜잭션 - 트랜잭션 템플릿
 */
@Slf4j
public class MemberServiceV3_2 {

    //    private final PlatformTransactionManager transactionManager;
    private final TransactionTemplate txTemplate;
    private final MemberRepositoryV3 memberRepository;

    public MemberServiceV3_2(PlatformTransactionManager transactionManager, MemberRepositoryV3 memberRepository) {
        this.txTemplate = new TransactionTemplate(transactionManager);
        this.memberRepository = memberRepository;
    }

    public void accountTransfer(String fromId, String toId, int money) {
        txTemplate.executeWithoutResult((status) -> {
            // 비즈니스 로직
            try {
                bizLogic(fromId, toId, money);
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }
        });
    }

    ...
}
```

트랜잭션 템플릿 덕분에 트랜잭션을 시작하고 커밋하거나 롤백하는 코드가 모두 제거되었다. 트랜잭션 템플릿은 비즈니스 로직이 정상 수행되면 커밋하고 언체크 예외가 발생하면 롤백한다. 그 외의 경우엔 커밋한다. SQLException 체크 예외는 언체크 예외로 바꾸어 던진다.

`트랜잭션 템플릿`을 통해 **JDBC 반복되는 코드를 제거**할 수 있었다. 그러나 아직도 서비스 계층에서 트랜잭션을 사용하기 위한 코드가 존재한다. 비즈니스 로직은 핵심 기능이고 트랜잭션은 부가 기능이다. 이렇게 두 관심사를 하나의 클래스에서 처리하면 유지보수가 어려워진다. 서비스 로직은 핵심 비즈니스 로직만 있어야 한다. 이 문제를 트랜잭션 AOP를 통해 해결할 수 있다.