---
title:  "람다식(Lambda Expression)"
categories:
  - Java
tags:
  - Java
toc: true
toc_sticky: true
---

지네릭스(Generics)의 등장과 람다식(Lambda Expression)의 등장으로 인해 자바는 새로운 변화를 맞이했다. 그 중 람다식에 대해 알아보겠다.

## 람다식이란?

`람다식(Lambda Expression)`이란 메서드를 하나의 식으로 표현한 것이다. 람다식은 함수를 **간략**하면서도 **명확**한 식으로 표현할 수 있게 해준다. 메서드를 람다식으로 표현하면 메서드의 이름과 반환값이 없어지기 때문에, 람다식은 `익명 함수`라고도 한다.

```java
int[] arr = new int[5];
Arrays.setAll(arr, (i) -> (int)(Math.random() * 5) + 1);
```

람다식은 간결하면서도 이해하기 쉽다는 장점이 있다. 또한, 메서드는 클래스에 포함되어야 한다는 제약이 있지만 람다식은 특별한 제약 없이 람다식 자체만으로도 이 메서드의 역할을 대신할 수 있다.

> **참고** 메서드와 함수의 차이
<br>
메서드는 함수와 같은 의미이지만, 특정 클래스에 반드시 속해야 한다는 제약이 있다. 그래서 기존의 함수와 같은 의미의 다른 용어를 선택해서 사용한 것이다. 그러나 이제 다시 람다식을 통해 메서드가 하나의 독립적인 기능을 하기 때문에 함수라는 용어를 사용한다.
> 

## 람다식 작성하기

람다식은 익명 함수 답게 메서드에서 이름과 반환타입을 제거하고 매개변수 선언부와 몸통{} 사이에 → 를 추가한다.

```java
반환티입 메소드명 (매개변수, ...) {
	  실행문
}

~~반환티입 메소드명~~ (매개변수, ...) -> {
	  실행문
}
```

```java
int max(int a, int b) {
    return a > b ? a : b;
}

(int a, int b) -> {
    return a > b ? a : b;
}
```

반환값이 있는 메서드의 경우, return문 대신 식으로 대신 할 수 있다. 식의 연산결과가 자동적으로 반환값이 된다. 이때는 문장이 아닌 식이므로 끝에 ;을 붙이지 않는다.

```java
(int a, int b) {
    return a > b ? a : b;
}

(int a, int b) -> a > b ? a : b
```

람다식에 선언된 매개변수의 타입은 추론이 가능한 경우는 생략할 수 있는데, 대부분의 경우에 생략가능하다. 람다식에 반환타입이 없는 이유도 항상 추론이 가능하기 때문이다.

```java
(int a, int b) -> a > b ? a : b

(a, b) -> a > b ? a : b
```

## 람다식의 장점과 단점

람다식을 사용하면 코드가 간결해지고 가독성이 높아진다.

하지만 디버깅이 어려우며 재사용이 불가능하므로 람다를 자주 사용하면 비슷한 함수가 중복 생성되어 코드가 지저분해 질 수 있다. 또한, 재귀로 만들 경우에 부적합하다. 결국, 상황에 따라 필요에 맞는 방법을 사용하는 것이 좋다.

## 함수형 인터페이스 (Functional Interface)

지금까지 람다식이 메서드와 동등한 것처럼 설명했지만, 람다식은 `익명 객체`와 동등하다.

```java
// 람다식
(a, b) -> a > b ? a : b
```

```java
// 익명 객체
new Object() {
    int max(int a, int b) {
        return a > b ? a : b;
    }
}
```

위에 람다식과 익명 객체의 코드는 동일한 코드이다.

익명 객체에 max()라는 메서드를 정의했지만 Object는 max()를 호출할 수 없다. (람다식도 마찬가지이다.)

```java
int value = f.max(3, 5); // 익명 객체의 메서드를 호출, 에러 발생
```

이런 문제를 해결하기 위해 사용하는 것이 `함수형 인터페이스`이다.

람다식을 다루기 위한 인터페이스를 함수형 인터페이스라 한다. 함수형 인터페이스는 오직 하나의 추상 메서드만 정의되어 있어야 한다.

```java
@FunctionalInterface
interface MyFunction {
    public abstract int max(int a, int b);
}

```

@FunctionalInterface를 통해 함수형 인터페이스를 정의하였기 때문에 익명 클래스에서 생성한 max()를 호출할 수 있다.

```java
// 익명 클래스: 클래스의 선언과 객체 생성을 동시에 한다.
MyFunction f = new MyFunction() {
    public int max(int a, int b) {
        return a > b ? a : b;
    }
}

int value = f.max(3, 5); // OK, MyFunction에 max()가 있음
```

마찬가지로 람다식도 함수형 인터페이스덕에 호출할 수 있게 되었다.

```java
// 람다식
MyFunction f = (a, b) -> a > b ? a : b

int value = f.max(3, 5); // OK
```

결론적으로 함수형 인터페이스를 이용해서 람다식을 다룰 수 있게 되었다. (단, 함수형 인터페이스의 메서드와 람다식의 매개변수 개수와 반환타입이 일치해야 함)

