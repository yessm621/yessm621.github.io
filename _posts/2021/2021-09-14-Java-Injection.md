---
title: "의존성 주입, 3가지 방법"
categories:
  - SpringBoot
tags:
  - Java
  - SpringBoot
toc: true
toc_label: "Index"
toc_sticky: true
---

## 의존성 주입 방법

### 1. field injection

field injection 은 의존성을 주입하고 싶은 필드에 @Autowired 를 붙여주면 의존성이 주입된다.

```java
@Service
public class MemberService {

	@Autowired
	private MemberRepository memberRepository;

}
```

<br>

### 2. setter based injection

setter 메서드에 @Autowired 를 붙여 의존성을 주입하는 방식

```java
@Service
public class MemberService {

	private MemberRepository memberRepository;

	@Autowired
	public void setMemberRepository(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;
	}

}
```

<br>

### 3. Constructor based injection (현재 가장 권장하는 방법)

생성자를 사용하여 의존성을 주입하는 방식

```java
@Service
public class MemberService {

	private MemberRepository memberRepository;

	public MemberService(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;
	}

}
```

```java
@Service
public class MemberService {

	private final MemberRepository memberRepository;

	public MemberService(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;
	}

}
```

<br>

field injection, setter based injection 은 constructor based injection 과 빈을 주입하는 순서가 다르다.

- field injection, setter based injection: 런타임에서 의존성을 주입하기 때문에 의존성을 주입하지 않아도 객체가 생성됨
- constructor based injection: 객체가 생성되는 시점에 빈을 주입. 의존성이 주입되지 않아 발생하는 NullPointerException 을 방지

<br>
<br>

## lombok 을 활용한 생성자 주입

@RequiredArgsConstructor 는 final 로 선언된 필드를 가지고 생성자를 만들어줌.

개발도중 필드가 바뀌어도 lombok 의 관리하에 생성자 코드의 파라미터를 고칠 필요가 없다.

```java
@Service
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepository memberRepository;

}
```


<br>
<br>