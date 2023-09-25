---
title: "변경 감지와 병합"
categories:
  - Jpa
tags:
  - Jpa
toc: true
toc_sticky: true
---

<aside>
✨ 결론부터 말하면 병합(merge)은 사용하지 말고 변경 감지(Dirth Checking)를 사용하자.

</aside>

변경 감지와 병합에 대해 알아보기 전에 먼저 준영속 엔티티에 대해 알아보자.

## 준영속 엔티티

`준영속 엔티티`란 영속성 컨텍스트가 더는 관리하지 않는 엔티티를 말한다. 영속성 컨텍스트가 관리하는 영속 상태의 엔티티가 영속성 컨텍스트에서 **분리(detached)**된 엔티티이다.

여기서는 itemService.saveItem(book)에서 수정을 시도하는 Book 객체이다. Book 객체는 이미 DB에 한번 저장되어서 식별자가 존재한다. 이렇게 임의로 만들어낸 엔티티도 기존 식별자를 가지고 있으면 준영속 엔티티로 볼 수 있다.

준영속이라는 단어는 객체를 new 했거나, 안했거나를 기준으로 나누는 것이 아니다. **핵심은 식별자를 기준으로 영속상태가 되어서 DB에 저장된 적이 있는가** 를 기준으로 생각해야 한다. 그래서 식별자를 기준으로 이미 한번 영속상태가 되어버린 엔티티가 있는데, 더이상 영속성 컨텍스트가 관리하지 않으면 모두 준영속 상태이다.

```java
@PostMapping("/items/{itemId}/edit")
public String updateItem(@PathVariable Long itemId, @ModelAttribute("form") BookForm form) {
    Book book = new Book();
    book.setId(form.getId());
    book.setName(form.getName());
    book.setPrice(form.getPrice());
    ...

    itemService.saveItem(book);
    return "redirect:/items";
}
```

위의 Book은 새로운 객체이다. 하지만, Book에 들어가는 데이터는 이미 DB에 한번 저장되어서 식별자가 존재한다. 임의로 만들어낸 엔티티도 기존 식별자를 가지고 있으면 `준영속 엔티티`로 볼 수 있다.

준영속 엔티티의 문제점은 JPA가 관리를 하지 않기 때문에 변경 감지가 일어나지 않는다. 그렇다면, 준영속 엔티티를 어떻게 수정해야 할까?

### 준영속 엔티티를 수정하는 방법

준영속 엔티티를 수정할 수 있는 방법은 **변경 감지(Dirty Checking)** 기능을 사용하거나 **병합(merge)**을 사용하는 것이다.

> **참고**
엔티티는 영속 상태로 관리된다. 영속 상태에 있는 엔티티는 값만 바꿔도 JPA가 트랜잭션 커밋 시점에 변경된 내용을 알아서 변경해준다.
> 

## 변경 감지와 병합(merge)

### 변경 감지 기능 사용

`변경 감지`는 영속성 컨텍스트에서 엔티티를 다시 조회한 후에 데이터를 수정하는 방법이다.

**트랜잭션 안**에서 식별자를 통해 엔티티를 다시 조회한 후, 트랜잭션 커밋 시점(flush())에 JPA가 변경된 내용을 찾아서 DB에 UPDATE SQL 실행한다. 이것이 변경 감지(Dirty Checking)이다.

```java
@Transactional
public void updateItem(Long itemId, Book param){
    Item findItem = itemRepository.findOne(itemId);
    findItem.setPrice(param.getPrice());
    findItem.setName(param.getName());
    findItem.setStockQuantity(param.getStockQuantity());
}
```

- 트랜잭션 안에서 itemRepository.findOne(itemId)을 조회하므로 영속 상태의 엔티티를 찾아온다.
    - 트랜잭션 바깥에서 조회하면 영속 상태의 엔티티를 조회하는 것이 아니다.
- 영속 상태의 데이터를 setter()로 수정한다.
- @Transactional 애노테이션으로 인해 커밋이 되면서 flush()를 날리면, 영속성 컨텍스트가 변경이 일어난 엔티티를 찾아 DB에 update 쿼리를 날려준다.

