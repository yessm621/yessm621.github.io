---
title:  "서블릿"
last_modified_at: 2022-07-19T17:25:00
categories: 
  - Spring
tags:
  - Spring
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---

## 서블릿

서블릿이란 Dynamic Web Page를 만들 때 사용되는 자바 기반의 웹 애플리케이션 프로그래밍 기술이다. 웹을 만들때는 다양한 요청과 응답이 있고 규칙이 존재하는데 이러한 요청과 응답을 일일이 처리하기 힘들. 서블릿은 이러한 웹 요청과 응답의 흐름을 간단한 메서드 호출만으로 체계적으로 다룰 수 있게 해주는 기술이다.

<br>

```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response){
		//애플리케이션 로직
	}
}
```

<br>

### 서블릿 특징

1. urlPatterns의 URL이 호출되면 서블릿 코드가 실행된다.
2. HTTP 요청, 응답 정보를 편리하게 사용할 수 있는 HttpServletRequest와 HttpServletResponse를 제공한다.
3. 개발자는 HTTP 스펙을 매우 편리하게 사용할 수 있다.

<br>

### 서블릿 HTTP 요청, 응답 흐름

클라이언트에서 URL 요청이 들어오면 WAS는 Request, Response 객체를 생성하고 서블릿 객체를 호출한다. 개발자는 Reqeust 객체에서 HTTP 요청 정보를 꺼내서 사용하고 Response 객체에서 HTTP 응답 정보를 편리하게 입력한다. WAS는 Response 객체에 담겨있는 내용으로 HTTP 응답 정보를 생성하여 클라이언트에 전달한다.

![Untitled](https://user-images.githubusercontent.com/79130276/179704447-6cdabb93-aede-4930-8191-aecec032373c.png)

<br>

### 서블릿 컨테이너

서블릿 컨테이너란 톰캣처럼 서블릿을 지원하는 WAS를 서블릿 컨테이너라고 한다. 서블릿 컨테이너는 서블릿 객체를 생성, 초기화, 호출, 종료하는 생명주기를 관리하는데 이때 싱글톤으로 관리한다.

고객의 요청이 올 때 마다 객체를 생성하는 것은 비효율적이므로 최초 로딩 시점에 서블릿 객체를 미리 만들어두고 재활용한다. 모든 고객의 요청은 동일한 서블릿 객체 인스턴스에 접근하며 서블릿 컨테이너 종료 시 함께 종료한다. 이때, **공유 변수** 사용에 주의해야한다.

JSP도 서블릿으로 변환되어서 사용하며 동시 요청을 위한 멀티 쓰레드 처리를 지원한다.

<br>

> **참고** 싱글톤 패턴(*[자세한 내용](https://yessm621.github.io/spring/Java-Singleton/)*)
**싱글톤 패턴**은 `객체를 딱 하나만 생성`하여 생성된 객체를 프로그램 어디에서나 접근하여 사용할 수 있도록 하는 패턴을 말함
개발을 하다보면 전역적으로 하나의 객체만을 사용해야 하는 경우가 종종 있다. 하지만, 특별히 제한을 걸어두지 않는다면 객체들이 여러 개로 복제되는 경우가 생길 수 있음. 이럴때 사용하는게 싱글톤 패턴! 
**싱글톤 패턴**을 사용하면 **객체 생성을 단 한번으로 제한**하여 객체들이 복제되는 경우를 방지할 수 있음. 또한, 클래스를 사용하는 여러 곳에서 인스턴스를 계속 생성하여 불필요하게 메모리 낭비를 유발할 수 있다고 판단되는 경우에도 싱글톤 패턴을 사용
> 

<br>

### 서블릿 사용예제

```java
package hello.servlet.basic;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "helloServelt", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ...
    }
}
```

- @WebServlet
    - name: 서블릿 이름
    - urlPatterns: URL 매핑
- protected void service(HttpServletRequest request, HttpServletResponse response)
    - HTTP 요청을 통해 매핑된 URL이 호출되면 서블릿 컨테이너는 service() 메서드를 실행한다.

<br>

### HttpServletReqeust

서블릿은 개발자가 HTTP 요청 메시지를 편리하게 사용할 수 있도록 요청 메시지를 파싱해준다. 그리고 그 결과를 HttpServletRequest 객체에 담아서 제공한다.

<br>

**HTTP 요청 데이터**

HTTP 요청 메시지를 통해 클라이언트에 서버로 데이터를 전달하는 방법이다.

1. GET - 쿼리 파라미터
    - /url?username=kim&age=20
    - message body 없이, URL의 **쿼리 파라미터**에 데이터를 포함해서 전달
2. POST - HTML Form
    - content-type: application/x-www-form-urlencoded
    - **message body에 쿼리 파라미터 형식**으로 전달 username=kim&age=20
3. HTTP message body
    - HTTP API에서 주로 사용, JSON, XML, TEXT
    - 데이터 형식은 주로 **JSON** 사용
    - POST, PUT, PATCH

<br>

### HttpServletResponse

HTTP 응답 메시지를 생성하여 HttpServletResponse 객체에 담아서 제공한다. (HTTP 응답코드, 헤더 생성, 바디 생성) 

ex) Content-Type: text/html, Content-Type: application/json