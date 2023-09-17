---
title: "UITextView에 Placeholder넣기"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

UITextField는 자체적으로 placeholder를 가지고 있다.  
하지만 UITextView는 placeholder가 없어서 직접만들어야 됐다.  
하지만 우리의 구글신은 우리를 저버리지?않았다!!  
새로운 라이브러리가있었으니  
바로. UITextView+Placeholder  

# 설치 방법
~~~
pod 'UITextView+Placeholder'
~~~

설치방법도 간단하다 pod install하면 끝!

# 사용법 
우선 제일 중요한 import!
~~~
import UITextView_Placeholder
~~~

각종 설정을 한후
~~~
    var textView = UITextView().then {
        $0.backgroundColor = .white
        $0.layer.cornerRadius = 5
        $0.tintColor = .black
        $0.textColor = .black
        $0.layer.borderWidth = 1.0
        $0.layer.borderColor = UIColor.black.cgColor
        $0.placeholder = "상세한 내용을 적어보세요"
        $0.font = UIFont.systemFont(ofSize: 16)
    }
~~~
이렇게 작성해주면 끝!!

자세한건 역시
https://github.com/devxoul/UITextView-Placeholder
가서 보면 됩니다!  