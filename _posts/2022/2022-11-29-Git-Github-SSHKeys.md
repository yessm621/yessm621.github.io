---
title:  "Github 접속을 위한 SSH 키 생성 및 등록"
# last_modified_at: 2022-11-29T16:15:00
last_modified_at: 2022-12-07T16:45:00
categories: 
  - Git
tags:
  - Git
toc: true
toc_label: "Index"
toc_sticky: true
---

> **참고**
<br>
MAC m1 부터는 이 방법이 아닌 token 인증 방식으로 진행해야 한다고 한다..
> 

## SSH 키

### Github을 사용할 때 SSH 키를 등록하는 이유

로컬 개발 환경에서 Git을 사용할 경우엔 SSH가 없어도 상관없다. 하지만, Git 서버에 코드를 Clone하거나 Push 할 때 `SSH 프로토콜`을 사용한다.

**SSH를 사용하는 이유**는 (로컬이 아닌)다른 서버에 명령어를 전달하고 결과를 받아 볼 때 **안전한 방식**으로 통신하기 때문이다. SSH는 여러가지 인증 방법을 제공하는데 그 중에서도 편리성이나 안정성 면에서 추천하는 방식이 `공개키 인증 방식`이다.

### 공개키 인증 방식

**공개키 인증 방식**을 사용하려면 `공개키`와 `개인키` 한쌍을 만든다. 공개키는 접속하고자 하는 서버에 등록하는 용도로 사용한다. 사용자는 개인키를 통해 SSH에 접속하고 연결 요청을 받은 SSH 서버에서 서버에 등록된 공개키 중 요청 받은 개인키와 매치되는 공개키가 있는지 찾고 있다면 인증에 성공하고 서버에 접속된다. (없다면 인증에 실패한다.) 공개키는 어디에 공개되어도 문제가 없으나 개인키는 다른 사람에게 노출하지 않도록 안전하게 보관해야 한다.

## SSH 키 생성

Github에서도 SSH 방식을 사용한다. 공개키 인증 방식을 사용하기 전에 이미 생성된 키가 있는지 확인하는게 좋다.

```bash
➜  ~/.ssh
➜  ls
```

![1](https://user-images.githubusercontent.com/79130276/204462884-adb62b07-1865-4a18-8c9e-f041a37d8b26.png)

디렉토리에 ***.pub(공개키), ***(개인키)가 있다면 이미 키를 생성한 적이 있는 것이다. 키가 있다면 아래 키 생성과정은 생략해도 좋다.

키 생성은 `ssh-keygen`으로 생성한다.

```bash
➜  ssh-keygen -t rsa -b 4096 -C "yessm621@gmail.com"
```

위 명령어를 입력하면 첫번째로 키를 어디에 생성하지 묻는데 기본 위치인 ~/.ssh 에 저장하는게 좋다. 다음으로 SSH 키에 대한 비밀번호를 지정할지 묻는데 비밀번호를 지정해도 되고 생략하고 싶다면 엔터키를 누르면 된다.

![2](https://user-images.githubusercontent.com/79130276/204462893-f720da76-0f4b-4c97-92bc-9d7ba442a24f.png)

> **참고** Github에서는 패스워드 설정을 권장한다.
> 

이제 SSH 키가 생성되었다. 공개키는 ***.pub 형식으로 저장된다.

![3](https://user-images.githubusercontent.com/79130276/204462895-38559ead-e225-474d-b326-66b76caafc7a.png)

cat 명령어를 통해 생성된 공개키를 확인할 수 있다. 

```bash
➜  cat id_rsa.pub
```

다시 한번 강조하지만 개인키는 절대로 공개되어선 안된다. 

![4](https://user-images.githubusercontent.com/79130276/204462899-d7b5ac5a-bd62-4908-89a9-f1cf466bc3dd.png)

##Github에 SSH 키 등록

이제 Github에 공개키를 등록해보자.

Github 페이지 (https://[github.com](http://github.com) )에 접속 > 오른쪽 상단의 프로필 클릭 > Settings 메뉴 > 오른쪽 사이드 바 > SSH and GPG keys 메뉴 > SSH keys

![5](https://user-images.githubusercontent.com/79130276/204462903-1816ad27-81e0-46e9-a101-89f88238c8d6.png)

New SSH key 버튼을 클릭하면 아래와 같은 화면이 나온다.

![6](https://user-images.githubusercontent.com/79130276/204462907-f30b0fe0-c5d7-497e-a4aa-523c8dd6aa5c.png)

Title 필드에 등록하려는 키의 이름(구분 값)을 입력한다. Key type은 Authentication Key를 사용하고 Key 필드에 생성했던 SSH 공개키를 입력한다.

이제 아래와 같이 공개키가 등록된 것을 확인할 수 있다.

![7](https://user-images.githubusercontent.com/79130276/204462909-4afca83e-4dea-495a-a879-2327ee0ed132.png)