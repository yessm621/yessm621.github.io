---
title: "프로젝션(Projection), DTO로 조회하는 방법"
last_modified_at: 2022-09-21T10:50:00
categories:
  - JPA
tags:
  - JPA
  - Querydsl
toc: true
toc_label: "Index"
toc_sticky: true
---

## 프로젝션

프로젝션이란 select 대상을 지정하는 것을 의미한다.

프로젝션 대상이 하나면 타입을 명확하게 지정할 수 있다. 그러나, 프로젝션 대상이 둘 이상이면 **튜플**이나 **DTO**로 조회해야 한다.

### 단일 프로젝션 조회

```java
@Test
void simpleProjection() {
    List<String> result = queryFactory
            .select(member.username)
            .from(member)
            .fetch();
}
```

### 프로젝션 대상이 여러개 - 튜플 조회

```java
@Test
void tupleProjection() {
    List<Tuple> result = queryFactory
            .select(member.username, member.age)
            .from(member)
            .fetch();
    for (Tuple tuple : result) {
        String name = tuple.get(member.username);
    }
}
```

프로젝션 타입이 2개 이상인 경우에 Tuple이 반환된다.

> **주의**
<br>
튜플은 Querydsl의 Tuple 객체이다. 따라서, **JPA에 종속적**이기 때문에 Repository 부분에서만 사용하고 그 이후는 **DTO**로 받는게 좋다.
> 

## 프로젝션과 결과 반환, DTO 조회

Querydsl에서 DTO로 프로젝션을 조회하는 방법은 4가지가 있다.

- setter를 통해 값을 주입
- 필드에 직접 주입
- 생성자를 통한 주입
- @QueryProjection를 통한 주입

### 순수 JPA에서 DTO 조회

순수 JPA에서 DTO를 조회할 때는 new 명령어를 사용해야한다. DTO의 package 이름을 다 적어줘야해서 **지저분**하며 생성자 방식만 지원한다.

```java
@Test
void findDtoByJPQL() {
    List<MemberDto> result = em.createQuery("select new study.querydsl.dto.MemberDto(m.username, m.age) from Member m",  MemberDto.class)
            .getResultList();
}
```

### 프로퍼티 접근 - setter

MemberDTO의 기본 생성자로 객체를 생성 후, 동일한 필드명을 가진 파라미터에 한해 setter로 값을 셋팅한다.

```java
@Test
void findDtoBySetter() {
    List<MemberDto> result = queryFactory
            .select(Projections.bean(MemberDto.class,
                    member.username,
                    member.age))
            .from(member)
            .fetch();
}
```

### 필드 직접 접근

setter나 생성자를 사용하지 않고 바로 필드에 값을 주입한다. 역시 필드명이 동일한 파라미터에 한해 동작한다.

```java
@Test
void findDtoByField() {
    List<MemberDto> result = queryFactory
            .select(Projections.fields(MemberDto.class,
                    member.username,
                    member.age))
            .from(member)
            .fetch();
}
```

### 생성자 사용

MemberDTO의 생성자를 이용해 객체를 셋팅한다. 만약, 파라미터에 맞는 생성자가 없는 경우, 런타임 에러가 발생한다.

```java
@Test
void findDtoByConstructor() {
    List<MemberDto> result = queryFactory
            .select(Projections.constructor(MemberDto.class,
                    member.username,
                    member.age))
            .from(member)
            .fetch();
}
```

### 필드명과 파라미터명이 다른 경우

```java
@Data
public class UserDto {

    private String name; // username
    private int age; // age
}
```

**fields 사용 - as()**

```java
@Test
void findUserDto() {
    List<UserDto> result = queryFactory
            .select(Projections.fields(UserDto.class,
                    member.username.as("name"),
                    ExpressionUtils.as(JPAExpressions
                            .select(memberSub.age.max())
                            .from(memberSub), "age")
            ))
            .from(member)
            .fetch();
}
```

- 프로퍼티나, 필드 접근 생성 방식에서 이름이 다를 때 해결 방안
- ExpressionUtils.as(source,alias): 필드나, 서브 쿼리에 별칭 적용
- username.as("memberName"): 필드에 별칭 적용

**construct 사용**

생성자를 사용할때는 UserDto에 @NoArgsConstructor, @AllArgsConstructor를 추가해야 한다.

```java
@Test
void findUserDtoByConstructor() {
    List<UserDto> result = queryFactory
            .select(Projections.constructor(UserDto.class,
                    member.username,
                    member.age))
            .from(member)
            .fetch();
}
```

## @QueryProjection

위의 3가지 방법보다 @QueryProjection를 사용하는게 깔끔한 방법이다. 생성자에 **@QueryProjection** 어노테이션을 추가한다. 

```java
@Data
@NoArgsConstructor
public class MemberDto {

    private String username;
    private int age;

    @QueryProjection
    public MemberDto(String username, int age) {
        this.username = username;
        this.age = age;
    }
}

```

어노테이션 추가 후 ./gradlew compileQuerydsl 실행한다. Q클래스파일(QMemberDto)이 생성되는지 확인한다.

```java
@Test
void findDtoByQueryProjection() {
    List<MemberDto> result = queryFactory
            .select(new QMemberDto(member.username,member.age))
            .from(member)
            .fetch();

    for (MemberDto memberDto : result) {
        System.out.println("memberDto = " + memberDto);
    }
}
```

앞서 사용했던 생성자 방법은 컴파일에서 체크하지 못하는 단점이 있다. 반면에, 이 방법은 컴파일러로 타입을 체크할 수 있으므로 가장 안전한 방법이다. 다만, DTO에 QueryDSL 어노테이션을 유지해야 하는 점과 DTO까지 Q 파일을 생성해야 하는 단점이 있다. 즉, DTO가 Querydsl에 독립적이지 못하다는 단점이 있다.