---
title: "IQKeyboardManagerSwift"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---
오늘 소개해줄 라이브러리는, IQKeyboardManagerSwift 입니다!!  
매번 키보드를 올려다내렸다~ 사이즈잡아주는 코드들을 줄여주는 코드입니다.  
공식 깃허브 페이지는  
https://github.com/hackiftekhar/IQKeyboardManager 
요기! 여기서 문서 읽어보면서 커스텀하시면 됩니다!!

# 설치방법
~~~
pod 'IQKeyboardManagerSwift'
~~~
역시 pod가 짱...   

# 사용법

AppDelegate.swift에 와서
~~~
import IQKeyboardManagerSwift
~~~
를 해준다음.  

didFinishLaunchingWithOptions <<-- 이 메서드 안에 작성해주시면 됩니다!!
~~~
IQKeyboardManager.shared.enable = true
IQKeyboardManager.shared.toolbarTintColor = .black
IQKeyboardManager.shared.toolbarBarTintColor = .white
IQKeyboardManager.shared.previousNextDisplayMode = .alwaysHide
IQKeyboardManager.shared.toolbarDoneBarButtonItemText = "확인"
~~~
참고로 저는 이렇게 작성해서 사용했어요!!  
