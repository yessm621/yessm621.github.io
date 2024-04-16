---
title:  "내부 클래스"
categories:
  - Java
toc: true
toc_sticky: true
---

## 내부 클래스란?

`내부 클래스`는 **클래스 내에 선언된 클래스**다. 클래스에 다른 클래스를 선언하는 이유는 두 클래스가 서로 긴밀한 관계에 있기 때문이다.

### 내부 클래스의 장점

- 내부 클래스에서 외부 클래스의 멤버들을 쉽게 접근할 수 있다.
- 코드의 복잡성을 줄일 수 있다.

```java
class A {
    ...
}

class B {
    ...
}
```

```java
// 외부 클래스(outer class)
class A { // B의 외부 클래스

    // 내부 클래스(inner class)
    class B { // A의 내부 클래스
        ...
    }
}
```

## 내부 클래스의 종류와 특징

`내부 클래스의 종류`는 **변수의 선언위치에 따른 종류와 같다**. 내부 클래스는 마치 변수를 선언한 것과 같은 위치에 선언할 수 있으며, 변수의 선언위치에 따라 인스턴스 변수, 클래스 변수, 지역 변수로 구분되는 것과 같이 내부 클래스도 선언위치에 따라 아래와 같이 구분된다.

| 내부 클래스 | 특징 |
| --- | --- |
| 인스턴스 클래스 | 외부 클래스의 멤버변수 선언위치에 선언하며, 외부 클래스의 인스턴스 멤버처럼 다루어진다. 주로 외부 클래스의 인스턴스 멤버들과 관련된 작업에 사용될 목적으로 선언된다. |
| 스태틱 클래스 | 외부 클래스의 멤버변수 선언위치에 선언하며 외부 클래스의 static 멤버처럼 다루어진다. 주로 외부 클래스의 static 멤버, 특히 static 메서드에서 사용될 목적으로 선언된다. |
| 지역 클래스 | 외부 클래스의 메서드나 초기화 블럭 안에 선언하며, 선언된 영역 내부에서만 사용될 수 있다. |
| 익명 클래스 | 클래스의 선언과 객체의 생성을 동시에 하는 이름없는 클래스(일회용) |

```java

class A {

    // 인스턴스 클래스
    class InstanceInner {}

    // 스태틱 클래스
    static class StaticInner {}

    void methodA() {
        // 지역 클래스
        class LocalInner {}
    }    
}
```

> **참고** 내부 클래스의 선언과 변수의 선언
> 
> 내부 클래스는 변수와 마찬가지로 선언된 위치에 따라 종류가 달라진다. 또한, `유효범위(scope)`와 `접근성(accessibility)`도 변수와 동일하다.
> 
> ```java
> // 변수 선언 위치에 따른 종류
> class Outer {
>     int iv = 0; // 인스턴스 변수
>     static int cv = 0; // 클래스(스태틱) 변수
> 
>     void myMethod() {
>         int lv = 0; // 지역변수
>     }
> }
> ```
> 

## 내부 클래스의 제어자와 접근성

내부 클래스도 클래스이기 때문에 abstract나 final과 같은 제어자를 사용할 수 있을 뿐만 아니라, 멤버 변수들처럼 private, protected과 접근제어자도 사용이 가능하다.

```java
class InnerEx1 {
    class InstanceInner {
        int iv = 100;
        //static int cv = 100; // 오류 발생
        final static int CONST = 100;
    }

    static class StaticInner {
        int iv = 200;
        static int cv = 200;
    }

    void myMethod() {
        class LocalInner {
            int iv = 300;
            //static int cv = 300; // 오류 발생
            final static int CONST = 300;
        }
    }

    public static void main(String args[]) {
        System.out.println(InstanceInner.CONST);
        System.out.println(StaticInner.cv);
    }
}
```

**실행결과**

```
100
200
```

내부 클래스 중에서 **스태틱 클래스만 static 멤버**를 가질 수 있다. 내부 클래스에 static 변수를 선언해야 한다면 스태틱 클래스로 선언해야 한다. 다만, final과 static이 동시에 붙은 변수는 상수이므로 모든 내부 클래스에서 정의가 가능하다.

