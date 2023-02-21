---
layout: post
title: "언체크 예외 사용과 예외 사용 시 주의점"
date: 2022-11-01 10:25:00
categories: [Spring]
tags:
  - Spring
  - DB
author: "유자"
---

## 언체크 예외를 사용해야 하는 이유

현재 트렌드는 `언체크 예외를 사용`하고 체크 예외는 거의 사용하지 않는다.

체크 예외는 컴파일러가 예외 누락을 체크해주기 때문에 개발자가 실수하는 것을 막아준다. 이러한 점을 보았을 때 체크 예외를 사용하는 것이 언체크 예외보다 안전하고 좋아보이는데 왜 체크 예외를 사용하지 않을까?

**체크 예외의 문제점 2가지**

1. 복구 불가능한 예외: 대부분의 예외는 복구 불가능하다. 따라서, 공통으로 오류 로그를 남기고 개발자가 해당 오류를 빠르게 인지하는 것이 필요하다.
2. 의존관계에 대한 문제: 체크 예외는 복구 불가능한 예외이다. 컴파일러가 예외를 확인하기 때문에 처리할 수 없어도 throws를 통해 던지는 예외를 선언해야 한다. 결과적으로 컨트롤러나 서비스에서 JDBC 기술을 의존하게 되어 OCP, DI를 지키지 못한다. (JDBC 기술에서 JPA로 변경 시 예외처리 관련 코드를 모두 변경해야 한다)

이러한 문제점을 해결하기 위해 **언체크(런타임) 예외를 사용**한다.

런타임 예외를 사용하면 복구 불가능한 예외에 대해 신경 쓸 필요가 없다. (일관성 있게 공통으로 처리하면 된다) 또한, 처리할 수 없는 예외에 대해선 무시하면 되므로 예외를 강제로 의존하지 않아도 된다. 결과적으로 JDBC 기술을 의존하다가 JPA로 변경하여도 영향이 없다.

**체크 예외 사용 테스트**

```java
@Test
void checked() {
    Controller controller = new Controller();
    assertThatThrownBy(() -> controller.request())
            .isInstanceOf(Exception.class);
}

static class Controller {
    Service service = new Service();

    public void request() throws SQLException, ConnectException {
        service.logic();
    }
}

static class Service {
    Repository repository = new Repository();
    NetworkClient networkClient = new NetworkClient();

    public void logic() throws SQLException, ConnectException {
        repository.call();
        networkClient.call();
    }
}
```

**언체크 예외 사용 테스트**

```java
@Test
void unchecked() {
    Controller controller = new Controller();
    assertThatThrownBy(() -> controller.request())
            .isInstanceOf(Exception.class);
            // .isInstanceOf(RuntimeSQLException.class);
}

static class Controller {
    Service service = new Service();

    public void request() {
        service.logic();
    }
}

static class Service {
    Repository repository = new Repository();
    NetworkClient networkClient = new NetworkClient();

    public void logic() {
        repository.call();
        networkClient.call();
    }
}
```

## 예외 포함과 스택 트레이스

중요한 내용! 실무에서 많이 하는 실수이다.

예외를 전환할 때 **기존 예외**를 반드시 **포함**해야 한다. (예를 들면 체크 예외를 언체크 예외로 전환할 때) 그렇지 않으면 스택 트레이스를 확인할 때 심각한 문제가 발생한다.

```java
@Test
void printEx() {
    Controller controller = new Controller();
    try {
        controller.request();
    } catch (Exception e) {
//        e.printStackTrace();
        log.info("ex", e);
    }
}
```

로그를 출력할 때 마지막 파라미터에 예외를 넣어주면 로그에 스택 트레이스를 출력할 수 있다. System.out으로도 출력 가능하다. 하지만 실무에선 로그를 사용하는게 좋다.

```java
// 로그 출력
// 마지막 파라미터에 ex를 전달.
log.info("message={}", "message", ex)
log.info("ex", ex)

// System.out으로 출력
e.printStackTrace()
```

> **참고** 스택 트레이스란?
<br>
프로그램이 시작된 시점부터 현재 위치까지의 메서드 호출 목록이다. 이는 예외가 어디서 발생했는지 알려주기 위해 JVM이 자동으로 생성한다.
> 

### 기존 예외를 포함하는 경우

```java
public void call() {
    try {
        runSQL();
    } catch (SQLException e) {
        throw new RuntimeSQLException(e); //기존 예외(e) 포함 
    }
}
```

```
23:35:32.280 [main] INFO hello.jdbc.exception.basic.UnCheckedAppTest - ex
hello.jdbc.exception.basic.UnCheckedAppTest$RuntimeSQLException: java.sql.SQLException: ex
	at hello.jdbc.exception.basic.UnCheckedAppTest$Repository.call(UnCheckedAppTest.java:59)
	at hello.jdbc.exception.basic.UnCheckedAppTest$Service.logic(UnCheckedAppTest.java:43)
	at hello.jdbc.exception.basic.UnCheckedAppTest$Controller.request(UnCheckedAppTest.java:34)
	at hello.jdbc.exception.basic.UnCheckedAppTest.printEx(UnCheckedAppTest.java:24)
	Caused by: java.sql.SQLException: ex
	at hello.jdbc.exception.basic.UnCheckedAppTest$Repository.runSQL(UnCheckedAppTest.java:64)
	at hello.jdbc.exception.basic.UnCheckedAppTest$Repository.call(UnCheckedAppTest.java:57)
	... 72 common frames omitted
```

기존 예외를 포함하면 RuntimeSQLException 뿐만 아니라 기존에 발생한 java.sql.SQLException과 스택 트레이스를 확인할 수 있다.

### 기존 예외를 포함하지 않는 경우

```java
public void call() {
    try {
        runSQL();
    } catch (SQLException e) {
        throw new RuntimeSQLException(); //기존 예외(e) 제외 
    }
}
```

```
23:52:52.921 [main] INFO hello.jdbc.exception.basic.UnCheckedAppTest - ex
hello.jdbc.exception.basic.UnCheckedAppTest$RuntimeSQLException: null
	at hello.jdbc.exception.basic.UnCheckedAppTest$Repository.call(UnCheckedAppTest.java:60)
	at hello.jdbc.exception.basic.UnCheckedAppTest$Service.logic(UnCheckedAppTest.java:44)
	at hello.jdbc.exception.basic.UnCheckedAppTest$Controller.request(UnCheckedAppTest.java:35)
	at hello.jdbc.exception.basic.UnCheckedAppTest.printEx(UnCheckedAppTest.java:24)
```

기존 예외를 포함하지 않으면 기존에 발생한 java.sql.SQLException과 스택 트레이스를 확인할 수 없고 변환한 RuntimeSQLException부터 예외를 확인할 수 있다. 만약, 실제 DB에 연동했다면 DB에서 발생한 예외를 확인할 수 없는 심각한 문제가 발생한다.

```
💡 예외를 전환할 때는 꼭 기존 예외를 포함하자.
```