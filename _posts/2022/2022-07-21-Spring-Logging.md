---
title:  "로깅"
last_modified_at: 2022-07-21T10:15:00
categories: 
  - web
tags:
  - web
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

### 로깅

운영 시스템에서는 System.out.println()같은 시스템 콘솔 사용하지 않고 별도의 `로깅 라이브러리`를 사용해서 로그를 출력함

<br>

### 로깅 라이브러리

스프링 부트 라이브러리를 사용하면 스프링 부트 로깅 라이브러리(spring-boot-starter-logging) 포함

<br>

스프링 부트가 사용하는 기본 로깅 라이브러리

- SLF4J
- Logback

<br>

로그 라이브러리는 Logback, Log4J, Log4J2 등등 수 많은 라이브러리가 존재

그것을 통합해 인터페이스로 제공하는 것이 `SLF4J 라이브러리`

SLF4J는 인터페이스고, 그 구현체로 Logback 같은 로그 라이브러리를 선택

실무에서는 스프링 부트가 기본으로 제공하는 Logback을 대부분 사용

<br>

### 로그 선언

- private Logger log = LoggerFactory.getLogger(getClass());
- private static final Logger log = LoggerFactory.getLogger(Xxx.class)
- @Slf4j : 롬복 사용 가능

<br>

### 로그 호출

- log.info(”hello”)
- System.out.println(”hello)

<br>

시스템 콘솔로 직접 출력하는 것보다 `로그`를 사용하는게 좋다. 실무에서는 항상 **로그를 사용**해야 함.

```java
package hello.springmvc.basic;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@Slf4j
@RestController
public class LogTestController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @RequestMapping("/log-test")
    public String logTest() {
        String name = "Spring";

        log.trace("trace log={}", name);
        log.debug("debug log={}", name);
        log.info(" info log={}", name);
        log.warn(" warn log={}", name);
        log.error("error log={}", name);

        // 로그를 사용하지 않아도 a+b 계산 로직이 먼저 실행됨, 이런 방식으로 사용하면 X
        log.debug("String concat log=" + name);

        return "ok";
    }
}
```

**@RestController**

- @Controller는 반환값이 String이면 뷰 이름으로 인식됨. 따라서, **뷰를 찾고 뷰가 랜더링** 된다
- `@RestController`는 반환 값으로 뷰를 찾는 것이 아닌, **HTTP 메시지 바디에 바로 입력**됨. 따라서, 실행 결과로 ok 메세지를 받는다. @ResponseBody와 관련이 있음

<br>

### 테스트

- 로그가 출력되는 포맷 확인
    - 시간, 로그레벨, 프로세스ID, 쓰레드명, 클래스명, 로그 메시지
- 로그 레벨 설정을 변경해서 출력 결과 확인
    - LEVEL: TRACE > DEBUG > INFO > WARN > ERROR
    - 개발 서버는 `debug` 출력
    - 운영 서버는 `info` 출력
- @Slf4j로 변경: 다음 코드를 자동으로 생성해서 로그를 선언해준다. 개발자는 편리하게 log 라고 사용.
    
    ```java
    private static final org.slf4j.Logger log = 
    org.slf4j.LoggerFactory.getLogger(RequestHeaderController.class);
    ```
    
<br>

### 로그레벨 설정

application.properties

```
#전체 로그 레벨 설정(기본 info(debug))
logging.level.root=info

#hello.springmvc 패키지와 그 하위 로그 레벨 설정
logging.level.hello.springmvc=debug
```

<br>

### 올바른 로그 사용법

- log.debug(”data=”+data)
    - 로그 출력 레벨을 info로 설정해도 해당 코드에 있는 “data=”+data가 실행되어버림 (메모리 사용, cpu사용)
- `log.debug(”data={}”, data)`
    - 로그 출력 레벨을 info로 설정하면 아무일도 발생하지 않음. 따라서, 앞과 같은 의미없는 연산이 발생하지 않는다

<br>

### 로그 사용시 장점

- 쓰레드 정보, 클래스 이름 같은 부가 정보를 볼 수 있고, 출력 모양을 조정할 수 있음
- 개발 서버와 운영 서버 각각 상황에 맞게 로그 레벨을 조절할 수 있음 → **설정파일**을 통해
- 시스템 아웃 콘솔에만 출력하는 것이 아닌 파일, 네트워크 등 로그를 별도의 위치에 남길 수 있음. 특히, 파일로 남길 때 일별, 특정 용량에 따라 로그 분할 가능함
- 성능도 System.out 보다 좋음. (내부 버퍼링, 멀티 쓰레드 등) 실무에서는 꼭 `로그`를 사용!