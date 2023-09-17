---
title: "업캐스팅"

categories:
  - JAVAGrammar
tags:
  - Java 
  - Programming
---

## 업캐스팅
- 자식 객체를 부모타입으로 해석하는 것  

## 상속받을때  
~~~
//고양이 객체 생성
Cat cat = new Cat();

//업캐스팅 - 고양이는 동물이다(o)
Animal a = cat;
~~~

## implements때
- 인터페이스를 구현하는 객체는 인터페이스 타입으로 업캐스팅 될 수 있다.  
- 전혀 다른 객체들일지라도 같은 인터페이스를 구현하였다면, 업캐스팅을 통해 그룹화가 가능하다.  

~~~
//Flyable 인터페이스의 하위 객체 생성
Flyable b = new Bird();
Flyable h = new Helicopter();
Flyable r = new Rocket();

//인터페이스 타입 배열을 통한 객체 저장
Flyable[] arr = {b, h, r};
~~~

## 업캐스팅의 예시
~~~
Orderable f = new Food("족빌", 16000);
Orderable e = new Electronics("에어팟", 199000);
Orderable c = new Clothing("셔츠", 47000);

ArrayList<Orderable> list = new ArrayList<Orderable>();
list.add(f);
list.add(e);
list.add(c);

//총합 계산
int sum = 0;
for (int i = 0; i < list.size(); i++) {
  Orderable o = list.get(i);
  sum += o.discountedprice();
}

결과 출력
System.out.printf("총합: %d원", sum);
~~~  
이렇게 업캐스팅을 활용하여 Orderable이란 인터페이스로 생성자를 묶어서,  
객체를 만들수 있고, 또 이를 통해서 ArrayList를 만들어 활용할 수 있다.