---
title:  "Spring Security"
last_modified_at: 2021-12-22T16:10:00
categories: 
  - Spring
tags:
  - Java
  - Spring
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

스프링 시큐리티

→ 다양한 방식으로 사용자 정보를 유지할 수 있는 방법을 제공

- 세션(HttpSession) 기반: 사용자 정보는 서버에서 보관, 필요시 설정을 통해서 제어

<br>

# 1. 스프링 시큐리티를 이용하는 프로젝트

build.gradle

```python
implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity5'
```

application.yml

```yaml
logging:
  level:
    com:
      springframework:
        security:
          web:
            trace
      project:
        debug
```

security 관련 부분은 로그 레벨을 낮게 설정해서 자세한 로그 확인

위의 설정을 완료하면 프로젝트를 실행 시 다음과 같이 중간에 패스워드 하나가 출력됨

![1](https://user-images.githubusercontent.com/79130276/147385202-d16fd555-33f8-4afa-a367-1b7d7497fe10.png)

생성된 패스워드는 user 계정의 패스워드 (임시 패스워드 역활을 함)

[localhost:8080/login](http://localhost:8080/login) 의 경로로 접근 했을 때 아래와 같은 화면이 보인다.

![2](https://user-images.githubusercontent.com/79130276/147385201-bf486b31-0a1f-4b5f-b1ca-36be32a565c8.png)

<br>

참고) 브라우저에서 강제로 로그아웃하고 싶을 땐, 개발자 도구의 Application탭에서 Cookies 의 `JSESSIONID` 를 강제 삭제한다

쿠키들 중에 톰캣은 JSESSIONID 라는 이름의 쿠키를 사용

<br>

## 1.1 시큐리티 설정 클래스 작성

SecurityConfig 클래스 추가

해당 클래스에는 시큐리티 관련 기능을 쉽게 설정하기 위해 `WebSecurityConfigurerAdapter` 라는 클래스를 상속으로 처리. WebSecurityConfigurerAdapter 클래스는 주로 override 를 통해서 여러 설정 조정

config/SecurityConfig.java

```java
package com.project.netflix.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Log4j2
public class SecurityConfig extends WebSecurityConfigurerAdapter {

}

```

<br>

## 1.2 확인을 위한 SampleController

SampleController.java

```java
package com.project.netflix.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Log4j2
@RequestMapping("/sample")
public class SampleController {

    // 로그인을 하지 않은 사용자도 접근할 수 있는
    @GetMapping("/all")
    public void exAll() {
        log.info("all..............");
    }

    // 로그인한 사용자만이 접근할 수 있는
    @GetMapping("/member")
    public void exMember() {
        log.info("member..............");
    }

    // 관리자 권한이 있는 사용자만이 접근할 수 있는
    @GetMapping("/admin")
    public void exAdmin() {
        log.info("admin..............");
    }
}

```

templates 도 작성

<br>

## 1.3 스프링 시큐리티 용어와 흐름

Filter1,2,3...N → Authentication Manager → AuthenticationProvider → UserDetailsService

Authentication Manager(인증 매니저): 핵심 역할

AuthenticationProvider: 인증 매니저가 어떻게 동작해야 하는지를 결정

UserDetailsService: 실제 인증

스프링 시큐리티의 핵심 개념은 `인증(Authentication)`과 `인가(Authorization)`

예시) 은행에 금고가 하나 있고, 사용자가 금고의 내용을 열어본다 가정하였을 때

1. 사용자는 은행에 가서 자신이 어떤 사람인지 자신의 신분증으로 자신을 증명
2. 은행에서는 사용자의 신분을 확인
3. 은행에서 사용자가 금고를 열어 볼 수 있는 사람인지를 판단
4. 만일 적절한 권리나 권한이 있는 사용자의 경우 금고를 열어줌

1은 인증(자신을 증명), 3은 인가(사용자에게 일종의 허가를 해 주는 과정)

<br>

### 필터와 필터 체이닝

스프링 시큐리티에서 필터는 스프링의 빈과 연동할 수 있는 구조로 설계됨

여러 개의 필터가 Filter Chain 이라는 구조로 Request 를 처리하게 됨. 개발 시에 필터를 확장하고 설정하면 스프링 시큐리티를 이용해서 다양한 형태의 로그인 처리가 가능하게 됨

<br>

### 인증을 위한 AuthenticationManager(AM)

필터의 핵심적인 동작은 AuthenticationManager을 통해서 인증이라는 타입의 객체로 작업

AuthenticationManager가 가진 인증 처리 메서드는 파라미터,리턴 타입 모두 Authentication.

인증: 스스로 증명하다 (= 주민등록증)

예시) 로그인 하는 과정에서는 사용자의 아이디/패스워드로 자신이 어떤 사람인지 전달. 검증하는 행위는 AuthenticationManager를 통해 이루어짐

