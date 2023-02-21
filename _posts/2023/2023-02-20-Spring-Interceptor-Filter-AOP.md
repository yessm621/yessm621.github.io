---
layout: post
title: "Interceptor, Filter, AOP"
date: 2023-02-21 10:50:00
categories: [Spring]
tags:
  - Spring
  - Java
author: "유자"
---

## 공통 프로세스에 대한 고민

웹 애플리케이션 개발을 하다보면, **공통적**으로 처리해야 할 업무들이 많다. 예를들어 로그인 관련 처리, 권한체크, XSS(Cross site script)방어, pc와 모바일 웹의 분기처리, 로그, 페이지 인코딩 변화 등이 있다.

이러한 공통 업무에 대한 부분은 따로 관리하는 것이 좋다.

따로 관리하면 중복 코드도 줄고 유지보수 측면에서도 좋다. 또한, 프로젝트의 규모가 커짐에 따른 서버 부하도 줄일 수 있다.

공통 업무를 프로그램 흐름의 앞, 중간, 뒤에 추가하여 자동으로 처리할 수 있는 방법을 제공하는 것이 `Filter`, `Interceptor`, `AOP`이다. 스프링에서 사용되는 Filter, Interceptor, AOP는 모두 무슨 행동을 하기 전에 먼저 실행하거나 실행한 후에 추가적인 행동을 할 때 사용되는 기능들이다.

## Filter, Interceptor, AOP의 흐름

