---
title:  "쿼리 메서드 (Query Methods) 기능과 @Query"
last_modified_at: 2021-12-18T20:05:00
categories: 
  - JPA
tags:
  - Java
  - SpringBoot
  - JPA
toc: true
toc_label: "Getting Started"
---

쿼리 메서드와 JPQL(Java Persistence Query Language) 은 객체 지향 쿼리

Spring Data JPA 는 다양한 검색 조건을 위해 다음과 같은 방법 제공

- 쿼리 메서드: 메서드의 이름 자체가 쿼리의 구문으로 처리되는 기능
- @Query: SQL 과 유사하게 엔티티 클래스의 정보를 이용해서 쿼리를 작성하는 기능
- Querydsl 등의 동적 쿼리 처리 기능

<br>

## 쿼리 메서드(Query Methods)

쿼리 메서드란? 메서드의 이름 자체가 질의(query)문

쿼리 메서드 레퍼런스 문서

[Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods)

<br>

쿼리 메서드의 리턴 타입

- select 를 하는 작업 → List 타입이나 배열
- 파라미터에 Pageable 타입을 넣는 경우 → Page<E>

<br>

MemoRepository.java

```java
package org.zerock.ex2.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.ex2.entity.Memo;

import java.util.List;

public interface MemoRepository extends JpaRepository<Memo, Long> {
		// 쿼리 메서드
    List<Memo> findByMnoBetweenOrderByMnoDesc(Long from, Long to);
		// 쿼리 메서드 + Pageable
    Page<Memo> findByMnoBetween(Long from, Long to, Pageable pageable);
}
```

쿼리 메서드의 경우 이름이 길어지고 혼동하기 쉬워 이를 보완하기 위해 Pageable 파라미터를 같이 사용. 정렬에 관한 부분은 좀 더 간략한 메서드를 생성할 수 있음

<br>

MemoRepositoryTests.java

```java
package org.zerock.ex2.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.ex2.entity.Memo;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
class MemoRepositoryTests {

    @Autowired
    MemoRepository memoRepository;

		...

    @Test
    @DisplayName("쿼리 메서드")
    public void testQueryMethods() {
        List<Memo> list = memoRepository.findByMnoBetweenOrderByMnoDesc(70L, 80L);

        for (Memo memo : list) {
            System.out.println(memo);
        }
    }

    @Test
    @DisplayName("쿼리 메서드와 Pageable")
    public void testQueryMethodWithPageable() {
		// 정렬 조건 추가
        Pageable pageable = PageRequest.of(0, 10, Sort.by("mno").descending());

        Page<Memo> result = memoRepository.findByMnoBetween(10L, 50L, pageable);

        result.get().forEach(memo -> System.out.println(memo));
    }
}
```

<br>

## deleteBy 로 시작하는 삭제 처리

쿼리 메서드를 이용해 deleteBy 로 메서드의 이름이 시작하면 특정 조건에 맞는 데이터를 삭제하는 것도 가능

<br>

MemoRepository.java

```java
package org.zerock.ex2.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.ex2.entity.Memo;

import java.util.List;

public interface MemoRepository extends JpaRepository<Memo, Long> {

		...

    void deleteMemoByMnoLessThan(Long num);
}
```

MemoRepositoryTests.java

```java
package org.zerock.ex2.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.ex2.entity.Memo;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
class MemoRepositoryTests {

    @Autowired
    MemoRepository memoRepository;

		...

    @Commit
    @Transactional
    @Test
    @DisplayName("deleteBy")
    public void testDeleteQueryMethods(){
        memoRepository.deleteMemoByMnoLessThan(10L);
    }
}
```

**@Transactional**

→ select 문으로 해당 엔티티 객체들을 가져오는 작업과 각 엔티티를 삭제하는 작업이 같이 이루어지기 때문에 Transactional 어노테이션 사용해야 함

<br>

**@Commit**

→ 최종 결과를 커밋하기 위해 사용. 이를 적용하지 않으면 기본적으로 Rollback 처리 되어서 결과가 반영 안됨

<br>

deleteBy 는 실제 개발에 많이 사용 안함

→ why? 한 번에 삭제가 이루어지는 것이 아닌 각 엔티티 객체를 하나씩 삭제하기 때문

→ 따라서 개발 시에는 deleteBy 보다 @Query 를 이용하는 것이 효율적

<br>

## @Query 어노테이션

간단한 처리는 쿼리 메서드를 이용하고 보통은 @Query 를 사용함

@Query 의 경우 메서드의 이름과 상관없이 메서드에 추가한 어노테이션을 통해 처리가 가능

@Query 의 value 는 JPQL 로 작성하는데 객체지향 쿼리라고 부름

- 필요한 데이터만 선별적으로 추축하는 기능이 가능
- 데이터베이스에 맞는 순수한 SQL 을 사용하는 기능
- DML 등을 처리하는 기능 (@Modifying 과 함께 사용)

객체지향 쿼리는 테이블 대신 엔티티 클래스, 테이블의 칼럼 대신에 클래스에 선언된 필드를 이용

```java
// mno의 역순으로 정렬
@Query("select m from Memo m order by m.mno desc")
List<Memo> getListDesc();
```

<br>

### @Query 의 파라미터 바인딩

파라미터 처리

- ?1, ?2 와 1부터 시작하는 파라미터의 순서를 이용하는 방식
- :xxx 와 같이 :파라미터 이름을 활용하는 방식
- :#{} 과 같이 자바 빈 스타일을 이용하는 방식

<br>

`:파라미터` 사용할 경우,

```java
@Transactional
@Modifying
@Query("update Memo m set m.memoText = :memoText where m.mno = :mno")
int updateMemoText(@Param("mno") Long mno, @Param("memoText") String memoText);
```

<br>

여러개의 파라미터를 전달하여 복잡해질 때는 :# 을 이용해서 객체를 사용

```java
@Transactional
@Modifying
@Query("update Memo m set m.memoText = :#{#param.memoText} where m.mno = :#{#param.mno}")
int updateMemoText(@Param("param") Memo memo);
```

<br>

### @Query 와 페이징 처리

@Query 를 이용하는 경우에도 Pageable 타입의 파라미터를 적용하면 페이징 처리와 정렬에 대한 부분을 작성하지 않을 수 있음

```java
@Query(value = "select m from Memo m where m.mno > :mno",
				countQuery = "select count(m) from Memo m where m.mno > :mno")
Page<Memo> getListWithQuery(Long mno, Pageable pageable);
```

<br>

### Object[] 리턴

```java
@Query(value = "select m.mno, m.memoText, CURRENT_DATE from Memo m where m.mno > :mno",
				countQuery = "select count(m) from Memo m where m.mno > :mno")
Page<Object[]> getListWithQueryObject(Long mno, Pageable pageable);
```

<br>

### Native SQL 처리

SQL 구문을 그대로 활용. 이는 데이터베이스에 독립적으로 구현이 가능하다는 장점은 사라짐. 하지만 경우에 따라 복잡한 구문을 처리하기 위해 사용

```java
@Query(value = "select * from memo where mno > 0", nativeQuery = true)
List<Object[]> getNativeResult();
```