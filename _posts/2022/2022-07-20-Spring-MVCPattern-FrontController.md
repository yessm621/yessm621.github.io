---
title:  "MVC 패턴과 프론트 컨트롤러"
last_modified_at: 2022-07-20T17:36:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

### 구 MVC 패턴의 한계

MVC 패턴을 적용해 컨트롤러의 역할과 뷰 렌더링하는 역할을 구분하였지만 중복이 많고 필요하지 않은 코드가 많다.

1. 포워드 중복: View로 이동하는 코드가 항상 중복 호출된다.
    
    ```java
    RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
    dispatcher.forward(request, response);
    ```
    
2. ViewPath 중복: 유지보수가 어렵다. JSP가 아닌 thymeleaf 같은 다른 뷰로 변경 시 전체 코드를 변경해야 한다.
    
    ```java
    String viewPath = "/WEB-INF/views/new-form.jsp";
    ```
    
3. 사용하지 않는 코드: 아래의 코드를 사용하지 않을 때도 있다.
    
    ```java
    HttpServletRequest request, HttpServletResponse response
    ```
    
4. 공통 처리가 어렵다: 단순히 공통 기능을 메서드로 뽑아도 결국 메서드를 항상 호출해야되고 실수로 호출하지 않으면 문제가 된다. 또한, 호출하는 것 자체도 중복이다.

<br>

이러한 한계점들은 `프론트 컨트롤러 패턴`을 도입하여 문제 해결이 가능하다.

<br>

### 프론트 컨트롤러 패턴의 특징

프론트 컨트롤러 서블릿 하나로 클라이언트의 요청을 받으면 프론트 컨트롤러가 요청에 맞는 컨트롤러를 찾아서 호출해준다. 즉, 입구를 하나로 만들어 공통 처리가 가능해져 프론트 컨트롤러를 제외한 나머지 컨트롤러는 서블릿을 사용하지 않아도 된다.