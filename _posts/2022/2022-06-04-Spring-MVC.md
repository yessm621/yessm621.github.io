---
title:  "스프링 MVC"
# last_modified_at: 2022-06-04T19:25:00
# last_modified_at: 2022-06-05T19:00:00
last_modified_at: 2022-06-09T18:00:00
categories: 
  - Spring
tags:
  - Java
  - Spring
toc: true
toc_label: "Getting Started"
toc_sticky: true
---

# 웹 애플리케이션 이해

## 1. 웹 서버, 웹 애플리케이션 서버

### 1.1 HTTP 메시지에 모든 것을 전송

- HTML, TEXT
- IMAGE, 음성, 영상, 파일
- JSON, XML (API)
- 거의 모든 형태의 데이터 전송 가능
- 서버간에 데이터를 주고 받을 때도 대부분 HTTP 사용
- 지금은 HTTP시대!

<br>

### 1.2 웹 서버 (Web Server)

- HTTP 기반으로 동작
- `정적 리소스` 제공, 기타 부가기능
- 정적(파일) HTML, CSS, JS, 이미지, 영상
- 예) **NGINX**, **APACHE**

<br>

### 1.3 웹 애플리케이션 서버(WAS, Web Application Server)

- HTTP 기반으로 동작
- **웹 서버 기능 포함** + (정적 리소스 제공 가능)
- 프로그램 코드를 실행해서 `애플리케이션 로직 수행`
    - 동적 HTML, HTTP API(JSON)
    - 서블릿, JSP, 스프링 MVC
- 예) 톰캣, Jetty, Undertow

<br>

### 1.4 웹서버와 웹애플리케이션 서버 차이

- **웹 서버는 정적 리소스(파일), WAS는 애플리케이션 로직**
- 사실은 둘의 용어도 경계도 모호함
- 웹서버도 프로그램을 실행하는 기능을 포함하기도 함
- 웹 애플리케이션 서버도 웹 서버의 기능을 제공함
- 자바는 서블릿 컨테이너 기능을 제공하면 WAS
- `WAS`는 `애플리케이션 코드를 실행`하는데 더 특화

<br>

### 1.5 웹 시스템 구성 - WAS, DB

- WAS가 너무 많은 역할을 담당, 서버 과부화 우려
- 가장 비싼 애플리케이션 로직이 정적 리소스 때문에 수행이 어려울 수 있음
    - 가장 비싸다는 말의 의미?
        
        이미지 하나 보여주는 것과 구매하는 프로세스를 수행하는 것 중 비싼 것은 구매하는 프로세스를 수행하는 것
        
- WAS 장애시 오류 화면도 노출 불가능

<br>

### 1.6 웹 시스템 구성 - WEB, WAS, DB

- `정적 리소스`는 **웹 서버**가 처리
- 웹 서버는 애플리케이션 로직같은 `동적인 처리`가 필요하면 **WAS**에 요청을 위임
- WAS는 중요한 애플리케이션 로직 처리 담당

