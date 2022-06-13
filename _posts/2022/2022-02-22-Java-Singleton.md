---
title:  "싱글톤 컨테이너"
last_modified_at: 2022-02-22T15:26:00
categories: 
  - Spring
tags:
  - Spring
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

## 1. 웹 애플리케이션과 싱글톤

- 웹 어플리케이션의 사용자의 요청이 기본적으로 많다.
    - 여러 고객이 동시에 요청을 한다

<br>

```java
package hello.core.singleton;

import hello.core.AppConfig;
import hello.core.member.MemberService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class SingletonTest {

    @Test
    @DisplayName("스프링 없는 순수한 DI 컨테이너")
    void pureContainer(){
        AppConfig appConfig = new AppConfig();

        MemberService memberService1 = appConfig.memberService();

        MemberService memberService2 = appConfig.memberService();

        System.out.println("memberService1 = " + memberService1);
        System.out.println("memberService2 = " + memberService2);

        Assertions.assertThat(memberService1).isNotSameAs(memberService2);
    }
}
```

- 스프링 없는 순수한 DI 컨테이너인 AppConfig는 사용자가 요청할 때 마다 다른 객체를 생성
- 고객 트래픽이 초당 100이 나오면 초당 100개 이상의 객체를 생성하고 소멸한다 → 메모리 낭비!
- 따라서, 해당 객체를 하나만 생성한 후 공유하도록 설계해야 한다 → `싱글톤 패턴`

<br>

## 2. 싱글톤 패턴

- 클래스의 인스턴스가 딱 1개만 생성되는 것을 보장하는 디자인 패턴
- private 생성자를 사용해서 객체 인스턴스를 2개 이상 생성하지 못하도록 막아야 한다.

```java
package hello.core.singleton;

public class SingletonService {

		// 1. static 영역에 객체를 딱 1개만 생성
    // static으로 되있으면 클래스가 메모리에 로드될 때 단 한번만 수행. static 영역에 하나만 올라간다.
    private static final SingletonService instance = new SingletonService();

		// 2. public 으로 열어서 객체 인스턴스가 필요하면 이 static 메서드를 통해서만 조회하도록 허용
    public static SingletonService getInstance() {
        return instance;
    }

    // private 생성자: 외부에서 new 키워드를 사용한 객체 생성을 못하게 막는다.
    private SingletonService() {
    }

    public void logic() {
        System.out.println("싱글톤 객체 로직 호출");
    }
}
```

- static 영역에 객체 instance를 미리 하나 생성해서 올려둠
- 객체 인스턴스가 필요하면 getInstance()를 통해서 조회
- 외부에서 new 키워드로 객체 인스턴스가 생성되는 것을 막기 위해 private 사용

<br>

```java
		@Test
    @DisplayName("싱글톤 패턴을 적용한 객체 사용")
    void singletonServiceTest() {
        SingletonService singletonService1 = SingletonService.getInstance();
        SingletonService singletonService2 = SingletonService.getInstance();

        System.out.println("singletonService1 = " + singletonService1);
        System.out.println("singletonService2 = " + singletonService2);

        Assertions.assertThat(singletonService1).isSameAs(singletonService2);
    }
```

<br>

싱글톤 패턴을 적용하면 고객의 요청이 올 때 마다 객체를 생성하는 것이 아니라, 이미 만들어진 객체를 공유해서 효율적으로 사용할 수 있다. 하지만 싱글톤 패턴은 다음과 같은 수 많은 문제점들을 가지고 있다.

<br>

**싱글톤 패턴 문제점**

- 싱글톤 패턴을 구현하는 코드 자체가 많이 들어간다.
- 의존관계상 클라이언트가 구체 클래스에 의존한다. DIP를 위반한다.
- 클라이언트가 구체 클래스에 의존해서 OCP 원칙을 위반할 가능성이 높다.
- 테스트하기 어렵다.
- 내부 속성을 변경하거나 초기화 하기 어렵다.
- private 생성자로 자식 클래스를 만들기 어렵다.
- 결론적으로 유연성이 떨어진다.
- 안티패턴으로 불리기도 한다.

<br>

## 3. 싱글톤 컨테이너

스프링 컨테이너는 싱글톤 패턴의 문제점을 해결하면서 객체 인스턴스를 싱글톤(1개만 생성)으로 관리한다

<br>

### 싱글톤 컨테이너

- 스트링 컨테이너는 싱글톤 패턴을 적용하지 않아도 객체 인스턴스를 싱글톤으로 관리
- 스프링 컨테이너는 싱글톤 컨테이너 역할을 함

<br>

**싱글톤 컨테이너 적용 전**

