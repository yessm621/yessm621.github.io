---
title: "빈 스코프"
categories:
  - Spring
tags:
  - Java
toc: true
toc_sticky: true
---


## 빈 스코프란?

스프링 빈은 스프링 컨테이너의 시작과 함께 생성되고 스프링 컨테이너가 종료될 때 까지 유지된다. 이것은 **스프링 빈**이 기본적으로 `싱글톤 스코프`로 생성되기 때문이다. `스코프`는 번역 그대로 빈이 존재할 수 있는 **범위**를 뜻한다.

스프링은 다양한 스코프를 지원한다.

- 싱글톤: **기본 스코프**, 스프링 컨테이너의 시작과 종료까지 유지되는 가장 **넓은 범위**의 스코프이다.
- 프로토타입: 스프링 컨테이너는 프로토타입 빈의 생성과 의존관계 주입까지만 관여하고 더는 관리하지 않는 매우 **짧은 범위**의 스코프이다.
- 웹 관련 스코프
    - request: 웹 요청이 들어오고 나갈때까지 유지되는 스코프
    - session: 웹 세션이 생성되고 종료될 때까지 유지되는 스코프
    - application: 웹의 서블릿 컨텍스트와 같은 범위로 유지되는 스코프

### 빈 스코프 지정 방법

**컴포넌트 스캔 자동 등록**

```java
@Scope("prototype")
@Component
public class HelloBean {}
```

**수동 등록**

```java
@Scope("prototype")
@Bean
public class HelloBean {}
```

지금까지 사용한 것은 싱글톤 스코프이다. 이제부터 프로토타입 스코프를 확인해보자.

> **참고**
<br>
이전에 사용했던 예제들은 모두 싱글톤 빈이었기 때문에 new AnnotationConfigApplicationContext()로 스프링 컨테이너를 생성할 때, 컴포넌트 스캔으로 빈이 자동 등록되는 과정에서 스프링 빈 객체도 모두 생성되었다.
> 

## 프로토타입 스코프

`싱글톤 스코프`의 빈을 조회하면 스프링 컨테이너는 항상 **같은 인스턴스의 스프링 빈**을 반환한다. 반면, `프로토타입 스코프`를 스프링 컨테이너에 조회하면 스프링 컨테이너는 항상 **새로운 인스턴스를 생성**해서 반환한다.

**싱글톤 스코프와 프로토타입 스코프의 차이**

