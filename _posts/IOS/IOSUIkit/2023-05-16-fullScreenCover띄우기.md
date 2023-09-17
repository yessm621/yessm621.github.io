---
title: "fullScreenCover띄우기"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

변수 선언
~~~
@State var isShowingNewTweetView = false
~~~

사용할 뷰
~~~
Button() {
    self.isShowingNewTweetView.toggle()
} label: {
    Image("tweet")
        .resizable()
        .renderingMode(.template)
        .frame(width: 32, height: 32)
        .padding()
}

.background(.blue)
.foregroundColor(.white)
.clipShape(Circle())
.padding()
.fullScreenCover(isPresented: $isShowingNewTweetView) {
    NewTweetView()
} // Button
~~~
true가 되면서 NewTweetView()가 나타난다.