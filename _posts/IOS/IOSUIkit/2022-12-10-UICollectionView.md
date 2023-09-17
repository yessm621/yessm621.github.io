---
title: "UICollectionView"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

# UICollectionView란?
- 여러 데이터를 관리하고 커스텀 가능한 레이아웃을 사용해서 사용자에게 보여줄 수 있는 객체이다.
- UIScrollView를 상속 받고 있어서 스크롤이 가능하다.
- Supplementary Views는 섹션에 대한 정보 표시(헤더, 푸터), 꼭 구현하지 않아도 된다.
- 컬렉션뷰의 셀들이 나열되는 방식으로 Layout이 나뉜다.

# UICollectionViewLayout
UICollectionViewLayout의 서브 클래스는 레이아웃 객체라고 하며 컬렉션 뷰 내부의 셀 및 재사용 가능한 뷰의 위치, 크기 및 시각적 속성을 정의한다.  

UICollectionViewLayoutAttributes는 레이아웃 프로세스 중에 컬렉션뷰에 셀과 재사용 가능한 뷰를 표시하는 위치와 방법을 알려준다.  

UICollectionViewUpdateItem은 레이아웃 객체 아이템이 삽입, 삭제, 혹은 콜렉션뷰내에서 이동할때 마다 인스턴스를 준다.  


# UICollectionVeiwFlowLayout
그리드 혹은 다른 라인기반 레이아웃을 구현하는 데 사용된다. 클래스를 그대로 사용하거나 동적으로 커스터마이징할 수 있는 플로우 델리게이트 객체와 함께 사용할 수 있다.  
현재 행에서 채워 나가되 객체의 공간이 부족하면 새로운 행을 생성해서 거기다가 셀들을 추가하는 방식이란 소리이다.  

FlowLayout 구성 단계

1. 플로우 레이아웃 객체를 컬렉션뷰의 레이아웃 객체로 지정
2. 셀의 높이 및 너비 설정 (default 는 각각 0, 0 이기 때문에, 크기 지정하지 않을경우 셀이 화면에 보이지 않을 수 있다)
3. 셀의 간격 조절
4. 필요할 경우 섹션 헤더 푸터 크기 지정
5. 레이아웃 스크롤 방향 설정

## minimumLineSpacing
열에서 아이템 간의 __최소 간격__ 을 설정해준 것

## minimumInteritemSpacing
행에서 아이템 간의 __최소 간격__ 을 설정해준 것입니다.

## 섹션 자체에 인셋(공간)을 줄 수 있다.  

~~~
func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
       return UIEdgeInsets(top: 30, left: 30, bottom: 30, right: 30)
    }
~~~

# UICollectionViewDataSource 필수 메서드
~~~
// 섹션에 표시 할 셀 갯수를 묻는 메서드
func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int

// 콜렉션 뷰의 특정 인덱스에서 표시할 셀을 요청하는 메서드
func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell
~~~

