---
title: "DataSource (데이터 소스)"
last_modified_at: 2022-10-26T15:40:00
categories:
  - Spring
tags:
  - Spring
  - DB
toc: true
toc_label: "Index"
toc_sticky: true
---

## DataSource 이해

커넥션을 얻는 방법은 **DriverManager**를 직접 사용해서 커넥션을 생성하는 방법과 **커넥션 풀**을 사용하는 방법이 있다.

우리가 앞서 JDBC로 개발한 애플리케이션처럼 DriverManager를 통해 커넥션을 획득하다가 커넥션 풀을 사용하는 방법(HikariCP 같은)으로 변경하려면 커넥션을 획득하는 애플리케이션 코드도 함께 변경해야 한다. 의존관계가 DriverManager에서 HikariCP로 변경되기 때문이다.

따라서, 커넥션을 획득하는 방법을 `추상화`해야 한다.

자바에서는 커넥션을 획득하는 방법을 추상화하기 위해 javax.sql.DataSource라는 인터페이스를 제공한다. 즉, `DataSource`는 **커넥션을 획득하는 방법을 추상화하는 인터페이스**이다.

![1](https://user-images.githubusercontent.com/79130276/197952461-7ac5ff3b-782c-4a91-8fa7-b5594f05f18b.png)

대부분의 커넥션 풀은 DataSource 인터페이스를 미리 구현해두어 `추상화`했다. 따라서, DBCP2 커넥션 풀, HikariCP 커넥션 풀의 코드를 직접 의존하는 것이 아닌 `DataSource 인터페이스`에만 **의존**하도록 애플리케이션 로직을 작성하면 된다. 커넥션 풀 구현 기술을 변경하고 싶으면 해당 구현체로 변경하면 된다.

DriverManager는 DataSource 인터페이스를 사용하지 않으므로 직접 사용해야 한다. 따라서 DriverManager를 사용하다가 DataSource기반의 커넥션 풀을 사용하도록 변경하면 관련 코드를 다 고쳐야 하는데 이런 문제를 해결하기 위해 스프링은 DriverManager도 DataSource를 통해서 사용할 수 있도록 DriverManagerDataSource라는 DataSource를 구현한 클래스를 제공한다.

**DriverManager를 통해 커넥션을 획득하는 방법**

```java
@Test
void driverManager() throws SQLException {
    Connection con1 = DriverManager.getConnection(URL,USERNAME,PASSWORD);
    Connection con2 = DriverManager.getConnection(URL,USERNAME,PASSWORD);
    log.info("connection={}, class={}", con1, con1.getClass());
    log.info("connection={}, class={}", con2, con2.getClass());
}
```

**DriverManagerDataSource를 통해 커넥션을 획득하는 방법**

```java
@Test
void dataSourceDriverManager() throws SQLException {
    // DriverManagerDataSource는 DataSource를 구현하고 있기 때문에 아래과 같이 작성할 수 있다. (28, 29 같은 코드)
    // DataSource dataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);
    DriverManagerDataSource dataSource = new DriverManagerDataSource(URL,USERNAME,PASSWORD);

    useDataSource(dataSource);
}

private void useDataSource(DataSource dataSource) throws SQLException {
    Connection con1 = dataSource.getConnection();
    Connection con2 = dataSource.getConnection();
    log.info("connection={}, class={}", con1, con1.getClass());
    log.info("connection={}, class={}", con2, con2.getClass());
}
```

기존 DriverManager와 DataSource를 통해 커넥션을 획득하는 방법은 비슷해보이지만 큰 차이가 있다. **DriverManager**는 커넥션을 획득할 때마다 URL, USERNAME, PASSWORD 같은 파라미터를 계속 전달해야 한다. 반면, **DataSource**는 처음 객체를 생성할 때만 필요한 파라미터를 전달하고 커넥션을 획득할 때는 dataSource.getConnection()만 호출하면 된다.

결과적으로 `설정과 사용을 분리`한 것이다.

### 설정과 사용의 분리

**설정:** DataSource를 만들고 필요한 속성들을 사용해서 URL, USERNAME, PASSWORD 같은 부분을 입력하는 것을 의미한다. 이렇게 설정과 관련된 속성들은 한곳에 있는 것이 향후 변경에 더 유연하게 대처할 수 있다.

**사용:** 설정은 신경쓰지 않고 DataSource의 getConnection()만 호출해서 사용하면 된다.

### DataSource 적용

DataSource를 외부에서 주입 받아 사용한다.(의존관계 주입, DI+OCP) `DataSource는 표준 인터페이스`이기 때문에 DriverManagerDataSource에서 HikariDataSource로 변경되어도 해당 코드를 변경하지 않아도 된다.

```java
/**
 * JDBC - DataSource 사용. JdbcUtils 사용
 */
@Slf4j
public class MemberRepositoryV1 {

    private final DataSource dataSource;

    public MemberRepositoryV1(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    //save()...
    //findById()...
    //update()....
    //delete()....

    private void close(Connection con, Statement stmt, ResultSet rs) {
        JdbcUtils.closeResultSet(rs);
        JdbcUtils.closeStatement(stmt);
        JdbcUtils.closeConnection(con);
    }

    private Connection getConnection() throws SQLException {
        Connection con = dataSource.getConnection();
        log.info("get connection={}, class={}", con, con.getClass());
        return con;
    }
}
```

```java
@Slf4j
class MemberRepositoryV1Test {

    MemberRepositoryV1 repository;

    @BeforeEach
    void beforeEach() {
        // 기본 DriverManager - 항상 새로운 커넥션을 획득
        // DriverManagerDataSource dataSource = new DriverManagerDataSource(URL, USERNAME, PASSWORD);

        // 커넥션 풀링
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(URL);
        dataSource.setUsername(USERNAME);
        dataSource.setPassword(PASSWORD);

        repository = new MemberRepositoryV1(dataSource);
    }

    ...
}
```

**DriverManagerDataSource 사용**

DriverManagerDataSource를 사용하면 conn0~5 번호를 통해서 항상 새로운 커넥션이 생성되어서 사용되는 것을 확인할 수 있다.

![2](https://user-images.githubusercontent.com/79130276/197952471-cfb27cee-1e17-482c-9319-cff4af5322c9.png)

```
get connection=conn0: url=jdbc:h2:.. user=SA class=class org.h2.jdbc.JdbcConnection
get connection=conn1: url=jdbc:h2:.. user=SA class=class org.h2.jdbc.JdbcConnection
get connection=conn2: url=jdbc:h2:.. user=SA class=class org.h2.jdbc.JdbcConnection
get connection=conn3: url=jdbc:h2:.. user=SA class=class org.h2.jdbc.JdbcConnection
get connection=conn4: url=jdbc:h2:.. user=SA class=class org.h2.jdbc.JdbcConnection
get connection=conn5: url=jdbc:h2:.. user=SA class=class org.h2.jdbc.JdbcConnection
```

**HikariDataSource 사용**

반면에, 커넥션 풀 사용 시 conn0 커넥션이 재사용되는 것을 확인 할 수 있다.

![3](https://user-images.githubusercontent.com/79130276/197952476-1cc33c00-95fa-433f-b66e-68ba6208fdc7.png)

> **참고** HikariDataSource
<br>
HikariDataSource는 HikariCP로부터 커넥션을 얻어올 수 있도록 하는 DataSource의 구현체이다. 
<br>
HikariDataSource를 만든 뒤 getConnection()을 하게 되면 HikariDataSource 내에 HikariPool이라는 클래스로부터 커넥션을 가져오게 된다.
> 

**참고 링크**

[HikariCP 커넥션 풀 최적 갯수 구하기](https://techblog.woowahan.com/2664/)