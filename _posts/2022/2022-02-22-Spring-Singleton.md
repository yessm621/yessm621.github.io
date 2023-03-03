---
layout: post
title: "싱글톤 컨테이너"
date: 2022-11-17 15:15:00
categories: [Spring]
tags:
  - Spring
  - Java
author: "유자"
---

## 목차

1. [좋은 객체 지향 설계의 원칙: SOLID](https://yessm621.github.io/spring/2022/07/24/Spring-SOLID/)
2. [DIP, OCP와 의존관계 주입(DI)](https://yessm621.github.io/spring/2022/09/26/Spring-DIP-OCP-DI/)
3. [IoC와 DI](https://yessm621.github.io/spring/2022/07/26/Spring-IoC-DI/)
4. [스프링 컨테이너와 스프링 빈](https://yessm621.github.io/spring/2022/11/17/Spring-SpringContainer-Bean/)
5. [싱글톤 컨테이너](https://yessm621.github.io/spring/2022/11/17/Spring-Singleton/)
6. [컴포넌트 스캔](https://yessm621.github.io/spring/2022/11/26/Spring-ComponentScan/)
7. [의존관계 주입 방법](https://yessm621.github.io/spring/2022/11/30/Spring-Dependency-Injection/)
8. [빈 생명주기 콜백](https://yessm621.github.io/spring/2022/12/04/Spring-BeanLifeCycle/)
9. [빈 스코프](https://yessm621.github.io/spring/2022/12/17/Spring-BeanScope/)

## 싱글톤 패턴

### 싱글톤 패턴 등장배경

웹 애플리케이션은 사용자의 요청이 많으며 동시에 요청을 한다. 만약, 스프링 없는 순수한 DI 컨테이너를 사용하면 클라이언트가 요청을 할 때마다 객체가 생성된다. 따라서, 메모리 낭비가 매우 심하다.

**순수한 DI 컨테이너 테스트**

```java
@Test
@DisplayName("스프링 없는 순수한 DI 컨테이너")
void pureContainer(){
    AppConfig appConfig = new AppConfig();

    MemberService memberService1 = appConfig.memberService();
    MemberService memberService2 = appConfig.memberService();

    // 참조값이 다른 것을 확인
    System.out.println("memberService1 = " + memberService1);
    System.out.println("memberService2 = " + memberService2);

    // memberService1 != memberService2
    assertThat(memberService1).isNotSameAs(memberService2);
}
```

```
memberService1 = com.study.core.member.MemberServiceImpl@13b6aecc
memberService2 = com.study.core.member.MemberServiceImpl@158a8276
```

이를 해결하기 위해서 해당 객체를 하나만 생성한 후 공유하도록 설계해야 하는데 이러한 패턴을 `싱글톤 패턴`이라 한다.

### 싱글톤 패턴이란?

싱글톤 패턴이란 클래스의 인스턴스가 딱 1개만 생성되는 것을 보장하는 디자인 패턴으로 싱글톤 패턴이 적용되면 객체 인스턴스를 2개 이상 생성하지 못하도록 막는다. (private 생성자를 사용해서 외부에서 임의로 new 키워드를 사용하지 못하도록 막는다.)

```java
package hello.core.singleton;

public class SingletonService {

		// #1
    private static final SingletonService instance = new SingletonService();

		// #2
    public static SingletonService getInstance() {
        return instance;
    }

    // #3
    private SingletonService() {
    }

    public void logic() {
        System.out.println("싱글톤 객체 로직 호출");
    }
}
```

1. static 영역에 객체 instance를 딱 1개만 생성해둔다. static으로 되있으면 클래스가 메모리에 로드될 때 단 한번만 수행하고 static 영역에 하나만 올라간다.
2. public으로 열어서 객체 인스턴스가 필요하면 이 static 메서드를 통해서만 조회하도록 허용한다. 이 객체 인스턴스가 필요하면 오직 getInstance() 메서드를 통해서만 조회할 수 있다. 이 메서드를 호출하면 항상 같은 인스턴스를 반환한다.
3. private 생성자를 통해 외부에서 new 키워드를 사용한 객체 생성을 못하게 막는다.

**싱글톤 패턴을 사용한 테스트 코드**

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

```
singletonService1 = com.study.core.singleton.SingletonService@66d18979
singletonService2 = com.study.core.singleton.SingletonService@66d18979
```

private로 new 키워드를 막아두었기 때문에 getInstance() 메서드 사용했다. 호출할 때 마다 같은 객체 인스턴스를 반환하는 것을 확인할 수 있다.

싱글톤 패턴을 적용하면 고객의 요청이 올 때 마다 객체를 생성하는 것이 아니라, 이미 만들어진 객체를 공유해서 효율적으로 사용할 수 있다. 하지만 싱글톤 패턴은 다음과 같은 수 많은 문제점들을 가지고 있다.

### 싱글톤 패턴 문제점

- 싱글톤 패턴을 구현하는 코드 자체가 많이 들어간다.
- 의존관계상 클라이언트가 구체 클래스에 의존한다. DIP를 위반한다.
- 클라이언트가 구체 클래스에 의존해서 OCP 원칙을 위반할 가능성이 높다.
- 테스트하기 어렵다.
- 내부 속성을 변경하거나 초기화 하기 어렵다.
- private 생성자로 자식 클래스를 만들기 어렵다.
- 결론적으로 유연성이 떨어진다.
- 안티패턴으로 불리기도 한다.

> **참고**
<br>
여기서 DIP 원칙을 위반했다고 한 것이 싱글톤 패턴이 무조건 DIP 원칙을 위반한다는 것은 아니다.
> 

이러한 문제점들을 해결하기 위해 `싱글톤 컨테이너`를 사용한다.

## 싱글톤 컨테이너

### 싱글톤 컨테이너란?

스프링 컨테이너는 싱글톤 패턴의 문제점을 해결하면서 객체 인스턴스를 싱글톤(1개만 생성)으로 관리한다. 스프링 컨테이너는 싱글톤 패턴을 적용하지 않아도 객체 인스턴스를 싱글톤으로 관리한다. 즉, 객체를 하나만 생성해서 관리한다. 스프링 컨테이너는 싱글톤 컨테이너 역할을 한다. 이렇게 싱글톤 객체를 생성하고 관리하는 기능을 싱글톤 레지스트리라 한다.

스프링 컨테이너는 위에서 설명했던 싱글톤 패턴을 위한 지저분한 코드가 들어가지 않아도 된다는 점과 DIP, OCP, 테스트, private 생성자로부터 자유롭게 싱글톤을 사용할 수 있다는 점 덕분에 싱글톤 패턴의 모든 단점을 해결하면서 객체를 싱글톤으로 유지할 수 있다.

```java
@Test
@DisplayName("스프링 컨테이너와 싱글톤")
void springContainer() {
    ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
    MemberService memberService1 = ac.getBean("memberService", MemberService.class);
    MemberService memberService2 = ac.getBean("memberService", MemberService.class);

    // 참조값이 같은 것을 확인
    System.out.println("memberService1 = " + memberService1);
    System.out.println("memberService2 = " + memberService2);

    // memberService1 == memberService2
    assertThat(memberService1).isSameAs(memberService2);
}
```

```
memberService1 = com.study.core.member.MemberServiceImpl@c2db68f
memberService2 = com.study.core.member.MemberServiceImpl@c2db68f
```

스프링 컨테이너 덕분에 고객의 요청이 올 때 마다 객체를 생성하는 것이 아니라, 이미 만들어진 객체를 공유해서 효율적으로 재사용할 수 있다.

> **참고**
<br>
스프링의 기본 빈 등록 방식은 싱글톤이지만, 싱글톤 방식만 지원하는 것은 아니다. 요청할 때마다 새로운 객체를 생성해서 반환하는 기능도 제공한다. 자세한 내용은 뒤에 빈 스코프에서 설명하겠다.
> 

### 싱글톤 방식의 주의점

객체 인스턴스를 하나만 생성해서 공유하는 싱글톤 방식은 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 상태를 유지(stateful)하게 설계하면 안되고 `무상태(stateless)`로 설계해야 한다. 스프링 빈의 필드에 공유 값을 설정하면 정말 큰 장애가 발생할 수 있기 때문이다.

**무상태(stateless)**

- 특정 클라이언트에 의존적인 필드가 있으면 안된다.
- 특정 클라이언트가 값을 변경할 수 있는 필드가 있으면 안된다.
- 가급적 읽기만 가능해야 한다.
- 필드 대신에 자바에서 공유되지 않는 지역변수, 파라미터, ThreadLocal 등을 사용해야 한다.

## CGLIB 바이트코드 조작

### @Configuration과 싱글톤

아래 코드는 AppConfig 설정파일로 @Configuration과 @Bean이 있기 때문에 싱글톤이 적용되어있다. 그런데 호출되는 의존관계를 보면 싱글톤이 깨지는 것처럼 보인다.

```java
@Configuration
public class AppConfig {

    // memberService -> MemoryMemberRepository
    // orderService -> MemoryMemberRepository

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

memberService(), orderService() 둘 다 MemoryMemberRepository()가 생성되면서 싱글톤이 깨지는 것처럼 보인다. 그러나, 테스트를 해보면 모두 **같은 객체를 호출**하고 있다. 이처럼 싱글톤을 보장할 수 있는 이유는  @Configuration을 통해 바이트코드 조작 라이브러리를 사용하기 때문이다.

### @Configuration과 바이트코드 조작

스프링 컨테이너는 싱글톤 레지스트리다. 따라서, 스프링 빈이 싱글톤이 되도록 보장해주어야 하는데 스프링이 자바 코드까지 조작하긴 어렵다. 그래서 스프링은 클래스의 **바이트코드를 조작**하는 라이브러리를 사용한다.

AppConfig 클래스 정보를 출력하는 테스트코드

```java
@Test
void configurationDeep() {
    ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);
    AppConfig bean = ac.getBean(AppConfig.class);

    System.out.println("bean = " + bean.getClass());
}
```

```
bean = class hello.core.AppConfig$$EnhancerBySpringCGLIB$$4730a6f2
```

순수한 클래스라면 class hello.core.AppConfig가 출력되어야 하지만, 예상과는 다르게 클래스 명에 xxxCGLIB가 붙는다. 이것은 스프링이 CGLIB라는 `바이트코드 조작 라이브러리`를 사용해서 AppConfig 클래스를 상속받은 임의의 다른 클래스를 만들고, 그 다른 클래스를 스프링 빈으로 등록했기 때문이다. (AppConfig를 상속받은 AppConfig@CGLIB)

그 임의의 다른 클래스가 바로 싱글톤이 보장되도록 해준다. 아마도 다음과 같이 바이트 코드를 조작해서 작성되어 있을 것이다.

**AppConfig@CGLIB 예상 코드**

```java
@Bean
public MemberRepository memberRepository() {
 
    if (memoryMemberRepository가 이미 스프링 컨테이너에 등록되어 있으면?) {
        return 스프링 컨테이너에서 찾아서 반환;
    } else { //스프링 컨테이너에 없으면
        기존 로직을 호출해서 MemoryMemberRepository를 생성하고 스프링 컨테이너에 등록
        return 반환;
    }
}
```

@Bean이 붙은 메서드마다 이미 스프링 빈이 존재하면 존재하는 빈을 반환하고, 스프링 빈이 없으면 생성해서 스프링 빈으로 등록하고 반환하는 코드가 동적으로 만들어진다. 덕분에 싱글톤이 보장된다.

### @Configuration을 적용하지 않고 @Bean만 적용하면 어떻게 될까?

@Configuration을 붙이면 바이트코드를 조작하는 CGLIB 기술을 사용해서 싱글톤을 보장하지만 만약, @Bean만 적용하면 어떻게 될까?

```java
//@Configuration 삭제
public class AppConfig {

}
```

```
bean = class hello.core.AppConfig
```

이 출력 결과를 통해서 AppConfig가 CGLIB 기술 없이 순수한 AppConfig로 스프링 빈에 등록된 것을 확인할 수 있다. 즉, @Bean만 사용해도 스프링 빈으로 등록되지만, 싱글톤을 보장하지 않는다. 스프링 설정 정보는 항상 `@Configuration`을 사용하자.