---
title:  "트랜잭션 격리 수준(Transaction Isolation Level)"
categories:
  - DB
toc: true
toc_sticky: true
---
## 개요

트랜잭션의 격리 수준을 알아보기 전에 트랜잭션 ACID 속성에 대해 알아보고 그 중 Isolation(격리성)에 집중해서 살펴보자.

## 트랜잭션 ACID

ACID는 데이터베이스 내에서 일어나는 하나의 트랜잭션의 안전성을 보장하기 위해 필요한 성질이다. ACID는 각각 Atomicity (원자성), Consistency (일관성, 정합성), Isolation (격리성), Durability (지속성)이 있다.

### Atomicity (원자성)

원자성은 한 트랜잭션의 연산은 모두 성공하거나 모두 실패해야 한다는 성질이다.

### Consistency (일관성, 정합성)

트랜잭션을 수행하기 전이나 후나 데이터베이스는 항상 일관된 상태를 유지해야 한다. 즉, 트랜잭션이 일어난 이후의 데이터베이스는 데이터베이스의 제약이나 규칙을 만족해야 한다는 뜻이다.

- 예를 들어 ‘모든 고객은 반드시 이름을 가지고 있어야 한다’는 데이터베이스의 제약이 있다고 가정한다.
    - 다음과 같은 트랜잭션은 Consistency를 위반한다.
        - 이름 없는 새로운 고객을 추가하는 쿼리
        - 기존 고객의 이름을 삭제하는 쿼리

### Isolation (격리성)

트랜잭션 수행 시 다른 트랜잭션으로부터 독립되어야 한다. 하나의 트랜잭션이 다른 트랜잭션에게 영향을 주지 않도록 격리되어 수행되어야 한다.

### Durability (지속성)

성공적으로 수행된 트랜잭션은 영원히 반영되어야 한다. 중간에 DB에 오류가 발생해도 다시 복구되어야 한다.

- 예를 들어 은행에서 계좌이체를 성공적으로 실행한 뒤, 해당 은행 데이터베이스에 오류가 발생해 종료가 되더라도 계좌이체 내역은 기록으로 남아야 한다.
- 만약 계좌이체를 로그로 기록하기 전에 시스템 오류 등에 의해 종료가 된다면, 해당 이체 내역은 실패로 돌아가고 각 계좌들은 계좌이체 이전 상태들로 돌아가게 된다.

## 트랜잭션 Isolation

트랜잭션 격리 수준이란 여러 트랜잭션이 동시에 실행될 때 특정 트랜잭션이 다른 트랜잭션에서 데이터를 조회하거나 변경할 수 있게 허용할지를 결정하는 것이다.

트랜잭션 수행 중간에 다른 트랜잭션이 끼어들 수 없다면 모든 트랜잭션은 순차적으로 처리될 것이다. 또한 데이터의 정확성도 보장될 것이다. 하지만, 트랜잭션의 처리 속도가 매우 떨어질 것이다.

결국 트랜잭션의 완전한 격리보단 완화된 수준의 격리가 필요하다. 이처럼 **속도와 데이터 정확성에 대한 트레이드 오프를 고려하여 트랜잭션의 격리성 수준을 나눈 것**이 바로 `트랜잭션의 격리 수준`이다.

트랜잭션 격리 수준엔 4가지가 있다.

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

