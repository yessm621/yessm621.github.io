---
title: "함수 종속성 (Functional Dependency)"
categories:
  - DB
toc: true
toc_sticky: true
---

## 개요

함수 종속성은 데이터베이스를 설계하는 방법의 기본이 되는 개념이며, 정규화에서도 중요하게 다루는 개념이므로 알아두는 것이 좋다.

## Functional Dependency

`Functional Dependency(함수 종속)`는 한 테이블에 있는 두 개의 attribute(s) 집합 사이의 제약(constraint)을 뜻한다.

Functional Dependency를 이해하기 위해 아래 그림을 살펴보자.

![1](https://github.com/user-attachments/assets/64053a00-ff7d-416c-b18d-22bbf2d25b56)

- Employee 테이블과 attribute들이다.
- 집합 X = {empl_id}, 집합 Y = {empl_name, birth_date, position, salary}
- X 값에 따라 Y 값이 유일하게 결정될 때, ‘**X가 Y를 함수적으로 결정한다**’, ‘**Y가 X를 함수적으로 의존한다**’ 라고 말할 수 있다.
- 이와 같이 두 집합 사이의 제약 관계를 Funcation Dependency라고 부른다.
- 그리고 X와 Y의 관계를 `X → Y`라고 표기한다.
- 집합 **X는 결정자**, 집합 **Y는 종속자**라 한다.
- X는 left-hand side, Y는 right-hand side라고도 한다.
- X → Y가 성립한다고 해서 Y → X가 반드시 성립하진 않는다.
    - 예) {empl_id} → {empl_name} (O), {empl_name} → {empl_id} (X)

### Functional Dependency 찾는 방법

Functional Dependency는 **테이블의 스키마를 보고 의미적으로 파악**해야 한다. 테이블의 state를 보고 Functional Dependency를 파악해서는 안된다.

예를 들어 위의 Employee 테이블에서 {empl_name} → {birth_date}가 성립될까? 이름에 따라 생일이 다를 수도 있지만 동명이인의 경우가 있으므로 {empl_name} → {birth_date}은 성립되지 않는다.

이처럼 테이블의 특정 순간의 특정 상태만 보고 Functional Dependency를 파악하면 안된다.

그렇다면 {empl_id} → {empl_name, birth_date, position, salary, dept_id}가 성립할까? 여기서도 의미적으로 접근해야 한다.

- 만약, 이 회사의 정책이 임직원은 반드시 한 부서에만 속해야 한다면? X → Y 성립 (O)
- 만약, 이 회사의 정책이 임직원이 하나 이상의 부서에 속할 수 있다면? X → Y 성립하지 않음 (X)

결론적으로 구축하려는 DB의 attributes가 관계적으로 어떤 의미를 지닐지에 따라 Functional Dependency가 달라진다.

### Functional Dependency 예시

- {stu_id} → {stu_name, birth_date, address}
- {class_id} → {class_name, year, credit}
- {stu_id, class_id} → {grade}
- {bank_name, bank_account} → {balance, open_date}

## {} → Y

Y 값은 언제나 하나의 값만을 가진다는 의미이다.

- {}는 공집합을 의미한다.
- 공집합에서 Y로의 종속성은 Y가 항상 동일한 값을 가지는 속성이라는 의미이다.

![2](https://github.com/user-attachments/assets/ccb7fffd-b7f7-41be-877e-701f8a6839a3)

- company attribute가 항상 같은 값만 가지게 된다면 {} → {company}가 성립한다.
- 참고로 이 부분은 정규화 중 2NF와 관련된 내용이다.

## Trival Functional Dependency

X → Y 일 때, 오른쪽 집합(Y)이 왼쪽 집합(X)에 부분 집합이라면 `trivial functional dependency`라고 한다.

**trivial functional dependency 예시**

- {a, b, c} → {c}
- {a, b, c} → {a, c}
- {a, b, c} → {a, b, c}

## Non-trival Functional Dependency

X가 Y를 결정 짓는 Funcational Dependency일때, 만약 Y가 X의 부분집합이 아니라면 `non-trivial functional dependency`라 한다.

**non-trivial functional dependency 예시**

- {a, b, c} → {b, c, d}
- {a, b, c} → {d, e}
    - 특히, 이 두 집합은 공통된 attributes가 하나도 없다. 이땐, non-trivial functional dependency 또는 completely non-trivial functional dependency라고 한다.

## Partial Functional Dependency

X가 Y를 결정 짓는 Functional Dependency가 존재한다고 했을 때, **X의 proper subset 중 하나라도 Y를 결정 지을 수 있다**면 여기서 X → Y를 `partial functional dependency`라고 한다.

여기서 `proper subset`의미는 다음과 같다. 집합 X의 proper subset은 X의 부분 집합이지만 X와 동일하지 않은 집합을 의미한다. 

- 예를 들어 X = {a, b, c} 일 때 {a, c}, {a}, {}는 모두 X의 proper subset이다.
- 반면에 {a, b, c}는 X의 proper subset이 아니다.

{empl_id, empl_name} → {birth_date} 일 때, {empl_id}는 {birth_date}를 결정할 수 있으므로 {empl_id, empl_name} → {birth_date}은 partial functional dependency이다.

## Full FD

partial functional dependency가 아닌 경우를 Full Functional Dependency라 한다.

X가 Y를 결정 짓는 Functional Dependency가 존재한다고 했을 때, **X의 proper subset 중 하나라도 Y를 결정 지을 수 없다**면 여기서 X → Y를 `full functional dependency`라고 한다.

{stu_id, class_id}의 proper subset은 {stu_id}, {class_id}, {}이다. 이 세가지는 {grade}를 결정지을 수 없다. 따라서 full functional dependency이다.