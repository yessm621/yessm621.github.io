---
title:  "자바: 예외처리"
last_modified_at: 2022-05-31T18:10:00
categories: 
  - Java
tags:
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---

# 예외처리(excetpion handling)

## 1.1 프로그램 오류

**발생시점**에 따라

- 컴파일 에러: 컴파일 할 때 발생하는 에러
- 런타임 에러: 프로그램의 실행도중에 발생하는 에러 (프로그램 종료됨)

그 외에

- 논리적 에러: 컴파일도 잘되고 실행도 잘되지만 의도한 것과 다르게 동작하는 것 (프로그램 종료 X)

<br>

### 실행 순서

컴파일 실행 → 컴파일러가 소스코드에 대해 오류가 있는지 알려줌 → 컴파일 성공되면 클래스 파일 생성됨 → 생성된 클래스 파일 실행

<br>

### 실행 중 에러 (런타임 에러)

- **에러(error)**
    - 프로그램 코드에 의해서 수습 될 수 없는 심각한 오류
    - ex. 메모리 부족 (OOME, Out of Memory Error), 스택오버플로우
- **예외(exception)**
    - 프로그램 코드에 의해서 수습될 수 있는 다소 미약한 오류
    - 개발자가 예외를 대비해 적절한 코드를 미리 작성하여 프로그램의 비정상적인 종료를 막을 수 있음

<br>

## 1.2 예외 클래스의 계층구조

자바에선 실행 시 발생할 수 있는 오류(Exception과 Error)를 클래스로 정의함

Exception과 Error 클래스의 조상은 Object 클래스 (모든 클래스의 조상은 Object이므로..)

<br>

모든 예외의 최고 조상은 Exception

### Exception과 RuntimeException

- Exception클래스들: 사용자의 실수와 같은 외적인 요인에 의해 발생하는 예외
- RuntimeException클래스들: 프로그래머의 실수로 발생하는 예외

<br>

## 1.3 예외처리하기 - try~catch문

### 예외처리의 정의와 목적

정의: 프로그램 실행 시 발생할 수 있는 예외의 발생에 대비한 코드를 작성하는 것

목적: 프로그램의 비정상 종료를 막고, 정상적인 실행상태를 유지

<br>

예외를 처리하기 위해 `try~catch문`을 사용

```java
try {
	// 예외가 발생할 가능성이 있는 문장들을 넣는다
} catch (Exception1 e1) {
	// Exception1이 발생했을 경우, 이를 처리하기 위한 문장을 적음
} catch (Exception2 e2) {
	// Exception2이 발생했을 경우, 이를 처리하기 위한 문장을 적음
} catch (Exception3 e3) {
	// Exception3이 발생했을 경우, 이를 처리하기 위한 문장을 적음
}
```

<br>

## 1.4 try~catch문에서의 흐름

1. try블럭 내에서 예외가 발생한 경우
    - 발생한 예외와 일치하는 catch 블럭이 있는지 확인
    - 일치하는 catch블럭을 찾으면, 그 catch블럭 내의 문장들을 수행. 일치하는 catch블럭을 찾지 못하면 예외는 처리되지 못함
2. try블럭 내에서 예외가 발생하지 않은 경우
    - catch블럭을 거치지 않고 try~catch문을 빠져나가서 수행을 계속함

<br>    

## 1.5 예외의 발생과 catch블럭

catch블럭의 괄호() 내에는 처리하고 하는 예외와 같은 타입의 참조변수 하나를 선언

(참조변수의 유효범위(scope): 하나의 catch블럭)

예외가 발생하면 발생한 예외에 해당하는 클래스의 인스턴스가 만들어짐

<br>

### printStackTrace()와 getMessage()

예외가 발생했을 때 생성되는 예외 클래스의 인스턴스에는 발생한 예외에 대한 정보가 담겨있음.

- `printStackTrace()`: 예외발생 당시의 호출스택에 있었던 메서드의 정보와 예외 메시지를 화면에 출력
- `getMessage()`: 발생한 예외클래스의 인스턴스에 저장된 메시지를 얻을 수 있다

<br>

### 멀티 catch블럭

내용이 같은 catch블럭을 하나의 catch블럭으로 합친 것

```java
try {
	...
} catch (ExceptionA | ExceptionB e) {
	e.printStackTrace();
}
```

단, 부모 자식 관계에선 멀티 catch블럭을 사용할 수 없다.

멀티 catch블럭을 사용할 땐 ExceptionA에만 선언된 methodA()는 호출할 수 없다.