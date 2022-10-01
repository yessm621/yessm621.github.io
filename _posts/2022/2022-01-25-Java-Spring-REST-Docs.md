---
title:  "스프링 REST Docs"
last_modified_at: 2022-01-25T14:15:00
categories: 
  - Spring
tags:
  - Spring
  - Java
  - REST API
  - TEST CODE
toc: true
toc_label: "Index"
toc_sticky: true
---

## 스프링 REST Docs란?

지금까지 개발을 진행하면서 API 명세에 대한 정보 문서화 또는 Swagger 사용을 해왔습니다.

매번 API 개발을 할 때마다 명세에 대한 정보를 문서화를 하였고,

Swagger 사용을 하면 매번 Controller, DTO 단에 Swagger 어노테이션을 추가해야 하니 코드가 보기가 좋지 않았습니다.

그러다가 API 명세서를 자동화해주는 것을 찾다가 Spring Rest Docs 찾게 되어, Spring Rest Docs를 적용하게 되었습니다.

<br>

## 스프링 REST Docs 장점

코드에 영향이 없다. 따라서, 코드가 바뀌어도 문서를 따로 수정할 필요없이 자동으로 변경된다.

<br>

### plugin, dependency 추가

**Maven - pom.xml**

```xml
						<plugin>
                <groupId>org.asciidoctor</groupId>
                <artifactId>asciidoctor-maven-plugin</artifactId>
                <version>1.5.3</version>
                <executions>
                    <execution>
                        <id>generate-docs</id>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>process-asciidoc</goal>
                        </goals>
                        <configuration>
                            <backend>html</backend>
                            <doctype>book</doctype>
                        </configuration>
                    </execution>
                </executions>
                <dependencies>
                    <dependency>
                        <groupId>org.springframework.restdocs</groupId>
                        <artifactId>spring-restdocs-asciidoctor</artifactId>
                        <version>2.0.2.RELEASE</version>
                    </dependency>
                </dependencies>
            </plugin>
            <plugin>
                <artifactId>maven-resources-plugin</artifactId>
                <version>2.7</version>
                <executions>
                    <execution>
                        <id>copy-resources</id>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>copy-resources</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>
                                ${project.build.outputDirectory}/static/docs
                            </outputDirectory>
                            <resources>
                                <resource>
                                    <directory>
                                        ${project.build.directory}/generated-docs
                                    </directory>
                                </resource>
                            </resources>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
```

**docs 조각**: ./target/generated-snippets/*/*.adoc

**docs build**: ./target/classes/static/docs/index.html

<br>

**Gradle - build.gradle (7버전)**

```
plugins {
	id 'org.springframework.boot' version '2.5.8'
	id 'io.spring.dependency-management' version '1.0.11.RELEASE'
	id "com.ewerk.gradle.plugins.querydsl" version "1.0.10"
	// Spring REST Docs
	id 'org.asciidoctor.jvm.convert' version '3.3.2'
	id 'java'
}

group = 'com.debrains'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
	// Spring REST Docs
	asciidoctorExtensions
}

repositories {
	mavenCentral()
}

dependencies {

	...

	// Spring REST Docs
	asciidoctorExtensions 'org.springframework.restdocs:spring-restdocs-asciidoctor'
	testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc'

	...

}

test {
	useJUnitPlatform()
}

...

// Spring REST Docs
ext {
	snippetsDir = file('build/generated-snippets')
}

test {
	outputs.dir snippetsDir
}

asciidoctor {
	configurations 'asciidoctorExtensions'
	inputs.dir snippetsDir
	dependsOn test
}

bootJar {
	dependsOn asciidoctor
	from ("${asciidoctor.outputDir}/html5") {
		into 'static/docs'
	}
}
```

**docs 조각**: ./build/generated-snippets/*/*.adoc

**docs build**: ./build/docs/asciidoc/index.html

<br>

## 스프링 REST Docs 요청/응답 본문 문서화

