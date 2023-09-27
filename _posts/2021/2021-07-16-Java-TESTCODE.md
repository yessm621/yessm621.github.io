---
title:  "테스트 코드"
last_modified_at: 2022-02-10T17:55:00
categories:
  - Spring
tags:
  - Spring
  - Java
  - TEST CODE
toc: true
toc_label: "Index"
toc_sticky: true
---

# 테스트 코드

## 테스트 코드란

프로그램 작성 시 문제가 없는지 확인하기 위해 사용

<br>

## 테스트 코드를 작성하는 이유

1. 빠른 피드백
2. 자동검증이 가능
3. 개발자가 만든 기능을 안전하게 보호해 준다.

<br>

## 테스트 코드 작성 방법

→ 메서드를 작성하고 그 위에 @Test 를 작성하면 된다.

→ 테스트코드는 직관적으로 보기 위해 메소드를 한글로 작성하기도 한다

→ 테스트코드는 빌드 시 포함되지 않는다. (따라서, 한글로 작성해도 된다)

<br>

테스트코드 작성 시 아래 패턴을 기반으로 하면 좋다.

```java	
@Test
void 회원가입() {
    // given

    // when

    // then
}
```

<br>

## 테스트 주도 개발 (TDD)

기능 구현 후 테스트 케이스 작성하는 것이 아닌 테스트 케이스를 먼저 작성하고 기능 구현하는 것을 테스트 주도 개발 (TDD) 이라고 한다.

<br>

## `테스트 코드 꼭 해야할까` 에 대한 의문?

간단한 프로젝트의 경우 필요가 없을 수도 있고 출력문을 통해 진행 할 수도 있겠다.

하지만, 몇만 라인 넘어가는 프로젝트 같은 경우 테스트케이스 없이 개발시 문제가 많이 생김

→ 따라서, 테스트 코드 관련해서는 깊이 있는 공부가 필요함

<br>


# JUnit 과 AssertJ

java 에서 테스트 코드 작성 시 JUnit 과 assertj 를 주로 사용

<br>

## JUnit이란?
자바를 위한 단위 테스트 라이브러리

<br>

### JUnit의 assert 메소드들

```java
import static org.junit.jupiter.api.Assertions;

Assertions.assertEquals(result, member);
Assertions.assertNotEquals(result, member);

Assertions.assertTrue(result);
Assertions.assertFalse(result);

Assertions.assertNull(result);
Assertions.assertNotNull(result);

Assertions.assertSame(result);
Assertions.assertNotSame(result);

Assertions.assertArrayEquals();

Assertions.assertThrows();
```

<br>

## JUnit의 어노테이션

### @Test

→ 메소드 위에 해당 어노테이션을 선언, 테스트 대상 메서도임을 지정할 수 있음

### @BeforeEach

→ 공통적인 Param 및 설정을 할때 호출되면 좋을 부분이다.

→ 같은 리소스를 사용하도록 설정하고 싶을 때

### @AfterEach

→ 테스트 코드 실행이 끝나고 실행 된다.

→ 테스트 코드가 여러 개일 경우 각각의 코드 실행이 끝날 때마다 실행

**사용이유!** 

여러개의 테스트 코드를 실행 시 테스트 코드 실행 순서는 랜덤이다.

이때 같은 메모리를 사용하게 되면 문제가 발생 할 수 있다.

즉, 독립적인 테스트 케이스  실행이 필요하다

```java
// MemberRepository
public void clearStore(){
    store.clear();
}

// MemberRepositoryTest
@AfterEach
public void afterEach() {
    repository.clearStore();
}
```

<br>

## AssertJ란?
자바 JUnit의 테스트코드에 사용되어, 테스트코드의 가독성과 편의성을 높여 주는 라이브러리

<br>

### AssertJ의 assert 메소드

AssertJ에서 모든 테스트 코드는 assertThat()으로 시작함.

assertThat(테스트 타겟).메소드1().메소드2().메소드3()'
이런 포맷으로 AssertJ의 여러 메소드들을 연쇄적으로 호출해 코드를 작성할 수 있다.
(메서드 체이닝)

```java
import static org.assertj.core.api.Assertions;

// 명확한 값 비교를 위해 사용
Assertions.assertThat(a, b);
```

<br>

isNotEmpty(), contains(e), doesNotContain(e), startsWith(e), endsWith(e), isEqualTo(e)

<br>

**예제 - 문자열 테스트**

```java
assertThat("Hello, world! Nice to meet you.") // 주어진 "Hello, world! Nice to meet you."라는 문자열은
    .isNotEmpty() // 비어있지 않고
    .contains("Nice") // "Nice"를 포함하고
    .contains("world") // "world"도 포함하고
    .doesNotContain("ZZZ") // "ZZZ"는 포함하지 않으며
    .startsWith("Hell") // "Hell"로 시작하고
    .endsWith("u.") // "u."로 끝나며
    .isEqualTo("Hello, world! Nice to meet you."); // "Hello, world! Nice to meet you."과 일치합니다.
```

**예제 - 숫자 테스트**

```java
assertThat(3.14d) // 주어진 3.14라는 숫자는
    .isPositive() // 양수이고
    .isGreaterThan(3) // 3보다 크며
    .isLessThan(4) // 4보다 작습니다
    .isEqualTo(3, offset(1d)) // 오프셋 1 기준으로 3과 같고
    .isEqualTo(3.1, offset(0.1d)) // 오프셋 0.1 기준으로 3.1과 같으며
    .isEqualTo(3.14); // 오프셋 없이는 3.14와 같습니다
```
<br>

### junit Assertions 와 assertj Assertions 의 사용법 예시

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
assertEquals(result, member);

import static org.assertj.core.api.Assertions.assertThat;
assertThat(result).isEqualTo(member);
```