![4](https://github.com/user-attachments/assets/0096793d-b845-49e9-8405-b785539bd123)

- 트랜잭션 격리 수준 중 SERIALIZABLE이 격리 수준이 제일 높고 READ UNCOMMITTED이 제일 유연하다.

### READ UNCOMMITTED (커밋되지 않은 읽기)

`READ UNCOMMITTED`은 **다른 트랜잭션에서 커밋되지 않은 데이터에 접근할 수 있게 하는 격리 수준**이다. 가장 저수준의 격리 수준이며, 일반적으로 사용하지 않는 격리 수준이다. Oracle의 경우 READ UNCOMMITTED을 지원하지 않는다.

READ UNCOMMITTED을 사용하면 데이터 부정합이 발생할 수 있고 이는 애플리케이션에 치명적인 문제를 야기할 수 있다. 이처럼 커밋되지 않은 트랜잭션에 접근하여 부정합을 유발할 수 있는 데이터를 읽는 것을 **Dirty Read**[(링크)](https://yessm621.github.io/db/IsolationLevel/#%EC%9D%B4%EC%83%81-%ED%98%84%EC%83%811-dirty-read)라 한다.

### READ COMMITTED (커밋된 읽기)

`READ COMMITTED`는 **다른 트랜잭션에서 커밋된 데이터로만 접근할 수 있게 하는 격리 수준**이다. 대부분의 데이터베이스는  READ COMMITTED를 기본 격리 수준으로 사용한다.

예를 들어, 트랜잭션1과 트랜잭션2가 있다고 가정하자. 트랜잭션1은 데이터 A를 UPDATE 하여 B로 바꾸었고 Commit은 아직 하지 않았다. 이때 트랜잭션2가 데이터를 조회하면 UPDATE 하기 전인 A를 가져온다. READ COMMITTED은 UPDATE 전 값을 조회하기 위해 **Undo 영역**에서 조회한다.

따라서, READ COMMITTED에서는 Dirty Read가 발생하지 않는다. 하지만 **Non-repeatable Read**[(링크)]([https://yessm621.github.io/db/IsolationLevel/#이상-현상2-non-repeatable-read](https://yessm621.github.io/db/IsolationLevel/#%EC%9D%B4%EC%83%81-%ED%98%84%EC%83%812-non-repeatable-read))가 발생한다. Non-repeatable Read은 하나의 트랜잭션에서 동일한 SELECT 쿼리를 실행했을 때 다른 결과가 나타나는 것을 말한다.

### REPEATABLE READ(반복가능한 읽기)

`REPEATABLE READ`는 Non-repeatable Read 문제를 해결하는 격리 수준으로 **커밋된 데이터만 읽을 수 있으며 자신보다 낮은 트랜잭션 번호를 갖는 트랜잭션에서 커밋한 데이터만 읽을 수 있는 격리 수준**이다.

이게 가능한 이유는 **Undo Log** 때문이다. 또한, 트랜잭션 ID를 통해 Undo 영역의 데이터를 스냅샷 처럼 관리하여 동일한 데이터를 보장하는 것을 **MVCC(Multi Version Concurrency Control, 다중 버전 동시성 제어)**라고 한다. 

예를 들어, 트랜잭션 10번과 트랜잭션 13번이 있다고 가정할 때, 10번 트랜잭션은 10번 보다 작은 트랜잭션에서 커밋한 데이터만 읽을 수 있으므로 13번 트랜잭션에서 변경한 내용은 조회할 수 없다.

참고로 Oracle은 REPEATABLE READ를 지원하지 않고 대신 Exclusive Lock(배타적 잠금)을 사용하여 Non-repeatable Read 문제를 해결한다.

REPEATABLE READ는 Non-repeatable Read 문제를 해결할 수 있지만 **Phantom Read**[(링크)]([https://yessm621.github.io/db/IsolationLevel/#이상현상3-phantom-read](https://yessm621.github.io/db/IsolationLevel/#%EC%9D%B4%EC%83%81%ED%98%84%EC%83%813-phantom-read))는 해결할 수 없다. Phantom Read는 하나의 트랜잭션 내에서 여러번 실행되는 동일한 SELECT 쿼리에 대해 결과 레코드 수가 달라지는 현상을 말한다.

### SERIALIZABLE

SERIALIZABLE은 **가장 엄격한 격리 수준**으로 이름 그대로 **트랜잭션을 순차적으로 진행**된다. SERIALIZABLE는 여러 트랜잭션이 동일한 레코드에 동시에 접근할 수 없으므로 어떠한 이상 현상도 발생하지 않는다. 하지만 트랜잭션이 순차적으로 진행되므로 동시 처리 성능이 매우 떨어진다.

트랜잭션이 중간에 끼어들 수 없는 이유는 SELECT 쿼리 실행 시 Shared Lock(공유 잠금)을 INSERT, UPDATE, DELETE 쿼리 실행 시 Exclusive Lock(MySQL의 겨우 Nexy Key Lock)을 걸어버리기 때문이다.

> **참고** Undo 영역
> 
> 
트랜잭션의 속성 중 지속성(Durability)를 살펴보면 **트랜잭션에 대한 로그가 반드시 남아야 한다**는 성질이 있다.
> 
> 
> 트랜잭션에 대한 로그가 반드시 남아있어야 한다. 복구는 로그를 기반으로 처리된다. 이 로그는 크게 두가지가 있다. 오류에 의한 복구에 사용되는 **Redo Log**와 트랜잭션 롤백을 위해 사용되는 **Undo Log**이다.
> 
> - Redo는 다시 실행이란 뜻으로, 커밋된 트랜잭션에 대한 정보를 갖고 있다.
> - Undo는 실행취소란 뜻으로, 데이터베이스의 변경이 발생할 경우 변경되기 전 값과 이에 대한 PK를 갖고 있다.
> 
> `Undo 영역`이란 변경 전 데이터가 저장된 영역이고, Commit 하기 전 데이터를 읽어올 수 있는 이유는 Undo 영역에 있는 데이터를 읽어오기 때문이다.
> 

> **참고** Exclusive Lock (배타적 잠금 / 쓰기 잠금)
> 
> 
> `Exclusive Lock`이란 **특정 레코드나 테이블에 대해 다른 트랜잭션에서 읽기, 쓰기 작업을 할 수 없도록 하는 Lock** 이다. SELECT ~ FOR UPDATE 구문을 통해 사용할 수 있다.
> 
> SELECT ~ FOR UPDATE 를 사용하여 조회된 레코드에 대해 Exclusive Lock을 걸면 다른 트랜잭션에서 해당 레코드에 대해 쓰기 작업 시 LOCK이 해제될 때까지 대기한다.
> 
> Exclusive Lock은 기본적으로 읽기나 쓰기 작업을 할 수 없도록 한다. 그런데 만약, 다른 트랜잭션에서 SELECT를 통해 읽기 작업을 하고 있다면 이것이 가능한 이유는 **MVCC 기술을 통해** **Undo 영역에서 읽어오기 때문**이다.
> 

> **참고** MySQL 에서는 발생하지 않는 Phantom Read
> 
> 
InnoDB 엔진을 사용하는 MySQL에서는 Repeatable Read 수준에서 Phantom Read 현상이 발생하지 않는다. 그 이유는 SELECT ~ FOR UPDATE를 통해 Lock을 걸때 Exclusive Lock이 아닌 **Next Key Lock** 방식을 사용하기 때문이다.
> 

> **참고** Next Key Lock
> 
> 
> `Next Key Lock`은 조회된 레코드에 대한 Lock 뿐 아니라 **실행 쿼리에 대한 범위에 설정되는 Lock**이다. 즉, Next Key Lock은 Record Lock, Gap Lock이 조합된 Lock이다.
> 
> ```sql
> SELECT * FROM USERS WHERE ID BETWEEN 0 AND 10 FOR UPDATE
> ```
> 
> 예를 들어 위와같은 쿼리를 실행시키면, 조회된 레코드에 대한 Record Lock과, 0 < ID <=10 에 해당하는 범위에 해당하는 Gap Lock이 걸린다. 이뿐 아니다! 마지막으로 조회된 레코드의 Index인 ID에 대해 그 다음 존재하는 ID 까지의 범위를 Gap Lock으로 설정한다. 만약 아래와 같이 2 이후 ID가 20인 레코드가 있다면 2 ~ 20 까지 Gap Lock을 건다.
> 
> 때문에 다른 트랜잭션에서 SELECT 쿼리를 통해 정해진 GAP에 해당하는 데이터를 INSERT 시도할 경우 Gap Lock으로 인해 대기상태에 들어가기 되고, 이는 기존 트랜잭션의 여러 동일 SELECT 쿼리에 대한 동일성이 보장되게 된다.
> 참고로 SELECT * FROM USERS FOR UPDATE 쿼리를 실행한다면 조회된 모든 레코드에 대한 Lock과 모든 범위에 대한 GAP LOCK이 걸리게 된다.
> 

> **참고** Shared Lock
> 
> 
`Shared Lock`이란 다른 트랜잭션에서의 **읽기 작업은 허용**하지만, **쓰기 작업은 불가능**하도록 한다. SELECT ~ FOR SHARE 문법을 통해 사용하는데, 키 포인트는 이 Lock의 경우 동시에 Exclusive Lock을 허용하지 않는다는 것이다.
> 
> 
> SELECT 쿼리를 실행하면 Shared Lock이 걸리게 되고, 다른 트랜잭션에서 UPDATE, DELETE, INSERT와 같은 쿼리 실행 시 Exclusive Lock, Next Key Lock을 얻어오려고 할텐데 Shared Lock은 이를 허용하지 않아 대기 상태가 된다. 이러한 원리에 의해 트랜잭션들이 중간에 끼어들 수 없고 순차적으로 되는것이다.
>