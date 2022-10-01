---
title:  "DIP, OCP와 의존관계 주입(DI)"
# last_modified_at: 2022-02-14T18:45:00
# last_modified_at: 2022-07-26T09:30:00
last_modified_at: 2022-09-26T16:55:00
categories: 
  - Spring
tags:
  - Spring
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---

DIP, OCP를 지키기 위해선 다형성만으론 부족하다. 의존관계 주입(DI) 개념이 필요하다.

의존관계 주입에 대해 알아보기 전에 아래 요구사항과 그에 따른 코드 흐름을 살펴보자.

<br>

## 요구사항 정의서와 설계

**회원 도메인 설계**

- 회원을 가입하고 조회할 수 있다
- 회원은 일반과 VIP 두가지 등급이 있다
- 회원 데이터는 자체 DB를 구축할 수 있고, 외부 시스템과 연동할 수 있다 (미확정)

**주문과 할인**

- 회원은 상품을 주문할 수 있다
- 회원 등급에 따라 할인 정책을 적용할 수 있다
- 할인 정책은 모든 VIP는 1000원을 할인해주는 고정 금액 할인을 적용한다 (나중에 변경 될 수 있다)
- 할인 정책은 변경 가능성이 높다. 회사의 기본 할인 정책을 아직 정하지 못했고, 오픈 직전까지 고민을 미루고 싶다. 최악의 경우 할인을 적용할지 않을 수도 있다. (미확정)

