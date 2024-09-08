---
title:  "데이터베이스 정규화(Normalization)"
categories:
  - DB
toc: true
toc_sticky: true
---

## 정규화(Normalization)

`정규화(Normalization)`는 **데이터 중복과 삽입, 수정, 삭제를 최소화하기 위해 일련의 Normal Forms(NF)에 따라 Relational DB(관계형 데이터베이스)를 구성하는 과정**이다.

정규화의 목표는 테이블 간에 중복된 데이터를 허용하지 않음으로써 무결성(Integrity)을 유지하고, DB의 저장 용량을 줄이는 것이다.

여기서 Normal Forms이란 정규화 되기 위해 준수해야 하는 몇가지 규칙이 있는데 이 각각의 규칙을 Normal Form(NF)이라고 부른다.

## 정규화 과정

데이터베이스 정규화 과정은 처음부터 순차적으로 진행하며 NF을 만족하지 못하면 만족하도록 테이블 구조를 조정한다. 앞 단계를 만족해야 다음 단계로 진행할 수 있기 때문에 어떤 테이블이 3NF를 만족하고 있다면 1NF, 2NF를 만족하고 있다는 뜻이다.

![1](https://github.com/user-attachments/assets/9c6bb200-5e1c-4cc9-b627-c4ef0cbe2c80)

- 1NF~BCNF는 FD와 key만으로 정의된다.
- 3NF까지 진행하면 정규화 됐다고 말하기도 한다.
    - 결국 3NF를 만족하는지가 정규화의 최소 과정이다.
- 보통 실무에서는 3NF 혹은 BCNF까지 진행한다. (많이 해도 4NF 정도까지만 진행)

## 정규화 과정 예제

![2](https://github.com/user-attachments/assets/6cd7e887-9079-40bc-b913-284f6bb2b86a)

- 임직원의 월급 계좌를 관리하는 테이블이다.
- 월급 계좌는 국민은행, 우리은행 중 하나
- 한 임직원이 하나 이상의 월급 계좌를 등록하고 월급 비율(ratio)을 조정할 수 있다.
- 계좌마다 등급(class)이 있다.
    - 국민: star → prestige → loyal
    - 우리: bronze → sliver → gold
- 한 계좌는 하나 이상의 현금 카드와 연동될 수 있다.

이 테이블의 key는 다음과 같이 있다.

- super key: table에서 tuple들을 unique하게 식별할 수 있는 attributes set
- `(candidate) key`: 어느 한 attribute라도 제거하면 unique하게 tuples를 식별할 수 없는 super key
    - 예) {account_id}, {bank_name, account_num}
- primary key: table에서 tuple들을 unique하게 식별하려고 선택된 (candidate) key
    - 예) {account_id}
- prime attribute: 임의의 key에 속하는 attribute
    - 예) account_id, bank_name, account_num
- `non-prime attribute`: 어떠한 key에도 속하지 않는 attribute
    - 예) class, ratio, empl_id, empl_name, card_id

이번엔 Funcation Dependency를 살펴보자.

- {account} → {bank_name, account_num, class, ratio, empl_id, empl_name, card_id}
- {bank_name, account_num} → {account, class, ratio, empl_id, empl_name, card_id}
- {empl_id} → {empl_name}
- {class} → {bank_name}
    - 국민은행 계좌와 우리은행 계좌에는 등급이 있고 이 등급은 겹치지 않는다. 따라서 등급에 따라 어디 은행인지 파악할 수 있다.

이제 아래 테이블을 대상으로 정규화를 진행해보자.

