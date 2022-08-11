---
title: "API 개발 시 주의할 점 - 기본"
last_modified_at: 2022-08-11T16:50:00
categories:
  - SpringBoot
tags:
  - SpringBoot
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

> **참고**
<br>
Web Controller Package와 API Controller Package는 분리하는게 좋다
> 

<aside>
💡 API 요청/응답에 엔티티를 노출하지 않는게 좋다.

</aside>

### API에 엔티티를 노출시킬 경우 발생하는 문제점

1. 실무에서는 회원 엔티티를 위한 API가 다양하게 만들어지는데, 한 엔티티에 각각의 API를 위한 모든 요청 요구사항을 담기는 어렵다.
2. 엔티티가 변경되면 API 스펙이 변한다.

<br>

따라서, API 요청 스펙에 맞추어 별도의 `DTO`를 파라미터로 받는다.

### 등록 API 예제

```java
@RestController
@RequiredArgsConstructor
public class MemberApiController {

    private final MemberService memberService;

    @PostMapping("/api/v1/members")
    public CreateMemberResponse saveMemberV1(@RequestBody @Valid Member member) {
        Long id = memberService.join(member);
        return new CreateMemberResponse(id);
    }

    @PostMapping("/api/v2/members")
    public CreateMemberResponse saveMemberV2(@RequestBody @Valid CreateMemberRequest request) {
        Member member = new Member();
        member.setName(request.getName());
        Long id = memberService.join(member);
        return new CreateMemberResponse(id);
    }

    @Data
    static class CreateMemberRequest {
        private String name;
    }

    @Data
    static class CreateMemberResponse {
        private Long id;

        public CreateMemberResponse(Long id) {
            this.id = id;
        }
    }
}
```

### 별도의 DTO를 생성할 경우 장점

1. 엔티티와 프레젠테이션 계층을 위한 로직을 분리할 수 있다.
2. 엔티티와 API 스펙을 명확하게 분리할 수 있다.
3. 엔티티가 변해도 API 스펙이 변하지 않는다.

> **참고**
<br>
엔티티에는 롬북 애노테이션을 제한해서 사용했다. (@Getter 등)
<br>
DTO는 데이터의 요청/응답을 주는 용도이고 크게 로직이 있는 것도 아니기 때문에 엔티티보다 비교적 자유롭게 사용한다.
>

<br> 

(참고) JPA 1편 복습

데이터를 **수정**할 때는 `변경감지`를 이용한다.

**@Transactional**이 있는 상태에서 데이터를 조회하면 **영속성 컨텍스트**에서 데이터를 가져오고 Transactional이 끝난 후 commit 되는 시점에서 **변경 감지**가 일어난다.

```java
@Transactional
public void update(Long id, String name) {
    Member member = memberRepository.findOne(id);
    member.setName(name);
}
```

> **참고** MemberService 코드에서 반환을 Member로 하지 않고 void로 한 이유?
<br>
update() 메서드는 갱신해주는 메서드인데 Member를 반환해버리면 조회까지 같이 하는 격이다. 트래픽이 높지 않으면 분리해주는 것이 좋다.
(보통 트래픽이 높은 API는 조회 API)
> 

### 조회 API를 만들때 엔티티를 외부에 노출하면 생기는 문제

1. 실무에서는 회원 엔티티를 위한 API가 다양하게 만들어지는데, 한 엔티티에 각각의 API를 위한 모든 요청 요구사항을 담기는 어렵다.
2. 엔티티가 변경되면 API 스펙이 변한다.
3. 기본적으로 엔티티의 모든 값이 노출된다.
4. 응답 스펙을 맞추기 위해 로직이 추가된다. (@JsonIgnore 같은) → 그럼에도 1번 문제가 발생
5. 추가로 컬렉션을 직접 반환하면 항후 API 스펙을 변경하기 어렵다. (별도의 Result 클래스 생성으로 해결)

1번, 2번은 위에서 언급했으니 넘어가고 3번의 경우는 데이터 조회 시 엔티티를 그대로 노출할 경우 비밀번호 같은 개인정보도 같이 노출될 위험이 있다.

4번의 경우 엔티티로 조회하면 연관관계로 묶여있는 다른 엔티티들도 같이 나온다. @JsonIgnore를 사용해서 제외시킬 수 있지만 여러 API를 만들다 보면 다른 엔티티가 필요한 순간도 있다. 이처럼 케이스가 다양하기 때문에 문제가 발생할 수 밖에 없다. 또한, 엔티티가 변경되면 API 스펙도 변경된다.

5번의 경우 엔티티를 반환하게 되면 Array를 반환하게 된다. 이는 확장성이 매우 떨어진다. 만약, 데이터 리스트와 조회한 데이터 개수를 같이 반환하고 싶어도 데이터 리스트가 Array로 반환되었기때문에 데이터 개수를 추가로 반환할 수 없다. (확장성이 매우 떨어진다.)

```json
// 엔티티를 그대로 반환
[
    // 에러발생!!
    //"count": 3,
    {
        "id": 1,
        "name": "new-hello",
        "address": null
    },
    {
        "id": 2,
        "name": "member1",
        "address": {
            "city": "서울",
            "street": "11",
            "zipcode": "111"
        }
    }
]
```

```json
// 별도의 result 클래스를 생성하여 해결
{
    "count": 3,
    "data": [
	      {
	          "id": 1,
	          "name": "new-hello",
	          "address": null
	      },
	      {
	          "id": 2,
	          "name": "member1",
	          "address": {
	              "city": "서울",
	              "street": "11",
	              "zipcode": "111"
	          }
  	    }
    ]
}

```

아래 코드와 같이 엔티티를 DTO로 변환해서 반환한다. 추가로 Result 클래스로 컬렉션을 감싸서 향후 필요한 필드를 추가할 수 있다.

```java
@GetMapping("/api/v2/members")
public Result member2V1() {
    List<Member> findMembers = memberService.findMembers();
    List<MemberDTO> collect = findMembers.stream()
            .map(m -> new MemberDTO(m.getName()))
            .collect(Collectors.toList());

    return new Result(collect.size(), collect);
}

@Data
@AllArgsConstructor
static class Result<T> {
    private int count;
    private T data;
}

@Data
@AllArgsConstructor
static class MemberDTO {
    private String name;
}
```

```json
{
    "count": 3,
    "data": [
        {
            "name": "new-hello"
        },
        {
            "name": "member1"
        },
        {
            "name": "member2"
        }
    ]
}
```

API 스펙은 노출할 것만 노출해야한다. 즉, API 스펙은 DTO와 1:1이다. 유지보수 관점에서도 DTO를 사용하는 것이 매우 좋다.

`엔티티는 절대 노출하지말자! 꼭 API에 맞는 스펙의 DTO를 생성할 것!`