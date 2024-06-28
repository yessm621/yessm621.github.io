---
title: "스프링 AOP 개념과 주요 용어 (with 프록시)"
categories:
  - Spring
tags:
  - AOP
toc: true
toc_sticky: true
---

# 개요

AOP(Aspect-Oriendted Prograimming)는 관점 지향 프로그래밍이란 뜻으로 주로 코드의 횡단 관심사를 처리하기 위해 사용된다. (예. 로깅, 트랜잭션 관리 등)

AOP를 이해하기 위해선 프록시 개념을 먼저 이해해야 한다. 횡단 관심사를 구현하기 위해 프록시를 점진적으로 어떻게 발전시켰는지 그 과정을 알아보고 마지막에 스프링 AOP 개념과 주요 용어에 대해 알아보자.

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/360922a8-5763-4173-a7db-3c1a7a7ed37e)

<br>

# 프록시

## 프록시(Proxy)

클라이언트와 서버 개념에서 일반적으로 클라이언트가 서버를 직접 호출하고, 처리 결과를 직접 받는다. 이것을 직접 호출이라 한다.

그런데 클라이언트가 요청한 결과를 서버에 직접 요청하는 것이 아니라 어떤 대리자를 통해서 대신 **간접적**으로 서버에 요청할 수 있다. 여기서 대리자를 영어로 `프록시(Proxy)`라 한다.

