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

뷰 템플릿으로 HTML을 생성해서 응답할 때는 viewResolver가 view를 찾아서 반환한다. 그런데 HTTP API 처럼 JSON 데이터를 HTTP 바디에 직접 읽거나 쓰는 경우에는 어떤 원리로 JSON ↔ 자바 객체로 변환되는 것일까? 

이에 대한 답은 `HTTP 메시지 컨버터`에 있다.

## HTTP 메시지 컨버터

`HTTP 메시지 컨버터` 인터페이스를 사용하면 JSON, String, Byte 타입으로 편리하게 반환할 수 있다.

![1](https://user-images.githubusercontent.com/79130276/227820100-12490dab-ad66-4a14-ad42-eb4bb2e12248.png)

- viewResolver 대신에 HttpMessageConverter가 동작
- 기본 문자처리: StringHttpMessageConverter (**문자**를 반환할 때)
- 기본 객체처리: MappingJackson2HttpMessageConverter (**JSON**을 반환할 때)

> **참고**
응답의 경우 클라이언트의 HTTP Accept 헤더와 서버의 컨트롤러 반환 타입 정보 둘을 조합해서 HttpMessageConverter가 선택된다.
> 

스프링 MVC의 **HTTP 메시지 컨버터**는 다음과 같은 기능을 제공한다.

- HTTP 요청: @RequestBody를 사용하여 JSON을 자바객체로 변환, HttpEntity(RequestEntity)
- HTTP 응답: @ResponseBody를 사용하여 자바객체를 JSON으로 변환, HttpEntity(ResponseEntity)

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
- canRead(), canWrite() : 메시지 컨버터가 해당 클래스, 미디어타입을 지원하는지 체크
- read(), write() : 메시지 컨버터를 통해서 메시지를 읽고 쓰는 기능

### 스프링 부트 기본 메시지 컨버터 (일부 생략)

```
0 = ByteArrayHttpMessageConverter: application/octet-stream
1 = StringHttpMessageConverter: text/plain
2 = MappingJackson2HttpMessageConverter: application/json
...
```

스프링 부트는 다양한 메시지 컨버터를 제공하는데, 대상 **클래스 타입**과 **미디어 타입** 둘을 체크해서 사용여부를 결정함. (만약, 만족하지 않으면 우선순위가 넘어감)

**ByteArrayHttpMessageConverter**

- byte[] 데이터 처리
- 클래스 타입: byte[], 미디어 타입: &#42;/&#42;
- 요청: 예) @RequestBody byte[] data
- 응답: 예) ResponseBody return byte[], 미디어 타입: application/octet-stream

**StringHttpMessageConverter**

```java
/*
  - content-type: application/json
  - StringHttpMessageConverter 호출
*/
@RequestMapping
void hello(@RequetsBody String data) {}
```

- String 문자로 데이터 처리
- 클래스 타입: String, 미디어 타입: &#42;/&#42;
- 요청: 예) @RequestBody String data
- 응답: 예) ResponseBody return “ok”, 미디어 타입: text/plain

**MappingJackson2HttpMessageConverter**

```java
/*
  - content-type: application/json
  - MappingJackson2HttpMessageConverter 호출
*/
@RequestMapping
void hello(@RequetsBody HelloData data) {}
```

- application/json
- 클래스 타입: 객체 또는 HashMap, 미디어 타입: application/json 관련
- 요청: 예) @RequestBody Object data
- 응답: 예) ResponseBody return data, 미디어 타입: application/json

### HTTP 요청 데이터 읽기

1. HTTP 요청이 오고, 컨트롤러에서 **@RequestBody , HttpEntity 파라미터**를 사용한다면
2. 메시지 컨버터가 우선순위에 따라 작동하며 
3. 메시지를 읽을 수 있는지 확인하기 위해 **canRead()**를 호출한다.
    - 대상 클래스 타입을 지원하는가.
        - 예) @RequestBody 의 대상 클래스 (byte[] , String , HelloData)
    - HTTP 요청의 Content-Type 미디어 타입을 지원하는가.
        - 예) text/plain , application/json , &#42;/&#42;
4. canRead() 조건을 만족하면 **read()**를 호출해서 객체 생성하고, 반환한다.

### HTTP 응답 데이터 생성

1. 컨트롤러에서 **@ResponseBody , HttpEntity**로 값이 반환되면
2. 메시지 컨버터가 메시지를 쓸 수 있는지 확인하기 위해 **canWrite()**를 호출한다.
    - 대상 클래스 타입을 지원하는가.
        - 예) return의 대상 클래스 (byte[] , String , HelloData)
    - HTTP 요청의 Accept 미디어 타입을 지원하는가.(더 정확히는 @RequestMapping 의 produces)
        - 예) text/plain , application/json , &#42;/&#42;
3. canWrite() 조건을 만족하면 **write()**를 호출해서 HTTP 응답 메시지 바디에 데이터를 생성한다.

이제 HTTP 메시지 컨버터가 어떤 과정을 걸치면서 반환타입이 변환 되는지 알게 되었다. 그렇다면 스프링 MVC 구조에서 **언제 HTTP 메시지 컨버터가 동작**할까?

이 부분에 대한 설명은 다음 [링크](https://yessm621.github.io/spring/2022/07/20/Spring-RequestMappingHandlerAdapter/)를 통해 확인하자.