스프링 시큐리티 필터의 주요 역할은 인증 관련된 정보를 토큰이라는 객체로 만들어서 전달. UsernamePasswordAuthenticationToken 의 동작

1. request 를 이용해 사용자의 아이디와 패스워드 받음
2. 아이디와 패스워드로 UsernamePasswordAuthenticationToken 라는 객체 생성
3. 객체를 AuthenticationManager 의 authenticate() 에 전달

AuthenticationManager 는 다양한 방식으로 인증처리 방법을 제공

- 데이터베이스 이용
- 메모리상에 있는 정보를 활용

AuthenticationProvider 는 전달되는 토큰의 타입을 처리할 수 있는 존재인지를 확인하고 authenticate() 를 수행

AuthenticationProvider 는 내부적으로 UserDetailsService 를 이용. UserDetailsService는 실제로 인증을 위한 데이터를 가져오는 역할

<br>

### 인가와 권한/접근 제한

인증처리 단계가 끝나면 사용자의 권한이 적절한지 확인

인증: 사용자가 스스로 자신을 증명하는 것

인가: 허가의 의미

AuthenticationManager 의 authenticate() 메서드의 리턴값은 Authentication(인증)

이 인증 정보에는 Roles 라는 권한에 대한 정보가 있음. 이 정보로 사용자가 원하는 작업을 할 수 있는지 허가하게 되는데 이러한 행위를 Access-Control(접근 제한)이라고 함

단계1. 사용자는 원하는 URL 을 입력

단계2. 스프링 시큐리티에서는 인증/인가가 필요하다고 판단하고(필터에서 판단) 사용자가 인증하도록 로그인 화면 보여줌

1. 올바른 사용자라고 인증되면 사용자의 정보를 Authentication 타입으로 전달(인증)
2. 전달된 객체로 사용자가 적절한 권한이 있는지 확인(인가)

단계3. 정보가 전달된다면 AuthenticationManager가 적절한 AuthenticationProvider를 찾아서 인증을 시도

<br>
<br>

# 2. 스프링 시큐리티 커스터마이징

<br>

## 2.1 반드시 필요한 PasswordEncoder

패스워드를 암호화

BCryptPasswordEncoder 는 bcrypt 라는 해시 함수를 이용해서 패스워드를 암호화하는 목적으로 설계된 클래스. BCryptPasswordEncoder 로 암호화된 패스워드는 복호화가 불가능하고 매번 암호화된 값도 다름.

SecurityConfig.java

```java
package com.project.netflix.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Log4j2
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

```

<br>

## 2.2 AuthenticationManager 설정

SecurityConfig.java

```java
package com.project.netflix.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Log4j2
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        // 사용자 계정은 user1
        auth.inMemoryAuthentication().withUser("user1")
                // 1111 패스워드 인코딩 결과
                .password("$2a$10$yfgSY/2154i6Tf9/s83PCeCB/xo1L1/7dtGv1XG2mN4l3Qwlz05Ze")
                .roles("USER");
    }
}

```

<br>

## 2.3 인가가 필요한 리소스 설정

SecurityConfig.java

```java
package com.project.netflix.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Log4j2
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    ...

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/sample/all").permitAll()
                .antMatchers("/sample/member").hasRole("USER");

        http.formLogin();
    }

    ...
}

```

**http.authorizeRequests()**

인증이 필요한 자원들을 설정

**antMatchers("**/*")**

앤트 스타일의 패턴으로 원하는 자원을 선택

**permitAll()**

모든 사용자에게 허락

**http.formLogin();**

인가/인증에 실패시 로그인 화면

<br>

## 2.4 CSRF 설정

스프링 시큐리티는 CSRF 라는 공격을 방어하기 위해 임의의 값을 만들어 이를 GET 방식을 제외한 모든 요청 방식(POST,PUT,DELETE)에 포함시켜야만 정상적인 동작을 함

