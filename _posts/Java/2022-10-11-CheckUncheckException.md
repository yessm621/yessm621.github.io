---
title: "체크 예외, 언체크 예외"
categories:
  - Java
toc: true
toc_sticky: true
---

## 예외의 종류

- 에러 (Error)
- 예외 (Exception)
    - 체크 예외 (Check Exception)
    - 언체크 예외 (Uncheck Exception)

![1](https://user-images.githubusercontent.com/79130276/195005057-a88cdf36-4676-4547-9e3b-2a13a43fe6b9.png)

## 에러(Error)

java.lang.Error 클래스의 하위 클래스들이다. 메모리 부족, 스택오버플로우 등과 같이 시스템이 비정상적인 상황인 경우에 사용한다. (프로그램 코드에 의해서 수습 될 수 없는 심각한 오류) 참고로 Error도 언체크 예외이다.

## 예외(Exception)

java.lang.Exception 클래스의 하위 클래스들이다. 개발자가 예외를 대비해 적절한 코드를 미리 작성하여 프로그램의 비정상적인 종료를 막을 수 있다. (프로그램 코드에 의해서 수습될 수 있는 다소 미약한 오류)

### 예외 기본 규칙

**예외의 기본 규칙 2가지**

1. 예외를 잡아(`catch`)서 처리하거나 처리할 수 없다면 밖으로 던져야(`throws`)한다.
2. 예외를 잡거나 던질 때 지정한 예외 뿐만 아니라 그 예외의 자식들도 함께 처리된다. 예를 들어 Exception를 잡으면 하위 예외(SQLException 등)도 모두 잡을 수 있다.

예외를 처리하면 이후에는 애플리케이션 로직이 정상 흐름으로 동작하고 예외를 처리하지 못하면 호출한 곳으로 예외를 계속 던지게 된다.

![스크린샷 2022-10-31 오후 2 38 32](https://user-images.githubusercontent.com/79130276/198952150-322f64e8-5759-476b-a7ea-acac6d7e1119.png)

![스크린샷 2022-10-31 오후 2 38 42](https://user-images.githubusercontent.com/79130276/198952157-75bacde9-32a3-4d3a-9700-80374f2a4fb4.png)

> **참고** 예외를 처리하지 못하고 계속 던지면 어떻게 될까?
<br>
- 자바 main() 쓰레드의 경우 예외 로그를 출력하면서 시스템이 종료된다.
- 웹 애플리케이션의 경우 여러 사용자의 요청을 처리하기 때문에 하나의 예외 때문에 시스템이 종료되면 안된다. WAS가 해당 예외를 받아서 처리하는데 주로 사용자에게 개발자가 지정한 오류 페이지를 보여준다.
> 

예외는 `체크 예외`와 `언체크 예외`로 구분된다.

### 체크 예외(Check Exception)

`체크 예외`는 RuntimeException 클래스를 상속받지 않는 예외 클래스들이다. Exception과 그 하위 예외는 모두 컴파일러가 체크하는 체크 예외이다. (단, RuntimeException은 예외로 한다.) 체크 예외는 복구가 가능한 예외이므로 **반드시 예외를 처리하는 코드를 함께 작성**해야 한다. 예외를 처리하기 위해서는 catch 문으로 잡거나 throws로 예외를 자신을 호출한 클래스로 던지는 방법이 있다. 만약, 예외를 처리하지 않으면 컴파일 에러가 발생한다.

예) IOException, SQLException 등

체크 예외는 개발자가 실수로 예외 처리를 누락하지 않도록 컴파일러가 도와준다. 하지만 개발자가 모든 체크 예외를 처리해주어야 하므로 번거롭고 신경쓰지 않고 싶은 예외까지 처리해야 한다는 단점이 있다.

또한 실제 애플리케이션 개발에서 발생하는 예외들은 복구 불가능한 경우가 많다. 예를 들어 SQLException과 같은 체크 예외를 catch해도 쿼리를 수정하여 재배포하지 않는 이상 복구되지 않는다. 그래서 실제 개발에서는 대부분 **언체크 예외를 사용**한다.

### 언체크 예외(Uncheck Exception)

RuntimeException 클래스를 상속받는 예외 클래스들은 복구 가능성이 없는 예외들이므로 컴파일러가 예외처리를 강제하지 않는다. `언체크 예외` 또는 `런타임 예외`라고 한다. 언체크 예외는 에러(Error)와 마찬가지로 에러를 처리하지 않아도 **컴파일 에러가 발생하지 않는다**. 즉, 런타임 예외는 예상치 못했던 상황에서 발생하는 것이 아니므로 굳이 예외 처리를 강제하지 않는다. 이러한 점 때문에 상당히 편리하지만 컴파일러가 예외를 잡아주지 않으므로 개발자가 실수로 예외를 누락할 수 있다는 단점이 있다.

예) NullPointerException, IllegalArgumentException 등

### 체크 예외 vs 언체크 예외

언체크 예외는 체크 예외와 기본적으로 동일하지만 차이가 있다면 예외를 처리할 수 없을 때 예외를 밖으로 던지는 부분에 있다. 이 부분을 필수로 선언해야 하는가 생략할 수 있는가의 차이다.

```java
// 체크 예외, 반드시 throws 입력
public void callThrow() throws MycheckedException {
    repository.call();
}

// 언체크 예외, throws 생략 가능
public void callThrow() throws MyUncheckedException {
// public void callThrow() {
    repository.call();
}
```