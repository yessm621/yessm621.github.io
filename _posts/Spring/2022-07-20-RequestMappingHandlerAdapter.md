---
title: "요청 매핑 핸들러 어뎁터 구조"
categories:
  - Spring
tags:
  - Java
toc: true
toc_sticky: true
---

## 요청 매핑 핸들러 어뎁터 구조

HTTP 메시지 컨버터는 어디서 사용되는지 알아보자. HTTP 메시지 컨버터는 애노테이션 기반의 컨트롤러, 즉 @RequestMapping을 처리하는 핸들러 어댑터인 **RequestMappingHandlerAdapter(요청 매핑 헨들러 어댑터)**와 관련이 있다.

아래 그림은 스프링 MVC 동작 과정에서 핸들러 어댑터 ↔ 컨트롤러 과정을 좀 더 세부화한 것이다. 핸들러 어댑터가 컨트롤러를 호출하기 전에 `ArgumentResolver`를 호출하고 컨트롤러에서 핸들러 어댑터로 반환하기 전에 `ReturnValueHandler`가 호출되는 것을 알 수 있다.

![1](https://user-images.githubusercontent.com/79130276/179934878-b8d27f12-0620-40d9-8985-3453dcf548c8.png)

클라이언트와 서버가 요청과 응답을 주고 받을 때 매우 다양한 파라미터와 리턴 값으로 데이터를 주고 받을 수 있었다. 이는 `ArgumentResolver`와 `ReturnValueHandler`를 사용했기 때문에 가능하다.

## ArgumentResolver

컨트롤러의 요청 파라미터로 매우 다양한 파라미터를 사용할 수 있다. 사용할 수 있는 파라미터의 종류는 다음과 같다.

- HttpServletRequest, Model
- @RequestParam, @ModelAttribute 같은 애노테이션
- @RequestBody, HttpEntity 같은 HTTP 메시지를 처리하는 부분

이처럼 다양한 파라미터를 유연하게 처리할 수 있는 이유는 `ArgumentResolver` 덕분이다.

애노테이션 기반 컨트롤러를 처리하는 RequestMappingHandlerAdapter는 ArgumentResolver를 호출해서 컨트롤러(핸들러)가 필요로 하는 다양한 파라미터의 값(객체)을 생성한다. 그리고 파라미터의 값이 모두 준비되면 컨트롤러를 호출하면서 값을 넘겨준다.

스프링은 30개가 넘는 ArgumentResolver를 기본으로 제공한다.

> **참고** ArgumentResolver 가능한 파라미터 목록
<br>
[https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-arguments](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-)
> 

ArgumentResolver의 정확한 명칭은 HandlerMethodArgumentResolver인데 줄여서 ArgumentResolver라 부른다.

### ArgumentResolver 인터페이스

```java
public interface HandlerMethodArgumentResolver {
	boolean supportsParameter(MethodParameter parameter);
	
	@Nullable
	Object resolveArgument(MethodParameter parameter, 
                         @Nullable ModelAndViewContainer mavContainer,
                         NativeWebRequest webRequest, 
                         @Nullable WebDataBinderFactory binderFactory) throws Exception;
}
```

**ArugumentReolver의 동작 방식**

- ArgumentResolver의 supportsParameter()를 호출해서 해당 파라미터를 지원하는지 체크한다.
- 지원하면 resolverArgument()를 호출해서 실제 객체를 생성한다. 이렇게 생성된 객체는 컨트롤러 호출시 넘어간다.

ArgumentResolver는 인터페이스이기 때문에 **확장**해서 사용할 수 있다.

## ReturnValueHandler

HandlerMethodReturnValueHandler를 줄여서 `ReturnValueHandler`라 부른다. ArgumentResolver와 비슷한데, 이것은 응답 값을 변환하고 처리한다.

컨트롤러에서 String으로 뷰 이름을 반환해도, 동작하는 이유가 바로 ReturnValueHandler 덕분이다.

스프링은 10개가 넘는 ReturnValueHandler를 지원한다. 예) ModelAndView, @ResponseBody, HttpEntity, String

> **참고** 가능한 응답 값 목록
<br>
[https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-return-types](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-return-types)
> 

![2](https://user-images.githubusercontent.com/79130276/179934889-02928a3f-ae6c-4615-a4a0-fe660b6e34cc.png)

HTTP 메시지 컨버터를 사용하는 @RequestBody도 컨트롤러가 필요로 하는 파라미터의 값에 사용된다. @ResponseBody의 경우도 컨트롤러의 반환 값을 이용한다.

**요청**의 경우 @RequestBody를 처리하는 `ArgumentResolver`가 있고, HttpEntity를 처리하는 ArgumentResolver가 있다. 이 ArgumentResolver들이 HTTP 메시지 컨버터를 사용해서 필요한 객체를 생성하는 것이다. (HTTP 메시지 컨버터 - read())

**응답**의 경우 @ResponseBody와 HttpEntity를 처리하는 `ReturnValueHandler`가 있다. 그리고 여기에서 HTTP 메시지 컨버터를 호출해서 응답 결과를 만든다. (HTTP 메시지 컨버터 - write())

스프링 MVC는 @RequestBody, @ResponseBody가 있으면 RequestResponseBodyMethodProcessor  (ArgumentResolver)를 사용하고 HttpEntity가 있으면 HttpEntityMethodProcessor (ArgumentResolver)를 사용한다.

## 확장

스프링은 다음을 모두 인터페이스로 제공하여 언제든지 기능을 **확장**할 수 있다.

- HandlerMethodArgumentResolver
- HandlerMethodReturnValueHandler
- HttpMessageConverter

스프링은 대부분의 기능을 제공하기 때문에 실제 기능을 확장할 일이 많지는 않으나 알아는 두어야 한다. 기능 확장은 WebMvcConfigurer를 상속 받아서 스프링 빈으로 등록하면 된다.