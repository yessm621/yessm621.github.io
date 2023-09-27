---
title:  "Optional 이란"
last_modified_at: 2022-02-24T11:00:00
categories:
  - Java
tags:
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---


## 1. 기존의 null 처리

아래 코드는 값(주소) 이 있다면 문제가 없는 코드이다.

```java
System.out.println(house.getAddress());
```

<br>

하지만, 값(주소) 이 없다면 NPE 가 발생 한다.

따라서, null 처리를 위해선 다음과 같이 코드를 작성하였다.

```java
if (house.getAddress() != null) {
		System.out.println(house.getAddress());
}
```

if 문을 사용하면 null 처리를 할 수 있다.

<br>

위의 코드는 간단하여 보기에 좋지만 수 많은 null 처리를 진행하게 되면 코드가 지저분해진다.

이럴때 사용하는게 `Optional 클래스`다. (java8 부터 지원)

<br>

## 2. Optional 클래스

Optional 클래스를 사용하면 보다 나은 null 처리를 할 수 있고 NPE(Null Point Exception) 를 방지 할 수 있다.

<br>

## 3. Optional 에서 제공하는 메서드

### 3.1 Optional 객체 생성

1. **Optional.of()**

    → value 가 null 인 경우 NPE 예외 발생. 값이 반드시 있어야 할 경우에 사용

    ```java
    // public static <T> Optional<T> of(T value);

    Optional<String> result = Optional.of(value);
    ```

2. **Optional.ofNullable()**

    → value 가 null 인 경우 비어있는 Optional 반환. 값이 null 일 수도 있는 경우에 사용

    ```java
    // public static <T> Optional<T> ofNullable(T value);

    Optional<String> result = Optional.ofNullable(null);
    ```

3. **Optional.empty()**

    → 비어있는 Optional 객체 생성

    ```java
    // public static<T> Optional<T> empty();

    Optional<String> result = Optional.empty();
    ```

<br>

### 3.2 Optional 중간 처리

1. **filter()**

    → predicate 값이 참이면 해당 필터를 통과시키고 거짓이면 통과 되지 않습니다.

    ```java
    // public Optional<T> filter(Predicate<? super T> predicate);

    Optional.of("1").filter((val) -> "1".eqauls(val)).orElse("NO DATA"); // "1"
    Optional.of("0").filter((val) -> "1".eqauls(val)).orElse("NO DATA"); // "NO DATA"
    ```

2. **map()**

    ```java
    // public<U> Optional<U> map(Function<? super T, ? extends U> mapper);

    // string to integer
    Integer test = Optional.of("1").map(Integer::valueOf).orElseThrow(NoSuchElementException::new);
    ```

<br>

### 3.3 Optional 종단 처리

1. **ifPresent()**

    ```java
    // public void ifPresent(Consumer<? super T> consumer);

    // ex1.
    Optional.of("test").ifPresent((value) -> {
    	// something to do
    });
    // ex2. (ifPresent 미수행)
    Optional.ofNullable(null).ifPresent((value) -> {
    	// nothing to do
    });
    ```

2. **isPresent()**

    → 객체가 존재하는지 여부 판별

    ```java
    // public boolean isPresent();

    Optional.ofNullable("1").isPresent(); // true
    Optional.ofNullable("1").filter((val) -> "0".eqauls(val)).isPresent(); // false
    ```

3. **get()**

    → 객체를 꺼냄 (비어있는 객체이면 예외 발생)

    ```java
    // public T get();

    Optional.of("test").get(); // 'test'
    Optional.ofNullable(null).get(); // Exception!!!
    ```

4. **Optional.orElse()**

    → 객체가 비어있다면 기본값 제공

    ```java
    // public T orElse(T other);

    Optional.ofNullable(null).orElse("default"); // 'default'
    ```

5. **Optional.orElseGet()**

    → 객체가 비어있다면 기본값 제공

    ```java
    // public T orElseGet(Supplier<? extends T> other);

    Optional.ofNullable("input").filter("test"::equals).orElseGet(() -> "default"); // 'default'
    ```

6. **Optional.orElseThrow()**

    ```java
    // public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X;

    Optional.ofNullable("input").filter("test"::equals).orElseThrow(NoSuchElementException::new);
    ```

<br>

만약 빈 Optional 객체에 get() 메서드를 호출할 경우 NoSuchElementException 발생

따라서, Optional 객체를 가져오기 전에 값이 있는지 확인 해야 함

두가지 방법이 있는데 아래 방법을 권장한다.

1. isPresent()-get()
2. orElse(), orElseGet(), orElseThrow() **(권장)**

<br>

## 4. Optional 을 잘 사용하는 방법

1. isPresent()-get() 대신 **orElse()/orElseGet()/orElseThrow()**
    
    ```java
    // 안 좋음
    Optional<Member> member = ...;
    if (member.isPresent()) {
        return member.get();
    } else {
        return null;
    }
    
    // 좋음
    Optional<Member> member = ...;
    return member.orElse(null);
    
    // 안 좋음
    Optional<Member> member = ...;
    if (member.isPresent()) {
        return member.get();
    } else {
        throw new NoSuchElementException();
    }
    
    // 좋음
    Optional<Member> member = ...;
    return member.orElseThrow(() -> new NoSuchElementException());
    ```
    
2. orElse(new ...) 대신 **orElseGet(() -> new ...)**
    
    ```java
    // 안 좋음
    Optional<Member> member = ...;
    return member.orElse(new Member());  // member에 값이 있든 없든 new Member()는 무조건 실행됨
    
    // 좋음
    Optional<Member> member = ...;
    return member.orElseGet(Member::new);  // member에 값이 없을 때만 new Member()가 실행됨
    
    // 좋음
    Member EMPTY_MEMBER = new Member();
    ...
    Optional<Member> member = ...;
    return member.orElse(EMPTY_MEMBER);  // 이미 생성됐거나 계산된 값은 orElse()를 사용해도 무방
    ```
    
3. 단지 값을 얻을 목적이라면 Optional 대신 null
4. Optional 대신 비어있는 컬렉션 반환
5. Optional 을 필드로 사용 금지
6. Optional 을 생성자나 메서드 인자로 사용 금지
7. Optional 을 컬렉션의 원소로 사용 금지
    
    ```java
    ex. 
    Map<String, Optional<String>> sports = new HashMap<>();
    ```
    
8. Optional<T> 대신 OptionalInt, OptionalLong, OptionalDouble
    
    → Type 이 Int, Long, Double 이면 OptionalInt, OptionalLong, OptionalDouble 을 사용하는게 좋음