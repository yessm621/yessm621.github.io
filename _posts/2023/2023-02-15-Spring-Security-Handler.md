---
layout: post
title: "Spring Security 로그인 성공, 실패 Handler"
date: 2023-02-15 13:00:00
categories: [Spring]
tags:
  - Spring
  - Java
author: "유자"
---

Spring Security를 구현 후 로그인 성공 후 처리와 로그인 실패 후 처리를 담당하는 AuthenticationSuccessHandler, AuthenticationFailureHandler를 커스텀 하여 Handler를 작성하였다.

- 로그인 성공 시: `CustomLoginSuccessHandler`
- 로그인 실패 시: `CustomLoginFailureHandler`

## 요구사항

- 로그인 성공
    - 로그인에 성공하면 로그인한 시간을 기록한다.
    - 로그인 성공 후 이전에 접속했던 페이지가 있으면 해당 페이지로 이동한다.
        - 예) 주문 페이지 → 로그인 필요 → 로그인 성공 → 주문 페이지로 다시 이동
- 로그인 실패
    - 로그인에 실패 시 다시 로그인 페이지로 이동한다.
    - 로그인에 실패한 사유를 알려준다.

### 작성, 수정할 파일

- CustomLoginSuccessHandler: 로그인 성공 핸들러
- CustomLoginFailureHandler: 로그인 실패 핸들러
- MemberController
- SecurityConfig: 스프링 시큐리티

## 로그인 성공 핸들러

로그인 전에 접속했던 페이지가 있는지 확인하고 있다면 해당 페이지를 session에 저장하는 로직이다.

```java
package com.haedals.haedal.member;

@Slf4j
@Controller
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    @GetMapping("login")
    public String login(HttpServletRequest request) {

        String uri = request.getHeader("Referer");
        if (uri != null && !uri.contains("/login")) {
            request.getSession().setAttribute("prevPage", uri);
        }

        return "member/login";
    }
    ...
}
```

- request.getHeader("Referer")를 통해 이전 페이지에 대한 uri를 가져올 수 있다.
- uri가 null 이면 이전 페이지가 존재하지 않는다는 의미이다.
- uri가 /login을 포함하고 있다면 로그인 실패 등의 이유로 이전 페이지가 로그인 페이지인 것이므로 Session에 uri를 저장하지 않는다.
- Session에 prevPage 이름으로 이전 페이지를 저장한다.

이제 로그인 성공 핸들러를 커스텀 하겠다. 로그인 성공 핸들러는 AuthenticationSuccessHandler를 상속받아 작성하였다.

```java
package com.haedals.haedal.security;

@RequiredArgsConstructor
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final RequestCache requestCache = new HttpSessionRequestCache();
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        clearSession(request);

        SavedRequest savedRequest = requestCache.getRequest(request, response);

        String prevPage = (String) request.getSession().getAttribute("prevPage");
        if (prevPage != null) {
            request.getSession().removeAttribute("prevPage");
        }

        String uri = "/";
        if (savedRequest != null) {
            uri = savedRequest.getRedirectUrl();
        } else if (prevPage != null && !prevPage.equals("")) {
            if (prevPage.contains("/member/signup")) {
                uri = "/";
            } else {
                uri = prevPage;
            }
        }

        // 로그인 시간을 기록하기 위한 로직 구현

        redirectStrategy.sendRedirect(request, response, uri);
    }

    protected void clearSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        }
    }
}
```

- 로그인에 성공한 뒤 로직을 추가하기 위해 onAuthenticationSuccess 메서드를 오버라이드했다.
- AuthenticationSuccessHandler는 인증에 성공 후 동작하는 핸들러로 로그인 성공 시 onAuthenticationSuccess 메서드가 동작한다.
- clearSession()
    - 로그인 성공 이전에 에러 세션(로그인 실패)이 존재한다면 제거해주는 작업을 수행한다.

```java
String prevPage = (String) request.getSession().getAttribute("prevPage");
if (prevPage != null) {
    request.getSession().removeAttribute("prevPage");
}
```

- prevPage가 있다면 사용자가 직접 로그인 페이지(/member/login) 경로로 로그인을 요청한 것이다.

```java
SavedRequest savedRequest = requestCache.getRequest(request, response);

String prevPage = (String) request.getSession().getAttribute("prevPage");
if (prevPage != null) {
    request.getSession().removeAttribute("prevPage");
}

String uri = "/";
if (savedRequest != null) {
    uri = savedRequest.getRedirectUrl();
} else if (prevPage != null && !prevPage.equals("")) { // 회원가입에서 로그인으로 넘어온 경우
    if (prevPage.contains("/member/signup")) {
        uri = "/";
    } else {
        uri = prevPage;
    }
}
```

- SavedRequest이 null이 아니면 권한이 없는 페이지에서 접근했음을 의미한다.
- Spring Security는 권한이 없는 페이지에서 접근할 경우 해당 작업은 Intercept하여 이전 페이지에 대한 uri를 SavedRequest에 저장한다.
- SavedRequest이 null이 아니면 이전 uri가 SavedRequest에 저장되어 있으므로 이것을 사용하면 된다.

이제 redirectStrategy를 통해 로그인 성공 후 결정된 uri로 redirect 한다.

## 로그인 실패 핸들러

```java
package com.haedals.haedal.security;

public class CustomLoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {

        String errorMessage = null;
        if (exception instanceof BadCredentialsException || exception instanceof InternalAuthenticationServiceException) {
            errorMessage = "아이디 또는 비밀번호가 맞지 않습니다.";
        } else if (exception instanceof UsernameNotFoundException) {
            errorMessage = "존재하지 않는 아이디 입니다.";
        } else {
            errorMessage = "알 수 없는 이유로 로그인이 안되고 있습니다.";
        }

        errorMessage = URLEncoder.encode(errorMessage, "UTF-8");
        setDefaultFailureUrl("/member/login?error=true&exception=" + errorMessage);
        super.onAuthenticationFailure(request, response, exception);
    }
}
```

- 로그인에 실패하면 Exception에 대한 에러메시지를 errorMessage에 저장하고 /member/login에 쿼리파라미터로 error와 exception을 넘겨준다.

```java
package com.haedals.haedal.member;

@Slf4j
@Controller
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    @GetMapping("login")
    public String login(@RequestParam(value = "error", required = false) String error,
                        @RequestParam(value = "exception", required = false) String exception,
                        HttpServletRequest request, Model model) {

        ...

        model.addAttribute("error", error);
        model.addAttribute("exception", exception);

        return "member/login";
    }
}
```

- 컨트롤러에서 error와 exception을 model로 전달하여 화면에 표출한다.

```html
<!-- /member/login.html -->
<div class="mt-1 text-sm text-red-600 field-error" th:if="${error}" th:text="${exception}">
  로그인 오류
</div>
```

## SecurityConfig에 handler 등록

이제 작성한 핸들러를 SecurityConfig 파일에 등록하자.

```java
package com.haedals.haedal.security;

@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final MemberRepository memberRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/", "/member/*").permitAll()
                .antMatchers("/css/**", "/js/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .permitAll()
                .loginPage("/member/login")
                .successHandler(new CustomLoginSuccessHandler(memberRepository))
                .failureHandler(loginFailHandler())
                .and()
                .logout()
                .permitAll()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/member/login")
                .deleteCookies("JSESSIONID")
                .invalidateHttpSession(true)
                .clearAuthentication(true);
        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder encodePassword() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomLoginFailureHandler loginFailHandler() {
        return new CustomLoginFailureHandler();
    }
}
```