---
title:  "페이징/정렬 처리하기"
last_modified_at: 2021-12-18T17:00:04-04:00
categories: 
  - JPA
tags:
  - Java
  - SpringBoot
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
published : false
---

페이징 처리와 정렬은 전통적으로 SQL 을 공부하는데 반드시 필요한 부분. 특히 페이지 처리는 데이터베이스의 종류에 따라서 사용되는 기법이 다른 경우가 많아서 별도의 학습이 필요

JPA 는 내부적으로 이런 처리를 Dialect 라는 존재를 이용해서 처리. 예를 들어 JDBC 정보가 예제와 같이 MariaDB 의 경우에는 자동으로 MariaDB 를 위한 Dialect 가 설정됨 (프로젝트의 로딩 시점에 출력되는 로그를 통해 확인 가능)

JPA 는 실제 DB 에서 사용하는 SQL 의 처리를 자동으로 하기 때문에 개발자들은 SQL 이 아닌 API 의 객체와 메서드를 사용하는 형태로 페이징 처리를 할 수 있음

<br>

**findAll()**

페이징 처리와 정렬할 때 사용. 리턴 타입을 Page<T> 타입으로 지정하는 경우에는 반드시 파라미터를 Pageable 타입을 이용해야 함

- Page<T> findAll(Pageable pageable)
- Iterable<T> findAll(Sort sort)

<br>

## Pageable 인터페이스

페이지 처리에 필요한 정보를 전달하는 용도의 타입

PageRequest 클래스의 생성자는 protected 로 선언되어 new 를 사용할 수 없음. 객체를 생성하기 위해 static 한 of() 를 이용. PageRequest 생성자를 보면 page, size, Sort 라는 정보를 이용해서 객체를 생성

- PageRequest(int page, int size, Sort sort)

<br>

## 페이징 처리

Spring Data JPA 를 이용할 때 페이지 처리는 반드시 0 부터 시작!

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
import org.springframework.transaction.annotation.Transactional;
import org.zerock.ex2.entity.Memo;

import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
class MemoRepositoryTests {

    @Autowired
    MemoRepository memoRepository;

    ...

    @Test
    @DisplayName("페이징 처리")
    public void testPageDefault() {
        // 1페이지 10개
        Pageable pageable = PageRequest.of(0, 10);

        Page<Memo> result = memoRepository.findAll(pageable);

        System.out.println(result);

        System.out.println("---------------------------------------");

				// 총 몇 페이지
        System.out.println("Total Pages:" + result.getTotalPages());
				// 전체 개수
        System.out.println("Total Count:" + result.getTotalElements());
				// 현재 페이지 번호 0 부터 시작
        System.out.println("Page Number:" + result.getNumber());
				// 페이지당 데이터 개수
        System.out.println("Page Size:" + result.getSize());
				// 다음 페이지 존재 여부
        System.out.println("has next page?:" + result.hasNext());
				// 시작 페이지(0) 여부
        System.out.println("first page?:" + result.isFirst());

        System.out.println("---------------------------------------");

        for (Memo memo : result.getContent()) {
            System.out.println(memo);
        }
    }
}
```

**테스트 결과**

```
Hibernate: 
    select
        memo0_.mno as mno1_0_,
        memo0_.memo_text as memo_tex2_0_ 
    from
        tbl_memo memo0_ limit ?
Hibernate: 
    select
        count(memo0_.mno) as col_0_0_ 
    from
        tbl_memo memo0_
Page 1 of 10 containing org.zerock.ex2.entity.Memo instances
---------------------------------------
Total Pages:10
Total Count:99
Page Number:0
Page Size:10
has next page?:true
first page?:true
---------------------------------------
Memo(mno=1, memoText=Sample...1)
Memo(mno=2, memoText=Sample...2)
Memo(mno=3, memoText=Sample...3)
Memo(mno=4, memoText=Sample...4)
Memo(mno=5, memoText=Sample...5)
Memo(mno=6, memoText=Sample...6)
Memo(mno=7, memoText=Sample...7)
Memo(mno=8, memoText=Sample...8)
Memo(mno=9, memoText=Sample...9)
Memo(mno=10, memoText=Sample...10)
```

<br>

**PageRequest.of(0, 10)**

: 1페이지의 데이터 10개를 가져오기 위함

<br>

**Page<Memo> result = memoRepository.findAll(pageable);**

: 리턴 타입이 Page! → 단순히 해당 목록만 가져오는게 아닌 실제 페이지 처리에 필요한 전체 데이터 개수를 가져오는 쿼리를 같이 처리함

: findAll() 에 Pageable 타입의 파라미터를 전달하면 페이징 처리에 관련된 쿼리들을 실행. 이 결과들을 이용해서 리턴 타입으로 지정된 Page<엔티티> 객체로 저장. Page<엔티티> 는 여러 메서드를 지원.

<br>

## 정렬 조건 추가하기

페이징 처리를 담당하는 PageRequest 에는 정렬과 관련된 Sort 타입을 파라미터로 전달할 수 있음.

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
import org.springframework.transaction.annotation.Transactional;
import org.zerock.ex2.entity.Memo;

import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
class MemoRepositoryTests {

    @Autowired
    MemoRepository memoRepository;

    ...

    @Test
    @DisplayName("정렬 조건 추가하기")
    public void testSort() {

        Sort sort1 = Sort.by("mno").descending();
        Sort sort2 = Sort.by("memoText").ascending();
        Sort sortAll = sort1.and(sort2);

//        Pageable pageable = PageRequest.of(0, 10, sort1);
        Pageable pageable = PageRequest.of(0, 10, sortAll);

        Page<Memo> result = memoRepository.findAll(pageable);

        result.get().forEach(memo -> {
            System.out.println(memo);
        });
    }
}
```