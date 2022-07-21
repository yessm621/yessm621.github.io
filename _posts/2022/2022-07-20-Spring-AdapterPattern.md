---
title:  "어댑터 패턴"
last_modified_at: 2022-07-20T17:40:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

프론트 컨트롤러에 어댑터 패턴을 사용하면 프론트 컨트롤러가 다양한 방식의 컨트롤러를 처리할 수 있도록 변경할 수 있다. FrontController와 컨트롤러 사이에 `핸들러 어댑터`를 둔다.

![4](https://user-images.githubusercontent.com/79130276/179937585-86870e1c-2324-4849-b05a-c28c3f954c45.png)

<br>

**핸들러 어댑터**

어댑터 역할을 해주어 다양한 종류의 컨트롤러를 호출 가능하다.

<br>

**핸들러**

컨트롤러의 이름을 더 넓은 범위인 핸들러로 변경. 어댑터가 있기 때문에 컨트롤러 뿐만 아니라 어떠한 것이든 해당하는 종류의 어댑터만 있으면 처리가 가능하다. (핸들러와 컨트롤러는 같은 의미지만 핸들러가 더 넓은 범위에 속한다)

<br>

### 어댑터 패턴이 적용된 MVC의 프로세스 흐름

예) GET http://localhost:8080/front-controller/v5/v3/members/new-form 요청

1. 클라이언트가 HTTP 요청을 함
2. URI(/front-controller/v5/v3/members/new-form)를 통해 핸들러매핑 정보를 찾고 핸들러(컨트롤러)를 반환 (MemberFormControllerV3)
3. 핸들러 어댑터가 있는지 확인 후, ControllerV3HandlerAdapter을 반환