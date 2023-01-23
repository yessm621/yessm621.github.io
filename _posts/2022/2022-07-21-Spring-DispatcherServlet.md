---
title:  "디스패처 서블릿"
# last_modified_at: 2022-07-21T10:15:00
last_modified_at: 2023-01-17T16:00:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

## 목차

1. [웹 서버와 WAS](https://yessm621.github.io/http/Web-WebServer-WAS/)
2. [서블릿](https://yessm621.github.io/spring/Spring-Servlet/)
3. [쓰레드와 쓰레드 풀](https://yessm621.github.io/spring/Spring-Thread/)
4. [SSR, CSR](https://yessm621.github.io/http/Web-SSR-CSR/)
5. [MVC 패턴](https://yessm621.github.io/spring/Spring-MVCPattern/)
6. [구 MVC 패턴과 프론트 컨트롤러](https://yessm621.github.io/spring/Spring-MVCPattern-FrontController/)
7. [디스패처 서블릿](https://yessm621.github.io/spring/Spring-DispatcherServlet/)
8. [로깅](https://yessm621.github.io/web/Spring-Logging/)
9. [HTTP 메시지 컨버터](https://yessm621.github.io/spring/Spring-HTTPMessageConverter/)
10. [요청 매핑 핸들러 어댑터 구조](https://yessm621.github.io/spring/Spring-RequestMappingHandlerAdapter/)
11. [PRG Post/Redirect/Get](https://yessm621.github.io/spring/Spring-PRG/)

## DispatcherServlet

스프링 MVC도 `프론트 컨트롤러 패턴`으로 구현하였으며 스프링 MVC의 프론트 컨트롤러가 `디스패처 서블릿`이다. 디스패처 서블릿은 스프링 MVC의 핵심이다.

*프론트 컨트롤러와 관련된 내용 ([링크](https://yessm621.github.io/spring/Spring-MVCPattern-FrontController/))*

![1](https://user-images.githubusercontent.com/79130276/212831173-07380bae-5c11-4380-9c18-ccb2ffd7a69c.jpg)

DispatcherServlet도 부모 클래스에서 **HttpServlet을 상속**받아서 사용하며 서블릿으로 동작한다.

```
DispatcherServlet → FrameworkServlet → HttpServletBean → HttpServlet
```

스프링 부트는 DispatcherServlet을 서블릿으로 자동으로 등록하면서 모든 경로(urlPatterns=”/”)에 대해 매핑한다.

### DispatcherServlet 요청 흐름

1. 서블릿이 호출되면 HttpServlet이 제공하는 service()가 호출된다.
2. 스프링 MVC는 DispatcherServlet의 부모인 FrameworkServlet에서 service()를 오버라이드 한다.
3. FrameworkServlet.service()를 시작으로 여러 메서드가 호출되면서 DispatcherServlet.doDispatch()가 호출됨

### DispatcherServlet.doDispatch()

DispatcherServlet의 핵심 코드는 `doDispatch() 메서드`이다.

```java
// DispatcherServlet의 핵심 코드
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {

    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    ModelAndView mv = null;

    // 1. 핸들러 조회
    mappedHandler = getHandler(processedRequest);
    if (mappedHandler == null) {
        noHandlerFound(processedRequest, response);
        return;
    }

    // 2. 핸들러 어댑터 조회 - 핸들러를 처리할 수 있는 어댑터
    HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

    // 3. 핸들러 어댑터 실행 -> 4. 핸들러 어댑터를 통해 핸들러 실행 -> 5. ModelAndView 반환
    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

    processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);

}

private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,
			HandlerExecutionChain mappedHandler, ModelAndView mv, Exception exception) throws Exception {

    // 뷰 렌더링 호출
    render(mv, request, response);

}

protected void render(ModelAndView mv, HttpServletRequest request,
    HttpServletResponse response) throws Exception {

    View view;
    String viewName = mv.getViewName();

    // 6. 뷰 리졸버를 통해서 뷰 찾기, 7. View 반환
    view = resolveViewName(viewName, mv.getModelInternal(), locale, request);

    // 8. 뷰 렌더링
    view.render(mv.getModelInternal(), request, response);
}
```

### DispatcherServlet 동작 프로세스

![1](https://user-images.githubusercontent.com/79130276/212831173-07380bae-5c11-4380-9c18-ccb2ffd7a69c.jpg)

1. 핸들러 조회: 핸들러 매핑을 통해 요청 URL에 매핑된 핸들러(컨트롤러)를 찾는다.
2. 핸들러 어댑터 조회: 핸들러를 처리할 수 있는 핸들러 어댑터를 찾는다.
3. 찾았으면 처리할 데이터를 핸들러 어댑터를 실행하여 실제 핸들러(컨트롤러)에 전달한다.
4. ModelAndView 반환: 핸들러가 데이터를 처리하여 반환하면 핸들러 어댑터가 ModelAndView로 **변환**해서 반환한다.
5. viewResolver 호출: 뷰 리졸버를 찾고 실행한다.
    - JSP의 경우 InternalResourceViewResolver가 자동 등록되고 사용됨
6. View 반환: 뷰 리졸버는 뷰의 논리 이름을 물리 이름으로 바꾸고 렌더링 역할을 담당하는 뷰 객체를 반환한다.
    - JSP의 경우 InternalResourceView(JstlView) 를 반환하는데, 내부에 forward() 로직이 있다
7. 뷰 렌더링: 뷰를 통해서 뷰를 렌더링.

스프링 MVC의 강점은 DispatcherServlet 코드의 변경 없이 원하는 기능을 `변경, 확장`할 수 있다는 점이다. (대부분을 확장 가능하도록 인터페이스로 제공하기 때문이다.)

> **참고** 주요 인터페이스 목록
> 
> - 핸들러 매핑: org.springframework.web.servlet.HandlerMapping
> - 핸들러 어댑터: org.springframework.web.servlet.HandlerAdapter
> - 뷰 리졸버: org.springframework.web.servlet.ViewResolver
> - 뷰: org.springframework.web.servlet.View

## 핸들러 매핑과 핸들러 어댑터

컨트롤러를 호출하려면 `핸들러 매핑`과 `핸들러 어댑터`가 필요하다.

핸들러 매핑과 핸들러 어댑터를 이해하기 위해 지금은 전혀 사용하지 않지만 과거에 주로 사용했던 스프링이 제공하는 간단한 컨트롤러를 살펴보자.

### Controller 인터페이스

과거 버전 스프링 컨트롤러이다. 현재는 @Controller 어노테이션을 사용한다.

```java
// org.springframework.web.servlet.mvc.Controller
public interface Controller {
	ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception;
}
```

> **참고** Controller 인터페이스와 @Controller는 전혀 다름
> 

```java
//import org.springframework.web.servlet.mvc.Controller;

@Component("/springmvc/old-controller")
public class OldController implements Controller {
    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        System.out.println("OldController.handleRequest");
        return null;
    }
}
```

@Component는 OldController는 /springmvc/old-controller라는 이름의 스프링 빈으로 등록된다. **빈의 이름으로 URL을 매핑**시킨 것이다. 결론적으로 OldController가 스프링 빈, /springmvc/old-controller이 빈 이름이다.

### 핸들러 매핑

핸들러 매핑에서 컨트롤러를 찾을 수 있어야 한다. (예. 스프링 빈의 이름으로 핸들러를 찾을 수 있는 핸들러 매핑이 필요함)

### 핸들러 어댑터

핸들러 매핑을 통해서 찾은 핸들러를 실행할 수 있는 핸들러 어댑터가 필요하다. (예. Controller 인터페이스를 실행할 수 있는 핸들러 어댑터를 찾고 실행해야 함)

스프링은 대부분의 핸들러 매핑과 핸들러 어댑터를 미리 구현해두었기 때문에 개발자가 직접 핸들러 매핑과 핸들러 어댑터를 구현하는 일이 거의 없다.

### 스프링 부트가 자동 등록하는 핸들러 매핑과 어댑터

스프링은 핸들러 매핑, 핸들러 어댑터 모두 순서대로 찾고 없으면 다음 순서로 넘어간다. (종류는 실제로 더 많지만, 주요 핸들러 매핑과 어댑터만 소개함)

**HandlerMapping**

```
0 = RequestMappingHandlerMapping : 애노테이션 기반의 컨트롤러인 @RequestMapping에서 사용
1 = BeanNameUrlHandlerMapping : 스프링 빈의 이름으로 핸들러를 찾는다.
```

**HandlerAdapter**

```
0 = RequestMappingHandlerAdapter : 애노테이션 기반의 컨트롤러인 @RequestMapping에서 사용
1 = HttpRequestHandlerAdapter : HttpRequestHandler 처리
2 = SimpleControllerHandlerAdapter : Controller 인터페이스(애노테이션X, 과거에 사용) 처리
```

1. 핸들러 매핑으로 핸들러 조회
    - HandlerMapping을 순서대로 실행해서, 핸들러를 찾음
    - 이 경우, 빈 이름으로 핸들러를 찾아야 하기 때문에 이름 그대로 빈 이름으로 핸들러를 찾아주는 BeanNameUrlHandlerMapping가 실행에 성공하고 핸들러인 OldController를 반환함
2. 핸들러 어댑터 조회
    - HandlerAdapter의 supports()를 순서대로 호출
    - SimpleControllerHandlerAdapter가 Controller 인터페이스를 지원하므로 대상이 됨
3. 핸들러 어댑터 실행
    - 디스패처 서블릿이 조회한 SimpleControllerHandlerAdapter를 실행하면서 핸들러 정보도 함께 넘겨줌
    - SimpleControllerHandlerAdapter는 핸들러인 OldController를 내부에서 실행하고, 그 결과를 반환

**정리 - OldController 핸들러매핑, 어댑터**

OldController를 실행하면서 사용된 객체

- HandlerMapping = BeanNameUrlHandlerMapping (스프링 빈의 이름으로 핸들러를 찾음)
- HandlerAdapter = SimpleControllerHandlerAdapter (Controller 인터페이스 처리)

### RequestMappingHandlerMapping

가장 우선순위가 높은 핸들러 매핑과 핸들러 어댑터는 RequestMappingHandlerMapping, RequestMappingHandlerAdapter 이고 앞에 부분만 따서 RequestMapping이라 한다.

`@RequestMapping`은 현재 스프링에서 주로 사용하는 애노테이션 기반의 컨트롤러를 지원하는 매핑과 어댑터이다. (실무에서 99.9% 사용)

## 뷰 리졸버

스프링 부트는 `InternalResourceViewResolver` 라는 **뷰 리졸버**를 자동으로 등록하는데 이때, application.properties에 등록한 설정 정보를 사용한다.

```
spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp
```

### 뷰 리졸버 동작 방식

**스프링 부트가 자동 등록하는 뷰 리졸버**

```
1 = BeanNameViewResolver : 빈 이름으로 뷰를 찾아서 반환한다. (예: 엑셀 파일 생성 기능에 사용)
2 = InternalResourceViewResolver : JSP를 처리할 수 있는 뷰를 반환한다.
```

1. 핸들러 어댑터 호출
    - 핸들러 어댑터를 통해 new-form이라는 논리 뷰 이름을 획득
2. ViewResolver 호출
    - new-form이라는 뷰 이름으로 viewResolver를 순서대로 호출
    - BeanNameViewResolver는 new-form이라는 이름의 스프링 빈으로 등록된 뷰를 찾아야 하는데 없다
    - 그 다음 순위인 InternalResourceViewResolver가 호출됨
3. InternalResourceViewResolver
    - 이 뷰 리졸버는 InternalResourceView를 반환
4. 뷰 - InternalResourceView
    - InternalResourceView는 JSP처럼 포워드 forward()를 호출해서 처리할 수 있는 경우에 사용
5. view.render()
    - view.render()가 호출되고 InternalResourceView는 forward()를 사용해서 JSP를 실행함

> **참고**
<br>
Thymeleaf 뷰 템플릿을 사용하면 ThymeleafViewResolver를 등록해야 한다. 최근에는 라이브러리만 추가하면 스프링 부트가 이런 작업도 모두 자동화해준다.
>