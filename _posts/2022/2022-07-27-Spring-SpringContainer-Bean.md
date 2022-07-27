---
title:  "스프링 컨테이너와 스프링 빈"
last_modified_at: 2022-07-27T11:10:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

## 스프링 컨테이너 생성

ApplicationContext를 스프링 컨테이너라 하며 인터페이스이다. 인터페이스이므로 다형성이 적용되어 있다. 스프링 컨테이너는 XML 기반으로 만들 수 있고 애노테이션 기반의 자바 설정 클래스로 만들 수 있다. 

```java
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
```

> **참고**
더 정확히는 스프링 컨테이너를 부를 때 BeanFactory, ApplicationContext로 구분해서 이야기한다. BeanFactory를 직접 사용하는 경우는 거의 없으므로 일반적으로 ApplicationContext를 스프링 컨테이너라 한다.
>

<br>

### 스프링 컨테이너의 생성과정

1. 스프링 컨테이너 생성
    
    new AnnotationConfigApplicationContext(AppConfig.class)로 스프링 컨테이너를 생성할 수 있다. 스프링 컨테이너가 생성되면서 내부에는 스프링 빈 저장소가 생성되는데 키가 빈 이름이고 값이 빈 객체이다. 스프링 컨테이너를 생성할 때는 AppConfig 같은 설정 정보를 파라미터로 넘겨 구성 정보를 지정해주어야 한다.
    
    ![1](https://user-images.githubusercontent.com/79130276/181144974-0c3fb81e-31f7-4b1b-aa04-f9b059c87ebb.png)
    
2. 스프링 빈 등록
    
    스프링 컨테이너는 파라미터로 넘어온 설정 클래스 정보(AppConfig)를 사용해서 스프링 빈을 등록한다. 빈 이름은 보통 메서드 이름을 사용한다. (직접 부여할 수도 있다)
    
    ![2](https://user-images.githubusercontent.com/79130276/181144978-e20f7d01-b7e0-4016-bac1-df15d2509cef.png)

    > **주의**
    빈 이름은 항상 다른 이름을 부여해야 한다. 같은 이름을 부여하면 다른 빈이 무시되거나 기존 빈을 덮어버리거나 설정에 따라 오류가 발생한다.
    > 

3. 스프링 빈 의존관계 설정
    
    스프링 컨테이너는 설정 정보를 참고해서 의존관계를 주입(DI)한다. 단순히 자바 코드를 호출하는 것 같지만, 차이가 있다. 이 차이는 뒤에 싱글톤 컨테이너에서 설명한다.
    
    ![3](https://user-images.githubusercontent.com/79130276/181144983-9a0ebefe-8156-479d-a85f-d19724b80eef.png)

    > **참고**
    <br>
    스프링은 빈을 생성하고, 의존관계를 주입하는 단계가 나누어져 있다. 그런데, 이렇게 자바 코드로 스프링 빈을 등록하면 생성자를 호출하면서 의존관계 주입도 한번에 처리된다. 여기서는 이해를 돕기 위해 개념적으로 나누어 설명했다. 자세한 내용은 의존관계 자동 주입에서 다시 설명하겠다.
    > 

<br>

## 스프링 빈 조회

### 컨테이너에 등록된 모든 빈 조회

스프링 컨테이너에 실제 스프링 빈들이 잘 등록되었는지 확인

```java
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

@Test
@DisplayName("모든 빈 출력하기")
void findAllBean() {
    String[] beanDefinitionNames = ac.getBeanDefinitionNames();
    for (String beanDefinitionName : beanDefinitionNames) {
        Object bean = ac.getBean(beanDefinitionName);
        System.out.println("name = " + beanDefinitionName + " object = " + bean);
    }
}

@Test
@DisplayName("애플리케이션 빈 출력하기")
void findApplicationBean() {
    String[] beanDefinitionNames = ac.getBeanDefinitionNames();
    for (String beanDefinitionName : beanDefinitionNames) {
        BeanDefinition beanDefinition = ac.getBeanDefinition(beanDefinitionName);

        //Role ROLE_APPLICATION: 직접 등록한 애플리케이션 빈
        //Role ROLE_INFRASTRUCTURE: 스프링이 내부에서 사용하는 빈
        if (beanDefinition.getRole() == BeanDefinition.ROLE_APPLICATION) {
            Object bean = ac.getBean(beanDefinitionName);
            System.out.println("name = " + beanDefinitionName + " object = " + bean);
        }
    }
}
```

- 모든 빈 출력하기: 실행하면 스프링에 등록된 모든 빈 정보를 출력하는 테스트
    - ac.getBeanDefinitionNames(): 스프링에 등록된 모든 빈 이름을 조회한다.
    - ac.getBean(): 빈 이름으로 빈 객체(인스턴스)를 조회한다.
- 애플리케이션 빈 출력하기: 사용자가 등록한 빈만 출력하는 테스트
    - 스프링이 내부에서 사용하는 빈은 getRole()로 구분할 수 있다.
        - ROLE_APPLICATION: 일반적으로 사용자가 정의한 빈
        - ROLE_INFRASTRUCTURE: 스프링이 내부에서 사용하는 빈
        

<br>

### 스프링 빈 조회 - 기본

스프링 컨테이너에서 스프링 빈을 찾는 기본적인 조회 방법

- ac.getBean(빈이름, 타입)
- ac.getBean(타입)
- 조회 대상 스프링 빈이 없으면 예외 발생
    - NoSuchBeanDefinitionException: No bean named ‘xxxx’ abailable

```java
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

@Test
@DisplayName("빈 이름으로 조회")
void findBeanByName() {
    MemberService memberService = ac.getBean("memberService", MemberService.class);
    assertThat(memberService).isInstanceOf(MemberServiceImpl.class);
}

@Test
@DisplayName("이름 없이 타입으로만 조회")
void findBeanByType() {
    MemberService memberService = ac.getBean(MemberService.class);
    assertThat(memberService).isInstanceOf(MemberServiceImpl.class);
}

@Test
@DisplayName("구체 타입으로 조회")
void findBeanByName2() {
    MemberServiceImpl memberService = ac.getBean("memberService", MemberServiceImpl.class);
    assertThat(memberService).isInstanceOf(MemberServiceImpl.class);
}

@Test
@DisplayName("빈 이름으로 조회X")
void findBeanByNameX() {
    assertThrows(NoSuchBeanDefinitionException.class,
            () -> ac.getBean("xxxx", MemberService.class));
}
```

<br>

### 스프링 빈 조회 - 동일한 타입이 둘 이상

- 타입으로 조회시 같은 타입의 스프링 빈이 둘 이상이면 오류가 발생한다. 이때는 빈 이름을 지정하자.
- ac.getBeansOfType()을 사용하면 해당 타입의 모든 빈을 조회할 수 있다.

```java
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(SameBeanConfig.class);

@Test
@DisplayName("타입으로 조회시 같은 타입이 둘 이상 있으면, 중복 오류가 발생한다")
void findBeanByTypeDuplicate() {
    assertThrows(NoUniqueBeanDefinitionException.class,
            () -> ac.getBean(MemberRepository.class));
}

@Test
@DisplayName("타입으로 조회시 같은 타입이 둘 이상 있으면, 빈 이을 지정하면 된다")
void findBeanByName() {
    MemberRepository memberRepository = ac.getBean("memberRepository1", MemberRepository.class);
    assertThat(memberRepository).isInstanceOf(MemberRepository.class);
}

@Test
@DisplayName("특정 타입을 모두 조회하기")
void findAllBeanByType() {
    Map<String, MemberRepository> beansOfType = ac.getBeansOfType(MemberRepository.class);
    for (String key : beansOfType.keySet()) {
        System.out.println("key = " + key + " value = " + beansOfType.get(key));
    }
    System.out.println("beansOfType = " + beansOfType);
    assertThat(beansOfType.size()).isEqualTo(2);
}

@Configuration
static class SameBeanConfig {

    @Bean
    public MemberRepository memberRepository1() {
        return new MemoryMemberRepository();
    }

    @Bean
    public MemberRepository memberRepository2() {
        return new MemoryMemberRepository();
    }
}
```

테스트를 진행하기 위해 AppConfig 대신 동일한 타입이 둘 이상인 SameBeanConfig를 정의했다.

참고로 static class로 정의하면 정의한 클래스 내부 안에서만 사용 가능함

<br>

### 스프링 빈 조회 - 상속 관계

- 부모 타입으로 조회하면 자식 타입도 함께 조회한다.
- 그래서 모든 자바 객체의 최고 부모인 Object 타입으로 조회하면, 모든 스프링 빈을 조회한다.

```java
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(TestConfig.class);

@Test
@DisplayName("부모 타입으로 조회시, 자식이 둘 이상 있으면, 중복 오류가 발생한다")
void findBeanByParentTypeDuplicate() {
    assertThrows(NoUniqueBeanDefinitionException.class,
            () -> ac.getBean(DiscountPolicy.class));
}

@Test
@DisplayName("부모 타입으로 조회시, 자식이 둘 이상 있으면, 빈 이름을 지정하면 된다")
void findBeanByParentTypeBeanName() {
    DiscountPolicy rateDiscountPolicy = ac.getBean("rateDiscountPolicy", DiscountPolicy.class);
    assertThat(rateDiscountPolicy).isInstanceOf(RateDiscountPolicy.class);
}

@Test
@DisplayName("특정 하위 타입으로 조회")
void findBeanBySubType() {
    RateDiscountPolicy bean = ac.getBean(RateDiscountPolicy.class);
    assertThat(bean).isInstanceOf(RateDiscountPolicy.class);
}

@Test
@DisplayName("부모 타입으로 모두 조회하기")
void findAllBeanByParentType() {
    Map<String, DiscountPolicy> beansOfType = ac.getBeansOfType(DiscountPolicy.class);
    assertThat(beansOfType.size()).isEqualTo(2);
    for (String key : beansOfType.keySet()) {
        System.out.println("key = " + key + " value = " + beansOfType.get(key));
    }
}

@Test
@DisplayName("부모 타입으로 모두 조회하기 - Object")
void findallBeanByObjectType() {
    Map<String, Object> beansOfType = ac.getBeansOfType(Object.class);
    for (String key : beansOfType.keySet()) {
        System.out.println("key = " + key + " value = " + beansOfType.get(key));
    }
}

@Configuration
static class TestConfig {
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

<br>

**[참고]**

```java
// #1
@Bean
public DiscountPolicy rateDiscountPolicy() {
    return new RateDiscountPolicy();
}

// #2
@Bean
public RateDiscountPolicy rateDiscountPolicy() {
    return new RateDiscountPolicy();
}
```

#1과 #2 코드는 동일한 코드이다. 그런데 #1처럼 DiscountPolicy로 쓰는 이유는 무엇일까?

우리가 개발하거나 설계를 할때 역할과 구현을 항상 쪼개자고 했었는데 그걸 추구하고자 하는 것

역할: DiscountPolicy, 구현: rateDiscountPolicy 인 것이다.

<br>

조회하는 기본적인 방법들을 알아보았는데, 사실 AnnotationConfigApplicationContext의 getBean()을 사용해서 조회할 일은 거의 없다.

<br>

## BeanFactory와 ApplicationContext

**BeanFactory**는 ****스프링 컨테이너의 최상위 인터페이스다. 스프링 빈을 관리하고 조회하는 역할을 담당하며 getBean()을 제공한다. **ApplicationContext**는 BeanFactory 기능을 모두 상속받아서 제공한다. 

![4](https://user-images.githubusercontent.com/79130276/181144985-e8863757-adc6-4ff6-a535-3a3b78aeae22.png)

빈을 관리하고 검색하는 기능을 BeanFactory가 제공해주는데, 그러면 BeanFactory와 ApplicationContext의 차이점은 뭘까? 애플리케이션을 개발할 때는 빈을 관리하고 조회하는 기능은 물론이고, 수 많은 부가기능이 필요하다.

![5](https://user-images.githubusercontent.com/79130276/181144988-fc3a0b6b-e075-4c8f-a6aa-8f941aff53a3.png)

- 메시지소스를 활용한 국제화 기능: 예를 들어서 한국에서 들어오면 한국어로, 영어권에서 들어오면 영어로 출력
- 환경변수: 로컬, 개발, 운영 등을 구분해서 처리
- 애플리케이션 이벤트: 이벤트를 발행하고 구독하는 모델을 편리하게 지원
- 편리한 리소스 조회: 파일, 클래스패스, 외부 등에서 리소스를 편리하게 조회

<br>

ApplicationContext는 BeanFactory의 기능을 상속받는다. ApplicationContext는 빈 관리기능 + 편리한 부가 기능을 제공한다. BeanFactory를 직접 사용할 일은 거의 없고 부가기능이 포함된 `ApplicationContext`를 사용한다. BeanFactory나 ApplicationContext를 스프링 컨테이너라 한다.

<br>

## 다양한 설정 형식 지원 - 자바 코드, XML

스프링 컨테이너는 다양한 형식의 설정 정보를 받아들일 수 있게 유연하게 설계되어 있다. (자바 코드, XML, Groovy 등)

![6](https://user-images.githubusercontent.com/79130276/181144990-40358071-23d9-4fca-8a00-79b404455327.png)

<br>

### 애노테이션 기반 자바 코드 설정 사용

AnnotationConfigApplicationContext 클래스를 사용하면서 자바 코드로된 설정 정보를 넘기면 된다.

```java
new AnnotationConfigApplicationContext(AppConfig.class)
```

<br>

### XML 설정 사용

최근에는 스프링 부트를 많이 사용하면서 XML기반의 설정은 잘 사용하지 않는다. 하지만, 아직 많은 레거시 프로젝트들이 XML로 되어 있고, 또 XML을 사용하면 컴파일 없이 빈 설정 정보를 변경할 수 있는 장점도 있으므로 한번쯤 배워두는 것도 괜찮다. GenericXmlApplicationContext를 사용해 xml 설정 파일을 넘기면 된다.

```java
@Test
void xmlAppContext() {
    ApplicationContext ac = new GenericXmlApplicationContext("appConfig.xml");
    MemberService memberService = ac.getBean("memberService", MemberService.class);
    assertThat(memberService).isInstanceOf(MemberService.class);
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="memberService" class="hello.core.member.MemberServiceImpl">
        <constructor-arg name="memberRepository" ref="memberRepository" />
    </bean>

    <bean id="memberRepository" class="hello.core.member.MemoryMemberRepository" />

    <bean id="orderService" class="hello.core.order.OrderServiceImpl">
        <constructor-arg name="memberRepository" ref="memberRepository" />
        <constructor-arg name="discountPolicy" ref="discountPolicy" />
    </bean>

    <bean id="discountPolicy" class="hello.core.discount.RateDiscountPolicy" />
</beans>
```