```java
package hello.core;

class InnerEx2 {
    class InstanceInner {
    }

    static class StaticInner {
    }

    // 인스턴스 멤버 간에는 서로 직접 접근가능
    InstanceInner iv = new InstanceInner();

    // static 멤버 간에는 서로 직접 접근가능
    static StaticInner cv = new StaticInner();

    static void staticMethod() {
        // static 멤버는 인스턴스 멤버에 직접 접근 불가
        //InstanceInner obj1 = new InstanceInner(); // 에러 발생
        StaticInner obj2 = new StaticInner();

        // 굳이 접근을 하려면 외부 클래스를 먼저 생성하고 인스턴스 클래스를 생성
        InnerEx2 outer = new InnerEx2();
        InstanceInner obj = outer.new InstanceInner();
    }

    void instanceMethod() {
        // 인스턴스 메서드에서는 인스턴스 멤버와 static 멤버 모두 접근 가능
        InstanceInner obj1 = new InstanceInner();
        StaticInner obj2 = new StaticInner();

        // 메서드 내에 지역적으로 선언된 내부 클래스는 외부에서 접근 불가
        //LocalInner lv = new LocalInner(); // 에러 발생
    }

    void myMethod() {
        class LocalInner {}

        LocalInner lv = new LocalInner();
    }
}
```

인스턴스 클래스는 외부 클래스의 인스턴스 멤버를 객체 생성 없이 사용할 수 있지만, 스태틱 클래스는 외부 클래스의 인스턴스 멤버를 객체 생성 없이 사용할 수 없다. 마찬가지로 인스턴스 클래스는 스태틱 클래스의 멤버들을 객체 생성 없이 사용할 수 있지만, 스태틱 클래스에서는 인스턴스 클래스의 멤버들을 객체 생성 없이 사용할 수 없다.

```java
class InnerEx3 {
    private int outerIv = 0;
    static int outerCv = 0;

    class InstanceInner {
        int iiv = outerIv;
        int icv = outerCv;
    }

    static class StaticInner {
        //int siv = outerIv; // 에러 발생
        int scv = outerCv;
    }

    void myMethod() {
        int lv = 0;
        final int LV = 0;

        class LocalInner {
            int liv = outerIv;
            int lcv = outerCv;

            int liv3 = lv; // JDK 1.8부터 에러 안남
            int liv4 = LV;
        }
    }
}
```

내부 클래스에서 외부 클래스의 변수들에 대한 접근성을 보여주는 예제이다. 인스턴스 클래스는 외부 클래스의 인스턴스 멤버이기 때문에 인스턴스 변수와 static 변수를 모두 사용할 수 있다.

스태틱 클래스는 외부 클래스의 static 멤버이기 때문에 인스턴스 멤버는 사용할 수 없다.

## 익명 클래스

`익명 클래스(anonymous class)`는 다른 내부 클래스와 달리 이름이 없다. **클래스의 선언과 객체의 생성을 동시**에 하기 때문에 **단 한번만 사용**할 수있고 **오직 하나의 객체만 생성**할 수 있는 일회용 클래스이다.

```java
new 조상클래스이름() {
	// 멤버 선언
}

new 구현인터페이스이름() {
	// 멤버 선언
}

// new Object {}
```

이름이 없기 때문에 생성자도 가질 수 없고, 조상 클래스의 이름이나 구현하고자 하는 인터페이스의 이름을 사용하여 정의하기 때문에 하나의 클래스를 상속받는 동시에 인터페이스를 구현하거나 둘 이상의 인터페이스를 구현할 수 없다. 오로지 **단 하나의 클래스를 상속**받거나 **단 하나의 인터페이스를 구현**해야만 한다.

익명 클래스는 구문이 다소 생소하지만, 인스턴스 클래스를 익명 클래스로 바꾸는 연습을 몇 번만 하면 곧 익숙해질 것이다.

아래 예제는 익명클래스의 사용 예이다.

```java
class InnerEx4 {
    Object iv = new Object() { void method() {} };
    static Object cv = new Object() { void method() {} };

    void method() {
        Object lv = new Object() { void method() {} };
    }
}
```

위 코드를 컴파일하면 4개의 클래스파일이 생성된다.

```
InnerEx4.class
InnerEx4$1.class <- 익명 클래스
InnerEx4$2.class <- 익명 클래스
InnerEx4$3.class <- 익명 클래스
```

익명 클래스는 이름이 없기 때문에 `외부 클래스명$숫자.class`의 형식으로 클래스 파일명이 결정된다.

**익명 클래스 적용 전**

```java
package hello.core;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

class InnerEx5 {
    public static void main(String[] args) {
        Button b = new Button("Start");
        b.addActionListener(new EventHandler());
    }
}

class EventHandler implements ActionListener {
    public void actionPerformed(ActionEvent e) {
        System.out.println("ActionEvent occurred!!!");
    }
}
```

**익명 클래스 적용 후**

```java
package hello.core;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class InnerEx6 {
    public static void main(String[] args) {
        Button b = new Button("Start");
        b.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                System.out.println("ActionEvent occurred!!!");
            }
        });
    }
}
```

InnerEx5를 익명 클래스를 이용해 변경한 것이 InnerEx6이다. 먼저 두 개의 독립된 클래스를 작성한 후 다시 익명 클래스를 이용하여 변경하면 보다 쉽게 코드를 작성할 수 있다.