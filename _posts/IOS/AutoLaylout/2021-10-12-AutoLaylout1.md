---
title: "오토 레이아웃2"

categories:
  - IOSAutoLaylout
tags:
  - IOS
---

## UITableViewDelegate
테이블 뷰에 대한 설정  

## UITableViewDataSource
소스를 집어 넣는것

## numberOfRowsInSection
테이블 뷰 셀의 갯수  

## IBOutlet란?
스토리보드상에 선언한 View 객체를 IB(Interface Builder)가 알아볼 수 있게 만드는 것(자바로치면 findViewById)

## IBAction란?
스토리보드 상에 선언한 View 객체가 특정 이벤트가 발생했을 경우 호출되는 함수

## init(coder: NSCoder)
스토리보드에서 UIView를 만들 때 만들어지는 생성자  

## init(frame: CGRect)
코드로 뷰를 만들때 호출됨. 반드시 CGRect타입으로 프레임을 정해주고 UIVew를 생성
~~~
let rect = CGRect(x: 10,y: 10, wdith: 100, height: 100)
let myView = UIView(frame: rect)
~~~

## Nib이란?
xml형태의 .xib이지만, 파일을 컴파일하면 .nib 파일이 된다.  

확장자가 .xib란 스토리보드를 만들었으면 그걸 연결해야만 연동이 된다.



