---
title: "지네릭스(Generics)"
last_modified_at: 2022-12-14T14:10:00
categories:
  - Java
tags:
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---

## 지네릭스(Generics)

`지네릭스`는 **컴파일 시 타입을 체크**해주는 기능을 하며 객체의 **타입 안정성을 높이**고 **형변환의 번거로운을 줄여**준다.

### 컴파일 체크

**컴파일 시 타입을 체크**해주는 기능 (compile-time type check) - JDK 1.5

**지네릭스 적용 전**

```java
ArrayList tvList = new ArrayList();

tvList.add(new Tv()); // OK
tvList.add(new Audio()); // OK
```

ArrayList는 `Object 배열`을 가지고 있으므로 모든 종류의 객체를 저장할 수 있다. 따라서, Tv 타입만 저장하고 싶어도 tvList.add(new Audio());처럼 다른 타입을 저장해도 오류가 발생하지 않았다.

**지네릭스 적용 후**

```java
ArrayList<Tv> tvList = new ArrayList<Tv>();

tvList.add(new Tv()); // OK
tvList.add(new Audio()); // 컴파일 에러. Tv 외에 다른 타입은 저장 불가
```

하지만, 지네릭스가 도입되면서 타입(Tv)을 지정해주고 객체를 생성하면 해당 타입을 제외한 다른 타입을 사용하면 오류가 발생하게 된다. 즉, **컴파일러가 타입을 체크**해준다.

### 형변환 체크

**객체의 타입 안정성을 높**이고 **형변환의 번거로움을 줄여**준다.

**지네릭스 사용 전**

```java
public class GenericTest {

    public static void main(String[] args) {
        // JDK 1.5 이후
        ArrayList<Object> list = new ArrayList<Object>(); // 아래와 같은 코드이다. 
//        ArrayList list = new ArrayList(); // JDK 1.5 이전, 위에처럼 쓴다고 에러가 발생하는 것은 아니지만 이렇게 쓰는게 좋다.

        list.add(10);
        list.add(20);
        list.add("30");

        Integer i = (Integer) list.get(2); // 컴파일 OK, 실제 실행 시 형변환 에러(ClassCastException)가 발생한다.
        System.out.println("list = " + list);
    }
}
```

ArrayList가 Object 타입이므로 형변환을 해줘야하는 번거로움이 있다. 형변환 에러는 실행 시 발생하는 에러이다. 실행 시 발생하는 에러보다 컴파일 에러가 좋은 에러이다.

**지네릭스 사용 후**

```java
public class GenericTest {

    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<Integer>();
        list.add(10);
        list.add(20);
//        list.add("30"); // 지네릭스 덕분에 타입체크가 강화되어 컴파일 에러가 발생함
        list.add(30);

//        Integer i = (Integer) list.get(2);
        Integer i = list.get(2); // 형변환 생략 가능
        System.out.println("list = " + list);
    }
}
```

지네릭스 덕분에 타입체크가 강화되어 **컴파일 에러가 발생**한다. 따라서, 개발자는 코드를 잘못 작성한 것을 바로 알 수 있다. 또한, 이미 타입을 알고 있기 때문에 형변환을 생략할 수 있다.

> **참고**
형변환 에러(ClassCastException)는 RuntimeException이다. RuntimeException은 실행 중 발생하는 에러이다. 실행 중 에러가 발생하는 것보다 `컴파일 에러`가 좋은 에러이다.
> 

정리하자면, `지네릭스`를 사용하면 런타임 에러를 컴파일 에러로 끌어오기 때문에 좋은 코드를 작성하는데 있어 더 적합하다.

## 타입 변수

일반 클래스에선 Object 타입을 사용하지만, `지네릭 클래스`를 작성할 때는 Object 타입 대신 `타입 변수(E)`를 선언해서 사용한다. 일반 클래스(Object 타입 사용)에서 지네릭 클래스(타입 변수 E)로 변경되었다. (JDK 1.5부터 변경)

**지네릭 클래스**는 `타입 변수 E`를 선언한다.

```java
public class ArrayList<E> extends AbstractList<E> {
    private transient E[] elementData;
    public boolean add(E o) {}
    public E get(int index) {}
    ...
}
```

**타입 변수에 대입하기**

