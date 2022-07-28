---
title:  "IoC(제어의 역전)와 DI(의존관계 주입)"
# last_modified_at: 2022-02-15T10:45:00
last_modified_at: 2022-07-26T10:00:00
categories: 
  - Spring
tags:
  - Spring
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---

## 제어의 역전(IoC, Inversion of Control)

AppConfig를 사용하기 전에는 클라이언트 구현 객체가 서버 구현 객체를 생성, 연결, 실행했다. 구현 객체가 프로그램의 제어 흐름을 스스로 조종했다.

반면에, AppConfig 등장 이후 구현 객체는 자신의 로직을 실행하는 역할만 담당하고 프로그램의 제어 흐름은 AppConfig가 가져갔다. 예를 들어, OrderServiceImpl은 필요한 인터페이스들을 호출하지만 어떤 구현 객체들이 실행될지 모른다.

이렇듯 프로그램의 제어 흐름을 직접 제어하는 것이 아니라 **외부에서 관리하는 것**을 `제어의 역전(IoC)`이라 한다.

<br>

### 프레임워크 vs 라이브러리

- 프레임워크가 내가 작성한 코드를 제어하고, 대신 실행하면 그것은 프레임워크가 맞다.
    - 예) JUnit
- 반면에 내가 작성한 코드가 직접 제어의 흐름을 담당한다면 그것은 프레임워크가 아니라 라이브러리다.
    - 예) 자바 객체를 xml, json으로 바꿀때는 라이브러리를 import하여 직접 호출

<br>

## 의존관계 주입(DI, Dependency Injection)

아래 예제를 살펴보면 OrderServiceImpl은 DiscountPolicy 인터페이스에 의존한다. OrderServiceImpl 입장에서 보면 DiscountPolicy에 어떤 구현 객체가 사용될지 모른다.

```java
package hello.core.order;

import hello.core.discount.DiscountPolicy;
import hello.core.member.Member;
import hello.core.member.MemberRepository;

public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }

    ...
}
```

`의존관계`는 정적인 클래스 의존 관계와, 실행 시점에 결정되는 동적인 객체(인스턴스) 의존 관계 둘을 분리해서 생각해야 한다.

<br>

### 정적인 클래스 의존관계

`정적인 클래스 의존관계`는 클래스가 사용하는 import를 보고 의존관계를 쉽게 판단할 수 있다. 따라서, 애플리케이션을 실행하지 않아도 코드만 보고 분석할 수 있다. OrderServiceImpl은 MemberRepository, DiscountPolicy에 의존한다는 것을 파악할 수 있지만 실제 어떤 객체가 OrderServiceImpl에 주입 될지 알 수 없다.

![1](https://user-images.githubusercontent.com/79130276/180967417-6c366a2f-101c-4067-b26c-a479966ee57c.png)

<br>

### 동적인 객체(인스턴스) 의존 관계

정적인 클래스 의존관계와 다르게 `동적인 객체 의존관계`는 애플리케이션 **실행 시점(런타임)**에 실제 구현 객체를 생성하고 클라이언트에 전달해서 클라이언트와 서버의 실제 의존관계가 연결되는 것을 `의존관계 주입`이라 한다. 객체 인스턴스를 생성하고 그 참조값을 전달해서 연결된다. 의존관계 주입을 사용하면 클라이언트 코드를 변경하지 않고, 호출하는 대상의 타입 인스턴스를 변경할 수 있다. 정리하자면, 의존관계 주입을 사용하면 정적인 클래스 의존관계를 변경하지 않고, 동적인 객체 인스턴스 의존관계를 쉽게 변경할 수 있다. 이 부분은 의존관계 주입의 장점이다.

<br>

### DI 컨테이너

AppConfig처럼 객체를 생성, 관리하면서 의존관계를 연결해 주는 것을 IoC 컨테이너 또는 **DI 컨테이너**라 하는데 최근에는 의존관계 주입에 초점을 맞추어 주로 `DI 컨테이너`라 한다.

<br>

### 스프링 컨테이너

현재까진 순수한 자바코드로 DI를 적용했다. 이제 스프링을 사용해보자.

```java
package hello.core;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDiscountPolicy;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }

    @Bean
    public MemoryMemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    @Bean
    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    @Bean
    public DiscountPolicy discountPolicy() {
        return new FixDiscountPolicy();
    }
}
```

- @Configuration: 설정정보에 붙이게 되있음
- @Bean을 붙이면 스프링 컨테이너라는 곳에 등록됨

<br>

```java
package hello.core;

import hello.core.member.Grade;
import hello.core.member.Member;
import hello.core.member.MemberService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MemberApp {

    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
        MemberService memberService = applicationContext.getBean("memberService", MemberService.class);

        Member member = new Member(1L, "memberA", Grade.VIP);
        memberService.join(member);

        Member findMember = memberService.findMember(1L);
        System.out.println("new Member: " + member.getName());
        System.out.println("find Member: " + findMember.getName());
    }
}
```

기존에는 AppConfig를 사용해서 DI를 했지만, 이제부턴 스프링 컨테이너를 통해서 DI를 사용한다.

ApplicationContext을 `스프링 컨테이너`라 한다. 스프링 컨테이너는 @Configuration이 붙은 AppConfig를 설정(구성) 정보로 사용하며 @Bean을 붙인 메서드는 모두 스프링 컨테이너에 등록된다. 이렇게 스프링 컨테이너에 등록된 객체를 `스프링 빈`이라 한다. 스프링 빈은 @Bean이 붙은 메서드의 명을 스프링 빈의 이름으로 사용한다. (memberService, orderService)

이전에는 개발자가 필요한 객체를 AppConfig를 사용해서 직접 조회했지만, 이제부터는 스프링 컨테이너를 통해서 필요한 스프링 빈(객체)를 찾아야 한다. 스프링 빈은 applicationContext.getBean() 메서드를 사용해서 찾을 수 있다. 기존에는 개발자가 직접 자바코드로 모든 것을 했다면 이제부터는 스프링 컨테이너에 객체를 스프링 빈으로 등록하고, 스프링 컨테이너에서 스프링 빈을 찾아서 사용하도록 변경되었다.