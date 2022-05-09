---
title:  "컴포넌트 스캔"
last_modified_at: 2022-02-24T11:00:00
categories: 
  - SpringBoot
tags:
  - SpringBoot
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

# 컴포넌트 스캔

## 1. 컴포넌트 스캔과 의존관계 자동 주입

- 스프링 빈을 설정 정보에 일일이 등록하는 것은 매우 귀찮고 누락하는 문제도 생김
- 따라서, 스프링은 설정 정보가 없어도 **자동으로 스프링 빈을 등록**하는 `컴포넌트 스캔`이라는 기능을 제공함
- 의존관계를 자동으로 주입하는 `@Autowired` 기능 제공

<br>

컴포넌트 스캔을 사용하려면 `@ComponentScan`을 설정 정보에 붙여주면 된다. 또한, 의존관계를 명시하기 위해 `@Autowired` 를 추가하여 의존관계를 자동으로 주입해준다

<br>

### **@ComponentScan**

@ComponentScan은 @Component가 붙은 모든 클래스를 스프링 빈으로 등록

<br>

### **@Autowired 의존관계 자동 주입**

생성자에 @Autowired를 지정하면, 스프링 컨테이너가 자동으로 해당 스프링 빈을 찾아서 주입

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

<br>

## 2. 탐색 위치와 기본 스캔 대상

### 탐색할 패키지의 시작 위치 지정

```java
@ComponentScan(
	basePackages = "hello.core",
)

// 시작 위치를 여러개 지정할 수도 있음
@ComponentScan(
	basePackages = {"hello.core", "hello.service"}
)
```

- basePackages: 탐색할 패키지의 시작위치 지정, 해당 패키지를 포함한 하위 패키지 모두 탐색

<br>

### 권장하는 방법

- 설정 정보 클래스의 위치를 `프로젝트 최상단`에 두는 것
- 프로젝트 메인 설정 정보는 **시작 루트 위치**에 두는 것이 좋음
- 스프링 부트의 경우에도 대표 시작 정보인 **@SpringBootApplication**을 프로젝트 시작 루트 위치에 두는 것이 관례

<br>

### 컴포넌트 스캔 기본 대상 및 스프링이 제공하는 부가 기능

- @Component: 컴포넌트 스캔에서 사용
- @Controller: `스프링 MVC 컨트롤러`에서 사용 및 인식
- @Service: 스프링 `비즈니스 로직`에서 사용, 개발자들이 비즈니스 계층을 인식하는데 도움이 됨
- @Repository: 스프링 `데이터 접근 계층`에서 사용 및 인식하고 데이터 계층의 예외를 스프링 예외로 변환해준다
- @Configuration: 스프링 설정 정보에서 사용 및 인식, 스프링 빈이 싱글톤을 유지하도록 추가 처리함

<br>

## 3. 필터

- includeFilters: 컴포넌트 스캔 대상을 추가로 지정
- excludeFilters: 컴포넌트 스캔에서 제회할 대상을 지정

<br>

## 4. 중복 등록과 충돌

자동 빈 등록 vs 자동 빈 등록 → 오류 발생

수동 빈 등록 vs 자동 빈 등록 → 수동 빈이 우선권을 가짐

그러나, 최근 스프링 부트에서는 수동 빈 등록과 자동 빈 등록이 충돌나면 **오류가 발생**하도록 바꿈