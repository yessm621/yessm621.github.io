---
layout: post
title: "트랜잭션 AOP를 사용할 때 주의해야 할 점 (feat. 내부 호출)"
date: 2023-03-23 16:20:00
categories: [Spring]
tags:
  - Spring
  - DB
author: "유자"
---

<aside markdown="1">
✨ 매우 중요한 내용이다. 프록시 내부 호출 부분은 실무에서 많이 만나는 주제이고 이 주제에 대해 알고 있지 않거나 이해하지 못하면 많은 시간을 허비하게 된다.
</aside>

## 트랜잭션 AOP

`@Transactional`을 사용하면 **스프링의 트랜잭션 AOP가 적용**된다. 트랜잭션 AOP는 기본적으로 `프록시 방식`의 AOP를 사용한다.

**스프링 컨테이너에 트랜잭션 프록시 등록**

![1](https://user-images.githubusercontent.com/79130276/227131584-e3acf781-fe6a-4afa-a3a5-58b379a3d116.png)

앞서 배운 것처럼 @Transactional을 적용하면 프록시 객체가 요청을 먼저 받아서 트랜잭션을 처리하고 실제 객체를 호출해준다. 따라서, 트랜잭션을 적용하려면 프록시를 통해 대상 객체(Target)를 호출해야 한다. 이렇게 해야 **프록시에서 먼저 트랜잭션을 적용하고 이후에 대상 객체를 호출**하게 된다.

만약, 프록시를 거치지 않고 대상 객체를 직접 호출하게 되면 AOP가 적용되지 않고 트랜잭션도 적용되지 않는다.

## 내부 호출 시 발생하는 문제점

예제 코드를 통해 **내부 호출이 발생할 때 발생하는 문제점**에 대해 알아보겠다.

```java
@Slf4j
@SpringBootTest
public class InternalCallV1Test {

    @Autowired
    CallService callService;

    @Test
    void printProxy() {
        log.info("callService class={}", callService.getClass());
    }

    @Test
    void internalCall() {
        callService.internal();
    }

    @Test
    void externalCall() {
        callService.external();
    }

    @TestConfiguration
    static class InternalCallV1TestConfig {
        @Bean
        CallService callService() {
            return new CallService();
        }
    }

    static class CallService {

        public void external() {
            log.info("call external");
            printTxInfo();
            internal();
        }

        @Transactional
        public void internal() {
            log.info("call internal");
            printTxInfo();
        }

        private void printTxInfo() {
            boolean txActive = TransactionSynchronizationManager.isActualTransactionActive();
            log.info("tx active={}", txActive);
            boolean readOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
            log.info("tx readOnly={}", readOnly);
        }
    }
}
```

internalCall() 테스트 코드는 일반적인 흐름으로 트랜잭션이 적용되지만 externalCall() 테스트 코드는 트랜잭션이 적용되지 않는 문제가 발생한다. 두가지 모두 자세히 살펴보자.

### 일반적인 흐름

![2](https://user-images.githubusercontent.com/79130276/227131590-550dd290-474c-4cfd-a27a-e8de965276a8.png)

- external()은 트랜잭션이 없고 internal()은 @Transactional을 통해 트랜잭션을 적용했다.
- @Transactional이 있으면 트랜잭션 프록시 객체가 만들어진다. 그리고 callService 빈을 주입 받으면 트랜잭션 프록시 객체가 대신 주입된다.
- printProxy()를 실행하면 주입 받은 프록시 객체를 출력한다. (CGLIB)
- internalCall()을 실행하면 정상적으로 프록시 객체를 주입받아 트랜잭션을 적용한다.

여기까지는 일반적인 상황이다. 이 다음부터가 문제가 발생한다.

### 문제가 되는 부분 - 프록시와 내부 호출

externalCall()이 실행되는 흐름을 살펴보자.

![3](https://user-images.githubusercontent.com/79130276/227131595-5da30a06-c10a-44ec-bbc0-132dddc00dea.png)

1. 클라이언트인 테스트 코드는 callService.external()을 호출한다.
2. callService의 트랜잭션 프록시가 호출된다.
3. external() 메서드에는 @Transactional이 없다. 따라서 트랜잭션 프록시는 트랜잭션을 적용하지 않는다.
4. 트랜잭션을 적용하지 않고 실제 callService 객체 인스턴스의 external()을 호출한다.
5. external()은 내부에서 internal() 메서드를 호출한다. 여기서 문제가 발생한다.

external() 내부에서 호출한 internal() 메서드는 this.internal()이므로 프록시가 아닌 실제 대상 객체(target)의 인스턴스를 뜻하게 된다. 결과적으로 내부 호출은 프록시를 거치지 않게 되어 트랜잭션을 적용할 수 없다.

externalCall()을 실행한 로그를 살펴보면 트랜잭션이 수행되지 않은 것을 확인할 수 있다.

```
hello.springtx.apply.InternalCallV1Test  : call external
hello.springtx.apply.InternalCallV1Test  : tx active=false
hello.springtx.apply.InternalCallV1Test  : tx readOnly=false
hello.springtx.apply.InternalCallV1Test  : call internal
hello.springtx.apply.InternalCallV1Test  : tx active=false
hello.springtx.apply.InternalCallV1Test  : tx readOnly=false
```

### 프록시 방식의 AOP 한계

프록시 AOP를 사용하게 되면 내부 호출 시 프록시를 적용할 수 없다는 한계가 있다. 이를 해결하기 위한 방법은 여러가지가 있지만 가장 단순한 방법은 `내부 호출을 피하기 위해 internal() 메서드를 별도의 클래스로 분리하는 것`이다.

## 프록시 내부 호출을 해결하는 방법

메서드 내부 호출 때문에 트랜잭션 프록시가 적용되지 않는 문제를 해결하기 위해 **별도의 클래스로 분리**하자. 아래 코드가 내부 호출을 별도의 클래스로 분리하여 해결한 예제이다.

```java
@Slf4j
@SpringBootTest
public class InternalCallV2Test {

    @Autowired
    CallService callService;

    @Test
    void externalCallV2() {
        callService.external();
    }

    @TestConfiguration
    static class InternalCallV1TestConfig {

        @Bean
        CallService callService() {
            return new CallService(internalService());
        }

        @Bean
        InternalService internalService() {
            return new InternalService();
        }
    }

    @Slf4j
    @RequiredArgsConstructor
    static class CallService {

        private final InternalService internalService;

        public void external() {
            log.info("call external");
            printTxInfo();
            internalService.internal();
        }

        private void printTxInfo() {
            boolean txActive = TransactionSynchronizationManager.isActualTransactionActive();
            log.info("tx active={}", txActive);
        }
    }

    static class InternalService {

        @Transactional
        public void internal() {
            log.info("call internal");
            printTxInfo();
        }

        private void printTxInfo() {
            boolean txActive = TransactionSynchronizationManager.isActualTransactionActive();
            log.info("tx active={}", txActive);
        }
    }
}
```

- InternalService 클래스를 만들고 internal() 메서드를 옮겼다.
- 메서드 내부 호출을 외부 호출로 변경
- CallService에는 트랜잭션 관련 코드가 전혀 없으므로 트랜잭션 프록시가 적용되지 않는다.
- InternalService에는 트랜잭션 관련 코드가 있으므로 트랜잭션 프록시가 적용된다.

실제 호출되는 흐름을 분석해보자.

![4](https://user-images.githubusercontent.com/79130276/227131596-4a57f3c7-e4e4-4ca7-b602-12061e9765ab.png)

1. 클라이언트인 테스트 코드는 callService.external()을 호출한다.
2. callService는 실제 callService 객체 인스턴스이다.
3. callService는 주입 받은 internalService.internal()을 호출한다.
4. internalService는 트랜잭션 프록시이다. internal() 메서드에 @Transactional이 붙어 있으므로 트랜잭션 프록시는 트랜잭션을 적용한다.
5. 트랜잭션 적용 후 실제 internalService 객체 인스턴스의 internal()을 호출한다.

externalCallV2() 실행결과를 살펴보면 트랜잭션이 적용된 것을 확인할 수 있다.

```
h.s.a.InternalCallV2Test$CallService     : call external
h.s.a.InternalCallV2Test$CallService     : tx active=false
o.s.t.i.TransactionInterceptor           : Getting transaction for [hello.springtx.apply.InternalCallV2Test$InternalService.internal]
hello.springtx.apply.InternalCallV2Test  : call internal
hello.springtx.apply.InternalCallV2Test  : tx active=true
o.s.t.i.TransactionInterceptor           : Completing transaction for [hello.springtx.apply.InternalCallV2Test$InternalService.internal]
```

이 밖에도 여러가지 해결방안이 있지만 실무에서는 별도의 클래스로 분리하는 방법을 주로 사용한다.

## 트랜잭션 AOP 초기화 시점

**스프링 초기화 시점**에는 트랜잭션 AOP가 적용되지 않을 수 있다.

그 이유는 초기화 코드(@PostConstruct 등)와 @Transactional을 함께 사용하면 초기화 코드가 먼저 호출된 후 트랜잭션 AOP가 적용되기 때문이다. (시점이 안맞기 때문)

가장 확실한 대안은 `ApplicationReadyEvent` 이벤트를 사용하는 것이다. 이 이벤트는 트랜잭션 AOP를 포함한 스프링이 컨테이너가 완전히 생성되고 난 다음에 이벤트가 붙은 메서드를 호출해준다. 따라서, init2()는 트랜잭션이 적용된 것을 확인할 수 있다.

```java
@SpringBootTest
public class InitTxTest {

    @Autowired
    Hello hello;

    @Test
    void go() {
        // 초기화 코드는 스프링이 초기화 시점에 호출한다.
    }

    @TestConfiguration
    static class InitTxTestConfig {
        @Bean
        Hello hello() {
            return new Hello();
        }
    }

    @Slf4j
    static class Hello {
        // 트랜잭션 AOP가 적용되지 않음
        @PostConstruct
        @Transactional
        public void initV1() {
            boolean isActive = TransactionSynchronizationManager.isActualTransactionActive();
            log.info("Hello init @PostConstruct tx active={}", isActive);
        }

        // 트랜잭션 AOP가 적용됨
        @EventListener(ApplicationReadyEvent.class)
        @Transactional
        public void initV2() {
            boolean isActive = TransactionSynchronizationManager.isActualTransactionActive();
            log.info("Hello init ApplicationReadyEvent tx active={}", isActive);
        }
    }
}
```