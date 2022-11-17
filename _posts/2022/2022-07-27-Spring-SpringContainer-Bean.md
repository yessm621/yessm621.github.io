---
title:  "스프링 컨테이너와 스프링 빈"
# last_modified_at: 2022-07-27T11:10:00
last_modified_at: 2022-11-17T12:57:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

## 스프링 컨테이너

### 스프링 컨테이너란?

`스프링 컨테이너`란 스프링에서 **자바 객체들**을 관리하는 공간을 말한다. 여기서 자바 객체는 `스프링 빈(Bean)`을 의미한다. 즉, 스프링 컨테이너는 **빈의 생성부터 소멸까지의 생명주기를 관리**해주는 곳이다.

스프링 컨테이너의 종류에는 **ApplicationContext**와 BeanFactory가 있다. 하지만, BeanFactory를 직접 사용하는 경우는 거의 없으므로 일반적으로 ApplicationContext를 스프링 컨테이너라 한다.

### 스프링 컨테이너 생성

`ApplicationContext`는 **인터페이스**이다. 그리고 인터페이스이므로 **다형성**이 적용되어 있다. 스프링 컨테이너는 XML 기반으로 만들 수 있고 애노테이션 기반의 자바 설정 클래스로 만들 수 있다. (구현체)

```java
// AnnotationConfigApplicationContext은 ApplicationContext의 구현체
// AnnotationConfigApplicationContext은 애노테이션 기반의 자바 설정 클래스
ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
```

### 스프링 컨테이너의 생성과정

