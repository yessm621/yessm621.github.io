---
title: "@BeforeEach, @BeforeAll 차이"
last_modified_at: 2023-01-12T11:15:00
categories:
  - TESTCODE
tags:
  - TESTCODE
  - JAVA
  - JUNIT5
toc: true
toc_label: "Index"
toc_sticky: true
---

@BeforeEach, @BeforeAll 애노테이션은 JUnit5에서 나온 애노테이션들이다.

@BeforeEach, @BeforeAll 애노테이션을 사용하려면 dependency에 아래 라이브러리를 추가해야 한다.

build.gradle

```
testImplementation('org.junit.jupiter:junit-jupiter:5.5.0')
```

```java
import static org.junit.jupiter.api.Assertions.*;
```

## @BeforeEach

@BeforeEach는 각각의 테스트 메소드가 실행될 때 호출되는 메소드이다. 각각의 메소드가 실행 전에 호출되어 처리된다.

- 리턴 타입으로는 반드시 void
- 접근 제한자로 pirvate 사용 금지
- static으로 선언 금지

> **참고** @AfterEach 애노테이션
각각의 테스트 메소드가 실행된 후 종료되어야 할 리소스를 처리하는 부분으로 사용된다.
> 

## @BeforeAll

@BeforeAll은 모든 테스트 메소드가 실행되기 전에 한 번 실행된다.

- 리턴 타입으로는 반드시 void
- 접근 제한자로 pirvate 사용 금지
- 반드시 static으로 선언

> **참고** @AfterAll 애노테이션
모든 테스트 메소드가 실행된 후 한 번 실행된다.
> 

## @BeforeEach, @BeforeAll 예제

```java
import org.junit.jupiter.api.*;

public class LifecycleTest {

    @BeforeAll
    static void init() {
        System.out.println("LifecycleTest.init");
    }

    public LifecycleTest() {
        System.out.println("new LifecycleTest");
    }

    @BeforeEach
    void setUp() {
        System.out.println("setUp");
    }

    @Test
    void a() {
        System.out.println("A");
    }

    @AfterEach
    void tearDown() {
        System.out.println("tearDown");
    }

    @AfterAll
    static void close() {
        System.out.println("LifecycleTest.close");
    }
}
```

```
# 실행 결과
LifecycleTest.init
new LifecycleTest
setUp
A
tearDown
new LifecycleTest
setUp
B
tearDown
LifecycleTest.close
```