![1](https://user-images.githubusercontent.com/79130276/207813348-d1b3b20c-5925-4752-a42e-2efbc5e85935.png)

![2](https://user-images.githubusercontent.com/79130276/207813357-b75fc5d6-2e39-4323-a041-64ec7b9a7393.png)

### 프로토타입 빈 요청 과정

1. 프로토타입 스코프의 빈을 스프링 컨테이너에 요청한다.
2. 스프링 컨테이너는 요청하는 시점에 프로토타입 빈을 생성하고, 필요한 의존관계를 주입한다.
3. 스프링 컨테이너는 생성한 프로토타입 빈을 클라이언트에 반환한다.
4. 이후에 스프링 컨테이너에 같은 요청이 오면 항상 **새로운** 프로토타입 빈을 생성해서 반환한다.

#### 정리

여기서 핵심은 `스프링 컨테이너`는 **프로토타입 빈을 생성하고, 의존관계 주입, 초기화까지만 처리한다**는 것이다. 클라이언트에 빈을 반환하고, 이후 스프링 컨테이너는 생성된 프로토타입 빈을 **관리하지 않는다**. 프로토타입 빈을 관리할 책임은 프로토타입 빈을 받은 클라이언트에 있다. 그래서 `@PreDestory` 같은 **종료 메서드가 호출되지 않는다.**

### 프로토타입 빈의 특징

- 스프링 컨테이너에 요청할 때 마다 **새로 생성**된다.
- 스프링 컨테이너는 프로토타입 빈의 생성과 의존관계 주입 그리고 초기화까지만 관여한다.
- 종료 메서드가 호출되지 않는다.
- 그래서 프로토타입 빈은 프로토타입 빈을 조회한 클라이언트가 관리해야 한다. 종료 메서드에 대한 호출도 클라이언트가 직접 해야한다.

> **참고** 프로토타입 빈은 언제 사용될까?
<br>
요청할 때마다 객체를 항상 새로 생성해야 하는데, 의존관계 주입이 필요하다면 이때 프로토타입 빈을 사용한다. 하지만 실무에서 프로토타입 빈을 잘 활용하진 않는다.
> 

> **참고**
<br>
빈 등록과 빈 생성 같은 의미이다.
> 

> **참고**
<br>
싱글톤 스코프를 가진 스프링 빈은 생성되면 스프링 컨테이너에 저장되어 관리된다. 반면, 프로토타입 스코프를 가진 스프링 빈을 생성하게 되면 생성은 컨테이너에서 해주지만 관리는 컨테이너에서 하지 않는다. 따라서, getBean()으로 프로토타입 빈을 조회하게 되면 생성한 프로토타입 빈의 참조값을 반환한다.
> 

> **참고**
<br>
프로토타입 스코프의 경우 컨테이너를 생성할 때 넘겨준 클래스 정보(PrototypeConfig.class)를 바탕으로 빈 메타데이터를 생성하고 등록까지 진행한다. (메타데이터를 생성하는 것이지 실제 빈이 생성되는 것이 아니다) 빈 조회가 발생해야 프로토타입 빈이 생성되고 그에 관련된 의존관계가 주입된다.
> 

## 프로토타입 스코프와 싱글톤 빈

### 프로토타입 스코프와 싱글톤 빈과 함께 사용시 문제점

스프링 컨테이너에 프로토타입 스코프의 빈을 요청하면 항상 새로운 객체 인스턴스를 생성해서 반환한다. 하지만 싱글톤 빈과 함께 사용할 때는 의도한 대로 잘 동작하지 않으므로 주의해야 한다.

#### 스프링 컨테이너에 프로토타입 빈 직접 요청

1. 클라이언트 A는 스프링 컨테이너에 프로토타입 빈을 요청한다.
2. 스프링 컨테이너는 프로토타입 빈을 새로 생성하여 반환한다. (프로토타입에 count라는 필드가 있다면 그 값의 초기값은 0이다.)
3. 클라이언트는 조회한 프로토타입 빈에 addCount()를 호출하면서 count 필드를 +1 하면 프로토타입 빈의 count는 1이 된다.
4. 클라이언트 B가 스프링 컨테이너에 프로토타입 빈을 요청하고 마찬가지로 count 필드가 있다. 클라이언트가 addCount()를 호출하면 이 값 역시 1이 된다.

**결론:** 프로토타입 빈은 **요청할 때마다 새로 생성**된다.

![3](https://user-images.githubusercontent.com/79130276/207813361-d4ee23ae-de64-4403-9af6-3fa0adfede91.png)

#### 싱글톤 빈에서 프로토타입 빈 사용

문제는 싱글톤 빈에서 프로토타입을 사용할 때 발생한다.

`가정` ClientBean이라는 싱글톤 빈이 있다. ClientBean은 의존관계 주입을 통해서 프로토타입 빈을 주입받아서 사용한다.

1. clientBean은 싱글톤이므로 스프링 컨테이너 생성 시점에 함께 생성되고 의존관계 주입도 발생한다.
2. clientBean은 의존관계 자동 주입을 사용하고 주입 시점에 스프링 컨테이너에 프로토타입 빈을 요청한다.
3. 스프링 컨테이너는 프로토타입 빈을 생성해서 clientBean에 반환하며 프로토타입 빈의 count 값은 0이다.
4. 이제 clientBean은 프로토타입 빈을 내부 필드에 보관한다. (정확히는 **참조값**을 보관함)
5. 클라이언트 A는 clientBean을 스프링 컨테이너에 요청해서 받고 싱글톤이므로 항상 같은 clientBean이 반환된다.
6. 클라이언트 A는 프로토타입의 addCount()를 호출하며 count 값은 1이 된다.
7. 클라이언트 A는 clientBean을 스프링 컨테이너에 요청해서 받고 클라이언트 A에서 사용한 것과 같은 clientBean이 반환된다.
8. 클라이언트 B는 프로토타입의 addCount()를 호출하며 count 값은 2가 된다.

**결론:** 프로토타입 빈은 clientBean 생성 시점에 생성되고 의존관계 주입이 이루어졌기 때문에 프로토타입 빈을 싱글톤에서 관리한다.

스프링은 일반적으로 싱글톤 빈을 사용하므로 싱글톤 빈이 프로토타입 빈을 사용하게 된다. 그런데 싱글톤 빈은 생성 시점에만 의존관계 주입을 받으므로 프로토타입 빈이 새로 생성되기는 하지만, 싱글톤 빈과 함께 계속 **유지**되는 것이 문제다. `즉, 프로토타입 빈의 목적에 맞게 사용하지 못하게 된다.` 사실상 프로토타입 빈이 싱글톤처럼 동작하고 있기 때문에 **동시성** 문제가 발생한다.

프로토타입 빈은 그 목적에 맞게 프로토타입 빈을 주입 시점에만 새로 생성하는 것이 아닌 사용할 때마다 새로 생성해서 사용하는 것을 원할 것이다.

> **참고**
<br>
싱글톤 객체가 프로토타입 스코프 객체를 들고 있어 생기는 문제는 싱글톤 객체의 특성 때문에 발생하는 문제이다.
> 

그렇다면 싱글톤 빈과 프로토타입 빈을 함께 사용할 때, 항상 새로운 프로토타입 빈을 생성하는 방법이 뭘까?

1. 스프링 컨테이너에 요청
2. ObjectFactory, ObjectProvider 사용
3. JSR-330 Provider

### 해결1. 스프링 컨테이너에 요청

가장 간단한 방법은 싱글톤 빈이 프로토타입을 사용할 때 마다 **스프링 컨테이너에 새로 요청**하는 것이다.

- 실행해보면 ac.getBean()을 통해서 항상 새로운 프로토타입 빈이 생성되는 것을 확인할 수 있다.
- 의존관계를 외부에서 주입(DI) 받는게 아니라 **직접 필요한 의존관계를 찾는 것**을 `Dependency Lookup(DL) 의존관계 조회(탐색)` 이라 한다.
- 그런데 이렇게 스프링의 애플리케이션 컨텍스트 전체를 주입받게 되면, 스프링 컨테이너에 **종속적**인 코드가 되고 단위테스트도 어려워진다.
- 지금 필요한 기능은 지정한 프로토타입 빈을 컨테이너에서 대신 찾아주는 DL 정도의 기능만 제공하는 무언가가 있으면 된다.

> **참고** DL(Dependency Lookup)
<br>
DL은 의존성 검색이다. 빈에 접근하기 위해 컨테이너가 제공하는 API를 이용하여 Bean을 Lookup하는 것이다. 예를 들어 프로토타입 스코프의 빈을 이용해야 하는 경우가 대표적이다.
> 

### 해결2. ObjectFactory, ObjectProvider

지정한 빈을 컨테이너에서 대신 찾아주는 `DL` 서비스를 제공하는 것이 `ObjectProvider`이다. ObjectFactory에 편의 기능을 추가한 것이 ObjectProvider이다.

```java
// 테스트니까 간편하게 필드주입 사용
@Autowired
private ObjectProvider<PrototypeBean> prototypeBeanProvider;

public int logic() {
    PrototypeBean prototypeBean = prototypeBeanProvider.getObject();
    prototypeBean.addCount();
    int count = prototypeBean.getCount();
    return count;
}
```

- `prototypeBeanProvider.getObject()`를 통해 **새로운 프로토타입 빈이 생성**되는 것을 확인할 수 있다.
- ObjectProvider의 getObject()를 호출하면 그 시점에 스프링 컨테이너를 통해 해당 빈을 찾아서 반환한다. (`DL`)
- 스프링이 제공하는 기능을 사용하지만, 기능이 단순하므로 단위테스트를 만들거나 mock 코드를 만들기는 훨씬 쉬워진다.
- ObjectProvider는 DL 정도의 기능만 제공한다.

**특징**

- ObjectFactory: 기능이 단순, 별도의 라이브러리 필요 없으며 스프링에 의존한다.
- ObjectProvider: ObjectFactory 상속, 옵션, 스트림 처리 등 편의 기능이 많고, 별도의 라이브러리 필요 없으며 스프링에 의존한다.

### 해결3. JSR-330 Provider

마지막 방법은 javax.inject.Provider라는 `JSR-330 자바 표준`을 사용하는 방법이다.

**build.gradle에 추가**

```
implementation 'javax.inject:javax.inject:1'
```

```java
@Autowired
private Provider<PrototypeBean> provider;

public int logic() {
    PrototypeBean prototypeBean = provider.get();
    prototypeBean.addCount();
    int count = prototypeBean.getCount();
    return count;
}
```

- 실행해보면 `provider.get()`을 통해 항상 **새로운 프로토타입 빈이 생성**되는 것을 확인할 수 있다.
- provider의 get()을 호출하면 내부에서는 스프링 컨테이너를 통해 해당 빈을 찾아서 반환한다. (`DL`)
- 자바 표준, 기능이 단순하여 단위테스트를 작성하거나 mock 코드를 만들기 쉽다.
- Provider는 DL 정도의 기능만 제공한다.

**특징**

- **get() 메서드** 하나로 기능이 매우 단순하다.
- 별도의 라이브러리가 필요하다.
- 자바 표준이므로 스프링이 아닌 다른 컨테이너에서도 사용할 수 있다.

### 정리

- 그러면 프로토타입 빈을 언제 사용할까? 매번 사용할 때 마다 의존관계 주입이 완료된 새로운 객체가 필요하면 사용하면 된다. 그런데 실무에서 웹 애플리케이션을 개발해보면, 싱글톤 빈으로 대부분의 문제를 해결할 수 있기 때문에 프로토타입 빈을 직접적으로 사용하는 일은 매우 드물다.
- ObjectProvider, JSR330 Provider 등은 프로토타입 뿐만 아니라 DL이 필요한 경우는 언제든지 사용할 수 있다.

> **참고**
<br>
스프링이 제공하는 메서드에 @Lookup 애노테이션을 사용하는 방법도 있지만, 이전 방법들로 충분하기 때문에 생략하겠다.
> 

> **참고**
<br>
스프링을 사용하다 보면 **자바 표준**(JSR-330 Provier)과 **스프링이 제공**(ObjectProvider)하는 기능이 겹칠때가 많이 있다. 대부분 스프링이 더 다양하고 편리한 기능을 제공해주기 때문에, 특별히 다른 컨테이너를 사용할 일이 없다면, **스프링이 제공하는 기능을 사용**하면 된다.
> 

## 웹 스코프

`웹 스코프`에 대해 알아보자.

### 웹 스코프의 특징

- 웹 스코프는 웹 환경에서만 동작한다.
- 웹 스코프는 프로토타입과 다르게 스프링이 해당 **스코프의 종료시점까지 관리**한다. 따라서, 종료 메서드가 호출된다.

### 웹 스코프 종류

- request: HTTP 요청하나가 들어오고 나갈때까지 유지되는 스코프, 각각의 HTTP 요청마다 별도의 빈 인스턴스가 생성되고, 관리된다.
- session: HTTP Session과 동일한 생명주기를 가지는 스코프
- application: 서플릿 컨텍스트(ServletContext)와 동일한 생명주기를 가지는 스코프
- websocket: 웹 소켓과 동일한 생명주기를 가지는 스코프

여기서는 request 스코프를 예제로 설명하겠다. 나머지도 범위만 다르지 동작 방식은 비슷하다.

## request 스코프 예제 만들기

웹 스코프는 웹 환경에서만 동작하므로 web 환경이 동작하도록 라이브러리를 추가하자.

**build.gradle에 추가**

```
implementation 'org.springframework.boot:spring-boot-starter-web'
```

> **참고**
<br>
spring-boot-starter-web 라이브러리를 추가하면 스프링 부트는 내장 톰켓 서버를 활용해서 웹 서버와 스프링을 함께 실행시킨다.
> 

> **참고**
<br>
스프링 부트는 웹 라이브러리가 없으면 AnnotationConfigApplicationContext을 기반으로 애플리케이션을 구동한다. 웹 라이브러리가 추가되면 웹과 관련된 추가 설정과 환경들이 필요하므로 AnnotationConfigServletWebServerApplicationContext를 기반으로 애플리케이션을 구동한다.
> 

### request 스코프 예제 개발

동시에 여러 HTTP 요청이 오면 정확히 어떤 요청이 남긴 로그인지 구분하기 어렵다. 이럴때 사용하는 것이 request 스코프이다.

`기능정의` 다음과 같이 로그가 남도록 request 스코프를 활용해서 추가 기능을  개발한다.

```
[d06b992f...] request scope bean create
[d06b992f...][http://localhost:8080/log-demo] controller test
[d06b992f...][http://localhost:8080/log-demo] service id = testId
[d06b992f...] request scope bean close
```

- 기대하는 공통 포멧: [UUID][requestURL] {message}
- UUID를 사용해서 HTTP 요청을 구분하자.
- requestURL 정보도 추가로 넣어서 어떤 URL을 요청해서 남은 로그인지 확인하자.

```java
@Component
@Scope(value = "request")
public class MyLogger {

    private String uuid;
    private String requestURL;

    public void setRequestURL(String requestURL) {
        this.requestURL = requestURL;
    }

    public void log(String message) {
        System.out.println("[" + uuid + "]" + "[" + requestURL + "]" + message);
    }

    @PostConstruct
    public void init() {
        uuid = UUID.randomUUID().toString();
        System.out.println("[" + uuid + "] request scope bean create:" + this);
    }

    @PreDestroy
    public void close() {
        System.out.println("[" + uuid + "] request scope bean close:" + this);
    }
}
```

- 로그를 출력하기 위한 MyLogger 클래스이다.
- @Scope(value = “request”)를 사용해서 `request 스코프`로 지정했다. 이제 이 빈은 HTTP 요청 당 하나씩 생성되고, HTTP 요청이 끝나는 시점에 소멸된다.
- 이 빈이 생성되는 시점에 자동으로 @PostConstruct 초기화 메서드를 사용해서 uuid를 생성해서 저장해둔다. 이 빈은 HTTP 요청 당 하나씩 생성되므로 uuid를 저장해두면 다른 HTTP 요청과 구분할 수 있다.
- 이 빈이 소멸되는 시점에 @PreDestroy를 사용해서 종료 메시지를 남긴다.
- requestURL은 이 빈이 생성되는 시점에는 알 수 없으므로, 외부에서 setter로 입력 받는다.

```java
@Controller
@RequiredArgsConstructor
public class LogDemoController {

    private final LogDemoService logDemoService;
    private final MyLogger myLogger;

    @RequestMapping("log-demo")
    @ResponseBody
    public String logDemo(HttpServletRequest request) {
        String requestURL = request.getRequestURL().toString();
        myLogger.setRequestURL(requestURL);

        myLogger.log("controller test");
        logDemoService.logic("testId");
        return "OK";
    }
}
```

- 로거가 잘 작동하는지 확인하는 테스트용 컨트롤러다.

> **참고**
<br>
requestURL을 MyLogger에 저장하는 부분은 컨트롤러 보다는 `공통 처리`가 가능한 **스프링 인터셉터**나 **서블릿 필터** 같은 곳을 활용하는 것이 좋다. (예제에서는 단순화하기 위해 컨트롤러 사용함)
> 

```java
@Service
@RequiredArgsConstructor
public class LogDemoService {

    private final MyLogger myLogger;

    public void logic(String id) {
        myLogger.log("service id = " + id);
    }
}
```

- 비즈니스 로직이 있는 서비스 계층에서도 로그를 출력해보자.
- request scope를 사용하지 않고 파라미터로 이 모든 정보를 서비스 계층에 넘긴다면 파라미터가 많아서 지저분해진다. 더 문제는 requestURL 같은 웹과 관련된 정보가 웹과 관련없는 서비스 계층까지 넘어가게 된다. 웹과 관련된 부분은 컨트롤러까지만 사용해야 한다. 서비스 계층은 웹 기술에 종속되지 않고, 가급적 **순수하게 유지**하는 것이 유지보수 관점에서 좋다.
- request scope의 MyLogger 덕분에 이런 부분을 파라미터로 넘기지 않고 MyLogger의 멤버변수에 저장해서 코드와 계층을 깔끔하게 유지할 수 있다.

이제 실행하면 잘 될 것 같지만 기대와는 다르게 실행 시점에 오류가 발생한다.

스프링 애플리케이션을 실행하는 시점에 싱글톤 빈은 생성해서 주입이 가능하지만, request 스코프 빈은 아직 생성되지 않는다. 이 빈은 실제 고객의 **요청이 와야 생성**할 수 있다.

### 해결1. 스코프와 Provider

위에서 발생한 문제를 해결할 수 있는 방법 중 첫번째는 `ObjectProvider`를 사용하는 것이다.

```java
@Controller
@RequiredArgsConstructor
public class LogDemoController {

    private final LogDemoService logDemoService;
    private final ObjectProvider<MyLogger> myLoggerProvider;

    @RequestMapping("log-demo")
    @ResponseBody
    public String logDemo(HttpServletRequest request) throws InterruptedException {
        String requestURL = request.getRequestURL().toString();
        MyLogger myLogger = myLoggerProvider.getObject();
        myLogger.setRequestURL(requestURL);

        myLogger.log("controller test");
        Thread.sleep(1000);
        logDemoService.logic("testId");
        return "OK";
    }
}
```

```java
@Service
@RequiredArgsConstructor
public class LogDemoService {

    private final ObjectProvider<MyLogger> myLoggerProvider;

    public void logic(String id) {
        MyLogger myLogger = myLoggerProvider.getObject();
        myLogger.log("service id = " + id);
    }
}
```

- ObjectProvider 덕분에 ObjectProvider.getObject()를 호출하는 시점까지 request scope 빈의 생성을 지연할 수 있다.
- ObjectProvider.getObject()를 호출하는 시점에는 HTTP 요청이 진행중이므로 request scope 빈의 생성이 정상 처리된다.
- ObjectProvider.getObject()를 LogDemoController, LogDemoService에서 각각 한번씩 따로 호출해도 같은 HTTP 요청이면 같은 스프링 빈이 반환된다.

여기서 더 코드를 줄일 수 있는 방법이 `프록시`를 사용하는 것이다.

### 해결2. 스코프와 프록시

프록시 방법을 알아보자.

```java
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MyLogger { ... }
```

- proxyMode = ScopedProxyMode.TARGET_CLASS가 핵심이다.
    - 적용 대상이 인터페이스가 아닌 클래스면 TARGET_CLASS를 사용
    - 적용 대상이 인터페이스면 INTERFACES 사용
- 이렇게 하면 MyLogger의 가짜 프록시 클래스를 만들어두고 HTTP request와 상관 없이 가짜 프록시 클래스를 다른 빈에 미리 주입해 둘 수 있다.

이제 나머지 코드를 Provider 사용 이전으로 돌려둔다. 실행해보면 잘 동작한다.

### 웹 스코프와 프록시 동작 원리

먼저 주입된 myLogger를 확인해보자

```java
System.out.println("myLogger = " + myLogger.getClass());
```

**출력결과**

```
myLogger = class hello.core.common.MyLogger$$EnhancerBySpringCGLIB$$4bb1c28b
```

`CGLIB라는 라이브러리로 내 클래스를 상속받은 가짜 프록시 객체를 만들어서 주입한다.`

- @Scope의 proxyMode = ScopedProxyMode.TARGET_CLASS를 설정하면 스프링 컨테이너는 CGLIB라는 **바이트코드를 조작하는 라이브러리**를 사용해서, MyLogger를 상속받은 **가짜 프록시 객체**를 생성한다.
- 결과를 확인해보면 우리가 등록한 순수한 MyLogger 클래스가 아니라 MyLogger$$EnhancerBySpringCGLIB이라는 클래스로 만들어진 객체가 대신 등록된 것을 확인할 수 있다.
- 그리고 스프링 컨테이너에 myLogger라는 이름으로 진짜 대신에 이 가짜 프록시 객체를 등록한다.
- ac.getBean(”myLogger”, MyLogger.class)로 조회해도 프록시 객체가 조회되는 것을 확인할 수 있다.
- 그래서 의존관계 주입도 이 가짜 프록시 객체가 주입된다.

![1](https://user-images.githubusercontent.com/79130276/208137820-8baf596f-3e37-43a3-854a-b78a30162abf.png)


`가짜 프록시 객체는 요청이 오면 그때 내부에서 진짜 빈을 요청하는 위임 로직이 들어있다.`

- 이 가짜 프록시 빈은 내부에 실제 MyLogger를 찾는 방법을 알고 있다.
- 클라이언트가 myLogger.logic()을 호출하면 사실은 가짜 프록시 객체의 메서드를 호출한 것이다.
- 가짜 프록시 객체는 request 스코프의 진짜 myLogger.logic()를 호출한다.
- 가짜 프록시 객체는 원본 클래스를 상속받아서 만들어졌기 때문에 이 객체를 사용하는 클라이언트 입장에서는 사실 원본인지 아닌지도 모르게, 동일하게 사용할 수 있다 (다형성)

### 동작 정리

- CGLIB라는 라이브러리로 내 클래스를 상속받은 가짜 프록시 객체를 만들어서 주입한다.
- 이 가짜 프록시 객체는 실제 요청이 오면 그때 내부에서 실제 빈을 요청하는 위임 로직이 들어있다.
- 가짜 프록시 객체는 실제 request scope와는 관계가 없다. 그냥 가짜이고, 내부에 단순한 위임 로직만 있고, 싱글톤 처럼 동작한다.

### 특징 정리

- 프록시 객체 덕분에 클라이언트는 마치 싱글톤 빈을 사용하듯이 편리하게 request scope를 사용할 수 있다.
- 사실 Provider를 사용하든, 프록시를 사용하든 핵심 아이디어는 진짜 객체 조회를 꼭 필요한 시점까지 `지연처리` 한다는 점이다.
- 단지 애노테이션 설정 변경만으로 원본 객체를 프록시 객체로 대체할 수 있다. 이것이 바로 다형성과 DI 컨테이너가 가진 큰 강점이다.
- 꼭 웹 스코프가 아니어도 프록시는 사용할 수 있다.

### 주의점

- 마치 싱글톤처럼 사용하는 것 같지만 다르게 동작하기 때문에 주의해서 사용해야 한다.
- 이런 특별한 scope는 꼭 필요한 곳에만 최소화해서 사용하자. 무분별하게 사용하면 유지보수하기 어려워진다.