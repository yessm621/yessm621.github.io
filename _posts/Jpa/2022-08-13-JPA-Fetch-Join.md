---
title: "페치 조인 (fetch join)"
categories:
  - Jpa
tags:
  - Jpa
toc: true
toc_sticky: true
---


<aside>
💡 실무에서 정말 중요하다. 필수적으로 알아야 하는 내용!

</aside>

## 페치 조인

`페치 조인`이란 JPQL에서 **성능 최적화**를 위해 제공하는 기능이며 연관된 엔티티나 컬렉션을 **SQL 한 번에 함께 조회**하는 기능이다. SQL 조인 종류 아니며 JPA에서만 사용한다. join fetch 명령어를 사용하며 사용법은 아래와 같다.

```sql
[ LEFT [OUTER] | INNER ] JOIN FETCH 조인경로
```

### 엔티티 페치 조인 예시

```sql
# 기존 SQL
select m.*, t.* from Member m inner join Team t on m.team_id = t.id

# JPQL
select m from Member m **join fetch** m.team
```

페치 조인을 사용하면 연관된 테이블을 한번에 조회 할 수 있다.

상황만 보면 즉시로딩과 비슷하다. 그러나, 페치조인은 쿼리를 내가 원하는 데이터만을 한번에 조회할 것이라는 것을 명시적으로 동적인 타이밍에 정할 수 있다.

또한, 연관관계 설정이 LAZY로 되어있다고 해도 페치 조인을 우선 시 한다.

`페치 조인을 사용하여 1 + N 문제를 해결할 수 있다.`


### 컬렉션 페치 조인

1:N 관계에서의 페치 조인이다.

![스크린샷 2022-08-13 오후 3 47 01](https://user-images.githubusercontent.com/79130276/184472709-58483b3b-dac4-4cec-a8d7-1924f5dbc3b0.png)

```sql
select t from Team t join fetch t.members;
```

결과를 보면 중복이 된다. 이 경우 distinct를 사용하여 중복을 제거할 수 있다. JPQL에서 distinct를 사용하면 **SQL에서의 distinct 기능** 뿐만 아니라, **엔티티의 중복까지 제거**해준다.

### 페치 조인 주의사항

1. 페치 조인 대상에는 별칭을 줄 수 없다. 하이버네이트 구현체에서는 사용이 가능하지만 가급적 사용하지 않는 것이 좋다. 
2. 둘 이상의 컬렉션은 페치 조인 할 수 없다.
3. 컬렉션을 페치 조인하면 페이징 API를 사용할 수 없다.