EventControllerTests.java

```java
package me.whiteship.demoinflearnrestapi.events;

...

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;

...

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureRestDocs
public class EventControllerTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    @DisplayName("정상적으로 이벤트를 생성하는 테스트")
    public void createEvent() throws Exception {
        EventDto event = EventDto.builder()
                ...
                .build();

        mockMvc.perform(post("/api/events/")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaTypes.HAL_JSON)
                .content(objectMapper.writeValueAsString(event)))
                .andDo(print()) // 어떤 요청과 응답을 받았는지 알 수 있음
                ...
                .andDo(document("create-event"));
    }
	...
}
```

**@AutoConfigureRestDocs 어노테이션, andDo(document("create-event"));**

문서는 생성되지만 포맷팅이 안되어 보기에 안좋다

```json
[source,http,options="nowrap"]
----
HTTP/1.1 201 Created
Location: http://localhost:8080/api/events/1
Content-Type: application/hal+json
Content-Length: 565

{"id":1,"name":"Spring","description":"REST API development with Spring","beginEnrollmentDateTime":"2022-01-18T14:21:22","closeEnrollmentDateTime":"2022-01-19T14:21:22","beginEventDateTime":"2022-01-25T14:21:22","endEventDateTime":"2022-01-26T14:21:22","location":"강남역","basePrice":100,"maxPrice":200,"limitIfEnrollment":100,"offline":true,"free":false,"eventStatus":"DRAFT","_links":{"self":{"href":"http://localhost:8080/api/events/1"},"query-events":{"href":"http://localhost:8080/api/events"},"update-event":{"href":"http://localhost:8080/api/events/1"}}}
----
```
<br>

따라서, 아래와 같이 빈하나를 만들어주고 EventControllerTests.java 에 빈을 등록해줌

```java
package me.whiteship.demoinflearnrestapi.common;

import org.springframework.boot.test.autoconfigure.restdocs.RestDocsMockMvcConfigurationCustomizer;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;

@TestConfiguration
public class RestDocsConfiguration {

    @Bean
    public RestDocsMockMvcConfigurationCustomizer restDocsMockMvcConfigurationCustomizer() {
        return configurer -> configurer.operationPreprocessors()
                .withRequestDefaults(prettyPrint())
                .withResponseDefaults(prettyPrint());
    }
}
```

EventControllerTests.java

```java
package me.whiteship.demoinflearnrestapi.events;

...

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;

...

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureRestDocs
@Import(RestDocsConfiguration.class)
public class EventControllerTests {

		...

}
```

그럼 포맷팅되어 이쁘게 나옴

```json
[source,http,options="nowrap"]
----
HTTP/1.1 201 Created
Location: http://localhost:8080/api/events/1
Content-Type: application/hal+json
Content-Length: 733

{
  "id" : 1,
  "name" : "Spring",
  "description" : "REST API development with Spring",
  "beginEnrollmentDateTime" : "2022-01-18T14:21:22",
  "closeEnrollmentDateTime" : "2022-01-19T14:21:22",
  "beginEventDateTime" : "2022-01-25T14:21:22",
  "endEventDateTime" : "2022-01-26T14:21:22",
  "location" : "강남역",
  "basePrice" : 100,
  "maxPrice" : 200,
  "limitIfEnrollment" : 100,
  "offline" : true,
  "free" : false,
  "eventStatus" : "DRAFT",
  "_links" : {
    "self" : {
      "href" : "http://localhost:8080/api/events/1"
    },
    "query-events" : {
      "href" : "http://localhost:8080/api/events"
    },
    "update-event" : {
      "href" : "http://localhost:8080/api/events/1"
    }
  }
}
----
```

<br>

스프링 REST Docs 링크 문서화, 요청/응답 헤더,필드 문서화

