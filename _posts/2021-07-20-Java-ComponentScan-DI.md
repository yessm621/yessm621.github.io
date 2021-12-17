---
layout: post
title:  "컴포넌트 스캔과 자동 의존관계"
date:   2021-07-20 09:30:00 0100
categories: Java
---
<br>


## 의존관계주입(DI) 이란?
---

객체 간의 의존 관계를 만드는 것

Spring 의 IOC 컨테이너의 구체적인 구현 방식

<br>

## 의존관계 설정
---

컨트롤러(Controller)가 서비스(Service)와 리포지토리(Repository)를 사용할 수 있게 의존관계를 준비

→ 컨트롤러에 @Controller 만 붙인다고 service 와 repository 를 사용할 수 있는게 아니다

<br>


controller/MemberController.java

```java
package hellospring.hello.controller;

import hellospring.hello.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class MemberController {

    private final MemberService memberService;

    @Autowired
	// 생성자
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

}
```

생성자에 @Autowired 가 있으면 스프링이 연관된 객체를 스프링 컨테이너에서 찾아서 넣어준다.

이렇게 객체 의존관계를 외부에서 넣어주는 것을 DI(Dependency Injection), **의존성 주입**!

→ @Autowired 에 의해 스프링이 주입해준다

- 참고

    DI 에는 필드 주입, setter 주입, 생성자 주입이 있고 보통은 생성자 주입을 권장

    (위의 코드 방법도 생성자 주입)

    컨트롤러의 경우 @Controller 가 있으면 자동 등록

<br><br>

## 스프링 빈의 개념과 생성 원리
---

스프링 컨테이너가 관리하는 자바 객체를 빈이라는 용어로 부른다.

<br>

## 스프링 빈을 등록하는 방법
---

1. 컴포넌트 스캔과 자동 의존관계 설정
2. 자바 코드로 직접 스프링 빈 등록

<br><br>


## component-scan 이란?
---
빈으로 등록 될 준비를 마친 클래스들을 스캔하여, 빈으로 등록해주는 것.

@ComponentScan과 @Component 를 사용해서 빈으로 등록한다.

<br>

**@ComponentScan**

→ 어느 지점부터 컴포넌트를 찾으라고 알려주는 역할

**@Component**

→ 실제로 찾아서 빈으로 등록할 클래스를 의미

<br>

## component-scan 원리
---
component-scan은 기본적으로 @Component 어노테이션을 빈 등록 대상으로 포함한다. (스프링 빈으로 자동 등록 됨)

<br>

@Controller 에 @Component 가 포함되어 있다.

따라서, 컨트롤러가 스프링 빈으로 자동 등록되는 이유는 컴포넌트 스캔때문!

<br><br>

## 스프링 빈 등록하는 방법1: 컴포넌트 스캔과 자동 의존관계 설정
---

**서비스 스프링 빈 등록**

service/MemberService.java

```java
@Service
public class MemberService {
        
private final MemberRepository memberRepository;
		@Autowired
    public MemberService(MemberRepository memberRepository) {
				this.memberRepository = memberRepository;
    }
}
```
<br>

**리포지토리 스프링 빈 등록**

repository/MemoryMemberRepository.java

```java
@Repository
public class MemoryMemberRepository implements MemberRepository {}
```

위와 같이 어노테이션을 붙여주면 Service 와 Repository 가 스프링 컨테이너에 스프링 빈으로 등록됨

<br>

## 스프링 빈 등록하는 방법2: 자바코드로 직접 스프링 빈 등록
---

SpringConfig.java

```java
package hellospring.hello;

import hellospring.hello.repository.MemberRepository;
import hellospring.hello.repository.MemoryMemberRepository;
import hellospring.hello.service.MemberService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringConfig {

    @Bean
    public MemberService memberService(){
        return new MemberService(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }
}
```
<br>


### 결론!! 

스프링 빈을 등록할 때 어떤 방법을 주로 쓸까?

실무에서는 주로 **컴포넌트 스캔**을 사용

→ 간단!

직접 스프링 빈을 등록하는 경우?

→ 정형화 되지 않거나, 상황에 따라 구현 클래스를 변경해야할 때 사용

<br><br>