---
title:  "Java, 테스트 코드 작성 - Mockito"
# last_modified_at: 2022-03-15T14:05:00
last_modified_at: 2022-05-23T18:00:00
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

    MemberService memberService = mock(MemberService.class);

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

<br>

## 4. Mock 객체 Stubbing

**Stubbing**이란 `Mock` 객체의 행동을 **조작**하는 것을 의미 

<br>

**Mock 객체 메서드의 반환 값**

- 래퍼런스 타입: Null
- Optional 타입: Optional.empty
- Primitive 타입: Primitive 타입의 기본 값 (0, false 등)
- Collection 타입: 비어있는 Collection
- void 타입: 예외를 던지지 않고 아무런 일도 발생하지 않는다.

<br>

Stubbing 작업 전

```java
@Test
void createNewStudy(@Mock MemberService memberService,
                    @Mock StudyRepository studyRepository) {
    StudyService studyService = new StudyService(memberService, studyRepository);
    assertNotNull(studyService);

    // 리턴값이 Optional.Empty이다
    Optional<Member> optional = memberService.findById(1L);

    // validate를 void로 정의했기 때문에 아무일도 일어나지 않는다.
    memberService.validate(2L);
}
```

Mock 객체 메서드의 Optional 리턴값은 Optional.empty이다. 따라서, 값을 받아와도 값이 없기 때문에 테스트는 더 이상 진행하기 어렵다.

이 같은 상황에서 Mock 인스턴스에게 실제 메서드를 호출한 것과 같은 **가짜 동작**을 넣어줄 수 있다. 이러한 작업을 **Stubbing**이라 함

<br>

**Mock 객체 조작 (Stubbing)**

1. 특정한 매개변수를 받은 경우 특정한 값을 리턴하거나 예외를 던지도록 만들 수 있다.
2. void 메소드 특정 매개변수를 받거나 호출된 경우 예외를 발생 시킬 수 있다.
3. 메소드가 동일한 매개변수로 여러번 호출될 때 각기 다르게 행동하도록 조작할 수도 있다

<br>

**when()**

when() 메서드는 Mock 객체를 래핑한 OngoingStubbing 래퍼 클래스를 반환

```java
@Test
void createNewStudy(@Mock MemberService memberService,
                    @Mock StudyRepository studyRepository) {
    StudyService studyService = new StudyService(memberService, studyRepository);
    assertNotNull(studyService);

    Member member = new Member();
    member.setId(1L);
    member.setEmail("yessm621@gmail.com");

    // 아래코드는 stubbing을 한 것
    when(memberService.findById(1L)).thenReturn(Optional.of(member));

    Study study = new Study(10, "java");

    Optional<Member> findMember = memberService.findById(1L);
    assertEquals("yessm621@gmail.com", findMember.get().getEmail());
}
```

<br>

**any()**

특정 파라미터에 대한 stubbing을 하고 해당 파라미터를 일치하지 않으면 오류가 발생한다.

```java
@Test
void createNewStudy(@Mock MemberService memberService,
                    @Mock StudyRepository studyRepository) {
    StudyService studyService = new StudyService(memberService, studyRepository);
    assertNotNull(studyService);

    Member member = new Member();
    member.setId(1L);
    member.setEmail("yessm621@gmail.com");

    // 아래코드는 stubbing을 한 것
    when(memberService.findById(2L)).thenReturn(Optional.of(member));

    Study study = new Study(10, "java");

    Optional<Member> findMember = memberService.findById(1L);
    assertEquals("yessm621@gmail.com", findMember.get().getEmail());
}
```

위의 코드와 같이 다른 파라미터를 넣었을 경우 Stubbing이 되지 않고 오류가 발생한다.

이때 사용할 수 있는게 **any 타입 메서드**

any 타입 메서드는 매개변수의 범위를 대신해주며 아무값이나 들어와도  stubbing을 할 수 있게 만들어준다

```java
@Test
void createNewStudy(@Mock MemberService memberService,
                    @Mock StudyRepository studyRepository) {
    StudyService studyService = new StudyService(memberService, studyRepository);
    assertNotNull(studyService);

    Member member = new Member();
    member.setId(1L);
    member.setEmail("yessm621@gmail.com");

    // 아래코드는 stubbing을 한 것
    when(memberService.findById(any())).thenReturn(Optional.of(member));

    assertEquals("yessm621@gmail.com", memberService.findById(1L).get().getEmail());
    assertEquals("yessm621@gmail.com", memberService.findById(2L).get().getEmail());
}
```

any()와 같이 이러한 작업을 하는 요소를 Argument matchers 라 함 ([링크](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#4))

<br>

**thenThrow(), doThrow()**

stubbing해서 예외를 던지는 작업

1. 반환형이 있는 경우에 사용
    
    ```java
    when(memberService.findById(1L)).thenThrow(new RuntimeException());
    ```
    
2. 반환형이 void 인 경우 사용
    
    ```java
    // memberService의 validate()를 호출하면 new IllegalArgumentException()을 던지라는 뜻
    doThrow(new IllegalArgumentException()).when(memberService).validate(1L);
    ```

<br>

```java
@Test
void createNewStudy(@Mock MemberService memberService,
                    @Mock StudyRepository studyRepository) {
    StudyService studyService = new StudyService(memberService, studyRepository);
    assertNotNull(studyService);

    Member member = new Member();
    member.setId(1L);
    member.setEmail("yessm621@gmail.com");

    // 아래코드는 stubbing을 한 것
    when(memberService.findById(any())).thenReturn(Optional.of(member));

    assertEquals("yessm621@gmail.com", memberService.findById(1L).get().getEmail());
    assertEquals("yessm621@gmail.com", memberService.findById(2L).get().getEmail());

    doThrow(new IllegalArgumentException()).when(memberService).validate(1L);

    // 예외가 정상적으로 발생하는지 확인
    assertThrows(IllegalArgumentException.class, () -> {
        memberService.validate(1L);
    });

    memberService.validate(2L);
}
```

<br>

**체이닝 기법을 이용하기**

호출되는 순서가 지정되어 있어 같은 매개변수라도 매번 다른 값을 행동하도록 조작할 수 있음

```java
@Test
void createNewStudy(@Mock MemberService memberService,
                    @Mock StudyRepository studyRepository) {
    StudyService studyService = new StudyService(memberService, studyRepository);
    assertNotNull(studyService);

    Member member = new Member();
    member.setId(1L);
    member.setEmail("yessm621@gmail.com");

    when(memberService.findById(any()))
            .thenReturn(Optional.of(member))
            .thenThrow(new RuntimeException())
            .thenReturn(Optional.empty());

    // #1
    Optional<Member> byId = memberService.findById(1L);
    assertEquals("yessm621@gmail.com", byId.get().getEmail());

    // #2
    assertThrows(RuntimeException.class, () -> {
        memberService.findById(1L);
    });

    // #3
    assertEquals(Optional.empty(), memberService.findById(3L));
}
```