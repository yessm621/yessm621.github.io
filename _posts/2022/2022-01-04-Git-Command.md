---
layout: post
title:  "Git 자주쓰는 명령어"
# date: 2022-01-04 11:30:00
date: 2022-11-29 17:10:00
categories: [Git]
tags:
  - Git
author: "유자"
---

## 설정 정보 (Config)

### 사용자 정보 설정

```bash
# repository 마다 사용자 정보 설정
git config --local user.email "yessm621@gmail.com"
git config --local user.name "yessm621"

# 전역(Global)으로 설정
git config --global user.email "yessm621@gmail.com"
git config --global user.name "yessm621"
```

## Remote 저장소

### 저장소 연결/삭제

```bash
# 저장소 연결 상태 확인
git remote -v

# 저장소 연결
git remote add origin https://github.com/yessm621/yessm621.github.io

# 저장소 삭제
git remote remove origin
```

## Clone

### 저장소 clone

```bash
git clone 깃헙주소 프로젝트폴더명(생략가능)
```

### 저장소의 특정 브랜치 clone

```bash
git clone 깃헙주소 --branch 브랜치명 --single-branch 프로젝트폴더명
```

## 브랜치

### 브랜치 조회

```bash
# 생성된 모든 브랜치 조회
git branch -a
```

### 브랜치 생성과 삭제

```bash
# 로컬 브랜치 생성하고 바로 checkout
git checkout -b issue1

# 브랜치 삭제
git branch -d issue1

# 브랜치 삭제(강제)
git branch -D issue1
```

### 브랜치명 변경

```bash
git branch -m old_branch new_branch
```

### 원격 브랜치 생성과 삭제

```bash
# 로컬에 브랜치 생성된 상태에서 진행
# 원격 브랜치 생성
git push origin issue1

# 원격 브랜치 삭제
git push origin --delete issue1
```

### 원격 브랜치 동기화

```bash
# 모든 브랜치 동기화
git remote prune origin
```

## Commit

### commit 명 변경

아래 명령어 입력하고 수정한 다음 :wq 로 저장

```bash
git commit --amend
```

### commit 날짜 변경

```bash
# 마지막 Commit 날짜를 현재 날짜로 설정
git commit --amend --no-edit --date "$(date)"

# 마지막 Commit 날짜를 임의의 날짜로 설정
git commit --amend --no-edit --date "Mon 20 Aug 2018 20:19:19 KST"
```

### commit author 변경

```bash
git commit --amend --author="yessm621 <yessm621@gmail.com>"
```

### commit 내용 합치기

```bash
# HEAD에서 2개까지 커밋을 합침
git rebase -i HEAD~2
```

### commit 안한 변경사항 초기화 하기

```bash
# 개별 초기화
git restore 파일명

# 모든 파일 초기화
git restore .
git checkout .
```

### commit 취소

```bash
git reset HEAD^
```

## unstaging

### add 취소 (stage → unstage)

```bash
git reset HEAD 파일명

git restore --staged {file_name}

git checkout -- 파일명
```

### 다른 브랜치를 master로 최신화

```bash
git checkout dev
git rebase master
```

### 특정 commit 만 master에 추가

```bash
git checkout master
git cherry-pick commit명
```

### 특정 branch를 master에 merge

```bash
git checkout master
git merge branch명
```

## history

### 명령어 히스토리 조회

```bash
git reflog
```

### git commit 히스토리, commit 변경사항 확인하기
```bash
git log
# 변경된 내용까지 보여준다.
git log -p
```

### 변경사항을 임시로 저장하기

commit을 하기 부담스러울때 사용하면 좋다.
```bash
# 변경사항을 stash로 임시 저장한다.
git stash
# stash 목록을 확인한다.
git stash list

# 가장 최근의 stash를 가져온다.
git stash apply
# stash 이름을 지정해서 가져온다.
git stash apply stash@{2}
```