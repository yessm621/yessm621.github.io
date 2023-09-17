---
title: "swift windows' was deprecated in iOS 15.0: Use UIWindowScene.windows on a relevant window scene instead"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - window
---

# 'windows' was deprecated in iOS 15.0: Use UIWindowScene.windows on a relevant window scene instead 오류 해결하기

개발을 하면서
~~~
guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }) else { return }
~~~
이러한 window에 관한 코드를 작성하는데 
~~~
windows' was deprecated in iOS 15.0: Use UIWindowScene.windows on a relevant window scene instead
~~~
이런 경고 표시 창이 떴다면,
~~~
let scenes = UIApplication.shared.connectedScenes
let windowScene = scenes.first as? UIWindowScene
guard let window = windowScene?.windows.first(where: { $0.isKeyWindow }) else { return }
~~~
코드를 이렇게 바꿔서 작성해주면 된다.