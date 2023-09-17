---
title: "생성자"

categories:
  - JAVAGrammar
tags:
  - Java 
  - Programming
---
## 생성자  
- 생성자의 호출 & 정의  

~~~
Cat cat1 = new Cat("네로", 3.95, 3);

Cat(String s, double d, int i) {
  name = s; //이름 초기화
  weight = d; //무게 초기화
  age = i; //나이 초기화
}
~~~
생성자의 호출은  

~~~
클래스_타입 변수명 = new 클래스_이름(전달값);
~~~  
이런식으로 할 수 있음.  
여기서 생성자는 new Cat이다.  