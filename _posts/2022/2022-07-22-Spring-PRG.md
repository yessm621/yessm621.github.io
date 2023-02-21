---
layout: post
title: "PRG, Post/Redirect/Get"
# date: 2022-07-22 23:45:00
date: 2023-01-19 17:00:00
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

## PRG 패턴

`PRG 패턴`이란 웹 개발 패턴 중 자주 쓰이는 패턴으로 HTTP POST 요청에 대해 GET 방식의 웹페이지로 `리다이렉트` 시키는 패턴이다.

PRG 패턴을 사용하게 된 이유는 아래 코드로 설명할 수 있다. 이 코드는 상품을 등록하고 상품 목록 페이지로 다시 돌아가는 코드이다. 이 코드에서는 오류가 있다. 상품을 등록을 완료하고 웹 브라우저의 **새로고침 버튼**을 누를 때마다 상품이 새로 등록된다.

```java
@PostMapping("/add")
public String addItemV5(Item item) {
    itemRepository.save(item);
    return "/basic/item"
}
```

왜 새로고침 버튼을 누를 때마다 새로 등록될까? 새로고침은 클라이언트 마지막에 보낸 요청을 다시 보낸다. 즉, 클라이언트가 서버에게 보낸 마지막 요청이 상품을 등록하는 것이기 때문에 새로고침을 할 때마다 상품이 새로 등록된다.

## PRG - 새로고침 문제 해결

PRG 패턴으로 이 문제를 해결할 수 있다.

웹 브라우저의 새로 고침은 마지막에 서버에 전송한 데이터를 다시 전송한다. 새로 고침 문제를 해결하려면 상품 저장 후에 뷰 템플릿으로 이동하는 것이 아니라, 상품 상세 화면으로 `리다이렉트를 호출`해주면 된다.

웹 브라우저는 리다이렉트의 영향으로 상품 저장 후에 실제 상품 상세 화면으로 다시 이동한다. 따라서, 마지막에 호출한 내용이 상품 상세 화면인 ‘GET /items/{id}’ 가 되는 것이다. 이후 새로고침을 해도 상품 상세 화면으로 이동하게 되므로 새로 고침 문제를 해결할 수 있다.

```java
/**
 * PRG - Post/Redirect/Get
 */
@PostMapping("/add")
public String addItemV5(Item item) {
    itemRepository.save(item);
    // return "/basic/item"
    return "redirect:/basic/items/" + item.getId();
}
```

기존엔 상품 등록 후 뷰 템플릿(/basic/item)을 리턴하였는데 이젠 상품 상세 화면으로 리다이렉트 하도록 코드를 작성하여 문제를 해결하였다. 이런 문제 해결 방식을 `PRG Post/Redirect/Get`라 한다.

### PRG 적용 전

1. ‘POST /items/add + 상품 데이터‘를 서버로 전송
2. 서버에서 클라이언트로 ‘POST + 200 응답코드’ 전달
3. 클라이언트가 서버에 마지막으로 요청한 url은 ‘POST /items/add + 상품 데이터‘ 이다
4. 클라이언트의 새로고침은 마지막에 서버에 전송한 데이터를 다시 전송하는 것이다
5. 따라서, 새로고침을 할때마다 1번을 전송한다. (무의미한 데이터를 저장하게 된다)

<img width="568" alt="스크린샷 2022-07-22 오후 11 23 16" src="https://user-images.githubusercontent.com/79130276/180464226-cc5f7b3c-37a0-40f5-8b02-d640f10a31aa.png">

### PRG 적용 후

1. ‘POST /items/add + 상품 데이터‘를 서버로 전송
2. 서버에서 클라이언트로 ‘POST + 302 응답 코드 + Location’ 전달
3. 302 응답 코드와 Location이 전달되면 Location에 적힌 url을 다시 호출하게 된다.
4. 따라서, 클라이언트는 서버에 ‘GET + /items/{id}’를 요청하게 된다.
5. 클라이언트가 서버에 마지막으로 요청한 url은 ‘GET + /items/{id}’ 이다
6. 클라이언트의 새로고침은 마지막에 서버에 전송한 데이터를 다시 전송하는 것이다
7. 따라서, 새로고침을 할때마다 5번을 전송한다. (새로고침 오류를 해결!)

<img width="613" alt="스크린샷 2022-07-22 오후 11 25 43" src="https://user-images.githubusercontent.com/79130276/180464206-79a1214a-c986-45e5-a805-1a54b4e7cf20.png">

> **주의**
<br>
`"redirect:/basic/items/" + item.getId()`  redirect에서 **+item.getId()** 처럼 URL에 변수를 더해서 사용하는 것은 URL 인코딩이 안되기 때문에 위험하다. 위의 경우는 int여서 괜찮았지만 문자열을 전송하게 되어 한글을 전송하게 된다면 인코딩 문제가 발생하게 된다. 이러한 문제는 다음에 설명하는 `RedirectAttributes`를 사용하여 해결할 수 있다.
> 

## RedirectAttributes

`RedirectAttributes`를 사용하면 URL **인코딩**도 해주고, **pathVarible**, **쿼리 파라미터**까지 처리해준다.

- redirect:/basic/items/{itemId}
    - pathVariable 바인딩: {itemId}
    - 나머지는 쿼리 파라미터로 처리: ?status=true

```java
/**
 * RedirectAttributes
 */
@PostMapping("/add")
public String addItemV6(Item item, RedirectAttributes redirectAttributes) {
    Item savedItem = itemRepository.save(item);
    redirectAttributes.addAttribute("itemId", savedItem.getId());
    redirectAttributes.addAttribute("status", true);
    return "redirect:/basic/items/{itemId}";
}
```

코드를 실행하면 ‘http://localhost:8080/basic/items/3?status=true’ 리다이렉트 결과가 나온다.