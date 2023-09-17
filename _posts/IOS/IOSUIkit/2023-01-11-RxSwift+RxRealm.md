---
title: "RxSwift+RxRealm"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - RxSwift
---

Realm에서 데이터가 변경될때, 알람을 제공하는 메커니즘이 있다. 그게 바로 RxRealm이다.  
~~~
// viewDidLoad()
let realm = try! Realm()
let users = realm.objects(User.self) // User.self는 Realm객체타입이다.
print("\(users.count)") // 0

Observable.collection(from: users)
	.subcribe (
	onNext: { print("==$0.count)" } // 0
}

let user1 = User()
user1.firstName = "dd"

try! realm.write {
	realm.add(user1) // 1
}

let user2 = User()
user2.firstName = "dd"
user2.userId = 23

try! realm.write {
	realm.add(user2) // 2
}
}

출력
0
==0
==1
==2

~~~
이런식으로, Realm에서 가져온 객체를 RxSwift로 계속 관찰하고 있으면, 값이 들어올 때 마다,
알려주고, 이벤트를 처리할 수 있다.


 
참고한 블로그  
https://ali-akhtar.medium.com/rxrealm-realmswift-part-7-cf83c4a3edb5    
https://youbidan-project.tistory.com/269?category=  