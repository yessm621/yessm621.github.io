---
title:  "Java, 테스트 코드 작성 - Mockito"
last_modified_at: 2022-03-15T14:05:00
categories: 
  - Java
tags:
  - Spring
  - Java
  - JUnit5
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

## 1. Mockito 소개

Mock: 진짜 객체와 비슷하게 동작하지만 프로그래머가 직접 그 객체의 행동을 관리하는 객체

Mockito: Mock 객체를 쉽게 만들고 관리하고 검증할 수 있는 방법을 제공

<br>

Unit 테스트를 해야하는가?

→ controller 테스트를 하기 위해 나머지 service 와 repository 를 목(mock)으로 만들고 유닛테스트를 진행해야하는가?

→ 의견이 서로 다름. 같이 일하는 팀에 맞추면 됨

<br>

## 2. Mockito 시작하기

스프링부트는 프로젝트 생성 시 spring-boot-starter-test 에서 자동으로 mockito 추가해 줌

<br>

스프링부트를 쓰지 않으면 의존성 직접 추가

```xml
<!-- https://mvnrepository.com/artifact/org.mockito/mockito-core -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>3.12.4</version>
    <scope>test</scope>
</dependency>
<!-- https://mvnrepository.com/artifact/org.mockito/mockito-junit-jupiter -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>3.12.4</version>
    <scope>test</scope>
</dependency>
```

<br>

**Mock을 활용한 테스트를 쉽게 작성하는 법**

- Mock을 만드는 방법
- Mock이 어떻게 동작해야 하는지 관리하는 방법
- Mock의 행동을 검증하는 방법

<br>

Mockito 레퍼런스

[Mockito - mockito-core 4.4.0 javadoc](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

<br>

## 3. Mock 객체 만들기

구현체는 없지만 **인터페이스**는 있을때 `목(Mock)`을 작성하기 매우 좋다

코드가 제대로 동작하는지 확인하려면 `목킹`을 하면 된다.

<br>

방법1 - **Mockito.mock() 메소드** 사용

```java
import static org.mockito.Mockito.mock;

class StudyServiceTest {

    @Mock
    MemberService memberService = mock(MemberService.class);;

    StudyRepository studyRepository = mock(StudyRepository.class);

    ...
}
```

<br>

방법2 - `목 애노테이션`을 사용

- JUnit5 extension으로 `MockitoExtension`을 사용
  - 필드
  - 메소드 매개변수

```java
// 필드
@ExtendWith(MockitoExtension.class)
class StudyServiceTest {

    @Mock
    MemberService memberService;

    @Mock
    StudyRepository studyRepository;

    ...
}
```

```java
// 메소드 매개변수
@ExtendWith(MockitoExtension.class)
class StudyServiceTest {

    @Test
    void createStudyService(@Mock MemberService memberService,
                            @Mock StudyRepository studyRepository) {
        StudyService studyService = new StudyService(memberService, studyRepository);
        assertNotNull(studyService);
    }
}
```

<br>

**Mock을 사용하는 이유**

- StudyService안에 MemberService 와 StudyRepository가 구현체는 없고 인터페이스만 있을 경우
- 또는 구현체는 있더라도 StudyService에 있는 코드만 테스트를 하고 싶은 경우