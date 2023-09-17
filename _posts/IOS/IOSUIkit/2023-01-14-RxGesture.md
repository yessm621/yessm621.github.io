---
title: "RxGesture"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - RxSwift
---

# RxGesture란?

rwswift를 사용중인데, 어떤뷰를 클릭해서 뷰를 보여주는걸 구현해야하는데,  
원래를 TapGesture를 사용하였지만, 코드가 너무길어서 좀 짧게 만들기위해 사용하였다.   
처음 사용해보는데 일단 공식 깃허브는  
https://github.com/RxSwiftCommunity/RxGesture  
이다.  

# 설치

~~~
pod "RxGesture"
~~~

# 사용법

~~~
view.rx
  .tapGesture()
  .when(.recognized)
  .subscribe(onNext: { _ in
    //react to taps
  })
  .disposed(by: stepBag)
~~~
어떤 뷰를 만들고 .rx를 작성후, subscribe를 마구마구 사용하면 된다.  
그러면 tap이 됐을때, 어떠한 행동을 하거나, 반복하거나, 적용이 된다.  
물론 하고나선 다시 disposed 를 사용해서 메모미릭이 걸리지 않게 버려줘야한다!!
