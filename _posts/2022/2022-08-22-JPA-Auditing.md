---
title: "Auditing (공통 매핑 정보)"
last_modified_at: 2022-08-22T23:45:00
categories:
  - JPA
tags:
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

## @MappedSuperclass

**공통 매핑 정보**가 필요할 때 사용한다. 해당 어노테이션이 적용된 클래스는 테이블로 생성하지 않고 해당 클래스를 상속한 엔티티의 클래스로 데이터베이스 테이블이 생성된다. 직접 생성해서 사용할 일이 없으므로 **추상 클래스** 권장한다.  테이블과 관계 없고, 단순히 엔티티가 공통으로 사용하는 매핑 정보를 모으는 역할을 하며 주로 등록일, 수정일, 등록자, 수정자 같은 전체 엔티티에서 공통으로 적용하는 정보를 모을 때 사용한다.

```java
@MappedSuperclass
@EntityListeners(value = {AuditingEntityListener.class})
@Getter
abstract class BaseEntity {

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

엔티티 객체에 어떤 변화가 일어나는 것을 감지하는 리스너가 있다. JPA 내부에서 엔티티 객체가 생성/변경되는 것을 감지하는 역할은 **AuditingEntityListener**로 이루어진다.

@CreatedDate 는 생성시간, @LastModifiedDate 는 최종 수정 시간을 처리 속성으로 insertable, updateable 등이 있는데 updateable = false 로 지정하면 객체를 데이터베이스에 반영할 때 create_at 컬럼값은 변경되지 않는다.

AuditingEntityListener를 활성화시키기 위해 프로젝트의 `@EnableJpaAuditing` 설정을 추가한다.

```java
@SpringBootApplication
@EnableJpaAuditing
public class BoardApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoardApplication.class, args);
    }
}
```

정리하자면, @EnableJpaAuditing 스프링 부트 설정 클래스에 적용하고 @EntityListeners(AuditingEntityListener.class)는 엔티티에 적용한다.

## Auditing

작성일, 수정일은 대부분의 엔티티에서 필요하다. 그러나, 작성자, 수정자의 경우 필요 없을 경우를 생각해 분리해서 작성하자.

```java
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
public class BaseEntity extends BaseTimeEntity {

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String lastModifiedBy;
}
```

```java
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
public class BaseTimeEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
}
```

```java
@EnableJpaAuditing
@SpringBootApplication
public class DataJpaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DataJpaApplication.class, args);
	}

	@Bean
	public AuditorAware<String> auditorProvider() {
		return () -> Optional.of(UUID.randomUUID().toString());
	}
}
```

등록자, 수정자를 처리해주는 AuditorAware 스프링 빈을 등록한다. (실무에서는 세션 정보나, 스프링 시큐리티 로그인 정보에서 ID를 받는다.)

> **참고**
실무에서 대부분의 엔티티는 등록시간, 수정시간이 필요하지만, 등록자, 수정자는 없을 수도 있다. 그래서 위와 같이 Base 타입을 분리하고, 원하는 타입을 선택해서 상속한다.
> 

> **참고**
저장시점에 등록일, 등록자는 물론이고, 수정일, 수정자도 같은 데이터가 저장된다. 데이터가 중복 저장되는 것 같지만, 이렇게 해두면 변경 컬럼만 확인해도 마지막에 업데이트한 유저를 확인 할 수 있으므로 유지보수 관점에서 편리하다. 이렇게 하지 않으면 변경 컬럼이 null 일때 등록 컬럼을 또 찾아야 한다. 참고로 저장시점에 저장데이터만 입력하고 싶으면 @EnableJpaAuditing(modifyOnCreate = false) 옵션을 사용하면 된다.
>