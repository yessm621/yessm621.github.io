---
title: "스프링부트, API 개발 시 공통 응답 형식 구현"
categories:
  - Spring
tags:
  - RestAPI
toc: true
toc_sticky: true
---

## 개요

스프링 부트에서 REST API를 개발할 때, 클라이언트 측에서 요청이 오면 서버 단에서 응답을 해준다. 이때 클라이언트 측과 서버 측은 원활히 요청과 응답을 주고 받기 위해 서로 합의하에 공통 응답 형식을 정하고 이를 준수하여 서버에서 클라이언트로 응답값을 전달한다.

이번 포스트는 스프링 부트로 API를 개발하면서 공통 응답 형식을 구현했던 과정을 정리한 내용이다.

## 응답 CASE

서버에서 클라이언트로 보내는 응답은 다음과 같은 패턴을 가진다.

```json
{
    "status": "",
    "data": {},
    "errorMsg": {}
}
```

- status: 성공 또는 실패 여부 표시
- data: 성공 시 응답 데이터 표시
- errorMsg: 오류가 발생했을 때 오류 코드와 오류 메시지를 표시

**요청 성공 시 응답 결과**

```json
{
    "status": "success",
    "data": {
        "id": "world",
        "username": "hello world"
    },
    "errorMsg": null
}
```

**요청 실패 시 응답 결과**

```json
{
    "status": "fail",
    "data": null,
    "errorMsg": {
        "code": "E0002",
        "message": "접근 권한이 없습니다."
    }
}
```

## 예제 코드

### 에러 코드 정의

ErrorCode는 Enum 타입으로 정의한다. 

다양한 HTTP 관련 오류를 정의하고 관리하기 위해 사용한다. 또한, 애플리케이션 전반에서 통일된 형식의 오류를 처리하기 위해 사용한다.

```java
package com.study.security.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    RUNTIME_EXCEPTION(HttpStatus.BAD_REQUEST, "E0001"),
    ACCESS_DENIED_EXCEPTION(HttpStatus.UNAUTHORIZED, "E0002", "접근 권한이 없습니다."),
    NOT_FOUND_EXCEPTION(HttpStatus.NOT_FOUND, "E0003"),
    PARAMETER_INCORRECT(HttpStatus.BAD_REQUEST, "E0004", "파라미터(인자)가 잘못되었습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E0100");

    private final HttpStatus status;
    private final String code;
    private String message;

    ErrorCode(HttpStatus status, String code) {
        this.status = status;
        this.code = code;
    }

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
```

### 예외 메시지 작성

예외 메시지 코드를 작성하기에 앞서 응답 CASE 중 실패할 경우의 응답 결과를 살펴보자.

**요청 실패 시 응답 결과**

```json
{
    "status": "fail",
    "data": null,
    "errorMsg": {
        "code": "E0002",
        "message": "접근 권한이 없습니다."
    }
}
```

errorMsg는 요청을 실패 했을 경우, 실패한 오류 정보를 제공하는 객체이며 code, message로 이루어져있다. 해당 부분을 구현하기 위한 코드는 다음과 같다.

```java
package com.study.security.exception;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ErrorMessage {

    private String code;
    private String message;

    protected ErrorMessage() {
    }

    private ErrorMessage(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public static ErrorMessage create(String code, String message) {
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.code = code;
        errorMessage.message = message;
        return errorMessage;
    }
}
```

## API 응답 작성

ApiResponse는 API의 성공, 실패에 대한 응답을 일관되게 처리하는 클래스이다.

앞서 살펴봤던 응답 CASE를 살펴보면 다음과 같다.

```json
{
    "status": "",
    "data": {},
    "errorMsg": {}
}
```

ApiResponse 클래스는 응답 CASE의 구조를 반영하여 작성한 것이다.

```java
package com.study.security.exception;

import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private static final String SUCCESS_STATUS = "success";
    private static final String FAIL_STATUS = "fail";

    private String status;
    private T data;
    private ErrorMessage errorMsg;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(SUCCESS_STATUS, data, null);
    }

    public static ApiResponse<?> successWithNoContent() {
        return new ApiResponse<>(SUCCESS_STATUS, null, null);
    }

    public static ApiResponse<?> fail(ErrorMessage errorMessage) {
        return new ApiResponse<>(FAIL_STATUS, null, errorMessage);
    }

    protected ApiResponse() {
    }

    private ApiResponse(String status, T data, ErrorMessage errorMessage) {
        this.status = status;
        this.data = data;
        this.errorMsg = errorMessage;
    }
}
```

## 사용자 정의 예외 작성 (Custom 예외)

실행 시 발생하는 예외를 처리하기 위한 사용자 정의 예외 클래스이다. RuntimeException을 상속 받았다.

```java
package com.study.security.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {

    private ErrorCode error;

    public ApiException(ErrorCode e) {
        super(e.getMessage());
        this.error = e;
    }
}
```

