---
title:  "토비의 스프링 3.1 - 1장 오브젝트와 의존관계"
last_modified_at: 2022-03-12T20:06:00
categories: 
  - Spring
tags:
  - Spring
  - Java
toc: true
toc_label: "Getting Started"
toc_sticky: true
page_hidden: true
---

# 1장 오브젝트와 의존관계

스프링은 자바를 기반으로 한 기술

스프링이 자바에서 가장 중요하게 생각하는 가치 → 객체지향 언어라는 것!

<br>

스프링이 가장 관심을 많이 두는 대상은 오브젝트

스프링을 이해하려면 오브젝트에 깊은 관심을 가져야 함

애플리케이션에서 오브젝트가 생성되고 다른 오브젝트와 관계를 맺고, 사용, 소멸하기까지의 전 과정을 생각해야 함

<br>

객체지향 설계의 기초와 원칙, 디자인 패턴, 리팩토링, 단위 테스트와 같은 여러가지 응용 기술과 지식이 요구됨

<br>

1장에서는 스프링이 어떤 것이고 스프링이 관심을 갖는 오브젝트의 설계와 구현, 동작원리에 집중

<br>

## 1.1 초난감 DAO

<br>

> DAO
DAO(Data Access Object)는 DB를 사용해 데이터를 조회하거나 조작하는 기능을 전담하도록 만든 오브젝트
> 

<br>

### 1.1.1 User

사용자 정보를 저장할 때는 자바빈 규약을 따르는 오브젝트를 이용하면 편리함

<br>

> **자바빈**
다음 두 가지 관례를 따라 만들어진 오브젝트를 말함
* 디폴트 생성자: 자바빈은 파라미터가 없는 디폴트 생성자를 갖고 있어야 한다. 툴이나 프레임워크에서 리플렉션을 이용해 오브젝트를 생성하기 때문에 필요
* 프로퍼티: 자바진이 노출하는 이름을 가진 속성을 프로퍼티라 함. 프로퍼티는 setter와 getter를 이용해 수정 또는 조회 할 수 있음
> 

<br>

### 1.1.2 UserDao

사용자 정보를 DB에 넣고 관리할 수 있는 DAO 클래스를 생성

이를 UserDao라 하겠다.

<br>

**JDBC를 이용하는 작업의 순서**

1. DB 연결을 위한 Connection을 가져옴
2. SQL을 담은 Statement를 만듦
3. 만들어진 Statement를 실행
4. 조회의 경우 SQL 쿼리의 실행 결과를 ResultSet으로 받아서 정보를 저장할 오브젝트에 옮겨줌
5. 작업 중에 생성된 Connection, Statement, ResultSet 같은 리소스는 작업을 마친 후 반드시 닫아준다
6. JDBC API가 만들어내는 예외를 잡아서 직접 처리하거나, 메소드에 throws를 선언해서 예외가 발생하면 메소드 밖으로 던지게 함

<br>

DAO가 제대로 동작하는지 알 수 있는 방법은 웹 애플리케이션을 만들어 서버에 배치하고, 웹브라우저를 통해 DAO 기능을 사용해 보는 것. 그러나 간단한 UserDao 코드가 동작함을 확인하는  작업치고는 너무 부담이 크다.

<br>

### 1.1.3 main()을 이용한 DAO 테스트 코드

만들어진 코드의 기능을 검증하고자 할 때 사용할 수 있는 가장 간단한 방법은 `오브젝트 스스로 자신을 검증`하도록 만들어 주는 것

스태틱 메소드 main()을 이용!

<br>

위의 방식대로 코딩을 하게 되면 문제는 없지만 객체지향을 전혀 고려하지 않은 코드를 만들게 된다.

<br>

## 1.2 DAO의 분리

### 1.2.1 관심사의 분리

개발자가 객체를 설계할 때 가장 염두에 둬야 할 사항: **미래의 변화를 어떻게 대비**할 것인가이다

객체지향 기술은 변화에 효과적으로 대처할 수 있다는 특징이 있다

<br>

변경이 일어날 때 작업을 최소하하고 다른 곳에 문제를 일으키지 않게 하려면? → `분리와 확장`을 고려한 설계

<br>

분리에 대해 생각

변경에 대한 요청은 한가지 관심사항에 집중해서 일어난다. 그러나, 그에 따른 작업은 한곳에 집중되지 않는 경우가 많다.

<br>

프로그래밍 기초 개념 중 `관심사의 분리`

이를 객체지향에 적용해보면 관심이 같은 것끼리는 하나의 객체 안으로 모이게하고, 관심이 다른 것은 가능한 따로 분리하여 영향을 주지 않도록 한다.

<br>