![2](https://github.com/yessm621/yessm621.github.io/assets/79130276/f77ed417-e1d2-4dc5-9f65-a1653a45e519)

### 프록시의 역할 - 대체 가능

클라이언트는 서버에게 요청한 것인지 프록시에게 요청한 것인지 몰라야 한다. 따라서, 프록시와 서버는 같은 인터페이스를 사용해야 한다.

아래 그림의 클래스 의존관계를 보면 클라이언트는 ServerInterface에 의존하고 있다. 그리고 프록시와 서버가 ServerInterface를 사용한다.

![3](https://github.com/yessm621/yessm621.github.io/assets/79130276/536e2c0a-6d57-4a8e-8e46-968fb2c178a1)

런타임 시점(애플리케이션 실행 시점)에 DI를 사용하면 Server에서 Proxy로 의존관계를 변경해도 클라이언트 코드 변경되지 않는다. 이처럼 프록시는 대체 가능해야 하고 실제 서버 처럼 동작할 수 있어야 한다.

### 프록시의 주요 기능

프록시의 주요 기능은 크게 2가지로 나눌 수 있다.

1. 접근 제어
    - 권한에 따른 접근 차단
    - 캐싱: 클라이언트가 프록시를 사용하다가 실제 요청이 있을 때 데이터를 조회하는 기능
    - 지연 로딩
2. 부가 기능 추가
    - 원래 서버가 제공하는 기능에 더해서 부가 기능을 수행한다.
    - 예) 로그 남기기

## 프록시 패턴과 데코레이터 패턴

프록시를 사용하는 디자인 패턴은 `프록시 패턴`과 `데코레이터 패턴`이 있다. 이 둘은 **의도에 따라 구분**될 뿐, 클래스 의존 관계는 거의 동일하다.

- 프록시 패턴: 접근 제어가 목적 (캐싱)
- 데코레이터 패턴: 새로운 기능 추가가 목적

![4](https://github.com/yessm621/yessm621.github.io/assets/79130276/1e8b744c-d975-421f-adca-aaac76eb2007)

![5](https://github.com/yessm621/yessm621.github.io/assets/79130276/dae4030d-40fe-42ac-adb5-3e381369ab5d)

> **참고** 프록시와 프록시 패턴은 다른 것이다.
> 

## 인터페이스 기반 프록시와 클래스 기반 프록시

인터페이스가 있는 경우, 인터페이스가 없고 클래스만 있는 경우. 두 경우 모두 프록시를 적용할 수 있다. 하지만 각자 단점이 존재한다.

- 클래스 기반 프록시는 해당 클래스에만 적용할 수 있다. 인터페이스 기반 프록시는 인터페이스만 같으면 모든 곳에 적용할 수 있다.
- 인터페이스 기반 프록시의 단점은 인터페이스가 필요하다는 그 자체이다.
- 클래스 기반 프록시는 상속을 사용하기 때문에 몇가지 제약이 있다.
    - 부모 클래스의 생성자를 호출해야 한다.
    - 클래스에 final 키워드가 붙으면 상속이 불가능하다. (자바 기본)
    - 메서드에 final 키워드가 붙으면 해당 메서드를 오버라이딩 할 수 없다.

<br>

# 동적 프록시 기술

프록시를 사용해서 인터페이스 기반 프록시와 클래스 기반 프록시를 만들 수 있다. 그런데 문제는 프록시 클래스를 너무 많이 만들어야 한다.

로그 추적기라는 기능을 만들고 있다고 가정하자. 이때 로그 추적기를 적용해야 하는 대상 클래스가 100개라면 프록시 클래스도 100개 생성해야 한다. 동적 프록시 기술은 이와 같은 문제를 해결해준다.

자바는 `JDK 동적 프록시` 기술이나 `CGLIB`를 활용해 프록시 객체를 동적으로 만들어낼 수 있다. 즉, 프록시 클래스를 계속 만들지 않아도 된다. 프록시를 적용할 코드를 하나만 만들어두고 동적 프록시 기술을 사용해서 프록시 객체를 찍어내면 된다.

## JDK 동적 프록시

JDK 동적 프록시는 인터페이스가 있는 경우에 사용하는 동적 프록시 기술이다.

> **참고** JDK 동적 프록시를 사용할 때 중요한 개념이 바로 리플렉션이다. 리플렉션은 클래스나 메서드의 메타정보를 사용해서 동적으로 호출하는 메서드를 변경할 수 있다.
> 

### JDK 동적 프록시 특징

- 인터페이스가 필수
- InvocationHandler 인터페이스를 사용해서 구현

![6](https://github.com/yessm621/yessm621.github.io/assets/79130276/c0ee3108-0ed6-4ba4-b5af-a46290399f6e)

![7](https://github.com/yessm621/yessm621.github.io/assets/79130276/58ad2984-7d66-461f-8550-6260905e1b69)

## CGLIB

CGLIB는 바이트 코드를 조작해서 동적으로 클래스를 생성하는 기술을 제공하는 라이브러리이다.

### CGLIB 특징

- 인터페이스 없이 구체 클래스만 가지고 동적 프록시 생성
- MethodInterceptor 인터페이스를 사용해서 구현
- 클래스 기반 프록시와 마찬가지로 상속을 사용하기 때문에 몇가지 제약이 있다.
    - 부모 클래스의 생성자를 체크해야 한다. → CGLIB는 자식 클래스를 동적으로 생성하기 때문에 기본 생성자가 필요하다.
    - 클래스에 final 키워드가 붙으면 상속이 불가능하다. → CGLIB에서는 예외가 발생한다.
    - 메서드에 final 키워드가 붙으면 해당 메서드를 오버라이딩 할 수 없다. → CGLIB에서는 프록시 로직이 동작하지 않는다.

![8](https://github.com/yessm621/yessm621.github.io/assets/79130276/367a6c5f-abde-4796-87b2-a7f83e688fc7)

하지만 동적 프록시에도 단점이 있다.

- 인터페이스가 있는 경우에는 `JDK 동적 프록시`를 적용하고, 그렇지 않은 경우에는 `CGLIB`를 적용하려면 어떻게 해야할까?
- 두 기술을 함께 사용할 때 부가 기능을 제공하기 위해서 JDK 동적 프록시가 제공하는 InvocationHandler와 CGLIB가 제공하는 MethodInterceptor를 각각 중복으로 만들어서 관리해야 할까?
- 특정 조건에 맞을 때 프록시 로직을 적용하는 기능도 공통으로 제공되었으면?

<br>

# 프록시 팩토리

## 프록시 팩토리

스프링은 동적 프록시를 통합해서 편리하게 만들어주는 `프록시 팩토리(ProxyFactory)`라는 기능을 제공한다.

이전에는 상황에 따라서 JDK 동적 프록시를 사용하거나 CGLIB를 사용해야 했다면, 이제는 이 프록시 팩토리 하나로 편리하게 동적 프록시를 생성할 수 있다. 프록시 팩토리는 인터페이스가 있으면 JDK 동적 프록시를 사용하고, 구체 클래스만 있다면 CGLIB를 사용한다. 그리고 이 설정을 변경할 수도 있다.

![9](https://github.com/yessm621/yessm621.github.io/assets/79130276/afea8d4b-d8b9-4ab1-8efd-aedcb42f5514)


또한, JDK 동적 프록시가 제공하는 InvocationHandler와 CGLIB가 제공하는 MethodInterceptor를 각각 만들 필요없이 `Advice`를 만들면 된다. 프록시 팩토리를 사용하면 Advice를 호출하는 전용 InvocationHandler, MethodInterceptor를 내부에서 사용한다.

![10](https://github.com/yessm621/yessm621.github.io/assets/79130276/22d86cad-c654-4b34-973b-b71c33c066cb)

스프링은 `Pointcut`을 사용해 특정 조건에 부합할 때 프록시 부가 기능이 적용되도록 한다.

## Pointcut, Advice, Advisor

다음 용어는 스프링 AOP에서 자주 보게될 용어이다. 확실하게 알아두는 것이 좋다.

- **포인트컷**(Pointcut): 어디에 부가 기능을 적용할지, 어디에 부가 기능을 적용하지 않을지 판단하는 필터링 로직이다. 주로 클래스와 메서드 이름으로 필터링 한다.
- **어드바이스**(Advice): 프록시가 호출하는 부가 기능이다. 단순하게 프록시 로직이라 생각하면 된다.
- **어드바이저**(Advisor): 단순하게 하나의 포인트컷과 하나의 어드바이스를 가지고 있는 것이다. 쉽게 이야기해서 **포인트컷1 + 어드바이스1**이다.

다음과 같이 기억하면 외우기 쉽다.

- 조언(Advice)을 어디(Pointcut)에 할 것인가?
- 조언자(Advisor)는 어디(Pointcut)에 조언(Advice)을 해야할지 알고 있다.

### 정리

- 포인트컷은 대상 여부를 확인하는 필터 역할만 담당한다.
- 어드바이스는 깔끔하게 부가 기능 로직만 담당한다.
- 둘을 합치면 어드바이저가 된다. 스프링의 어드바이저는 하나의 포인트컷 + 하나의 어드바이스로 구성된다.

![11](https://github.com/yessm621/yessm621.github.io/assets/79130276/e569f802-9348-4900-bfd2-ca6a16e5ec1e)

![12](https://github.com/yessm621/yessm621.github.io/assets/79130276/e3aed06c-ff14-4666-bc71-f3fbdb6e0c85)


- 하나의 프록시에 여러 어드바이저를 적용할 수 있다.

![13](https://github.com/yessm621/yessm621.github.io/assets/79130276/0889f524-d179-4e52-8930-c440d14732e0)

프록시 팩토리와 Advice, Pointcut 개념을 사용해 프록시를 적용하는 방법에 대해 알아보았다. 하지만 프록시 팩토리도 너무 많은 설정정보를 작성해야 한다. 또한 컴포넌트 스캔으로  스프링 빈을 등록하는 방식에는 프록시 팩토리를 적용할 수 없다.

<br>

# 자동 프록시 생성기(빈 후처리기)

## 빈 후처리기(BeanPostProcessor)

스프링이 빈 저장소에 등록할 목적으로 생성한 객체를 빈 저장소에 등록하기 직전에 조작하고 싶다면 빈 후처리기를 사용하면 된다. 빈 후처리기는 이름 그대로 빈을 생성한 후에 무언가를 처리하는 용도로 사용한다.

빈 후처리기는 객체를 조작할 수도 있고, 완전히 다른 객체로 바꿔치기 하는 것도 가능하다.

![14](https://github.com/yessm621/yessm621.github.io/assets/79130276/f2847eaf-878b-4035-aea7-e46881f5fb8d)

![15](https://github.com/yessm621/yessm621.github.io/assets/79130276/4358782a-707e-413e-a3b6-0b08b3c60c15)

빈 후처리기를 사용해서 실제 객체 대신 프록시를 스프링 빈으로 등록하는 것도 가능하다. 이렇게 하면 수동으로 등록하는 빈은 물론이고, 컴포넌트 스캔을 사용하는 빈까지 모두 프록시를 적용할 수 있다. 더 나아가서 설정 파일에 있는 수 많은 프록시 생성 코드도 한번에 제거할 수 있다.

![16](https://github.com/yessm621/yessm621.github.io/assets/79130276/e8bd194e-e7e7-478b-aeda-6e270dd8e28d)

## 자동 프록시 생성기 - AutoProxyCreator

`자동 프록시 생성기`는 스프링이 제공하는 빈 후처리기이다. 이름 그대로 자동으로 프록시를 생성해주는 빈 후처리기이다. 

```groovy
//이 라이브러리를 추가하면 스프링 부트가 AOP 관련 클래스를 자동으로 스프링 빈에 등록한다.
implementation 'org.springframework.boot:spring-boot-starter-aop'
```

- 이 빈 후처리기는 스프링 빈으로 등록된 Advisor들을 자동으로 찾아서 프록시가 필요한 곳에 자동으로 프록시를 적용해준다.
- Advisor 안에는 Pointcut과 Advice가 이미 모두 포함되어 있다. 따라서 Advisor만 알고 있으면 그 안에 있는 Pointcut으로 어떤 스프링 빈에 프록시를 적용해야 할지 알 수 있다. 그리고 Advice로 부가 기능을 적용하면 된다.

자동 프록시 생성기의 작동 과정을 알아보자.

![17](https://github.com/yessm621/yessm621.github.io/assets/79130276/5320539d-0c5a-4101-9b3f-fd5745cf86b6)

1. 생성: 스프링이 스프링 빈 대상이 되는 객체를 생성한다. (@Bean, 컴포넌트 스캔 모두 포함)
2. 전달: 생성된 객체를 빈 저장소에 등록하기 직전에 빈 후처리기에 전달한다.
3. 모든 Advisor 빈 조회: 자동 프록시 생성기 - 빈 후처리기는 스프링 컨테이너에서 모든 Advisor를 조회한다.
4. 프록시 적용 대상 체크: 앞서 조회한 Advisor에 포함되어 있는 포인트컷을 사용해서 해당 객체가 프록시를 적용할 대상인지 아닌지 판단한다. 이때 객체의 클래스 정보는 물론이고, 해당 객체의 모든 메서드를 포인트컷에 하나하나 모두 매칭해본다. 그래서 조건이 하나라도 만족하면 프록시 적용 대상이 된다.
5. 프록시 생성: 프록시 적용 대상이면 프록시를 생성하고 반환해서 프록시를 스프링 빈으로 등록한다. 만약 프록시 적용 대상이 아니라면 원본 객체를 반환해서 원본 객체를 스프링 빈으로 등록한다.
6. 빈 등록: 반환된 객체는 스프링 빈으로 등록된다.

### 포인트컷은 2가지에 사용된다.

1. 프록시 적용 여부 판단 - 생성 단계: 자동 프록시 생성기는 포인트컷을 사용해서 해당 빈이 프록시를 생성할 필요가 있는지 없는지 체크한다.
2. 어드바이스 적용 여부 판단 - 사용 단계: 프록시가 호출되었을 때 부가 기능인 어드바이스를 적용할지 말지 포인트컷을 보고 판단한다.

## @Aspect

스프링 애플리케이션에 프록시를 적용하려면 포인트컷과 어드바이스로 구성되어 있는 어드바이저(Advisor)를 만들어서 스프링 빈으로 등록하면 된다.(`@Aspect` 애노테이션 사용)

그러면 나머지는 앞서 배운 `자동 프록시 생성기`가 모두 자동으로 처리해준다. 자동 프록시 생성기는 스프링 빈으로 등록된 어드바이저들을 찾고, 스프링 빈들에 자동으로 프록시를 적용해준다. (물론 포인트컷이 매칭되는 경우에 프록시를 생성한다.)

스프링은 `@Aspect 애노테이션`으로 매우 편리하게 포인트컷과 어드바이스로 구성되어 있는 어드바이저 생성 기능을 지원한다.

**즉, @Aspect와 자동 프록시 생성기를 통해 스프링 AOP를 사용할 수 있다.**

![18](https://github.com/yessm621/yessm621.github.io/assets/79130276/99640080-39f4-481c-b82f-f6702c389394)

- @Aspect는 애노테이션 기반 프록시를 적용할 때 필요
- @Around에 포인트컷 표현식을 넣는다. 표현식은 AspectJ 표현식을 사용
    - AspectJ라는 AOP에 특화된 포인트컷 표현식을 적용할 수 있다. (실무에서 사용)
- @Around의 메서드가 어드바이스가 된다.

<br>

# 스프링 AOP

애플리케이션은 크게 핵심 기능과 부가 기능으로 나눌 수 있다. AOP는 부가 기능을 처리하기 위한 방법이다.

우리는 이전에 @Aspect에 대해 알아보았다.

- 애스펙트는 쉽게 이야기해서 부가 기능과, 해당 부가 기능을 어디에 적용할지 정의한 것이다. 예를 들어서 로그 출력 기능을 모든 컨트롤러에 적용해라 라는 것이 정의되어 있다.
- 스프링이 제공하는 어드바이저도 개념상 하나의 애스팩트이다.

`AOP`란 관점 지향 프로그래밍(Aspect-Oriented Programming)이라 한다. AOP는 아래 그림과 같이 횡단 관심사를 해결하기 위한 목적을 가지고 있다. 참고로 AOP는 OOP를 대체하기 위한 것이 아니라 횡단 관심사를 깔끔하게 처리하기 어려운 OOP의 부족한 부분을 보조하는 목적으로 개발되었다.

![19](https://github.com/yessm621/yessm621.github.io/assets/79130276/28be7c57-cf1a-41b8-839f-f2c69c3d4385)

## 스프링 AOP 용어 정리

![20](https://github.com/yessm621/yessm621.github.io/assets/79130276/757415c9-a044-4cd4-bcb6-40344faae4dd)

![21](https://github.com/yessm621/yessm621.github.io/assets/79130276/050c81e5-d915-414d-ba9c-bab256401a88)

- 조인 포인트(Join point)
    - 어드바이스가 적용될 수 있는 위치, 메소드 실행, 생성자 호출, 필드 값 접근, static 메서드 접근 같은 프로그램 실행 중 지점
    - 조인 포인트는 추상적인 개념이다. AOP를 적용할 수 있는 모든 지점이라 생각하면 된다.
    - 스프링 AOP는 프록시 방식을 사용하므로 조인 포인트는 항상 메소드 실행 지점으로 제한된다.
- 포인트컷(Pointcut)
    - 조인 포인트 중에서 어드바이스가 적용될 위치를 선별하는 기능
    - 주로 AspectJ 표현식을 사용해서 지정
    - 프록시를 사용하는 스프링 AOP는 메서드 실행 지점만 포인트컷으로 선별 가능
- 타켓(Target)
    - 어드바이스를 받는 객체, 포인트컷으로 결정
- 어드바이스(Advice)
    - 부가 기능
    - 특정 조인 포인트에서 Aspect에 의해 취해지는 조치
    - Around(주변), Before(전), After(후)와 같은 다양한 종류의 어드바이스가 있음
- 애스펙트(Aspect)
    - 어드바이스 + 포인트컷을 모듈화 한 것
    - @Aspect를 생각하면 됨
    - 여러 어드바이스와 포인트 컷이 함께 존재
- 어드바이저(Advisor)
    - 하나의 어드바이스와 하나의 포인트 컷으로 구성
    - 스프링 AOP에서만 사용되는 특별한 용어
- 위빙(Weaving)
    - 포인트컷으로 결정한 타켓의 조인 포인트에 어드바이스를 적용하는 것
    - 위빙을 통해 핵심 기능 코드에 영향을 주지 않고 부가 기능을 추가 할 수 있음
    - AOP 적용을 위해 애스펙트를 객체에 연결한 상태
        - 컴파일 타임(AspectJ compiler)
        - 로드 타임
        - 런타임, 스프링 AOP는 런타임, 프록시 방식
- AOP 프록시
    - AOP 기능을 구현하기 위해 만든 프록시 객체, 스프링에서 AOP 프록시는 JDK 동적 프록시 또는
    CGLIB 프록시이다.

## AOP 적용 방식

AOP를 사용하면 핵심 기능과 부가 기능이 코드상 완전히 분리되어서 관리된다. AOP를 사용할 때 부가 기능 로직은 다음 3가지 방식으로 실제 로직에 추가된다.

- 컴파일 시점
- 클래스 로딩 시점
- 런타임 시점(프록시)

### 컴파일 시점

![22](https://github.com/yessm621/yessm621.github.io/assets/79130276/0a099ccd-a723-4a4b-8e9c-a5522fefe61a)

.java 소스 코드를 컴파일러를 사용해서 .class를 만드는 시점에 부가 기능 로직을 추가할 수 있다. 이때는 AspectJ가 제공하는 특별한 컴파일러를 사용해야 한다. 컴파일 된 .class를 디컴파일 해보면 애스펙트 관련 호출 코드가 들어간다. 이해하기 쉽게 풀어서 이야기하면 부가 기능 코드가 핵심 기능이 있는 컴파일된 코드 주변에 실제로 붙어 버린다고 생각하면 된다. AspectJ 컴파일러는 Aspect를 확인해서 해당 클래스가 적용 대상인지 먼저 확인하고, 적용 대상인 경우에 부가 기능 로직을 적용한다. 참고로 이렇게 원본 로직에 부가 기능 로직이 추가되는 것을 위빙(Weaving)이라 한다.

- 위빙(Weaving): 옷감을 짜다. 직조하다. 애스펙트와 실제 코드를 연결해서 붙이는 것

**컴파일 시점 - 단점**

컴파일 시점에 부가 기능을 적용하려면 특별한 컴파일러도 필요하고 복잡하다.

### 클래스 로딩 시점

![23](https://github.com/yessm621/yessm621.github.io/assets/79130276/071c5fb2-a21d-43a1-a123-b2a2d65ed59b)

자바를 실행하면 자바 언어는 .class 파일을 JVM 내부의 클래스 로더에 보관한다. 이때 중간에서 .class 파일을 조작한 다음 JVM에 올릴 수 있다. 자바 언어는 .class를 JVM에 저장하기 전에 조작할 수 있는 기능을 제공한다. 궁금한 분은 java Instrumentation를 검색해보자. 참고로 수 많은 모니터링 툴들이 이 방식을 사용한다. 이 시점에 애스펙트를 적용하는 것을 **로드 타임 위빙**이라 한다.

**클래스 로딩 시점 - 단점**

로드 타임 위빙은 자바를 실행할 때 특별한 옵션(java -javaagent)을 통해 클래스 로더 조작기를 지정해야 하는데, 이 부분이 번거롭고 운영하기 어렵다.

### 런타임 시점

![24](https://github.com/yessm621/yessm621.github.io/assets/79130276/0a09ac8b-41a2-4d46-ba95-2d5aa1762d91)

런타임 시점은 컴파일도 다 끝나고, 클래스 로더에 클래스도 다 올라가서 이미 자바가 실행되고 난 다음을 말한다. 자바의 메인(main) 메서드가 이미 실행된 다음이다. 따라서 자바 언어가 제공하는 범위 안에서 부가 기능을 적용해야 한다. 스프링과 같은 컨테이너의 도움을 받고 프록시와 DI, 빈 포스트 프로세서 같은 개념들을 총 동원해야 한다. 이렇게 하면 최종적으로 프록시를 통해 스프링 빈에 부가 기능을 적용할 수 있다. 그렇다. 지금까지 우리가 학습한 것이 바로 **프록시 방식의 AOP**이다. 스프링 AOP는 이 방식을 사용한다.

프록시를 사용하기 때문에 AOP 기능에 일부 제약이 있다. 하지만 특별한 컴파일러나, 자바를 실행할 때 복잡한 옵션과 클래스 로더 조작기를 설정하지 않아도 된다. 스프링만 있으면 얼마든지 AOP를 적용할 수 있다.

> **중요**
<br>
스프링이 제공하는 AOP는 프록시를 사용한다. 따라서 프록시를 통해 메서드를 실행하는 시점에만 AOP가 적용된다. AspectJ를 사용하면 앞서 설명한 것 처럼 더 복잡하고 더 다양한 기능을 사용할 수 있다.
그렇다면 스프링 AOP 보다는 더 기능이 많은 AspectJ를 직접 사용해서 AOP를 적용하는 것이 더 좋지 않을까?
AspectJ를 사용하려면 공부할 내용도 많고, 자바 관련 설정(특별한 컴파일러, AspectJ 전용 문법, 자바 실행 옵션)도 복잡하다. 반면에 스프링 AOP는 별도의 추가 자바 설정 없이 스프링만 있으면 편리하게 AOP를 사용할 수 있다. 실무에서는 스프링이 제공하는 AOP 기능만 사용해도 대부문의 문제를 해결할 수 있다. 따라서 스프링 AOP가 제공하는 기능을 학습하는 것에 집중하자.
> 

## 스프링 AOP - 예제

다음과 같은 기능을 가진 스프링 AOP를 만들어보자.

- @Trace 애노테이션으로 로그 출력하기
- @Retry 애노테이션으로 예외 발생시 재시도 하기

### 로그 출력 AOP

@Trace가 메서드에 붙어 있으면 호출 정보가 출력되는 편리한 기능이다.

```java
package hello.aop.exam.annotation;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Trace {
}
```

```java
package hello.aop.exam.aop;

@Slf4j
@Aspect
public class TraceAspect {

    @Before("@annotation(hello.aop.exam.annotation.Trace)")
    public void doTrace(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        log.info("[trace] {} args={}", joinPoint.getSignature(), args);
    }
}
```

위에서 생성한 @Trace를 적용해보자.

```java
package hello.aop.exam;

@Repository
public class ExamRepository {

    private static int seq = 0;

    /**
     * 5번에 1번 실패하는 요청
     */
    @Trace
    public String save(String itemId) {
        seq++;
        if (seq % 5 == 0) {
            throw new IllegalStateException("예외 발생");
        }
        return "ok";
    }
}
```

```java
package hello.aop.exam;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;

    @Trace
    public void request(String itemId) {
        examRepository.save(itemId);
    }
}
```

```java
package hello.aop.exam;

@Slf4j
@Import(TraceAspect.class)
@SpringBootTest
public class ExamTest {

    @Autowired
    ExamService examService;

    @Test
    void test() {
        for (int i = 0; i < 5; i++) {
            log.info("client request i={}", i);
            examService.request("data" + i);
        }
    }
}
```

- 실행해보면 @Trace가 붙은 request(), save() 호출시 로그가 잘 남는 것을 확인할 수 있다.

### 재시도 AOP

이번에는 좀 더 의미있는 재시도 AOP를 만들어보자.

@Retry 애노테이션이 있으면 예외가 발생했을 때 다시 시도해서 문제를 복구한다.

```java
package hello.aop.exam.annotation;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Retry {
    int value() default 3;
}
```

- 이 애노테이션에는 재시도 횟수로 사용할 값이 있다. 기본값으로 3을 사용한다.

```java
package hello.aop.exam.aop;

@Slf4j
@Aspect
public class RetryAspect {

    @Around("@annotation(retry)")
    public Object doRetry(ProceedingJoinPoint joinPoint, Retry retry) throws Throwable {
        log.info("[retry] {} retry={}", joinPoint.getSignature(), retry);

        int maxRetry = retry.value();
        Exception exceptionHolder = null;

        for (int retryCount = 1; retryCount <= maxRetry; retryCount++) {
            try {
                log.info("[retry] try count={}/{}", retryCount, maxRetry);
                return joinPoint.proceed();
            } catch (Exception e) {
                exceptionHolder = e;
            }
        }
        throw exceptionHolder;
    }
}
```

- 재시도 하는 애스펙트이다.
- @annotation(retry), Retry retry를 사용해서 어드바이스에 애노테이션을 파라미터로 전달한다.
- retry.value()를 통해서 애노테이션에 지정한 값을 가져올 수 있다.
- 예외가 발생해서 결과가 정상 반환되지 않으면 retry.value()만큼 재시도한다.

@Retry를 적용해보자.

```java
package hello.aop.exam;

@Repository
public class ExamRepository {

    private static int seq = 0;

    @Trace
    @Retry(value = 4)
    public String save(String itemId) { ... }
}
```

- ExamRepository.save() 메서드에 @Retry(value = 4)를 적용했다. 이 메서드에서 문제가 발생하면 4번 재시도 한다.

```java
package hello.aop.exam;

@Slf4j
@Import({TraceAspect.class, RetryAspect.class})
@SpringBootTest
public class ExamTest {

    @Autowired
    ExamService examService;

    @Test
    void test() {
        for (int i = 0; i < 5; i++) {
            log.info("client request i={}", i);
            examService.request("data" + i);
        }
    }
}
```

실행 결과를 보면 5번째 문제가 발생했을 때 재시도 덕분에 문제가 복구되고, 정상 응답되는 것을 확인할 수 있다.

> **참고**
스프링이 제공하는 @Transactional 은 가장 대표적인 AOP이다.
>