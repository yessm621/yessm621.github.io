---
title: "ClipsToBounds vs MasksToBounds"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

# ClipsToBounds vs MasksToBounds
이전 글로 Frame과 bounds의 차이점을 알았으니 이제 더 자세히 들어가보자.    
중요한 점은 둘다 frame이 아니고, bounds에 기준을 둔다는것이 중요하다.  

# ClipsToBounds
ClipsToBounds는 UIView의 속성으로 default값을 false이다.  
자신의 Sub View가 자기 자신을 넘을 경우, 내 뷰 너머로 그림을 그릴 것인지, 아니면 삭제해 버릴것인지 한계를 설정한다는 소리이다.  
- false로 설정한 경우, 내 View밖에서 그림이 그려지던 말던 나는 상관하지 않겠다는 소리이다.  
- 만약 true로 설정을 하면?, 나를 넘어서는건 용서 못해! 하면서 나를 넘어서를 애들을 전부다 숨겨버린 것이다.  

그리지 않았을 뿐, 실제로는 그 크기 자체로 존재를 하는 것이다.  

# MasksToBounds
MasksToBounds는 기본적으론 ClipsToBounds와 똑같은데,  
다른점은 "숨겨버리는 것이 아니라. 잘라버리는 것"이다. 즉, 
- false면 내 View밖에서 그려지는 것을 허용하지만
- true면 내 View밖에서 그려지는걸 그리지도 않고 잘라버린단 소리다.(존재 자체를 하지않음)
