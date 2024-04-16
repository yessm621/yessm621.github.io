---
title: "자바 리플렉션(Reflection)"
categories:
  - Java
toc: true
toc_sticky: true
---

## 리플렉션이란

구체적인 클래스 타입을 알지 못해도 그 클래스의 메소드, 타입, 변수들에 접근할 수 있도록 해주는 `자바 API`이다. 리플레션 기술을 사용하면 클래스나 메서드의 메타정보를 동적으로 획득하고 코드도 동적으로 호출할 수 있다.

## 언제 사용할까?

대표적으로 여러 라이브러리, 프레임워크에서 사용되는 어노테이션이 리플렉션을 사용한 예시이다. 리플렉션을 사용하면 클래스와 메소드에 어떤 어노테이션이 붙어 있는지 확인할 수 있다. 어노테이션은 그 자체로는 아무 역할도 하지 않는다. 리플렉션 덕분에 우리가 스프링에서 `@Component`, `@Bean`과 같은 어노테이션을 프레임워크의 기능을 사용하기 위해 사용할 수 있는 것이다.

또한, 코드를 작성할 시점에는 어떤 타입의 클래스를 사용할지 모르지만, 런타임 시점에 지금 실행되고 있는 클래스를 가져와서 실행해야 하는 경우, 동적으로 객체를 생성하고 메서드를 호출해야 하는 경우에 사용한다.

쉽게 이해하기 위해 다음 예제를 살펴보자.

```java
@Slf4j
public class ReflectionTest {

    @Test
    void reflection0() {
        Hello target = new Hello();

        // 공통 로직1 시작
        log.info("start");
        String result1 = target.callA(); // 호출하는 메서드가 다름, 동적 처리 필요
        log.info("result={}", result1);
        // 공통 로직1 종료

        // 공통 로직2 시작
        log.info("start");
        String result2 = target.callB(); // 호출하는 메서드가 다름, 동적 처리 필요
        log.info("result={}", result2);
        // 공통 로직2 종료
    }

    static class Hello {
        public String callA() {
            log.info("callA");
            return "A";
        }

        public String callB() {
            log.info("callB");
            return "B";
        }
    }
}
```

위의 코드에서 공통 로직1과 공통 로직2는 호출하는 메서드만 다를 뿐 전체 코드 흐름은 같다.

여기서 공통 로직1과 공통 로직2를 하나의 메서드로 뽑아서 합치기 위해선 중간에 호출하는 메서드(target.callA() , target.callB())를 동적으로 처리할 수 있어야 한다.

```java
log.info("start");
String result = xxx(); //호출 대상이 다름, 동적 처리 필요
log.info("result={}", result);
```

이때 사용하는 기술이 리플렉션이다. 리플렉션을 사용해 동적으로 처리해보자.

```java
@Slf4j
public class ReflectionTest {

    @Test
    void reflection1() throws Exception {
        // 클래스 정보
        Class classHello = Class.forName("hello.proxy.jdkdynamic.ReflectionTest$Hello");

        Hello target = new Hello();
        // callA 메서드 정보
        Method methodCallA = classHello.getMethod("callA");
        Object result1 = methodCallA.invoke(target);
        log.info("result1={}", result1);

        Method methodCallB = classHello.getMethod("callB");
        Object result2 = methodCallB.invoke(target);
        log.info("result2={}", result2);
    }

    static class Hello {
        public String callA() {
            log.info("callA");
            return "A";
        }

        public String callB() {
            log.info("callB");
            return "B";
        }
    }
}
```

- Class.forName(""): 클래스 메타정보를 획득한다.
- classHello.getMethod("callA"): Hello 클래스의 callA() 메서드 메타정보를 획득한다.
- methodCallA.invoke(target)
    - 획득한 메서드 메타정보로 실제 인스턴스의 메서드를 호출한다.
    - methodCallA.invoke(인스턴스)를 호출해서 인스턴스를 넘겨주면 해당 인스턴스의 callA() 메서드를 찾아서 실행한다.

이제 공통 로직을 만들 수 있게 되었다.

```java
@Slf4j
public class ReflectionTest {

    @Test
    void reflection2() throws Exception {
        // 클래스 정보
        Class classHello = Class.forName("hello.proxy.jdkdynamic.ReflectionTest$Hello");

        Hello target = new Hello();
        // callA 메서드 정보
        Method methodCallA = classHello.getMethod("callA");
        dynamicCall(methodCallA, target);

        Method methodCallB = classHello.getMethod("callB");
        dynamicCall(methodCallB, target);
    }

    private void dynamicCall(Method method, Object target) throws Exception {
        log.info("start");
        Object result = method.invoke(target);
        log.info("result={}", result);
    }

    static class Hello {
        public String callA() {
            log.info("callA");
            return "A";
        }

        public String callB() {
            log.info("callB");
            return "B";
        }
    }
}
```

- dynamicCall(Method method, Object target)
    - Method method: 호출할 메서드 정보이다. Method라는 메타정보를 통해 호출할 메서드 정보가 동적으로 제공된다.
    - Object target: 실제 실행할 인스턴스 정보가 넘어온다. 타입이 Object이기 때문에 어떠한 인스턴스도 받을 수 있다.

## 리플렉션의 장점과 단점

리플렉션을 사용하면 클래스와 메서드의 메타정보를 사용해서 애플리케이션을 동적으로 실행할 수 있다는 장점이 있다. 

하지만, 런타임 시점에 동작하기 때문에 컴파일 시점에 오류를 잡을 수 없다는 단점도 있다. 또한 단순히 필드, 메서드를 접근할 때보다 리플렉션을 사용하여 접근할 때 성능이 느리다.

따라서 리플렉션은 일반적으로 사용하면 안되고 부분적으로 주의해서 사용해야 한다.