> **참고** @FunctionalInterface
<br>
@FunctionalInterface는 생략할 수 있지만 붙이면 함수형 인터페이스가 올바르게 사용되고 있는지 컴파일러가 체크해주므로 작성하는 것이 좋다.
> 

### 예제

```java
@FunctionalInterface
interface MyFunction {
    void run();
}

public class Ex14_1 {
    static void execute(MyFunction f) { // 매개변수의 타입이 MyFunction인 메서드
        f.run(); // public abstract void run();
    }

    static MyFunction getMyFunction() { // 반환 타입이 MyFunction(함수형 인터페이스)인 메서드
        MyFunction f = () -> System.out.println("f3.run()");
        return f;
    }

    public static void main(String[] args) {
        // 람다식으로 MyFunction의 run()을 구현
        MyFunction f1 = () -> System.out.println("f1.run()");

        MyFunction f2 = new MyFunction() { // 익명클래스로 run()을 구현
            public void run() { // public을 반드시 붙여야 함
                System.out.println("f3.run()");
            }
        };

        MyFunction f3 = getMyFunction();

        f1.run();
        f2.run();
        f3.run();

        execute(f1);
        execute(() -> System.out.println("run()"));
    }
}
```

## java.util.function

`java.util.function 패키지`에서 자주 쓰이는 형식의 메서드를 함수형 인터페이스로 미리 정의해놓았다. 따라서, 새로운 함수형 인터페이스를 정의하기 보단 java.util.function 패키지의 인터페이스를 활용하는 것이 좋다.

### 매개변수가 한 개인 함수형 인터페이스

| 함수형 인터페이스 | 메서드 | 설명 |
| --- | --- | --- |
| java.lang.Runnable | void run() | 매개변수도 없고, 반환값도 없음. |
| Supplier<T> | T get() | 매개변수는 없고, 반환값만 있음 (공급자) |
| Consumer<T> | void accept(T t) | Supplier와 반대로 매개변수만 있고, 반환값이 없음 (소비자) |
| Function<T, R> | R apply(T t) | 일반적인 함수. 하나의 매개변수를 받아서 결과를 반환 |
| Predicate<T> | boolean test(T t) | 조건식을 표현하는데 사용됨. 매개변수는 하나, 반환 타입은 boolean |

> **참고**
<br>
타입 문자 T는 Type, R은 Return Type을 의미한다.
> 

```java
// Predicate는 조건식을 람다식으로 표현할 때 사용
Predicate<String> isEmptyStr = s -> s.length() == 0;
String s = "";

if (isEmptyStr.test(s)) {
    System.out.println("This is an Empty String");
}
```

### 매개변수가 두 개인 함수형 인터페이스

매개변수의 개수가 2개인 함수형 인터페이스는 접두어 Bi가 붙는다.

| 함수형 인터페이스 | 메서드 | 설명 |
| --- | --- | --- |
| BiConsumer<T, U> | void accept(T t, U u) | 두개의 매개변수만 있고, 반환값이 없음 (소비자) |
| BiPredicate<T, U> | boolean test(T t, U u) | 조건식을 표현하는데 사용됨. 매개변수는 둘, 반환값은 boolean |
| BiFunction<T, U, R> | R apply(T t, U u) | 두 개의 매개변수를 받아서 하나의 결과를 반환 |

### UnaryOperator와 BinaryOperator

Function의 변형으로 UnaryOperator와 BinaryOperator가 있는데, 매개변수의 타입과 반환타입의 타입이 모두 일치한다.

| 함수형 인터페이스 | 메서드 | 설명 |
| --- | --- | --- |
| UnaryOperator | T apply(T t) | Function의 자손, Function과 달리 매개변수와 결과의 타입이 같다. |
| BinaryOperator | T apply(T t, T t) | BiFunction의 자손, BiFunction과 달리 매개변수와 결과의 타입이 같다. |

## 메서드 참조

람다식이 하나의 메서드만 호출하는 경우에는 메서드 참조(method reference)라는 방법으로 람다식을 간략히 할 수 있다.

```java
Function<String, Integer> f = (String s) -> Integer.parseInt(s); // 람다식
Function<String, Integer> f = Integer::parseInt; // 메서드 참조
```

하나의 메서드만 호출하는 람다식은 `클래스 이름::메서드 이름`으로 바꿀 수 있다.

생성자를 호출하는 람다식도 메서드 참조로 변환할 수 있다.

```java
Supplier<MyClass> s = () -> new MyClass(); // 람다식
Supplier<MyClass> s = MyClass::new; // 메서드 참조
```

```java
Function<Integer, MyClass> f = (i) -> new MyClass(); // 람다식
Function<Integer, MyClass> f = MyClass::new; // 메서드 참조
```

```java
Function<Integer, int[]> f = x -> new int[x]; // 람다식
Function<Integer, int[]> f = int[]::new; // 메서드 참조
```

> **참고**
<br>
메서드 참조는 코드를 간략히 하는데 유용해서 많이 사용한다. 람다식을 메서드 참조로 변환하는 엽습을 많이 하는 것이 좋다.
>