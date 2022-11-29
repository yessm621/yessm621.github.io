---
title:  "Git 자주쓰는 명령어 정리"
last_modified_at: 2022-01-04T11:30:00
categories: 
  - Git
tags:
  - Git
toc: true
toc_label: "Index"
toc_sticky: true
---

## git config

### 사용자 정보 설정

```bash
# repository 마다 사용자 정보 설정
git config --local user.email "yessm621@gmail.com"
git config --local user.name "yessm621"

# 전역(Global)으로 설정
git config --global user.email "yessm621@gmail.com"
git config --global user.name "yessm621"
```

### ssh-keygen

```bash
ssh-keygen -t rsa -b 4096 -C "yessm621@gmail.com"
```

[ssh key 암호 없애기 및 변경하기 - git pull 할 때 암호 입력 안하기](https://gentlesark.tistory.com/102)

## git local

### 저장소 연결/삭제

```bash
# 저장소 연결 상태
git remote -v

# 저장소 연결
git remote add origin https://github.com/yessm621/yessm621.github.io

# 저장소 삭제
git remote remove origin
```

<br>

### 브랜치 생성/삭제

```bash
# 브랜치 생성 및 checkout
git checkout -b issue1

# 브랜치 삭제
git branch -d issue1
# 브랜치 삭제(강제)
git branch -D issue1
```

<br>

### 원격 브랜치 삭제

```bash
git push origin --delete issue1
```

<br>

### commit 내용 합치기

```bash
git rebase -i HEAD~2
```

<br>

### add 취소 (stage → unstage)

```bash
git reset HEAD 파일명
```

<br>

### commit 취소

```bash
git reset HEAD^
```

<br>

### 변경내용 되돌리기(위험! 되도록 사용하지 말 것)

```bash
git reset --hard
```

<br>

### 다른 브랜치를 master 로 최신화

```bash
git checkout dev
git rebase master
```

<br>

### 특정 commit 만 master 에 추가

```bash
git checkout master
git cherry-pick commit명
```

<br>

### 특정 branch를 master 에 merge

```bash
git checkout master
git merge branch명
```

<br>

### 브랜치명 변경

```bash
git branch -m old_branch new_branch
```

<br>

### commit 날짜 변경

```bash
# 마지막 Commit 날짜를 현재 날짜로 설정
git commit --amend --no-edit --date "$(date)"

# 마지막 Commit 날짜를 임의의 날짜로 설정
git commit --amend --no-edit --date "Mon 20 Aug 2018 20:19:19 KST"
```

<br>

### commit 명 변경

```bash
git commit --amend
```

<br>

### author 변경

**1) commit 만 했을 때**

```bash
git commit --amend --author="yessm621 <yessm621@gmail.com>"
```

**2) push 까지 했을 경우**

```bash
git log
```

![Untitled1](https://user-images.githubusercontent.com/79130276/148001519-8d76fdf1-f200-4907-900e-72f237387286.png)

```bash
git rebase -i 50326f224598ca2d8ceaace15a9184a0fe953b4c
```

pick → e 로 변경 후 :wq 로 저장

```bash
git commit --amend --author="yessm621 <yessm621@gmail.com>"

git rebase --continue
```

![Untitled2](https://user-images.githubusercontent.com/79130276/148001520-6807fe02-11c5-4b87-a3a7-bb80534407fd.png)

강제 commit

```bash
git push origin -f master

git log
```

![Untitled3](https://user-images.githubusercontent.com/79130276/148001523-419b87ba-9b3d-4f00-a09a-cea84affe3f0.png)

<br>

### 명령어 히스토리 조회

```bash
git reflog
```

<br>

### 브랜치 조회/동기화

```bash
# 브랜치 조회
git branch -a

# 모든 브랜치 동기화
git remote prune origin
```

<br>

### rebase 안에 갇힘

```bash
# shtmd@DESKTOP-N2JDB2I MINGW64 /c/dev/netshot/netshot-batch (master|REBASE 1/1)

# rebase 프로세스 종료
git rebase --abort
```

<br>

### error: Logon failed, use ctrl+c to cancel basic credential prompt.

계속 로그인 에러가 발생. 아래 명령어 입력하니 해결됨

```bash
git update-git-for-windows
```

<br>

### refusing to merge unrelated histories 오류

```bash
git pull origin 브런치명 --allow-unrelated-histories
```

위의 명령어 입력 후 충돌 해결