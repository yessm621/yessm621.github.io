---
title: "객체 간의 변환 시, ModelMapper 사용해도 괜찮을까?"
categories:
  - Spring
tags:
  - Java
toc: true
toc_sticky: true
---

## 개요

객체 간의 변환 시 사용할 수 있는 방법은 자바 코드로 매핑하는 방법과 ModelMapper 라이브러리를 사용하는 방법이 있다.

두 가지 방법은 각각의 장/단점이 존재한다. 어떤 방식을 사용하는 것이 좋을까? 

## 자바 코드 매핑

라이브러리를 사용하지 않고 `자바 코드로 매핑`하는 방법이다. 직접 객체 상태 간의 매핑을 구현하기 때문에 코드를 작성해야 한다는 단점이 있지만 라이브러리를 사용하지 않기 때문에 ModelMapper와 같이 Reflection을 사용하는 라이브러리 보다 안전하다는 장점이 있다.

**자바 예시 코드**

```java
public static TodoDto toDto(Todo entity) {
    return TodoDto.builder()
            .title(entity.getTitle())
            .content(entity.getContent())
            .build();
}
```

## ModelMapper

`ModelMappe`란 객체 간의 변환을 위해 사용되는 라이브러리로 Entity → DTO 또는 DTO → Entity로 변환할 때 사용한다. ModelMapper는 Reflection API를 사용하여 객체를 매핑한다. ModelMapper를 사용하면 코드가 간단해진다는 장점이 있다.

**ModelMapper 라이브러리 추가**

```
implementation 'org.modelmapper:modelmapper:3.0.0'
```

**ModelMapper 예시 코드**

```java
import org.modelmapper.ModelMapper;

import java.util.List;

@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;
    private final ModelMapper modelMapper;

    @Override
    public void toEntity(TodoDto dto) {
        // modelMapper를 사용해서 dto를 entity로 변경.
        Todo todo = modelMapper.map(dto, Todo.class);
        todoRepository.save(todo);
    }
}
```

### ModelMapper 단점

장점이 강력한만큼 단점도 존재한다.

1. 모델이 단순하면 Mapper를 사용하는데에 큰 문제가 없다. 하지만, 매핑해야 하는 모델이 복잡해진다면 오히려 Mapper를 적용하는 것에 더 많은 시간과 비용이 들어간다.

2. Mapper를 사용하면 컴파일 시점에 오류를 잡을 수 없다.

3. ModelMapper는 내부적으로 Reflection을 사용하기 때문에 성능 이슈가 있다.

이러한 점 때문에 개발자들의 의견이 갈린다고 한다. 사실 이에 대한 정답은 없고 프로젝트의 상황에 따라 사용할 수도 있고 안할 수도 있다고 생각한다.

## 결론

그렇다면 자바 코드를 직접 사용해 객체를 변환하는 것이 좋을까? 아니면 ModelMapper를 사용하는게 좋은 방법일까?

자바 코드로 매핑 시 약간의 수고로움이 있지만 컴파일 시점에 오류를 잡을 수 있다는 점에서 Mapper를 사용하는 것보단 자바 코드로 매핑하는 것이 좋다고 생각한다.