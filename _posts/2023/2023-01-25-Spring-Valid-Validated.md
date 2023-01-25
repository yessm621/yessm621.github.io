---
title: "@Valid, @Validated"
last_modified_at: 2023-01-25T23:15:00
categories:
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

## @Valid

`@Valid`는 **JSR-303 표준** 스펙(자바 표준)으로 빈 검증기(Bean Validator)를 이용해 객체의 **제약 조건을 검증**하도록 지시하는 어노테이션이다.

Spring에서는 일종의 어댑터인 LocalValidatorFactoryBean가 제약 조건 검증을 처리한다. 이를 이용하려면 LocalValidatorFactoryBean을 빈으로 등록해야 하는데, 스프링 부트에서는 관련된 의존성을 추가하면 자동으로 설정되어 사용할 수 있다.

**build.gradle에 의존성 추가**

```
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

예를 들어 name 필드가 null 또는 ’’ 이 아닌지 확인하며 컨트롤러의 메서드에 @Valid를 붙이면 유효성 검증을 진행한다.

```java
@Getter @Setter
public class MemberForm {

    @NotEmpty(message = "회원 이름은 필수 입니다.")
    private String name;

    ...
}
```

```java
import javax.validation.Valid;

@Controller
@RequiredArgsConstructor
public class MemberController {
    ...

    @PostMapping("members/new")
    public String create(@Valid MemberForm form, BindingResult result) {
        if (result.hasErrors()) {
            return "members/createMemberForm";
        }

        ...
    }
}
```

## @Validated

입력 파라미터의 유효성 검증은 컨트롤러에서 최대한 처리하고 넘겨주는 것이 좋다. 하지만, 개발을 하다보면 불가피하게 다른 곳에서 파라미터를 검증해야 할 수 있다. 스프링은 이를 위해 **AOP 기반**으로 메소드의 요청을 가로채서 유효성 검증을 진행해주는 `@Validated`를 제공한다. @Validated는 JSR 표준 기술은 아니고 스프링 프레임워크에서 제공하는 어노테이션 및 기능이다.

다음과 같이 클래스에 @Validated를 붙여주고, 유효성을 검증할 메소드의 파라미터에 @Valid를 붙여주면 유효성 검증이 진행된다.

```java
@Service
@Validated
public class MemberService {
    public void signup(@Valid MemberForm memberForm) {
        ...
    }
}
```