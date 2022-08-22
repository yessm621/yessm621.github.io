---
title: "변경감지와 병합 - 첫번째"
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

## 준영속 이란?

→ 영속성 컨텍스트가 관리하는 영속 상태의 엔티티가 영속성 컨텍스트에서 분리된(detached) 것을 준영속 상태라 한다

<br>

### 영속 상태 엔티티를 준영속 상태로 만드는 방법

1. em.detach(entity): 특정 엔티티만 준영속 상태로 전환
2. em.clear(): 영속성 컨텍스트를 완전히 초기화
3. em.close(): 영속성 컨텍스트를 종료

<br>
<br>

## 준영속 엔티티란?

영속성 컨텍스트가 더는 관리하지 않는 엔티티를 말한다

준영속이라는 단어는 객체를 new 했거나, 안했거나를 기준으로 나누는 것이 아니다

**핵심은 식별자를 기준으로 영속상태가 되어서 DB에 저장된 적이 있는가** 를 기준으로 생각해야함

그래서 식별자를 기준으로 이미 한번 영속상태가 되어버린 엔티티가 있는데, 더이상 영속성 컨텍스트가 관리하지 않으면 모두 준영속 상태


ItemController.java

```java
...

	Book book = new Book();
	book.setId(form.getId());
	book.setName(form.getName());
	book.setPrice(form.getPrice());
	book.setStockQuantity(form.getStockQuantity());
	book.setAuthor(form.getAuthor());
	book.setIsbn(form.getIsbn());

	itemService.saveItem(book);

...
```

Book 이라는 새로운 객체를 생성했지만 book 에 들어가는 데이터는 이미 DB 에 한번 저장되어서 식별자가 존재한다. 임의로 만들어낸 엔티티도 기존 식별자를 가지고 있으면 `준영속 엔티티`로 볼 수 있다.

<br>
<br>

### 준영속 엔티티를 변경하는 방법

1. 변경 감지 (dirty checking 이라고도 한다)
2. 병합 (merge)

<br>
<br>

## 변경 감지

영속성 컨텍스트에서 엔티티를 다시 조회한 후에 데이터를 수정하는 방법

트랜잭션 안에서 엔티티를 다시 조회, 변경할 값 선택 트랜잭션 커밋 시점에 변경 감지(Dirty Checking)
이 동작해서 데이터베이스에 UPDATE SQL 실행

```java
...

@Transactional
public void updateItem(Long itemId, Book param){
	//findItem 은 영속상태
	Item findItem = itemRepository.findOne(itemId);
	findItem.setPrice(param.getPrice());
	findItem.setName(param.getName());
	findItem.setStockQuantity(param.getStockQuantity());
}

...
```

<br>
<br>

## 병합 (merge)

준영속 상태의 엔티티를 영속 상태로 변경할 때 사용하는 기능

```java
@Transactional
void update(Item itemParam) { //itemParam: 파리미터로 넘어온 준영속 상태의 엔티티
 Item mergeItem = em.merge(item);
}
```


```java
...

@Transactional
public Item updateItem(Long itemId, Book param){
	//findItem 은 영속상태
	Item findItem = itemRepository.findOne(itemId);
	findItem.setPrice(param.getPrice());
	findItem.setName(param.getName());
	findItem.setStockQuantity(param.getStockQuantity());
	
	return findItem;
}

...
```

첫번째 코드와 두번째 코드의 동작 방식은 똑같다.

첫번째 코드는 JPA 를 사용하여 간단하게 작성 할 수 있다.

> 주의: 변경 감지 기능을 사용하면 원하는 속성만 선택해서 변경할 수 있지만, 병합을 사용하면 모든 속성이
변경된다. 병합시 값이 없으면 null 로 업데이트 할 위험도 있다. (병합은 모든 필드를 교체한다.)
> 

따라서, 실무에선 병합(merge)을 쓰지 말고 `변경 감지`를 사용하자

<br>
<br>

## 정리

1. 엔티티를 변경할 때는 항상 변경 감지를 사용
2. 컨트롤러에서 어설프게 엔티티를 생성하지 말고
3. 트랜잭션이 있는 서비스 계층에 식별자( id )와 변경할 데이터를 명확하게 전달 (파라미터 or dto)
4. 트랜잭션이 있는 서비스 계층에서 영속 상태의 엔티티를 조회하고, 엔티티의 데이터를 직접 변경
5. 트랜잭션 커밋 시점에 변경 감지가 실행됨

<br>

ItemController.java

```java
...

@PostMapping("/items/{itemId}/edit")
public String updateItem(@PathVariable Long itemId, @ModelAttribute("form") BookForm form){

	Book book = new Book();
	book.setId(form.getId());
	book.setName(form.getName());
	book.setPrice(form.getPrice());
	book.setStockQuantity(form.getStockQuantity());
	book.setAuthor(form.getAuthor());
	book.setIsbn(form.getIsbn());

	itemService.saveItem(book);
	return "redirect:/items";
}

...
```

<br>


ItemController.java (파라미터를 명확하게 함)

```java
...

@PostMapping("/items/{itemId}/edit")
public String updateItem(@PathVariable Long itemId, @ModelAttribute("form") BookForm form){

	itemService.updateItem(itemId, form.getName(), form.getPrice(), form.getStockQuantity());
	return "redirect:/items";
}

...
```

ItemService.java

```java
@Transactional
public void updateItem(Long itemId, String name, int price, int stockQuantity) {
	Item findItem = itemRepository.findOne(itemId);
	findItem.setName(name);
	findItem.setPrice(price);
	findItem.setStockQuantity(stockQuantity);
}
```

첫번째 코드 처럼 사용하는 것 보다 아래 코드 처럼 파라미터를 명확하게 해주는게 훨씬 더 좋은 코드이다.