![1](https://user-images.githubusercontent.com/79130276/220226824-32d5c4f1-a744-4948-b2a1-c0d37bfeb22b.png)

- Interceptor와 Filter는 **Servlet** 단위에서 실행된다.
- AOP는 메소드 앞에 **Proxy 패턴**의 형태로 실행된다.
- 요청이 들어오면 Filter → Interceptor → AOP → Interceptor → Filter 순으로 거치게 된다.

### 흐름

```
(서블릿 실행 시점)init → doFilter → preHandler → 컨트롤러 → postHandler → afterCompletion → doFilter → (서블릿 종료 시점) destory
```

## Filter (필터)

`필터`는 서블릿이 지원하는 **수문장**이다. 서블릿 필터는 서블릿 이전에 실행된다. 요청과 응답이 있을 때 여러가지 체크를 수행하거나 변경하는 처리를 한다.

**필터 흐름**

```
HTTP 요청 → WAS → 필터 → 서블릿 → 컨트롤러
```

- 필터를 적용하면 필터가 호출된 다음에 서블릿이 호출된다.
- 그래서 모든 고객의 요청 로그를 남기는 요구사항이 있다면 필터를 사용하면 된다. 필터는 특정 URL 패턴에 적용할 수 있다.
- 참고로 스프링을 사용하는 경우 여기서 말하는 서블릿은 스프링의 디스패처 서블릿으로 생각하면 된다.

**필터 제한**

```
HTTP 요청 → WAS → 필터 → 서블릿 → 컨트롤러 // 로그인 사용자
HTTP 요청 → WAS → 필터(적절하지 않은 요청이라 판단, 서블리 호출X) // 비로그인 사용자
```

- 필터에서 적절하지 않은 요청이라고 판단하면 서블릿을 호출하지 않고 중단한다. 그래서 로그인 여부를 체크하기에 좋다.

**필터 체인**

```
HTTP 요청 → WAS → 필터1 → 필터2 → 필터3 → 서블릿 → 컨트롤러
```

- 필터는 체인으로 구성되는데 중간에 필터를 자유롭게 추가할 수 있다. 예를 들어 로그를 남기는 필터를 먼저 적용하고 그 다음에 로그인 여부를 체크하는 필터를 만들 수 있다.

### Filter 인터페이스

- init(): 필터 인스턴스 초기화 메서드, 서블릿 컨테이너가 실행될 때 호출된다.
- `doFilter()`: 전/후 처리, 고객의 요청이 올 때 마다 해당 메서드가 호출된다. 필터의 로직을 구현하면 된다.
- destroy(): 필터 인스턴스 종료, 서블릿 컨테이너가 종료될 때 호출된다.

```java
package javax.servlet;

import java.io.IOException;

public interface Filter {
    public default void init(FilterConfig filterConfig) throws ServletException {}
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;
    public default void destroy() {}
}
```

- doFilter()가 가장 중요하다. doFilter()는 다음 필터가 있으면 필터를 호출하고 필터가 없으면 서블릿을 호출한다. 만약, 이 로직을 호출하지 않는다면 다음 단계로 진행되지 않는다. (컨트롤러 등이 호출되지 않는다)

### Filter 등록

```java
@Configuration
public class WebConfig {

    @Bean
    public FilterRegistrationBean logFilter() {
        FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(new LogFilter());
        filterRegistrationBean.setOrder(1);
        filterRegistrationBean.addUrlPatterns("/*");

        return filterRegistrationBean;
    }
}
```

> **참고**
필터나 인터셉터는 스프링 빈으로 등록하여 주입 받아 사용해도 된다.
> 
> 
> ```java
> @Configuration
> public class WebConfig {
> 
>     ...
>     // 스프링 빈으로 등록해서 주입받아 사용
>     @Autowired LoginCheckFilter loginCheckFilter;
> 
>     @Bean
>     public FilterRegistrationBean loginCheckFilter() {
>         FilterRegistrationBean<Filter> filterRegistrationBean = new FilterRegistrationBean<>();
>         filterRegistrationBean.setFilter(LoginCheckFilter);
>         filterRegistrationBean.setOrder(2);
>         filterRegistrationBean.addUrlPatterns("/*");
> 
>         return filterRegistrationBean;
>     }
> }
> ```
> 

## Interceptor

스프링 인터셉터는 서블릿 필터와 비슷하지만 적용되는 순서와 범위, 사용방법이 다르다.

서블릿 필터가 서블릿이 제공하는 기술이라면, `스프링 인터셉터`는 **스프링 MVC가 제공**하는 기술이다. 인터셉터는 스프링의 서블릿(DispatcherServlet)이 컨트롤러를 호출하기 전, 후로 사용되므로 스프링 컨텍스트 내부에서 컨트롤러(Handler)에 관한 요청과 응답에 대해 처리한다.

**스프링 인터셉터 흐름**

```
HTTP 요청 → WAS → 필터 → 서블릿 → 스프링 인터셉터 → 컨트롤러
```

- 여기서 서블릿은 디스패처 서블릿이다.
- 스프링 인터셉터는 디스패처 서블릿과 컨트롤러 사이에서 **컨트롤러 호출 직전에 호출**된다.
- 스프링 인터셉터에도 URL 패턴을 적용할 수 있는데, 서블릿 URL 패턴과는 다르고 매우 정밀하게 설정할 수 있다.

**스프링 인터셉터 흐름**

```
HTTP 요청 → WAS → 필터 → 서블릿 → 스프링 인터셉터 → 컨트롤러 // 로그인 사용자
HTTP 요청 → WAS → 필터 → 서블릿 → 스프링 인터셉터(적절하지 않은 요청이라 판단, 컨트롤러 호출X) // 비 로그인 사용자
```

- 인터셉터에서 적절하지 않은 요청이라고 판단하면 거기에서 끝낼 수 있다. 그래서 로그인 여부를 체크하기에 좋다.

**스프링 인터셉터 체인**

```
HTTP 요청 → WAS → 필터 → 서블릿 → 인터셉터1 → 인터셉터2 → 컨트롤러
```

- 스프링 인터셉터는 체인으로 구성되는데, 중간에 인터셉터를 자유롭게 추가할 수 있다.

> **참고**
스프링 인터셉터는 스프링의 모든 빈 객체에 접근할 수 있다.
> 

### Interceptor 인터페이스

스프링의 인터셉터를 사용하려면 `HandlerInterceptor 인터페이스`를 구현하면 된다.

- preHandle(): 컨트롤러 메서드가 실행되기 전 호출된다.
- postHandler(): 컨트롤러 메서드 실행 직후 view 페이지 렌더링 되기 전에 호출된다. 컨트롤러에서 예외가 발생하면 호출되지 않는다.
- afterCompletion(): view 페이지가 렌더링 되고 난 후 호출된다. afterCompletion()은 postHandler()와 다르게 항상 호출된다. 이 경우 예외가 발생하였을 때 로그로 출력할 수 있다.

```java
package org.springframework.web.servlet;

public interface HandlerInterceptor {
    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {}
    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {}
    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {}
}
```

> **참고**
postHandler, afterCompletion은 default 로 작성된 메서드이다. default 로 작성된 메서드는 이미 구현된 메서드이므로 굳이 오버라이드 할 필요 없다. (자바8부터 도입)
Interceptor는 서블릿 필터와 비교해서 코드가 매우 간결하다. 구현의 특징에 따라 preHandler만 구현해도 된다. 예를들어 인증이라는 것은 컨트롤러 호출 전에만 호출하면 된다. 따라서, preHandler만 구현하면 된다. (서블릿 필터는 처음부터 끝까지 모두 구현해야 한다.)
> 

### Interceptor 등록

**WebMvcConfigurer**가 제공하는 addInterceptors()를 사용해서 인터셉터를 등록할 수 있다.

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LogInterceptor()) // 인터셉터 등록
                .order(1) // 인터셉터 호출 순서 지정
                .addPathPatterns("/**") // 인터셉터를 적용할 URL패턴 지정
                .excludePathPatterns("/css/**", "/*.ico", "/error"); // 인터셉터에서 제외할 URL패턴 지정
    }
}
```

- 필터와 비교해보면 인터셉터는 addPathPatterns, excludePathPatterns로 매우 정밀하게 URL 패턴을 지정할 수 있다.

### Filter vs Interceptor

서블릿 필터와 스프링 인터셉터는 웹과 관련된 공통 관심사를 해결하기 위한 기술이다. 서블릿 필터와 비교해서 스프링 인터셉터가 개발자 입장에서 훨씬 편리하다. 특별한 문제가 없다면 **Interceptor**를 사용하는 것이 좋다.

## AOP

OOP를 보완하기 위해 나온 개념이고 `관점 지향 프로그래밍(Aspect Orented Programming)`이라고 한다. AOP의 등장으로 OOP를 더욱 OOP 답게 할 수 있게 되었다.

AOP는 기능을 비즈니스 로직과 공통 로직으로 구분한 뒤 개발자의 코드 밖에서 필요한 시점에 비지니스 로직에 삽입하여 실행되도록 한다. 즉, OOP에서는 공통적인 기능을 각 객체의 횡단으로 입력했다면, AOP는 공통적인 기능을 종단간으로 삽입할 수 있도록 한 것이다. (첫번째 사진: OOP, 두번째 사진: AOP)

![2](https://user-images.githubusercontent.com/79130276/220226811-27585d85-80d7-45b4-aa3e-8fb94860c011.png)

![3](https://user-images.githubusercontent.com/79130276/220226817-969afa12-d236-4647-b547-b4aaa25196e6.png)

AOP는 권한, 로깅, 트랜잭션이라는 관심(Aspect)을 종단으로 삽입할 수가 있다. OOP에서는 객체별로 처리했던 것들을 AOP에서는 관점별로 외부에서 접근하는 것이 AOP의 핵심이다.

필터, 인터셉터와 달리 메서드 전후의 지점에 자유롭게 설정이 가능하다.

### AOP 주요 용어

- Aspect: 구현하고자 하는 횡단 관심사(권한, 로깅, 트랜잭션 등)의 기능을 의미한다. 한개 이상의 포인트컷과 어드바이스의 조합으로 만들어진다.
- JoinPoint: 관점(Aspect)을 삽입하여 어드바이스가 적요오딜 수 있는 위치를 의미한다. 메서드를 호출하는 시점, 예외가 발생하는 시점 등과 같이 특정 작업이 실행되는 시점을 의미하기도 한다.
- Advice: 관점(Aspect)의 구현체로 Join Points에서 실행되어야 하는 코드(실제로 AOP 기능을 구현한 객체). Advice는 Join Point와 결합하여 동작하는 시점에 따라 5개로 구분된다.

AOP의 Advice와 HandlerInterceptor의 가장 큰 차이점은 **파라미터**이다. Advice의 경우 JoinPoint나 ProceedingJoinPoint 등을 활용해서 호출한다. 반면, HandlerInterceptor는 Filter와 유사하게 HttpServletRequest, HttpServletResponse를 파라미터로 사용한다.

### AOP의 포인트컷

- @Before: 대상 메서드의 수행 전
- @After: 대상 메서드의 수행 후
- @After-returning: 대상 메서드의 정상적인 수행 후
- @After-throwing: 예외발생 후
- @Around: 대상 메서드의 수행 전/후

### AOP를 사용하여 구현하는 기법

1. 바이트 코드 조작하기
    - 컴파일 시 생기는 .class 파일을 조작하는 것
2. 프록시 패턴 조작하기
    - 내부적으로 AOP가 적용된 객체(proxy)를 생성하고 Proxy 객체를 사용하는 것

### Reference.

[[Spring] Filter, Interceptor, AOP 차이 및 정리](https://goddaehee.tistory.com/154)

[[Spring / AOP] Filter, Interceptor, AOP(스프링의 대표개념)](https://sallykim5087.tistory.com/158)

[스프링 MVC 2편 - 백엔드 웹 개발 활용 기술 - 인프런 강의](https://www.inflearn.com/course/스프링-mvc-2/dashboard)