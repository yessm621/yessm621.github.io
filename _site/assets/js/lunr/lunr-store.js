var store = [{
        "title": "스프링부트 Settings",
        "excerpt":"SpringBoot Settings 다음 Spring Initializr(https://start.spring.io/) 사이트에서 기본적인 스프링 프로젝트를 셋팅을 할 수 있다 설정 시 Add Dependencies에서 필요한 Dependency를 선택 후 GENERATE 버튼을 클릭하면 내게 필요한 라이브러리들을 build.gradle에 추가하여 스프링부트 프로젝트를 생성해준다. IntelliJ Gradle 대신에 자바 직접 실행 IntelliJ 버전은 Gradle로 실행하는 것이 기본 설정이지만, 이렇게 하면 실행 속도가 느리다....","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/SpringBootSettings/",
        "teaser": null
      },{
        "title": "쿼리 메서드 (Query Methods) 기능과 @Query",
        "excerpt":"쿼리 메서드와 JPQL(Java Persistence Query Language) 은 객체 지향 쿼리 Spring Data JPA 는 다양한 검색 조건을 위해 다음과 같은 방법 제공 쿼리 메서드: 메서드의 이름 자체가 쿼리의 구문으로 처리되는 기능 @Query: SQL 과 유사하게 엔티티 클래스의 정보를 이용해서 쿼리를 작성하는 기능 Querydsl 등의 동적 쿼리 처리 기능 쿼리 메서드(Query...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/Java-JPA-QueryMethod/",
        "teaser": null
      },{
        "title": "Git 자주쓰는 명령어",
        "excerpt":"설정 정보 (Config) 사용자 정보 설정 # repository 마다 사용자 정보 설정 git config --local user.email \"yessm621@gmail.com\" git config --local user.name \"yessm621\" # 전역(Global)으로 설정 git config --global user.email \"yessm621@gmail.com\" git config --global user.name \"yessm621\" Remote 저장소 저장소 연결/삭제 # 저장소 연결 상태 확인 git remote -v # 저장소 연결...","categories": ["Git"],
        "tags": ["Git"],
        "url": "/git/GitCommand/",
        "teaser": null
      },{
        "title": "REST API with SpringBoot(1)",
        "excerpt":"REST 인터넷 상의 시스템 간의 상호 운용성을 제공하는 방법 중 하나 시스템 제 각각의 독립적인 진화를 보장하기 위한 방법 REST의 조건 Client-Server Stateless Cache Uniform Interface Layered System Code-on-Demand(optional) 대개, REST API가 아닌 이유는 Uniform Interface 조건을 만족하지 못하기 때문이다. Uniform Interface 조건 Identification of resources 리소스가 URI로 식별이 되는지...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Jpa","RestAPI"],
        "url": "/springboot/Java-REST-API(1)/",
        "teaser": null
      },{
        "title": "REST API with SpringBoot(2)",
        "excerpt":"project dependencies Event 도메인 구현 package me.test.demoinflearnrestapi.events; import lombok.*; import javax.persistence.*; import java.time.LocalDateTime; @Entity @Builder @AllArgsConstructor @NoArgsConstructor @Getter @Setter @EqualsAndHashCode(of = \"id\") public class Event { @Id @GeneratedValue private Integer id; private String name; private String description; private LocalDateTime beginEnrollmentDatetime; private LocalDateTime closeEnrollmentDatetime; private LocalDateTime beginEventDatetime; private LocalDateTime endEventDatetime; private...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Jpa","RestAPI"],
        "url": "/springboot/JAVA-REST-API(2)/",
        "teaser": null
      },{
        "title": "REST API with SpringBoot(3)",
        "excerpt":"Event 생성 API 구현: 입력값 제한하기 dto를 사용하여 입력값을 제한하고 dto ↔ entity 를 변경할 땐 modelMapper 를 사용함 ModelMapper란? 어떤 Object에 있는 필드값들을 Object로 Mapping 시켜줌 즉, dto to entity를 일일히 정의할 필요없음 주의! ModelMapper는 해당 클래스의 기본 생성자를 이용해 객체를 생성하고 setter를 이용해 매핑을 한다. 따라서, setter 어노테이션을...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Jpa","RestAPI","TestCode"],
        "url": "/springboot/Java-REST-API(3)/",
        "teaser": null
      },{
        "title": "스프링 HATEOAS",
        "excerpt":"HATEOAS란? REST가 잘 적용된 API라면 응답에 HATEOAS를 지켜야 한다. REST API에서 클라이언트에 리소스를 넘겨줄 때 특정 부가적인 리소스의 링크 정보를 넘겨줌 links 요소를 통해 href 값의 형태로 보내주면 자원 상태에 대한 처리를 링크에 있는 URL을 통해 처리할 수 있게 된다. HATEOAS 링크에 들어가는 정보는 현재 Resource의 관계이자 링크의 레퍼런스 정보인...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Jpa","RestAPI"],
        "url": "/springboot/Java-HATEOAS/",
        "teaser": null
      },{
        "title": "REST API with SpringBoot(4)",
        "excerpt":"Event 생성 API 구현: Bad Request 응답 본문 만들기 serialization: ‘객체 → json’ 으로 변환 deserialization: ‘json → 객체’ 로 변환 body에 Bad Request에 대한 응답을 넣고 싶은데 관련 에러는 Errors에 담겨 있다 그런데, body에 error를 담으려고 하면 에러가 발생한다! 원인은 error를 json으로 변환할 수 없기 때문에.. 그렇다면 왜 event...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Jpa","RestAPI","TestCode"],
        "url": "/springboot/Java-REST-API(4)/",
        "teaser": null
      },{
        "title": "스프링 REST Docs",
        "excerpt":"스프링 REST Docs란? 지금까지 개발을 진행하면서 API 명세에 대한 정보 문서화 또는 Swagger 사용을 해왔습니다. 매번 API 개발을 할 때마다 명세에 대한 정보를 문서화를 하였고, Swagger 사용을 하면 매번 Controller, DTO 단에 Swagger 어노테이션을 추가해야 하니 코드가 보기가 좋지 않았습니다. 그러다가 API 명세서를 자동화해주는 것을 찾다가 Spring Rest Docs 찾게...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Jpa","RestAPI"],
        "url": "/springboot/SpringRESTDocs/",
        "teaser": null
      },{
        "title": "DIP, OCP와 의존관계 주입(DI)",
        "excerpt":"DIP, OCP를 지키기 위해선 다형성만으론 부족하다. 의존관계 주입(DI) 개념이 필요하다. 의존관계 주입에 대해 알아보기 전에 아래 요구사항과 그에 따른 코드 흐름을 살펴보자. 요구사항 정의서와 설계 회원 도메인 설계 회원을 가입하고 조회할 수 있다 회원은 일반과 VIP 두가지 등급이 있다 회원 데이터는 자체 DB를 구축할 수 있고, 외부 시스템과 연동할 수...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/DipOcpDi/",
        "teaser": null
      },{
        "title": "IoC(제어의 역전)와 DI(의존관계 주입)",
        "excerpt":"제어의 역전(IoC, Inversion of Control) AppConfig를 사용하기 전에는 클라이언트 구현 객체가 서버 구현 객체를 생성, 연결, 실행했다. 구현 객체가 프로그램의 제어 흐름을 스스로 조종했다. 반면에, AppConfig 등장 이후 구현 객체는 자신의 로직을 실행하는 역할만 담당하고 프로그램의 제어 흐름은 AppConfig가 가져갔다. 예를 들어, OrderServiceImpl은 필요한 인터페이스들을 호출하지만 어떤 구현 객체들이 실행될지...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/IoCDI/",
        "teaser": null
      },{
        "title": "싱글톤 컨테이너",
        "excerpt":"싱글톤 패턴 싱글톤 패턴 등장배경 웹 애플리케이션은 사용자의 요청이 많으며 동시에 요청을 한다. 만약, 스프링 없는 순수한 DI 컨테이너를 사용하면 클라이언트가 요청을 할 때마다 객체가 생성된다. 따라서, 메모리 낭비가 매우 심하다. 순수한 DI 컨테이너 테스트 @Test @DisplayName(\"스프링 없는 순수한 DI 컨테이너\") void pureContainer(){ AppConfig appConfig = new AppConfig(); MemberService memberService1...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/Singleton/",
        "teaser": null
      },{
        "title": "컴포넌트 스캔",
        "excerpt":"컴포넌트 스캔과 의존관계 자동 주입 스프링은 자바 코드의 @Bean이나 XML의 &lt;bean&gt; 같은 설정 정보가 없어도 자동으로 스프링 빈을 등록하는 컴포넌트 스캔이라는 기능을 제공하며, 의존관계를 자동으로 주입하는 @Autowired 기능을 제공한다. 컴포넌트 스캔 @ComponentScan( excludeFilters = @Filter(type = FilterType.ANNOTATION, classes = Configuration.class)) public class AutoAppConfig { // 기존과 다르게 비어있음 } 컴포넌트...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/ComponentScan/",
        "teaser": null
      },{
        "title": "Java, 테스트 코드 작성 - JUnit 5",
        "excerpt":"JUnit 5 소개 JUnit 5란? 자바 개발자가 가장 많이 사용하는 테스팅 프레임워크 단위 테스트를 작성하는 자바 개발자 93%가 JUnit을 사용 자바 8 이상을 필요로 함 Junit 5의 세부 모듈 3가지 JUnit Platform: 테스트 코드를 실행해주는 런처를 제공. TestEngine API 제공 Jupiter: TestEngine API 구현체로 JUnit 5를 제공 Vintage: JUnit 4와...","categories": ["TestCode"],
        "tags": ["Java","TestCode"],
        "url": "/testcode/JUnit5/",
        "teaser": null
      },{
        "title": "JPA N+1 문제",
        "excerpt":"JPA를 사용하다 보면 의도하지 않았지만 select 쿼리가 여러 개 발생하는 현상을 볼 수 있다. 이러한 현상을 N+1 문제라고 부르는데 이 문제가 왜 발생하는지와 이에 대한 해결 방법을 알아보자. N+1 문제란? 간단히 말하자면, 조회 시 1개의 쿼리를 생각하고 설계를 했으나 나오지 않아도 되는 조회의 쿼리가 N개 더 발생하는 문제이다. 이 문제는...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-N+1/",
        "teaser": null
      },{
        "title": "JWT(Json Web Token) 인증",
        "excerpt":"REST API 인증 기법 Basic 인증 Bearer 인증 JSON 웹 토큰 Basic 인증 Basic 인증이란 상태가 없는 웹 애플리케이션(Todo 앱)에서 인증을 구현하는 가장 간단한 방법 Basic 인증 절차 모든 HTTP 요청에 아이디와 비밀번호를 같이 보냄 최초 로그인 후 HTTP 요청 헤더의 Authorization: ‘Basic &lt;ID&gt;:&lt;Password&gt;’ 처럼 Base64로 인코딩한 문자열을 함께 보냄...","categories": ["Auth"],
        "tags": ["Auth","JWT"],
        "url": "/auth/JWT/",
        "teaser": null
      },{
        "title": "스프링부트, JWT 구현",
        "excerpt":"스프링 시큐리티 + Jwt 를 구현해보겠다. JWT 인증 로직 구현 패스워드 암호화 로직 구현 Jwt에 대한 자세한 내용은 JWT(Json Web Token) 인증을 참고하자. 실습 전 준비 User.java UserRepository.java UserService.java UserDTO.java UserController.java package me.yessm.userauth.user; import lombok.*; import javax.persistence.*; @Entity @AllArgsConstructor @NoArgsConstructor @Data @Builder @Table(uniqueConstraints = {@UniqueConstraint(columnNames = \"email\")}) public class User...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","JWT","RestAPI"],
        "url": "/springboot/JWTImpl/",
        "teaser": null
      },{
        "title": "자바: 예외처리",
        "excerpt":"예외처리(excetpion handling) 1.1 프로그램 오류 발생시점에 따라 컴파일 에러: 컴파일 할 때 발생하는 에러 런타임 에러: 프로그램의 실행도중에 발생하는 에러 (프로그램 종료됨) 그 외에 논리적 에러: 컴파일도 잘되고 실행도 잘되지만 의도한 것과 다르게 동작하는 것 (프로그램 종료 X) 실행 순서 컴파일 실행 → 컴파일러가 소스코드에 대해 오류가 있는지 알려줌 →...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Exception/",
        "teaser": null
      },{
        "title": "IP와 TCP",
        "excerpt":"IP 클라이언트와 서버의 통신은 복잡한 인터넷 망(중간 노드라는 서버들)을 거쳐서 데이터를 전송한다. 먼저 IP에 대해 알아보자. 참고 노드 여기서의 노드란 네트워크를 중간에서 연결해주는 서버(라우터)를 의미한다. IP란 Internet Protocol(인터넷 프로토콜)의 줄임말로 IP 프로토콜이라고도 한다. 복잡한 인터넷 망에서 클라이언트와 서버가 통신하려면 최소한의 규칙이 있어야 하는데 그게 IP이다. 클라이언트가 서버에게 지정한 주소로 메시지를...","categories": ["Http"],
        "tags": ["Http","Web"],
        "url": "/http/Internet-Network/",
        "teaser": null
      },{
        "title": "URI",
        "excerpt":"URI, URL, URN 이란? Uniform: 리소스를 식별하는 통일된 방식 Resource: 자원, URI로 식별할 수 있는 모든 것 URI는 로케이터(locator), 이름(name) 또는 둘다 추가로 분류될 수 있다 1. URI (Uniform Resource Identifier) 가장 큰 개념으로 리소스를 식별함 Identifier: 다른 항목과 구분하는데 필요한 정보 2. URL(Uniform Resource Locator) 자원이 있는 위치(Locator)를 지정함...","categories": ["Http"],
        "tags": ["Http","Web"],
        "url": "/http/URI/",
        "teaser": null
      },{
        "title": "HTTP",
        "excerpt":"HTTP란? HTTP란 HyperText Transfer Protocol의 줄임말로 과거에는 HyperText(문서간의 링크를 통해 연결한 HTML)를 전송하기 위한 프로토콜이였으나 현재는 거의 모든 형태의 데이터를 HTTP 메시지로 전송 가능하다. (HTML, TEXT, IMAGE, 음성, 영상, 파일, JSON, XML(API) 등) HTTP 버전은 HTTP/1.1을 가장 많이 사용한다. HTTP/1.1이 제일 중요한데 그 이유는 HTTP/1.1에 거의 모든 기능이 들어있고 HTTP/2,...","categories": ["Http"],
        "tags": ["Http","Web"],
        "url": "/http/HTTP/",
        "teaser": null
      },{
        "title": "HTTP API",
        "excerpt":"HTTP API API URI 설계 리소스 URI를 설계시 가장 중요한 것은 리소스 식별이다. 리소스란 동작을 제외한 자원 그 자체를 리소스라 한다. 리소스를 식별하는 방법은 리소스 자체에만 집중하여 리소스를 URI에 매핑한다. 예를 들어, 회원과 관련된 HTTP API를 만들어본다고 가정하면 회원이라는 개념 자체가 리소스이다. 그리고 회원 리소스를 식별하는 URI는 아래와 같다. 이렇게...","categories": ["Http"],
        "tags": ["Http","Web"],
        "url": "/http/HTTPAPI/",
        "teaser": null
      },{
        "title": "JVM(Java Virtual Machine)",
        "excerpt":"JVM(Java Virtual Machine)이란? 직역하면 자바를 실행하기 위한 가상 기계(컴퓨터) 자바 프로그램이 어느 기기나 운영체제 상에서도 실행될 수 있도록 하면서 프로그램 메모리를 관리하고 최적화하는 것 자바프로그램 실행과정 원시코드(*.java)는 CPU가 인식하지 못하므로 기계어로 컴파일을 해줘야함. 원시코드(.java)는 JVM이 인식할 수 있는 Java Bytecode(.class)로 변환됨. (Java compiler가 변환해줌) 참고 Java compiler란? JDK를 설치하면 bin에...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-JVM/",
        "teaser": null
      },{
        "title": "쿠키와 캐시",
        "excerpt":"1. 쿠키 Set-Cookie: 서버에서 클라이언트로 쿠키 전달(응답) Cookie: 클라이언트가 서버에서 받은 쿠키를 저장하고, HTTP 요청시 서버로 전달 Stateless HTTP는 무상태 프로토콜 클라이언트와 서버가 요청과 응답을 주고 받으면 연결이 끊어짐 클라이언트가 다시 요청하면 서버는 이전 요청을 기억하지 못함 클라이언트와 서버는 서로 상태를 유지하지 않는다 대안으로 모든 요청에 정보를 넘기는 방법이 있지만...","categories": ["Http"],
        "tags": ["Http","Web"],
        "url": "/http/CookieCash/",
        "teaser": null
      },{
        "title": "SSR, CSR",
        "excerpt":"서버 사이드 렌더링, 클라이언트 사이드 렌더링은 각각 서버와 클라이언트가 웹 페이지를 렌더링하는 기술을 의미한다. 서버 사이드 렌더링(SSR) SSR은 서버에서 사용자에게 보여줄 페이지를 모두 구성해 보여주는 방식이다. 즉, HTML 최종 결과를 서버에서 만들어서 웹 브라우저에 전달한다. 주로 정적인 화면에서 사용하고 관련 기술로는 JSP, 타임리프가 있다. SSR을 쓰면 모든 데이터가 매핑된 서비스...","categories": ["Http"],
        "tags": ["Http"],
        "url": "/http/SsrCsr/",
        "teaser": null
      },{
        "title": "웹 서버와 WAS",
        "excerpt":"웹 서버(Web Server, WS) 웹 서버는 HTTP 기반으로 동작하며 정적 리소스를 제공한다. 정적 리소스에는 정적 html, css ,js, 이미지, 영상 등이 있다. nginx, apache가 웹 서버에 해당한다. 웹 어플리케이션 서버(WAS) WAS는 HTTP 기반으로 동작하며 웹 서버 기능(정적 리소스 제공)도 제공할 수 있고 애플리케이션 로직도 수행한다. tomcat 등이 WAS에 해당된다. 웹...","categories": ["Http"],
        "tags": ["Http"],
        "url": "/http/WebServerWAS/",
        "teaser": null
      },{
        "title": "서블릿",
        "excerpt":"서블릿 서블릿이란 Dynamic Web Page를 만들 때 사용되는 자바 기반의 웹 애플리케이션 프로그래밍 기술이다. 웹을 만들때는 다양한 요청(request)과 응답(response)이 있고 규칙이 존재하는데 이러한 요청과 응답을 일일이 처리하기 힘들다. 서블릿은 이러한 웹 요청과 응답의 흐름을 간단한 메서드 호출만으로 체계적으로 다룰 수 있게 해주는 기술이다. 서블릿을 사용하지 않으면 아래의 리스트를 모두 구현해야...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/Servlet/",
        "teaser": null
      },{
        "title": "스레드와 스레드 풀",
        "excerpt":"스레드 스레드란 프로세스의 자원을 이용해서 실제로 작업을 수행하는 것 애플리케이션 코드를 하나하나 순차적으로 실행하는 것 자바 메인 메서드를 처음 실행하면 main이라는 이름의 스레드가 실행 스레드가 없다면 자바 애플리케이션 실행이 불가능함 스레드는 한번에 하나의 코드 라인만 수행 동시 처리가 필요하면 스레드를 추가로 생성 참고 클라이언트에서 요청이 들어온 경우 WAS와 연결을 해주는...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/Thread/",
        "teaser": null
      },{
        "title": "구 MVC 패턴과 프론트 컨트롤러",
        "excerpt":"구 MVC 패턴의 한계 MVC 패턴을 적용해 컨트롤러의 역할과 뷰 렌더링하는 역할을 구분하였지만 중복이 많고 필요하지 않은 코드가 많다. 포워드 중복 View로 이동하는 코드가 항상 중복 호출된다. RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath); dispatcher.forward(request, response); ViewPath 중복 유지보수가 어렵다. JSP가 아닌 thymeleaf 같은 다른 뷰로 변경 시 전체 코드를 변경해야 한다. String...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/FrontController/",
        "teaser": null
      },{
        "title": "MVC 패턴",
        "excerpt":"서블릿과 JSP의 한계 서블릿으로 개발을 하면 뷰 화면을 위해 HTML을 만드는 작업이 자바 코드에 섞여서 지저분하고 복잡하다. 이를 개선하기 위해 등장한 것이 JSP이다. JSP를 통해 자바에서 HTML을 사용하는 것이 아니라 HTML 코드 내에 중요한 부분에만 자바 코드를 써서 간결하게 작성할 수 있다. JSP를 사용하면서 HTML 작업이 깔끔해졌지만 자바 코드, 데이터를...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/MVCPattern/",
        "teaser": null
      },{
        "title": "요청 매핑 핸들러 어뎁터 구조",
        "excerpt":"요청 매핑 핸들러 어뎁터 구조 HTTP 메시지 컨버터는 어디서 사용되는지 알아보자. HTTP 메시지 컨버터는 애노테이션 기반의 컨트롤러, 즉 @RequestMapping을 처리하는 핸들러 어댑터인 RequestMappingHandlerAdapter(요청 매핑 헨들러 어댑터)와 관련이 있다. 아래 그림은 스프링 MVC 동작 과정에서 핸들러 어댑터 ↔ 컨트롤러 과정을 좀 더 세부화한 것이다. 핸들러 어댑터가 컨트롤러를 호출하기 전에 ArgumentResolver를 호출하고...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/RequestMappingHandlerAdapter/",
        "teaser": null
      },{
        "title": "디스패처 서블릿",
        "excerpt":"DispatcherServlet 스프링 MVC도 프론트 컨트롤러 패턴으로 구현하였으며 스프링 MVC의 프론트 컨트롤러가 디스패처 서블릿이다. 디스패처 서블릿은 스프링 MVC의 핵심이다. 프론트 컨트롤러와 관련된 내용 (링크) DispatcherServlet도 부모 클래스에서 HttpServlet을 상속받아서 사용하며 서블릿으로 동작한다. DispatcherServlet → FrameworkServlet → HttpServletBean → HttpServlet 스프링 부트는 DispatcherServlet을 서블릿으로 자동으로 등록하면서 모든 경로(urlPatterns=”/”)에 대해 매핑한다. DispatcherServlet 요청...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/DispatcherServlet/",
        "teaser": null
      },{
        "title": "HTTP 메시지 컨버터",
        "excerpt":"뷰 템플릿으로 HTML을 생성해서 응답할 때는 viewResolver가 view를 찾아서 반환한다. 그런데 HTTP API 처럼 JSON 데이터를 HTTP 바디에 직접 읽거나 쓰는 경우에는 어떤 원리로 JSON ↔ 자바 객체로 변환되는 것일까? 이에 대한 답은 HTTP 메시지 컨버터에 있다. HTTP 메시지 컨버터 HTTP 메시지 컨버터 인터페이스를 사용하면 JSON, String, Byte 타입으로 편리하게...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/HTTPMessageConverter/",
        "teaser": null
      },{
        "title": "로깅",
        "excerpt":"로깅 운영 시스템에서는 System.out.println()같은 시스템 콘솔 사용하지 않고 별도의 로깅 라이브러리를 사용해서 로그를 출력함 로깅 라이브러리 스프링 부트 라이브러리를 사용하면 스프링 부트 로깅 라이브러리(spring-boot-starter-logging) 포함 스프링 부트가 사용하는 기본 로깅 라이브러리 SLF4J Logback 로그 라이브러리는 Logback, Log4J, Log4J2 등등 수 많은 라이브러리가 존재 그것을 통합해 인터페이스로 제공하는 것이 SLF4J 라이브러리...","categories": ["SpringBoot"],
        "tags": ["SpringBoot"],
        "url": "/springboot/Logging/",
        "teaser": null
      },{
        "title": "PRG, Post/Redirect/Get",
        "excerpt":"PRG 패턴 PRG 패턴이란 웹 개발 패턴 중 자주 쓰이는 패턴으로 HTTP POST 요청에 대해 GET 방식의 웹페이지로 리다이렉트 시키는 패턴이다. PRG 패턴을 사용하게 된 이유는 아래 코드로 설명할 수 있다. 이 코드는 상품을 등록하고 상품 목록 페이지로 다시 돌아가는 코드이다. 이 코드에서는 오류가 있다. 상품을 등록을 완료하고 웹 브라우저의...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/PRG/",
        "teaser": null
      },{
        "title": "좋은 객체 지향 설계의 원칙: SOLID",
        "excerpt":"SOLID란, 클린코드로 유명한 로버트 마틴이 좋은 객체 지향 설계의 5가지 원칙을 정리한 것이다. SRP, OCP, LSP, ISP, DIP가 있는데 그 중 OCP와 DIP가 중요하다. SRP 단일 책임 원칙 (Single Responsibility Principle) 한 클래스는 하나의 책임만 가져야 한다. 여기서 하나의 책임이라는 말은 모호할 수 있다. 하나의 책임을 구분하는 중요한 기준은 변경이다....","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/SOLID/",
        "teaser": null
      },{
        "title": "스프링 컨테이너와 스프링 빈",
        "excerpt":"스프링 컨테이너 스프링 컨테이너란? 스프링 컨테이너란 스프링에서 자바 객체들을 관리하는 공간을 말한다. 여기서 자바 객체는 스프링 빈(Bean)을 의미한다. 즉, 스프링 컨테이너는 빈의 생성부터 소멸까지의 생명주기를 관리해주는 곳이다. 스프링 컨테이너의 종류에는 ApplicationContext와 BeanFactory가 있다. 하지만, BeanFactory를 직접 사용하는 경우는 거의 없으므로 일반적으로 ApplicationContext를 스프링 컨테이너라 한다. 스프링 컨테이너 생성 ApplicationContext는 인터페이스이다....","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/SpringContainerBean/",
        "teaser": null
      },{
        "title": "의존관계 주입 방법",
        "excerpt":"다양한 의존관계 주입 방법 생성자 주입 수정자 주입 (setter 주입) 필드 주입 일반 메서드 주입 생성자 주입 생성자를 통해서 의존 관계를 주입 받는 방법이고 현재 가장 권장하는 방법이다. 생성자 호출 시점에 1번만 호출되는 것이 보장되고 불변, 필수 의존관계에 사용된다. 또한, 생성자가 1개만 있으면 @Autowired를 생략해도 자동 주입 된다. (스프링 빈에만...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/DependencyInjection/",
        "teaser": null
      },{
        "title": "RestfulAPI 개발 시 주의할 점",
        "excerpt":"참고 Web Controller Package와 API Controller Package는 분리하는게 좋다 💡 API 요청/응답에 엔티티를 노출하지 않는게 좋다. API에 엔티티를 노출시킬 경우 발생하는 문제점 실무에서는 회원 엔티티를 위한 API가 다양하게 만들어지는데, 한 엔티티에 각각의 API를 위한 모든 요청 요구사항을 담기는 어렵다. 엔티티가 변경되면 API 스펙이 변한다. 따라서, API 요청 스펙에 맞추어 별도의...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Jpa","RestAPI"],
        "url": "/springboot/RestfulAPINotes/",
        "teaser": null
      },{
        "title": "페치 조인 (fetch join)",
        "excerpt":"💡 실무에서 정말 중요하다. 필수적으로 알아야 하는 내용! 페치 조인 페치 조인이란 JPQL에서 성능 최적화를 위해 제공하는 기능이며 연관된 엔티티나 컬렉션을 SQL 한 번에 함께 조회하는 기능이다. SQL 조인 종류 아니며 JPA에서만 사용한다. join fetch 명령어를 사용하며 사용법은 아래와 같다. [ LEFT [OUTER] | INNER ] JOIN FETCH 조인경로 엔티티...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-Fetch-Join/",
        "teaser": null
      },{
        "title": "컬렉션 조회 최적화",
        "excerpt":"컬렉션인 일대다 관계(OneToMany)를 조회하고, 최적화하는 방법을 알아보자. (*ToOne 보다 신경 쓸게 많다.) [예제] Order와 Member는 다대일 연관관계(양방향), Order와 Delivery는 다대일 연관관계(양방향)가 되어있고, Member와 Delivery는 지연 로딩이 설정되어 있다. 주문내역에서 추가로 주문한 상품 정보를 추가로 조회하자. Order 기준으로 컬렉션인 OrderItem 와 Item 이 필요하다. 엔티티를 DTO로 변환하면 마찬가지로 1 + N...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-JPA-Collections-Performance-Optimization/",
        "teaser": null
      },{
        "title": "JPA 조회 성능 최적화",
        "excerpt":"조회 성능 최적화 부분은 매우 중요하다. 실무에서 JPA를 사용하려면 100% 이해해야 한다. 페치 조인(fetch join) (링크) 페치 조인이란 JPQL에서 성능 최적화를 위해 제공하는 기능이다. 페치 조인은 JPA에만 있는 문법으로 SQL의 조인 종류와는 다르다. 페치 조인으로 데이터를 가져오면 지연로딩으로 설정되어 있어도 무시하고 프록시 객체가 아닌 진짜 객체를 가져온다. 예제. Order와 Member는...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-JPA-Performance-Optimization/",
        "teaser": null
      },{
        "title": "OSIV와 성능 최적화",
        "excerpt":"OSIV(Open Session In View) OSIV란 영속성 컨텍스트를 뷰까지 열어두는 기능이다. 영속성 컨텍스트가 유지되면 엔티티도 영속 상태로 유지된다. 뷰까지 영속성 컨텍스트가 살아있다면 뷰에서도 지연 로딩을 사용할 수가 있다. 하이버네이트에서는 OSIV(Open Session In View), JPA에서는 Open EntityManager In View라 한다. 하지만, 관례상 OSIV라 한다. OSIV를 알아야한다. 이것을 모르면 장애로 이어질 수 있다....","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-OSIV/",
        "teaser": null
      },{
        "title": "ORM과 JPA, Hibernate",
        "excerpt":"ORM ORM이란 Object(객체)와 DB의 테이블을 매핑하여 데디터를 객체화하는 기술을 말한다. ORM을 사용하면 개발자가 반복적인 SQL을 직접 작성하지 않아도 되므로 생산성이 높아지고 DBMS에 종속적이지 않다는 장점이 있다. 그러나, 쿼리가 복잡해지면 ORM으로 표현하는데 한계가 있고, 성능이 raw query에 비해 느리다는 단점이 있다. JPA JPA란 자바 ORM 기술에 대한 API 표준 명세를 의미한다....","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/ORMJPAHibernate/",
        "teaser": null
      },{
        "title": "영속성 컨텍스트",
        "excerpt":"영속성 컨텍스트 JPA를 이해하는데 가장 중요한 용어가 영속성 컨텍스트이다. 영속성 컨텍스트란 엔티티를 영구 저장하는 환경이라는 뜻이다. 엔티티 매니저로 엔티티를 저장하거나 조회하면 엔티티 매니저는 영속성 컨텍스트에 엔티티를 보관하고 관리한다. 영속성 컨텍스트는 애플리케이션과 DB 사이에서 객체를 보관하는 가상의 DB 같은 역할을 한다. 엔티티를 영속성 컨텍스트에 저장 entityManager.persist(entity); 영속성 컨텍스트는 눈에 보이는 개념이...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/PersistenceContext/",
        "teaser": null
      },{
        "title": "엔티티 매니저 팩토리와 엔티티 매니저",
        "excerpt":"개요 JPA가 제공하는 기능은 크게 두가지 이다. 엔티티(객체)와 테이블을 매핑하는 설계 부분 매핑한 엔티티를 실제 사용하는 부분 엔티티 매니저는 그 중 두번째, 매핑한 엔티티를 사용하는 부분과 관련된 용어이다. 엔티티 매니저 팩토리 엔티티 매니저 팩토리는 엔티티 매니저를 생성하는 공장이다. 비용이 비싸기 때문에 엔티티 매니저 팩토리는 애플리케이션 전체에서 딱 한 번만 생성하고...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/EntityManger/",
        "teaser": null
      },{
        "title": "플러시",
        "excerpt":"플러시란? 플러시(flush())는 영속성 컨텍스트의 변경 내용을 데이터베이스에 반영한다. 플러시를 실행하면 다음과 같은 일이 발생한다. 변경 감지가 동작해서 영속성 컨텍스트에 있는 모든 엔티티를 스냅샷과 비교하여 수정된 엔티티를 찾는다. 수정된 엔티티는 쓰기 지연 SQL 저장소에 등록한다. 쓰기 지연 SQL 저장소의 쿼리를 데이터베이스에 전송한다. (등록, 수정, 삭제 쿼리) 영속성 컨텍스트를 플러시하는 방법 참고...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/Flush/",
        "teaser": null
      },{
        "title": "연관관계의 주인과 mappedBy",
        "excerpt":"양방향 연관관계 @Entity public class Member { ... @ManyToOne @JoinColumn(name = \"TEAM_ID\") private Team team; } @Entity public class Team { ... @OneToMany(mappedBy = \"team\") // 초기화 시켜놓으면 add 할때 오류가 안나기 때문에 관례로 이렇게 쓴다 private List&lt;Member&gt; members = new ArrayList&lt;&gt;(); } // member가 연관관계의 주인 // 조회 Team...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/MappedBy/",
        "teaser": null
      },{
        "title": "JPA Auditing (공통 매핑 정보)",
        "excerpt":"@MappedSuperclass 공통 매핑 정보가 필요할 때 사용한다. 해당 어노테이션이 적용된 클래스는 테이블로 생성하지 않고 해당 클래스를 상속한 엔티티의 클래스로 데이터베이스 테이블이 생성된다. 직접 생성해서 사용할 일이 없으므로 추상 클래스 권장한다. 테이블과 관계 없고, 단순히 엔티티가 공통으로 사용하는 매핑 정보를 모으는 역할을 하며 주로 등록일, 수정일, 등록자, 수정자 같은 전체 엔티티에서...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-Auditing/",
        "teaser": null
      },{
        "title": "Querydsl 설정",
        "excerpt":"Querydsl 설정 springboot, gradle 버전에 따라 Querydsl 설정 방법이 많이 다르다. 주의하자! SpringBoot version: 2.7.3 gradle: 7.5 gradle.build // 1. querydsl version 정보 추가 buildscript { ext { queryDslVersion = \"5.0.0\" } } plugins { id 'org.springframework.boot' version '2.7.3' id 'io.spring.dependency-management' version '1.0.13.RELEASE' // 2. querydsl plugins 추가 id \"com.ewerk.gradle.plugins.querydsl\"...","categories": ["Jpa"],
        "tags": ["Querydsl","Jpa"],
        "url": "/jpa/JPA-Querydsl-Settings/",
        "teaser": null
      },{
        "title": "프로젝션(Projection), DTO로 조회하는 방법",
        "excerpt":"프로젝션 프로젝션이란 select 대상을 지정하는 것을 의미한다. 프로젝션 대상이 하나면 타입을 명확하게 지정할 수 있다. 그러나, 프로젝션 대상이 둘 이상이면 튜플이나 DTO로 조회해야 한다. 단일 프로젝션 조회 @Test void simpleProjection() { List&lt;String&gt; result = queryFactory .select(member.username) .from(member) .fetch(); } 프로젝션 대상이 여러개 - 튜플 조회 @Test void tupleProjection() { List&lt;Tuple&gt;...","categories": ["Jpa"],
        "tags": ["Querydsl","Jpa"],
        "url": "/jpa/JPA-Projection-DTO/",
        "teaser": null
      },{
        "title": "hashCode()와 equals()",
        "excerpt":"hashCode()와 equals()란? hashCode()와 equals()는 Object 클래스에 정의되어 있다. 그렇기 때문에 모든 객체는 Object 클래스에 정의된 hashCode()와 equals() 함수를 상속받고 있다. equals(Object obj) 매개변수로 객체의 참조변수를 받아서 비교하여 그 결과를 boolean으로 알려주는 역할을 한다. Object 클래스에 정의되어 있는 equals 메서드 public voolean equals(Object obj) { return (this==obj); } 두 객체의 같고...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/equalsAndHashCode/",
        "teaser": null
      },{
        "title": "체크 예외, 언체크 예외",
        "excerpt":"예외의 종류 에러 (Error) 예외 (Exception) 체크 예외 (Check Exception) 언체크 예외 (Uncheck Exception) 에러(Error) java.lang.Error 클래스의 하위 클래스들이다. 메모리 부족, 스택오버플로우 등과 같이 시스템이 비정상적인 상황인 경우에 사용한다. (프로그램 코드에 의해서 수습 될 수 없는 심각한 오류) 참고로 Error도 언체크 예외이다. 예외(Exception) java.lang.Exception 클래스의 하위 클래스들이다. 개발자가 예외를 대비해...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/CheckUncheckException/",
        "teaser": null
      },{
        "title": "인증과 인가",
        "excerpt":"인증과 인가란? 인증 (식별가능한 정보로) 서비스에 등록된 유저의 신원을 입증하는 과정 인가 권한에 대한 허가, 인증된 사용자에 대한 자원 접근 권한 확인 결국, 인증이 인가보다 선행되어야 한다. 인증의 방법 인증하기 Request Header 인증 유지하기 Browser 안전하게 인증하기 Server 효율적으로 인증하기 Token 다른 채널로 인증하기 OAuth HTTP는 무상태성이라는 것이 매우중요 서버는...","categories": ["Auth"],
        "tags": ["Auth","Web"],
        "url": "/auth/AuthenticationAuthorization/",
        "teaser": null
      },{
        "title": "OAuth 2.0",
        "excerpt":"웹 서핑을 하다보면 Google, Facebook 등의 소셜 로그인 기능을 쉽게 찾아볼 수 있다. 클릭 한 번으로 간편하게 로그인할 수 있으며 연동되는 애플리케이션에서 Google, Facebook 등이 제공하는 기능을 간편하게 사용할 수 있다는 장점이 있다. 이 때 사용되는 프로토콜이 바로 OAuth다. OAuth란 OAuth는 인터넷 사용자들이 비밀번호를 제공하지 않고 다른 웹사이트 상의 자신들의...","categories": ["Auth"],
        "tags": ["Auth","Web"],
        "url": "/auth/OAuth/",
        "teaser": null
      },{
        "title": "람다식(Lambda Expression)",
        "excerpt":"지네릭스(Generics)의 등장과 람다식(Lambda Expression)의 등장으로 인해 자바는 새로운 변화를 맞이했다. 그 중 람다식에 대해 알아보겠다. 람다식이란? 람다식(Lambda Expression)이란 메서드를 하나의 식으로 표현한 것이다. 람다식은 함수를 간략하면서도 명확한 식으로 표현할 수 있게 해준다. 메서드를 람다식으로 표현하면 메서드의 이름과 반환값이 없어지기 때문에, 람다식은 익명 함수라고도 한다. 람다식은 간결하면서도 이해하기 쉽다는 장점이 있다....","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/LambdaExpression/",
        "teaser": null
      },{
        "title": "빈 생명주기 콜백",
        "excerpt":"빈 생명주기 콜백 시작 데이터베이스 커넥션 풀이나, 네트워크 소켓처럼 애플리케이션 시작 시점에 필요한 연결을 미리 해두고, 애플리케이션 종료 시점에 연결을 모두 종료하는 작업을 진행하려면, 객체의 초기화와 종료 작업이 필요하다. 데이터베이스 커넥션에 대해 얘기한 이유는 빈 생명주기 콜백과 비슷하기 때문이다. 빈 생명주기 콜백도 시작과 안전한 종료를 위한 작업이 필요하다. 스프링 빈은...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/BeanLifeCycle/",
        "teaser": null
      },{
        "title": "내부 클래스",
        "excerpt":"내부 클래스란? 내부 클래스는 클래스 내에 선언된 클래스다. 클래스에 다른 클래스를 선언하는 이유는 두 클래스가 서로 긴밀한 관계에 있기 때문이다. 내부 클래스의 장점 내부 클래스에서 외부 클래스의 멤버들을 쉽게 접근할 수 있다. 코드의 복잡성을 줄일 수 있다. class A { ... } class B { ... } // 외부 클래스(outer...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-InnerClass/",
        "teaser": null
      },{
        "title": "지네릭스(Generics)",
        "excerpt":"지네릭스(Generics) 지네릭스는 컴파일 시 타입을 체크해주는 기능을 하며 객체의 타입 안정성을 높이고 형변환의 번거로운을 줄여준다. 컴파일 체크 컴파일 시 타입을 체크해주는 기능 (compile-time type check) - JDK 1.5 지네릭스 적용 전 ArrayList tvList = new ArrayList(); tvList.add(new Tv()); // OK tvList.add(new Audio()); // OK ArrayList는 Object 배열을 가지고 있으므로 모든...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-Generic/",
        "teaser": null
      },{
        "title": "빈 스코프",
        "excerpt":"빈 스코프란? 스프링 빈은 스프링 컨테이너의 시작과 함께 생성되고 스프링 컨테이너가 종료될 때 까지 유지된다. 이것은 스프링 빈이 기본적으로 싱글톤 스코프로 생성되기 때문이다. 스코프는 번역 그대로 빈이 존재할 수 있는 범위를 뜻한다. 스프링은 다양한 스코프를 지원한다. 싱글톤: 기본 스코프, 스프링 컨테이너의 시작과 종료까지 유지되는 가장 넓은 범위의 스코프이다. 프로토타입: 스프링...","categories": ["SpringBoot"],
        "tags": ["SpringBoot","Java"],
        "url": "/springboot/BeanScope/",
        "teaser": null
      },{
        "title": "연관관계 편의 메서드",
        "excerpt":"연관관계 편의 메서드는 양방향 연관관계일 경우에 해당된다. 연관관계 편의 메서드에 설명하기 위해 Member 객체와 Order 객체가 있고 이 둘은 양방향 연관관계라고 가정하자. Order 입장에선 다대일 관계이고 Member 입장에선 일대다 관계이다. 양방향 연관관계의 경우 각각 객체에 다른 객체를 참조할 수 있는 참조용 필드를 정의한다. // Member 엔티티 public class Member {...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/ConvenienceMethod/",
        "teaser": null
      },{
        "title": "연관 관계 매핑",
        "excerpt":"연관 관계를 매핑할 때 생각해야 할 것 3가지 방향: 단방향, 양방향 연관 관계의 주인: 양방향일 때, 연관 관계에서 관리 주체 다중성: 다대일(N:1), 일대다(1:N), 일대일(1:1), 다대다(N:M) 단방향, 양방향 DB 테이블은 외래 키 하나로 양 쪽 테이블 조인이 가능하다. 따라서, DB는 단방향, 양방향을 나눌 필요가 없다. 그러나, 객체는 참조용 필드가 있는 객체만...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPAMapping/",
        "teaser": null
      },{
        "title": "Mock 이란?",
        "excerpt":"Mock 이란? 가짜를 뜻한다. 진짜 객체와 비슷하게 동작하지만 프로그래머가 직접 그 객체의 행동을 관리하는 객체이다. 메소드가 return을 하기까지 어떠한 로직을 걸치는데 그 로직을 전부 구현하기에는 무리가 있을 때, 메소드가 return 하는 타입의 어떤 예측한 값이 나온다고 가정해서 전체적인 흐름을 테스트 할 때, mock이 사용된다. Mockito 란? Mock을 다루는 프레임워크의 종류로...","categories": ["TestCode"],
        "tags": ["TestCode"],
        "url": "/testcode/Mock/",
        "teaser": null
      },{
        "title": "변경 감지와 병합",
        "excerpt":"✨ 결론부터 말하면 병합(merge)은 사용하지 말고 변경 감지(Dirth Checking)를 사용하자. 변경 감지와 병합에 대해 알아보기 전에 먼저 준영속 엔티티에 대해 알아보자. 준영속 엔티티 준영속 엔티티란 영속성 컨텍스트가 더는 관리하지 않는 엔티티를 말한다. 영속성 컨텍스트가 관리하는 영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detached)된 엔티티이다. 여기서는 itemService.saveItem(book)에서 수정을 시도하는 Book 객체이다. Book 객체는...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-DirtyChecking-Merge/",
        "teaser": null
      },{
        "title": "영속성 전이(Cascade), 고아 객체",
        "excerpt":"영속성 전이란? 엔티티를 영속 상태로 만들 때 연관된 엔티티도 함께 영속 상태로 만들고 싶으면 영속성 전이 기능을 사용하면 된다. 영속성 전이를 Cascade라고도 한다. Cascade 옵션은 엔티티의 상태 변화를 전파시키는 옵션으로 만약 엔티티에 상태 변화가 있으면 연관되어 있는 엔티티에도 상태 변화를 전이시키는 옵션이다. 사용하는 이유? Cascade를 사용하는 이유를 설명하기 위해 다음과...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/Cascade/",
        "teaser": null
      },{
        "title": "Java, Optional",
        "excerpt":"Optional이란 Optional을 사용하면 null이 올 수 있는 값을 감싸서 참조하더라도 NPE가 발생하지 않도록 도와준다. Optional은 Java8 부터 지원한다. 참고 NPE(NullPointerException) 개발을 할 때 가장 많이 발생하는 예외 중 하나가 바로 NPE이다. null 여부를 검사하는 코드는 복잡하고 번거롭다. 그래서 null 대신 초기값을 사용하길 권장하기도 한다. Optional에서 제공하는 메서드 Optional 객체 생성...","categories": ["Java"],
        "tags": ["Java"],
        "url": "/java/Java-Optional/",
        "teaser": null
      },{
        "title": "테스트 환경 분리, @Transactional과 임베디드 DB",
        "excerpt":"테스트 환경을 분리해야 하는 이유 애플리케이션 실행 환경과 테스트 실행 환경을 분리하기 위해 트랜잭션과 임베디드 데이터베이스를 사용한다. 실행 환경을 분리하는 이유는 테스트 실행 시 데이터들이 현재의 테스트에 영향을 줄 수 있기 때문이다. 테스트 실행 시 중요한 점은 다음 두가지 이다. 테스트는 다른 테스트와 격리해야 한다. 테스트는 반복해서 실행할 수 있어야...","categories": ["TestCode"],
        "tags": ["TestCode","SpringBoot"],
        "url": "/testcode/TestCodeSettings/",
        "teaser": null
      },{
        "title": "준영속",
        "excerpt":"준영속 상태란 영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detached)된 것을 말한다. 준영속 상태의 엔티티는 영속성 컨텍스트에서 분리되었기 때문에 영속성 컨텍스트가 제공하는 기능을 사용하지 못한다. (Dirty Checking 등) 참고 영속 상태가 되는 경우 em.persist() 할 경우 em.find()를 했는데 1차 캐시에 데이터가 없어 DB에서 조회했을 때 준영속 상태로 만드는 방법 em.detach(entity): 특정 엔티티만...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/DetachedEndity/",
        "teaser": null
      },{
        "title": "CQS 패턴, CQRS 패턴",
        "excerpt":"CQS 패턴, CQRS 패턴에 대해 알아보기 전에 주요 용어인 커맨드와 쿼리에 대해 알아보자. 커맨드(Command) 명령(command)는 시스템의 상태를 변경하는 작업을 의미한다. 예를 들어, 데이터를 삽입, 수정, 삭제하는 작업이 명령에 해당된다. 명령은 주로 void 형태의 메서드로 구현하며 메서드 호출 후 시스템 상태가 변경된다. 쿼리(Query) 조회(Query)는 시스템의 상태를 조회하는 작업을 의미한다. 예를 들어,...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-CQS-CQRS-Pattern/",
        "teaser": null
      },{
        "title": "프록시, 즉시로딩과 지연로딩",
        "excerpt":"개요 객체는 데이터베이스에 저장되어 있으므로 연관된 객체를 탐색하기 어렵다. JPA에서 이 문제를 해결하기 위해 프록시 기술을 사용한다. 프록시를 사용하면 연관된 객체를 처음부터 DB에서 조회하는 것이 아니라 실제 사용하는 시점에 DB에서 조회할 수 있다. 하지만, 자주 함께 사용하는 객체들은 조인을 사용해서 함께 조회하는 것이 효과적이다. JPA는 즉시 로딩과 지연 로딩 두...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/Proxy/",
        "teaser": null
      },{
        "title": "값 타입",
        "excerpt":"개요 JPA의 데이터 타입을 크게 분류하면 엔티티 타입과 값 타입이 있다. 엔티티 타입 @Entity로 정의하는 객체 데이터가 변해도 식별자를 통해 추적 가능 예) 회원 엔티티의 키나 나이 값을 변경해도 식별자로 인식 가능 값 타입 int, Integer, String 처럼 단순히 값으로 사용하는 자바 기본 타입이나 객체를 의미 식별자가 없고 숫자나 문자...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/ValueType/",
        "teaser": null
      },{
        "title": "findById() vs getReferenceById() (feat. getOne())",
        "excerpt":"findById()와 getReferenceById()는 검색할 때 사용하며 비슷한 기능을 한다. 하지만 조회하는 기본 메커니즘이 다르다. findById() findById()는 실제 DB를 바로 조회해서 필요한 데이터를 가져온다. (EAGER) 당연히 반환되는 객체도 데이터가 매핑되어있는 실제 엔티티 객체이다. getReferenceById() getReferenceById()는 주어진 식별자를 가진 엔티티에 대한 참조를 반환한다. 이 메소드는 데이터베이스에 충돌하지 않고 항상 프록시를 반환한다. LAZY로 가져온...","categories": ["Jpa"],
        "tags": ["Jpa"],
        "url": "/jpa/JPA-findById-getReferenceById/",
        "teaser": null
      },{
        "title": "Spring Security",
        "excerpt":"Spring Security 적용하기 Spring Security 5.7 버전부터 기존에 사용하던 스프링 시큐리티 적용 방식과 많이 달라졌다. 이 부분에 대해 정리하기 위해 이 포스트를 작성하게 되었다. Spring Security와 관련된 포스트는 두번에 거쳐 작성할 예정이다. 이번 포스트는 Spring Security를 적용하는 방법에 대해 작성할 것이고 다음 포스트는 작성 스프링 시큐리티를 테스트 코드에 어떻게 적용할...","categories": ["SpringBoot"],
        "tags": ["SpringBoot"],
        "url": "/springboot/Spring-SpringSecurity/",
        "teaser": null
      },{
        "title": "JPA 목차",
        "excerpt":"JPA A to Z      ORM과 JPA, Hibernate   영속성 컨텍스트   엔티티 매니저 팩토리와 엔티티 매니저   플러시   준영속   연관 관계 매핑   연관관계 편의 메서드   연관관계의 주인과 mappedBy   JPA Auditing (공통 매핑 정보)   프록시, 즉시로딩과 지연로딩   영속성 전이(Cascade), 고아 객체   값 타입  ","categories": ["Series"],
        "tags": ["Jpa"],
        "url": "/series/JPASeries/",
        "teaser": null
      },{
        "title": "RestAPI with 스프링부트 목차",
        "excerpt":"RestAPI with 스프링부트 A to Z      REST API with SpringBoot(1)   REST API with SpringBoot(2)   REST API with SpringBoot(3)   REST API with SpringBoot(4)   스프링 HATEOAS   스프링 REST Docs  ","categories": ["Series"],
        "tags": ["SpringBoot","RestAPI"],
        "url": "/series/RestAPISeries/",
        "teaser": null
      },{
        "title": "스프링 MVC",
        "excerpt":"스프링 MVC A to Z      서블릿   쓰레드와 쓰레드 풀   MVC 패턴   구 MVC 패턴과 프론트 컨트롤러   디스패처 서블릿   HTTP 메시지 컨버터   요청 매핑 핸들러 어댑터 구조   PRG Post/Redirect/Get  ","categories": ["Series"],
        "tags": ["SpringBoot"],
        "url": "/series/SpringMvcSeries/",
        "teaser": null
      },{
        "title": "스프링 기본원리 목차",
        "excerpt":"스프링 기본 원리 A to Z      좋은 객체 지향 설계의 원칙: SOLID   DIP, OCP와 의존관계 주입(DI)   IoC와 DI   스프링 컨테이너와 스프링 빈   싱글톤 컨테이너   컴포넌트 스캔   의존관계 주입 방법   빈 생명주기 콜백   빈 스코프  ","categories": ["Series"],
        "tags": ["SpringBoot"],
        "url": "/series/SpringSeries/",
        "teaser": null
      }]
