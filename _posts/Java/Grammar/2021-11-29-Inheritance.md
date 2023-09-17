---
title: "상속"

categories:
  - JAVAGrammar
tags:
  - Java 
  - Programming
---
## 상속  
- 하나의 클래스를 전수받아서 다른 클래스를 사용하는 것.  

~~~
class Novice {
  private String anme;
  private int hp;

  public void punch() {
    System.out.println("펀치!!");
  }
}
~~~
위에 처럼 Novice가 있다.  

~~~
class Wizard extends Novice {
  private int mp;

  public voide fireball() {
    System.out.prinln("파이어볼@@");
  }
}
~~~  
위 코드를 보면 Wizard가 Novice를 상속 받아서 Novice안에있는 name과 hp필드를 사용할 수 있고  
punch도 사용할수 있다.  
이렇게 상속을 받을땐, 생성자를 만들때 부모타입으로 객체를 해석할 수 있다.  

~~~
Novice wi = new Wizard();
~~~  

## Super
- 자식객체를 생성과 동시에 초기화 하려면, 부모의 생성자가 호출되어야 한다.  

~~~
//생성자 호출 영역
Wizard w = new Wizard("프로토", 100, 33);

//생성자 정의 영역
class Novice {
  protected String name;
  protected int hp;

  public Novice(String name, int hp) {
    this.name = name;
    this.hp = hp;
  }
}

class Wizard extends Novice {
  protected int mp

  public Wizard(String name, int hp, int mp) {
    super(name, hp); //부모 클래스 생성자 호출
    this.mp = mp;
  }
}
~~~  
이처럼 상속받은 클래스를 생성자로 사용할때,  
사용을 하려면 부모의 객체에도 생성자가 있어야하며, 이때 사용하는게 super다.  
