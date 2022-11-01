---
title: "언체크 예외를 사용해야 하는 이유"
last_modified_at: 2022-11-01T09:05:00
categories:
  - Spring
tags:
  - Spring
  - DB
toc: true
toc_label: "Index"
toc_sticky: true
---

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