```java
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
        .andExpect(jsonPath("free").value(false))
        .andExpect(jsonPath("offline").value(true))
        .andExpect(jsonPath("eventStatus").value(Matchers.not(EventStatus.DRAFT)))
        .andDo(document("create-event",
                links(
                        linkWithRel("self").description("link to self"),
                        linkWithRel("query-events").description("link to query events"),
                        linkWithRel("update-event").description("link to update an existing")
                ),
                requestHeaders(
                        headerWithName(HttpHeaders.ACCEPT).description("accept header"),
                        headerWithName(HttpHeaders.CONTENT_TYPE).description("content type")
                ),
                requestFields(
                        fieldWithPath("name").description("Name of new event"),
                        fieldWithPath("description").description("description of new event"),
                        fieldWithPath("beginEnrollmentDateTime").description("date time of begin of new event"),
                        fieldWithPath("closeEnrollmentDateTime").description("date time of close of new event"),
                        fieldWithPath("beginEventDateTime").description("date time of begin of new event"),
                        fieldWithPath("endEventDateTime").description("date time of end of new event"),
                        fieldWithPath("location").description("location of new event"),
                        fieldWithPath("basePrice").description("base price of new event"),
                        fieldWithPath("maxPrice").description("max price of new event"),
                        fieldWithPath("limitIfEnrollment").description("limit of enrollment")
                ),
                responseHeaders(
                        headerWithName(HttpHeaders.LOCATION).description("location header"),
                        headerWithName(HttpHeaders.CONTENT_TYPE).description("content type")
                ),
				//relaxedResponseFields(
                responseFields(
                        fieldWithPath("id").description("identifier of new event"),
                        fieldWithPath("name").description("Name of new event"),
                        fieldWithPath("description").description("description of new event"),
                        fieldWithPath("beginEnrollmentDateTime").description("date time of begin of new event"),
                        fieldWithPath("closeEnrollmentDateTime").description("date time of close of new event"),
                        fieldWithPath("beginEventDateTime").description("date time of begin of new event"),
                        fieldWithPath("endEventDateTime").description("date time of end of new event"),
                        fieldWithPath("location").description("location of new event"),
                        fieldWithPath("basePrice").description("base price of new event"),
                        fieldWithPath("maxPrice").description("max price of new event"),
                        fieldWithPath("limitIfEnrollment").description("limit of enrollment"),
                        fieldWithPath("free").description("it tells is this event is free or not"),
                        fieldWithPath("offline").description("it tells is this offline is free or not"),
                        fieldWithPath("eventStatus").description("event status"),
						fieldWithPath("_links.self.href").description("link to self"),
                        fieldWithPath("_links.query-events.href").description("link to query events"),
                        fieldWithPath("_links.update-event.href").description("link to update event")
                )
        ));
```

<br>

responseFields 를 쓰면 오류가 발생한다

응답에는 links도 포함된다고 생각하는데 links에 대한 정의가 없기 때문에 오류 발생

responseFields 대신 *`relaxedResponseFields`* 를 써줄수 있다.

<br>

`relaxed` prefix(접두어) 를 사용할 때 

- 장점: 문서 일부분만 테스트 할 수 있다.
- 단점: 정확한 문서를 생성하지 못한다.

<br>

응답 필드에 links 에 대한 정보를 다시 써줘야하는 번거로움이 있지만 `relaxed 는 가급적 사용하지 않는 것`을 권장함

<br>

src>main>asciidoc>index.adoc 생성

