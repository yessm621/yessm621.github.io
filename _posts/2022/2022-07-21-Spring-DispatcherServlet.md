---
title:  "디스패처 서블릿"
last_modified_at: 2022-07-21T10:15:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

![1](https://user-images.githubusercontent.com/79130276/180147212-5063a303-bf58-4fa8-b2a8-8568daf76be1.png)

![2](https://user-images.githubusercontent.com/79130276/180147229-d0d1f3b4-2e83-485d-baa6-37216a91c205.png)

- FrontController → DispatcherServlet
- handlerMappingMap → HandlerMapping
- MyHandlerAdapter → HandlerAdapter
- ModelView → ModelAndView
- viewResolver → ViewResolver
- MyView → View

<br>

직접 만든 프레임워크와 스프링 MVC는 명칭만 다를 뿐 구조는 동일하다. 

스프링 MVC도 `프론트 컨트롤러 패턴`으로 구현하였으며 스프링 MVC의 프론트 컨트롤러가 `디스패처 서블릿`이다. 디스패처 서블릿은 스프링 MVC의 핵심이다.

*프론트 컨트롤러와 관련된 내용 ([링크](https://yessm621.github.io/spring/Spring-MVCPattern-FrontController/))*

<br>

DispatcherServlet도 부모 클래스에서 **HttpServlet을 상속**받아서 사용하며 서블릿으로 동작한다.

```
DispatcherServlet → FrameworkServlet → HttpServletBean → HttpServlet
```

스프링 부트는 DispatcherServlet을 서블릿으로 자동으로 등록하면서 모든 경로(urlPatterns=”/”)에 대해 매핑한다.

<br>

DispatcherServlet 요청 흐름

1. 서블릿 호출, HttpServlet이 제공하는 service()가 호출됨
2. 스프링 MVC는 DispatcherServlet의 부모인 FrameworkServlet에서 service()를 오버라이드 함
3. FrameworkServlet.service()를 시작으로 여러 메서드가 호출되면서 `DispatcherServlet.doDispatch()(핵심!)` 가 호출됨

<br>

### 스프링 MVC 동작 프로세스

![3](https://user-images.githubusercontent.com/79130276/180147244-7afeaccd-dca6-44f3-9ffd-0c7df16a8ede.png)

1. 핸들러 조회: 핸들러 매핑을 통해 요청 URL에 매핑된 핸들러(컨트롤러)를 찾는다.
2. 핸들러 어댑터 조회: 핸들러를 처리할 수 있는 핸들러 어댑터를 찾는다.
3. 찾았으면 처리할 데이터를 핸들러 어댑터를 실행하여 실제 핸들러(컨트롤러)에 전달한다.
4. ModelAndView 반환: 핸들러가 데이터를 처리하여 반환하면 핸들러 어댑터가 ModelAndView로 **변환**해서 반환한다.
5. viewResolver 호출: 뷰 리졸버를 찾고 실행한다.
    - JSP의 경우 InternalResourceViewResolver가 자동 등록되고 사용됨
6. View 반환: 뷰 리졸버는 뷰의 논리 이름을 물리 이름으로 바꾸고 렌더링 역할을 담당하는 뷰 객체를 반환한다.
    - JSP의 경우 InternalResourceView(JstlView) 를 반환하는데, 내부에 forward() 로직이 있다
7. 뷰 렌더링: 뷰를 통해서 뷰를 렌더링.

<br>

스프링 MVC의 강점은 DispatcherServlet 코드의 변경 없이 원하는 기능을 변경, 확장할 수 있다는 점이다. (대부분을 확장 가능하도록 인터페이스로 제공하기 때문이다.)

**주요 인터페이스 목록**

- 핸들러 매핑: org.springframework.web.servlet.HandlerMapping
- 핸들러 어댑터: org.springframework.web.servlet.HandlerAdapter
- 뷰 리졸버: org.springframework.web.servlet.ViewResolver
- 뷰: org.springframework.web.servlet.View