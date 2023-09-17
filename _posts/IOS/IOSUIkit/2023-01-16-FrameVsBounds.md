---
title: "FrameVsBounds"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

# Frame Vs Bounds 
frame과 bounds는 둘다 View의 위치와 크기를 나타낸다.  
둘의 차이점은 뭘까?  
우선 정의를 내려보자면,  
## **frame**

- 상위뷰의 좌표 시스템에서 뷰의 위치와 사이즈를 나타낸다.

## bounds

- 자신의 좌표 시스템에서 뷰의 위치와 크기를 나타낸다.

이정도로 정의해 볼 수 있을거같다.  
간단한 예시로 살펴보자면  
~~~
frame x = 50.0 y = 150.0
bounds x = 0.0, y = 0.0

frame width = 320.0, y = 220.0
bounds width = 320.0, y = 220.0
~~~  
이런 frame과 bounds가 있다고치자.  
둘다 size는 같지만 origin갑시 다르다. 이렇게 본다고치면 뭐 느낌이 안온다.  
하지만, SuperView와 같이 설명하면 이해하기 훨 쉽다.  
frame은 한 단계 위 View를 기준으로 위치를 넣는것이고  
bounds는 SuperView와는 아무 상관없이 기준이 자기 자신인 것이다.  
쉽게 말하면 위에 정의한 frame은 회전을 시키면 size가 바뀌지만,
bounds는 회전을 시켜도 자기자신이 기준점이기 때문에, 바뀌지 않는다.