![Untitled1](https://user-images.githubusercontent.com/79130276/155074678-8deaa753-f289-40bb-987a-33423bde4788.png)

**싱글톤 컨테이너 적용 후**

![Untitled2](https://user-images.githubusercontent.com/79130276/155074682-9a8a742a-61fc-4fa8-8fba-4c425e2f7590.png)

<br>

## 4. 싱글톤 방식의 주의점(매우 중요함!)

- 객체 인스턴스를 하나만 생성해서 공유하는 싱글톤 방식은 상태를 유지(stateful)하게 설계하면 안됨
- `무상태(stateless)`로 설계

<br>

**stateful하게 설계했을 때 문제점**

StatefulService.java

```java
package hello.core.singleton;

public class StatefulService {

    private int price;

    public void order(String name, int price) {
        System.out.println("name = " + name + " price = " + price);
        this.price = price; //여기가 문제!
    }

    public int getPrice() {
        return price;
    }
}
```

StatefulServiceTest.java

```java
package hello.core.singleton;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class StatefulServiceTest {

    @Test
    void statefulServiceSingleton() {
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(TestConfig.class);
        StatefulService statefulService1 = ac.getBean(StatefulService.class);
        StatefulService statefulService2 = ac.getBean(StatefulService.class);

        //ThreadA: 사용자A 10000원 주문
        statefulService1.order("userA", 10000);
        //ThreadB: 사용자B 20000원 주문
        statefulService1.order("userB", 20000);

        //ThreadA: 사용자A 주문 금액 조회
        int price = statefulService1.getPrice();
        System.out.println("price = " + price);

        assertThat(statefulService1.getPrice()).isEqualTo(20000);
    }

    static class TestConfig{

        @Bean
        public StatefulService statefulService() {
            return new StatefulService();
        }
    }

}
```

사용자A는 10000을 사용했는데 20000으로 나옴

→ 같은 객체를 이용해서 발생하는 문제

<br>

**stateless로 설계**

StatefulService.java

```java
package hello.core.singleton;

public class StatefulService {

    public int order(String name, int price) {
        System.out.println("name = " + name + " price = " + price);
        return price;
    }
}
```

StatefulServiceTest.java

```java
package hello.core.singleton;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class StatefulServiceTest {

    @Test
    void statefulServiceSingleton() {
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(TestConfig.class);
        StatefulService statefulService1 = ac.getBean(StatefulService.class);
        StatefulService statefulService2 = ac.getBean(StatefulService.class);

        //ThreadA: 사용자A 10000원 주문
        int userAPrice = statefulService1.order("userA", 10000);
        //ThreadB: 사용자B 20000원 주문
        int userBPrice = statefulService1.order("userB", 20000);

        //ThreadA: 사용자A 주문 금액 조회
        System.out.println("price = " + userAPrice);
    }

    static class TestConfig{

        @Bean
        public StatefulService statefulService() {
            return new StatefulService();
        }
    }

}
```

<br>

## 5. @Configuration과 싱글톤

@Configuration은 싱글톤을 위해 존재

<br>

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

    // memberService -> MemoryMemberRepository
    // orderService -> MemoryMemberRepository

    @Bean
    public MemberService memberService() {
        System.out.println("call AppConfig.memberService");
        return new MemberServiceImpl(memberRepository());
    }

    @Bean
    public MemoryMemberRepository memberRepository() {
        System.out.println("call AppConfig.memberRepository");
        return new MemoryMemberRepository();
    }

    @Bean
    public OrderService orderService() {
        System.out.println("call AppConfig.orderService");
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    @Bean
    public DiscountPolicy discountPolicy() {
        return new FixDiscountPolicy();
    }
}
```

<br>

ConfigurationSingletonTest.java

```java
package hello.core.singleton;

import hello.core.AppConfig;
import hello.core.member.MemberRepository;
import hello.core.member.MemberServiceImpl;
import hello.core.order.OrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

public class ConfigurationSingletonTest {

    @Test
    void configurationTest() {
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

        MemberServiceImpl memberService = ac.getBean("memberService", MemberServiceImpl.class);
        OrderServiceImpl orderService = ac.getBean("orderService", OrderServiceImpl.class);
        MemberRepository memberRepository = ac.getBean("memberRepository", MemberRepository.class);

        MemberRepository memberRepository1 = memberService.getMemberRepository();
        MemberRepository memberRepository2 = orderService.getMemberRepository();

        // 3개 모두 같은 인스턴스
        System.out.println("memberService -> memberRepository = " + memberRepository1);
        System.out.println("orderService -> memberRepository = " + memberRepository2);
        System.out.println("memberRepository = " + memberRepository);

        assertThat(memberService.getMemberRepository()).isSameAs(memberRepository);
        assertThat(orderService.getMemberRepository()).isSameAs(memberRepository);
    }
}
```

memberService 호출 → memberRepository() 호출 → new MemoryMemberRepository() 호출

orderService 호출 → memberRepository() 호출 → new MemoryMemberRepository() 호출

<br>

new MemoryMemberRepository()를 두번 실행하였으니 다른 인스턴스가 생성되어야 할 것 같지만 같은 인스턴스임

→ @Configuration 이 싱글톤을 유지시켜주기 때문이다.

<br>

## 6. @Configuration과 바이트코드 조작의 마법

AppConfig 의 스프링 빈을 조회해서 클래스 정보를 출력하면 다음과 같다

```java
System.out.println("bean = " + bean.getClass());
//bean = class hello.core.AppConfig$$EnhancerBySpringCGLIB$$283060ad
```

이것은 내가 만든 클래스가 아니라 스프링이 CGLIB라는 바이트코드 조작 라이브러리를 사용해서 AppConfig 클래스를 상속받은 임의의 다른 클래스를 만들고, 그 다른 클래스를 스프링 빈으로 등록한 것이다!

<br>

**AppConfig@CGLIB 예상 코드**

```java
@Bean
public MemberRepository memberRepository() {
 
 if (memoryMemberRepository가 이미 스프링 컨테이너에 등록되어 있으면?) {
	 return 스프링 컨테이너에서 찾아서 반환;
 } else { //스프링 컨테이너에 없으면
	 기존 로직을 호출해서 MemoryMemberRepository를 생성하고 스프링 컨테이너에 등록
	 return 반환
 }
}
```

덕분에 싱글톤이 보장됨

<br>

**정리**

- @Bean만 사용해도 스프링 빈으로 등록되지만, 싱글톤을 보장하지 않음
- 스프링 설정 정보는 항상 `@Configuration`을 사용하자