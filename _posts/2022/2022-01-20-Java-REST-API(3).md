---
layout: post
title:  "REST API with SpringBoot(3)"
date: 2022-01-20 19:30:00
categories: [Spring]
tags:
  - Spring
  - Java
  - REST API
  - TEST CODE
author: "유자"
---

**백기선님 강의 정리**

[REST API with SpringBoot(1)](https://yessm621.github.io/springboot/Java-REST-API(1)/)

[REST API with SpringBoot(2)](https://yessm621.github.io/springboot/Java-REST-API(2)/)

[REST API with SpringBoot(3)](https://yessm621.github.io/springboot/Java-REST-API(3)/)

[REST API with SpringBoot(4)](https://yessm621.github.io/springboot/Java-REST-API(4)/)

## Event 생성 API 구현: 입력값 제한하기

dto를 사용하여 입력값을 제한하고 dto ↔ entity 를 변경할 땐 modelMapper 를 사용함

### ModelMapper란?

어떤 Object에 있는 필드값들을 Object로 Mapping 시켜줌

즉, dto to entity를 일일히 정의할 필요없음

**주의!**

ModelMapper는 해당 클래스의 기본 생성자를 이용해 객체를 생성하고 **setter를 이용해 매핑**을 한다. 따라서, setter 어노테이션을 붙이지 않으면 json으로 null이 반환된다.

**[참고]**

**ModelMapper를 사용**하면서 **setter를 사용하고 싶지 않다**면 다음과 같이 `빈으로 등록`해주면 된다

→ Access level 이 **public**인데 이를 `Private level`로 바꾸면 setter 없이도 필드명이 같을 때 자동 매핑 처리 할 수 있음

```java
package me.yessm.airbnbjava.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                .setFieldMatchingEnabled(true);
        return modelMapper;
    }
}
```

pom.xml 에 추가

```xml
<!-- https://mvnrepository.com/artifact/org.modelmapper/modelmapper -->
<dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>2.4.5</version>
</dependency>
```

EventController.java

```java
...

private final ModelMapper modelMapper;

...

	Event event = modelMapper.map(eventDto, Event.class);

	/* 위의 코드와 아래 코드는 같다.
	Event event = Event.builder()
                .name(eventDto.getName())
                .description(eventDto.getDescription())
                ...
                .build();*/
```

입력값을 제한하기 위해 entity 대신 DTO를 사용

### DTO 를 사용하는 이유?

1. 엔티티 내부 구현을 캡슐화할 수 있다
2. 화면에 필요한 데이터를 선별할 수 있다.
3. 순환참조를 예방할 수 있다.
4. validation 코드와 모델링 코드를 분리할 수 있다.

@WebMvcTest는 슬라이싱 테스트

→ 통합테스트를 전환함(@SpringBootTest)

```java
package me.whiteship.demoinflearnrestapi.events;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URI;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

@Controller
@RequestMapping(value = "/api/events", produces = MediaTypes.HAL_JSON_VALUE)
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;

    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity createEvent(@RequestBody EventDto eventDto) {
        Event event = modelMapper.map(eventDto, Event.class);
        Event newEvent = eventRepository.save(event);
        URI createdUri =linkTo(EventController.class).slash(newEvent.getId()).toUri();
        return ResponseEntity.created(createdUri).body(event);
    }
}

```

```java
package me.whiteship.demoinflearnrestapi.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest
public class EventControllerTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    EventRepository eventRepository;

    @Test
    public void createEvent() throws Exception {
        Event event = Event.builder()
                .id(100)
                .name("Spring")
                .description("REST API development with Spring")
                .beginEnrollmentDatetime(LocalDateTime.of(2022, 1, 18, 14, 21, 22))
                .closeEnrollmentDatetime(LocalDateTime.of(2022, 1, 19, 14, 21, 22))
                .beginEventDatetime(LocalDateTime.of(2022, 1, 25, 14, 21, 22))
                .endEventDatetime(LocalDateTime.of(2022, 1, 26, 14, 21, 22))
                .basePrice(100)
                .maxPrice(200)
                .limitIfEnrollment(100)
                .location("강남역")
                .free(true)
                .offline(false)
                .eventStatus(EventStatus.PUBLISHED)
                .build();

        Mockito.when(eventRepository.save(event)).thenReturn(event);

        mockMvc.perform(post("/api/events/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaTypes.HAL_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andDo(print()) // 어떤 요청과 응답을 받았는지 알 수 있음
                .andExpect(status().isCreated())
                .andExpect(jsonPath("id").exists())
                .andExpect(header().exists(HttpHeaders.LOCATION))
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaTypes.HAL_JSON_VALUE))
                .andExpect(jsonPath("id").value(Matchers.not(100)))
                .andExpect(jsonPath("free").value(Matchers.not(true)))
                .andExpect(jsonPath("eventStatus").value(Matchers.not(EventStatus.DRAFT)));
    }

}
```

이렇게 코드를 작성하면 newEvent.getId() 부분에서 **NullPointException**이 발생함

→ why? 

모키토에서 작성한 eventRepository.save(event)가 호출되면 event 를 반환한다는 코드

newEvent 객체와 test코드에서 작성한 event 객체는 다른 객체이기 때문에 save()를 호출해도 반환되는 값이 null. 따라서, 오류 발생

## Event 생성 API 구현: Bad Request 처리하기

### 입력값 이외에 에러 발생, 입력값이 비어있는 경우 에러 발생

입력 값이 정해진 값 이외에 다른 값이 들어왔을 경우 

1. 무시하는 방법: 유연한 방법
2. 에러를 발생시키는 방법: Bad Request 발생

application.properties 설정

```
spring.jackson.deserialization.fail-on-unknown-properties=true
```

```java
	
	...

	@Test
    @DisplayName("입력 받을 수 없는 값을 사용한 경우에 에러가 발생하는 테스트")
    public void createEvent_Bad_Request() throws Exception {
        Event event = Event.builder()
                .id(100)
                .name("Spring")
                .description("REST API development with Spring")
                .beginEnrollmentDateTime(LocalDateTime.of(2022, 1, 18, 14, 21, 22))
                .closeEnrollmentDateTime(LocalDateTime.of(2022, 1, 19, 14, 21, 22))
                .beginEventDateTime(LocalDateTime.of(2022, 1, 25, 14, 21, 22))
                .endEventDateTime(LocalDateTime.of(2022, 1, 26, 14, 21, 22))
                .basePrice(100)
                .maxPrice(200)
                .limitIfEnrollment(100)
                .location("강남역")
                .free(true)
                .offline(false)
                .eventStatus(EventStatus.PUBLISHED)
                .build();

        mockMvc.perform(post("/api/events/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaTypes.HAL_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andDo(print()) // 어떤 요청과 응답을 받았는지 알 수 있음
                .andExpect(status().isBadRequest());
    }

		@Test
    @DisplayName("입력 값이 비어있는 경우에 에러가 발생하는 테스트")
    public void createEvent_Bad_Request_Empty_Input() throws Exception {
        EventDto eventDto = EventDto.builder().build();

        mockMvc.perform(post("/api/events/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(eventDto)))
                .andExpect(status().isBadRequest());
    }

	...
```

```java
package me.whiteship.demoinflearnrestapi.events;

...

@Controller
@RequestMapping(value = "/api/events", produces = MediaTypes.HAL_JSON_VALUE)
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;

    private final ModelMapper modelMapper;

    private final EventValidator eventValidator;

    @PostMapping
    public ResponseEntity createEvent(@RequestBody @Validated EventDto eventDto, Errors errors) {
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

        ...
    }
}
```

**@Valid 또는 @Validated 어노테이션 추가**

→ 유효성 검증 진행

@Valid는 controller 에서만 동작, 다른 계층에서는 검증이 되지 않는다

다른 계층에서 검증을 진행하기 위해선 @Validated 를 사용

(요청 파라미터의 유효성 검증은 컨트롤러에서 처리하고 서비스나 리포지토리 계층에서는 유효성 검증을 하지 않는 것이 바람직함)

의존성 추가(gradle, maven)

build.gradle

```java
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

pom.xml

```xml
		<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
            <version>2.6.2</version>
        </dependency>
```

컨트롤러에서 Request 객체 앞에 @Validate(@Valid) 어노테이션을 사용하고, Errors 를 통해 유효성 검사 적합 여부를 확인

Errors는 반드시 Request 객체 바로 뒤에 위치해야 한다.

(두개의 객체를 유효성 검사한다면 각각의 객체 뒤에 Errors 존재해야 함)

hasErrors() 메서드를 통해 에러 return

```java
package me.whiteship.demoinflearnrestapi.events;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EventDto {

    @NotEmpty
    private String name;
    @NotEmpty
    private String description;
    @NotNull
    private LocalDateTime beginEnrollmentDateTime;
    @NotNull
    private LocalDateTime closeEnrollmentDateTime;
    @NotNull
    private LocalDateTime beginEventDateTime;
    @NotNull
    private LocalDateTime endEventDateTime;
    private String location;
    @Min(0)
    private int basePrice;
    @Min(0)
    private int maxPrice;
    @Min(0)
    private int limitIfEnrollment;

}
```

JSR 표준 스펙은 다양한 제약 조건 어노테이션을 제공하고 있는데, 대표적인 어노테이션으로는 다음과 같은 것들이 있다.

- @NotNull: 해당 값이 null이 아닌지 검증함
- @NotEmpty: 해당 값이 null이 아니고, 빈 스트링("") 아닌지 검증함(" "은 허용됨)
- @NotBlank: 해당 값이 null이 아니고, 공백(""과 " " 모두 포함)이 아닌지 검증함
- @AssertTrue: 해당 값이 true인지 검증함
- @Size: 해당 값이 주어진 값 사이에 해당하는지 검증함(String, Collection, Map, Array에도 적용 가능)
- @Min: 해당 값이 주어진 값보다 작지 않은지 검증함
- @Max: 해당 값이 주어진 값보다 크지 않은지 검증함

### 입력값이 잘못된 경우 에러 발생

```java
package me.whiteship.demoinflearnrestapi.events;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

import java.time.LocalDateTime;

@Component
public class EventValidator {

    public void validate(EventDto eventDto, Errors errors) {
        if (eventDto.getBasePrice() > eventDto.getMaxPrice() && eventDto.getMaxPrice() > 0) {
            errors.rejectValue("basePrice", "wrongValue", "BasePrice is wrong.");
            errors.rejectValue("maxPrice", "wrongValue", "MaxPrice is wrong.");
        }

        LocalDateTime endEventDateTime = eventDto.getEndEventDateTime();
        if(endEventDateTime.isBefore(eventDto.getBeginEventDateTime()) ||
                endEventDateTime.isBefore(eventDto.getCloseEnrollmentDateTime()) ||
                endEventDateTime.isBefore(eventDto.getBeginEnrollmentDateTime())) {
            errors.rejectValue("endEventDateTime", "wrongValue", "EndEventDateTime is wrong.");
        }

        // TODO beginEventDateTime
        // TODO CloseEndrollmentDateTime
    }
}
```

@Component를 이용해 빈으로 등록해주고 EventController 에서 의존성 주입해서 사용

```java
@Controller
@RequestMapping(value = "/api/events", produces = MediaTypes.HAL_JSON_VALUE)
@RequiredArgsConstructor
public class EventController {

    ...

    private final EventValidator eventValidator;

    @PostMapping
    public ResponseEntity createEvent(@RequestBody @Validated EventDto eventDto, Errors errors) {
        ...

        eventValidator.validate(eventDto, errors);
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

				...

		}
}
```

### 테스트 설명용 어노테이션 생성

```java
package me.whiteship.demoinflearnrestapi.common;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface TestDescription {

    String value();
}
```

```java
...

// 커스텀 어노테이션
@TestDescription("정상적으로 이벤트를 생성하는 테스트")

...
```

**@Target**

Java compiler가 annotation이 어디에 적용될지 결정하기 위해 사용

```java
ElementType.PACKAGE : 패키지 선언
ElementType.TYPE : 타입 선언
ElementType.ANNOTATION_TYPE : 어노테이션 타입 선언
ElementType.CONSTRUCTOR : 생성자 선언
ElementType.FIELD : 멤버 변수 선언
ElementType.LOCAL_VARIABLE : 지역 변수 선언
ElementType.METHOD : 메서드 선언
ElementType.PARAMETER : 전달인자 선언
ElementType.TYPE_PARAMETER : 전달인자 타입 선언
ElementType.TYPE_USE : 타입 선언
```

**@Retention**

실제로 적용되고 유지되는 범위를 의미

```java
// 컴파일 이후에도 JVM에 의해서 계속 참조가 가능. 리플렉션, 로깅에 많이 사용
RetentionPolicy.RUNTIME
// 컴파일러가 클래스를 참조할 때까지 유효
RetentionPolicy.CLASS
// 컴파일 전까지만 유효. 컴파일 이후에는 사라짐
RetentionPolicy.SOURCE
```

커스텀 어노테이션을 생성해도 되지만 Junit에서 지원해주는 **@DisplayName**을 사용해도 된다.