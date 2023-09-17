---
title: "인터페이스"

categories:
  - JAVAGrammar
tags:
  - Java 
  - Programming
---
## 인터페이스  
- 미리 메소드를 만들어 놓은 함수  
- 인터페이스를 implements하면, 인터페이스 안에있는 __모든__ 메소드를 사용해야만 한다.  
- abstract는, 인터페이스와 같지만 부분적으로 메소드를 가져올 수 있다.  

~~~
interface Alarm {
  public void beep();
  public void playMusic();
}

class SmartPhone implements Alarm {
  public void beep() {
    System.out.println("삐삐!");
  }
  public voide playMusic() {
    System.out.println("동해물과 백두산!");
  }
}
~~~
이렇게 사용하면 된다.  
인터페이스를 사용하는 여러이유중 하나는, 생성자를 만들때, 인터페이스로 묶어주거나, 여러타입으로 해석하려고한다.  
아래 예시를 보면,  

~~~
// 스마트폰 객체 생성
SmartPhone sp = new SmartPhone();

// 스마트폰을 다양하게 해석(업캐스팅 - 상위 타입으로 해석)
Alarm a = sp; //스마트폰은 알람이다.(o)
Phone p = sp; //스마트폰은 전화기다.(o)
Messanger m = sp; //스마트폰은 메신저다.(o)
~~~
이런식으로 하나의 객체가 다양한 타입으로 해석되서 그렇다.  

