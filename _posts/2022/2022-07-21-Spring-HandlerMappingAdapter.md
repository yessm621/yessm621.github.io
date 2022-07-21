---
title:  "핸들러 매핑과 핸들러 어댑터"
last_modified_at: 2022-07-21T15:45:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

### 핸들러 매핑과 핸들러 어댑터

컨트롤러를 호출하려면 `핸들러 매핑`과 `핸들러 어댑터`가 필요하다.

- HandlerMapping(핸들러 매핑)
    - 핸들러 매핑에서 컨트롤러를 찾을 수 있어야 함
    - 예) 스프링 빈의 이름으로 핸들러를 찾을 수 있는 핸들러 매핑이 필요함
- HandlerAdapter(핸들러 어댑터)
    - 핸들러 매핑을 통해서 찾은 핸들러를 실행할 수 있는 핸들러 어댑터가 필요
    - 예) Controller 인터페이스를 실행할 수 있는 핸들러 어댑터를 찾고 실행해야 함

<br>

스프링은 대부분의 핸들러 매핑과 핸들러 어댑터를 미리 구현해두었다. 우선순위에 따라 핸들러 매핑, 핸들러 어댑터를 찾는다.

그 중에서 가장 우선순위가 높은 핸들러 매핑과 핸들러 어댑터는 RequestMappingHandlerMapping, RequestMappingHandlerAdapter 이고 앞에 부분만 따서 RequestMapping이라 한다.

`@RequestMapping`은 현재 스프링에서 주로 사용하는 애노테이션 기반의 컨트롤러를 지원하는 매핑과 어댑터이다. (실무에서 99.9% 사용)

<br>

*요청 매핑 핸들러 어댑터 ([링크](https://yessm621.github.io//spring/Spring-RequestMappingHandlerAdapter/))*