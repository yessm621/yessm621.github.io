---
title:  "컴포넌트 스캔"
# last_modified_at: 2022-02-24T11:00:00
last_modified_at: 2022-07-28T16:50:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

## 컴포넌트 스캔과 의존관계 자동 주입

스프링은 자바 코드의 @Bean이나 XML의 <bean> 같은 설정 정보가 없어도 **자동으로 스프링 빈을 등록**하는 `컴포넌트 스캔`이라는 기능을 제공하며, 의존관계를 자동으로 주입하는 `@Autowired` 기능을 제공한다.

### 컴포넌트 스캔

```java
@ComponentScan(
        excludeFilters = @Filter(type = FilterType.ANNOTATION, classes = Configuration.class))
public class AutoAppConfig {

}
```

컴포넌트 스캔을 사용하려면 먼저 @ComponentScan을 설정 정보에 붙여주면 된다. 컴포넌트 스캔은 이름 그대로 @Component 애노테이션이 붙은 클래스를 스캔해서 스프링 빈으로 등록한다.

이제 MemoryMemberRespository, RateDiscountPolicy, MemberServiceImpl, OrderServiceImpl 클래스들이 컴포넌트 스캔의 대상이 되도록 **@Component 애노테이션**을 입력한다.

> **참고**
<br>
컴포넌트 스캔을 사용하면 @Configuration이 붙은 설정 정보도 자동으로 등록되기 때문에 AppConfig, TestConfig 등 앞서 만들어두었던 설정 정보도 함께 등록되고, 실행된다. 그러면 충돌이 발생하기 때문에 excludeFilters를 이용해서 설정정보는 컴포넌트 스캔 대상에서 제외한다.
> 

> **참고**
<br>
@Configuration이 컴포넌트 스캔의 대상이 된 이유도 @Configuration 소스코드를 열어보면 @Component 애노테이션이 붙어있기 때문이다.
> 

### 의존관계 자동 주입

이전에 AppConfig에서는 @Bean으로 직접 설정 정보를 작성했고, 의존관계도 직접 명시했다. 이제는 이런 설정 정보 자체가 없기 때문에, 의존관계 주입도 각 클래스 안에서 해결해야 한다.

`@Autowired`는 **의존관계를 자동으로 주입**해준다. 생성자에 @Autowired를 지정하면, 스프링 컨테이너가 자동으로 해당 스프링 빈을 찾아서 주입한다. 또한, @Autowired를 사용하면 생성자에서 여러 의존관계도 한번에 주입 받을 수 있다.

```java
@Component
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

		// getBean(MemberRepository.class)와 동일
    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
		...
}
```

```java
@Component
public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    @Autowired
    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }
    ...
}
```

테스트 코드를 통해 정상적으로 스프링 빈에 등록되었는지와 의존관계 주입이 되었는지를 확인할 수 있다.

```java
@Test
void basicScan() {
    ApplicationContext ac = new AnnotationConfigApplicationContext(AutoAppConfig.class);
    MemberService memberService = ac.getBean(MemberService.class);
    assertThat(memberService).isInstanceOf(MemberService.class);
}
```

### 컴포넌트 스캔, 자동 의존관계 주입의 동작 흐름

**@ComponentScan**

- @ComponentScan은 @Component가 붙은 모든 클래스를 스프링 빈으로 등록함
- 스프링 빈의 기본 이름은 클래스명을 사용하되 맨 앞글자만 소문자를 사용함
    - 빈 이름 기본 전략: MemberServiceImpl 클래스 → memberServiceImpl
    - 빈 이름 직접 지정: 만약 스프링 빈의 이름을 직접 지정하고 싶으면 @Component(”memberService2”) 이런식으로 이름을 부여하면 된다.

**@Autowired 의존관계 자동 주입**

- 생성자에 @Autowired를 지정하면 스프링 컨테이너가 자동으로 해당 스프링 빈을 찾아서 주입한다.
- 이때, 기본 조회 전략은 **타입이 같은 빈**을 찾아서 주입한다.
- getBean(MemberRepository.class)와 동일하다고 이해하면 된다.
- 생성자에 파라미터가 많아도 다 찾아서 자동으로 주입한다.

<br>

## 탐색 위치와 기본 스캔 대상

### 탐색할 패키지의 시작 위치 지정

