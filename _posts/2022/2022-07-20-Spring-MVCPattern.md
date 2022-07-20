---
title:  "MVC 패턴"
last_modified_at: 2022-07-20T17:32:00
categories: 
  - Spring
tags:
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

### 서블릿과 JSP의 한계

서블릿으로 개발을 하면 뷰 화면을 위해 HTML을 만드는 작업이 자바 코드에 섞여서 지저분하고 복잡하다.

JSP를 사용하면서 HTML 작업이 깔끔해졌지만 자바 코드, 데이터를 조회하는 리포지토리 등이 JSP에 노출된다는 단점이 있다. (JSP가 너무 많은 역할을 한다) → 유지보수 지옥

<br>

### MVC 패턴 개요

하나의 서블릿, JSP 만으로 비즈니스 로직과 뷰 렌더링을 모두 처리하게 되면 너무 많은 역할을 하게 된다. 이부분은 향후 유지보수를 진행하게 되었을 때 문제가 많이 생긴다.

UI를 수정하는 일과 비즈니스 로직을 수정하는 일은 변경의 라이프 사이클이 다르다. 때문에 수정 시 각각 다르게 발생할 가능성이 매우 높고 대부분 서로에게 영향을 주지 않는다. 변경의 라이프 사이클이 다른 부분을 하나의 코드로 관리하는 것은 유지보수하기 좋지 않다.

결과적으로, JSP 같은 뷰 템플릿은 화면을 렌더링 하는데 최적화 되어 있기 때문에 이 부분에 대한 업무만 담당하는 것이 효과적이다.

<br>

이러한 부분들을 개선하기 위해 등장한 것이 MVC 패턴이다.

MVC 패턴은 하나의 서블릿이나 JSP로 처리하던 것을 컨트롤러와 뷰라는 영역으로 서로 역할을 나눈 것을 의미한다. 웹 애플리케이션은 보통 이 MVC 패턴을 사용한다.

<br>

- **컨트롤러**: HTTP 요청을 받아서 파라미터를 검증, 비즈니스 로직을 실행함. 뷰에 전달할 결과 데이터를 조회해서 모델에 담는다
- **모델**: 뷰에 출력할 데이터를 담아둠. 뷰가 필요한 데이터를 모두 모델에 담아서 전달. 따라서, 뷰는 비즈니스 로직이나 데이터 접근을 몰라도 되고 화면을 렌더링 하는 일에 집중함
- **뷰**: 모델에 담겨있는 데이터를 사용해서 화면을 그리는 일에 집중 (HTML 생성)

![3](https://user-images.githubusercontent.com/79130276/179936330-b115a55d-3269-4d45-9d31-465cd7527fca.png)

```java
package hello.servlet.web.servletmvc;

import hello.servlet.domain.member.Member;
import hello.servlet.domain.member.MemberRepository;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "mvcMemberListServlet", urlPatterns = "/servlet-mvc/members")
public class MvcMemberListServlet extends HttpServlet {

    private MemberRepository memberRepository = MemberRepository.getInstance();

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        List<Member> members = memberRepository.findAll();

        request.setAttribute("members", members);

        String viewPath = "/WEB-INF/views/members.jsp";
        RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
        dispatcher.forward(request, response);
    }
}
```

<br>

> **참고**
<br>
컨트롤러에 비즈니스 로직을 둘 수도 있지만 이렇게 되면 컨트롤러가 너무 많은 역할을 담당하게 됨. 따라서, 비즈니스 로직은 **서비스**라는 계층을 별도로 만들어서 처리 컨트롤러는 비즈니스 로직이 있는 서비스를 호출하는 담당.
> 

<br>

*서블릿 - 컨트롤러, JSP - 뷰*

<br>

> **참고** redirect vs forward
<br>
**리다이렉트**는 클라이언트에 응답이 나갔다가 클라이언트가 redirect 경로로 다시 요청. 따라서, 클라이언트가 인지할 수 있고, URL 경로도 실제로 변경 됨. **포워드**는 **서버 내부에서 일어나는 호출**이기 때문에 클라이언트가 인지하지 못함
>