---
title: "RxSwift(deferred)"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - RxSwift
---

# deferred
 - 생성을해서 보내주지만, 옵저버가 구독할 때까지 옵저버블을 생성하지 않고, 각 옵저버에 대해 새로운 옵저브블을 생선한다.  

# 구현
~~~
public static func deferred(_ observableFactory: @escaping () throws -> Observable<Element>) 
    -> Observable<Element> {
    Deferred(observableFactory: observableFactory)
}
~~~

# 왜 사용할까?, 사용예시
- 당장은 필요하지 않지만, 필요한 상황에 구독하여 생성이 필요할 때 사용한다.
- 네트워크 API에서 결과를 받아와 just처럼 옵저버블을 바로 만들어 주는 경우도 있지만, deferred를 통해 구독전까지 해당 네트워크 요청을 시작하지 않도록 해줄 수 있다.  
- 조건을 걸어서 조건에 따라 다른 값들을 반환해줄 때 사용한다.  
~~~
var touched = true

let factory = Observable<Int>.deferred {
	touched.toggle()
    
    if touched {
        return Observable.of([1,2,3])
    } else {
        return Observable.of([4,5,6])
    }
}

factory.subscribe(onNext: {
    print($0)
}).disposed(by: disposeBag)

// 123

factory.subscribe(onNext: {
    print($0)
}).disposed(by: disposeBag)
// 456
~~~
- 구독을 했을 때 옵저버블이 생기기 때문에 사전에 조건을 걸어서 조건에 따라 다른 값들을 반환해줄 수도 있다!