---
title: "변경감지와 병합 - 두번째"
categories:
  - JPA
tags:
  - Java
  - SpringBoot
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

## SQL 수정(Update) 쿼리의 문제점

SQL 을 사용하면 수정 쿼리를 직접 작성

프로젝트의 규모가 커지고 요구사항이 늘어나면 수정쿼리도 점점 추가된다.

→ 이 방식의 문제점은 수정 쿼리가 많아지는 것과 비지니스 로직을 분석하기 위해 SQL 을 계속 확인해야함. 결국, 직접적이든 간접적이든 비지니스 로직이 SQL 에 의존하게 됨

```sql
// 초기
update member
set name = ?, age = ?
where id = ?

// 기능추가
update member
set name = ?, age = ?, grade = ?
where id = ?
```

<br>

## 변경감지와 병합

JPA 는 영속성 컨텍스트에 테이블 형태의 1차 캐시를 두고 엔티티를 저장해서, Transaction commit 시 1차 캐시의 영속된 값과 현재 entity 값을 비교하여 변경이 된 것을 알아서 적용해줌

<br>

## 준영속 상태의 엔티티

아래 코드는 form 의 id 에 해당하는 member 의 name 을 set 했다.

이후에 transaction 이 commit 되면 알아서 변경 감지가 일어날 것이라고 생각한 잘못된 코드.

```sql
// 준영속 상태를 생각하지 않은 엔티티 값 수정

@PostMapping("/members/{memberId}/editName")
public String updateMemberName(@ModelAttribute("form") MemberNameEditForm form){
Member member = new Member();

member.setId(form.getId());
member.setName(form.getName());

return "redirect:/members";
```

이미 한번 DB 에 저장된 기존 식별자(id) 를 갖는 엔티티는 영속성 컨텍스트가 더 이상 관여하지 않음

→ 이런 상태의 entity 를 준영속 상태의 엔티티라고 함

위 코드에서 member 역시, 기존에 DB에 저장된 id를 식별자로 갖는 준영속 상태의 엔티티이기 때문에 영속성 컨텍스트에 의해 관리되지 않고, 때문에 변경 감지가 적용되지 않는 것

<br>

## 준영속 상태의 엔티티를 수정하는 2가지 방법

1. 변경 감지 기능 (dirty checking) 사용
2. merge 사용

<br>

## 변경감지 (dirty checking)

entity manager 로 entity 를 직접 꺼내 값을 수정

이렇게 하면 dirty checking 이 일어남

```java
@Transactional

void updateMember(Member memberParam)
Member findMember = em.find(Member.class, memberParam.getId());

findMember.setName(memberParam.getName());
```

<br>

JPA 로 엔티티를 수정할 때는 엔티티를 조회한 후 데이터만 변경하면 된다.

em.update()와 같은 update 메소드가 존재하지 않는데 어떻게 db 에 반영이 되었을까?

그 이유는 `JPA 의 변경감지 (Dirty Checking)` 기능 때문

```java
EntityManager em = emf.createEntityManager();
EntityTransaction transaction = em.getTransaction();
transaction.begin() // [트랜잭션] 시작

// 영속 엔티티 조회
Member memberA = em.find(Member.class, "memberA");

// 영속 엔티티 데이터 수정
memberA.setUsername("hi");
memberA.setAge(10);

// em.update(member); 이런코드가 필요할 거 같지만 없다..

transaction.commit(); // [트랜잭션] 커밋
```

<br>

1. 트랜잭션을 커밋하면 엔티티 매니저 내부에서 flush() 가 호출
2. 엔티티와 스냅샷을 비교해서 변경된 엔티티를 찾음
3. 변경된 엔티티가 있으면 수정 쿼리를 생성해서 쓰기 지연 SQL 저장소에 보냄
4. 쓰기 지연 저장소의 SQL 을 DB 에 보냄
5. 데이터베이스 트랜잭션을 커밋

<br>

## merge 사용

entity manager 의 merge 를 사용

merge 가 호출되면 우선 해당 엔티티를 1차 캐시에서 먼저 조회하고, 없다면 식별자로 DB에서 엔티티를 검색해 가져와 준영속 상태의 엔티티 값을 대입 받는다

```java
@PostMapping("/members/{memberId}/editName")
public String updateMemberName(@ModelAttribute("form") MemberNameEditForm form){
Member member = new Member();

member.setId(form.getId());
member.setName(form.getName());

em.merge(member);

return "redirect:/members";
```

<br>

아래처럼 Service 에서 Member 를 저장할 때, id 가 직접 설정하지 않았으면(새로 생성) persist 를, id 를 직접 설정한 객체가 저장된다면 이미 있는 엔티티르 수정하는 것으로 알고 merge 를 호출하는 식으로 사용

```java
public void save(Member member) {
  if(Member.getId() == null) {
     em.persist(member);
  } else { 
     em.merge(member);
  }
}
```

merge 는 엔티티로 넘어온 모든 속성으로 변경이 진행됨

병합시 값이 없으면 null 로 업데이트 할 위험이 있다 (병합은 모든 필드를 교체함)

**`따라서, 엔티티를 변경할 때는 변경감지를 사용하는 것이 좋다`**

<br>

## 엔티티 삭제

```java
Memeber memberA = em.find(Member.class, "memeberA");
em.remove(memberA);
```

em.remove() 에 삭제 대상 엔티티를 넘겨주면 엔티티를 삭제한다. 

물론 엔티티를 즉시 삭제 하는 것이 아니라 엔티티 등록과 비슷하게 삭제 쿼리를 쓰기 지연 SQL 저장소에 등록한다.

이 후 트랜잭션을 커밋하게 되면 플러시가 호출되어 실제 데이터베이스에 삭제 쿼리를 전달

em.remove(memberA) 를 호출하는 순간 memberA 는 영속성 컨텍스트에서 제거됨
