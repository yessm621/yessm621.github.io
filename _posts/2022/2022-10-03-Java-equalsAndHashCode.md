---
title:  "equals와 hashCode"
last_modified_at: 2022-10-03T01:10:00
categories: 
  - Java
tags:
  - Java
toc: true
toc_label: "Index"
toc_sticky: true
---

## equals와 hashCode란?

equals와 hashCode는 Object 클래스에 정의되어 있다. 그렇기 때문에 모든 객체는 Object 클래스에 정의된 equals와 hashCode 함수를 상속받고 있다.

## equals(Object obj)

매개변수로 객체의 참조변수를 받아서 비교하여 그 결과를 boolean으로 알려주는 역할을 한다.

Object 클래스에 정의되어 있는 equals 메서드

```java
public voolean equals(Object obj) {
    return (this==obj);
}
```

두 객체의 같고 다름을 참조변수의 값으로 판단하며 서로 다른 두 객체를 equals 메서드로 비교하면 항상 false를 결과로 얻게 된다. 즉, 2개의 객체가 가리키는 곳이 동일한 메모리 주소일 경우에만 true를 반환한다.

```java
class EqualsEx {
    public static void main(String[] args) {
        Value v1 = new Value(10);
        Value v2 = new Value(10);
        if(v1.equals(v2))
            System.out.println("v1과 v2는 같습니다.");
        else
            System.out.println("v1과 v2는 다릅니다.");
        
        v2 = v1;
        if(v1.equals(v2))
            System.out.println("v1과 v2는 같습니다.");
        else
            System.out.println("v1과 v2는 다릅니다.");
    }
}

class Value {
    int value;

    Value(int value) {
        this.value = value;
    }
}
```

**실행결과**

```
v1과 v2는 다릅니다.
v1과 v2는 같습니다.
```

## hashCode()

hashCode 메서드는 해싱기법에 사용되는 해시함수를 구현한 것이다. 해싱은 데이터관리기법 중의 하나인데 다량의 데이터를 저장하고 검색하는 데 유용하다. 해시함수는 찾고자하는 값을 입력하면 그 값이 저장된 위치를 알려주는 해시코드를 반환한다.

일반적으로 해시코드가 같은 두 객체가 존재하는 것이 가능하지만, Object 클래스에 정의된 hashCode 메서드는 객체의 주소값을 이용해서 해시코드를 만들어 반환하기 떄문에 서로 다른 두 객체는 결코 같은 해시코드를 가질 수 없다.

## equals와 hashCode는 왜 같이 정의해야 할까?

동일한 객체는 동일한 메모리 주소를 갖는다는 것을 의미하므로 동일한 객체는 동일한 해시코드를 가져야 한다. 따라서, equals() 메서드와 hashCode() 메서드를 같이 오버라이딩해야 한다.

만일, hashCode 메서드를 오버라이딩하지 않는다면 Object 클래스에 정의된 대로 모든 객체가 서로 다른 해시코드 값을 가질 것이다.