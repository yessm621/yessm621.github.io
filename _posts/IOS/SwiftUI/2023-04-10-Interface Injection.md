---
title: "Interface Injection"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
~~~
protocol Networking {
    func fetchData()
}
class UserNetworkManager: Networking {
    func fetchData() {
        print("user data fetched")
    }
}

class PostNetworkManager: Networking {
    func fetchData() {
        print("post data fetched")
    }
}
~~~
Networking 프로토콜을 따르는 객체는 fetchData()를 구현해야한다.  
이렇게 각각 구현하지말고,
~~~
class MainViewController {
    let networkManager: Networking
    
    init(networkManaer: Networking) {
        self.networkManager = networkManaer
    }
}
~~~
인터페이스로 정의한 뒤, 주입을 받을 수 있다.
총 정리하면
~~~
protocol Service {
    func setNetworkManager(networkManager: Networking)
}

class MainViewController: Service {
    var networkManager: Networking?
    
    func setNetworkManager(networkManager: Networking) {
        self.networkManager = networkManager
    }
}
~~~
이런식으로 작성이 가능하다.
