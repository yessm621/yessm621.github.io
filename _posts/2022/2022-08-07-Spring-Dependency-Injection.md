---
title: "의존관계 주입 방법"
# last_modified_at: 2022-08-07T22:50:00
last_modified_at: 2022-11-26T23:25:00
categories:
  - Spring
tags:
  - Spring
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---

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