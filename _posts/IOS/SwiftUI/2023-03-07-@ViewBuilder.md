---
title: "@ViewBuilder"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
# @ViewBuilder란?
같은 뷰를 작성했을때, 추가로 어떤 작업을 해주고 싶을 때가 있다.  
그럴때 사용하면 좋은 방법이다.  
예를 들어, Text() 를 작성한후, 그 뒤에 뭘 더 해주고싶은데 매번 추가하기 힘드니 그냥 @ViewBuilder로 연결해주면 된다.  

~~~
struct HeaderViewGeneric<Content: View>: View {
  
  let title: String
  let content: Content

  init(title: String, @ViewBuilder content: () -> Content) {
    self._title = title
    self._content = content()
  }

  var body: some View {
    VStack {
      Text(title)
        .font(.largeTitle)
        .fontWeight(.bold)

      content
    }
  }
}
~~~
이런식으로 작성해주면 된다.   

사용할땐
~~~
HeaderViewGeneric(title :"gegeg") {
  // 원하는 코드 작성
}
~~~
이런 방식으로 사용하면 된다.