> 관심사의 분리는 처음부터 완벽하게 설계된 채로 할 수는 없다. 처음에는 뭉뚱그려 쉽게 코딩하더라도 설계를 생각하며 지속적 리팩토리을 거치는 과정이 중요하다.
> 

<br>

### 1.2.2 커넥션 만들기의 추출

**UserDao의 관심사항**

UserDao 의 add() 메소드는 세 가지 관심사항이 있다.

UserDao.java

```java
    public void add(User user) throws SQLException, ClassNotFoundException {
    	// 1. 커넥션 가져오기
        Class.forName("org.postgresql.Driver");

        String user = "postgres";
        String password = "password";

        Connection c = DriverManager.getConnection(
                "jdbc:postgresql://localhost/toby_spring"
                , user
                , password
        );

        // 2. SQL 문장을 담을 Statement를 만들고 실행하기
        PreparedStatement ps = c.prepareStatement(
                "insert into users(id, name, password) values (?, ?, ?)"
        );
        ps.setString(1, user.getId());
        ps.setString(2, user.getName());
        ps.setString(3, user.getPassword());

        ps.executeUpdate();

        // 3. 리소스 반납하기
        ps.close();
        c.close();
    }
```

1. DB 연결을 위한 커넥션을 가져오는 것
2. DB에 보낼 SQL 문장을 담을 Statement를 만들고 실행
3. 공유 리소스인 Statement와 Connection 오브젝트를 닫아 시스템에 돌려주는 것

<br>

**중복 코드의 메소드 추출**

커넥션을 가져오는 중복 코드 분리. getConnection() 분리

```java
    public void add(User user) throws SQLException, ClassNotFoundException {
        // 1.2.2 중복 코드의 메소드 추출
        Connection c = getConnection();

        PreparedStatement ps = c.prepareStatement(
                "insert into users(id, name, password) values (?, ?, ?)"
        );
        ps.setString(1, user.getId());
        ps.setString(2, user.getName());
        ps.setString(3, user.getPassword());

        ps.executeUpdate();

        ps.close();
        c.close();
    }
    
    public User get(String id) throws SQLException, ClassNotFoundException {
        // 1.2.2 중복 코드의 메소드 추출
        Connection c = getConnection();

        PreparedStatement ps = c.prepareStatement(
                "select * from users where id = ?"
        );
        ps.setString(1, id);

        ResultSet rs = ps.executeQuery();
        rs.next();

        User user = new User();
        user.setId(rs.getString("id"));
        user.setName(rs.getString("name"));
        user.setPassword(rs.getString("password"));

        rs.close();
        ps.close();
        c.close();

        return user;
    }
    
    // 커넥션 가져오기 관심사
    public Connection getConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");

        String user = "postgres";
        String password = "password";

        Connection c = DriverManager.getConnection(
                "jdbc:postgresql://localhost/toby_spring"
                , user
                , password
        );
    }
```

<br>

**변경사항에 대한 검증: 리팩토링과 테스트**

공통의 기능을 담당하는 메소드로 중복된 코드를 뽑아내는 것을 **리팩토링**에서는 메소드 추출 기법이라 한다.

<br>

> **리팩토링**
리팩토링은 기존의 코드를 외부의 동작방식에는 변화없이 내부 구조를 변경해서 재구성하는 작업 또는 기술
리팩토링을 하면 코드 내부의 설계가 개선되어 코드를 이해하기가 더 편해지고, 변화에 효율적으로 대응 할 수 있다
생산성은 올라가고 코드의 품질은 높아지며 유지보수 용이해진다.
> 

<br>

### 1.2.3 DB 커넥션 만들기의 독립

서로 다른 2개의 DB 커넥션을 이용할 수 있는 UserDao를 구성해보자

<br>

**상속을 통한 확장**

UserDao를 추상 클래스로 구성. 상속하는 클래스에게 getConnection()을 직접 구현하라고 위임

```java
public abstract class UserDao {
    public void add(User user) throws SQLException, ClassNotFoundException {
        Connection c = getConnection();

        PreparedStatement ps = c.prepareStatement(
                "insert into users(id, name, password) values (?, ?, ?)"
        );
        ps.setString(1, user.getId());
        ps.setString(2, user.getName());
        ps.setString(3, user.getPassword());

        ps.executeUpdate();

        ps.close();
        c.close();
    }

    public User get(String id) throws SQLException, ClassNotFoundException {
        Connection c = getConnection();

        PreparedStatement ps = c.prepareStatement(
                "select * from users where id = ?"
        );
        ps.setString(1, id);

        ResultSet rs = ps.executeQuery();
        rs.next();

        User user = new User();
        user.setId(rs.getString("id"));
        user.setName(rs.getString("name"));
        user.setPassword(rs.getString("password"));

        rs.close();
        ps.close();
        c.close();

        return user;
    }

    public abstract Connection getConnection() throws ClassNotFoundException, SQLException;
}
```

