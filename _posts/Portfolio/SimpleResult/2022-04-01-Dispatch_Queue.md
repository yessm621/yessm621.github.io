---
title: "Dispatch_Queue"

categories:
  - SimpleResult
tags:
  - SimpleResult
---  

![Dispatch_Queue](https://user-images.githubusercontent.com/68246962/157706995-e40259d0-9fa3-45f4-a475-2be135b20fc8.gif)  

첫번쨰 버튼은, async를 사용해 메인쓰레드는 살아있고, 0~9까지 차례대로 숫자가나오게만듬  
두번째 버튼은, async를 사용해 메인쓰레드는 살아있고, 0~9, 10~19, 20~29에서 여러개의 작업을 동시에 작동하게 만듬  
세번쨰 버튼은, sync를 사용해 메인쓰레드를 멈추고, 0~9, 10~19 까지 차례대로 작동하게 만듬   

 
코드주소: <https://github.com/choijaegwon/IOSSimpleResult/tree/main/Dispatch_Queue>  
출처: <https://www.inflearn.com/course/uikit-ios14/dashboard> 