CSRF(Cross Site Request Forgery)공격: 사이트간 요청 위조

form 태그를 이용하는 방식에서 CSRF 토큰이 보안상으로 권장됨. REST방식에서는 매번 CSRF 토큰의 값을 알아내야 하는 불편함이 있기 때문에 경우에 따라 CSRF 토큰의 발행을 하지 않는 경우도 있음

<br>

### csrf토큰 비활성화

SecurityConfig.java

```java
package com.project.netflix.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Log4j2
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    ...

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/sample/all").permitAll()
                .antMatchers("/sample/member").hasRole("USER");

        http.formLogin();
        http.csrf().disable();
        http.logout();
    }

    ...
}

```

**http.csrf().disable();**

예제에서는 REST방식으로 이용할 수 있는 보안 설정을 다루기 위해 CSRF 토큰을 방행하지 않는 방식으로 설정

<br>

## 2.5 logout 설정

**http.logout();**

logout() 에서 주의해야 할 점은 CSRF 토큰을 사용할 때 POST 방식으로만 로그아웃

CSRF 토큰을 disable() 로 비활성화 시키면 GET 방식으로도 로그아웃 할 수 있음

<br>
<br>

# 3. 프로젝트를 위한 JPA 처리

Member.java

```java
package com.project.netflix.entity;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@ToString
public class Member extends baseEntity {

	@Id
    private String email;

    private String password;

    private String name;

    private Boolean fromSocial;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private Set<MemberRole> roleSet = new HashSet<>();

    public void addMemberRole(MemberRole memberRole) {
        roleSet.add(memberRole);
    }

}
```

MemberRole.java

```java
package com.project.netflix.entity;

public enum MemberRole {
    USER, MANAGER, ADMIN
}
```

<br>

## 3.1 Repository 와 더미데이터 추가하기

더미데이터 추가시 회원은 여러 개의 권한을 가질 수 있어야 함을 유의하며 작성

MemberRepository.java

```java
package com.project.netflix.repository;

import com.project.netflix.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, String> {
}
```

security/MemberTests.java

```java
package com.project.netflix.security;

import com.project.netflix.entity.Member;
import com.project.netflix.entity.MemberRole;
import com.project.netflix.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.stream.IntStream;

@SpringBootTest
public class MemberTests {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void insertDummies() {

		// 1~80: USER
        // 81~90: USER, MANAGER
        // 91~100: USER, MANAGER, ADMIN

        IntStream.rangeClosed(1, 100).forEach(i -> {
            Member member = Member.builder()
                    .email("user" + i + "@gmail.com")
                    .name("user" + i)
                    .fromSocial(false)
                    .password(passwordEncoder.encode("1111"))
                    .build();

            member.addMemberRole(MemberRole.USER);
            if (i > 80) {
                member.addMemberRole(MemberRole.MANAGER);
            }
            if (i > 90) {
                member.addMemberRole(MemberRole.ADMIN);
            }
            memberRepository.save(member);
        });
    }
}
```

<br>

## 3.2 회원 데이터 조회 테스트

MemberRepository.java

```java
package com.project.netflix.repository;

import com.project.netflix.entity.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    @Query("select m from Member m where m.fromSocial = :social and m.email = :email")
    Optional<Member> findByEmail(String email, boolean social);
}
```

참고) `@EntityGraph`

JPA 를 쓰다가 보면 LAZY 패치타입으로 relation 이 달려 있는 entity 를 `n+1 문제` 없이 한번에 가져오고 싶을 때가 있다. 평소에는 LAZY 를 쓰지만 특정 시나리오에서는 한번에 패치하는게 필요하기도 하다. 이럴때 repository 메소드에 @EntityGraph만 붙이면 손쉽게 join 해서 한 번에 패치해 옴

`@EntityGraph`의 type은 EntityGraph.EntityGraphType.FETCH와 EntityGraph.EntityGraphType.LOAD 2가지가 있다.

- `FETCH`: entity graph에 명시한 attribute는 EAGER로 패치하고, 나머지 attribute는 `LAZY`로 패치
- `LOAD`: entity graph에 명시한 attribute는 EAGER로 패치하고, 나머지 attribute는 entity에 명시한 fetch type이나 디폴트 FetchType으로 패치 (e.g. @OneToMany는 LAZY, @ManyToOne은 EAGER 등이 디폴트이다.)

<br>
<br>

# 4. 시큐리티를 위한 UserDetailsService

