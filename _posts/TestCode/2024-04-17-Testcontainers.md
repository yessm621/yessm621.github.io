---
title: "통합테스트와 Testcontainers"
categories:
  - TestCode
tags:
  - TestCode
  - Spring
toc: true
toc_sticky: true
---

## 통합 테스트(Integration Test)

통합 테스트는 이름에서 의미하는 바와 같이 각각의 시스템들이 서로 어떻게 상호작용하고 제대로 작동하는지 테스트하는 것을 의미한다.

통합 테스트는 단위 테스트와 다르게 서로 다른 부분들이 원활하게 작동하는지 확인하기 위해 여러 모듈을 같이 테스트하는 과정이다. 예를 들어 나의 애플리케이션과 데이터베이스가 잘 연동 되었는지 확인한다.

### 통합 테스트 작성 시 어려움

통합 테스트는 아래와 같은 이유로 테스트 수행에 어려움이 있다.

1. 복잡한 시스템 구조와 모듈간의 의존성
2. 환경설정과 관리
3. 테스트 데이터 관리
4. 비결정적 테스트결과

여러 개발자가 동시에 테스트를 수행하다 보면, 데이터 격리가 제대로 이루어지지 않을 수도 있다. 이런 상황에서 동일한 입력값에도 불구하고 매번 다른 결과를 도출하는 비결정적(Non-deterministic) 테스트 결과가 발생할 수 있는데, 이런 비결정적 테스트 결과는 통합 테스트 작성과 유지보수를 어렵게 만드는 주요 요인이다.

## Testcontainers

Testcontainers는 통합 테스트를 지원하기 위해 개발된 오픈 소스 Java 라이브러리이다.

Testcontainers는 다음과 같은 특징이 있다.

- Java 언어만으로 Docker Container를 활용한 테스트 환경 구성이 가능
- 도커를 이용하여 테스트할 때 컨테이너를 직접 관리해야 하는 번거로움을 해결해주며 운영 환경과 유사한 스펙으로 테스트가 가능
- 테스트 코드가 실행 될 때 자동으로 도커 컨테이너를 실행하여 테스트하고, 테스트가 끝나면 자동으로 컨테이너를 종료 및 정리
- 다양한 모듈이 존재

이를 통해 개발자들은 실제 상황에 가까운 테스트 환경에서 코드를 검증하고 안정성 있는 애플리케이션을 개발할 수 있다.

## Testcontainers 환경 설정

build.gradle

```groovy
dependencies {
    // testcontainers
    testImplementation 'org.testcontainers:spock:1.17.1'
    testImplementation 'org.testcontainers:mariadb:1.17.1'
}
```

test/resources/application.yml

```yaml
spring:
  datasource:
    driver-class-name: org.testcontainers.jdbc.ContainerDatabaseDriver
    url: jdbc:tc:mariadb:10:///
```

- testcontainers 드라이버를 지정하면 테스트가 실행 될 때 url을 참조하여 컨테이너를 실행 시킨다.

하지만, Redis의 경우에는 따로 코드에 추가해주어야 한다.

Redis 컨테이너를 실행하기 위한 코드이다.

```java
package com.example.pharmacy

import org.springframework.boot.test.context.SpringBootTest
import org.testcontainers.containers.GenericContainer
import spock.lang.Specification

@SpringBootTest
abstract class AbstractIntegrationContainerBaseTest extends Specification {

    static final GenericContainer MY_REDIS_CONTAINER

    static {
        MY_REDIS_CONTAINER = new GenericContainer<>("redis:6")
                .withExposedPorts(6379)

        MY_REDIS_CONTAINER.start()

        System.setProperty("spring.redis.host", MY_REDIS_CONTAINER.getHost())
        System.setProperty("spring.redis.port", MY_REDIS_CONTAINER.getMappedPort(6379).toString())
    }
}

```

- 위 코드는 통합 테스트를 위한 추상 클래스이다.
- 통합 테스트를 실행할 때마다 Testcontainers를 사용하여 실제 Redis 서버를 시작하고, 애플리케이션에서는 이를 사용하여 테스트를 수행할 수 있다.

이제 위에서 작성한 코드를 바탕으로 실제 테스트 코드를 작성해보자.

```java
package com.example.pharmacy.pharmacy.repository

import org.springframework.beans.factory.annotation.Autowired

class PharmacyRepositoryTest extends AbstractIntegrationContainerBaseTest {

    @Autowired
    private PharmacyRepository pharmacyRepository

    def "PharmacyRepository save"() {
        given:
        String address = "서울 특별시 성북구 종암동"
        String name = "은혜 약국"
        double latitude = 36.11
        double longitude = 128.11

        def pharmacy = Pharmacy.builder()
                .pharmacyAddress(address)
                .pharmacyName(name)
                .latitude(latitude)
                .longitude(longitude)
                .build()

        when:
        def result = pharmacyRepository.save(pharmacy)

        then:
        result.getPharmacyAddress() == address
        result.getPharmacyName() == name
        result.getLatitude() == latitude
        result.getLongitude() == longitude
    }
}

```

- AbstractIntegrationContainerBaseTest를 상속 받아 테스트 코드를 작성한다.
    - AbstractIntegrationContainerBaseTest는 통합 테스트를 진행하며, Spock를 사용한다.

테스트를 실행하면 아래 이미지와 같이 redis:6, mariadb:10 컨테이너가 생성되고 실행된 것을 확인할 수 있다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b949e38-2db3-4d0d-a1e2-a4550a0d790b/886c44a2-680b-4781-9632-2eeb99be0a4f/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b949e38-2db3-4d0d-a1e2-a4550a0d790b/65ece039-2c30-4b6e-b5c7-06e93f695bf8/Untitled.png)