![3](https://github.com/user-attachments/assets/50473250-7d2b-4b26-bb74-cb21d3f1f69f)

## 제 1 정규화 (1NF)

1NF는 **attribute의 value는 반드시 나눠질 수 없는 단일한 값이어야 한다.**

![4](https://github.com/user-attachments/assets/6b4d80d5-cb0d-43bc-b90f-3a7f11b45b97)

- 위 테이블의 card_id 컬럼은 1NF를 위반하고 있다.
- 따라서 가장 간단하게 해결하는 방법은 값을 분리하는 것이다. 값을 분리하고 튜플을 하나 더 생성하게 되면 1NF를 만족하게 된다.

![5](https://github.com/user-attachments/assets/dddcd04a-1e50-423d-b315-322932aecd87)

- 이제 1NF를 만족하는 테이블이 되었다.

### 1NF 과정에서 문제 발생

하지만 여기서 문제가 생겼다. 변경된 테이블은 1NF를 만족하게 되었지만, **중복 데이터**가 생기는 문제가 발생했고 **Primary Key도 변경**({account_id} → {account_id, card_id})을 해야 한다.

(candidate) key도 기존의 {account_id}나 {bank_name, account_num}만으론 데이터를 유니크하게 식별할 수 없기 때문에 아래와 같이 변경된다.

- {account_id} → {account_id, card_id}
- {bank_name, account_num} → {bank_name, account_num, card_id}

이 상태에서 non-prime attribute는 {class, ratio, empl_id, empl_name}이다.
non-prime attribute들은 {account_id}와 {card_id}에 모두 의존해야할까? 아니다. non-prime attribute는 {account_id}만 있어도 유니크하게 결정할 수 있다.

즉, 모든 non-prime attribute들이 {account_id, card_id}(primary key)에 partially dependent(부분적으로 의존)하다. 
마찬가지로 모든 non-prime attribute들이 {bank_name, account_num, card_id}에 partially dependent하다. 그런데 non-prime attribute들은 {bank_name, account_num}만으로도 유니크하게 결정할 수 있다.

## 제 2 정규화 (2NF)

**모든 non-prime attribute는 모든 key에 fully functionally dependent(완전 함수 종속) 해야 한다.**

![6](https://github.com/user-attachments/assets/1e813ac1-5595-4b43-a12c-93084c51385d)

- 모든 non-prime attribute가 완전 함수 종속하기 위해  card_id를 분리한다.

![7](https://github.com/user-attachments/assets/df245293-9bfc-4a0d-b325-29ab10167251)

- card_id를 다른 테이블로 분리 한 뒤 중복되는 tuple도 제거했다.
- 이렇게 되면 non-prime attribute는 {account_id}에 fully functionally dependent하다.
- 마찬가지로 non-prime attribute는 {bank_name, account_num}에 fully functionally dependent 하다.
- 이제 2NF를 만족하게 된다.

## 제 3 정규화 (3NF)

### Transitive Dependncy (이행적 종속)

3NF를 알아보기 전에 아래 테이블의 functional dependency를 살펴보자.

![8](https://github.com/user-attachments/assets/69ba62a1-5cdb-429f-84ba-50bbcf5d2bce)

- 밑에 화살표는 functional dependency를 시각화 한 것이다.
- empl_id, empl_name만 보면 중복이 보인다.
    - empl_name은 empl_id에 따라 결정된다.
    - empl_id가 같으면 empl_name도 같다.
    - functional dependency: {empl_id} → {empl_name}

![9](https://github.com/user-attachments/assets/6f5e434f-b972-496d-aea1-a029ca1b1298)

- **{account_id} → {empl_id}**를 살펴보자.
- {account_id}→ {empl_id}와 {empl_id} → {empl_name}은 최종적으로 {account_id} → {empl_name} 이렇게 합쳐서 표현할 수 있다.

![10](https://github.com/user-attachments/assets/788e4c61-bac8-4007-aba3-693bafc2cda5)

- **{bank_name, account_num} → {empl_id}**를 살펴보자.
- {bank_name, account_num} → {empl_id}이고 {empl_id} → {empl_name} 이기 때문에 결국 {bank_name, account_num} → {empl_name}이 된다.

이처럼 **X → Y 이고 Y → Z 이면, X → Z**가 되는데 이를 `Transitive Dependency(이행적 종속)`라 한다. 여기서 하나의 제약 사항은 Y와 Z가 어떤 키에 대해서도 부분 집합이면 안된다.

예를 들어, {account_id} → {class}, {class} → {bank_name}이기 때문에 transitive FD라 생각할 수 있지만 bank_name은 key에 속하기 때문에 transitive FD라고 할 수 없다.

### 제 3 정규화 (3NF)

**3NF란 모든 non-prime attribute는 어떤 key에도 Transitively Dependent(이행적 종속)하면 안된다는 규칙이다.**

- non-prime attribute끼리는 Functional Dependency가 있으면 안된다.

- 예를 들어 Employee_Account 테이블에서 non-prime attribute는 class, ratio, empl_id, empl_name인데 {empl_id} → {empl_name}이라는 Functional Dependency가 존재하므로 3NF를 위반한다.

![11](https://github.com/user-attachments/assets/2aebd728-72d9-475e-b0ff-91a39f405ce9)

이를 해결하기 위해선 3NF를 위반하는 Functional Dependency를 제거해야 한다.

![12](https://github.com/user-attachments/assets/7f604cbf-5f4b-4a34-91cc-46cde708041c)

<br>

![13](https://github.com/user-attachments/assets/da243e10-4cc9-4439-8bdc-67519fb508dd)

- 이제 3NF를 만족하게 된다.

<br>

![14](https://github.com/user-attachments/assets/8fd2c069-7096-4481-8230-ef72adb29a37)

- 3NF까지 진행되면 ‘정규화(normalized) 됐다’라고 말할 수 있다.

## BCNF 정규화

3NF까지 진행된 Employee_Account 테이블을 보면 bank_name이 중복된다.

![15](https://github.com/user-attachments/assets/dca1d5b8-1817-426b-9046-cec1eb382e60)

- Employee_Account 테이블의 class 값을 통해 bank_name 이름을 알 수 있다.
    - 국민: star → prestige → loyal
    - 우리: bronze → sliver → gold
- 따라서, {class} → {bank_name}이다.

**BCNF란 모든 유효한 non-trivial Functional Dependency를 X → Y라고 표현할 때, X → Y는 X가 super key여야 한다.**

예를 들어 {class} → {bank_name}이지만, class는 super key가 아니다. 따라서, BCNF를 위반한다.

> **참고**
<br>
non-trivial Dependency란 X → Y가 있을 때 Y가 X의 부분집합이 아니면 non-trivial dependency라 한다.
>

BCNF를 만족하기 위해선 위반하는 attribut를 다른 테이블로 분리하면 된다. (아래 그림 참고)

![16](https://github.com/user-attachments/assets/136cb5a6-6770-4195-a7dd-09c2cfe30703)

## 정규화 결과

**기존 테이블**

![17](https://github.com/user-attachments/assets/b234b6f7-706b-4e1c-a44f-b54d3546db0d)

<br>

**BCNF까지 정규화를 마친 테이블**

![18](https://github.com/user-attachments/assets/8757766a-e9be-4456-9959-ab77252b2794)

## 역정규화 (Denormalization)

테이블을 너무 쪼개면 JOIN 문으로 인해 성능이 느려지는 이슈가 있고 관리도 힘들다. 따라서, 전략적으로 더 이상 쪼개지 않기로 하겠다는 계획을 세우고 BCNF까지 진행한 정규화를 3NF로 다시 되돌리는 것을 `역정규화 (Denormalization)`라고 한다.

즉, DB를 설계할 때 과도한 JOIN과 중복 데이터 최소화 사이에서 적정 수준을 잘 선택할 필요가 있다.