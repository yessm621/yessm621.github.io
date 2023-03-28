---
layout: post
title: "스프링 부트 환경분리를 위한 설정파일 작성하기 (feat. profile)"
date: 2021-11-10 00:00:00
categories: [Spring]
tags:
  - Spring
author: "유자"
---

## 개요

실무에서 개발을 진행하고 운영을 할 때 로컬(local), 개발(dev), 테스트(test), 상용(prod) 등 **환경에 따라 서버나 설정 값들을 변경**해야 한다. 스프링부트는 `Profile`을 통해 간단하게 설정을 할 수 있다.

개발환경에 따라 설정 파일을 설정하는 방법에 대해 알아보자.

## Profile

설정 정보는 **application.properties** 또는 **application.yml**을 통해 설정 값을 셋팅한다. 여기서 특정 규칙에 만족하게 설정 파일을 만들면 스프링부트가 읽어올 수 있다.

- application-{프로필네임키워드}.properties
    - ex. application-dev.properties
- application-{프로필네임키워드}.yml
    - ex. application-prod.yml

SpringBoot 2.4 이전에는 spring.profiles 옵션을 활용했었지만 2.4 이후에는 해당 설정이 deprecated 되었다. 새로운 설정 방법은 매우 간단하다. properties 또는 yml 파일을 작성하고 애플리케이션을 실행할 때 환경변수만 넣어주면 된다.

### 1. properties 혹은 yml 파일을 작성

각 파일에서 spring.config.activate.on-profile이라는 옵션을 설정해주고 설정 이름을 원하는대로 넣어주자.

**application.yml**

실행 변수에서 설정을 넣을 때 원하는 환경변수명을 설정하는데 그것이 없을 때 local로 실행하겠다는 뜻으로 읽으면 된다.

```yaml
spring:
  profiles:
    default: local
```

**application-local.yml**

```yaml
spring:
  config:
    activate:
      on-profile: local
```

**application-dev.yml**

```yaml
spring:
  config:
    activate:
      on-profile: dev
```

### 2. 애플리케이션을 실행할 때 run-time에 사용될 환경변수를 작성

**1. Intellij IDE로 실행**

Intellij IDE > Edit Configuration > Active profiles 에 원하는 profile 명을 입력 후 실행한다.

**2. java -jar 옵션으로 실행**

```bash
java -jar myapp.jar --spring.profiles.active=prod
```