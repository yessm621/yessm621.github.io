---
layout: post
title: "트랜잭션 AOP"
date: 2022-10-31 13:50:00
categories: [Spring]
tags:
  - Spring
  - DB
author: "유자"
---

## 트랜잭션 AOP

트랜잭션을 처리하는 코드의 중복과 순수 자바코드를 삭제 하기 위해 트랜잭션 추상화, 트랜잭션 템플릿을 도입했다. 트랜잭션 템플릿 덕분에 트랜잭션을 처리하는 반복 코드는 해결할 수 있었으나, 서비스 계층에 순수한 비즈니스 로직만 남긴다는 목표는 아직 달성하지 못했다. 이럴 때 `스프링 AOP`를 통해 `프록시`를 도입하면 문제를 깔끔하게 해결할 수 있다.

> **참고**
<br>
스프링 AOP와 프록시에 대해서는 @Transactional을 사용하면 스프링이 AOP를 사용해서 트랜잭션을 편리하게 처리해준다 정도로 이해하자
> 

### 프록시를 통한 문제 해결

프록시를 도입하기 전에는 서비스 로직에서 트랜잭션을 시작하지만, `프록시`를 사용하면 트랜잭션을 처리하는 객체와 비즈니스 로직을 처리하는 서비스 객체를 `분리`할 수 있다. 트랜잭션 프록시가 트랜잭션 처리 로직을 모두 가져가고 트랜잭션을 시작한 후에 실제 서비스를 대신 호출한다. 트랜잭션 프록시 덕분에 서비스 계층에서는 **순수한 비즈니스 로직**만 남길 수 있다.

![1](https://user-images.githubusercontent.com/79130276/198932686-44ee6e8a-aebc-44ea-a0b2-8d83bace2f55.png)

트랜잭션을 처리하는 프록시 코드를 스프링이 만들어준다. try, catch 같은 코드를 자동으로 만들어주고 자동으로 빈으로 등록해준다. 트랜잭션 프록시에서 실제 비즈니스 서비스를 호출하고 응답이 왔을 때 성공했으면 commit, 언체크(런타임) 예외가 올 경우 rollback을 한다.

**트랜잭션 프록시 적용한 서비스 코드 예시**

```java
public class Service {
    public void logic() {
        //트랜잭션 관련 코드 제거, 순수 비즈니스 로직만 남음
        bizLogic(fromId, toId, money);
    }
}
```

### 스프링 트랜잭션 AOP

스프링 AOP를 직접 사용해서 트랜잭션을 처리해도 되지만 스프링은 트랜잭션 AOP를 처리하기 위한 모든 기능을 제공한다. 트랜잭션 처리가 필요한 곳에 `@Transactional` 애노테이션를 붙여주면 트랜잭션 프록시를 적용해준다.

```java
import org.springframework.transaction.annotation.Transactional

@Transactional
public void accountTransfer(String fromId, String toId, int money) throws SQLException {
    bizLogic(fromId, toId, money);
}
```

이제 순수한 비즈니스 로직만 남고 트랜잭션 관련 코드는 모두 제거되었다.

@Transactional은 메서드에 붙여도 되고, 클래스에 붙여도 된다. 클래스에 붙이면 외부에서 호출 가능한 public 메서드가 AOP 적용 대상이 된다.

이후 서비스 코드에서 service.getClass()를 출력하면 EnhancerBySpringCGLIB.. 라는 부분을 통해 **프록시(CGLIB)**가 적용된 것을 확인할 수 있다.

![2](https://user-images.githubusercontent.com/79130276/198932688-a65210f3-c442-4cd9-8dbb-ac2e85dc935e.png)

> **참고**
<br>
스프링 AOP를 적용하려면 어드바이저, 포인트컷, 어드바이스가 필요함. 스프링은 트랜잭션 AOP 처리를 위해 다음 클래스를 제공. 스프링 부트를 사용하면 해당 빈들은 스프링 컨테이너에 자동으로 등록됨.
- 어드바이저: BeanFactoryTransactionAttributeSourceAdvisor
- 포인트컷: TransactionAttributeSourcePointcut
- 어드바이스: TransactionInterceptor
> 

### 선언적 트랜잭션 관리 vs 프로그래밍 방식 트랜잭션 관리

선언적 트랜잭션 관리는 @Transactional 애노테이션을 선언해서 트랜잭션을 적용하는 것을 의미하며, 프로그래밍 방식 트랜잭션 관리는 트랜잭션 관련 코드를 직접 작성하는 것을 말한다.

선언적 트랜잭션 관리가 프로그래밍 방식에 비해 간결하고 실용적이기 때문에 실무에서는 대부분 **선언적 트랜잭션 관리를 사용**한다.