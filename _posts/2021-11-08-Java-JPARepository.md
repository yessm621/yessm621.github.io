---
layout: post
title:  "JPA Repository"
date:   2021-11-08 10:00:00 0100
categories: Java JPA
---
<br>


**ItemRepository.java**

```java
package com.shop.shop.repository;

import com.shop.shop.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {

}
```

<br>

## JpaRepository
---

JpaReporitory 는 2개의 제네릭 타입을 사용하는데 첫번째에는 엔티티 타입 클래스, 두번재는 기본키 타입을 넣어줌

JpaReporitory 는 기본적인 CRUD 및 페이징 처리를 위한 메소드가 정의돼 있음

- JpaReporitory 에서 지원하는 메소드 예시

    ![jpaRepository](https://user-images.githubusercontent.com/79130276/140668825-9087ab17-8b1b-43ae-86cd-1d09c0e49de1.png)

<br>

**application-test.properties**

```java
# Datasource 설정
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.url=jdbc:h2:mem:test
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

<br>

**ItemRepositoryTest.java**

```java
package com.shop.shop.repository;

import com.shop.shop.entity.Item;
import com.shop.shop.entity.ItemSellStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class ItemRepositoryTest {

    @Autowired
    ItemRepository itemRepository;

    @Test
    @DisplayName("상품 저장 테스트")
    public void createItemTest() {
        Item item = new Item();
        item.setItemNm("테스트 상품");
        item.setPrice(10000);
        item.setItemDetail("테스트 상품 상세 설명");
        item.setItemSellStatus(ItemSellStatus.SELL);
        item.setStockNumber(100);
        item.setRegTime(LocalDateTime.now());
        item.setUpdateTime(LocalDateTime.now());
        Item savedItem = itemRepository.save(item);
        System.out.println(savedItem.toString());
    }
}
```

<br>

**@SpringBootTest**

통합 테스트를 위해 스프링 부트에서 제공하는 어노테이션

실제 애플리케이션을 구동할 때처럼 모든 Bean 을 IoC 컨테이너에 등록

애플리케이션의 규모가 크면 속도가 느려질 수 있다.

<br>

**@TestPropertySource(locations = "classpath:application-test.properties")**

테스트 코드 실행 시 application.properties 에 설정해둔 값보다 application-test.properties 에 같은 설정이 있다면 더 높은 우선순위를 부여

<br>

**@Autowired**

ItemRepository 를 사용하기 위해 어노테이션을 이용하여 Bean 을 주입

<br>

**@Test**

테스트할 메소드위에 선언하여 테스트 대상으로 지정

<br>

**@DisplayName("상품 저장 테스트")**

테스트 코드 실행 시 지정한 테스트명이 노출됨

Spring Data JPA 는 JPA 의 구현체인 Hibernate 를 이용하기 위한 여러 API 를 제공.

그중에서 가장 많이 사용하는 것이 **JpaRepository 라는 인터페이스**

<br>
<br>

## JpaRepository 예제

---

MemoRepository.java

```java
package org.zerock.ex2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.ex2.entity.Memo;

public interface MemoRepository extends JpaRepository<Memo, Long> {
}
```

작성된 MemoRepository 는 인터페이스 자체, JpaRepository 인터페이스를 상속하는 것만으로 모든 작업이 끝

JpaRepository 를 사용할 때는 엔티티의 타입 정보(Memo) 와 @Id 의 타입(Long) 을 지정.

Spring Data JPA 는 인터페이스 선언만으로 자동으로 스프링의 빈으로 등록됨

<br>

## 테스트 코드를 통한 CRUD 연습

---

- insert 작업: save(엔티티 객체)
- select 작업: findById(키 타입), getOne(키 타입)
- update 작업: save(엔티티 객체)
- delete 작업: deleteById(키 타입), delete(엔티티 객체)

<br>

특이하게 insert 와 update 작업에 사용하는 메서드가 동일하게 save() 를 이용하는데 이는 JPA 의 구현체가 메모리상(Entity Manager) 에서 객체를 비교하고 없다면 insert, 존재한다면 update 를 동작시키는 방식으로 동작하기 때문

MemoRepositoryTests.java

```java
package org.zerock.ex2.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.ex2.entity.Memo;

import java.util.Optional;
import java.util.stream.IntStream;

@SpringBootTest
class MemoRepositoryTests {

    @Autowired
    MemoRepository memoRepository;

    @Test
    public void testClass() {
        System.out.println(memoRepository.getClass().getName());
    }

    @Test
    @DisplayName("등록 작업 테스트")
    public void testInsertDummies() {
        IntStream.rangeClosed(1, 100).forEach(i -> {
            Memo memo = Memo.builder().memoText("Sample..." + i).build();
            memoRepository.save(memo);
        });
    }

    @Test
    @DisplayName("조회 작업 테스트")
    public void testSelect() {
        Long mno = 100L;
        Optional<Memo> result = memoRepository.findById(mno);

        System.out.println("=====================================");

        if (result.isPresent()) {
            Memo memo = result.get();
            System.out.println(memo);
        }
    }

    @Transactional
    @Test
    @DisplayName("조회 작업 테스트2")
    public void testSelect2() {
        Long mno = 100L;

        Memo memo = memoRepository.getOne(mno);

        System.out.println("=====================================");

        System.out.println(memo);
    }

    @Test
    @DisplayName("수정 작업 테스트")
    public void testUpdate() {
        Memo memo = Memo.builder().mno(100L).memoText("Update Text").build();

        System.out.println(memoRepository.save(memo));
    }

    @Test
    @DisplayName("삭제 작업 테스트")
    public void testDelete() {
        Long mno = 100L;

        memoRepository.deleteById(mno);
    }
}
```

1. testClass
    
    → 본격적인 테스트에 앞서 실제로 MemoRepository 가 정상적으로 스프링에서 처리되고, 의존성 주입에 문제가 없는지를 먼저 확인
    

1. 등록 작업 테스트
    
    → 한 번에 여러 개의 엔티티 객체를 저장하도록 작성
    
2. 조회 작업 테스트
    
    → findById(): Optional 타입으로 반환
    
    → findById() 를 실행하는 순간에 이미 SQL 은 처리가 됨
    
3. 조회 작업 테스트2
    
    → getOne(): Transactional 어노테이션이 추가로 필요
    
    → getOne() 의 리턴 값은 해당 객체이지만, 실제 객체가 필요한 순간까지 SQL 을 실행하지 않음
    
4. 수정 작업 테스트
    
    → 내부적으로 해당 엔티티의 @Id 값이 일치하는지를 확인해서 insert or update 작업을 처리
    
5. 삭제 작업 테스트
    
    → 삭제하려는 번호의 엔티티 객체가 있는지 먼저 확인하고, 이를 삭제
    
    → deleteById() 의 리턴 타입은 void, 만일 해당 데이터가 존재하지 않으면 예외를 발생

<br>
<br>