---
title: "menuButton"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
~~~
struct BorderlessButtonMenuView: View {
    var body: some View {
        Menu("PDF") {
            Button("Open in Preview", action: { })
            Button("Save as PDF", action: { })
        }
        .menuStyle(BorderlessButtonMenuStyle())
    }
}

~~~
어떤 버튼을 누를때 띄울 건지 정하는건데, 여기서는
"PDF"란 Text만 누르면 나타나게 해준다.  
그후 안에 Button을 작성한후, 어떤 action으로 동작할지는 정의해면 된다.    
