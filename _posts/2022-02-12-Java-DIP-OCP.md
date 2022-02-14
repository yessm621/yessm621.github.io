---
title:  "객체 지향 원리 적용 - DIP, OCP 위반"
last_modified_at: 2022-02-14T18:45:00
categories: 
  - Java
tags:
  - Java
  - SpringBoot
---

[의존성 주입(DI), 3가지 방법](https://yessm621.github.io/SpringBoot/Java-Injection/)

<br>

**상황**

회원 도메인

- 회원은 일반과 VIP 두가지 등급이 있다

주문 도메인

- 회원 등급에 따라 할인 정책을 적용한다
- 할인 정책은 모든 VIP는 1000원을 할인해주는 고정 금액 할인을 적용한다 (나중에 변경 될 수 있다)
- 할인 정책은 변경 가능성이 높다. 회사의 기본 할인 정책을 아직 정하지 못했고, 오픈 직전까지 고민을 미루고 싶다. 최악의 경우 할인을 적용할지 않을 수도 있다. (미확정)

<br>

DiscountPolicy.java

```java
package hello.core.discount;

import hello.core.member.Member;

public interface DiscountPolicy {
    /**
     * @return 할인 대상 금액
     */
    int discount(Member member, int price);
}
```

FixDiscountPolicy.java

```java
package hello.core.discount;

import hello.core.member.Grade;
import hello.core.member.Member;

public class FixDiscountPolicy implements DiscountPolicy {

    private int discountFixAmount = 1000; // 1000원 할인

    @Override
    public int discount(Member member, int price) {
        if (member.getGrade() == Grade.VIP) {
            return discountFixAmount;
        } else {
            return 0;
        }
    }
}
```

<br>

OrderService.java

```java
package hello.core.order;

public interface OrderService {

    Order createOrder(Long memberId, String itemName, int itemPrice);
}
```

OrderServiceImpl.java

```java
package hello.core.order;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDiscountPolicy;
import hello.core.member.Member;
import hello.core.member.MemberRepository;
import hello.core.member.MemoryMemberRepository;

public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository = new MemoryMemberRepository();

    private final DiscountPolicy discountPolicy = new FixDiscountPolicy();

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
```

<br>

그런데, 악덕 기획자가 주문에 대한 요구사항 변경을 요청했다.

- 고정 금액 할인이 아닌 정률%할인으로 변경하고 싶다
- 예를 들어서 기존 정책은 VIP가 10000원을 주문하든 20000원을 주문하든 항상 1000원을 할인했는데, 이번에 새로 나온 정책은 10%로 지정해두면 고객이 10000원 주문시 1000원을 할인해주고, 20000원 주문시에 2000원을 할인

![1](https://user-images.githubusercontent.com/79130276/153713444-15213186-ffe8-4846-8186-756dcf93e6c9.png)

<br>

RateDiscountPolicy.java

```java
package hello.core.discount;

import hello.core.member.Grade;
import hello.core.member.Member;

public class RateDiscountPolicy implements DiscountPolicy {

    private int discountPercent = 10; // 10% 할인

    @Override
    public int discount(Member member, int price) {
        if (member.getGrade() == Grade.VIP) {
            return price * discountPercent / 100;
        } else {
            return 0;
        }
    }
}
```

<br>

OrderServiceImpl.java

```java
package hello.core.order;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDiscountPolicy;
import hello.core.discount.RateDiscountPolicy;
import hello.core.member.Member;
import hello.core.member.MemberRepository;
import hello.core.member.MemoryMemberRepository;

public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository = new MemoryMemberRepository();

//    private final DiscountPolicy discountPolicy = new FixDiscountPolicy();
    private final DiscountPolicy discountPolicy = new RateDiscountPolicy();

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
```

<br>

위의 코드에서 `문제점`

### 1. DIP 위반

OrderServiceImpl 은 DiscountPolicy에만 의존하는 것이 아닌 FixDiscountPolicy 와 RateDiscountPolicy에도 의존한다.

- 추상(인터페이스) 의존: DiscountPolicy
- 구체(구현) 클래스: FixDiscountPolicy, RateDiscountPolicy

### 2. OCP 위반

고정금액할인에서 정률%할인으로 변경 시 OrderServiceImpl을 변경해야함

따라서, 지금 코드는 기능을 확장해서 변경하면 클라이언트 코드에 영향을 준다.

![2](https://user-images.githubusercontent.com/79130276/153713443-dd5a0dfb-93e1-4652-8aa4-0ebd412751dd.png)

![3](https://user-images.githubusercontent.com/79130276/153713442-cf8787b2-0584-47ed-8cbf-32398f34be62.png)

<br>

위의 DIP, OCP 위반 문제들을 어떻게 해결할 수 있을까?

→ 인터페이스에만 의존하도록 설계를 변경!

<img width="589" alt="4" src="https://user-images.githubusercontent.com/79130276/153713463-ffcb1301-7bc5-4059-8042-dbb67fce7e42.png">

OrderServiceImpl.java

```java
package hello.core.order;

import hello.core.discount.DiscountPolicy;
import hello.core.member.Member;
import hello.core.member.MemberRepository;
import hello.core.member.MemoryMemberRepository;

public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository = new MemoryMemberRepository();

    private DiscountPolicy discountPolicy;

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
```

그러나, 실행해보면 NullPointException 발생

→ `구현체가 없기 때문!`

<br>

이 문제를 해결하려면 **누군가** 클라이언트인 OrderServiceImpl에 DiscountPolicy의 `구현 객체를 대신 생성하고 주입`해주어야 한다.

<br>

### 여기서부터 매우 중요!!

**AppConfig 등장**

구현 객체를 생성하고 연결(주입)하는 책임을 가지는 별도의 설정 클래스를 만들자

<br>

AppConfig.java

```java
package hello.core;

import hello.core.discount.FixDiscountPolicy;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImpl;

public class AppConfig {

    public MemberService memberService() {
        return new MemberServiceImpl(new MemoryMemberRepository());
    }

    public OrderService orderService() {
        return new OrderServiceImpl(new MemoryMemberRepository(), new FixDiscountPolicy());
    }
}
```

AppConfig에 애플리케이션의 실제 동작에 필요한 `구현 객체를 생성`

- MemberServiceImpl
- MemoryMemberRepository
- OrderServiceImpl
- FixDiscountPolicy

AppConfig는 생성한 객체 인스턴스의 참조를 `생성자를 통해서 주입(연결)`

- MemberServiceImpl → MemoryMemberRepository
- OrderServiceImpl → MemoryMemberRepository, FixDiscountPolicy

<br>

MemberServiceImpl.java

```java
package hello.core.member;

public class MemberServiceImpl implements MemberService {

		// final로 선언하고 생성자 주입
    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public void join(Member member) {
        memberRepository.save(member);
    }

    @Override
    public Member findMember(Long memberId) {
        return memberRepository.findById(memberId);
    }
}
```

- 이제 MemberServiceImpl은 MemoryMemberRepository에 의존하지 않는다.
- 단지 MemberRepository 인터페이스만 의존
- MemberServiceImpl의 생성자를 통해 어떤 구현 객체를 주입할지는 오직 **외부(AppConfig)에서 결정**된다
- MemberServiceImpl은 이제부터 의존관계에 대한 고민은 외부에 맡기고 **실행에만 집중**
- DIP 만족!

![5](https://user-images.githubusercontent.com/79130276/153713438-2cca81ac-5192-42b8-a07d-74cadad60173.png)

클라이언트인 memberServiceImpl 입장에서 보면 의존관계를 마치 외부에서 주입해주는 것 같다고 해서 `DI(Dependency Injection) 의존관계 주입`이라고 한다.

<br>

OrderServiceImpl.java

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

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
```

- OrderServiceImpl은 FixDiscountPolicy를 의존하지 않는다
- 단지 DiscountPolicy 인터페이스에만 의존
- OrderServiceImpl의 생성자를 통해 어떤 구현 객체를 주입할지는 오직 외부(AppConfig)에서 결정된다
- OrderServiceImpl에는 MemoryMemberRepository, FixDiscountPolicy 객체의 의존관계가 주입된다.

<br>

**정리**

- AppConfig를 통해서 관심사를 확실하게 분리
- 배역, 배우를 생각하면 AppConfig는 공연 기획자
- AppConfig는 구체 클래스를 선택한다. 애플리케이션이 어떻게 동작해야 할지 전체 구성을 책임진다.
- 이제 각 배우들은 담당 기능을 실행하는 책임만 지면 된다.
- OrderServiceImpl 은 기능을 실행하는 책임만 지면 된다.

<br>

### AppConfig 리팩토링

```java
package hello.core;

import hello.core.discount.FixDiscountPolicy;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImpl;

public class AppConfig {

    public MemberService memberService() {
        return new MemberServiceImpl(new MemoryMemberRepository());
    }

    public OrderService orderService() {
        return new OrderServiceImpl(new MemoryMemberRepository(), new FixDiscountPolicy());
    }
}
```

<br>

위의 코드의 문제점

1. 역할과 구현이 구분되지 않는다
2. new MemoryMemberRepository가 중복된다.

<br>

따라서 아래코드와 같이 리팩토링 한다.

```java
package hello.core;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDiscountPolicy;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImpl;

public class AppConfig {

    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }

    private MemoryMemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    public DiscountPolicy discountPolicy() {
        return new FixDiscountPolicy();
    }
}
```

- new MemoryMemberRepository() 이 부분이 중복 제거되었다. 이제 MemoryMemberRepository 를 다른 구현체로 변경할 때 한 부분만 변경하면 된다.
- AppConfig 를 보면 역할과 구현 클래스가 한눈에 들어온다. 애플리케이션 전체 구성이 어떻게 되어있는지 빠르게 파악할 수 있다.

<br>

이제 새로운 구조와 할인 정책을 적용해도 **사용 영역**의 코드는 변경할 필요 없이 **구성 영역**의 코드만 바꾸면 된다. `DIP, OCP를 만족`한다.

```java
package hello.core;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDiscountPolicy;
import hello.core.member.MemberService;
import hello.core.member.MemberServiceImpl;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImpl;

public class AppConfig {

    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }

    private MemoryMemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    public DiscountPolicy discountPolicy() {
        // return new FixDiscountPolicy();
        return new RateDiscountPolicy();
    }
}
```

<br>

객체지향설계 원칙 5가지 중 위의 코드들에서 적용된 원칙은 3가지이다.

### 1. SRP 단일 책임 원칙

→ 한 클래스는 `하나의 책임만` 가져야 한다

- 클라이언트 객체(OrderServiceImpl)는 직접 구현 객체를 생성, 연결, 실행하는 다양한 책임을 가지고 있음
- SRP 단일 책임 원칙을 따르면서 관심사를 분리함
- 구현 객체를 생성하고 연결하는 책임은 AppConfig가 담당
- 클라이언트 객체는 실행하는 책임만 담당

<br>

### 2. DIP 의존관계 역전 원칙

→ 프로그래머는 `추상화에 의존`해야지, 구체화에 의존하면 안된다.

- 새로운 할인 정책을 개발하니 클라이언트 코드의 변경이 불가피했다. OrderServiceImpl은 DiscountPolicy(추상)를 의존하는 동시에 FixDiscountPolicy(구체)도 의존했기 때문에..
- AppConfig를 생성해서 클라이언트 코드에 의존관계를 주입했다.

<br>

### 3. OCP

→ 소프트웨어 요소는 `확장에는 열려 있으나 변경에는 닫혀 있어야` 한다.

- 다형성을 사용하고 클라이언트가 DIP를 지킴
- 애플리케이션을 사용영역과 구성영역으로 나눔
- `AppConfig를 통해 의존관계를 주입`하므로 새로운 정책으로 변경한다고 해서 클라이언트의 코드를 변경할 필요가 없어짐
- 소프트웨어 요소를 `새롭게 확장해도 사용 영역의 변경은 닫혀` 있다!