---
title: "ToastMessageLibrary."

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

# Toast-Swift

https://github.com/scalessec/Toast-Swift  
위 라이브러리를 사용하는데 이미지의 크기가 내 마음내로 조정이 되지않았다.  
나는 작게 하고싶은데 여기선 자꾸 고정값으로 나와버렸다.  
내가 원하는 사이즈를 만들기 위해 라이브러리에 들어가서 직접 손봤다.  

나머진 너무 어려워서 간단한것만 바꿔보았다.  
~~~
public struct ToastStyle {

    public init() {}
    
    /**
     The background color. Default is `.black` at 80% opacity.
    */
    // 배경색상
    public var backgroundColor: UIColor = .toastColor
~~~
우선 배경 색상을 변경해주었고,  

~~~
    */
    // 토스트메세지 크기
    public var horizontalPadding: CGFloat = 55.0
    
    /**
     The spacing from the vertical edge of the toast view to the content. When a title
     is present, this is also used as the padding between the title and the message.
     Default is 10.0. On iOS11+, this value is added added to the `safeAreaInset.top`
     and `safeAreaInsets.bottom`.
    */
    // 토스트메세지 높이
    public var verticalPadding: CGFloat = 22.0
    
    /**
     The corner radius. Default is 10.0.
    */
    // 코너
    public var cornerRadius: CGFloat = 16.0;
~~~
토스트 메세지의 크기 값을 조정해주었다.  
이 Padding값으로 다른함수들의 여러가지 크기가 조정된다.  

내가 찾던 이미지 사이즈를 찾았다

~~~
    /**
     The image size. The default is 80 x 80.
    */
    public var imageSize = CGSize(width: 20.0, height: 20.0)
~~~

이부분 원랜 80*80 이였지만, 난 20으로 사용하고싶어서 줄였다. 

이지와 라벨의 간격을 설정해주었다.
~~~
        if let imageView = imageView {
            // 이미지와 라벨의 간격
            imageRect.origin.x = 20
            imageRect.origin.y = style.verticalPadding
            imageRect.size.width = imageView.bounds.size.width
            imageRect.size.height = imageView.bounds.size.height
        }
~~~

마지막으로
~~~
public enum ToastPosition {
    case top
    case center
    case bottom
    
    // 포지션 사이즈
    fileprivate func centerPoint(forToast toast: UIView, inSuperview superview: UIView) -> CGPoint {
        let topPadding: CGFloat = ToastManager.shared.style.verticalPadding + superview.csSafeAreaInsets.top
//        let bottomPadding: CGFloat = ToastManager.shared.style.verticalPadding + superview.csSafeAreaInsets.bottom
        
        switch self {
        case .top:
            return CGPoint(x: superview.bounds.size.width / 2.0, y: (toast.frame.size.height / 2.0) + topPadding)
        case .center:
            return CGPoint(x: superview.bounds.size.width / 2.0, y: superview.bounds.size.height / 2.0)
        case .bottom:
            return CGPoint(x: superview.bounds.size.width / 2.0, y: (superview.bounds.size.height - (toast.frame.size.height / 2.0)) - 150)
        }
    }
}
~~~
바텀을 사용하는데 safearea값에 붙어있길래 150을 고정으로 주었다.