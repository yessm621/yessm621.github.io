---
title: "빈 생명주기 콜백"
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Java
toc: true
toc_sticky: true
---

## 빈 생명주기 콜백 시작

데이터베이스 커넥션 풀이나, 네트워크 소켓처럼 애플리케이션 시작 시점에 필요한 연결을 미리 해두고, 애플리케이션 종료 시점에 연결을 모두 종료하는 작업을 진행하려면, 객체의 초기화와 종료 작업이 필요하다.

데이터베이스 커넥션에 대해 얘기한 이유는 빈 생명주기 콜백과 비슷하기 때문이다. 빈 생명주기 콜백도 시작과 안전한 종료를 위한 작업이 필요하다.

스프링 빈은 객체 생성 후에 의존관계 주입을 한다. (객체 생성이 미리 완료해야 의존관계를 주입할 수 있다. 단, 생성자 주입은 예외이다. 생성자는 객체를 만들때 이미 스프링 빈이 같이 들어와야 하기 때문이다.)

스프링 빈은 객체를 생성하고, 의존관계 주입이 다 끝난 다음에 필요한 데이터를 사용할 수 있는 준비가 완료된다. 따라서, 초기화 작업은 의존관계 주입이 모두 완료되고 난 다음에 호출해야 한다.

개발자가 의존관계 주입이 모두 완료된 시점을 어떻게 알 수 있나?

스프링은 의존관계 주입이 완료되면 스프링 빈에게 `콜백 메서드`를 통해서 초기화 시점을 알려주는 다양한 기능을 제공한다. 또한, 스프링은 스프링 컨테이너가 종료되기 직전에 `소멸 콜백`을 준다. 따라서, 안전하게 종료 작업을 진행할 수 있다.

### 스프링 빈의 이벤트 라이프사이클

```
스프링 컨테이너 생성 → 스프링 빈 생성 → 의존관계 주입 → 초기화 콜백 → 사용 → 소멸전 콜백 → 스프링 종료
```

- **초기화 콜백**: 빈이 생성되고, 빈의 의존관계 주입이 완료된 후 호출
- **소멸전 콜백**: 빈이 소멸되기 직전에 호출

> **참고**
의존관계 주입은 수정자 주입, 필드 주입에서 발생한다. 생성자 주입은 객체가 생성되어야 하기 때문에 스프링 빈 생성 단계에서도 일부 시작된다.
> 

생성자를 생성하는 것과 수정자 주입하는 것을 분리한 이유는 생성자에서 모두 처리하면 단일 책임 원칙(SRP)에 위배되기 때문이다.

```java
// 기존
NetworkClient networkClient = new NetworkClient();
networkClient.setUrl("http://hello-spring.dev");

// 생성자에 파라미터 전달: SRP 원칙 위배
NetworkClient networkClient = new NetworkClient("http://hello-spring.dev");
```

> **참고** 객체의 생성과 초기화를 분리하자
생성자는 필수 정보(파라미터)를 받고, 메모리를 할당해서 객체를 생성하는 책임을 가진다. 반면에, 초기화는 이렇게 생성된 값들을 활용해서 외부 커넥션을 연결하는 등 무거운 동작을 수행한다. 따라서, 이 두 부분을 명확하게 나누는 것이 유지보수 관점에서 좋다.
> 

> **참고** 강의에서 말하는 초기화란?
객체가 생성되어 사용되기 전에 진행되어야 할 일련의 과정들이다. 초기화는 ‘객체를 생성하는 작업이 아니고 객체안에 필요한 값이 다 연결되어있고 처음 제대로 일을 시작하는 것이다.’ 라고 볼 수 있다. 왜 번거롭게 객체를 생성할 때 초기화를 진행하지 않을까? 그 이유는 생성과 초기화를 서로 다른 관심사로 보고 각 과정을 분리했다고 이해하면 좋다. (SRP 원칙)
스프링 관점에서의 초기화는 객체 생성 및 의존관계 주입 이후 객체를 사용하기 위해 필요한 추가 작업이다.
> 

```java
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(LifeCycleConfig.class);
```

new AnnotationConfigApplicationContext(LifeCycleConfig.class);를 생성하는 동안 ‘컨테이너 생성, 스프링 빈 생성, 의존관계 주입, 초기화 콜백’까지 다 끝난 상태이다.

스프링은 크게 3가지 방법으로 `빈 생명주기 콜백`을 지원한다.

- 인터페이스(InitializingBean, DisposableBean)
- 설정 정보에 초기화 메서드, 종료 메서드 지정
- @PostConstruct, @PreDestroy 애노테이션 지원

## 인터페이스 InitializingBean, DisposableBean

```java
package com.study.core.lifecycle;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

public class NetworkClient implements InitializingBean, DisposableBean {

    ...

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("NetworkClient.afterPropertiesSet");
        connect();
        call("초기화 연결 메시지");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("NetworkClient.destroy");
        disconnect();
    }
}
```

