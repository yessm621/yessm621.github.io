---
title: "ProgressView"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
~~~
struct ContentView: View {
    var body: some View {
        ProgressView(value: 0.75)
    }
}
~~~
바로 표시하게하기
~~~
struct ContentView: View {
    var body: some View {
        ProgressView(value: 0.75)
            .progressViewStyle(CircularProgressViewStyle())
    }
}
~~~
이렇게 둥글게 기다리는걸 표시해줄 수 도있고,  
~~~
struct ContentView: View {
    var body: some View {
        ProgressView(value: 0.75)
            .progressViewStyle(CircularProgressViewStyle(tint: .orange))
    }
}
~~~
그 색을 바꿔줄 수 있다.