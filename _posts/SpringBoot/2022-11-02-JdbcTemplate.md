---
title: "JDBC Template"
categories:
  - SpringBoot
tags:
  - SpringBoot
  - DB
toc: true
toc_sticky: true
---

## 템플릿 패턴

템플릿 패턴이란 어떤 작업을 처리할 때 전체적인 구조는 동일하면서 부분적으로 다른 구문으로 구성하여 코드의 중복을 최소화 할 때 유용한 패턴이다.

## JDBC Template

JDBC 템플릿은 JDBC와 마찬가지로 데이터를 저장하기 위해 사용하는 API이다. 스프링의 가장 기본적인 Data Access 템플릿으로 쿼리 기반으로 데이터베이스의 접근이 가능하다. JDBC 템플릿을 사용하면 리포지토리에서 JDBC를 사용함으로써 발생하는 반복 문제를 해결할 수 있다.

**JDBC 반복 문제**

- 커넥션 조회, 커넥션 동기화
- PreparedStatement 생성 및 파라미터 바인딩
- 쿼리 실행
- 결과 바인딩
- 예외 발생 시 스프링 예외 변환기 실행
- 리소스 종료

리포지토리의 각각의 메서드를 살펴보면 상당히 많은 부분이 반복되는데 이런 반복을 효과적으로 처리하는 방법이 바로 `템플릿 콜백 패턴`이다. 또한, 스프링은 JDBC의 반복 문제를 해결하기 위해 `JdbcTemplate`이라는 템플릿 제공한다.

```java
/**
 * JdbcTemplate 사용
 */
@Slf4j
public class MemberRepositoryV5 implements MemberRepository {

    private final JdbcTemplate template;

    public MemberRepositoryV5(DataSource dataSource) {
        this.template = new JdbcTemplate(dataSource);
    }

    @Override
    public Member save(Member member) {
        String sql = "insert into member(member_id, money) values (?, ?)";
        template.update(sql, member.getMemberId(), member.getMoney());
        return member;
    }

    @Override
    public Member findById(String memberId) {
        String sql = "select * from member where member_id =?";
        return template.queryForObject(sql, memberRowMapper(), memberId);
    }

    private RowMapper<Member> memberRowMapper() {
        return (rs, rowNum) -> {
            Member member = new Member();
            member.setMemberId(rs.getString("member_id"));
            member.setMoney(rs.getInt("money"));
            return member;
        };
    }

    ...
}
```

JdbcTemplate은 JDBC로 개발할 때 발생하는 반복을 대부분 해결한다. 또한, 지금까지 학습했던 **트랜잭션을 위한 커넥션 동기화**와 예외 발생 시 **스프링 예외 변환기**도 자동으로 실행해주므로 따로 코드를 작성할 필요가 없다.