```
생성자 호출, url = null
NetworkClient.afterPropertiesSet
connect: http://hello-spring.dev
call: http://hello-spring.devmessage = 초기화 연결 메시지
NetworkClient.destroy
close http://hello-spring.dev
```

- InitializingBean은 **afterPropertiesSet()** 메서드로 초기화를 지원함
    - afterPropertiesSet(): 의존관계 주입이 끝나면 호출
- DisposableBean은 **destory()** 메서드로 소멸을 지원함
    - destroy(): 빈이 종료될 때 호출

### 초기화, 소멸 인터페이스 단점

- 이 인터페이스는 스프링 전용 인터페이스다. 해당 코드가 스프링 전용 인터페이스에 의존한다.
- 초기화, 소멸 메서드의 이름을 변경할 수 없다. (afterPropertiesSet(), destroy()로 고정된다.)
- 내가 코드를 고칠 수 없는 외부 라이브러리에 적용할 수 없다.

인터페이스를 사용하는 초기화, 종료 방법은 스프링 초창기(2003년)에 나온 방법들이고, 지금은 다음의 더 나은 방법들이 있어서 거의 사용하지 않는다.

## 빈 등록 초기화, 소멸 메서드 지정

```java
public class NetworkClient {

    ...

    public void init() throws Exception {
        System.out.println("NetworkClient.init");
        connect();
        call("초기화 연결 메시지");
    }

    public void close() throws Exception {
        System.out.println("NetworkClient.close");
        disconnect();
    }
}
```

```java
@Configuration
static class LifeCycleConfig {
    @Bean(initMethod = "init", destroyMethod = "close")
    public NetworkClient networkClient() {
        NetworkClient networkClient = new NetworkClient();
        networkClient.setUrl("http://hello-spring.dev");
        return networkClient;
    }
}
```

### 설정 정보 사용 특징

- 메서드 이름을 자유롭게 줄 수 있다.
- 스프링 빈이 스프링 코드에 의존하지 않는다.
- 코드가 아니라 설정 정보를 사용하기 때문에 코드를 고칠 수 없는 외부 라이브러리에도 초기화, 종료 메서드를 적용할 수 있다. (가장 큰 장점)

### 종료 메서드 추론

- @Bean의 destroyMethod 속성에는 특별한 기능이 있음
- 라이브러리는 대부분 close, shutdown 이라는 이름의 종료 메서드를 사용하는데 @Bean의 destoryMethod는 기본값이 inferred(추론)으로 등록되어 있다.
- 이 추론 기능은 close, shutdown라는 이름의 메서드를 자동으로 호출해준다. (즉, 종료 메서드를 추론해서 호출해준다.)
- 따라서, 직접 스프링 빈으로 등록하면 종료 메서드는 따로 적어주지 않아도 잘 동작한다.
- 추론 기능을 사용하기 싫으면 destroyMethod=””처럼 빈 공백을 지정하면 된다. (굳이 그럴일은 없겠지..;;)

## 애노테이션 @PostConstruct, @PreDestroy

결론부터 얘기하면 이 방법을 쓰면 된다!

```java
package hello.core.lifecycle;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

public class NetworkClient {

    ...

    @PostConstruct
    public void init() {
        System.out.println("NetworkClient.init");
        connect();
        call("초기화 연결 메시지");
    }

    @PreDestroy
    public void close() {
        System.out.println("NetworkClient.close");
        disconnect();
    }
}
```

`@PostConstruct` , `@PreDestroy` 이 두 애노테이션을 사용하면 가장 편리하게 초기화와 종료를 실행할 수 있다.

> **참고**
javax로 시작하는 애노테이션은 자바에서 공식적으로 제공하는 애노테이션이다. 따라서, 스프링이 아니고 다른 컨테이너를 쓴다고 해도 그대로 적용된다.
> 

### @PostConstruct, @PreDestroy 애노테이션 특징

- 최신 스프링에서 가장 **권장**하는 방법이다.
- 애노테이션 하나만 붙이면 되므로 매우 편리하다.
- 패키지를 잘 보면 javax.annotation.PostConstruct 이다. 스프링에 종속적인 기술이 아니고 자바 표준이다. 따라서, 스프링이 아닌 다른 컨테이너에서도 동작한다.
- 컴포넌트 스캔과 잘 어울린다.
- 유일한 단점은 외부 라이브러리에는 적용하지 못한다는 것이다. 외부 라이브러리를 초기화, 종료 해야 하면 @Bean의 기능을 사용하자.

## 정리

기본적으로는 **@PostConstruct, @PreDestroy** 애노테이션을 사용하고 코드를 고칠 수 없는 외부 라이브러리를 초기화, 종료해야 하면 **@Bean**의 initMethod, destroyMethod를 사용한다.