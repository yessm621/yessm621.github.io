---
title: "JPA의 AttributeConverter, @Converter, @Convert 사용법"
categories:
  - Jpa
tags:
  - Spring
toc: true
toc_sticky: true
---

## AttributeConverter

`AttributeConverter`란 JPA에서 제공하는 인터페이스이다.

엔티티 클래스의 속성과 DB 컬럼 간의 변환 로직을 정의할 때 사용한다. 쉽게 말하자면 엔티티와 DB 사이의 변환기 역할을 한다고 생각하면 된다.

### AttributeConverter 인터페이스

AttributeConverter 인터페이스는 다음과 같이 정의한다.

```java
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ExampleConverter implements AttributeConverter<X, Y> {

    // Java 객체 → 데이터베이스 컬럼 값
    @Override
    public Y convertToDatabaseColumn(X attribute) {
        // 변환 로직
    }

    // 데이터베이스 컬럼 값 → Java 객체
    @Override
    public X convertToEntityAttribute(Y dbData) {
        // 변환 로직
    }
}
```

- X와 Y는 제네릭 타입이다.
- X: 엔티티 속성의 타입
- Y: DB 컬럼의 타입 (DB에 저장되는 값)

## AttributeConverter 활용 예제

### ListStringConverter 정의

```java
package me.devstudy.account.domain.support;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Converter
public class ListStringConverter implements AttributeConverter<List<String>, String> {

    //entity -> DB
    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        return Optional.ofNullable(attribute)
                .map(a -> String.join(",", a))
                .orElse("");
    }

    //DB -> entity
    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        return Stream.of(dbData.split(","))
                .collect(Collectors.toList());
    }
}
```

- 자바 엔티티에선 List<String> 타입으로 정의되고 DB에 저장 시 String 타입으로 정의된다.
- `@Converter`: AttributeConverter라고 정의하는 애노테이션이다.
    - 이 클래스가 컨버터인지 알 수 있게 해주는 애노테이션이다.
- convertToDatabaseColumn(): DB에 저장할 때 List<String>을 ‘,’로 이어 붙여 String 타입으로 정의한다.
- convertToEntityAttribute(): 반대로 DB에서 가져온 String 데이터를 ‘,’로 split해서 List<String>으로 가져온다.

이제 AttributeConverter를 어떻게 적용하는지 알아보자.

### Profile 엔티티

```java
package me.devstudy.account.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import me.devstudy.account.domain.support.ListStringConverter;

import java.util.List;

@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@ToString
public class Profile {

    private String bio;

    @Convert(converter = ListStringConverter.class)
    private List<String> urls;
    private String location;
    private String company;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    private String image;
}
```

- Profile 엔티티는 임베디드 타입으로 정의되어 있다. (값 타입)
- 임베디드 타입이란 별도의 테이블이 아닌 @Embedded가 정의된 엔티티와 같은 테이블에 매핑된다.
- `@Convert`: @Convert 애노테이션을 사용하여 해당 속성이 사용할 AttributeConverter 클래스를 지정한다.
    - 컨버터 적용을 원하는 프로퍼티 위에 @Convert 애노테이션을 붙이면 된다.
    - 우리가 미리 정의한 ListStringConverter 클래스를 지정했다.

## 테스트 코드 작성

우리가 작성한 ListStringConverter가 잘 작동되는지 확인하는 테스트 코드이다.

```java
package me.devstudy.account.endpoint;

import me.devstudy.account.domain.support.ListStringConverter;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ConverterTest {

    @Test
    void ListStringConverterTest() {
        ListStringConverter converter = new ListStringConverter();
        List<String> inputList = List.of("hello", "jpa", "world");

        String convertedToDb = converter.convertToDatabaseColumn(inputList);
        List<String> convertedToEntity = converter.convertToEntityAttribute(convertedToDb);

        assertThat(convertedToDb).isEqualTo("hello,jpa,world");
        assertThat(convertedToEntity).containsExactly("hello", "jpa", "world");
    }
}

```

테스트 결과 성공한 것을 확인할 수 있다.