컴포넌트 스캔의 시작 위치를 지정하여 탐색하도록 할 수 있다. 지정하지 않으면 @ComponentScan이 붙은 설정 정보 클래스의 패키지가 시작 위치가 된다.

- basePackages: 탐색할 패키지의 시작위치 지정, 해당 패키지를 포함한 하위 패키지 모두 탐색
- basePackageClasses: 지정한 클래스의 패키지를 탐색 시작 위치로 지정한다.

```java
@ComponentScan(
	basePackages = "hello.core.member",
)

// 시작 위치를 여러개 지정할 수도 있음
@ComponentScan(
	basePackages = {"hello.core", "hello.service"}
)
```

### 권장하는 방법

패키지 위치를 지정하지 않고, 설정 정보 클래스의 위치를 `프로젝트 최상단`에 두는 것을 권장한다. 프로젝트 메인 설정 정보는 프로젝트를 대표하는 정보이기 때문에 **시작 루트 위치**에 두는 것이 좋다.

참고로, 스프링 부트의 경우에도 대표 시작 정보인 **@SpringBootApplication**을 프로젝트 시작 루트 위치에 두는 것이 관례이다. (그리고 이 설정 안에 @ComponentScan이 들어있다.)

### 컴포넌트 스캔 기본 대상 및 스프링이 제공하는 부가 기능

컴포넌트 스캔은 @Component 뿐만 아니라 다음과 내용도 추가로 대상에 포함한다

- @Component: 컴포넌트 스캔에서 사용
- @Controller: `스프링 MVC 컨트롤러`에서 사용 및 인식
- @Service: 스프링 `비즈니스 로직`에서 사용, 개발자들이 비즈니스 계층을 인식하는데 도움이 됨
- @Repository: 스프링 `데이터 접근 계층`에서 사용 및 인식하고 데이터 계층의 예외를 스프링 예외로 변환해준다
- @Configuration: 스프링 설정 정보에서 사용 및 인식, 스프링 빈이 싱글톤을 유지하도록 추가 처리함

해당 클래스들의 소스코드를 보면 @Component를 포함하고 있다.

```java
@Component
public @interface Controller {
}

@Component
public @interface Service {
}

@Component
public @interface Configuration {
}
```

> **참고**
사실 애노테이션에는 상속관계라는 것이 없다. 그래서 이렇게 애노테이션이 특정 애노테이션을 들고 있는 것을 인식할 수 있는 것은 자바 언어가 지원하는 기능은 아니고, **스프링이 지원**하는 기능이다.
> 

> **참고**
useDefaultFilters 옵션은 기본으로 켜져있는데, 이 옵션을 끄면 기본 스캔 대상들이 제외된다.
그냥 이런 옵션이 있구나 정도 알고 넘어가자.
> 

<br>

## 필터

- includeFilters: 컴포넌트 스캔 대상을 추가로 지정
- excludeFilters: 컴포넌트 스캔에서 제회할 대상을 지정

**FilterType 옵션**

- ANNOTATION: 기본값, 애노테이션을 인식해서 동작한다.
- ASSIGNABLE_TYPE: 지정한 타입과 자식 타입을 인식해서 동작한다.
- ASPECTJ: AspectJ 패턴 사용
- REGEX: 정규 표현식
- CUSTOM: TypeFilter이라는 인터페이스를 구현해서 처리

> **참고**
@Component면 충분하기 때문에, includeFilters 를 사용할 일은 거의 없다. excludeFilters
는 여러가지 이유로 간혹 사용할 때가 있지만 많지는 않다. 특히 최근 스프링 부트는 컴포넌트 스캔을 기본으로 제공하는데, 개인적으로는 옵션을 변경하면서 사용하기
보다는 스프링의 기본 설정에 최대한 맞추어 사용하는 것을 권장하고, 선호하는 편이다.
> 

<br>

## 중복 등록과 충돌

컴포넌트 스캔에서 같은 빈 이름을 등록하면 어떻게 될까?

1. 자동 빈 등록 vs 자동 빈 등록
    
    → 오류 발생
    
2. 수동 빈 등록 vs 자동 빈 등록
    
    → 수동 빈이 우선권을 가짐
    

그러나, 최근 스프링 부트에서는 수동 빈 등록과 자동 빈 등록이 충돌나면 **오류가 발생**하도록 변경되었다.