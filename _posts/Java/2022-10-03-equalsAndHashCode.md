---
title:  "객체 비교, equals()와 hashCode()"
categories: 
  - Java
toc: true
toc_sticky: true
---

## 값 비교

### 일반적인 값 비교

자바에서 값을 비교할 때 비교 연산자와 equals를 사용한다.

- 비교 연산자(==)는 `주소 값`을 비교한다. (동일성)
- equals()는 비교하고자 하는 대상의 `내용 자체(값)`를 비교한다. (동등성)

아래 코드를 살펴보자.

```java
String a = new String("Hello");
String b = new String("Hello");

System.out.println("a == b: " + (a == b)); // false
System.out.println("a.equals(b): " + a.equals(b)); // true
```

객체 a와 b는 서로 다른 객체이므로 비교 연산자를 사용하여 비교하면 false가 나온다. (주소 값이 다르기 때문)

반면, 서로 다른 객체이지만 값은 같으므로 equals()의 결과는 true가 나온다.

### 값 타입 객체의 값 비교

**값 타입 객체의 값 비교는 일반적인 값 비교와 결과가 다르다.**

아래 코드를 살펴보자.

```java
Member member1 = new Member("Hong", 20);
Member member2 = new Member("Hong", 20);

System.out.println("member1 == member2: " + (member1 == member2)); // false
System.out.println("member1.equals(member2): " + (member1.equals(member2))); // false
```

member1과 member2는 서로 다른 객체이므로 비교 연산자를 사용하면 false가 나온다.

member1과 member2는 서로 다른 객체이지만 값은 같다. 그래서 equals()의 결과가 true로 나올 것 같지만 false가 나온다. 왜 그럴까?

## equals()의 재정의

그 이유는 객체의 타입에 따라 사용되는 equals()가 다르기 때문이다.

**일반적인 값**을 비교할 때 사용하는 equals()는 String 클래스에 `재정의된 equals()`이다. equals()는 원래 Object 클래스에 정의되어 있는 메서드인데 String 클래스는 재정의된 equals()를 사용한다.

반면, Member 객체를 비교할 때 사용한 equals()는 Object 클래스에 있는 `원본 equals()`를 사용한다. Member 클래스에 재정의 하지 않았기 때문이다.

**Object 클래스의 equals() 메서드**

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

**String 클래스의 equals() 메서드**

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String aString = (String)anObject;
        if (coder() == aString.coder()) {
            return isLatin1() ? StringLatin1.equals(value, aString.value)
                              : StringUTF16.equals(value, aString.value);
        }
    }
    return false;
}
```

Object 클래스에 정의되어 있는 equals() 메서드의 내부 연산을 보면 비교 연산자를 사용하는 것을 확인할 수 있다. 비교 연산자는 값이 아닌 주소 값을 비교한다. 따라서, Member 객체를 비교했을 때 false가 반환된다.

그렇다면 동일 값을 가진 객체를 equals()로 비교했을 때 true가 나오게 하려면 어떻게 해야할까?

String 클래스에서 재정의 한 것처럼 Member 클래스에서 **equals()를 재정의**하면 된다.

```java
public class Test {

    static class Member {
        private String name;
        private int age;

        public Member(String name, int age) {
            this.name = name;
            this.age = age;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Member)) return false;
            Member member = (Member) o;
            return age == member.age && Objects.equals(name, member.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, age);
        }
    }

    public static void main(String[] args) {
        String a = new String("Hello");
        String b = new String("Hello");

        System.out.println("a == b: " + (a == b)); // false
        System.out.println("a.equals(b): " + a.equals(b)); // true

        Member member1 = new Member("Hong", 20);
        Member member2 = new Member("Hong", 20);

        System.out.println("member1 == member2: " + (member1 == member2)); // false
        System.out.println("member1.equals(member2): " + (member1.equals(member2))); // true
    }
```

equals()를 재정의했기 때문에 member1.equals(member2)의 결과는 true가 나온다.

그런데 위의 코드를 살펴보면 hashCode()도 같이 재정의 되었다.

## hashCode()를 함께 재정의하는 이유

IDE에서 equals()를 재정의하면 hashCode()도 함께 재정의한다. 그 이유는 hash를 사용하는 Collection(= HashMap, HashSet, HashTable)의 내부 비교 과정에 있다.

해시를 사용하는 **Collection은 내부적으로 hashCode()와 equals()를 사용하여 객체의 내용을 비교**한다. hashCode() 메서드의 리턴값이 일치하고 equals() 메서드의 리턴값이 true면 논리적으로 같은 객체라고 판단한다.

hashCode() 메서드를 재정의하지 않으면 Object 클래스의 hashCode() 메서드가 사용되고 객체의 주소 값을 이용하여 hash 값을 생성한다. 이처럼 객체의 주소 값을 기준으로 hash 값을 생성하면, 동일한 내용을 가진 객체도 다른 hash 값을 가지게 된다. → 동일한 내용의 객체 2개를 HashSet에 저장하게 된다.

**두 개의 객체는 equals로 비교도 하기 전에 서로 다른 hashCode 메서드의 리턴 값으로 인해 다른 객체로 판단된 것이다.**

따라서, 객체의 정확한 동등 비교를 위해서는 `equals() 메서드와 hashCode() 메서드를 같이 재정의`해야 한다.