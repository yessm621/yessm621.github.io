---
title: "xcode13 ColorLiteral"

categories:
  - IOSAutoLaylout
tags:
  - IOS
  - ColorLiteral
---

## ColorLiteral
xcode13으로 업데이트 하고나서, ColorLiteral이 먹히지 않았다  
그 이유를 알아보니 사용하는 방법이 달라져서 였다.  
예전에는  
![image](https://user-images.githubusercontent.com/68246962/137787635-4f3f8cd7-43c8-4108-b090-a6efbdb2cbae.png)  
이런 방법으로 사용하면 됐는데 xcode가13으로 업데이트되고 난 후    
![image](https://user-images.githubusercontent.com/68246962/137787901-e6f107cb-c7c5-4190-8a64-06dbe2a0d168.png)  
이런 방식으로 색상을 밖에서 지정을 하고 난후 그걸 UIColor로 가져오는 방식으로 사용해야한다.  
~~~
let mygreen = Color(#colorLiteral(red: 0.4666666687, green: 0.7647058964, blue: 0.2666666806, alpha: 1))
~~~  
이런 방식으로 #colorLiteral이 필수로 들어가야한다.