일반적인 아이디/패스워드와 스프링 시큐리티의 차이점

- 스프링 시큐리티에서는 회원이나 계정에 대해 User 라는 용어 사용
- username 사용
    - 단어 자체가 회원을 구별할 수 있는 식별 데이터를 의미
- username 과 password 동시에 사용하지 않음
    - 스프링 시큐리티는 UserDetailsService 를 이용해서 회원의 존재만을 우선적으로 가져오고, 이후에 password 가 틀리면 Bad Cridential(잘못된 자격증명) 이라는 결과를 만들어 냄(인증)
- username, password 인증 과정이 끝나면 원하는 자원(URL)에 접근할 수 있는 권한이 있는지 확인하고 인가 과정을 실행(Access Denied 과 같은 결과 생성됨)

위의 과정에서 가장 핵심은 `UserDetailsService`

<br>

## 4.1 UserDetails 인터페이스

**loadUserByUsername()**

→ username 이라는 회원 아이디와 같은 식별 값으로 회원 정보를 가져옴

→ 리턴 타입: UserDetails 타입

- getAuthorities(): 사용자가 가지는 권한에 대한 정보
- getPassword(): 인증을 마무리하기 위한 패스워드 정보
- getUsername(): 인증에 필요한 아이디와 같은 정보
- 계정 만료 여부: 사용 불가능 계정인지 알 수 있는 정보
- 계정 잠김 여부: 현재 계정의 잠김 여부

Member 를 처리할 수 있는 방법

1. 기존 DTO 클래스에 UserDetails 인터페이스를 구현하는 방법
2. DTO 와 같은 개념으로 별도의 클래스를 구성하고 이를 활용하는 방법 (선호!)

security/dto/AuthMemberDTO.java

```java
package com.project.netflix.security.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Log4j2
@Getter
@Setter
@ToString
public class AuthMemberDTO extends User {

    private String email;

    private String name;

    private boolean fromSocial;

    public AuthMemberDTO(
            String username,
            String password,
            boolean fromSocial,
            Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.email = username;
        this.fromSocial = fromSocial;
    }

}
```

User 클래스를 상속, 부모 클래스인 User 클래스의 생성자를 호출할 수 있는 코드 생성

AuthMemberDTO 는 DTO 역할도 수행하고 스프링 시큐리티에서 인가/인증 작업에 사용 (password 는 부모 클래스를 사용하므로 멤버 변수로 선언하지 않음)

<br>

## 4.2 UserDetailsService 구현

Member 가 AuthMemberDTO 라는 타입으로 처리된 가장 큰 이유는 사용자의 정보를 가져오는 핵심적인 역할을 하는 UserDetailsService 라는 인터페이스 때문

스프링 시큐리티의 구조에서 인증을 담당하는 AuthenticationManager 는 내부적으로 UserDetailsService 를 호출해서 사용자의 정보를 가져옴

JPA 로 사용자의 정보를 가져오려면 UserDetailsService가 이용하는 구조로 작성

SecurityUserDetailsService.java

```java
package com.project.netflix.security.service;

import com.project.netflix.entity.Member;
import com.project.netflix.repository.MemberRepository;
import com.project.netflix.security.dto.AuthMemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class SecurityUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("SecurityUserDetailsService loadUserByUsername: " + username);

        Optional<Member> result = memberRepository.findByEmail(username, false);

        if (!result.isPresent()) {
            throw new UsernameNotFoundException("Check Email or Social");
        }

        Member member = result.get();

        log.info("-------------------------");
        log.info(member);

        AuthMemberDTO authMember = new AuthMemberDTO(
                member.getEmail(),
                member.getPassword(),
                member.isFromSocial(),
                member.getRoleSet().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_"+role.name()))
                        .collect(Collectors.toSet())
        );

        authMember.setName(member.getName());

        return authMember;
    }
}
```

@Service 를 사용해서 자동으로 스프링에서 빈으로 처리될 수 있게 했다.

- MemberRepository 를 주입받을 수 있는 구조로 변경, @RequiredArgsConstructor 처리
- username 이 실제로는 email 을 의미
- 사용자가 존재하지 않으면 UsernameNotFoundException으로 처리
- Member 를 UserDetails 타입으로 처리하기 위해 AuthMemberDTO 타입으로 변환
- MemberRole 은 스프링 시큐리티에서 사용하는 SimpleGrantedAuthority 로 변환