![1](https://user-images.githubusercontent.com/79130276/171995330-a502969a-4932-4335-acb3-34bf48ee8cda.png)

<br>

- 효율적인 리소스 관리
    - 정적 리소스가 많이 사용되면 WEB 서버 증설
    - 애플리케이션 리소스가 많이 사용되면 WAS 증설

![2](https://user-images.githubusercontent.com/79130276/171995328-9b9273a2-0578-4b51-98a8-c63abfff7d8a.png)

<br>

- 정적 리소스만 제공하는 웹 서버는 잘 죽지 않음
- 애플리케이션 로직이 동작하는 WAS 서버는 잘 죽음 (개발자의 로직 실수 등으로)
- WAS, DB 장애시 WEB 서버가 오류 화면 제공 가능

![3](https://user-images.githubusercontent.com/79130276/171995327-12124948-afef-40e8-af1a-d9428b08f107.png)

[참고] API 서버만 제공한다면 웹서버는 구축하지 않아도 됨

<br>

## 2. 서블릿

### [예시] HTML Form 데이터 전송: POST 전송 -저장

![4](https://user-images.githubusercontent.com/79130276/171995376-6f5bd555-e6c2-474e-be09-f195a33845b0.png)

<br>

**서버에서 처리해야 하는 업무**

서블릿을 사용하지 않는다면 아래의 리스트를 모두 구현해야 한다. 하지만, 서블릿을 지원하는 WAS를 사용하면 초록색 박스안의 내용만 구현하면 된다.

![5](https://user-images.githubusercontent.com/79130276/171995324-0545d459-afbb-4ad7-b1fd-02d03e19b04f.png)

<br>

### 2.1 서블릿 특징

```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response){
		//애플리케이션 로직
	}
}
```

- urlPatterns(/hello)의 URL이 호출되ㅏ면 서블릿 코드가 실행
- HTTP 요청 정보를 편리하게 사용할 수 있는 HttpServletRequest
- HTTP 응답 정보를 편리하게 사용할 수 있는 HttpServletResponse
- 개발자는 HTTP 스펙을 매우 편리하게 사용

<br>

### 2.2 서블릿 HTTP 요청, 응답 흐름

**HTTP 요청 시**,

1. WAS는 Request, Response 객체를 생성 후, 서블릿 객체 호출
2. 개발자는 Request 객체에서 HTTP 요청 정보를 편리하게 꺼내서 사용
3. 개발자는 Response 객체에 HTTP 응답 정보를 편리하게 입력
4. WAS는 Response 객체에 담겨있는 내용으로 HTTP 응답 정보를 생성

![6](https://user-images.githubusercontent.com/79130276/171995323-2c87ff99-4e15-44ff-906a-51058b731323.png)

<br>

### 2.3 서블릿 컨테이너

- 톰캣처럼 서블릿을 지원하는 WAS를 서블릿 컨테이너라고 함
- 서블릿 컨테이너는 서블릿 객체를 생성, 초기화, 호출, 종료하는 생명주기 관리
- 서블릿 객체는 **싱글톤으로 관리**
    - 고객의 요청이 올 때 마다 계속 객체를 생성하는 것은 비효율
    - 최초 로딩 시점에 서블릿 객체를 미리 만들어두고 재활용
    - 모든 고객 요청은 동일한 서블릿 객체 인스턴스에 접근
    - **공유 변수 사용 주의**
    - 서블릿 컨테이너 종료시 함께 종료
- JSP도 서블릿으로 변환되어서 사용
- 동시 요청을 위한 `멀티 쓰레드 처리 지원`

<br>

## 3. 동시 요청 - 멀티 쓰레드

**백엔드 개발자에게 정말 중요한 내용**

![스크린샷 2022-06-04 오후 6 52 03](https://user-images.githubusercontent.com/79130276/171995258-ce7e57b7-1ddd-4abd-a6ae-b063deecef8d.png)

서블릿 객체를 누가 호출? → `쓰레드`

<br>

### 3.1 쓰레드

- 애플리케이션 코드를 하나하나 순차적으로 실행하는 것은 쓰레드
- 자바 메인 메서드를 처음 실행하면 main이라는 이름의 쓰레드가 실행
- 쓰레드가 없다면 자바 애플리케이션 실행이 불가능
- 쓰레드는 한번에 하나의 코드 라인만 수행
- 동시 처리가 필요하면 쓰레드를 추가로 생성

<br>

### [예제1] 단일 요청 - 쓰레드 하나 사용

1. 쓰레드 휴식
2. 요청이 오면 쓰레드를 할당하여 쓰레드가 서블릿 객체를 호출 함
3. 응답을 해주고 쓰레드는 다시 휴식

<br>

### [예제2] 다중 요청 - 쓰레드 하나 사용

![스크린샷 2022-06-04 오후 6 54 40](https://user-images.githubusercontent.com/79130276/171995260-532bdcb4-d4ed-446b-90cf-6aa0f95519bf.png)

요청1을 처리중이고 어떤 이유로 servlet에서 처리가 지연되고 있는데 이때 요청2가 들어온다면 쓰레드 대기 상태가 되며 결국 둘다 오류가 발생하게 됨 (timeout 등으로)

→ 요청마다 쓰레드를 생성하면 이를 해결할 수 있음

<br>

### 3.2 요청마다 쓰레드 생성의 장단점

**장점**

- 동시 요청을 처리할 수 있음
- 리소스(CPU, 메모리)가 허용할 때까지 처리가능
- 하나의 쓰레드가 지연 되어도, 나머지 쓰레드는 정상동작함

**단점**

- 쓰레드는 생성 비용이 매우 비쌈
    - 고객의 요청이 올 때마다 쓰레드를 생성하면, 응답 속도가 늦어진다
- 쓰레드는 컨텍스트 스위칭 비용이 발생
    - 컨텍스트 스위칭 비용? - 쓰레드를 전환할때 발생하는 비용 (쓰레드가 너무 많으면 문제가 생김)
- 쓰레드 생성에 제한이 없음
    - 고객의 요청이 너무 많이 오면 CPU, 메모리 임계점을 넘어서 서버가 죽을 수 있음

<br>

### 3.3 쓰레드 풀

- 요청마다 쓰레드 생성의 단점 보완

![스크린샷 2022-06-04 오후 7 01 17](https://user-images.githubusercontent.com/79130276/171995261-2d293258-9bda-4cfe-b119-9fdc6332eaa5.png)

**특징**

- 필요한 쓰레드를 `쓰레드 풀`에 **보관**하고 **관리**
- 쓰레드 풀에 생성 가능한 쓰레드의 **최대치**를 관리. 톰캣을 최대 200개 기본 설정 (변경 가능)

**사용**

- 쓰레드가 필요하면, 이미 생성되어 있는 쓰레드를 쓰레드 풀에서 꺼내서 사용
- 사용을 종료하면 쓰레드 풀에 해당 쓰레드를 **반납**
- 최대 쓰레드가 모두 사용중이어서 쓰레드 풀에 쓰레드가 없으면?
    - 기다리는 요청은 **거절**하거나 특정 숫자만큼만 **대기**하도록 설정할 수 있음

**장점**

- 쓰레드가 미리 생성되어 있으므로, 쓰레드를 생성하고 종료하는 비용(CPU)이 절약되고, 응답 시간이 빠름
- 생성 가능한 쓰레드의 최대치가 있으므로 너무 많은 요청이 들어와도 기존 요청은 안전하게 처리 가능

<br>

### 3.4 쓰레드 풀 - 실무팁 (중요)

- WAS의 주요 튜닝 포인트는 `최대 쓰레드(max thread) 수`
- 이 값을 너무 낮게 설정하면?
    - 동시 요청이 많으면, 서버 리소스는 여유롭지만, 클라이언트는 금방 응답 지연
- 이 값을 너무 높게 설정하면?
    - 동시 요청이 많으면, CPU, 메모리 리소스 임계점 초과로 서버 다운
- 장애 발생시?
    - 클라우드면 일단 서버부터 늘리고 이후에 튜닝
    - 클라우드가 아니면 열심히 튜닝

<br>

### 쓰레드 풀의 적정 숫자

- 적정 숫자는 어떻게 찾나요? → 정답이 없다..
- 애플리케이션 로직의 복잡도, CPU, 메모리, IO 리소스 상황에 따라 모두 다름
- 성능 테스트
    - 최대한 실제 서비스와 유사하게 성능 테스트 시도
    - 툴: 아파치 ab, 제이미터, **nGrinder**(good!)
    
<br>

### 3.5 WAS의 멀티 쓰레드 지원 핵심

- **멀티 쓰레드**에 대한 부분은 **WAS가 처리**
- 개발자가 멀티 쓰레드 관련 코드를 신경쓰지 않아도 됨
- 개발자는 마치 싱글 쓰레드 프로그래밍을 하듯이 편리하게 소스 코드를 개발
- 멀티 쓰레드 환경이므로 싱글톤 객체(서블릿, 스프링 빈)는 주의해서 사용
    - 싱글톤 객체를 사용할 때 **공유변수**만 주의해서 사용하면 됨
    
<br>

## 4. HTML, HTTP API, CSR, SSR

백엔드 개발자는 정적 리소스를 어떻게 제공할 것인지? HTML 페이지는 어떻게 제공할 것인지? HTTP API 는 어떻게 제공할 것인지 고민해야한다.

<br>

### 4.1 정적 리소스

- 고정된 HTML 파일, CSS, JS, 이미지, 영상 등을 제공
- 주로 웹 브라우저

![1](https://user-images.githubusercontent.com/79130276/172045038-36a946aa-92ec-41a0-985f-54514416fd9c.png)

<br>

### 4.2 HTML 페이지

- 동적으로 필요한 HTML 파일을 생성해서 전달
- 웹 브라우저: HTML 해석

![2](https://user-images.githubusercontent.com/79130276/172045041-f380226f-bb83-4bd6-b904-a05e45503cbb.png)

<br>

### 4.3 HTTP API

- HTML이 아니라 **데이터**를 전달
- 주로 **JSON 형식** 사용

![3](https://user-images.githubusercontent.com/79130276/172045043-e804b88a-1ace-4720-b8b7-be9f25e40186.png)

- 다양한 시스템에서 호출
- 데이터만 주고 받음, UI 화면이 필요하면, 클라이언트가 별도 처리
- 앱, 웹 클라이언트, 서버 to 서버

![4](https://user-images.githubusercontent.com/79130276/172045045-4b06ed72-0556-4593-b6b7-4f3fd63eb4d3.png)

<br>

### 즉, HTTP API는 다양한 시스템 연동이 가능

- 주로 **JSON 형태**로 데이터 통신
- UI 클라이언트 접점
    - 앱 클라이언트(아이폰, 안드로이드, PC 앱)
    - 웹 블라우저에서 자바스크립트를 통한 HTTP API 호출
    - React, Vue.js 같은 웹 클라이언트
- 서버 to 서버
    - 주문 서버 → 결제 서버
    - 기업간 데이터 통신
    
<br>

### 4.4 서버사이드 렌더링, 클라이언트 사이드 렌더링

- SSR - 서버 사이드 렌더링
    - **HTML 최종 결과를 서버에서 만들어서** 웹 브라우저에 전달
    - 주로 정적인 화면에 사용
    - 관련기술: JSP, 타임리프 → 백엔드 개발자

![5](https://user-images.githubusercontent.com/79130276/172045046-4621e416-491a-44c1-9864-257701692c4a.png)

- CSR - 클라이언트 사이드 렌더링
    - HTML 결과를 자바스크립트를 사용해 웹 브라우저에서 동적으로 생성해서 적용
    - 주로 동적인 화면에 사용, 웹 환경을 마치 앱 처럼 필요한 부분부분 변경할 수 있음
    - 관련기술: React, Vue.js → 웹 프론트엔드 개발자

![6](https://user-images.githubusercontent.com/79130276/172045047-ddb4b4a8-581e-42be-8378-dfaf4671d3f5.png)

- 참고
    - React, Vue.js 를 CSR+SSR 동시에 지원하는 웹 프레임워크도 있음
    - SSR을 사용하더라도, 자바스크립트를 사용해서 화면 일부를 동적으로 변경 가능

<br>    

어디까지 알아야 하나요?

백엔드 개발자 입장에서 UI 기술

- **백엔드 - 서버 사이드 렌더링 기술**
    - JSP, 타임리프
    - 화면이 정적이고, 복잡하지 않을 때 사용
    - 백엔드 개발자는 서버 사이드 렌더링 기술 학습 **필수**
- **웹 프론트엔드 - 클라이언트 사이드 렌더링 기술**
    - React, Vue.js
    - 복잡하고 동적인 UI 사용
    - 웹 프론트엔드 개발자의 전문 분야
- 선택과 집중
    - 백엔드 개발자의 웹 프론트엔드 기술 학습은 **옵션**
    - 백엔드 개발자는 서버, DB, 인프라 등등 수 많은 백엔드 기술을 공부해야 함
    - 웹 프론트엔드도 깊이있게 잘 하려면 숙련에 오랜 시간이 필요함

<br>

## 5. 자바 백엔드 웹 기술 역사

### 5.1 과거 기술

### 5.2 현재 사용 기술

- 애노테이션 기반의 스프링 MVC 등장
    - @Controller
    - MVC 프레임워크의  춘추 전국 시대 마무리
- `스프링 부트`의 등장
    - 스프링 부트는 `서버를 내장`
    - 과거에는 서버에 WAS를 직접 설치하고, 소스는 War 파일을 만들어서 설치한 WAS에 배포
    - 스프링 부트는 **빌드 결과(Jar)**에 WAS 서버 포함 → 빌드 배포 단순화

<br>

### 5.3 최신 기술 - 스프링 웹 기술의 분화

- Web Servlet - Spring MVC
    - 서블릿 기반의 Spring MVC, 멀티 쓰레드를 사용
- Web Reactive - Spring WebFlux

<br>

### 5.4 스프링 웹 플럭스(WebFlux) **특징**

- 비동기 넌 블러킹 처리
- 최소 쓰레드로 최대 성능 - 쓰레드 컨텍스트 스위칭 비용 효율화
    - 고효율로 CPU 코어수와 쓰레드 개수를 맞춤
- 함수형 스타일로 개발 - 동시처리 코드 효율화
- 서블릿 기술 사용X
- 웹 플럭스는 기술적 난이도 매우 높음
- 아직은 RDB(관계형 데이터베이스) 지원 부족
- 일반 MVC의 쓰레드 모델도 충분히 빠름
- 실무에서 아직 많이 사용하지는 않음 (전체 1% 이하)

<br>

### 5.5 자바 뷰 템플릿 역사

템플릿: HTML을 편리하게 생성하는 뷰 기능

- JSP
- 프리마커, 벨로시티
- 타임리프
    - 내추럴 템플릿: HTML의 모양을 유지하면서 뷰 템플릿 적용 가능
    - 스프링 MVC와 강력한 기능 통합
    - **최선의 선택**, 단 성능은 프리마커, 벨로시티가 더 빠름

<br>

# 서블릿

## 1. 프로젝트 생성

### 1.1 IntelliJ Gradle 대신에 자바 직접 실행

Preferences → Build, Execution, Deployment → Build Tools → Gradle

- Build and run using: Gradle IntelliJ IDEA
- Run tests using: Gradle IntelliJ IDEA

<br>

### 1.2 롬복 적용

- Preferences plugin lombok 검색 실행 (재시작)
- Preferences Annotation Processors 검색 Enable annotation processing 체크 (재시작)

<br>

## 2. Hello 서블릿

### 2.1 스프링 부트 서블릿 환경 구성

- @ServletComponentScan:  서블릿을 직접 등록해서 사용할 수 있도록 해주는 어노테이션
- @WebServlet
    - name: 서블릿 이름
    - urlPatterns: URL 매핑
- HTTP 요청을 통해 매핑된 URL이 호출되면 서블릿 컨테이너는 다음 메서드를 실행
    - protected void service(HttpServletRequest request, HttpServletResponse response)

```java
package hello.servlet.basic;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "helloServelt", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

    // ctrl + o
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        System.out.println("HelloServlet.service");
        System.out.println("request = " + request);
        System.out.println("response = " + response);

        String username = request.getParameter("username");
        System.out.println("username = " + username);

        response.setContentType("text/plain");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write("hello " + username);

    }
}
```

<br>

### 2.2 **HTTP 요청 메시지 로그로 확인하기**

application.properties

```
logging.level.org.apache.coyote.http11=debug
```

단, 운영서버에서는 사용하지 말자 (성능저하 발생)

<br>

## 3. HttpServletRequest

### 3.1 **HttpServletRequest 역할**

서블릿은 개발자가 HTTP 요청 메시지를 편리하게 사용할 수 있도록 개발자 대신에 HTTP 요청 메시지를 파싱함

그리고 그 결과를 HttpServletRequest 객체에 담아서 제공

<br>

### 3.2 HTTP 요청 메시지

```
POST /save HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

username=kim&age=20
```

- start line
    - HTTP 메소드
    - URL
    - 쿼리 스트링
    - 스키마, 프로토콜
- 헤더
    - 헤더 조회
- 바디
    - form 파라미터 형식 조회
    - message body 데이터 직접 조회

<br>

### 3.3 임시 저장소 기능

해당 HTTP 요청이 시작부터 끝날 때까지 유지되는 임시 저장소 기능

- 저장: request.setAttribute(name, value)
- 조회: request.getAttribute(name)

<br>

### 3.4 세션 관리 기능

request.getSession(create: true)

<br>

> **중요**
HttpServletRequest, HttpServletResponse를 사용할 때 가장 중요한 점은 이 객체들이 HTTP 요청
메시지, HTTP 응답 메시지를 편리하게 사용하도록 도와주는 객체라는 점이다. 따라서 이 기능에 대해서
깊이있는 이해를 하려면 **HTTP 스펙이 제공하는 요청, 응답 메시지 자체를 이해**해야 한다.
> 

<br>

## 4. HttpServletRequest - 기본 사용법

자주 사용하지 않고 이런게 있다는 것만 알아두면 된다

[참고] **?username=kim:** 쿼리 스트링 또는 쿼리 파라미터라고 함

<br>

```java
@WebServlet(name = "requestHeaderServlet", urlPatterns = "/request-header")
public class RequestHeaderServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        printStartLine(request);
        printHeaders(request);
        printHeaderUtils(request);
        printEtc(request);
        response.getWriter().write("ok");
    }
	...
}
```

<br>

```java
private void printStartLine(HttpServletRequest request) {
    System.out.println("--- REQUEST-LINE - start ---");
    
    System.out.println("request.getMethod() = " + request.getMethod()); //GET
    System.out.println("request.getProtocol() = " + request.getProtocol()); //HTTP/1.1
    System.out.println("request.getScheme() = " + request.getScheme()); //http
    System.out.println("request.getRequestURL() = " + request.getRequestURL()); // http://localhost:8080/request-header
    System.out.println("request.getRequestURI() = " + request.getRequestURI()); // /request-header
    System.out.println("request.getQueryString() = " + request.getQueryString()); //username=kim
    System.out.println("request.isSecure() = " + request.isSecure()); //https 사용 유무
    
    System.out.println("--- REQUEST-LINE - end ---");
    System.out.println();
}

```

<br>

```java
//Header 모든 정보
private void printHeaders(HttpServletRequest request) {
    System.out.println("--- Headers - start ---");
    
    // Header 정보를 가져오는 방법1 (옛날 방식)
    /*Enumeration<String> headerNames = request.getHeaderNames();
       while (headerNames.hasMoreElements()) {
           String headerName = headerNames.nextElement();
           System.out.println(headerName + ": " + request.getHeader(headerName));
       }*/
    
    // Header 정보를 가져오는 방법2 (요즘에 사용하는 방식)
    request.getHeaderNames().asIterator()
            .forEachRemaining(headerName -> System.out.println(headerName + ": " + request.getHeader(headerName)));
    
    System.out.println("--- Headers - end ---");
    System.out.println();
}
```

<br>

```java
private void printHeaderUtils(HttpServletRequest request) {
    
    System.out.println("--- Header 편의 조회 start ---");
    
    System.out.println("[Host 편의 조회]");
    System.out.println("request.getServerName() = " + request.getServerName()); //Host 헤더
    System.out.println("request.getServerPort() = " + request.getServerPort()); //Host 헤더
    System.out.println();
    
    System.out.println("[Accept-Language 편의 조회]");
    request.getLocales().asIterator()
            .forEachRemaining(locale -> System.out.println("locale = " + locale));
    System.out.println("request.getLocale() = " + request.getLocale());
    System.out.println();
    
    System.out.println("[cookie 편의 조회]");
    if (request.getCookies() != null) {
        for (Cookie cookie : request.getCookies()) {
            System.out.println(cookie.getName() + ": " + cookie.getValue());
        }
    }
    System.out.println();
    
    System.out.println("[Content 편의 조회]");
    System.out.println("request.getContentType() = " + request.getContentType());
    System.out.println("request.getContentLength() = " + request.getContentLength());
    System.out.println("request.getCharacterEncoding() = " + request.getCharacterEncoding());
    
    System.out.println("--- Header 편의 조회 end ---");
    System.out.println();
}
```

<br>

```java
private void printEtc(HttpServletRequest request) {
    System.out.println("--- 기타 조회 start ---");
    
    System.out.println("[Remote 정보]");
    System.out.println("request.getRemoteHost() = " + request.getRemoteHost());
    System.out.println("request.getRemoteAddr() = " + request.getRemoteAddr());
    System.out.println("request.getRemotePort() = " + request.getRemotePort());
    System.out.println();
    
    System.out.println("[Local 정보]");
    System.out.println("request.getLocalName() = " + request.getLocalName());
    System.out.println("request.getLocalAddr() = " + request.getLocalAddr());
    System.out.println("request.getLocalPort() = " + request.getLocalPort());
    
    System.out.println("--- 기타 조회 end ---");
    System.out.println();
}
```

<br>

```
--- REQUEST-LINE - start ---
request.getMethod() = GET
request.getProtocol() = HTTP/1.1
request.getScheme() = http
request.getRequestURL() = http://localhost:8080/request-header
request.getRequestURI() = /request-header
request.getQueryString() = username=kim
request.isSecure() = false
--- REQUEST-LINE - end ---

--- Headers - start ---
host: localhost:8080
connection: keep-alive
cache-control: max-age=0
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
upgrade-insecure-requests: 1
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
sec-fetch-site: none
sec-fetch-mode: navigate
sec-fetch-user: ?1
sec-fetch-dest: document
accept-encoding: gzip, deflate, br
accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
cookie: Idea-d44c7326=986e6117-8a75-48a9-bfdf-35b8a7075242; csrftoken=otkGPGiQQ9dydNDqAQKyaRO9YAfQUCa6rmdlREltDhbgfFUkQoj0Q06yrbW5YRoB
--- Headers - end ---

--- Header 편의 조회 start ---
[Host 편의 조회]
request.getServerName() = localhost
request.getServerPort() = 8080

[Accept-Language 편의 조회]
locale = ko_KR
locale = ko
locale = en_US
locale = en
request.getLocale() = ko_KR

[cookie 편의 조회]
Idea-d44c7326: 986e6117-8a75-48a9-bfdf-35b8a7075242
csrftoken: otkGPGiQQ9dydNDqAQKyaRO9YAfQUCa6rmdlREltDhbgfFUkQoj0Q06yrbW5YRoB

[Content 편의 조회]
request.getContentType() = null
request.getContentLength() = -1
request.getCharacterEncoding() = UTF-8
--- Header 편의 조회 end ---

--- 기타 조회 start ---
[Remote 정보]
request.getRemoteHost() = 0:0:0:0:0:0:0:1
request.getRemoteAddr() = 0:0:0:0:0:0:0:1
request.getRemotePort() = 55944

[Local 정보]
request.getLocalName() = 0:0:0:0:0:0:0:1
request.getLocalAddr() = 0:0:0:0:0:0:0:1
request.getLocalPort() = 8080
--- 기타 조회 end ---
```

<br>

## 5. HTTP 요청 데이터

HTTP 요청 메시지를 통해 클라이언트에서 서버로 데이터를 전달하는 방법

<br>

주로 **3가지 방법** 사용

1. GET - **쿼리 파라미터**
    - /url?username=kim&age=20
    - message body 없이, URL의 쿼리 파라미터에 데이터를 포함해서 전달
2. POST - **HTML Form**
    - content-type: application/x-www-form-urlencoded
    - message body에 쿼리 파라미터 형식으로 전달 username=kim&age=20
3. HTTP **message body** 에 데이터를 직접 담아서 요청
    - HTTP API에서 주로 사용, JSON, XML, TEXT
    - 데이터 형식은 주로 **JSON** 사용
    - POST, PUT, PATCH

<br>

### 5.1 GET 쿼리 파라미터

**전달 데이터**

- username=hello
- age=20

<br>

메시지 바디 없이 **URL의 쿼리 파라미터를 사용**해서 데이터 전달

예) 검색, 필터, 페이징 등에서 많이 사용하는 방식

<br>

서버에서는 `HttpServletRequest`가 제공하는 메서드들을 통해 쿼리 파라미터를 편리하게 조회할 수 있음

```java
//단일 파라미터 조회
String username = request.getParameter("username");

//파라미터 이름들 모두 조회
Enumeration<String> parameterNames = request.getParameterNames(); 

//파라미터를 Map으로 조회
Map<String, String[]> parameterMap = request.getParameterMap(); 

//복수 파라미터 조회
String[] usernames = request.getParameterValues("username"); 
```

<br>

```java
package hello.servlet.basic.request;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 1. 파라미터 전송 기능
 * http://localhost:8080/request-param?username=hello&age=20
 */
@WebServlet(name = "requestParamServlet", urlPatterns = "/request-param")
public class RequestParamServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        System.out.println("[전체 파라미터 조회] - start");

        request.getParameterNames().asIterator()
                .forEachRemaining(paramName -> System.out.println(paramName + "=" + request.getParameter(paramName)));

        System.out.println("[전체 파라미터 조회] - end");
        System.out.println();

        System.out.println("[단일 파라미터 조회]");

        String username = request.getParameter("username");
        String age = request.getParameter("age");

        System.out.println("username = " + username);
        System.out.println("age = " + age);
        System.out.println();

        System.out.println("[이름이 같은 복수 파라미터 조회]");
        String[] usernames = request.getParameterValues("username");
        for (String name : usernames) {
            System.out.println("username = " + name);
        }

        response.getWriter().write("ok");

    }
}
```

```
[전체 파라미터 조회] - start
username=hello
age=20
[전체 파라미터 조회] - end

[단일 파라미터 조회]
username = hello
age = 20

[이름이 같은 복수 파라미터 조회]
username = hello
username = hello2
```

<br>

보통은 단일 파라미터를 조회하는 **getParameter()**를 많이 사용 (복수 파라미터는 거의 사용하지 않는다)

<br>

[참고] 복수 파라미터에서 단일 파라미터 조회
username=hello&username=kim 과 같이 파라미터 이름은 하나인데, 값이 중복이면 어떻게 될까?
request.getParameter() 는 하나의 파라미터 이름에 대해서 단 하나의 값만 있을 때 사용해야 한다.
지금처럼 중복일 때는 request.getParameterValues() 를 사용해야 한다.
참고로 이렇게 중복일 때 request.getParameter() 를 사용하면 request.getParameterValues() 의
첫 번째 값을 반환한다

<br>

### 5.2 POST HTML Form

HTML의 Form을 사용해서 클라이언트에서 서버로 데이터를 전송

예) 회원가입 폼, 상품 주문 등

<br>

**특징**

- content-type: application/x-www-form-urlencoded
- message body에 쿼리 파라미터 형식으로 전달 username=kim&age=20

<br>

POST의 HTML Form을 전송하면 웹 브라우저는 다음 형식으로 HTTP메시지를 만듦 (개발자 모드에서 확인 가능)

- 요청 URL: /request-param
- content-type: application/x-www-form-urlencoded
- message body: username=kim&age=20

<br>

application/x-www-form-urlencoded 형식은 GET 쿼리 파라미터 형식과 같음. 따라서, 쿼리 파라미터 조회 메서드를 그대로 사용

클라이언트 입장에서는 두 방식에 차이가 있지만 서버 입장에선 둘의 형식이 동일

결론은 `request.getParameter()`는 **GET 쿼리 파라미터 형식,** **POST HTML Form 형식** 둘 다 지원

<br>

> **참고**
content-type: HTTP 메시지 바디의 데이터 형식을 지정함
**GET URL 쿼리 파라미터 형식**은 HTTP 메시지 바디를 사용하지 않기 때문에 content-type이 없다
**POST HTML Form 형식**으로 데이터를 전달하면 HTTP 메시지 바디에 해당 데이터를 포함해서 보내기 때문에 바디에 포함된 데이터가 어떤 형식인지 content-type을 꼭 지정해야 함
폼으로 데이터를 전송할땐: application/x-www-form-urlencoded
JSON으로 전송할땐: application/json
> 

<br>

### 5.3 API 메시지 바디

HTTP message body 에 데이터를 직접 담아서 요청

- HTTP API에서 주로 사용, JSON, XML, TEXT
- 데이터 형식은 주로 JSON 사용
- POST, PUT, PATCH

<br>

### 단순 텍스트

HTTP 메시지 바디의 데이터를 `InputStream`을 사용해서 직접 읽음

<br>

```java
package hello.servlet.basic.request;

import org.springframework.util.StreamUtils;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@WebServlet(name = "requestBodyStringServlet", urlPatterns = "/request-body-string")
public class RequestBodyStringServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest reqest, HttpServletResponse response) throws ServletException, IOException {

        ServletInputStream inputStream = reqest.getInputStream();
        String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

        System.out.println("messageBody = " + messageBody);

        response.getWriter().write("ok");

    }
}
```

<br>

문자 전송

- POST http://localhost:8080/request-body-string
- content-type: text/plain
- message body: hello
- 결과: messageBody = hello

<br>

### JSON 형식

HTTP API에서 주로 사용하는 **JSON 형식**으로 데이터 전송

<br>

Json 형식 파싱 추가

```java
package hello.servlet.basic;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HelloData {

    private String username;
    private int age;
}
```

```java
package hello.servlet.basic.request;

import com.fasterxml.jackson.databind.ObjectMapper;
import hello.servlet.basic.HelloData;
import org.springframework.util.StreamUtils;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@WebServlet(name = "requestBodyJsonServlet", urlPatterns = "/request-body-json")
public class RequestBodyJsonServlet extends HttpServlet {

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        ServletInputStream inputStream = request.getInputStream();
        String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);

        System.out.println("messageBody = " + messageBody);

        HelloData helloData = objectMapper.readValue(messageBody, HelloData.class);

        System.out.println("helloData.getUsername() = " + helloData.getUsername());
        System.out.println("helloData.getAge() = " + helloData.getAge());

        response.getWriter().write("ok");

    }
}
```

```
messageBody = {
    "username": "hello",
    "age": 20
}
helloData.getUsername() = hello
helloData.getAge() = 20
```

<br>

JSON 결과를 파싱해서 사용할 수 있는 자바객체로 변환하려면 Jackson, Gson 같은 JSON변환 라이브러리를 추가해야함. 스프링 부트로 SpringMVC를 선택하면 기본으로 Jackson 라이브러리(**ObjectMapper**)를 함께 제공함

<br>

> 참고
HTML form 데이터도 메시지 바디를 통해 전송되므로 직접 읽을 수 있지만 **request.getParameter()** 기능을 사용하는 것이 간단하므로 파라미터 조회 기능을 사용함
> 

<br>

## 6. HttpServletResponse - 기본 사용법

6.1 HttpServletResponse 역할