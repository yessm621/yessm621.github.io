---
layout: post
title: "의존관계 주입 방법"
# date: 2022-08-07 22:50:00
# date: 2022-11-26 23:25:00
date: 2022-11-30 16:15:00
categories: [Spring]
tags:
  - Spring
  - Java
author: "유자"
---

## 목차

1. [좋은 객체 지향 설계의 원칙: SOLID](https://yessm621.github.io/spring/Spring-SOLID/)
2. [DIP, OCP와 의존관계 주입(DI)](https://yessm621.github.io/spring/Spring-DIP-OCP-DI/)
3. [IoC와 DI](https://yessm621.github.io/spring/Spring-IoC-DI/)
4. [스프링 컨테이너와 스프링 빈](https://yessm621.github.io/spring/Spring-SpringContainer-Bean/)
5. [싱글톤 컨테이너](https://yessm621.github.io/spring/Spring-Singleton/)
6. [컴포넌트 스캔](https://yessm621.github.io/spring/Spring-ComponentScan/)
7. [의존관계 주입 방법](https://yessm621.github.io/spring/Spring-Dependency-Injection/)
8. [빈 생명주기 콜백](https://yessm621.github.io/spring/Spring-BeanLifeCycle/)
9. [빈 스코프](https://yessm621.github.io/spring/Spring-BeanScope/)

## 다양한 의존관계 주입 방법

- 생성자 주입
- 수정자 주입 (setter 주입)
- 필드 주입
- 일반 메서드 주입

## 생성자 주입

생성자를 통해서 의존 관계를 주입 받는 방법이고 현재 가장 권장하는 방법이다. 생성자 호출 시점에 1번만 호출되는 것이 보장되고 **불변, 필수** 의존관계에 사용된다. 또한, 생성자가 1개만 있으면 @Autowired를 **생략**해도 자동 주입 된다. (스프링 빈에만 해당됨)

```java
@Component
public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    // 생성자가 하나이기 때문에 @Autowired 생략 가능 하다.
		// 요즘은 생략해서 많이 사용함
    // @Autowired
    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }
	...
}
```

> **참고** 불변
<br>
좋은 개발 습관은 제약, 한계점이 있어야 한다.
> 

### 생성자 주입을 권장하는 이유

1. `불변`
    - 대부분의 의존관계 주입은 애플리케이션 종료시점까지 변경될 일이 없고 변하면 안된다.(불변해야 한다.)
    - 수정자 주입을 사용하면 setXxx 메서드를 public으로 열어둬야 한다. public이기 때문에 누군가 실수로 변경할 수 있다. 또한, 변경하면 안되는 메서드를 열어두는 것은 좋은 설계 방법이 아니다.
    - 생성자 주입은 객체를 생성할 때 딱 1번만 호출되므로 이후에 호출되는 일이 없다. 따라서, 불변하게 설계할 수 있다.
2. 누락
    - 생성자 주입을 사용하면 주입 데이터가 누락 되었을 때 컴파일 오류가 발생하여 어떤 값을 필수로 주입해야 하는지 알 수 있다. (가장 좋은 오류는 **컴파일 오류**이다.)
    - 수정자 주입을 사용하면 실행은 되지만 NPE 오류가 발생한다.
3. final 키워드
    - 생성자 주입을 사용하면 필드에 final을 사용할 수 있어 혹시라도 생성자에 값이 설정되지 않아 발생하는 오류를 컴파일 시점에 막아준다.

> **참고** 순환참조
<br>
A→B→C→A로 각 Bean들의 생성자가 서로를 의존하는 문제를 `순환참조`라 한다. 그리고 순환참조가 발생하면 애플리케이션이 정상적으로 동작하지 않는다. 의존관계는 **단방향**으로 설계하는 것이 좋다.
> 

### 수정자 주입(setter 주입)

setter라 불리는 필드의 값을 변경하는 수정자 메서드를 통해 의존관계를 주입하는 방법이다. **선택, 변경** 가능성이 있는 의존관계에 사용되며, 자바빈 프로퍼티 규약의 수정자 메서드 방식을 사용하는 방법이다.

```java
@Component
public class OrderServiceImpl implements OrderService {

    private MemberRepository memberRepository;
    private DiscountPolicy discountPolicy;

    @Autowired
    public void setMemberRepository(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Autowired
    public void setDiscountPolicy(DiscountPolicy discountPolicy) {
        this.discountPolicy = discountPolicy;
    }
	...
}
```

> **참고**
<br>
@Autowired의 기본 동작은 주입할 대상이 없으면 오류가 발생한다. 주입할 대상이 없어도 동작하게 하려면 @Autowired(required = false)로 지정하면 된다.
> 

> **참고** 자바빈 프로퍼티 규약
<br>
자바빈 프로퍼티, 자바에서는 과거부터 필드의 값을 직접 변경하지 않고, setXxx, getXxx 라는 메서드를 통해서 값을 읽거나 수정하는 규칙을 만들었는데 그것이 자바빈 프로퍼티 규약이다.
> 

### 필드 주입

필드에 바로 주입하는 방법이다. 코드가 간결하다는 장점이 있지만 외부에서 변경이 불가능해 테스트하기 힘들다는 치명적인 단점이 있다. 또한, DI 프레임워크가 없으면 아무것도 할 수 없다. 그래서, 순수 자바코드로 테스트가 불가하다. 이 방식은 되도록 사용하지 말자.

```java
@Component
public class OrderServiceImpl implements OrderService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private DiscountPolicy discountPolicy;
    ...
}
```

### 일반 메서드 주입

일반 메서드를 통해 주입 받을 수 있다. 일반적으로 잘 사용하지 않는다.

> **참고**
<br>
당연한 이야기지만 **의존관계 자동 주입**은 스프링 컨테이너가 관리하는 **스프링 빈**이어야 동작한다. 스프링 빈이 아닌 Member 같은 클래스에서 @Autowired 코드를 적용해도 아무 기능도 동작하지 않는다.
> 

## 롬복과 최신 트렌드

롬복을 이용해 `생성자 주입 방식`으로 작성하면서도 매우 편리하게 사용할 수 있는 방법이 있다. 롬북에서 제공하는 `@RequiredArgsConstructor` 기능을 사용하면 final이 붙은 필드를 모아서 생성자를 자동으로 만들어준다.

```java
@Component
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;
}
```

위의 코드는 생성자 주입 코드와 완전히 동일하다. 롬복이 자바의 애노테이션 프로세서라는 기능을 이용해서 컴파일 시점에 생성자 코드를 자동으로 생성해준다.

최근에는 생성자를 딱 1개 두고, @Autowired 를 생략하는 방법을 주로 사용한다. 여기에 Lombok 라이브러리의 @RequiredArgsConstructor 함께 사용하면 기능은 다 제공하면서, 코드는 깔끔하게 사용할 수 있다.

> **참고**
<br>
@RequiredArgsConstructor는 단순히 생성자 코드만 만들어준다. 생성자가 하나만 있어서 @Autowired를 생략해도 되는 것이지 @RequiredArgsConstructor가 @Autowired 까지 생성해주는 것이 아니다.
>

## @Autowired 필드 명, @Qualifier, @Primary

### 같은 타입의 빈이 2개 이상 등록되었을 때

@Autowired는 타입으로 빈을 조회하는데 타입으로 조회할 경우 선택된 빈이 2개 이상이면 **NoUniqueBeanDefinitionException** 에러가 발생한다.

예) DiscountPolicy의 하위 타입인 FixDiscountPolicy, RateDiscountPolicy 두가지가 스프링 빈으로 선언

```java
@Autowired
private DiscountPolicy discountPolicy;
```

```java
@Component
public class FixDiscountPolicy implements DiscountPolicy {}

@Component
public class RateDiscountPolicy implements DiscountPolicy {} 
```

에러를 해결하기 위해 하위 타입으로 지정할 수도 있지만, 하위 타입으로 지정하는 것은 DIP를 위배하고 유연성이 떨어진다. 그리고 이름만 다르고, 완전히 똑같은 타입의 스프링 빈이 2개 있을 때 해결이 안된다. 스프링 빈을 수동 등록해서 문제를 해결해도 되지만, 의존 관계 자동 주입에서 해결하는 여러 방법이 있다.

### 조회 대상 빈이 2개 이상일 때 해결 방법

- @Autowired 필드 명 매칭
- @Qualifier → @Qualifier끼리 매칭 → 빈 이름 매칭
- @Primary 사용

### @Autowired 필드 명 매칭

@Autowired는 타입 매칭을 시도하고, 이때 여러 빈이 있으면 필드 이름, 파라미터 이름으로 빈 이름을 추가 매칭한다.

**필드 명을 빈 이름으로 변경**

```java
@Autowired
// private DiscountPolicy discountPolicy;
private DiscountPolicy rateDiscountPolicy;
```

```java
@Autowired
// discountPolicy를 rateDiscountPolicy로 변경함
public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy rateDiscountPolicy) {
    this.memberRepository = memberRepository;
    this.discountPolicy = rateDiscountPolicy;
}
```

**@Autowired 매칭 정리**

1. 우선 타입으로 매칭한다.
2. 타입 매칭의 결과가 2개 이상일 때는 필드명, 파라미터명으로 빈 이름 매칭한다.

### @Qualifier 사용

@Qualifier는 추가 구분자를 붙여주는 방법이다. 빈을 등록할 때 @Qualifier("빈 이름")을 지정해주고 의존관계 주입 시 @Qualifier를 붙여주고 등록한 이름을 적는다.

**빈 등록 시 @Qualifier 붙여줌**

```java
@Component
@Qualifier("mainDiscountPolicy")
public class RateDiscountPolicy implements DiscountPolicy {}
```

**생성자 자동 주입 시 @Qualifier를 붙여줌**

```java
@Autowired
public OrderServiceImpl(MemberRepository memberRepository, @Qualifier("mainDiscountPolicy") DiscountPolicy discountPolicy) {
    this.memberRepository = memberRepository;
    this.discountPolicy = discountPolicy;
}
```

만약, @Qualifier("mainDiscountPolicy")로 주입한 빈을 못찾는다면 mainDiscountPolicy라는 이름의 스프링 빈을 찾는다. 하지만 경험상 @Qualifier는 @Qualifier를 찾는 용도로만 사용하는 것이 좋다.

**@Qualifier 정리**

1. @Qualifier끼리 매칭
2. 빈 이름 매칭
3. NoSuchBeanDefinitionException 예외 발생

### @Primary 사용

@Primary는 우선순위 정하는 방법이다. @Autowired 시에 여러 빈이 매칭되면 @Primary가 우선권을 가진다.

```java
// rateDiscountPolicy가 우선권을 가짐
@Component
@Primary
public class RateDiscountPolicy implements DiscountPolicy {}

@Component
public class FixDiscountPolicy implements DiscountPolicy {}
```

@Primary와 @Qualifier 중에 어떤 것을 사용하면 좋을지 고민이 될 것이다. @Qualifier의 단점은 주입 받을 때 코드에 @Qualifier를 여러 곳에 붙여주어야 한다는 점이다. 반면에, @Primary를 사용하면 이렇게 @Qualifier를 붙일 필요가 없다.

**@Primary, @Qualifier 활용**

코드에서 자주 사용하는 메인 데이터베이스의 커넥션을 획득하는 스프링 빈이 있고, 코드에서 특별한 기능으로 가끔 사용하는 서브 데이터베이스의 커넥션을 획득하는 스프링 빈이 있다고 생각해보자. 메인 데이터베이스의 커넥션을 획득하는 스프링 빈은 @Primary를 적용해서 조회하는 곳에서 @Qualifier 지정 없이 편리하게 조회하고, 서브 데이터베이스 커넥션 빈을 획득할 때는 @Qualifier를 지정해서 명시적으로 획득 하는 방식으로 사용하면 코드를 깔끔하게 유지할 수 있다. 물론, 이때 메인 데이터베이스의 스프링 빈을 등록할 때 @Qualifier를 지정해주는 것은 상관없다.

**우선순위**

우선순위는 ‘@Qualifier > @Primary > @Autowired’ 순 이다. @Primary는 기본값 처럼 동작하는 것이고, @Qualifier는 매우 상세하게 동작한다. 스프링은 자동보다는 수동이, 넒은 범위의 선택권 보다는 좁은 범위의 선택권이 우선순위가 높다. 따라서, 여기서도 @Qualifier가 우선권이 높다.

> **참고**
<br>
@Primary, @Qualifier를 사용하면서 구현체 코드를 수정했다. 즉, 클라이언트 코드를 수정하였다. 이는 OCP원칙에 위배된다. 기존 구현 클래스의 애노테이션을 변경하지 않으면 좋겠지만 이는 컴포넌트 스캔의 한계이다. 이런 것을 **트레이드 오프**라 한다. 트레이드 오프란 하나를 얻으면 다른 하나를 잃을 수 있는 관계를 의미한다.
> 

### 애노테이션 직접 만들기

@Qualifier(”mainDiscountPolicy”) 이렇게 적으면 컴파일시 타입 체크가 안되므로 애노테이션을 만들어서 문제를 해결할 수 있다.

> 애노테이션을 직접 만드는 것은 실무에서 한번씩 사용한다.
> 

```java
import org.springframework.beans.factory.annotation.Qualifier;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER,
        ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Qualifier("mainDiscountPolicy")
public @interface MainDiscountPolicy {}
```

```java
@Component
@MainDiscountPolicy
public class RateDiscountPolicy implements DiscountPolicy {}
```

```java
@Autowired
public OrderServiceImpl(MemberRepository memberRepository, @MainDiscountPolicy DiscountPolicy discountPolicy) {
    this.memberRepository = memberRepository;
    this.discountPolicy = discountPolicy;
}
```

## 조회한 빈이 모두 필요할 때, List, Map

의도적으로 정말 해당 타입의 스프링 빈이 다 필요한 경우도 있다.

실무에서 사용하는 경우: 예시) 할인 서비스를 제공하는데, 클라이언트가 할인의 종류(rate, fix)를 선택할 수 있음.

```java
public class AllBeanTest {

    @Test
    void findAllBean() {
        ApplicationContext ac = new AnnotationConfigApplicationContext(AutoAppConfig.class, DiscountService.class);

        DiscountService discountService = ac.getBean(DiscountService.class);
        Member member = new Member(1L, "userA", Grade.VIP);
        int discountPrice = discountService.discount(member, 10000, "fixDiscountPolicy");

        assertThat(discountService).isInstanceOf(DiscountService.class);
        assertThat(discountPrice).isEqualTo(1000);

        int rateDiscountPrice = discountService.discount(member, 20000, "rateDiscountPolicy");
        assertThat(rateDiscountPrice).isEqualTo(2000);
    }

    static class DiscountService {

        private final Map<String, DiscountPolicy> policyMap;
        private final List<DiscountPolicy> policies;

        public DiscountService(Map<String, DiscountPolicy> policyMap, List<DiscountPolicy> policies) {
            this.policyMap = policyMap;
            this.policies = policies;
        }

        public int discount(Member member, int price, String discountCode) {
            DiscountPolicy discountPolicy = policyMap.get(discountCode);
            return discountPolicy.discount(member, price);
        }
    }

}
```

- Map을 통해 DiscountPolicy 타입의 빈들을 주입받는다. (여기서는 fixDiscountPolicy, rateDiscountPolicy가 주입됨)
- discount() 메서드에 discountCode로 fixDiscountPolicy가 넘어오면 fixDiscountPolicy 빈을 실행한다. rateDiscountPolicy도 마찬가지다.

> **참고**
<br>
DiscountService를 사용할 때 @Component를 붙이지 않는 이유는 AnnotationConfigApplicationContext(DiscountService.class) 코드가 스프링 컨테이너에 스프링 빈을 등록하는 코드이기 때문이다.
> 

## 자동, 수동의 올바른 실무 운영 기준

실무에서 스프링 빈을 등록과 의존관계 주입은 default를 **자동**으로 한다.

스프링은 점점 자동을 선호하는 추세이다. @Component 뿐만 아니라 @Controller, @Service, @Repository 등도 자동으로 스캔할 수 있도록 지원한다. 최근 스프링 부트는 컴포넌트 스캔을 기본으로 사용한다. 자동으로 관리하면 설정 정보를 관리할 때 편의성이 있다. 또한 자동 빈 등록을 사용해도 OCP, DIP를 지킬 수 있다.

그러면 **수동 빈 등록**은 언제 사용하면 좋을까?

애플리케이션은 크게 `업무 로직`과 `기술 지원 로직`으로 나눌 수 있다.

### 업무 로직 빈

웹을 지원하는 컨트롤러, 핵심 비즈니스 로직이 있는 서비스, 데이터 계층의 로직을 처리하는 리포지토리등이 모두 업무 로직이다. 보통 비즈니스 요구사항을 개발할 때 추가되거나 변경된다. 이 경우에 자동 빈 등록을 권장한다.

### 기술 지원 빈

기술적인 문제나 공통 관심사(AOP)를 처리할 때 주로 사용된다. 데이터베이스 연결이나, 공통 로그 처리 처럼 업무 로직을 지원하기 위한 하부 기술이나 공통 기술들이다. 기술 지원 로직은 업무 로직과 비교해서 그 수가 매우 적고, 보통 애플리케이션 전반에 걸쳐서 광범위하게 영향을 미친다. 기술 지원 로직들은 가급적 수동 빈 등록을 사용해서 명확하게 드러내는 것이 좋다.

> **참고** 기술 지원 빈
<br>
objectMapper, modelMapper에 @Bean을 등록한 경우도 기술 지원 빈이라 한다. 그러나, 이는 AOP는 아니다. (AOP는 프록시를 사용해야 하는데 objectMapper, modelMapper는 코드에 직접 사용했으므로 AOP가 아니다.)
>

즉, 애플리케이션에 광범위하게 영향을 미치는 기술 지원 객체는 수동 빈으로 등록해서 설정 정보에 바로 나타나게 하는 것이 유지보수 하기 좋다.

비즈니스 로직 중에서 다형성을 적극 활용할 때는 수동 등록해주는 것이 좋다. 아래 예제를 살펴보면 Map<String, DiscountPolicy>에 어떤 빈들이 주입될지 코드만 보고 한번에 쉽게 파악하기 어렵다. 자동 등록을 사용하고 있기 때문에 여러 코드를 찾아봐야 한다.

```java
static class DiscountService {
    private final Map<String, DiscountPolicy> policyMap;
    private final List<DiscountPolicy> policies;

    public DiscountService(Map<String, DiscountPolicy> policyMap, List<DiscountPolicy> policies) {
        this.policyMap = policyMap;
        this.policies = policies;
    }

    public int discount(Member member, int price, String discountCode) {
        DiscountPolicy discountPolicy = policyMap.get(discountCode);
        return discountPolicy.discount(member, price);
    }
}
```

이런 경우 수동 빈으로 등록하거나 또는 자동으로하면 특정 패키지에 같이 묶어두는게 좋다. 핵심은 코드를 보고 바로 파악이 되어야 한다.

이 부분을 별도의 설정 정보로 만들고 수동으로 등록하면 다음과 같다.

```java
@Configuration
public class DiscountPolicyConfig {
    @Bean
    public DiscountPolicy rateDiscountPolicy() {
        return new RateDiscountPolicy();
    }

    @Bean
    public DiscountPolicy fixDiscountPolicy() {
        return new FixDiscountPolicy();
    }
}
```

이처럼 별도의 설정 정보를 만들고 이를 별도의 특정 패키지에 모아두면 코드 파악이 용이하다.

참고로 스프링과 스프링 부트가 자동으로 등록하는 수 많은 빈들은 예외다. 이런 부분들은 스프링 자체를 잘
이해하고 스프링의 의도대로 잘 사용하는게 중요하다. 반면에 스프링 부트가 아니라 내가 직접 기술 지원
객체를 스프링 빈으로 등록한다면 수동으로 등록해서 명확하게 드러내는 것이 좋다.

요약하자면, 편리한 자동 빈 등록을 기본으로 사용하고 직접 등록하는 기술 지원 객체는 수동 등록하자. 다형성을 적극 활용하는 비즈니스 로직은 수동 등록을 고민해보자.