### 병합(merge)

병합은 준영속 상태의 엔티티를 영속 상태로 변경할 때 사용하는 기능이다.

```java
@Transactional
void update(Item itemParam) { //itemParam: 파리미터로 넘어온 준영속 상태의 엔티티
    Item mergeItem = em.merge(itemParam);
}
```

간단하게 말하면 병합은 변경 감지에서 사용했던 코드를 JPA가 코드 한줄로 처리한 것이다. merge()가 호출되면 파라미터로 넘어온 item의 식별자 값으로 1차 캐시에서 엔티티를 조회한다. 만약, 1차 캐시에 엔티티가 없으면 DB를 조회하고 1차 캐시에 저장한다. 조회한 엔티티는 영속 상태이다. JPA가 파라미터로 넘어온 값(준영속 엔티티)을 영속 상태의 엔티티의 값과 모두 바꿔치기(교체, merge) 한다. (findItem.setPrice(param.getPrice())을 자동으로 해준다.)

결과적으로, 위의 코드에서 파라미터로 넘어온 itemParam은 준영속 상태이고 mergeItem은 영속 상태이다.

### 왜 변경 감지를 사용해야 할까?

변경 감지 기능을 사용하면 원하는 속성만 선택해서 변경할 수 있지만, 병합을 사용하면 모든 속성이 변경된다. 병합 시 값이 없으면 null로 업데이트 할 위험이 있다. (병합은 모든 필드를 교체한다.)

실무에서 데이터 수정은 매우 제한적이다. 모든 필드를 변경하는 경우가 거의 없다. 따라서, 실무에선 가급적 병합(merge)을 쓰지 말고 `변경 감지`를 사용하자.

> **참고** 영속상태의 엔티티 수정
영속 상태의 엔티티는 변경 감지 기능이 동작해서 트랜잭션을 커밋할 때 자동으로 수정된다. 따라서, 별도의 수정 메서드를 호출할 필요가 없다.
> 

## 정리

**엔티티를 변경할 때는 항상 변경 감지를 사용하자.**

1. 컨트롤러에서 어설프게 엔티티를 생성하지 말자.
    
    ```java
    /* ItemController */
    @PostMapping("/items/{itemId}/edit")
    public String updateItem(@PathVariable Long itemId, @ModelAttribute("form") BookForm form){
        // 엔티티 생성하는 코드
        /*Book book = new Book();
        book.setId(form.getId());
        book.setName(form.getName());
        book.setPrice(form.getPrice());
        book.setStockQuantity(form.getStockQuantity());*/
        itemService.updateItem(itemId, form.getName(), form.getPrice(), form.getStockQuantity());
        return "redirect:/items";
    }
    ```
    
    ```java
    /* ItemService */
    @Transactional
    public void updateItem(Long itemId, String name, int price, int stockQuantity) {
        Item findItem = itemRepository.findOne(itemId);
        // setter() 사용 피하자.
        /*findItem.setName(name);
        findItem.setPrice(price);
        findItem.setStockQuantity(stockQuantity);*/
        findItem.update(itemId, name, price, stockQuantity);
    }
    ```
    
    파라미터로 전달할 데이터가 많다면 DTO를 사용하는 것도 하나의 방법이다.
    
    ```java
    /* ItemService */
    @Transactional
    public void updateItem(Long itemId, UpdateItemDto item) {
        Item findItem = itemRepository.findOne(itemId);
        ...
    }
    ```
    
    참고로 setter()를 열어서 사용하는 것보다 변경과 관련된 메서드를 만들어서 사용하는 것이 좋다.
    
2. 트랜잭션이 있는 서비스 계층에 식별자( id )와 변경할 데이터를 명확하게 전달 (파라미터 or dto)
3. 트랜잭션이 있는 서비스 계층에서 영속 상태의 엔티티를 조회하고, 엔티티의 데이터를 직접 변경
4. 트랜잭션 커밋 시점에 변경 감지가 실행됨