```
= REST API Guide
백기선;
:doctype: book
:icons: font
:source-highlighter: highlightjs
:toc: left
:toclevels: 4
:sectlinks:
:operation-curl-request-title: Example request
:operation-http-response-title: Example response

[[overview]]
= 개요

[[overview-http-verbs]]
== HTTP 동사

본 REST API에서 사용하는 HTTP 동사(verbs)는 가능한한 표준 HTTP와 REST 규약을 따릅니다.

|===
| 동사 | 용례

| `GET`
| 리소스를 가져올 때 사용

| `POST`
| 새 리소스를 만들 때 사용

| `PUT`
| 기존 리소스를 수정할 때 사용

| `PATCH`
| 기존 리소스의 일부를 수정할 때 사용

| `DELETE`
| 기존 리소스를 삭제할 떄 사용
|===

[[overview-http-status-codes]]
== HTTP 상태 코드

본 REST API에서 사용하는 HTTP 상태 코드는 가능한한 표준 HTTP와 REST 규약을 따릅니다.

|===
| 상태 코드 | 용례

| `200 OK`
| 요청을 성공적으로 처리함

| `201 Created`
| 새 리소스를 성공적으로 생성함. 응답의 `Location` 헤더에 해당 리소스의 URI가 담겨있다.

| `204 No Content`
| 기존 리소스를 성공적으로 수정함.

| `400 Bad Request`
| 잘못된 요청을 보낸 경우. 응답 본문에 더 오류에 대한 정보가 담겨있다.

| `404 Not Found`
| 요청한 리소스가 없음.
|===

[[overview-errors]]
== 오류

에러 응답이 발생했을 때 (상태 코드 >= 400), 본문에 해당 문제를 기술한 JSON 객체가 담겨있다. 에러 객체는 다음의 구조를 따른다.

include::{snippets}/errors/response-fields.adoc[]

예를 들어, 잘못된 요청으로 이벤트를 만들려고 했을 때 다음과 같은 `400 Bad Request` 응답을 받는다.

include::{snippets}/errors/http-response.adoc[]

[[overview-hypermedia]]
== 하이퍼미디어

본 REST API는 하이퍼미디어와 사용하며 응답에 담겨있는 리소스는 다른 리소스에 대한 링크를 가지고 있다.
응답은 http://stateless.co/hal_specification.html[Hypertext Application from resource to resource. Language (HAL)] 형식을 따른다.
링크는 `_links`라는 키로 제공한다. 본 API의 사용자(클라이언트)는 URI를 직접 생성하지 않아야 하며, 리소스에서 제공하는 링크를 사용해야 한다.

[[resources]]
= 리소스

[[resources-index]]
== 인덱스

인덱스는 서비스 진입점을 제공한다.

[[resources-index-access]]
=== 인덱스 조회

`GET` 요청을 사용하여 인덱스에 접근할 수 있다.

operation::index[snippets='response-body,http-response,links']

[[resources-events]]
== 이벤트

이벤트 리소스는 이벤트를 만들거나 조회할 때 사용한다.

[[resources-events-list]]
=== 이벤트 목록 조회

`GET` 요청을 사용하여 서비스의 모든 이벤트를 조회할 수 있다.

operation::get-events[snippets='response-fields,curl-request,http-response,links']

[[resources-events-create]]
=== 이벤트 생성

`POST` 요청을 사용해서 새 이벤트를 만들 수 있다.

operation::create-event[snippets='request-fields,curl-request,http-request,request-headers,http-response,response-headers,response-fields,links']

[[resources-events-get]]
=== 이벤트 조회

`Get` 요청을 사용해서 기존 이벤트 하나를 조회할 수 있다.

operation::get-event[snippets='request-fields,curl-request,http-response,links']

[[resources-events-update]]
=== 이벤트 수정

`PUT` 요청을 사용해서 기존 이벤트를 수정할 수 있다.

operation::update-event[snippets='request-fields,curl-request,http-response,links']
```

<br>

EventController.java

profile 관련 코드 추가 (테스트 코드에도 추가해주기)

```java
eventResource.add(Link.of("/docs/index.html#resources-events-create").withRel("profile"));
```

<br>

maven>Lifecycle>package 실행하면 target/classes/static/docs 에 index.html 파일이 생성된다.

<br>

http://localhost:8080/docs/index.html 로 접속하면 REST 문서 작성 내용을 볼 수 있다.