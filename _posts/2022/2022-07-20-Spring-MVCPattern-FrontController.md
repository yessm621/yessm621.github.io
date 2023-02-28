---
layout: post
title:  "구 MVC 패턴과 프론트 컨트롤러"
# date: 2022-07-20 17:36:00
date: 2023-01-17 15:55:00
categories: [Spring]
tags:
  - Spring
  - DB
author: "유자"
---

## 목차

1. [웹 서버와 WAS](https://yessm621.github.io/http/2022/12/19/Web-WebServer-WAS/)
2. [서블릿](https://yessm621.github.io/spring/2022/12/20/Spring-Servlet/)
3. [쓰레드와 쓰레드 풀](https://yessm621.github.io/spring/2022/12/21/Spring-Thread/)
4. [SSR, CSR](https://yessm621.github.io/http/2022/12/19/Web-SSR-CSR/)
5. [MVC 패턴](https://yessm621.github.io/spring/2023/01/17/Spring-MVCPattern/)
6. [구 MVC 패턴과 프론트 컨트롤러](https://yessm621.github.io/spring/2023/01/17/Spring-MVCPattern-FrontController/)
7. [디스패처 서블릿](https://yessm621.github.io/spring/2023/01/17/Spring-DispatcherServlet/)
8. [로깅](https://yessm621.github.io/web/2022/07/21/Spring-Logging/)
9. [HTTP 메시지 컨버터](https://yessm621.github.io/spring/2022/07/21/Spring-HTTPMessageConverter/)
10. [요청 매핑 핸들러 어댑터 구조](https://yessm621.github.io/spring/2022/07/20/Spring-RequestMappingHandlerAdapter/)
11. [PRG Post/Redirect/Get](https://yessm621.github.io/spring/2023/01/19/Spring-PRG/)

## 구 MVC 패턴의 한계

MVC 패턴을 적용해 컨트롤러의 역할과 뷰 렌더링하는 역할을 구분하였지만 중복이 많고 필요하지 않은 코드가 많다.

### 포워드 중복

View로 이동하는 코드가 항상 중복 호출된다.
    
```java
RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
dispatcher.forward(request, response);
```
    
### ViewPath 중복

유지보수가 어렵다. JSP가 아닌 thymeleaf 같은 다른 뷰로 변경 시 전체 코드를 변경해야 한다.
    
```java
String viewPath = "/WEB-INF/views/new-form.jsp";
```
    
### 사용하지 않는 코드

아래의 코드를 사용하지 않을 때도 있다.
    
```java
HttpServletRequest request, HttpServletResponse response
```
    
### 공통 처리 어려움

단순히 공통 기능을 메서드로 뽑아도 결국 메서드를 항상 호출해야되고 실수로 호출하지 않으면 문제가 된다. 또한, 호출하는 것 자체도 중복이다.

이러한 한계점들은 `프론트 컨트롤러 패턴`을 도입하여 문제 해결이 가능하다.

## 프론트 컨트롤러 패턴

프론트 컨트롤러 서블릿 하나로 클라이언트의 요청을 받으면 프론트 컨트롤러가 요청에 맞는 컨트롤러를 찾아서 호출해준다. 즉, 입구를 하나로 만들어 **공통 처리**가 가능해져 프론트 컨트롤러를 제외한 나머지 컨트롤러는 서블릿을 사용하지 않아도 된다. 스프링 MVC의 핵심이 바로 `프론트 컨트롤러`이다.

![1](https://user-images.githubusercontent.com/79130276/212829906-629f5f48-7362-41db-aee4-e2c6297407da.jpg)

### 프론트 컨트롤러 패턴 특징

1. 프론트 컨트롤러 서블릿 하나로 클라이언트의 요청을 받는다.
2. 프론트 컨트롤러가 요청에 맞는 컨트롤러를 찾아서 호출한다.
3. 입구가 하나이므로 `공통 처리`가 가능하다.
4. 프론트 컨트롤러를 제외한 나머지 컨트롤러는 서블릿을 사용하지 않아도 된다.

스프링 웹 MVC의 핵심이 FrontController이고 스프링 웹 MVC의 **DispatcherServlet**이 `FrontController 패턴`으로 구현되어 있다.

![2](https://user-images.githubusercontent.com/79130276/212829912-779a4999-f63a-4119-b509-3737bcbc6eed.jpg)

### 핸들러 어댑터

핸들러 어댑터는 어댑터 역할을 해주어 다양한 종류의 컨트롤러를 호출 가능하다.

프론트 컨트롤러에 어댑터 패턴을 사용하면 프론트 컨트롤러가 다양한 방식의 컨트롤러를 처리할 수 있도록 변경할 수 있다. FrontController와 컨트롤러 사이에 `핸들러 어댑터`를 둔다.

### 핸들러

컨트롤러의 이름을 더 넓은 범위인 핸들러로 변경했다. 어댑터가 있기 때문에 컨트롤러 뿐만 아니라 어떠한 것이든 해당하는 종류의 어댑터만 있으면 처리가 가능하다. (핸들러와 컨트롤러는 같은 의미지만 핸들러가 더 넓은 범위에 속한다)