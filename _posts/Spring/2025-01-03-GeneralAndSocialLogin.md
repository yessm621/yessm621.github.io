---
title: "Spring Security 일반 로그인 + 소셜 로그인(Security6.x, RestAPI)"
categories:
  - Spring
tags:
  - Security 6.x
  - RestAPI
toc: true
toc_sticky: true
---
## 개요

Spring Security6.x 버전을 사용해서 일반 로그인과 OAuth2를 사용하는 소셜 로그인을 구현해보았다. RestAPI 형식으로 개발하였다. JWT는 0.12.3 버전을 사용한다. 응답값에 대한 결과도 공통 응답 형식을 구현하였다.

## 동작 원리

일반 로그인과 소셜 로그인의 동작 원리를 알아보자.

### 일반 로그인 동작 원리

![1](https://github.com/user-attachments/assets/4165c689-6109-47e3-baed-5b6e797f4a1d)

- 회원가입
- 로그인 (인증): 로그인 요청을 받은 후 JWT 토큰을 생성하여 응답한다.
    - UsernamePasswordAuthenticationFilter를 통해 회원을 검증하는 로직을 작성한다.
    - AuthenticationManager 내부에 아이디와 비밀번호를 넘겨 로그인 검증을 진행한다.
    - SuccessfulAuth 메서드를 통해서 로그인이 성공하면 JWT 토큰을 만들어 응답한다.
- 경로 접근 (인가): Jwt Filter를 통해 요청의 헤더에서 JWT를 찾아 검증을 하고 일시적 요청에 대한 Session을 생성한다. (생성된 세션은 요청이 끝나면 소멸됨)
    - JWT Token을 클라이언트가 보내면 JWT Filter에서 토큰을 검증한다.
    - 검증에 성공시 SecurityContextHolder Session에서 임의의 세션을 만든다.
    - 만들어진 세션은 인가 작업이 필요한 경로에 접근할 때 사용된다.

### 소셜 로그인 동작 원리 (OAuth2 로그인)

![2](https://github.com/user-attachments/assets/2b8e6d85-3652-4b64-b497-3d861b69c07b)

- 소셜 로그인 시도
    - OAuth2AuthorizationRequestRedirectFilter: 아래와 같은 주소로 요청이 오면 해당 필터가 요청을 잡아 처리한다.
        
        ```
        /oauth2/authorization/서비스명
        
        /oauth2/authorization/naver
        /oauth2/authorization/google
        ```
        
    - 인증 서버에서 로그인이 성공하면 미리 설정해놓은 경로로 Code와 함께 리다이렉트 한다.
- 로그인 성공 리다이렉트
    - OAuth2LoginAuthenticationFilter: 외부 인증 서버에 설정할 redirect_uri, 아래와 같은 주소로 요청이 오면 해당 필터가 요청을 잡아 처리한다.
        
        ```
        /login/oauth2/code/서비스명
        
        /login/oauth2/code/naver
        /login/oauth2/code/google
        ```
        
    - OAuth2LoginAuthenticationProvider에 의해서 Code를 꺼낸다. Code로 Access Token을 발급 받고 Access Token으로 사용자 정보를 획득한다.
    - 획득한 사용자 정보를 OAuth2User에 담아 로그인을 진행하게 된다.
    - 로그인에 성공하게 되면 로그인 핸들러가 동작하게 되는데 그때 JWT를 발급해서 클라이언트에 보내준다.
- JWTFilter: JWT가 유효한지 검증

.

.

아래 그림은 모든 책임을 백엔드가 맡을 경우의 흐름이다. (우리가 구현할 백엔드의 흐름이다.)

![3](https://github.com/user-attachments/assets/1c767ba1-5784-4495-bbbe-2b0d577da5f0)

- 프론트가 백엔드에게 하이퍼링크로 요청한다. (예. http://localhost:8080/oauth2/authorization/naver)
- 백엔드에서 로그인 요청 로직 → Code 발급 → Code로 토큰 요청 → 토큰 발급 → 토큰으로 유저 요청 → 사용자 정보 발급 → 사용자 정보 확인 후 JWT 발급
- 발급한 JWT를 프론트로 전달
    - JWT 토큰은 Access Token과 Refresh Token을 발급하며 Refresh Token은 Access Token을 재발급하기 위한 용도로 사용된다.
    - Access Token과 Refresh Token의 저장 위치는 다음과 같다.
        - Access Token: 로컬 스토리지
        - Refresh Token: 쿠키

## 프로젝트 환경

### 버전 및 의존성

- Spring Boot 3.2.11
- Security 6.2.7
- JWT 0.12.3
- OAuth2 Client
- Lombok
- Spring Data JPA - MariaDB (Docker 사용)
- IntelliJ Ultimate

DB의 경우 Docker를 이용해 MariaDB를 사용했다. 관련 내용은 다음 [링크](https://yessm621.github.io/architecture/DockerEx/)를 참고하면 된다.

### build.gradle 의존성 추가

```
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-security'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
	runtimeOnly 'org.mariadb.jdbc:mariadb-java-client'

	dependencies {
		implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
		implementation 'io.jsonwebtoken:jjwt-impl:0.12.3'
		implementation 'io.jsonwebtoken:jjwt-jackson:0.12.3'
	}

	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```

### application.properties

```
spring.application.name=security
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.url=jdbc:mariadb://localhost:3306/database이름?useSSL=false&useUnicode=true&serverTimezone=Asia/Seoul
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=create
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

spring.jwt.secret=

#naver registration
spring.security.oauth2.client.registration.naver.client-name=naver
spring.security.oauth2.client.registration.naver.client-id=
spring.security.oauth2.client.registration.naver.client-secret=
spring.security.oauth2.client.registration.naver.redirect-uri=http://localhost:8080/login/oauth2/code/naver
spring.security.oauth2.client.registration.naver.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.naver.scope=name,email

#naver provider
spring.security.oauth2.client.provider.naver.authorization-uri=https://nid.naver.com/oauth2.0/authorize
spring.security.oauth2.client.provider.naver.token-uri=https://nid.naver.com/oauth2.0/token
spring.security.oauth2.client.provider.naver.user-info-uri=https://openapi.naver.com/v1/nid/me
spring.security.oauth2.client.provider.naver.user-name-attribute=response

#google registration
spring.security.oauth2.client.registration.google.client-name=google
spring.security.oauth2.client.registration.google.client-id=
spring.security.oauth2.client.registration.google.client-secret=
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google
spring.security.oauth2.client.registration.google.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.google.scope=profile,email
```

- spring.jpa.hibernate.ddl-auto: 개발, 테스트 단계에서는 create로 해도 되지만 이후 운영단계에서는 none으로 설정하는 것이 좋다.
- spring.jwt.secret: JWT를 생성할 때 필요한 키 값으로 되도록 길게 만들고 외부에 노출하지 않아야 한다.
- OAuth2를 사용하면서 필요한 환경설정을 추가했다.
    - registration: 외부 서비스에서 우리 서비스를 특정하기 위해 등록하는 정보이다. (필수로 입력해야 함)
    - provider

## 엔티티 작성

```java
package com.study.security.entity;

@Entity
@Table(name = "Users")
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String name;
    private String provider; //출처 (예. naver, google..)
    private String providerId;
    @Enumerated(EnumType.STRING)
    private UserRole role; //enum 사용
    private String refresh; //refresh token 저장
    private String expiration; //refresh token 만료일

    protected User() {
    }
    
    //다른 클래스에서 생성자를 사용할 수 없도록 private
    private User(String username, String password, String name, String provider, String providerId, UserRole role, String refresh, String expiration) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.provider = provider;
        this.providerId = providerId;
        this.role = role;
        this.refresh = refresh;
        this.expiration = expiration;
    }
    
    //정적 팩토리 메서드
    public static User createUser(String username, UserRole role) {
        User user = new User();
        user.username = username;
        user.role = role;
        return user;
    }

    public static User createUser(String username, String password, UserRole role) {
        User user = new User();
        user.username = username;
        user.password = password;
        user.role = role;
        return user;
    }

    public static User createUser(String email, String name, UserRole role, String provider, String providerId) {
        User user = new User();
        user.username = email;
        user.name = name;
        user.role = role;
        user.provider = provider;
        user.providerId = providerId;
        return user;
    }
    
    //dirty checking 사용
    public void updateUser(String email, String name) {
        this.username = email;
        this.name = name;
    }

    public void updateRefresh(String refresh, String expiration) {
        this.refresh = refresh;
        this.expiration = expiration;
    }
}
```

- 가장 먼저 User 엔티티를 작성했다.
- User 엔티티를 생성할 땐 생성자를 사용하지 않고 **정적 팩토리 메서드**를 사용해서 생성할 수 있도록 했다.
- **변경감지(dirty checking)**을 사용해서 User 엔티티를 수정한다.

.

.

```java
package com.study.security.entity;

@Getter
@AllArgsConstructor
public enum UserRole {

    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private final String key;
}
```

```java
package com.study.security.repository;

public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByUsername(String username);

    User findByUsername(String username);
}
```

## 공통 응답 처리

API를 반환할 때 성공, 실패에 대한 응답 처리 기능은 다음 [링크](https://yessm621.github.io/spring/ControllerAdvice/)에 작성해두었다. 이를 참고하자.

## 회원가입

일반 로그인에 대한 회원가입을 진행할 때 아래와 같은 형식으로 요청한다.

```json
POST /join
Accept: application/json

//Request
{
    "username": "user",
    "password": "1234"
}
```

.

.

회원가입과 관련된 코드는 아래와 같다.

```java
package com.study.security.config;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(auth -> auth.disable())
                .formLogin(auth -> auth.disable())
                .httpBasic(auth -> auth.disable());

        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/join", "/login").permitAll()
                        .anyRequest().authenticated());

        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
```

- 회원가입 시 password를 암호화하기 위해 BCryptPasswordEncoder를 스프링 빈으로 등록한다.
- CSRF 비활성화: REST API에서는 주로 Stateless 환경을 사용하므로 CSRF 방어가 필요하지 않다.
- SessionCreationPolicy.STATELESS: 세션을 STATELESS(무결성) 상태로 설정한다.

.

.

```java
package com.study.security.dto;

@Data
public class JoinDto {

    private String username;
    private String password;
}
```

```java
package com.study.security.service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void join(JoinDto joinDto) {
        String username = joinDto.getUsername();
        String password = joinDto.getPassword();

        Boolean isExist = userRepository.existsByUsername(username);
        if (isExist) {
            throw new ApiException(ErrorCode.ALREADY_EXIST_USERNAME);
        }

        User user = User.createUser(username, bCryptPasswordEncoder.encode(password), UserRole.USER);
        userRepository.save(user);
    }
}
```

- 회원가입 시 existsByUsername(String username)을 통해 이미 존재하는 사용자 아이디면 에러를 발생 시킨다. 처음 회원가입하는 사용자 아이디면 패스워드를 암호화하여 DB에 저장한다.

```java
package com.study.security.controller;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<ApiResponse> join(@RequestBody JoinDto joinDto) {
        userService.join(joinDto);
        return ResponseEntity.ok(ApiResponse.successWithNoContent());
    }
}
```

## JWT

JWT는 Header.Payload.Signature 구조로 이루어져 있다. 각 요소는 다음 기능을 수행한다.

- Header
    - JWT임을 명시
    - 사용된 암호화 알고리즘
- Payload
    - 정보
- Signature
    - 암호화알고리즘((BASE64(Header))+(BASE64(Payload)) + 암호화키)

JWT의 특징은 내부 정보를 단순 BASE64 방식으로 인코딩하기 때문에 외부에서 쉽게 디코딩 할 수 있다. JWT는 외부에서 열람해도 되는 정보를 담아야하며, 토큰 자체의 발급처를 확인하기 위해서 사용한다.

이번 프로젝트에서는 JWT 암호화 방식은 양방향 대칭키 방식을 사용했다. (HS256)

.

.

```java
package com.study.security.jwt;

@Component
public class JwtUtil {

    private SecretKey secretKey;

    public JwtUtil(@Value("${spring.jwt.secret}") String secretKey) {
        this.secretKey = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String getUsername(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    }

    public String getRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

    public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public String createJwt(String category, String username, String role, Long expiredMs) {
        return Jwts.builder()
                .claim("category", category)
                .claim("username", username)
                .claim("role", role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }
}
```

- JWT와 관련된 util 클래스이다.
    - JWT를 생성하는 코드
    - token을 통해 username, role, category를 가져오는 코드
    - 여기서 category는 access/refresh로 구분 된다.
- @Value("${spring.jwt.secret}"): 앞서 application.properties에 작성한 spring.jwt.secret 값을 가져온다.

.

.

```java
package com.study.security.jwt;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = authorization.split(" ")[1];
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(accessToken);
        if (!category.equals("access")) {
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String username = jwtUtil.getUsername(accessToken);
        String role = jwtUtil.getRole(accessToken);

        User user = User.createUser(username, UserRole.valueOf(role));

        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
```

- JwtFilter: Access Token이 유효한지 확인하는 필터이다.
- 헤더에 있는 Access Token을 가져와 유효성을 검증한다.
- Access Token이 유효하면 토큰의 username, role을 가져와 User를 생성하고 이를 CustomUserDetails에 넣어준다.

## 일반 로그인

일반 로그인의 동작 흐름을 생각하며 코드를 작성한다.

![4](https://github.com/user-attachments/assets/be3b4eb4-3e50-4dff-84f3-70c29eb0074a)

.

.

```java
package com.study.security.dto;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole().name();
            }
        });
        return collection;
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
```

- Spring Security에서 제공하는 UserDetails를 사용하여 사용자 인증을 진행할 수 있다. 우리는 UserDetails를 커스텀해서 사용자 정보를 받아온다.

.

.

```java
package com.study.security.service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ApiException(ErrorCode.NOT_FOUND_EXCEPTION, "아이디를 찾을 수 없습니다.");
        }
        return new CustomUserDetails(user);
    }
}
```

- 마찬가지로 Spring Security에서 제공하는 UserDetailsService를 커스텀하여 작성했다.

.

.

```java
package com.study.security.dto;

@Data
@AllArgsConstructor
public class TokenDto {

    private String accessToken;

    public static TokenDto toDto(String accessToken) {
        return new TokenDto(accessToken);
    }
}
```

- 로그인 성공 시 Access Token을 반환하기 위한 Dto이다.

.

.

```java
package com.study.security.util;

public class CookieUtil {
    public static Cookie createCookie(String key, String token, int expiredS) {
        Cookie cookie = new Cookie(key, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(expiredS);
        return cookie;
    }
}
```

- Cookie를 생성하는 클래스이다. 여러가지 설정이 있지만 가장 중요한 httpOnly 설정을 주목하자.
- `httpOnly` 설정은 보안상 중요한 설정이다. 반드시 true로 설정하도록 하자.

.

.

```java
package com.study.security.jwt;

@RequiredArgsConstructor
public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        LoginDto loginDto = null;
        try {
            loginDto = objectMapper.readValue(StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8), LoginDto.class);
        } catch (IOException e) {
            throw new ApiException(ErrorCode.ACCESS_DENIED_EXCEPTION);
        }

        String username = loginDto.getUsername();
        String password = loginDto.getPassword();

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String username = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        TokenDto tokenDto = TokenDto.toDto(access);
        response.addCookie(CookieUtil.createCookie("refresh", refresh, 86_400));
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(tokenDto)));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        ErrorMessage errorMessage = ErrorMessage.create(ErrorCode.ACCESS_DENIED_EXCEPTION.getCode(), "로그인에 실패하였습니다.");
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.fail(errorMessage)));
    }

    @Data
    private static class LoginDto {
        String username;
        String password;
    }
}
```

- attemptAuthentication 메서드를 실행해서 성공하면 successfulAuthentication, 실패하면 unsuccessfulAuthentication 메서드를 실행한다.
- 로그인이 성공하면 successfulAuthentication 메서드를 실행한다.
    - 응답 시 json 데이터에 access token을 담아 반환한다.
    - Refresh Token은 쿠키에 담아 반환한다. 이때 쿠키는 httpOnly 설정이 되있다. (CookieUtil 참고)
- 로그인이 실패하면 unsuccessfulAuthentication 메서드를 실행한다.

.

.

```java
package com.study.security.config;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(auth -> auth.disable())
                .formLogin(auth -> auth.disable())
                .httpBasic(auth -> auth.disable());

        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/join", "/login").permitAll()
                        .anyRequest().authenticated());

        http
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterAt(new CustomLoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, objectMapper), UsernamePasswordAuthenticationFilter.class);

        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
```

- JwtFilter는 CustomLoginFilter 이전에 실행된다.
- CustomLoginFilter는 로그인 요청을 처리하며 JWT를 생성하여 반환한다.

## 소셜 로그인 (OAuth2)

우리는 미리 application.properties에 OAuth2 소셜 로그인을 위한 변수 설정을 마쳤다.

.

.

소셜 로그인의 동작 흐름을 생각하며 코드를 작성한다.

![5](https://github.com/user-attachments/assets/84ab7bc1-7fab-4d57-ba29-d17a8261f482)

.

.

소셜 로그인 시 네이버와 구글을 사용한다.

- 네이버 소셜 로그인 신청([링크](https://www.devyummi.com/page?id=66936425054c1c47e044cd57)): 네이버 개발자 센터 → 네이버 로그인 API

![6](https://github.com/user-attachments/assets/b9c2c4ad-d447-4182-9f0f-805cdf782009)

![7](https://github.com/user-attachments/assets/83f55fc0-0946-4fff-826a-73f4bb420a6e)

![8](https://github.com/user-attachments/assets/9c389115-ed78-40ae-8d70-fc2c48e36277)

.

.

- 구글 소셜 로그인 신청([링크](https://www.devyummi.com/page?id=669365e370d4f58bd7cbed16)): 사용자 인증 정보 → OAuth 동의 화면/사용자 인증 정보

![9](https://github.com/user-attachments/assets/1478cd2a-2c83-424a-81b9-0c9099ffed79)

![10](https://github.com/user-attachments/assets/3e4476aa-eda9-496d-9ce8-bf3689ee1ae7)

### OAuth2Response

소셜 로그인 요청 시 네이버와 구글의 데이터 형식이 다르다. 이를 각각 받기 위해 인터페이스를 생성하고 이를 구현하도록 만들 것이다.

```java
package com.study.security.oauth2;

public interface OAuth2Response {

    //제공자 (Ex. naver, google, ...)
    String getProvider();
    //제공자에서 발급해주는 아이디(번호)
    String getProviderId();
    //이메일
    String getEmail();
    //사용자 실명 (설정한 이름)
    String getName();
}
```

```java
package com.study.security.oauth2;

public class NaverResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {
        this.attribute = (Map<String, Object>) attribute.get("response");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }
}
```

```java
package com.study.security.oauth2;

public class GoogleResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    public GoogleResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
    }

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getProviderId() {
        return attribute.get("sub").toString();
    }

    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }
}
```

```java
package com.study.security.oauth2;

@AllArgsConstructor
public class CustomOAuth2User implements OAuth2User {

    private final UserDto userDto;

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return userDto.getRole();
            }
        });
        return collection;
    }

    @Override
    public String getName() {
        return userDto.getName();
    }

    public String getUsername() {
        return userDto.getUsername();
    }
}
```

```java
package com.study.security.service;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }
        
        //리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듬
        String username = oAuth2Response.getEmail();
        User existData = userRepository.findByUsername(username);
        if (existData == null) {
            User user = User.createUser(oAuth2Response.getEmail(), oAuth2Response.getName(), UserRole.USER, oAuth2Response.getProvider(), oAuth2Response.getProviderId());
            userRepository.save(user);

            UserDto userDto = UserDto.toDto(username, oAuth2Response.getName(), "USER");

            return new CustomOAuth2User(userDto);
        } else {
            existData.updateUser(oAuth2Response.getEmail(), oAuth2Response.getName());

            UserDto userDto = UserDto.toDto(username, oAuth2Response.getName(), "USER");

            return new CustomOAuth2User(userDto);
        }
    }
}
```

- 로그인한적이 없으면 새로운 User를 생성하여 CustomOAuth2User를 반환한다.

### OAuth2 로그인 성공 시 Handler

```java
package com.study.security.oauth2;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final ReissueService reissueService;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        String username = customOAuth2User.getUsername();
        String name = customOAuth2User.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createJwt("access", username, role, 60 * 60 * 60L);
        String refresh = jwtUtil.createJwt("refresh", username, role, 86400_000L);

        reissueService.addRefresh(username, refresh, 86400_000L);

        response.addCookie(CookieUtil.createCookie("Authorization", access, 600));
        response.addCookie(CookieUtil.createCookie("refresh", refresh, 86_400));

        String encodedName = URLEncoder.encode(name, "UTF-8");
        response.sendRedirect("http://localhost:3000/oauth2-jwt-header?name=" + encodedName);
    }
}
```

- AccessToken과 Refresh Token을 생성하고 쿠키에 담아 전달한다.
- Refresh Token은 DB에 저장한다.
- 소셜 로그인에 성공하면 클라이언트 측으로 redirect 한다. 이때 **/oauth2-jwt-header** 주소로 redirect 하는데 이에 대한 설명은 아래에서 설명하겠다.

### AccessToken을 Local Storage에 저장

CustomOAuth2SuccessHandler 클래스에서 AccessToken과 Refresh Token을 쿠키로 전달했다. 쿠키로 전달된 AccessToken은 CSRF 공격의 위험성이 존재하기 때문에 쿠키에 계속 보관할 수 없다. 따라서 로컬 스토리지에 보관해야하는데 자바스크립트에서 httpOnly 쿠키에 접근할 수 없기 때문에 프론트엔드에서 백엔드로 다시 요청하여 백엔드는 httpOnly 쿠키의 값을 헤더에 넣어 전송하고 프론트엔드는 응답받은 헤더의 액세스 토큰을 로컬 스토리지에 저장한다.

.

.

이와 관련된 코드가 바로 /oauth2-jwt-header에 대한 요청이다.

```java
package com.study.security.controller;

@RestController
@RequiredArgsConstructor
public class OAuth2Controller {

    private final OAuth2Service oAuth2Service;

    @PostMapping("/oauth2-jwt-header")
    public ResponseEntity<ApiResponse> oAuth2JwtHeader(HttpServletRequest request, HttpServletResponse response) {
        return oAuth2Service.oauth2JwtHeaderSet(request, response);
    }
}
```

.

.

쿠키에 있는 Access Token을 Header로 옮겨 전달한다. (쿠키에 있던 Access Token은 삭제한다.)

```java
package com.study.security.service;

@Service
public class OAuth2Service {

    public ResponseEntity<ApiResponse> oauth2JwtHeaderSet(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        String access = null;

        if (cookies == null) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION);
        }
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("Authorization")) {
                access = cookie.getValue();
            }
        }

        if (access == null) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "토큰이 없습니다.");
        }

        response.addCookie(CookieUtil.createCookie("Authorization", null, 0));
        response.addHeader("Authorization", "Bearer " + access);
        response.setStatus(HttpServletResponse.SC_OK);

        return ResponseEntity.ok(ApiResponse.successWithNoContent());
    }

```

- 쿠키에 있는 Access Token을 읽어 Header에 넣어준다.
- 이제 프론트엔드 JS에서 Header에 접근할 수 있게 된다.
- 프론트엔드에서 Header로 받은 Access Token을 로컬 스토리지에 저장한다.

## CORS 설정

```java
package com.study.security.config;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    ...

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        ...

        //cors 설정 추가
        http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(request -> {
                    CorsConfiguration configuration = new CorsConfiguration();

                    configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                    configuration.setAllowedMethods(Collections.singletonList("GET", "POST", "PUT", "DELETE"));
                    configuration.setAllowCredentials(true);
                    configuration.setAllowedHeaders(Collections.singletonList("Authorization", "Content-Type", "X-Requested-With", "Set-Cookie"));
                    configuration.setMaxAge(3600L);
                    configuration.setExposedHeaders(Collections.singletonList("access"));

                    return configuration;
                }));

        return http.build();
    }
}
```

> **참고** CORS란?
>
CORS(Cross-Origin Resource sharing, 교차-출처  리소스 공유)란 다른 출처간의 자원을 공유하는 정책을 말한다. 즉, 도메인이 다른 2개의 사이트가 리소스에 접근할 수 있게하는 보안 매커니즘이다.
>
주로 프론트에서 서버로 API 요청을 할 때 발생한다.
>

.

.

OAuth2까지 진행한 SecurityConfig

```java
package com.study.security.config;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
    private final ReissueService reissueService;
    private final UserRepository userRepository;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(auth -> auth.disable())
                .formLogin(auth -> auth.disable())
                .httpBasic(auth -> auth.disable());

        http
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customOAuth2SuccessHandler)
                );

        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/join", "/login",
                                "/oauth2-jwt-header", "/reissue").permitAll()
                        .anyRequest().authenticated());

        http
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        http.exceptionHandling((exception) ->
                exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.setCharacterEncoding("utf-8");
                            ErrorMessage errorMessage = ErrorMessage.create(ErrorCode.ACCESS_DENIED_EXCEPTION.getCode(), "인증되지 않은 사용자입니다.");
                            response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.fail(errorMessage)));
                        }));

        http
                .addFilterAt(new CustomLoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, objectMapper, reissueService),
                        UsernamePasswordAuthenticationFilter.class);

        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(request -> {
                    CorsConfiguration configuration = new CorsConfiguration();

                    configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                    configuration.setAllowedMethods(Collections.singletonList("*"));
                    configuration.setAllowCredentials(true);
                    configuration.setAllowedHeaders(Collections.singletonList("*"));
                    configuration.setMaxAge(3600L);
                    configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                    return configuration;
                }));

        return http.build();
    }
}
```

## Refresh Token 재발급

Access Token이 만료되었을 때 Refresh Token을 사용하여 재발급 받는다. 이때 보안성을 강화하기 위해 Refresh Rotate를 사용했다.

`Refresh Rotate`는 Reissue 엔드포인트에서 Refresh Token을 받아 Access Token 갱신 시 Refresh Token도 함께 갱신하는 방법이다.

![21](https://github.com/user-attachments/assets/dbec892c-e9a4-474a-bff1-8ffac7bc664f)

.

```java
package com.study.security.controller;

@RestController
@RequiredArgsConstructor
public class ReissueController {

    private final ReissueService reissueService;

    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse> reissue(HttpServletRequest request, HttpServletResponse response) {
        TokenDto token = reissueService.reissue(request, response);
        return ResponseEntity.ok(ApiResponse.success(token));
    }
}
```

```java
package com.study.security.service;

@Service
@Transactional
@RequiredArgsConstructor
public class ReissueService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public TokenDto reissue(HttpServletRequest request, HttpServletResponse response) {
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
            }
        }

        if (refresh == null) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "Refresh Token이 없습니다.");
        }

        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "Refresh Token이 만료되었습니다.");
        }

        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "Refresh Token이 아닙니다.");
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);

        String refreshToken = userRepository.findByUsername(username).getRefresh();
        if (!refreshToken.equals(refresh)) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "올바른 Refresh Token이 아닙니다.");
        }

        String newAccess = jwtUtil.createJwt("access", username, role, 600_000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400_000L);

        addRefresh(username, newRefresh, 86400_000L);

        TokenDto tokenDto = TokenDto.toDto(newAccess);
        response.addCookie(CookieUtil.createCookie("refresh", newRefresh, 86_400));

        return tokenDto;
    }

    public void addRefresh(String username, String refresh, Long expiredMs) {
        Date date = new Date(System.currentTimeMillis() + expiredMs);
        User user = userRepository.findByUsername(username);
        user.updateRefresh(refresh, date.toString());
    }
}
```

- Refresh Token의 유효성을 검사 후 새로운 Access Token과 Refresh Token을 발급받는다.

## 로그아웃

```java
package com.study.security.jwt;

@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

    private final JwtUtil jwtUtil;
    private final ReissueService reissueService;
    private final UserRepository userRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^\\/logout$")) {
            filterChain.doFilter(request, response);
            return;
        }

        String requestMethod = request.getMethod();
        if (!requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
            }
        }

        if (refresh == null) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "Refresh Token이 없습니다.");
        }

        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "Refresh Token이 만료되었습니다.");
        }

        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            throw new ApiException(ErrorCode.TOKEN_EXCEPTION, "Refresh Token이 아닙니다.");
        }

        String username = jwtUtil.getUsername(refresh);
        Boolean isExist = userRepository.existsByUsername(username);
        if (!isExist) {
            throw new ApiException(ErrorCode.NOT_FOUND_EXCEPTION, "사용자가 존재하지 않습니다.");
        }

        reissueService.addRefresh(username, null, 0L);

        Cookie cookie = CookieUtil.createCookie("refresh", null, 0);

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
```

```java
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
    ...

    //추가
    http
            .addFilterBefore(new CustomLogoutFilter(jwtUtil, reissueService, userRepository), LogoutFilter.class);
       
    ...
    
    return http.build();
}
```

## 일반 로그인 + 소셜 로그인 테스트

### 일반 로그인 테스트

**회원가입**

![11](https://github.com/user-attachments/assets/98007577-73f3-41a4-acc9-e8cadc464fad)

.

**Login 테스트**

![12](https://github.com/user-attachments/assets/3226f4a8-c7c5-47bc-97eb-aa9683dd46f3)

![13](https://github.com/user-attachments/assets/80dae5f7-aa5c-4841-8a69-3469c2707af8)

.

**Refresh Token 재발급**

![15](https://github.com/user-attachments/assets/96b6c87d-9809-4d58-a9a2-aaa413f3dcb7)

![16](https://github.com/user-attachments/assets/ff2045e1-630f-47ec-a03d-59e507a890b3)

.

### 소셜 로그인 테스트

![17](https://github.com/user-attachments/assets/e99d5285-74bf-4ca2-b4d6-3436a7bbd295)

![18](https://github.com/user-attachments/assets/bb336592-2665-4a7f-8653-d3df35fa9cd8)

![19](https://github.com/user-attachments/assets/e03c08f4-1c95-496d-9b05-95ece1f5b1c5)

![20](https://github.com/user-attachments/assets/0be151d5-c7fc-4bd6-b15f-e680f68fdb0f)

## Github 코드

[Github 코드 참고](https://github.com/yessm621/spring-security/commit/e534d4f74c3643b621418eafcfff3a7d08c69431)
