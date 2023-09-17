---
title: "ButtonStylesCustom"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
# ButtonStylesCustom
버튼 스타일을 커스텀 하는방법에 대해 작성해보려고한다.

~~~
struct ButtonPressableStyle: ButtonStyle {

  func mackBody(configuration: Configuration) -> some View {
    configuration.label
      .font(.headline)
      .frame(height: 55)
      .foregroundColor(.white)
      .background(Color.blue)
  }
}
~~~
이렇게 작성한 후 사용하고 싶은 곳에서
~~~
Button(action: {

}, label: {
  Text("Clike me")
})
.buttonStyle(ButtonPressableStyle())
~~~
이런 식으로 사용하면 된다.
