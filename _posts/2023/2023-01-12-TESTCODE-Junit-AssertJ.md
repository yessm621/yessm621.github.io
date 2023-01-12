---
title: "JUnit Assertions, AssertJ"
last_modified_at: 2023-01-12T13:45:00
categories:
  - TESTCODE
tags:
  - TESTCODE
  - JAVA
toc: true
toc_label: "Index"
toc_sticky: true
---

## JUnit Assertions와 AssertJ

테스트 코드를 작성할 때 사용하는 Assertions는 `JUnit`이 구현한 클래스도 있고 `AssertJ`의 Assertions가 있다.

JUnit에서 제공하는 공식 기능인 Jupiter보다 **AssertJ를 선호**하는데 그 이유는 무엇일까?

### Jupiter의 단점

공식 가이드에서 제공하는 메서드를 보면 단순하다. 기대값과 실제값을 넣고 일치하는지, 아니면 조건이 True 인지 False 만 판단하는 기능만 구성되어 있다. 무엇을 검사하는지 파악하기 힘들다.

또한, 메서드 체이닝이 없어서 AssertJ에 비해 사용하기 불편하다.

```java
// JUnit
assertEquals(expected, actual);
// AssertJ (메서드 체이닝)
assertThat(actual).isEqualTo(expected);
```

## AssertJ 란?

**테스트**에 관련된 많은 기능을 제공하고 가독성이 높은 테스트 코드 작성을 지원하는 오픈 라이브러리이다.

JUnit의 Assertions와 같은 클래스 명을 가지므로 **주의해서 import** 해야 한다.

- JUnit Assertions → `import org.junit.jupiter.api.Assertions;`
- AssertJ → `import org.assertj.core.api.Assertions;`

assertThat(검증 대상)로 시작하며 메서드 체이닝을 이용하여 검증 메서드를 연쇄적으로 사용할 수 있다.

> **참고** 메서드 체이닝
<br>
말 그대로 메소드를 고리처럼 엮어서 메소드를 계속해서 사용할 수 있게끔 하는 방법이다.
> 
