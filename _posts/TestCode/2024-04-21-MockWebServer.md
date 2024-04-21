---
title: "MockWebServer를 사용해 외부 API 호출하는 테스트 코드 작성하기"
categories:
  - TestCode
tags:
  - TestCode
  - Spring
toc: true
toc_sticky: true
---

## MockWebServer란?

`MockWebServer`는 **외부 API를 호출하는 코드의 테스트 코드**를 작성할 때 사용한다.

HTTP Request를 받아서 Response를 반환하는 간단하고 작은 웹 서버이다.

WebClient를 사용하여, HTTP를 호출하는 메서드의 테스트 코드를 작성할 때 이 MockWebServer를 호출하여 테스트 코드를 쉽게 작성할 수 있다.

## MockWebServer 사용하기

### build.gradle 추가

```bash
testImplementation('com.squareup.okhttp3:okhttp:4.10.0')
testImplementation('com.squareup.okhttp3:mockwebserver:4.10.0')
```

### 예제 코드

```java
@Slf4j
@Service
public class KakaoUriBuilderService {

    private static final String KAKAO_LOCAL_SEARCH_ADDRESS_URL = "https://dapi.kakao.com/v2/local/search/address.json";

    public URI buildUriByAddressSearch(String address) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(KAKAO_LOCAL_SEARCH_ADDRESS_URL);
        uriBuilder.queryParam("query", address);

        URI uri = uriBuilder.build().encode().toUri();
        log.info("[KakaoUriBuilderService buildUriByAddressSearch] address: {}, uri: {}", address, uri);

        return uri;
    }
}
```

- KakaoUriBuilderService 클래스에서 외부 API를 호출한다.

```groovy
class KakaoAddressSearchServiceRetryTest extends AbstractIntegrationContainerBaseTest {

    @SpringBean
    private KakaoUriBuilderService kakaoUriBuilderService = Mock()

    private MockWebServer mockWebServer

    def setup() {
        mockWebServer = new MockWebServer()
        mockWebServer.start()
        println mockWebServer.port
        println mockWebServer.url("/")
    }

    def cleanup() {
        mockWebServer.shutdown()
    }

    def "requestAddressSearch retry success"() {
        given:
        ...
        def uri = mockWebServer.url("/").uri()

        when:
        mockWebServer.enqueue(new MockResponse().setResponseCode(504))
        mockWebServer.enqueue(new MockResponse().setResponseCode(200)
                .addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .setBody(mapper.writeValueAsString(expectedResponse)))

        ...
    }
}
```

- KakaoUriBuilderService에서 외부 API를 호출하기 때문에 Mock으로 등록했다.
- @SpringBean을 붙여 스프링 컨테이너가 해당 빈을 주입받는다.
- setup() 메서드에서 MockWebServer를 사용하기 위해 셋팅을 한다. 여기서 포트는 임의의 포트를 받는다.
- cleanup() 메서드에선 MockWebServer 종료한다.
- **when 블럭**에 작성한 코드를 살펴보자.
    - enqueue에 응답 코드와 헤더, 바디를 작성하면 작성한 순서대로 응답을 받게 된다.

## Github 코드

- MockWebServer ([링크](https://github.com/yessm621/pharmacy/commit/fdc2894e1cbbbccdc9cd2bdc0fe45005bd5251ae))