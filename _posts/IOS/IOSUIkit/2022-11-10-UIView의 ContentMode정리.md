---
title: "UIView의 ContentMode정리"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - ContentMode
---

# UIView의 ContentMode정리

기본적으로 top, bottom, left, right 등이 존재하지만 이 속성들은 직관적인 속성이므로 따로 정리하지 않고
scaleToFill, scaleAspectFit, scaleAspectFill 이 3가지만 정리해보면,

# scaleToFill  
- 콘텐츠의 비율을 변경하여 View 크기에 맞게 확장하는 옵션  

# scaleAspectFit  
- 콘텐츠의 비율을 유지하여 View 크기에 맞게 확장하는 옵션. 남는 영역은 투명하다.

# scaleAspectFill  
- 콘텐츠의 비율을 유지하여 View 크기에 빈 영역없이 확장하는 옵션. 일부 내용은 잘라질 수 있다.

# 중요한 단어들 
## Aspect = 비율 유지
## Fill = 빈 영역없이 꽉 차게
## Fit = 화면에 맞게