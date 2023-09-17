---
title: "@ViewBuilder2"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
지난 포스팅에 이어 다른 방식은 어떻게 사용하는지 알아보려고한다.  

우선 타입에 따라 다른 뷰를 보여주려고한다.
~~~
struct LocalViewBuilder: View {

  enum viewType {
    case one
    case two
    case three
  }

  let type: ViewType

  var body: some View {
    VStack {

        if type == .one {
           Text("One!")
        } else if type == .two {
           VStack {
             Text("Two")
           }
        } else if type == .three { 
            Image(systemName: "heart.fill")
        }
    } // VStack
  } // body
}
~~~
이런식의 코드를

~~~
body: some View {
  VStack {
    if type == .one {
      viewOnew
    } else if type == .two {
      viewTwo
    } else if type == .three {
      viewThree
    }
  }
}

private var viewOne: some View {
  Text("One!")
}

private var viewTwo: some View {
 Text("Two")
}
private var viewThree: some View {
 Image(systemName: "heart.fill")
}
~~~
이런식으로 작성해줄 수 있다.
하지만 이코드를 더 줄일려면(본문에서 줄일라면)

~~~
var body: some View {
  VStack {
    headerSection
  }
}

@ViewBuilder private var headerSection: some View {
  if type == .one {
    viewOnew
  } else if type == .two {
    viewTwo
  } else if type == .three {
    viewThree
  }
}
~~~
이런식으로 작성해 나가면 된다 그러면 본문에선  
headerSection 하나로 작성해 주면 된다.  
이걸 더 깔끔하게 만들려면 switch를 사용해 주면 된다.  

~~~
@ViewBuilder private var headerSection: some View {
  switch type {
    case .one:
      viewOnew
    case .two:
      viewTwo
    case .three:
      viewThree
  }
}
~~~