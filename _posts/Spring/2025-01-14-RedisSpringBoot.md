---
title: "Spring Boot에서 Redis 사용하기"
categories:
  - Spring
tags:
  - Redis
toc: true
toc_sticky: true
---
## 개요

Spring Boot에서 Redis를 언제, 어디서 사용하면 좋은지에 대해 알아보고 사용 방법도 함께 알아보자. 참고로 Dockerfile을 기반으로 Redis 환경을 구축했다. 자세한 내용은 다음 링크를 참고하자. ([링크](https://yessm621.github.io/architecture/DockerEx/))

## Redis를 언제, 어디에 사용하는 것이 좋을까?

`Redis`는 데이터를 메모리에 저장하는 **In-Memory(인메모리) 데이터베이스**이다.

### Redis를 사용할 때 고려해야 할 점

1. 데이터의 변경이 적은 데이터를 캐싱하는 것이 좋다.
    - Redis는 DB에 있는 데이터를 접근 비용이 적은 곳에 놔둬서 가지고 오는 것이다.
    - 만약, 원본 데이터인 DB의 데이터가 변하게 되면 캐싱된 데이터도 바꿔야 한다.
    - 이럴 경우, 기존의 캐싱은 버리고 데이터베이스에 저장된 데이터를 가지고 와서 다시 캐싱시켜야 하기 때문에 select가 많이 발생하게 된다.
2. 자주 사용하는 데이터를 캐싱하는 것이 좋다.
    - 접근이 많은 데이터를 캐싱할수록 DB에 부하가 적어지기 때문에 좀 더 접근이 자주 되는 데이터를 캐싱하면 더 효과를 볼 수 있다.

.

이번 프로젝트의 경우에는 UserDto를 Redis에 저장한다.

UserDto를 Redis에 저장한 이유는 API를 요청할 때 filter를 탈 때 그 사용자가 존재하는지 안하는지를 DB에서 체크하는 로직이 있다. 그렇기 때문에 API 호출마다 DB를 한 번씩 접근해서 이 사용자의 존재를 체크하게 되는데, 이 부분을 캐시로 한다면 부하가 매우 줄어들 것이다.

또한, 사용자 데이터 같은 경우 현재 스펙상으로 패스워드나 네임을 변경할 수가 없는 상태이다. 다른 데이터보다 비교적 적게 변화하는 데이터이다.

이러한 이유로 UserDto를 Redis에 저장한다.

## 프로젝트 환경

### build.gradle

```
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

### application.properties

```
spring.data.redis.host=127.0.0.1
spring.data.redis.port=6379
```

## 예제 코드

### RedisConfig 설정

최근에 Redis 클라이언트를 사용할 때 **Lettuce**가 많이 사용된다.

```java
package com.study.security.config;

@Configuration
@EnableRedisRepositories
@RequiredArgsConstructor
public class RedisConfig {

    private final RedisProperties redisProperties;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
        configuration.setHostName(redisProperties.getHost());
        configuration.setPort(redisProperties.getPort());

        LettuceConnectionFactory factory = new LettuceConnectionFactory(configuration);
        factory.afterPropertiesSet();
        return factory;
    }

    @Bean
    public RedisTemplate<String, UserDto> userRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, UserDto> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<UserDto>(UserDto.class));
        return redisTemplate;
    }
}
```

- RedisConnectionFactory
    - Redis와 연결을 위한 Connection을 생성하고 관리하는 메서드이다.
    - LettuceConnectionFactory를 사용하여 host와 port 정보를 기반으로 연결을 생성한다.
- `RedisTemplate<String, Object>`
    - **Redis에 저장된 데이터에 접근할 수 있게 도와주는 Helper 클래스**
    - Spring Data Redis에서 제공하는 템플릿 클래스로 데이터 조작을 추상화하고 자동화 해주는 역할을 한다.
    - 데이터를 읽고 쓰는데 필요한 모든 작업을 처리해준다.
    - 이 클래스를 활용하여 String, List, Set, Sorted Set, Hash 등 다양한 Redis 데이터 구조를 쉽게 다룰 수 있다.

.

.

```java
package com.study.security.repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class UserCacheRepository {

    private final RedisTemplate<String, UserDto> userRedisTemplate;
    private final static Duration USER_CACHE_TTL = Duration.ofDays(3); //3일동안 cashing

    public void setUser(UserDto user) {
        String key = getKey(user.getUsername());
        log.info("[REDIS] Set User - {} , {}", key, user);
        userRedisTemplate.opsForValue().set(key, user, USER_CACHE_TTL);
    }

    public Optional<UserDto> getUser(String username) {
        String key = getKey(username);
        UserDto user = userRedisTemplate.opsForValue().get(key);
        log.info("[REDIS] Get data - {} , {}", key, user);
        return Optional.ofNullable(user);
    }

    private String getKey(String username) {
        return "USER:" + username;
    }
}
```

- USER_CACHE_TTL: Redis에 데이터를 저장할 때 유효기간을 설정한다.

.

.

```java
package com.study.security.dto;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String username;
    private String password;
    private String name;
    private String role;

    public UserDto(String username, String name, String role) {
        this.username = username;
        this.name = name;
        this.role = role;
    }

    public static UserDto toDto(String username, String name, String role) {
        return new UserDto(username, name, role);
    }

    //entity -> dto
    public static UserDto fromEntity(User entity) {
        return new UserDto(
                entity.getUsername(),
                entity.getPassword(),
                entity.getName(),
                entity.getRole().getKey()
        );
    }
}
```

### 로그인 중 Redis를 사용해 데이터 가져오기

```java
package com.study.security.service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserCacheRepository userCacheRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDto userDto = userCacheRepository.getUser(username).orElseGet(() ->
                userRepository.findByUsername(username)
                        .map(UserDto::fromEntity)
                        .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_EXCEPTION, "아이디를 찾을 수 없습니다."))
        );
        return new CustomUserDetails(userDto);
    }
}
```

- 로그인 시 Redis 캐시에 username에 해당하는 키 값이 있는지 확인한다.
- 데이터가 있다면 Redis에서 데이터를 가져오고 없다면 DB를 조회한다.

.

.

```java
package com.study.security.jwt;

@RequiredArgsConstructor
public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    private final ReissueService reissueService;
    private final UserRepository userRepository;
    private final UserCacheRepository userCacheRepository;

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
        String username = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createAccessToken(username, role);
        String refresh = jwtUtil.createRefreshToken(username, role);

        reissueService.addRefresh(username, refresh, 86400L);
        UserDto userDto = userCacheRepository.getUser(username).orElseGet(() ->
                userRepository.findByUsername(username)
                        .map(UserDto::fromEntity)
                        .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_EXCEPTION, "아이디를 찾을 수 없습니다."))
        );
        userCacheRepository.setUser(userDto);

        TokenDto tokenDto = TokenDto.toDto(access);
        response.addCookie(CookieUtil.createCookie("refresh", refresh, 86400));
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(tokenDto)));
    }

    ...

    @Data
    private static class LoginDto {
        String username;
        String password;
    }
}
```

- 로그인 성공 시 successfulAuthentication() 메서드가 실행된다.
- 여기서도 userCacheRepository.getUser(username)을 사용해서 Redis에 데이터가 있는지 확인하며 없다면 DB를 조회한다.
- 가져온 UserDto는 userCacheRepository.setUser(userDto)를 통해 Redis에 캐싱한다.

## Github 코드

[Github 코드 참고](https://github.com/yessm621/spring-security/commit/930ebc9a70ead2e41ec05d4a26033c679b9ffadb)
