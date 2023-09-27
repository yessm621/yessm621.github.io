---
title: "@Valid, @Validated"
# last_modified_at: 2023-01-25T23:15:00
last_modified_at: 2023-01-26T10:30:00
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

Spring에서는 일조의 어댑터인 LocalValidatorFactoryBean가 제약 조건 검증을 처리한다. 이를 이용하려면 LocalValidatorFactoryBean을 빈으로 등록해야 하는데, 스프링 부트에서는 관련된 의존성을 추가하면 자동으로 설정되어 사용할 수 있다.

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

### @Valid의 동작원리

모든 요청은 **프론트 컨트롤러**인 `디스패처 서블릿`을 통해 컨트롤러로 전달된다. 전달 과정에서는 컨트롤러 메서드의 객체를 만들어주는 ArgumentResolver가 동작하는데 `@Valid` 역시 **ArgumentResolver에 의해 처리**가 된다.

대표적으로 @RequestBody는 Json 메시지를 객체로 변환해주는 작업이 ArgumentResolver의 구현체인 RequestResponseBodyMethodProcessor가 처리되며, 이 내부에서 @Valid로 시작하는 어노테이션이 있을 경우에 유효성 검사를 진행한다. 만약 @ModelAttribute를 사용중이라면 ModelAttributeMethodProcessor에 의해 @Valid가 처리된다.

그리고 검증에 오류가 있다면 MethodArgumentNotValidException 예외가 발생하게 되고, 디스패처 서블릿에 기본으로 등록된 예외 리졸버인 DefalutHandlerExceptionResolver에 의해 400 BadRequest 에러가 발생한다.

이러한 이유로 @Valid는 기본적으로 **컨트롤러에서만 동작**하며 기본적으로 다른 계층에서는 검증되지 않는다. 다른 계층에서 파라미터를 검증하기 위해서는 `@Validated`와 결합되어야 한다.

## @Validated

입력 파라미터의 **유효성 검증은 컨트롤러**에서 최대한 처리하고 넘겨주는 것이 좋다. 하지만, 개발을 하다보면 불가피하게 다른 곳에서 파라미터를 검증해야 할 수 있다. 스프링은 이를 위해 **AOP 기반**으로 메소드의 요청을 가로채서 유효성 검증을 진행해주는 `@Validated`를 제공한다. @Validated는 JSR 표준 기술은 아니고 스프링 프레임워크에서 제공하는 어노테이션 및 기능이다.

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

유효성 검증에 실패하면 에러가 발생하는데 로그를 확인해보면 @Valid에서 발생한 MethodArgumentNotValidException 예외가 아닌 ConstraintViolationException 예외가 발생한다. 이는 @Valid와 @Validated의 동작원리가 다르기 때문이다.

### @Validated의 동작원리

@Valid는 특정 ArgumentResolver에 의해 유효성 검사가 진행되었다면 @Validated는 AOP 기반으로 메소드 요청을 인터셉터하여 처리된다. @Validated를 클래스 레벨에 선언하면 해당 클래스에 유효성 검증을 위한 AOP의 어드바이스 또는 인터셉터가 등록된다. 그리고 해당 클래스의 메소드들이 호출될 때 AOP의 포인트 컷으로써 요청을 가로채서 유효성 검증을 진행한다.

이러한 이유로 @Validated를 사용하면 컨트롤러, 서비스, 리포지토리 등 계층에 무관하게 스프링 빈이라면 유효성 검증을 진행할 수 있다. 유효성 검증 AOP가 적용되도록 클래스에는 @Validated를 검증을 진행한 메소드에는 @Valid를 선언하면 된다.

@Valid와 @Validated는 동작원리의 차이로 발생하는 예외가 달라진다는 것을 기억하자.

### @Validated의 또 다른 기능

@Validated의 또 다른 기능은 그룹 지정 기능이다. (거의 사용하지 않는다. 이런게 있다 정도로 이해하자.)

예를 들어 일반 사용자의 요청과 관리자의 요청이 1개의 클래스로 처리될 때, 다른 제약 조건이 적용되어야 하는 경우가 있다. 동일한 클래스에 대한 제약조건이 요청에 따라 달라질 수 있는데 이처럼 **제약 조건이 적용될 검증 그룹을 지정**할 수 있는 기능을 @Validated가 제공한다.

검증 그룹을 지정하기 위해서 마커 인터페이스를 정의해야 한다. 앞선 예를 코드로 적용하면 다음과 같다.

```java
public interface UserValidationGroup {}
public interface AdminValidationGroup {}
```

> **참고** 마커 인터페이스
일반적인 인터페이스와 동일하지만 사실상 아무 메소드도 선언하지 않은 인터페이스를 말한다.
> 

그리고 해당 제약 조건이 적용될 그룹을 groups로 지정할 수 있다.

```java
/* DTO의 경우 */
// 제약 조건이 적용될 그룹이 여러 개일 경우
@NotEmpty(groups = {UserValidationGroup.class, AdminValidationGroup.class} ) 
private String name; 

@NotEmpty(groups = UserValidationGroup.class) 
private String userId; 

@NotEmpty(groups = AdminValidationGroup.class) 
private String adminId;

/* Controller의 경우 */
@PostMapping("members/new")
public String create(@Validated(UserValidationGroup.class) MemberForm form) {
    ...
}
```

## 다양한 제약 조건 어노테이션

JSR 표준 스펙은 다양한 제약 조건 어노테이션을 제공한다.

- @NotNull: null이 아닌지 검증한다.
- @NotEmpty: null, 빈 스트링(””)이 아닌지 검증한다.
- @NotBlank: null, 빈 스트링(””), 공백(” “)이 아닌지 검증한다.
- @AssertTrue: true인지 검증한다.
- @Size: 값이 주어진 값 사이에 해당하는지 검증한다.
- @Min: 값이 주어진 값보다 작은지 검증한다.
- @Max: 값이 주어진 값보다 큰지 검증한다.
- @Pattern: 값이 주어진 패턴과 일치하는지 검증한다.

이것 외에도 다양한 어노테이션을 지원하므로 공식 문서([링크](https://javaee.github.io/javaee-spec/javadocs/javax/validation/constraints/package-summary.html))를 참고하자.

## @Valid, @Validated 차이

**@Valid**는 자바 표준 스펙이며 컨트롤러에서만 유효성 검증이 가능하다. 유효성 검증에 실패하면 MethodArgumentNotValidException이 발생한다.

**@Validated**는 자바 표준 스펙이 아닌 스프링 프레임워크가 제공하는 기능이다. 계층에 무관하게 스프링 빈이라면 유효성 검증을 진행할 수 있다. 클래스에는 @Validated를 메서드에는 @Valid를 붙여준다. 유효성 검증에 실패하면 ConstraintViolationException이 발생한다.