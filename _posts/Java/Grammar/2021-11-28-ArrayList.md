---
title: "ArrayList"

categories:
  - JAVAGrammar
tags:
  - Java 
  - Programming
---
## ArrayList  
- 사용하기위해서는 객체를 만들어야하는데, 저장할 객체의 타입을 <>안에 넣어줘야한다.  

~~~
//String 저장을 위한 객체 생성
ArrayList<String> names = new ArrayList<String>();
~~~
예시를 들어보면  

~~~
public static void main(String[] args) {
  // Book을 담기위한 ArrayList 객체
  ArrayList<Book> list = new ArrayList<Book>();

  // Book 객체를 생성
  Book onepiece = new Book("원피스", 4500);
  Book naruto = new Book("나루토", 4000);
  Book java = new Book("자바프로그래밍", 2400);

  // ArrayList객체에 Book객체를 넣기
  list.add(onepiece);
  list.add(naruto);
  list.add(java);

  // 리스트에 담긴 모든 책 정보 출력
  System.out.println("list.get(%d) -> %s\n", 0, list.get(0));
}
~~~
모든 내용이 출력된다.

## 정보 넣기
- .add메소드를 사용해서 정보를 넣을수 있다.  

~~~
list.add()
~~~

## 정보 꺼내 오기
- .get()을 사용해서 꺼내올수 있다.  

~~~
list.get()
~~~

## 정보수정  
- .set(인덱스, 수정할값); 으로 수정을 할수 있다.  

~~~
list.set(0, hahabook);
~~~  