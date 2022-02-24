---
title:  "IoC, DI 그리고 컨테이너"
last_modified_at: 2022-02-15T10:45:00
categories: 
  - Spring
tags:
  - Java
  - Spring
---

### 제어의 역전(IoC, Inversion of Control)

**기존 프로그램**

클라이언트 구현 객체가 서버 구현 객체를 생성, 연결, 실행 했다. 구현 객체가 프로그램의 제어 흐름을 스스로 조종했다.

**AppConfig 등장**

구현 객체는 자신의 로직을 실행하는 역할만 담당. 프로그램의 제어 흐름은 AppConfig가 가져감. 예를 들어, OrderServiceImpl은 필요한 인터페이스들을 호출하지만 어떤 구현 객체들이 실행될지 모른다.

프로그램의 제어 흐름을 직접 제어하는 것이 아니라 외부에서 관리하는 것을 제어의 역전(IoC)이라 한다.

<br>

### 프레임워크 vs 라이브러리

- 프레임워크가 내가 작성한 코드를 제어하고, 대신 실행하면 그것은 프레임워크가 맞다. (JUnit)
- 반면에 내가 작성한 코드가 직접 제어의 흐름을 담당한다면 그것은 프레임워크가 아니라 라이브러리다.

<br>

### 의존관계 주입(DI, Dependency Injection)

- OrderServiceImpl은 DiscountPolicy 인터페이스에 의존한다. 실제 어떤 구현 객체가 사용될지 모른다.
- 의존관계는 **정적인 클래스 의존 관계와, 실행 시점에 결정되는 동적인 객체(인스턴스) 의존 관계** 둘을 분리해서 생각해야 한다.

<br>

**정적인 클래스 의존 관계**

- 클래스가 사용하는 import를 보고 의존관계를 쉽게 판단
- 애플리케이션을 실행하지 않아도 분석할 수 있다
- OrderServiceImpl은 MemberRepository, DiscountPolicy에 의존, 하지만 실제 어떤 객체가 OrderServiceImpl에 주입 될지 알 수 없음

![1](https://user-images.githubusercontent.com/79130276/153976307-37820827-cfba-4b01-9827-92259bbc8315.png)

**동적인 객체(인스턴스) 의존 관계**

- 애플리케이션 **실행 시점(런타임)**에 실제 구현 객체를 생성하고 클라이언트에 전달해서 클라이언트와 서버의 실제 의존관계가 연결되는 것을 `의존관계 주입`이라 한다
- 객체 인스턴스를 생성하고 그 참조값을 전달해서 연결된다
- 의존관계 주입을 사용하면 클라이언트 코드를 변경하지 않고, 호출하는 대상의 타입 인스턴스를 변경할 수 있다
- 의존관계 주입을 사용하면 정적인 클래스 의존관계를 변경하지 않고, 동적인 객체 인스턴스 의존관계를 쉽게 변경할 수 있다

<br>

### DI 컨테이너(=IoC 컨테이너)

- AppConfig 처럼 객체를 생성, 관리하면서 의존관계를 연결해 주는 것

<br>

### 스프링 컨테이너

AppConfig.java

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

MemberApp.java

```java
package hello.core;

import hello.core.member.Grade;
import hello.core.member.Member;
import hello.core.member.MemberService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MemberApp {

    public static void main(String[] args) {
//    AppConfig appConfig = new AppConfig();
//    MemberService memberService = appConfig.memberService();
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

- `ApplicationContext`을 `스프링 컨테이너`라 함
- 기존에는 AppConfig를 사용해서 DI를 했지만, 이제부턴 스프링 컨테이너를 통해서 사용
- 스프링 컨테이너는 @Configuration 이 붙은 AppConfig 를 설정(구성) 정보로 사용. @Bean을 붙인 메서드는 모두 스프링 컨테이너에 등록된다. 이렇게 스프링 컨테이너에 등록된 객체를 스프링 빈이라 한다.
- 이전에는 개발자가 필요한 객체를 AppConfig 를 사용해서 직접 조회했지만, 이제부터는 스프링
컨테이너를 통해서 필요한 스프링 빈(객체)를 찾아야 한다. 스프링 빈은 applicationContext.getBean() 메서드를 사용해서 찾을 수 있다.
- 기존에는 개발자가 직접 자바코드로 모든 것을 했다면 이제부터는 스프링 컨테이너에 객체를 스프링 빈으로 등록하고, 스프링 컨테이너에서 스프링 빈을 찾아서 사용하도록 변경되었다.

- 코드가 약간 더 복잡해진 것 같은데, 스프링 컨테이너를 사용하면 어떤 장점이 있을까?