---
title: "CodingKeys"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

```swift
struct User {

		// 서버에서 받아온 값 즉, 
		// 실제 받아온 json 값 CodingKeys를 이용하여, 내가지정해준값으로 바꿈
		// CodingKeys는 안쓰는것도 전부다 써줘야한다. 
    enum CodingKeys: String,CodingKey {
        case id
        case name
        case birth
				// "phone_num"이 서버에서 주는 이름이다.
        case phoneNum = "phone_num"
    }

		// 내가 지정해주는 값(사용하고싶은 변수)
    let id: Int
    let name: String
    let birth: String
    let phoneNum: String
}
```
여기서 enum CodingKeys는 뭐냐,

**CodingKeys는 json key가 아닌 내가 원하는 이름으로 지정해줄 수 있게 해주는 프로토콜**이다.

위의 예제에서는 실제 json key들이 id, name, birth, phone_num이지만 제가 지정해주는 이름들로는 id, name, birth, phoneNum입니다.

만약, **json key와 내가 지정하는 이름이 같다면 case에 json key만 작성**하면된다.