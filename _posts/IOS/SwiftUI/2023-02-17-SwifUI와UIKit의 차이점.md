---
title: "SwifUI와UIKit의 차이점"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---

UIKit는 절차형 이지만 SwiftUI는 선언형이다.  
UIKIt은 클릭되었을때, View를 그려주지만,  
SwfitUI는 데이터가 들어오면 데이터를 기반으로 View를 그려준다.  
때문에 데이터 바인딩이란 개념이 존재한다.(UIKit에선 RxSwift를 활용해서 바인딩해줬었는데, UIKit에선 없어도 데이터에 따라 View가 바뀐다.)  
@AppStorage 는 UIkit의 UserDefault의 느낌이다. 전역에서 데이터 공유가 가능하다.(영구저장이 가능하다)