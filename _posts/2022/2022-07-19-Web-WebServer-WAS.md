---
title:  "웹 서버와 WAS"
# last_modified_at: 2022-07-19T13:50:00
last_modified_at: 2022-12-19T15:30:00
categories: 
  - HTTP
tags:
  - Spring
  - HTTP
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

## 웹 서버(Web Server, WS)

`웹 서버`는 HTTP 기반으로 동작하며 **정적 리소스**를 제공한다. 정적 리소스에는 정적 html, css ,js, 이미지, 영상 등이 있다. nginx, apache가 웹 서버에 해당한다.

## 웹 어플리케이션 서버(WAS)

`WAS`는 HTTP 기반으로 동작하며 웹 서버 기능(정적 리소스 제공)도 제공할 수 있고 **애플리케이션 로직**도 수행한다. tomcat 등이 WAS에 해당된다.

## 웹 서버와 WAS의 차이점

사실 둘의 경계는 모호하다. 웹 서버도 프로그램을 실행하는 기능을 포함하기도 하고 WAS도 웹 서버의 기능을 제공한다. 차이점을 말하자면 **웹 서버**는 `정적 리소스를 제공`하는것에 특화되어있고, **WAS**는 `애플리케이션 로직을 수행`하는데 더 특화되어있다. 즉, 웹 서버 없이 WAS에서 모든 처리를 해결할 수 있으며, WAS 없이 WS 만으로 정적 웹을 만드는 것도 가능하다.

### 웹 서버와 WAS를 분리할 경우 장점

우선, 효율적인 리소스 관리가 가능하다. 정적 리소스가 많이 사용되면 웹 서버를 증설하고, 애플리케이션 리소스가 많이 사용되면 WAS를 증설한다.

또한, 정적 리소스를 제공하는 웹 서버의 경우엔 장애가 자주 발생하지 않는 반면, 애플리케이션 로직이 동작하는 WAS의 경우는 개발자의 로직 실수 등으로 장애가 자주 발생한다. 이처럼 WAS, DB 장애 시 웹 서버에서 **오류 화면을 제공**할 수 있어 사용자의 혼란을 줄일 수 있다.

> **참고** 
<br>
API 서버만 제공한다면 웹 서버는 구축하지 않아도 된다.
비용 측면에서 정적 리소스 보다 애플리케이션 로직이 더 비싸다.
>