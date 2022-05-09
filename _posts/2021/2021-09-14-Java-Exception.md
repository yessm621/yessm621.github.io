---
title: "예외처리 (Exception)"
categories:
  - Java
tags:
  - Java
toc: true
toc_label: "Getting Started"
---


## 1. Checked Exception

- RuntimeException 을 상속받지 않는 예외
- 예외 발생 시 롤백을 진행하지 않음

<br>

## 2. Unchecked Exception

- RuntimeException 을 상속받는 예외
- 예외 발생 시 롤백 진행

<br>

### 참고) 오류 (Error)

예외란 개발자가 로직을 잘못 짰거나 사용자가 잘못된 값을 넘겨 정상적인 프로그램 흐름에 벗어나는 행위를 말함. 미리 예측하여 예외를 잡을 수 있다.

반면, 오류는 비정상적인 행위이기 때문에 이를 미리 예측해서 막을 수도 신경을 쓸 필요도 없다.

<br>
<br>

### 1. try-catch finally

작성된 코드가 있는 메소드 안에서 직접적으로 예외처리를 해주는 방식

```java
try {
 // 예외처리로 감쌀 로직 작성
} catch(NumberFormatException e) {
	System.out.println("정수변환이 안됨");
} catch(ArrayIndexOutOfBoundsException e) {
	System.out.println("배열 범위가 벗어난경우");
} catch(ArithmeticException e) {
	System.out.println("0 으로 나눌경우");
} catch(RuntimeException e) { //예상 못했던 에러 => 처리
	System.out.println("실행시 모든 에러를 처리");
} catch(Exception e) { // Exception
	System.out.println("수정이 가능한 모든 에러를 처리");
} catch(Throwable e) { //error, Exception 둘 다 처리 가능
	System.out.println("예외와 에러를 동시 처리");
finally {
	System.out.println("무조건 실행");
}
```

<br>

### 2. throws 간접 처리 방식

이 메소드 내에서 직접 에러를 처리 하지 않고, 해당 메소드를 호출한 쪽으로 예외처리를 던져 호출한 쪽에서 예외처리를 하게 회피하는 방식

```java
public void add() throws Exception { }
```

<br>

### 3. throw 예외 발생

강제로 예외처리를 발생하는 방법

```java
public void add() throws Exception {
	throw new Exception("예외처리 발생!");
}
```
