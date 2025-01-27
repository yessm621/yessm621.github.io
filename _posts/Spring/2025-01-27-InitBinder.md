---
title: "스프링 부트, @InitBinder란?"
categories:
  - Spring
toc: true
toc_sticky: true
---

## @InitBinder란

외부에서 클라이언트가 요청 데이터를 보내면 스프링 부트가 처리하는 과정을 거친다. 이때, 클라이언트가 보낸 요청 데이터를 자바 객체로 변환해서 컨트롤러 메서드의 파라미터로 넣는 과정이 필요하다.

`@InitBinder`는 클라이언트가 보내는 데이터를 **바인딩 및 검증 설정을 커스터마이징** 할 수 있도록 도와준다.

> **참고** 데이터 바인딩
클라이언트가 보낸 데이터를 자바 객체로 변환하는 것을 의미한다.
> 

### 주요 역할

- 커스텀 에디터 등록
- 유효성 검사 설정
- 특정 필드 바인딩 제외

### @InitBinder 사용법

```java
@Controller
public class MyController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // 특정 필드 제외
        binder.setDisallowedFields("password");

        // 커스텀 에디터 등록 (날짜 형식 변환)
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false));
        
        binder.addValidators(new MyCustomValidator());
    }
}
```

- @InitBinder는 컨트롤러 내의 메서드에 사용한다.
- 메서드는 void를 반환하고 파라미터로 WebDataBinder를 받아야 한다.
- setDisallowedFields(String... fields): 특정 필드를 바인딩에서 제외한다.
- registerCustomEditor(Class<?> requiredType, PropertyEditor propertyEditor): 커스텀 에디터를 등록하여 특정 데이터 형식 변환을 처리한다.
    - CustomDateEditor: 문자열을 Date 객체로 변환
- addValidators(Validator… validators): 유효성 검사기를 추가한다.

## @InitBinder 활용 예제

### 커스텀 Validator

```java
package me.devstudy.account.controller.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
@RequiredArgsConstructor
public class SignupFormValidator implements Validator {

    private final AccountRepository accountRepository;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz.isAssignableFrom(SignupForm.class);
    }

    @Override
    public void validate(Object target, Errors errors) {
        SignupForm signupForm = (SignupForm) target;
        if (accountRepository.existsByEmail(signupForm.getEmail())) {
            errors.rejectValue("email", "invalid mail",
                    new Object[]{signupForm.getEmail()}, "이미 사용 중인 이메일 입니다.");
        }

        if (accountRepository.existsByNickname(signupForm.getNickname())) {
            errors.rejectValue("nickname", " invalid nickname",
                    new Object[]{signupForm.getNickname()}, "이미 사용 중인 닉네임 입니다.");
        }
    }
}
```

- 먼저 회원가입 폼 유효성 검사를 위한 커스텀 Validator를 작성했다.
- Validator 인터페이스를 사용한다.
- @Component: 스프링 빈으로 등록한다. AccountRepository를 주입 받기 위해선 SignupFormValidator도 빈으로 등록해야 한다.
- supports 메서드
    - Validator가 처리할 수 있는 객체의 타입을 지정한다.
    - 여기선 SignupForm 클래스를 처리할 수 있도록 설정했다.
- validate 메서드
    - 실제 유효성 검증 로직을 구현하는 메서드이다.
    - target: 검증 대상 대체 (SignupForm 객체)
    - errors: 유효성 검사 에러 정보를 저장하는 객체

### @InitBinder 적용 전

```java
package me.devstudy.account.controller;

@Controller
@RequiredArgsConstructor
public class AccountController {

    private final SignupFormValidator signupFormValidator;
    private final JavaMailSender javaMailSender;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    @GetMapping("/sign-up")
    public String signupForm(Model model) {
        model.addAttribute(new SignupForm());
        return "account/sign-up";
    }

    @PostMapping("/sign-up")
    public String signupSubmit(@Valid @ModelAttribute SignupForm signupForm, Errors errors) {
        if (errors.hasErrors()) {
            return "account/sign-up";
        }

        //SignupForm 검증
        signupFormValidator.validate(signupForm, errors);
        if (errors.hasErrors()) {
            return "account/sign-up";
        }

        Account newAccount = accountService.saveNewAccount(signupForm);
        newAccount.generateToken();
        accountService.sendVerificationEmail(newAccount);

        return "redirect:/";
    }
}

```

### @InitBinder 적용 후

```java
package me.devstudy.account.controller;

import jakarta.validation.Valid;
import me.devstudy.account.controller.validator.SignupFormValidator;
import org.springframework.validation.Errors;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

@Controller
@RequiredArgsConstructor
public class AccountController {

    private final SignupFormValidator signupFormValidator;
    private final AccountService accountService;

    @InitBinder("signUpForm")
    public void initBinder(WebDataBinder webDataBinder) {
        webDataBinder.addValidators(signupFormValidator);
    }

    @PostMapping("/sign-up")
    public String signupSubmit(@Valid @ModelAttribute SignupForm signupForm, Errors errors) {
        if (errors.hasErrors()) {
            return "account/sign-up";
        }

        accountService.signup(signupForm);

        return "redirect:/";
    }
}

```

- @InitBinder는 데이터 바인딩 및 검증 설정을 커스터마이징하는 메서드이다.
- 여기서 signupForm을 유효성 검증한다.

### @InitBinder 장점

- @InitBinder을 사용하면 **검증 로직과 컨트롤러 로직을 분리**할 수 있다.
    - 컨트롤러는 데이터 처리에 집중하고 검증은 Validator 클래스에서 독립적으로 처리된다.
- 새로운 데이터 바인딩 로직, 검증 로직을 추가해야 할 때 컨트롤러를 수정하지 않고 Validator 클래스만 수정하면 된다.
- 코드 재사용성이 높아진다.