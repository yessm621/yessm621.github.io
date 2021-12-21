---
title:  "Optional 이란"
categories:
  - Java
tags:
  - Java
toc: true
toc_label: "Getting Started"
---


## 기존의 null 처리

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

이럴때 사용하는게 Optional 클래스다. (java8 부터 지원)

<br>
<br>

## Optional 클래스

Optional 클래스를 사용하면 보다 나은 null 처리를 할 수 있고 NPE(Null Point Exception) 를 방지 할 수 있다.

<br>

### Optional 에서 제공하는 메서드

**Optional 객체 생성**

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

**Optional 중간 처리**

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

**Optional 종단 처리**

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