객체를 생성 시, 타입 변수(E) 대신 실제 타입(Tv)을 지정(대입)한다. 참조변수와 생성자에 넣어주며 타입이 일치 해야 한다.

```java
// 타입 변수 E 대신에 실제 타입 Tv를 대입
ArrayList<Tv> tvList = new ArrayList<Tv>();
```

E(타입 변수) 에서 Tv(실제 타입)로 변경하면 아래와 같은 코드가 된다. (Tv가 E에 대입됨)

```java
public class ArrayList<Tv> extends AbstractList<Tv> {
    private transient Tv[] elementData;
    public boolean add(Tv o) {}
    public Tv get(int index) {}
    ...
}
```

타입 변수 대신 실제 타입(여기선 Tv)이 지정되면, 형변환 생략이 가능하다.

```java
ArrayList tvList = new ArrayList();

tvList.add(new Tv());
Tv t = (Tv)tvList.get(0);
// 참조변수는 Tv, tvList.get(0)는 Object이므로 타입 불일치. 따라서, 형변환이 필요
```

```java
ArrayList<Tv> tvList = new ArrayList<Tv>();

tvList.add(new Tv());
Tv t = tvList.get(0); // 형변환 불필요
```

```java
class Tv { }

class Audio { }

public class GenericTest {

    public static void main(String[] args) {
        /*ArrayList<Object> list = new ArrayList<>();
        list.add(new Tv());
        list.add(new Audio());
        Tv t = (Tv) list.get(0); // 형변환 해주어야 한다.*/

        ArrayList<Tv> list = new ArrayList<Tv>(); // Tv 타입의 객체만 저장 가능
        list.add(new Tv());
//        list.add(new Audio()); // 에러 발생

        Tv t = list.get(0); // 형변환 불필요
    }
}
```

## 지네릭스 용어

- Box<T>: `지네릭 클래스`. T의 Box 또는 T Box라고 읽는다.
- T: `타입 변수` 또는 타입 매개변수(T는 타입 문자)
- Box: 원시 타입(raw type) `일반클래스`

```java
class Box<T> {}
Box<String> b = new Box<String>(); // 생성할 때마다 다른 타입을 넣어줄 수 있다.
```

### 지네릭 타입과 다형성

참조 변수와 생성자의 대입된 타입은 일치해야 한다.

```java
ArrayList<Tv> list = new ArrayList<Tv>(); // OK. 일치
ArrayList<Product> list = new ArrayList<Tv>(); // 에러. 불일치
```

지네릭 클래스간의 **다형성**은 성립한다. (여전히 대입된 타입은 일치해야 함)

```java
List<Tv> list = new ArrayList<Tv>(); // OK. 다형성 ArrayList가 List를 구현
List<Tv> list = new LinkedList<Tv>(); // OK. 다형성 LinkedList가 List를 구현
```

매개변수의 **다형성**도 성립한다.

```java
class Product {}
class Tv extends Product {}
class Audio extends Product {}

ArrayList<Product> list = new ArrayList<Product>();
list.add(new Product());
list.add(new Tv()); // Tv는 Product의 자손. OK
list.add(new Audio()); // Tv는 Product의 자손. OK
```

**지네릭스 클래스. 다형성에 대한 예제 코드**

```java
class Product {}
class Tv extends Product {}
class Audio extends Product {}

public class Ex12_1 {
    public static void main(String[] args) {
        ArrayList<Product> productList = new ArrayList<Product>();
        ArrayList<Tv> tvList1 = new ArrayList<Tv>();
//        ArrayList<Product> tvList2 = new ArrayList<Tv>(); // 에러
//        List<Tv> tvList3 = new ArrayList<Tv>(); // OK. 다형성

        productList.add(new Tv()); // public boolean add(Product e) {} : Product와 그 자손은 다 OK. 이것이 다형성
        productList.add(new Audio()); // OK.

        tvList1.add(new Tv()); // public boolean add(Tv e) {} : Tv 또는 그 자손 객체만 OK.
//        tvList1.add(new Audio()); // 에러

        printAll(productList);
//        printAll(tvList1); // 컴파일 에러가 발생
    }

    private static void printAll(ArrayList<Product> list) {
        for (Product p : list) {
            System.out.println("p = " + p);
        }
    }
}
```