## 공통 예외 처리 클래스

스프링 부트에선 예외처리를 편리하게 하기 위한 @RestControllerAdvice와 @ExceptionHandler를 제공한다. 이를 통해 예외 발생 시 적절한 HTTP 상태 코드와 응답 메시지를 클라이언트로 전달할 수 있다.

```java
package com.study.security.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@Slf4j
@RestControllerAdvice
public class ApiExceptionAdvice {

    @ExceptionHandler
    public ResponseEntity<ApiResponse> exception(ApiException e) {
        log.error("[exceptionHandler] ex", e);

        ErrorMessage errorMessage = ErrorMessage.create(e.getError().getCode(), e.getError().getMessage());

        return new ResponseEntity<>(ApiResponse.fail(errorMessage), e.getError().getStatus());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> exception(RuntimeException e) {
        log.error("[exceptionHandler] ex", e);

        ErrorMessage errorMessage = ErrorMessage.create(ErrorCode.RUNTIME_EXCEPTION.getCode(), e.getMessage());

        return new ResponseEntity<>(ApiResponse.fail(errorMessage), HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse> exception(IllegalArgumentException e) {
        log.error("[exceptionHandler] ex", e);

        ErrorMessage errorMessage = ErrorMessage.create(ErrorCode.PARAMETER_INCORRECT.getCode(), e.getMessage());

        return new ResponseEntity<>(ApiResponse.fail(errorMessage), HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> exception(AccessDeniedException e) {
        log.error("[exceptionHandler] ex", e);

        ErrorMessage errorMessage = ErrorMessage.create(ErrorCode.ACCESS_DENIED_EXCEPTION.getCode(), e.getMessage());

        return new ResponseEntity<>(ApiResponse.fail(errorMessage), HttpStatus.UNAUTHORIZED);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> exception(Exception e) {
        log.error("[exceptionHandler] ex", e);

        ErrorMessage errorMessage = ErrorMessage.create(ErrorCode.INTERNAL_SERVER_ERROR.getCode(), e.getMessage());

        return new ResponseEntity<>(ApiResponse.fail(errorMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

- @RestControllerAdvice
    - 전역 예외 처리 클래스를 선언하기 위한 어노테이션
    - 모든 컨트롤러에서 발생하는 예외를 이 클래스가 가로채 처리한다.
- 예외 처리 시 ResponseEntity<ApiResponse>를 반환한다.
- @ExceptionHandler
    - @Controller, @ControllerAdvice가 적용된 클래스에서 사용할 수 있다.
    - 모든 컨트롤러에 대해 전역적으로 Exception 처리가 가능해진다.

## 예제 코드 - 테스트

위에 작성한 예제 코드를 테스트하는 간단한 컨트롤러를 작성하였다. 해당 코드를 작성 후 애플리케이션을 실행한다.

```java
package com.study.security.controller;

import com.study.security.exception.ApiException;
import com.study.security.exception.ApiResponse;
import com.study.security.exception.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExController {

    @GetMapping("/api/exception/{id}")
    public ResponseEntity<ApiResponse<ExceptionDto>> getMember(@PathVariable("id") String id) {

        if (id.equals("ex")) {
            throw new RuntimeException("잘못된 사용자");
        }
        if (id.equals("bad")) {
            throw new ApiException(ErrorCode.NOT_FOUND_EXCEPTION);
        }
        if (id.equals("user-ex")) {
            throw new ApiException(ErrorCode.ACCESS_DENIED_EXCEPTION);
        }

        return ResponseEntity.ok(ApiResponse.success(new ExceptionDto(id, "hello " + id)));
    }

    @Data
    @AllArgsConstructor
    static class ExceptionDto {

        private String id;
        private String username;
    }
}
```

### Postman 테스트 결과

**테스트 결과 - 성공 (200)**

![스크린샷 2024-12-12 오후 1.04.04.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b949e38-2db3-4d0d-a1e2-a4550a0d790b/f41bd35a-bec4-4ea3-a471-7a7fc0c756c8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-12-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.04.04.png)

**테스트 결과 - 실패 (400 에러)**

![스크린샷 2024-12-12 오후 1.04.43.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b949e38-2db3-4d0d-a1e2-a4550a0d790b/2e87354e-345f-4d69-aaf0-45db75734bdf/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-12-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.04.43.png)

**테스트 결과 - 실패 (404 에러)**

![스크린샷 2024-12-12 오후 1.05.27.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b949e38-2db3-4d0d-a1e2-a4550a0d790b/c9fd45c9-2e4a-476d-9abc-4fbf70a42b21/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-12-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.05.27.png)

**테스트 결과 - 실패 (401 에러)**

![스크린샷 2024-12-12 오후 1.06.03.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b949e38-2db3-4d0d-a1e2-a4550a0d790b/82abb930-2348-4307-b627-41a86f1de913/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-12-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.06.03.png)