---
title: "FrameVsBounds3"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

# Frame Vs Bounds 3

~~~  
"Sub View들이 반대 좌표로 가는 게 아니라,
View가 Sub View를 바라보는 시점(viewport)이 달라진 것"
~~~
을 생각하면서, 이글을 보면 더 좋을 것 같다.  

# Frame
- 언제 사용하는 것인가? -> UI View의 위치, 크기를 나타낼때 사용한다.  
- size는 View영역 전체를 감싸는 사각형의 크기다. 따라서 회전시키면 size가 달라질 수 있다.  

# Bounds
- 언제사용하는 것인가? -> View를 회전한후, View의 실제 크기를 알고 싶을때 사용하는 것이다.  
- 회전을 시켜도 기준은 자기자신이기 떄문에 size는 바뀌지 않는다.  
- 보는 관점이 달리는것이 바로 이 Bounds다.  
- View 내부에 그림을 그릴 때 사용한다.  
- ScrollView에서 스크롤을 할 때 사용이 된다.  
