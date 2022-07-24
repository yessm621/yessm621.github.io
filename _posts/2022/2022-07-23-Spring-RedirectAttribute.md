---
title:  "RedirectAttributes"
last_modified_at: 2022-07-23T00:05:00
categories: 
  - Spring
tags:
  - Spring
toc: false
toc_label: "Index"
toc_sticky: true
---

`RedirectAttributes`를 사용하면 URL **인코딩**도 해주고, **pathVarible**, **쿼리 파라미터**까지 처리해준다.

- redirect:/basic/items/{itemId}
    - pathVariable 바인딩: {itemId}
    - 나머지는 쿼리 파라미터로 처리: ?status=true

<br>

```java
/**
 * RedirectAttributes
 */
@PostMapping("/add")
public String addItemV6(Item item, RedirectAttributes redirectAttributes) {
    Item savedItem = itemRepository.save(item);
    redirectAttributes.addAttribute("itemId", savedItem.getId());
    redirectAttributes.addAttribute("status", true);
    return "redirect:/basic/items/{itemId}";
}
```

코드를 실행하면 다음과 같은 리다이렉트 결과가 나온다.

```
http://localhost:8080/basic/items/3?status=true
```