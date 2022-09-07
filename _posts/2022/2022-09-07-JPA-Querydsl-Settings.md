---
title: "Querydsl 설정"
last_modified_at: 2022-09-07T17:15:00
categories:
  - JPA
tags:
  - JPA
  - Querydsl
toc: true
toc_label: "Index"
toc_sticky: true
---

## Querydsl 설정

springboot, gradle 버전에 따라 Querydsl 설정 방법이 많이 다르다. 주의하자!

- SpringBoot version: 2.7.3
- gradle: 7.5

gradle.build
```
// 1. querydsl version 정보 추가
buildscript {
	ext {
		queryDslVersion = "5.0.0"
	}
}

plugins {
	id 'org.springframework.boot' version '2.7.3'
	id 'io.spring.dependency-management' version '1.0.13.RELEASE'
	// 2. querydsl plugins 추가
	id "com.ewerk.gradle.plugins.querydsl" version "1.0.10"
	id 'java'
}

group = 'study'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-web'

	// 3. querydsl dependencies 추가
	implementation "com.querydsl:querydsl-jpa:${queryDslVersion}"
	implementation "com.querydsl:querydsl-apt:${queryDslVersion}"

	compileOnly 'org.projectlombok:lombok'
	runtimeOnly 'com.h2database:h2'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
	useJUnitPlatform()
}

// 4. querydsl 추가 시작
// querydsl 에서 사용할 경로 설정
def querydslDir = "$buildDir/generated/querydsl"
// JPA 사용 여부와 사용할 경로를 설정
querydsl {
	jpa = true
	querydslSourcesDir = querydslDir
}
// build 시 사용할 sourceSet 추가
sourceSets {
	main.java.srcDir querydslDir
}
// querydsl 이 compileClassPath 를 상속하도록 설정
configurations {
	querydsl.extendsFrom compileClasspath
}
// querydsl 컴파일 시 사용할 옵션 설정
compileQuerydsl {
	options.annotationProcessorPath = configurations.querydsl
}
//querydsl 추가 끝
```

## 검증용 Q 타입 생성

**Gradle IntelliJ 사용법**

- Gradle → Tasks → build → clean
- Gradle → Tasks → other → compileQuerydsl

**Gradle 콘솔 사용법**

- ./gradlew clean compileQuerydsl
- ./gradlew clean compileJava

**Q 타입 생성 확인**

- build → generated → querydsl
    - study.querydsl.entity.QHello.java 파일이 생성되어 있어야 함

> **참고**
<br>
Q타입은 컴파일 시점에 자동 생성되므로 버전관리(GIT)에 포함하지 않는 것이 좋다. 앞서 설정에서 생성 위치를 gradle build 폴더 아래 생성되도록 했기 때문에 이 부분도 자연스럽게 해결된다. (대부분 gradle build 폴더를 git에 포함하지 않는다.)
>

### Querydsl Q타입이 정상 동작하는지 확인하는 테스트 코드

```java
@SpringBootTest
@Transactional
class QuerydslApplicationTests {

    @Autowired
    EntityManager em;

    @Test
    void contextLoads() {
        Hello hello = new Hello();
        em.persist(hello);

        JPAQueryFactory query = new JPAQueryFactory(em);
//        QHello qHello = new QHello("h");
        QHello qHello = QHello.hello;

        Hello result = query
                .selectFrom(qHello)
                .fetchOne();

        assertThat(result).isEqualTo(hello);
        assertThat(result.getId()).isEqualTo(hello.getId());
    }
}

```

## Querydsl 관련 라이브러리

- querydsl-apt: Querydsl 관련 코드 생성 기능 제공, Q타입 생성해준다.
- querydsl-jpa: querydsl 라이브러리, 애플리케이션 코드 작성을 도와준다.