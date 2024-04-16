---
title: "정적 팩토리 메서드"
categories:
  - Architecture
tags:
  - Java
toc: true
toc_sticky: true
---

## 정적 팩토리 메서드란?

정적(static), 팩토리(factory), 메서드(method)

여기서 팩토리라는 용어가 조금 생소할 수 있다. GoF 디자인 패턴 중 팩토리 패턴에서 유래한 이 단어는 객체를 생성하는 역할을 분리하겠다는 취지가 담겨있다.

다시 말해, 정적 팩토리 메서드란 객체 생성의 역할을 하는 클래스 메서드라는 의미로 요약할 수 있다.

자바에서 객체를 생성할 때 new 키워드를 사용한다. 정적 팩토리 메서드는 new를 직접적으로 사용하지 않을 뿐, 정적 팩토리 메서드라는 클래스 내에 선언되어있는 메서드를 내부의 new를 이용해 객체를 생성해 반환하는 것이다. 즉, 정적 팩토리 메서드를 통해 new를 간접적으로 사용한다.

**생성자를 통한 객체 생성(new 사용)**

```java
String str1 = new String("hello");
```

**정적 팩토리 메서드를 통한 객체 생성**

```java
String str2 = String.valueOf("hello");
```

두 경우 모두 String 타입 객체를 반환해준다.

## 생성자와 정적 패토리 메서드

생성자를 통해 객체를 생성하는 방식과 정적 팩토리 메서드로 객체를 만드는 방식이 하는 일은 비슷해보인다. 하지만 다른 점이 있다.

### 정적 팩토리 메서드 장점

1. 이름을 가질 수 있다.
    - 정적 팩토리 메서드를 사용하면 메서드 네이밍에 따라 반환될 객체의 특성을 묘사할 수 있다. 즉, 코드의 가독성이 상승한다.
2. 호출할 때 마다 새로운 객체를 생성할 필요가 없다.
    - enum이 대표적인 예시이다.
    - 사용되는 값들의 개수가 정해져 있으면 해당 값을 미리 생성해놓고 조회(캐싱) 할 수 있는 구조로 만들 수 있다.
    
    ```java
    public class Day {
    
        private static final Map<String, Day> days = new HashMap<>();
    
        static {
            days.put("mon", new Day("Monday"));
            days.put("tue", new Day("Tuesday"));
            days.put("wen", new Day("Wednesday"));
            days.put("thu", new Day("Thursday"));
            days.put("fri", new Day("Friday"));
            days.put("sat", new Day("Saturday"));
            days.put("sun", new Day("Sunday"));
        }
    
        public static Day from(String day) {
            return days.get(day);
        }
    
        private final String day;
    
        private Day(String day) {
            this.day = day;
        }
    
        public String getDay() {
            return day;
        }
    }
    
    public static void main(String[] args) {
        Day day = Day.from("mon");
        System.out.println(day.getDay());
    }
    ```
    
    - 각 요일을 static을 통해 미리 생성. 미리 생성된 Day 객체를 찾아 반환만 하면 된다.
3. 하위 자료형 객체를 반환할 수 있다.
    - 상속을 사용 할 때 확인 할 수 있다. 정적 팩토리 메서드가 반환값을 반환할 때, 상황에 따라 하위 클래스 타입의 객체를 반환 해줄 수 있다.
4. 입력 매개변수에 따라 매번 다른 클래스의 객체를 반환할 수 있다.
    - 반환 타입의 하위 타입이기만 하면 어느 타입이든 객체를 반환해도 상관없다.
    - 만약, 특정 인터페이스들을 상속 받은 구현체들이 있을 때, 객체 생성 시 상황에 따라서 유동적으로 해당하는 구현체 타입으로 반환 한다고 생각 됨
5. 정적 팩토리 메서드를 작성하는 시점에는 반환할 객체의 클래스가 존재하지 않아도 된다.

### 정적 팩토리 메서드의 단점

- 상속에는 public 혹은 protected 생성자가 필요하므로 정적 팩토리 메서드만 제공할 경우, 상속이 불가능하다.
- 정적 팩토리 메서드를 다른 개발자들이 찾기 어렵다. → 정적 팩토리 메서드 컨벤션, API 문서를 잘 작성하면 해결할 수 있다.

## Lombok으로 정적 팩토리 메서드 정의

Lombok의 RequiredArgsConstructor를 사용하면 정적 팩토리 메서드를 쉽게 만들 수 있다.

```java
@RequiredArgsConstructor(staticName = "of")
public class Order {
    private final Long id;
    private final String name;

    public static void main(String[] args) {
        Order order = Order.of(1L, "hello");
    }
}
```