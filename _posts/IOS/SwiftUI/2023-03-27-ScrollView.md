---
title: "ScrollView"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
~~~
struct ContentView: View {
    var body: some View {
        ScrollView(Axis.Set.horizontal, showsIndicators: false) {
            VStack {
                Text("Bananas 🍌🍌")
                Text("Apples 🍏🍏")
                Text("Peaches 🍑🍑")
            }
        }
    }
}
~~~
새로 스크롤을 하고싶으면, horizontal대신 .vertical를 사용하면 되고,   
여기서 , showsIndicators이란, 회색바를 말하는 것이다.