1. 스프링 컨테이너 생성
    
    new AnnotationConfigApplicationContext(AppConfig.class);로 스프링 컨테이너를 생성할 수 있다. 스프링 컨테이너가 생성되면서 내부에는 스프링 빈 저장소가 생성되는데 키가 빈 이름이고 값이 빈 객체이다. 스프링 컨테이너를 생성할 때는 AppConfig 같은 **설정 정보**를 파라미터로 넘겨 구성 정보를 지정해주어야 한다.
    
    ![1](https://user-images.githubusercontent.com/79130276/181144974-0c3fb81e-31f7-4b1b-aa04-f9b059c87ebb.png)
    
2. 스프링 빈 등록
    
    스프링 컨테이너는 파라미터로 넘어온 설정 클래스 정보(AppConfig)를 사용해서 **스프링 빈을 등록**한다. 빈 이름은 보통 메서드 이름을 사용한다. (직접 부여할 수도 있다.)
    
    ![2](https://user-images.githubusercontent.com/79130276/181144978-e20f7d01-b7e0-4016-bac1-df15d2509cef.png)
    

    > **주의**
    <br>
    빈 이름은 항상 다른 이름을 부여해야 한다. 같은 이름을 부여하면 다른 빈이 무시되거나 기존 빈을 덮어버리거나 설정에 따라 오류가 발생한다.
    > 

3. 스프링 빈 의존관계 설정
    
    스프링 컨테이너는 설정 정보를 참고해서 **의존관계를 주입(DI)**한다. 단순히 자바 코드를 호출하는 것 같지만, CGLIB라는 바이트코드 조작 라이브러리를 호출하는 것이다. 이에 대한 내용은 싱글톤 컨테이너에서 설명한다.**(링크 넣어주자!)**
    

    ![3](https://user-images.githubusercontent.com/79130276/181144983-9a0ebefe-8156-479d-a85f-d19724b80eef.png)

> **참고**
<br>
스프링은 빈을 생성하고, 의존관계를 주입하는 단계가 나누어져 있다. 그런데, 이렇게 자바 코드로 스프링 빈을 등록하면 생성자를 호출하면서 의존관계 주입도 한번에 처리된다. 여기서는 이해를 돕기 위해 개념적으로 나누어 설명했다. 자세한 내용은 의존관계 자동 주입에서 다시 설명하겠다.
> 

### 다양한 설정 형식 - 자바 코드, XML

스프링 컨테이너는 다양한 형식의 설정 정보를 받아들일 수 있게 유연하게 설계되어 있다. (자바 코드, XML, Groovy 등)

**애노테이션 기반 자바 코드 설정 사용**

AnnotationConfigApplicationContext 클래스를 사용하면서 자바 코드로된 설정 정보를 넘기면 된다.

```java
ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class)
```

**XML 설정 사용**

최근에는 스프링 부트를 많이 사용하면서 XML기반의 설정은 잘 사용하지 않는다. 하지만, 아직 많은 레거시 프로젝트들이 XML로 되어 있고, 또 XML을 사용하면 컴파일 없이 빈 설정 정보를 변경할 수 있는 장점도 있으므로 한번쯤 배워두는 것도 괜찮다.

```java
ApplicationContext ac = new GenericXmlApplicationContext("appConfig.xml");
```

### 스프링 빈 설정 메타 정보

스프링이 다양한 형식을 지원할 수 있는 이유는 BeanDefinition으로 추상화하여 사용하기 때문이다. BeanDefinition을 빈 설정 메타정보라 한다. @Bean, <bean>당 각각 하나의 메타 정보가 생성된다. 스프링 컨테이너는 이 메타정보를 기반으로 스프링 빈을 생성한다. 실무에서 BeanDefinition을 직접 정의하거나 사용할 일은 거의 없다.

## BeanFactory와 ApplicationContext

### BeanFactory

**BeanFactory**는 스프링 컨테이너의 최상위 인터페이스다. 스프링 빈을 관리하고 조회하는 역할을 담당하며 getBean()을 제공한다. **ApplicationContext**는 BeanFactory 기능을 모두 상속받아서 제공한다. 

![4](https://user-images.githubusercontent.com/79130276/181144985-e8863757-adc6-4ff6-a535-3a3b78aeae22.png)

앞서 스프링 컨테이너의 종류엔 BeanFactory와 ApplicationContext가 있지만 주로 ApplicationContext를 사용한다고 했다. 그 이유는 ApplicationContext은 빈을 관리하고 조회하는 기능은 물론이고, 수 많은 부가기능을 제공한다.

### ApplicationContext가 제공하는 부가기능

![5](https://user-images.githubusercontent.com/79130276/181144988-fc3a0b6b-e075-4c8f-a6aa-8f941aff53a3.png)

- 메시지소스를 활용한 국제화 기능: 예를 들어서 한국에서 들어오면 한국어로, 영어권에서 들어오면 영어로 출력
- 환경변수: 로컬, 개발, 운영 등을 구분해서 처리
- 애플리케이션 이벤트: 이벤트를 발행하고 구독하는 모델을 편리하게 지원
- 편리한 리소스 조회: 파일, 클래스패스, 외부 등에서 리소스를 편리하게 조회

ApplicationContext는 빈 관리기능 + 편리한 부가 기능을 제공한다. 따라서, BeanFactory를 직접 사용할 일은 거의 없고 부가기능이 포함된 `ApplicationContext`를 사용한다.

## 스프링 빈

### 스프링 빈이란?

스프링 빈은 스프링 컨테이너에 의해 관리되는 자바 객체를 의미한다.

### 스프링 빈 조회

스프링 빈을 조회할 일은 많지 않으므로 이런게 있다 정도로만 알아두자.

**컨테이너에 등록된 모든 빈 조회**

```java
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

String[] beanDefinitionNames = ac.getBeanDefinitionNames();
```

**스프링 빈 조회 - 기본**

```java
AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

// ac.getBean(빈이름, 타입)
MemberService memberService = ac.getBean("memberService", MemberService.class);
// ac.getBean(타입)
MemberService memberService = ac.getBean(MemberService.class);
```

**[참고]**

#1과 #2 코드는 동일한 코드이다. 하지만 #1처럼 DiscountPolicy로 쓰는 것이 좋다. #1 코드는 역할과 구현을 분리한 코드이다. DIP 원칙을 지키는 코드가 좋은 코드이다. (역할 DiscountPolicy, 구현 rateDiscountPolicy)

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