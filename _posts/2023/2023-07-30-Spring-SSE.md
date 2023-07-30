---
layout: post
title: "SSE(Server-Send Events)"
date: 2023-07-30 15:00:00
categories: [Spring]
tags:
  - Spring
  - SSE
author: "유자"
---

# SSE(Server-Send Events)

HTTP는 비연결성 프로토콜이다. 클라이언트와 서버가 연결되고 요청과 응답을 주고 받으면 연결을 끊는다. HTTP는 전통적인 Client-Server 모델로 클라이언트가 서버에 요청을 보내면 서버는 클라이언트의 요청에 대한 응답을 한다. 보통은 서버가 클라이언트에게 요청을 할 일이 거의 없다. 

이러한 특징 때문에 HTTP에서 실시간으로 서비스를 제공하기 어렵다. 예를 들면 SNS의 알림 같은 경우가 그렇다. 사용자가 새로고침을 하지 않는 이상 새로 발생한 알림에 대해 사용자가 알기 어렵다. 이렇게 웹 애플리케이션을 개발하다보면 클라이언트의 요청이 없어도 서버에서 데이터를 전달해줘야 하는 경우가 발생한다.

이 문제를 해결하기 위한 방법은 세가지가 있다.

## Polling

Polling은 일정 주기를 가지고 서버로 요청을 보내는 방법이다. 일정 시간마다 서버에 요청을 보내 데이터가 갱신되었는지 확인하고 갱신되었다면 데이터를 응답받는다.

하지만 Polling은 실시간으로 데이터가 업데이트 되지 않는다는 단점이 있다. 또한, 불필요한 요청이 발생 할 수도 있고 이에 따른 서버 부하가 발생한다. 이는 대규모 트래픽에 적합하지 않다.

## Long-Polling

Long-Polling은 서버로 요청이 들어올 경우 일정 시간동안 대기 하였다가 요청한 데이터가 업데이트 된 경우 서버에서 웹 브라우저로 응답을 보낸다. 서버의 데이터가 빈번하게 변하지 않는 경우에 적합하다. Polling보단 개선된 형태이지만 데이터 업데이트가 빈번한 경우엔 마찬가지로 부하가 발생하여 대규모 트래픽에 적합하지 않다.

## SSE(Server-Send Events)

SSE는 클라이언트에서 서버쪽으로 특정 이벤트를 구독함을 알려주면 그 이후엔 서버에서 데이터 변화가 있을 때마다 서버에서 클라이언트에게 데이터를 보내줄 수 있다. 다만 서버에서 클라이언트로만 데이터 전송이 가능하고 그 반대는 불가능하다. 따라서 알림 기능에 매우 적합하다.

<img width="569" alt="스크린샷 2023-07-28 오후 12 08 15" src="https://github.com/yessm621/yessm621.github.io/assets/79130276/16b02f68-fed1-4e90-ae8b-f0189d5c4907">

이 외에도 서버에서 웹브라우저 사이 양방향 통신이 가능한 방법인 WebSocket도 있다. WebSocket은 채팅에 적합하다.

여기까지 서버에서 클라이언트에게 요청을 보낼 수 있는 방법을 알아보았다.

이제 SSE(Server-Send Events)를 사용해서 실시간으로 알림을 받을 수 있는 서비스를 만들어보자.

## SSE 구현

먼저 http://localhost:8080/api/v1/users/alarm/subscribe를 통해 클라이언트가 서버에게 특정 이벤트가 발생하였을 때 구독한다는 것을 알려준다.

```java
package com.me.sns.controller;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/alarm/subscribe")
    public SseEmitter subscribe(Authentication authentication) {
        // Authentication을 이용해서 User를 가져왔다고 가정
        User user = (User) authentication.getPrincipal();
        return alarmService.connectAlarm(user.getId());
    }
}
```

```java
package com.me.sns.service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmService {

    private final static Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
    private final static String ALARM_NAME = "alarm";
    private final EmitterRepository emitterRepository;

    // SseEmitter를 사용해서 알림을 보낼 때 사용
    public void send(Integer alarmId, Integer userId) {
        // 로그인 한 유저의 SseEmitter 가져오기
        emitterRepository.get(userId).ifPresentOrElse(sseEmitter -> {
            try {
                sseEmitter.send(sseEmitter.event().id(alarmId.toString()).name(ALARM_NAME).data("new alarm"));
            } catch (IOException e) {
                emitterRepository.delete(userId);
                throw new SnsApplicationException(ErrorCode.ALARM_CONNECT_ERROR);
            }
        }, () -> log.info("No emitter founded"));
    }

    // 클라이언트가 서버에게 연결을 요청
    public SseEmitter connectAlarm(Integer userId) {
        SseEmitter sseEmitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(userId, sseEmitter);

        // 시간 초과, 네트워크 오류를 포함한 모든 이유로 비동기 요청이 정상 동작할 수 없을 때 저장해둔 SseEmitter를 삭제함.
        sseEmitter.onCompletion(() -> emitterRepository.delete(userId));
        sseEmitter.onTimeout(() -> emitterRepository.delete(userId));

        try {
            // 연결 요청에 의해 SseEmitter가 생성되면 더미 데이터를 보내줘야함.
            // 연결된 후 하나의 데이터도 전송되지 않는다면 SseEmitter의 유효시간이 끝났을 경우,
            // 503 응답이 발생하므로 연결시 바로 더미 데이터를 한 번 보내준다.
            sseEmitter.send(SseEmitter.event().id("id").name(ALARM_NAME).data("connect complete"));
        } catch (IOException exception) {
            throw new SnsApplicationException(ErrorCode.ALARM_CONNECT_ERROR);
        }

        return sseEmitter;
    }
}
```

```java
package com.me.sns.repository;

@Slf4j
@Repository
public class EmitterRepository {

    private Map<String, SseEmitter> emitterMap = new HashMap<>();

    public SseEmitter save(Integer userId, SseEmitter sseEmitter) {
        final String key = getKey(userId);
        emitterMap.put(key, sseEmitter);
        log.info("Set sseEmitter {}", userId);
        return sseEmitter;
    }

    public Optional<SseEmitter> get(Integer userId) {
        final String key = getKey(userId);
        log.info("Get sseEmitter {}", userId);
        return Optional.ofNullable(emitterMap.get(key));
    }

    public void delete(Integer userId) {
        emitterMap.remove(getKey(userId));
    }

    private String getKey(Integer userId) {
        return "Emitter:UID" + userId;
    }
}
```