---
layout: post
title:  "REST API with SpringBoot(2)"
date: 2022-01-16 21:17:00
categories: [Spring]
tags:
  - Spring
  - Java
  - REST API
author: "유자"
---


## 목차

1. [REST API with SpringBoot(1)](https://yessm621.github.io/spring/2022/01/16/Java-REST-API(1)/)
2. [REST API with SpringBoot(2)](https://yessm621.github.io/spring/2022/01/16/JAVA-REST-API(2)/)
3. [REST API with SpringBoot(3)](https://yessm621.github.io/spring/2022/01/20/Java-REST-API(3)/)
4. [REST API with SpringBoot(4)](https://yessm621.github.io/spring/2022/01/22/Java-REST-API(4)/)

## project dependencies

![Untitled1](https://user-images.githubusercontent.com/79130276/149884411-1e9be2c0-404a-4a77-a53f-d079b3200227.png)

## Event 도메인 구현

```java
package me.whiteship.demoinflearnrestapi.events;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class Event {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String description;
    private LocalDateTime beginEnrollmentDatetime;
    private LocalDateTime closeEnrollmentDatetime;
    private LocalDateTime beginEventDatetime;
    private LocalDateTime endEventDatetime;
    private String location;
    private int basePrice;
    private int maxPrice;
    private int limitIfEnrollment;
    private boolean offline;
    private boolean free;

    @Enumerated(EnumType.STRING)
    private EventStatus eventStatus;
}
```

```java
package me.whiteship.demoinflearnrestapi.events;

public enum EventStatus {

    DRAFT, PUBLISHED, BEGAN_ENROLLMENT
}
```

### 생성자를 자동 생성해주는 Lombok 어노테이션

- @NoArgsConstructor: 파라미터가 없는 기본 생성자
- @AllArgsConstructor: 모든 필드 값을 파라미터로 받는 생성자
- @RequiredArgsConstructor: final이나 @NonNull 인 필드 값만 파라미터로 받는 생성자

### @EqualsAndHashCode

equals와 hashcode를 자동으로 생성해주는 어노테이션

- equals: 두 객체의 내용이 같은지, 동등성을 비교
- hashcode: 두 객체가 같은 객체인지, 동일성을 비교

exclude: toString의 exclude와 마찬가지로 포함시키지 않으려면 ‘exclude={필드명}’ 작성

of: 연관관계가 복잡해질 때, stack overflow가 발생할 수 있기 때문에 id 값만 주로 사용

### @Data를 사용할 때 주의할 점

하나의 어노테이션으로 많은 메소드를 자동으로 생성하면 편리한 것이 사실이지만, ORM(Object Relational Mapping)에서 주의해야 함

서로 무한 반복 호출이 진행되면서 stack overflow를 유발할 수 있으므로 몇라인 길어지더라도 @Getter, @Setter, @ToString 등 따로 사용하는게 좋음

### @Builder를 사용할 때 @AllArgsConstructor가 필요한 이유?

빌더는 필드의 초기화 작업을 도와주는 역할을 하는데 @NoArgsConstructor 와 같이 생성자에 멤버변수가 존재하지 않으면 의미가 없다. 따라서 @Builder를 사용할 때 @AllArgsConstructor를 정의하거나 전체 멤버변수를 갖는 생성자를 만들어야한다.

## Event 테스트 구현

```java
package me.whiteship.demoinflearnrestapi.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
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
                .build();

        event.setId(10);
        Mockito.when(eventRepository.save(event)).thenReturn(event);

        mockMvc.perform(post("/api/events/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaTypes.HAL_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andDo(print()) // 어떤 요청과 응답을 받았는지 알 수 있음
                .andExpect(status().isCreated())
                .andExpect(jsonPath("id").exists())
                .andExpect(header().exists(HttpHeaders.LOCATION))
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaTypes.HAL_JSON_VALUE));
    }

}

```

### @WebMvcTest

- MVC를 위한 테스트, 컨트롤러가 예상대로 동작하는 테스트하는데 사용
- @SpringBootTest 보다 가벼운 테스트가 가능
- MockBean, MockMVC를 자동 구성하여 테스트 가능하도록 함
- 스프링 부트 슬라이스 테스트

### @Autowired MockMvc mockMvc;

- 스프링 MVC 테스트 핵심 클래스
- 웹 서버를 띄우지 않고도 스프링 MVC (DispatcherServlet)가 요청을 처리하는 과정을 확인할 수 있기 때문에 컨트롤러 테스트용으로 자주 쓰임

### mockMvc의 메소드

- **perform()**
    
    요청을 전송하는 역할. 결과로 ResultActions 객체를 받으며, ResultActions 객체는 리턴 값을 검증하고 확인 할 수 있는 andExpect() 메소드를 제공해줌.
    
- **get(), post(), put(), delete()**
    
    HTTP메소드를 결정할 수 있음. 인자로는 경로를 보내줌
    
- **andExpect()**
    
    응답을 검증하는 역할
    
    - 상태코드(status())
    - 뷰(view()): 리턴하는 뷰 이름을 검증
    - 리다이렉트(redirect()): 리다이렉트 응답을 검증
    - 모델 정보(model()): 컨트롤러에서 저장한 모델들의 정보 검증
    - 응답 정보 검증(content()): 응답에 대한 정보를 검증해줌
- **andDo(print())**
    
    요청/응답 전체 메세지를 확인할 수 있음

### ObjectMapper

Object → Serialize(직렬화) → JSON

JSON → Deserialize(역직렬화) → Object

### Mockito 란?

단위 테스트를 위한 Java mocking framework

Mockito.when().thenReturn(): 결과에 따라 특정 값을 반환

Mockito.when().thenThrow(): 결과에 따라 에러 발생 시킴

```java
// get(0)이 호출되면 "first"를 반환합니다.
when(mockedList.get(0)).thenReturn("first");

// get(1)이 호출되면 RuntimeException 에러를 발생합니다.
when(mockedList.get(1)).thenThrow(new RuntimeException());
```

```java
package me.whiteship.demoinflearnrestapi.events;

import lombok.RequiredArgsConstructor;
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

    @PostMapping
    public ResponseEntity createEvent(@RequestBody Event event) {
        Event newEvent = this.eventRepository.save(event);
        URI createdUri = linkTo(EventController.class).slash(newEvent.getId()).toUri();
        event.setId(10);
        return ResponseEntity.created(createdUri).body(event);
    }
}
```

### HATEOAS 란?

- REST API의 필수 구성요소 중 한가지
- 특정 API 요청 시 리소스 정보를 받아 볼 수 있는데, 이때 리소스 정보 뿐만 아니라 리소스에 대한 다양한 링크 정보를 리소스 정보와 함께 반환하는 것을 의미
- HATEOAS를 적용하면 API 요청 시, Resource와 Links를 함께 반환 받을 수 있음

**예제**

```java
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.IdentityHashMap;
import java.util.Map;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

@RestController
@RequestMapping(value = "/api/member", produces = MediaTypes.HAL_JSON_VALUE)
public class MemberController {

    private Map<Integer, Member> db = new IdentityHashMap<>();
    private Integer id = 1;

    @PostMapping
    public ResponseEntity createMember(@RequestBody Member member) {
        member.setId(id++);

        /*
            /api/member
        */
        WebMvcLinkBuilder listLink= linkTo(MemberController.class);
        
        /*
            /api/member/{id}
        */
        WebMvcLinkBuilder selfLink = listLink.slash(member.getId());

        //hateoas model 객체 생성
        MemberModel memberModel = new MemberModel(member);

        //list link
        memberModel.add(listLink.withRel("list"));

        //self link
        memberModel.add(selfLink.withSelfRel());

        //update link
        memberModel.add(selfLink.withRel("update"));

        return ResponseEntity.created(selfLink.toUri()).body(memberModel);
    }
}
```

POST /api/member 요청 시 **HAL_JSON 방식**으로 리소스를 반환 (**HAL**이란 Hypertext Application Language의 약자로 JSON 또는 XML 코드 내의 외부 리소스에 대한 링크와 같은 하이퍼 미디어를 정의하기 위한 표준 규칙)

반환 정보는 생성된 Member 정보와 Member와 관련된 링크 정보로 구성됨

링크 정보는 **list, self, update 정보**를 담고 있음

**결과**

![img](https://user-images.githubusercontent.com/79130276/149884416-76d6329b-08ad-471b-8ee5-612af94cd3e5.png)
