---
layout: post
title:  "스프링 HATEOAS"
date: 2022-01-22 19:50:00
categories: [Spring]
tags:
  - Spring
  - Java
  - REST API
author: "유자"
---

**백기선님 강의 정리**

[REST API with SpringBoot(1)](https://yessm621.github.io/springboot/Java-REST-API(1)/)

[REST API with SpringBoot(2)](https://yessm621.github.io/springboot/Java-REST-API(2)/)

[REST API with SpringBoot(3)](https://yessm621.github.io/springboot/Java-REST-API(3)/)

[REST API with SpringBoot(4)](https://yessm621.github.io/springboot/Java-REST-API(4)/)

REST가 잘 적용된 API라면 응답에 HATEOAS를 지켜야 한다

## HATEOAS란?

REST API에서 클라이언트에 리소스를 넘겨줄 때 특정 부가적인 리소스의 링크 정보를 넘겨줌

links 요소를 통해 href 값의 형태로 보내주면 자원 상태에 대한 처리를 링크에 있는 URL을 통해 처리할 수 있게 된다.

HATEOAS 링크에 들어가는 정보는 현재 Resource의 관계이자 링크의 레퍼런스 정보인 REL과 하이퍼링크인 HREF 두 정보가 들어간다.

```json
// 예시
"_links":{
	"self":{
		"href":"http://localhost/api/events/1"
	},
	"query-events":{
		"href":"http://localhost/api/events"
	},
	"update-event":{
		"href":"http://localhost/api/events/1"
	}
}
```

1. 링크를 만드는 기능
    - 문자열을 가지고 만들기
    - 컨트롤러와 메소드로 만들기
2. 리소스를 만드는 기능
    - 리소스: 데이터(응답본문) + 링크
3. 링크 찾아주는 기능
    - traverson
    - LinkDiscoverers
4. 링크
    - HREF
    - REL(relation, 관계)
        - self
        - profile
        - update-event
        - query-events
        - ...

참고)

- `ResourceSupport` is now `RepresentationModel`
- `Resource` is now `EntityModel`
- `Resources` is now `CollectionModel`
- `PagedResources` is now `PagedModel`

### 테스트 코드

링크 정보를 제공하는 테스트 코드를 추가

- self: 리소스에 대한 링크
- query-events: 이벤트 목록에 대한 링크
- update-event: 이벤트 수정에 대한 링크

```java
		...

		@Test
    @DisplayName("정상적으로 이벤트를 생성하는 테스트")
    @TestDescription("정상적으로 이벤트를 생성하는 테스트")
    public void createEvent() throws Exception {
        EventDto event = EventDto.builder()
                .name("Spring")
                ...
                .build();

        mockMvc.perform(post("/api/events/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaTypes.HAL_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andDo(print()) // 어떤 요청과 응답을 받았는지 알 수 있음
                ...
                .andExpect(jsonPath("_links.self").exists()) // 3가지의 링크가 응답으로 오길 기다
                .andExpect(jsonPath("_links.query-events").exists())
                .andExpect(jsonPath("_links.update-event").exists());
```

### EventResource

`RepresentationModel`를 상속받고 Event 객체를 주입받아 Getter 메서드를 활용하여 제공하는 방법

EventResource.java - 첫번째 방법

```java
package me.whiteship.demoinflearnrestapi.events;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;

public class EventResource extends RepresentationModel {

    @JsonUnwrapped
    private Event event;

    public EventResource(Event event) {
        this.event = event;
    }

    public Event getEvent() {
        return event;
    }
}
```

`@JsonUnwrapped` 을 사용하는 이유?

응답을 보낼 때 jackson(ObjectMapper)을 사용하여 serialization을 진행

즉, BeanSerializer를 사용하는데 BeanSerializer는 기본적으로 필드명을 사용. 따라서, Test Assertion조건에 맞지않음

응답 내부에 event가 존재하고 event에 정보가 있는 구조

→ @JsonUnwrapped는 property를 serialize/deserialize 과정에서 **평탄화(flattened)**한다.

```java
/* 예시 */

/* @JsonUnwrapped 적용 전 */
{
  "id" : 1,
  "name" : {
    "firstName" : "seungmi",
    "lastName" : "noh"
  }
}

/* @JsonUnwrapped 적용 전 */
{
  "id" : 1,
  "firstName" : "seungmi",
  "lastName" : "noh"
}
```

EventResource.java - 두번째 방법

```java
public class EventResource extends EntityModel<Event> {

    public EventResource(Event event, Link... links) {
        super(event, Arrays.asList(links));
        add(linkTo(EventController.class).slash(event.getId()).withSelfRel());
    }
}
```

RepresentationModel 하위 클래스에 `EntityModel` 라는 클래스가 존재

T에 해당하는 데이터가 content로 매핑 되는데 getContent() 메소드에 @JsonUnwrapped가 붙어있기 때문에 unwrap 된다.

따라서, 위의 코드처럼 두번째 방법을 사용해도 된다.


```java
@PostMapping
    public ResponseEntity createEvent(@RequestBody @Validated EventDto eventDto, Errors errors) {
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().body(errors);
        }

        eventValidator.validate(eventDto, errors);
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().body(errors);
        }

        Event event = modelMapper.map(eventDto, Event.class);
        event.update();
        Event newEvent = eventRepository.save(event);
        WebMvcLinkBuilder selfLinkBuilder = linkTo(EventController.class).slash(newEvent.getId());
        URI createdUri = selfLinkBuilder.toUri();
        EventResource eventResource = new EventResource(event);
        eventResource.add(linkTo(EventController.class).withRel("query-events"));
        eventResource.add(selfLinkBuilder.withRel("update-event"));
        return ResponseEntity.created(createdUri).body(eventResource);
    }
```

withRel(): 이 링크가 리소스와 어떤 관계에 있는지 관계를 정의 할 수 있다

withSelRel(): 리소스에 대한 링크를 type-safe한 method로 제공한다