NUserDao.java

```java
public class NUserDao extends UserDao{
    @Override
    public Connection getConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");

        String user = "postgres";
        String password = "password";

        Connection c = DriverManager.getConnection(
                "jdbc:postgresql://localhost/toby_spring"
                , user
                , password
        );

        return c;
    }
}
```

DUserDao.java

```java
public class DUserDao extends UserDao {
    @Override
    public Connection getConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");

        String user = "postgres";
        String password = "password";

        Connection c = DriverManager.getConnection(
                "jdbc:postgresql://localhost/toby_spring"
                , user
                , password
        );

        return c;
    }
}
```

NUserDao 와 DUserDao 가 UserDao 를 상속

<br>

슈퍼클래스에 기본적인 로직의 흐름을 만들고, 그 기능의 일부를 추상 메서드나 오버라이딩이 가능한 protected 메서드 등으로 만든 뒤 서브클래스에서 이런 메소드를 필요에 맞게 구현해서 사용하도록 하는 방법을 디자인 패턴에서 `템플릿 메소드 패턴`이라 함

<br>

추상 메소드를 정의하고 서브클래스에서 구체적인 오브젝트 생성 방법을 결정하게 하는 것을 `팩토리 메소드 패턴`이라고 부른다

<br>

다양한 디자인 패턴으로 상속구조를 통해 성격이 다른 관심사항을 분리한 코드를 만들어내고, 서로 영향을 덜 주도록 함

<br>

> **디자인 패턴**
소프트웨어 설계 시 특정 상황에서 자주 만나는 문제를 해결하기 위해 사용할 수 있는 재사용 가능한 솔루션을 말함
디자인 패턴은 주로 객체지향 설계에 관한 것이고, 대부분 객체지향적 설계 원칙을 이용해 문제를 해결함
패턴의 설계 구조는 대부분 비슷한데 확장성 추구 방법이 대부분 클래스 상속과 오브젝트 합성으로 이루어지기 때문
패턴을 적용할 상황, 해결해야 할 문제, 솔루션의 구조와 각 요소의 역할과 핵심 의도가 무엇인지 기억해야 함
> 

<br>

> **템플릿 메소드 패턴**
상속을 통해 슈퍼클래스의 기능을 확장할 때 사용하는 가장 대표적인 방법
변하지 않는 기능은 슈퍼클래스에 만들어두고 자주 변경되며 확장할 기능은 서브클래스에서 만든다.
슈퍼클래스에서는 추상 메서드 또는 오버라이드 가능한 메서드를 정의
슈퍼클래스에서 디폴트 기능을 정의해두거나 비워뒀다가 서브클래스에서 선택적으로 오버라이드 할 수 있도록 만들어둔 메서드를 훅 메서드라 한다.
> 

```java
public abstract class Super {
  public void templateMethod() {
    // 기본 알고리즘 코드
    hookMethod(); // 서브 클래스에서 선택적으로 작성한다.
    abstractMethod(); // 서브 클래스에서 필수적으로 작성한다.
    ...
  }
  
  protected void hookMethod() {} // 서브 클래스에서 선택적으로 오버라이드 가능
  public abstract void abstractMethod() // 서브 클래스에서 반드시 구현해야 하는 추상 메소드
}

public class Sub1 extends Super {
  protected void hookMethod() {
    ...
  }
  
  public void abstractMethod() {
    ...
  }
}
```

<br>

> **팩토리 메소드 패턴**
템플릿 메소드 패턴과 마찬가지로 상속을 통해 기능을 확장
서브 클래스에서 구체적인 오브젝트 생성 방법을 결정하게 하는 것을 팩토리 메소드 패턴이라 한다.
주로 인터페이스 타입으로 오브젝트를 리턴
> 

<br>

위의 두가지 패턴은 상속을 사용했다는 단점이 있다. 상속은 많은 한계점이 있다. 

- 만약 이미 다른 UserDao가 다른 목적을 위해 상속을 사용하고 있다면 위의 방법을 사용할 수 없다 (자바는 다중상속을 허용하지 않음)
- 또 다른 문제는 상속을 통한 상하위 클래스의 관계는 생각보다 밀접하다는 점. 슈퍼클래스의 변경이 있을 때 서브클래스를 함께 수정해야 할 수도 있다
- 현재 확장된 기능인 DB 커넥션을 생성하는 코드를 다른 DAO 클래스에서는 적용할 수 없다