---
title: "Property - didSet, willSet이란"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - Property
---

## didSet, willSet in Swift

스위프트는 프로퍼티 옵저버로 didSet, willSet을 제공한다고한다.  
didSet은 프로퍼티 값이 변경되기 직전, willSet은 값이 변경된 직후를 감지한다.  
참고로 프로퍼티 옵저버를 사용하기 위해서는 프로퍼티의 값이 반드시 초기화가 되어 있어야한다.  

## didSet, willSet의 활용

프로퍼티 옵저버의 가장 빈번한 사용은 Model에서 갱신된 값을 View에 보여줄 때 이다.
예를 들면, View에 점수를 표시하는 Label이 있다고 가정하고, 점수가 바뀔 때 마다 View의 Label을 업데이트싶을 때,  
이 경우에 점수를 저장하고 있는 변수인 score의 값을 바꾸어주고 화면을 갱신하는 작업을 아래처럼 할 수 있습니다. 
~~~
score = 90 
scoreLabel.text = "\(score)"
~~~  
이렇게 해도 View의 Label은 정상적으로 바뀌지만,  
여러 곳에서 score의 값을 바꾼다면 score의 값이 바뀌는 곳 마다 2번 라인의 코드를 적어야하는 번거로움이 있다.  
이때 프로퍼티 옵저버를 사용할 수 있습니다. 프로퍼티 옵저버를 사용하면 아래와 같이.   
~~~
var score: Int = 0 {
    didSet {
        scoreLabel.text = "\(score)"
    }
}
~~~
이렇게 하면 score값이 바뀔 때 마다 View의 값을 갱신하는 작업을 따로 해줄 필요가 없게된다.   
이외에도 프로퍼티 옵저버를 사용하여 현재 값과 바뀔 값을 비교하는 작업을 할 수도 있게된다.  
~~~
var score: Int = 0 {
    didSet(oldVal) {
        print("현재 점수는 : \(self.score), 이전 점수는: \(oldVal)")
    }
}
~~~

참고블로그 https://medium.com/ios-development-with-swift/%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0-get-set-didset-willset-in-ios-a8f2d4da5514