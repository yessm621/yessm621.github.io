---
title: "@StateObject와@ObservedObject차이점"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
둘다 관찰 객체를 관찰하는 property인데 왜 어떤 차이가 나는지 알아보려고했는데,  
너무 좋은 예제가 있어서 남기고 넘어가려고한다.  
https://medium.com/hcleedev/swift-observedobject%EC%99%80-stateobject-4f851ed9ef0d  
진짜 좋은 예제와 코드이니까 꼭 봤으면한다.
우선 정리를하면,  
@StateObjcet로 viewModel로 처음 초기화시킬때 사용하고,  
이후에는 @ObservedObject를 이용해서 작성해주면 좋은 것 같다.