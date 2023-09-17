---
title: "TableViewReload"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

일단 작성하는데 좋은 방법은 아닌것 같다.  
하지만 더 좋은 방법이 생각이 나질 않는다.  

VC1, VC2, VC3가 있는데, 

VC1에서 modal로 VC2를, VC2에서 modal로 VC3를 띄웠다  
VC1 -> VC2 -> VC3   
근데 VC3에서 버튼이 눌린걸, VC1에서 알고, dismiss될떄 reload가 되야하는데  
그 방법을 모르겠다.   
머리가 나쁘면 몸이 고생한다고하였다.  그래서 노가다로 해결하였다.  
VC3에서 delegate로 VC2에게 알리고, VC2에서 VC1한테 delegate로 연결연결하여서
결국 VC3의 버튼이 눌린걸 VC1에서 알게 해줬다.  
좋은 방법은 분명 아닌 것 같다.  
나중에 더 좋은 코드를 찾아봐야겠다.  