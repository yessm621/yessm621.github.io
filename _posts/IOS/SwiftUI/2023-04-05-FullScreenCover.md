---
title: "FullScreenCover"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
~~~
@State var isShowingNewTweetView = false
~~~
작성후, 
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
버튼 토글시(true) 될때 화면을 띄워주면 된다.