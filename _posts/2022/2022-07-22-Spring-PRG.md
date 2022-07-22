---
title:  "PRG, Post/Redirect/Get"
last_modified_at: 2022-07-22T23:45:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

아래 코드는 상품을 등록하고 상품 목록 페이지로 다시 돌아가는 코드이다. 이 코드에서는 오류가 있다.

상품을 등록을 완료하고 웹 브라우저의 **새로고침 버튼**을 누를 때마다 상품이 새로 등록된다.

```java
@PostMapping("/add")
public String addItemV5(Item item) {
    itemRepository.save(item);
    return "/basic/item"
}
```

<br>

### 상품 저장 프로세스

![Untitled](https://user-images.githubusercontent.com/79130276/180463695-57f36fa4-224d-4921-8d3d-e7ff713d9b37.png)

1. 상품 등록 폼에서 상품 등록 버튼을 누르면
2. 상품 저장 컨트롤러로 이동한다.
3. 저장 컨트롤러에서 상품 상세 뷰를 호출한다.
4. 클라이언트가 마지막으로 요청한 url은 상품 저장 url이다.

<br>

### 새로고침시 발생하는 문제

![스크린샷 2022-07-22 오후 11 05 28](https://user-images.githubusercontent.com/79130276/180463720-af7ca6d9-f8b2-4090-98ea-2739ba1f5aa3.png)


상품 등록 버튼을 누르면 클라이언트는 ‘POST /add + 상품데이터’를 서버에 전달한다. 서버에서 상품 저장 프로세스가 종료 된 후 상품 상세 뷰가 보이게 되는데 여기서 **새로고침**은 클라이언트가 마지막에 보낸 요청을 다시 보내게 된다. 따라서, 새로고침을 누르면 POST /add가 다시 요청되면서 같은 데이터가 또 저장되는 것이다.

<br>

그렇다면 이러한 문제를 어떻게 해결할 수 있을까?

<br>

### PRG - 새로고침 문제 해결

![스크린샷 2022-07-22 오후 11 13 50](https://user-images.githubusercontent.com/79130276/180463716-dd322f1b-191b-4ae9-9997-867f16c1d73b.png)

웹 브라우저의 새로 고침은 마지막에 서버에 전송한 데이터를 다시 전송한다. 새로 고침 문제를 해결하려면 상품 저장 후에 뷰 템플릿으로 이동하는 것이 아니라, 상품 상세 화면으로 `리다이렉트를 호출`해주면 된다.

웹 브라우저는 리다이렉트의 영향으로 상품 저장 후에 실제 상품 상세 화면으로 다시 이동한다. 따라서, 마지막에 호출한 내용이 상품 상세 화면인 ‘GET /items/{id}’ 가 되는 것이다. 이후 새로고침을 해도 상품 상세 화면으로 이동하게 되므로 새로 고침 문제를 해결할 수 있다.

<br>

```java
/**
 * PRG - Post/Redirect/Get
 */
@PostMapping("/add")
public String addItemV5(Item item) {
    itemRepository.save(item);
    // return "/basic/item"
    return "redirect:/basic/items/" + item.getId();
}
```

기존엔 상품 등록 후 뷰 템플릿(/basic/item)을 리턴하였는데 이젠 상품 상세 화면으로 리다이렉트 하도록 코드를 작성하여 문제를 해결하였다. 이런 문제 해결 방식을 `PRG Post/Redirect/Get`라 한다.

<br>

### PRG 적용 전

1. ‘POST /items/add + 상품 데이터‘를 서버로 전송
2. 서버에서 클라이언트로 ‘POST + 200 응답코드’ 전달
3. 클라이언트가 서버에 마지막으로 요청한 url은 ‘POST /items/add + 상품 데이터‘ 이다
4. 클라이언트의 새로고침은 마지막에 서버에 전송한 데이터를 다시 전송하는 것이다
5. 따라서, 새로고침을 할때마다 1번을 전송한다. (무의미한 데이터를 저장하게 된다)

<img width="568" alt="스크린샷 2022-07-22 오후 11 23 16" src="https://user-images.githubusercontent.com/79130276/180464226-cc5f7b3c-37a0-40f5-8b02-d640f10a31aa.png">

<br>

### PRG 적용 후

1. ‘POST /items/add + 상품 데이터‘를 서버로 전송
2. 서버에서 클라이언트로 ‘POST + 302 응답 코드 + Location’ 전달
3. 302 응답 코드와 Location이 전달되면 Location에 적힌 url을 다시 호출하게 된다.
4. 따라서, 클라이언트는 서버에 ‘GET + /items/{id}’를 요청하게 된다.
5. 클라이언트가 서버에 마지막으로 요청한 url은 ‘GET + /items/{id}’ 이다
6. 클라이언트의 새로고침은 마지막에 서버에 전송한 데이터를 다시 전송하는 것이다
7. 따라서, 새로고침을 할때마다 5번을 전송한다. (새로고침 오류를 해결!)

<img width="613" alt="스크린샷 2022-07-22 오후 11 25 43" src="https://user-images.githubusercontent.com/79130276/180464206-79a1214a-c986-45e5-a805-1a54b4e7cf20.png">

<br>

> **주의**
<br>
`"redirect:/basic/items/" + item.getId()`  redirect에서 **+item.getId()** 처럼 URL에 변수를 더해서 사용하는 것은 URL 인코딩이 안되기 때문에 위험하다. 위의 경우는 int여서 괜찮았지만 문자열을 전송하게 되어 한글을 전송하게 된다면 인코딩 문제가 발생하게 된다. 이러한 문제는 다음에 설명하는 `RedirectAttributes`를 사용하여 해결할 수 있다.
>