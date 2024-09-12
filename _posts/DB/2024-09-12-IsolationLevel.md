---
title:  "트랜잭션 격리 수준(Transaction Isolation Level)"
categories:
  - DB
toc: true
toc_sticky: true
---

## 개요

트랜잭션 격리 수준이란 여러 트랜잭션이 동시에 실행될 때 특정 트랜잭션이 다른 트랜잭션에서 데이터를 조회하거나 변경할 수 있게 허용할지를 결정하는 것이다.

트랜잭션 격리 수준을 알아보기 전에 3가지 대표적인 이상 현상에 대해 알아보자.

## 이상 현상1: Dirty Read

![1](https://github.com/user-attachments/assets/d8c09e47-3691-4b6e-979a-e0f77eadbedc)

- 초기값: x = 10, y = 20
- 트랜잭션2에서 y를 70으로 변경 후, 트랜잭션1이 y를 읽는다.
- y는 커밋되지 않은 상태이고 x는 x에 y를 더하여 80이 된다.
- 그런데 트랜잭션2에 문제가 생겨 롤백(Rollback)하게 되었다.
- 트랜잭션1, 2를 모두 마친 결과는 x = 80, y = 20 이다. 생각해보면 x 값이 이상하다.
- 이는 **commit 되지 않은 변화를 읽음**으로써 발생하는 문제이다. 이러한 현상을 `Dirty Read`라고 한다.

## 이상 현상2: Non-repeatable Read

![2](https://github.com/user-attachments/assets/fb0f7b3a-5436-48a4-ac47-9fd38368860c)

- 초기값: x = 10
- 트랜잭션1에서 x를 읽는다. → 10
- 트랜잭션2에서 x를 읽는다. 그 후 x에 40을 더하므로 x는 50이 된다. 커밋한다.
- 트랜잭션1에서 다시 x를 읽는다. → 50
- 같은 x를 읽었지만 첫번째는 10, 두번째는 50이 된다.
- 이는 트랜잭션의 isolation을 위반하는 것이다.
    - 트랜잭션의 isolation은 여러 트랜잭션이 동시에 실행되도 각각의 트랜잭션이 혼자 동작하는 것처럼 실행되어야 한다.
    - isolation에 따르면 X 값을 두번 읽었을 때 같은 값을 읽어야 한다.
- 이러한 현상을 `Non-repeatable Read` 또는 `Fuzzy Read`라고 한다.

## 이상현상3: Phantom Read

![3](https://github.com/user-attachments/assets/7ec0fe98-86c3-484b-b081-d5e2e0e5e7f3)

- 트랜잭션1에서 v가 10일 때 값을 읽는다. → t1
- 트랜잭션2에서 t2의 v를 10으로 변경한다. 그 후 커밋한다.
- 트랜잭션1에서 v가 10일 때 값을 읽는다. → t1, t2
- 동일한 조건으로 두번 값을 읽었는데 각각의 결과가 다르다.
- 트랜잭션의 isolation의 관점에서 볼 때 이상 현상이라고 할 수 있다.
- 이처럼 **없던 데이터가 생기는 이상 현상**을 `Phantom Read`라 한다.

## Isolation Level

지금까지 이상 현상 3가지에 대해 알아보았다.

- Dirty Read
- Non-repeatable Read
- Phantom Read

이러한 이상 현상들이 발생하지 않도록 할 수는 있지만 그러면 제약사항이 많아져서 동시 처리 가능한 트랜잭션 수가 줄어든다. 결국, DB의 전체 처리량(throughput)이 하락하게 된다.

이런 문제를 해결하기 위해 일부 이상한 현상은 허용하는 몇 가지 level을 만들어서 사용자가 필요에 따라서 적절할게 선택할 수 있도록 한 것이 `Isolation Level`이다.

트랜잭션 격리 수준엔 4가지가 있다.

- READ UNCOMMITED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

![4](https://github.com/user-attachments/assets/0096793d-b845-49e9-8405-b785539bd123)

- O: 허용 / X: 허용하지 않음
- 트랜잭션 격리 수준 중 SERIALIZABLE이 격리 수준이 제일 높고 READ UNCOMMITED이 제일 유연하다.
- READ UNCOMMITED: 3가지 이상 현상을 모두 허용한다. 가장 자유롭지만 이상 현상에 가장 취약하다. 동시성은 높아져서 전체 처리량은 가장 높다.
- SERIALIZABLE: 3가지 이상 현상을 모두 허용하지 않는다. 또한, 위 3가지 현상 뿐만 아니라 모든 이상 현상 자체가 발생하지 않는 level을 의미한다.

## 정리

세 가지 이상 현상을 정의하고 어떤 현상을 허용하는지에 따라서 각각의 Isolation Level이 구분된다. 그리고 애플리케이션 설계자는 Isolation Level을 통해 전체 처리량(throughput)과 데이터 일관성 사이에서 어느 정도 거래(trade)를 할 수 있다.

## 참고

3가지 이상 현상에 대한 내용은 1992년 11월에 발표된 SQL 표준에서 정의된 내용이다. (standard SQL 92 Isolation Level)

그런데 1995년에 standard SQL 92 Isolation Level에 대해 비판하는 논문이 나온다. 그 내용은 다음과 같다.

1. 세 가지 이상 현상의 정의가 모호하다.
2. 이상 현상은 세 가지 외에도 더 있다.
3. 상업적인 DBMS에서 사용하는 방법을 반영해서 Isolation Level을 구분하지 않았다.

논문에서 말하는 세 가지 이상 현상 외에 것도 살펴보자.

### 이상현상4: Dirty Write

![5](https://github.com/user-attachments/assets/2019d365-07b5-44f7-ae38-d2260bf760d2)

- 초기값: x = 0
- 트랜잭션1은 x를 10으로 바꾸는 작업을 수행하고, 트랜잭션2는 x를 100으로 바꾸는 작업을 수행한다.

- 트랜잭션1이 먼저 실행되어 x를 10으로 바꾸었다.
- 그 후 트랜잭션2가 실행되어 x를 100으로 바꾸었다.
- 그런데 트랜잭션1에서 abort가 발생했다.
- 따라서 트랜잭션1을 기준으로 x가 10이 되기 전의 값인 0으로 변경해야 하는데 그러면 트랜잭션2에서 x를 100으로 변경한 것을 없애야 한다.
- 사용자는 트랜잭션2 작업을 없애고 싶지 않아 롤백 작업을 하지 않았다고 가정하자.
- 이후 트랜잭션2에서도 abort가 생겨 롤백을 해야 한다. 트랜잭션2 기준으로 변경되기 전의 x값은 10이므로 10으로 롤백한다.
- 10이란 값도 트랜잭션1이 변경한 값이므로 사실 10으로 변경해서는 안된다.
- 이처럼 **커밋이 안된 데이터를 write를 함으로써 발생하는 이상 현상**을 `Dirty Write`라 한다.
- Rollback 시 정삭적인 Recovery는 매우 중요하기 때문에 모든 Isolation Level에서 Dirty write를 허용하면 안된다.

### 이상현상5: Lost Update

![6](https://github.com/user-attachments/assets/aa1f050f-bed4-4d49-9b22-48045151e36b)

- 초기값: x = 50
- 트랜잭션1에서 x를 읽는다.
- 트랜잭션2에서 x를 읽고 x에 150을 더해서 x는 200이 되었다. 그 후 커밋한다.
- 트랜잭션1에서 읽은 x 값은 50이므로 x에 50을 더해 100이 되었다. 그 후 커밋한다.
- 최종적으로 x는 100이 되었다. 트랜잭션2에서 수정한 x 값은 완전히 사라지게 된다.
- 이러한 이상 현상을 `Lost Update`라 한다.

### 이상현상6: Dirty Read 확장

![7](https://github.com/user-attachments/assets/3410f785-1d02-495b-af48-881e2a214e46)

- 초기값: x = 50, y = 50
- x의 초기값은 50이고 트랜잭션1은 x가 y에 40을 이체한다. 따라서 x는 10이 되고 y에 40을 더해주어야 한다.
- y를 수정하기 전에 트랜잭션2가 실행되었다. x는 10이고 y는 50이다. 그 후 커밋한다.
- 이제 트랜잭션1에서 y에 40을 더하는 작업을 한다. y는 90이 되었다.
- 최종적으로 x = 10, y = 90이다. 총량이 100이다.
- 그런데 트랜잭션2에서 읽은 x와 y는 총량이 60이다. 데이터 정합성이 맞지 않는다.
- 논문에서는 이러한 현상 또한 `Dirty read`라고 정의한다. abort가 발생하지 않아도 Dirty Read가 될 수 있다.
    - Dirty Read: commit 되지 않은 변화를 읽음

### 이상현상7: Read Skew

![8](https://github.com/user-attachments/assets/04571a77-2ae1-40b0-8e22-02fafb5f542d)

- 초기값: x = 50, y = 50
- 트랜잭션2를 먼저 실행한다. x는 50이다.
- 트랜잭션2에서 y를 읽기 전에 트랜잭션1을 실행한다. x를 읽고 40을 뺀다. x는 10이 된다. y를 읽고 y에 40을 더한다. 그 후 커밋한다.
- 최종적으로 트랜잭션1에서 읽은 x와 y 값은 x = 10, y = 90이다.
- 트랜잭션2에서 y를 읽는 동작을 수행한다. y는 90이다. 최종적으로 트랜잭션2에서 읽은 x와 y 값은 x = 50, y = 90이다.
- 트랜잭션1에서 x와 y의 총량은 100이고 트랜잭션2에서 x와 y의 총량은 140이므로 데이터 정합성이 맞지 않는다.
- 이러한 현상을 `Read Skew`: **inconsistent(불일치)한 데이터 읽기**라 한다.
- 이 이상 현상은 Non-repeatable Read와 비슷하다.

### 이상현상8: Write Skew

![9](https://github.com/user-attachments/assets/ca16f0cc-6f06-4e55-8af5-1c0eb933c37b)

- 초기값: x = 50, y = 50
- 트랜잭션1에서 x, y를 읽는다.
- 그 후 트랜잭션2에서 x, y를 읽는다.
- 트랜잭션1에서 x는 50, y는 50이므로 x + y는 0보다 크다. 따라서 x에서 80을 뺀다. x는 -30이 된다.
- 트랜잭션2에서 x는 50, y는 50이므로 x + y는 0보다 크다. 따라서 y에서 90을 뺀다. y는 -40이 된다. 그 후 커밋한다.
- 트랜잭션1도 커밋한다.
- 결과적으로 x = -30, y = -40이 되어버렸다.
- 이와 같은 이상 현상을 `Write Skew`: **inconsistent한 데이터 쓰기**라 한다.
- 이 이상 현상은 Read Skew와 비슷하다.

### 이상현상9: Phantom Read 확장

![10](https://github.com/user-attachments/assets/3efc13a0-a30b-454b-b176-e9d00ee50b6f)

- 서로 연관된 데이터를 읽을 때 데이터가 맞지 않는 경우에도 `Phantom Read`라 해야 한다.

### Snapshot Isolation

standard SQL 92 비판 논문에서 3번에 해당하는 ‘상업적인 DBMS에서 사용하는 방법을 반영해서 Isolation Level을 구분하지 않았다.’ 이부분에 대한 것이 Snapshot Isolation이다. Snapshot Isolation은 기존의 READ UNCOMMITED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE과는 다르게 동작한다.

![11](https://github.com/user-attachments/assets/46404533-d17f-416f-a7c5-209902252754)

- Snapshot Isolation은 트랜잭션이 시작되기 직전을 기준으로 값을 저장한다.
- 초기값: x = 50, y = 50
- 트랜잭션1이 시작되기 직전의 x, y 값을 snapshot에 저장한다.
- x를 읽는다. 그 후 x가 y에 40을 이체해야 하므로 x 값은 10이 된다. 이 값을 snapshot에 저장한다.
- x의 바뀐 값을 DB에 직접 저장하는 것이 아닌 snapshot에 저장한다.
- 이제 트랜잭션2를 실행한다. 마찬가지로 트랜잭션2가 시작하기 직전의 x, y 값을 snapshot에 저장한다.
- y는 50이다. y에 100을 더해서 y는 150이 되고 이 값을 snapshot에 저장한다.
- 커밋을 실행하면 트랜잭션2의 snapshot 데이터를 DB에 저장한다.

![12](https://github.com/user-attachments/assets/516716dd-076f-45a2-ab14-53318ffd4f8b)

- 이제 트랜잭션1의 y를 읽고 40을 더한다. 변경된 y는 snapshot에 저장한다.
- 이제 트랜잭션1이 커밋을 하려고 하는데 트랜잭션1과 트랜잭션2가 같은 y 값에 대해 write를 한다. 그런데 트랜잭션1의 값을 DB에 적용시키면 트랜잭션2가 바꾸었던 값이 없어지게 되면서 Lost Update가 되버린다.
- 따라서, Snapshot Isolation에서는 같은 값에 대해 write를 할 때 먼저 커밋된 트랜잭션만 인정해준다. 나중에 처리된 트랜잭션1에 대해서는 abort 처리를 하게 되어 값을 버리게 된다.
- 최종적으로 x = 50, y = 150이 된다.
- 이런식으로 동작하는게 Snapshot Isolation이다. 이는 MVCC(multi version concurrency control)의 한 종류이다.