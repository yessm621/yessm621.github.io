---
title: "AWS S3 생성 후 이미지에 접근 시 Access Denied"
categories:
  - DevOps
tags:
  - AWS
toc: true
toc_sticky: true
---

버킷을 생성 후 테스트로 이미지를 업로드하여 확인하면 Access Denied이 발생할 것이다. 이때는 아래와 같은 과정을 해주면 된다.

## 버킷의 퍼블릭 액세스 차단 설정

먼저, 모든 액세스 차단을 해제한다. 테스트를 하기 위해서다.

> **참고**
<br>
실무에서 사용할 경우에는 모든 액세스 차단 혹은 ACL을 이용하여 액세스 차단해주는 것이 보안을 위해 좋다.
> 

## 버킷 정책 편집

생성한 S3 선택 후 권한 탭을 클릭한다.

버킷 정책에서 편집을 선택하면 정책 생성기라는 버튼이 있다. 이 버튼을 클릭해서 정책을 생성해야 한다.

정책을 설정하기 전엔 `버킷 ARN`이라는 것이 보인다. 이것을 복사한 후 정책 생성기 버튼을 클릭한다.

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/525dd5a7-10b9-4014-891f-e9b442324c4f)

아래와 같은 사이트가 보이는데 아래와 같이 입력을 한 후 Add Statement 버튼을 누른다.

- Select Type of Policy: S3 Bucket Policy 선택
- Principal: * 입력
- Actions: GetObject 선택
- Amazon Resource Name (ARN): 복사한 버킷 ARN을 붙여놓고 뒤에 /* 입력

![2](https://github.com/yessm621/yessm621.github.io/assets/79130276/78c36eb4-99e2-4574-a956-0282d82cfba2)

그 후 Generate Policy를 눌러 정책을 생성한다. 생성된 정책을 복사하여 버킷 정책에 붙여넣기 한다.

![3](https://github.com/yessm621/yessm621.github.io/assets/79130276/af44dfdb-ceec-440f-90d4-5f5477e2e9c0)

![4](https://github.com/yessm621/yessm621.github.io/assets/79130276/61f38889-6a05-46f1-89f7-d822a8dc5559)

이제 업로드한 이미지를 확인하면 잘 보일 것이다.