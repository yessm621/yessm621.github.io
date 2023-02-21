---
layout: post
title: "HTTP 메시지 컨버터"
date: 2022-07-21 15:45:00
categories: [Spring]
tags:
  - Spring
author: "유자"
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

뷰 템플릿으로 HTML을 생성해서 응답하는 것이 아니라, HTTP API처럼 JSON 데이터를 HTTP 메시지 바디에서 직접 읽거나 쓰는 경우 `HTTP 메시지 컨버터`를 사용하면 편리하다.

HTTP 메시지 컨버터는 다음과 같은 기능을 제공한다.

- @RequestBody를 사용하여 JSON → 자바객체로 변환
- @ResponseBody를 사용하여 자바객체 → JSON으로 변환

<br>

인터페이스인 HTTP 메시지 컨버터를 이용하여 JSON, Stirng, Byte 타입으로 편리하게 반환할 수 있다.

<br>

### HTTP 메시지 컨버터 인터페이스

```java
package org.springframework.http.converter;

public interface HttpMessageConverter<T> {

    boolean canRead(Class<?> clazz, @Nullable MediaType mediaType);
    boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType);

    List<MediaType> getSupportedMediaTypes();

    T read(Class<? extends T> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException;
    void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException;
}
```

- HTTP 메시지 컨버터는 HTTP 요청, HTTP 응답 둘 다 사용된다.
- canRead() , canWrite() : 메시지 컨버터가 해당 클래스, 미디어타입을 지원하는지 체크
- read() , write() : 메시지 컨버터를 통해서 메시지를 읽고 쓰는 기능

<br>

### 스프링 부트 기본 메시지 컨버터 (일부 생략)

```
0 = ByteArrayHttpMessageConverter
1 = StringHttpMessageConverter
2 = MappingJackson2HttpMessageConverter
...
```

스프링 부트는 다양한 메시지 컨버터를 제공하는데, 대상 **클래스 타입**과 **미디어 타입** 둘을 체크해서 사용여부를 결정함. (만약, 만족하지 않으면 우선순위가 넘어감)

<br>

**HTTP 요청 데이터 읽기**

1. HTTP 요청이 오고, 컨트롤러에서 @RequestBody , HttpEntity 파라미터를 사용한다면
2. 메시지 컨버터가 우선순위에 따라 작동하며 
3. 메시지를 읽을 수 있는지 확인하기 위해 canRead() 를 호출한다.
    - 대상 클래스 타입을 지원하는가.
        - 예) @RequestBody 의 대상 클래스 (byte[] , String , HelloData)
    - HTTP 요청의 Content-Type 미디어 타입을 지원하는가.
        - 예) text/plain , application/json , */*
4. canRead() 조건을 만족하면 read() 를 호출해서 객체 생성하고, 반환한다.

<br>

**HTTP 응답 데이터 생성**

1. 컨트롤러에서 @ResponseBody , HttpEntity 로 값이 반환되면
2. 메시지 컨버터가 메시지를 쓸 수 있는지 확인하기 위해 canWrite() 를 호출한다.
    - 대상 클래스 타입을 지원하는가.
        - 예) return의 대상 클래스 (byte[] , String , HelloData)
    - HTTP 요청의 Accept 미디어 타입을 지원하는가.(더 정확히는 @RequestMapping 의 produces)
        - 예) text/plain , application/json , */*
- canWrite() 조건을 만족하면 write() 를 호출해서 HTTP 응답 메시지 바디에 데이터를 생성한다.