![1](https://user-images.githubusercontent.com/79130276/180899920-bfc1190e-7eb0-445f-afa3-3e826a51c292.png)

![2](https://user-images.githubusercontent.com/79130276/180899923-9a2a9c0b-44e7-49af-b3ec-47ec95b2510c.png)

요구사항 정의서를 보면 미확정된 요구사항이 있어 구현하기 어려운 점이 있다. 하지만, 우리에겐 객체 지향 설계 방법이 있다. `인터페이스, 구현체 형식`으로 설계를 하고 나중에 변경된 구현체는 갈아끼우자.

<br>

**회원 저장소**

```java
package hello.core.member;

public interface MemberRepository {

    void save(Member member);

    Member findById(Long memberId);
}
```

```java
package hello.core.member;

import java.util.HashMap;
import java.util.Map;

public class MemoryMemberRepository implements MemberRepository {

    private static Map<Long, Member> store = new HashMap<>();

    @Override
    public void save(Member member) {
        store.put(member.getId(), member);
    }

    @Override
    public Member findById(Long memberId) {
        return store.get(memberId);
    }
}
```

회원 데이터에 대한 저장 부분이 아직 미확정이지만 개발은 진행해야 하므로 가장 단순한 메모리 회원 저장소를 구현해서 개발을 진행한다.

<br>

**회원 서비스**

```java
package hello.core.member;

public interface MemberService {

    void join(Member member);

    Member findMember(Long memberId);
}
```

```java
package hello.core.member;

public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository = new MemoryMemberRepository();

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

<br>

**할인 정책**

```java
package hello.core.discount;

import hello.core.member.Member;

public interface DiscountPolicy {

    int discount(Member member, int price);
}
```

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

**주문 서비스**

```java
package hello.core.order;

public interface OrderService {

    Order createOrder(Long memberId, String itemName, int itemPrice);
}
```

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

**[참고]** OrderServiceImpl.createOrder() 메소드

```java
int discountPrice = discountPolicy.discount(member, itemPrice);
```

아래 코드는 discountPolicy에게 할인된 가격을 알아서 계산해서 return 해달라는 코드이다.
이 코드는 `단일책임원칙(SRP)`을 매우 잘 지킨 코드이다. 만약, 할인 정책이 바뀌더라도 할인 쪽 코드만 변경하면 되고 주문 관련 코드는 변경할 필요가 없다. (만일, 단일책임원칙을 적용하지 않고 주문 쪽 코드에 할인 정책까지 같이 작성했다면 할인 정책 변경 시 주문 코드를 변경해야 되므로 단일책임원칙에 위배된다.)

<br>

현재까지 코드는 주문 생성 요청이 오면, 회원 정보를 조회하고 할인 정책을 적용한 다음 주문 객체를 생성해서 반환한다. 메모리 회원 리포지토리와 고정 금액 할인 정책을 구현체로 생성한다. 즉, 역할(인터페이스)과 구현(구현체)을 분리하여 작성했기 때문에 앞에서 말한 DIP를 지켰다. 

그런데, 요구사항에 변경이 생겨도 DIP와 OCP원칙을 지킬 수 있을까? 이 부분에 대해 생각을 하면서 다음 요구사항 변경을 살펴보자.

<br>

**새로운 할인 정책 개발**

- 고정 금액 할인이 아닌 정률%할인으로 변경하고 싶다
- 예를 들어서 기존 정책은 VIP가 10000원을 주문하든 20000원을 주문하든 항상 1000원을 할인했는데, 이번에 새로 나온 정책은 10%로 지정해두면 고객이 10000원 주문시 1000원을 할인해주고, 20000원 주문시에 2000원을 할인

<br>

**새로운 할인 정책에 대한 구현체**

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

우리는 분명 DIP원칙(인터페이스, 구현체)을 지키면서 코드를 작성하였다. 그런데, 새로운 할인 정책을 변경하려면 클라이언트인 OrderServiceImpl 코드를 고쳐야 한다.

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

    ...
}
```

문제가 생겼다. 우리는 역할과 구현을 충실하게 분리했고 다형성을 활용하여 인터페이스와 구현 객체를 분리했다. 그런데, **DIP와 OCP를 위반**했다.

<br>

**1. DIP 위반**

OrderServiceImpl 은 DiscountPolicy에만 의존하는 것이 아닌 FixDiscountPolicy 와 RateDiscountPolicy에도 의존한다. 즉, 추상에만 의존하는 것이 아닌 구체에도 의존하고 있다.

- 추상(인터페이스) 의존: DiscountPolicy
- 구체(구현) 클래스: FixDiscountPolicy, RateDiscountPolicy

**2. OCP 위반**

고정금액할인에서 정률%할인으로 변경 시 OrderServiceImpl을 변경해야 한다. 따라서, 지금 코드는 기능을 확장해서 변경하면 클라이언트 코드에 영향을 준다.

![1](https://user-images.githubusercontent.com/79130276/192218716-0a501208-fe83-4b53-b922-5b33711f0645.png)

![2](https://user-images.githubusercontent.com/79130276/192218726-1183ee16-d215-4c82-bd5f-daffa668442f.png)

> **참고**
<br>
OCP는 확장엔 열려있으나 변경에는 닫혀있어야 한다는 뜻, DIP는 구현 클래스에 의존하지 않고 인터페이스에 의존해야한다는 뜻이다.
> 

<br>

위의 DIP, OCP 위반 문제들을 해결하려면 클라이언트(OrderServiceImpl)가 `인터페이스에만 의존`하도록 설계를 변경하면 된다.

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

그러나, 실행하면 discountPolicy에 대한 **구현체가 없기** 때문에 NullPointException 발생한다.

이 문제를 해결하려면 **누군가** 클라이언트인 OrderServiceImpl에 DiscountPolicy의 `구현 객체를 대신 생성하고 주입`해주어야 한다.

<br>

## 관심사의 분리

**관심사를 분리**해야 한다. 애플리케이션을 연극에 비유하면 다음과 같다.

- 애플리케이션 - 연극
- 인터페이스 - 배역
- 구현체 - 담당 배우
- AppConfig - 공연 기획

<br>

### AppConfig 등장

구현 객체를 생성하고 연결(주입)하는 책임을 가지는 별도의 설정 클래스를 만들자

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

```java
package hello.core.member;

public class MemberServiceImpl implements MemberService {

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

이제 MemberServiceImpl은 MemoryMemberRepository에 의존하지 않는다. 단지, MemberRepository 인터페이스만 의존한다. 그리고 MemberServiceImpl 입장에서 생성자를 통해 어떤 구현 객체가 들어올지(주입될지) 알 수 없고 MemberServiceImpl의 생성자를 통해서 어떤 구현 객체를 주입할지는 오직 **외부(’AppConfig’)에서 결정**된다. MemberServiceImpl은 이제부터 **의존관계에 대한 고민은 외부**에 맡기고 **실행에만 집중**한다.

<br>

![3](https://user-images.githubusercontent.com/79130276/180899925-93b6b13b-33df-4d1c-b7ac-dcb46370a181.png)

위 그림을 살펴보면 AppConfig가 MemberServiceImpl 객체와 MemoryMemberRepository 객체를 생성한다. 객체의 생성과 연결은 `AppConfig`가 담당한다.

이를 통해 얻은 것은 두가지이다.

- DIP 완성: MemberServiceImpl은 MemberRepository인 추상에만 의존하면 된다. (구체 클래스는 신경쓰지 않아도 된다.)
- 관심사의 분리: 객체를 생성하고 연결하는 역할과 실행하는 역할이 명확히 분리되었다.

<br>

![4](https://user-images.githubusercontent.com/79130276/180899927-8d7ee9b5-ae26-4eb6-b8f0-cff14144026b.png)

AppConfig 객체는 memoryMemberRepository 객체를 생성하고 그 참조값을 memberServiceImpl을 생성하면서 생성자로 전달한다. 클라이언트인 memberServiceImpl 입장에서 보면 의존관계를 마치 외부에서 주입해주는 것 같다고 해서 `DI(Dependency Injection) 의존관계 주입`이라고 한다.

<br>

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

OrderServiceImpl은 FixDiscountPolicy를 의존하지 않는다. (DiscountPolicy 인터페이스에만 의존) OrderServiceImpl은 이제 실행에만 집중하고 OrderServiceImpl의 생성자를 통해 어떤 구현 객체를 주입할지는 오직 외부(AppConfig)에서 결정된다. OrderServiceImpl에는 MemoryMemberRepository, FixDiscountPolicy 객체의 의존관계가 주입된다.

<br>

**정리**

- AppConfig를 통해서 관심사를 확실하게 분리
- AppConfig는 공연 기획자
- AppConfig는 구체 클래스를 선택한다. 애플리케이션이 어떻게 동작해야 할지 전체 구성을 책임진다.
- 이제 각 배우들은 담당 기능을 실행하는 책임만 지면 된다.
- OrderServiceImpl은 기능을 실행하는 책임만 지면 된다.

<br>

### AppConfig 리팩토링

위에서 작성한 AppConfig의 문제점은 역할과 구현이 명확히 구분되지 않는 것과 new MemoryMemberRepository()가 중복된다는 점이다.

따라서, 아래코드와 같이 리팩토링 한다.

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

new MemoryMemberRepository() 이 부분이 중복 제거되었다. 이제 MemoryMemberRepository 를 다른 구현체로 변경할 때 한 부분만 변경하면 된다. 또한, 리팩토링된 AppConfig를 보면 역할과 구현 클래스가 한눈에 들어온다. 애플리케이션 전체 구성이 어떻게 되어있는지 빠르게 파악할 수 있다.

- 역할: 메소드 리턴 타입
- 구현: 구현체

<br>

### 새로운 구조와 할인 정책 적용

이제 새로운 할인 정책을 도입해도 AppConfig만 변경하면 된다.

변경: FixDiscountPolicy → RateDiscountPolicy

![5](https://user-images.githubusercontent.com/79130276/180899928-63920b48-9f39-4378-b772-0b2ecd833ad8.png)

![6](https://user-images.githubusercontent.com/79130276/180899930-87a05c1c-c00b-456e-acc7-54f6ce32cc71.png)

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

AppConfig에서 할인 정책 역할을 담당하는 구현을 Fix → Rate 객체로 변경했다. 이제는 할인 정책을 변경해도 AppConfig만 변경하면 된다. 클라이언트 코드인 OrderServiceImpl를 포함해서 사용 영역의 어떤 코드도 변경할 필요가 없다.

구성 영역은 당연히 변경된다. 구성 역할을 담당하는 AppConfig를 애플리케이션이라는 공연의 기획자로 생각하자. 공연 기획자는 공연 참여자인 구현 객체들을 모두 알아야 한다.

<br>

## **전체 흐름 정리**

지금까지의 흐름을 정리해보자.

- 새로운 할인 정책 개발
- 새로운 할인 정책 적용과 문제점
- 관심사의 분리
- AppConfig 리팩터링
- 새로운 구조와 할인 정책 적용

<br>

**새로운 할인 정책 개발**

다형성 덕분에 새로운 정률 할인 정책 코드를 추가로 개발하는 것 자체는 아무 문제가 없음

<br>

**새로운 할인 정책 적용과 문제점**

새로 개발한 정률 할인 정책을 적용하려고 하니 **클라이언트 코드**인 주문 서비스 구현체도 함께 변경해야함
주문 서비스 클라이언트가 인터페이스인 DiscountPolicy 뿐만 아니라, 구체 클래스인 FixDiscountPolicy도 함께 의존 → **DIP 위반**

<br>

**관심사의 분리**

- 애플리케이션을 하나의 공연으로 생각
- 기존에는 클라이언트가 의존하는 서버 구현 객체를 직접 생성하고, 실행함
- 비유를 하면 기존에는 남자 주인공 배우가 공연도 하고, 동시에 여자 주인공도 직접 초빙하는 다양한 책임을
가지고 있음
- 공연을 구성하고, 담당 배우를 섭외하고, 지정하는 책임을 담당하는 별도의 **공연 기획자**가 나올 시점
- 공연 기획자인 AppConfig가 등장
- AppConfig는 애플리케이션의 전체 동작 방식을 구성(config)하기 위해, **구현 객체를 생성**하고, **연결**하는
책임
- 이제부터 클라이언트 객체는 자신의 역할을 실행하는 것만 집중, 권한이 줄어듬(책임이 명확해짐)

```java
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

**AppConfig 리팩터링**

- 구성 정보에서 역할과 구현을 명확하게 분리
- 역할이 잘 드러남
- 중복 제거

```java
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

<br>

**새로운 구조와 할인 정책 적용**

- 정액 할인 정책 정률% 할인 정책으로 변경
- AppConfig의 등장으로 애플리케이션이 크게 **사용 영역**과, 객체를 생성하고 **구성(Configuration)하는
영역**으로 분리
- 할인 정책을 변경해도 AppConfig가 있는 구성 영역만 변경하면 됨, 사용 영역은 변경할 필요가 없음. 물론 클라이언트 코드인 주문 서비스 코드도 변경하지 않음

<br>

객체지향설계 원칙 5가지 중 위의 코드들에서 적용된 원칙은 3가지이다.

### 1. SRP 단일 책임 원칙

SRP 원칙은 한 클래스는 **하나의 책임**만 가져야 한다는 것이다. 클라이언트 객체(OrderServiceImpl)는 직접 구현 객체를 생성, 연결, 실행하는 너무 많은 책임을 가지고 있었다. SRP 단일 책임 원칙을 따르면서 관심사를 분리하고 구현 객체를 생성하고 연결하는 책임은 AppConfig가 담당하였다. 즉, 클라이언트 객체는 실행하는 책임만 담당하게 되었다.

### 2. DIP 의존관계 역전 원칙

DIP 원칙은 프로그래머는 `추상화에 의존`해야지, 구체화에 의존하면 안된다는 것이다. 새로운 할인 정책을 개발하니 클라이언트 코드의 변경이 불가피했다. OrderServiceImpl은 DiscountPolicy(추상)를 의존하는 동시에 FixDiscountPolicy(구체)도 의존했기 때문이다. 이를 AppConfig를 생성해서 클라이언트는 구체에 의존하지 않도록 설계하고 클라이언트 코드에 의존관계를 주입했다.

### 3. OCP

OCP 원칙은 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다는 것이다. 다형성을 사용하고 클라이언트가 DIP를 지킨다. 또한, 애플리케이션을 사용영역과 구성영역으로 나누고 `AppConfig`를 통해 의존관계를 주입하므로 새로운 정책으로 변경한다고 해서 클라이언트의 코드를 변경할 필요가 없어졌다. 즉, 소프트웨어 요소를 새롭게 확장해도 사용 영역의 변경은 닫혀 있고 구성영역만 수정하면 된다.