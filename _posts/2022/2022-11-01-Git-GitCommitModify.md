---
title: "Git commit 로그 수정"
last_modified_at: 2022-11-01T09:05:00
categories:
  - Git
tags:
  - Git
toc: true
toc_label: "Index"
toc_sticky: true
---

### 직전에 작성한 commit 변경

아래 명령어 입력하고 수정한 다음 :wq 로 저장

```bash
git commit --amend
```

### 이전에 작성한 commit 변경

```bash
git rebase -i <commit>
```

위 명령어를 입력하면 커밋 목록이 표시된다. 그 중에서 수정하려는 커밋을 찾아 그 행의 pick 문자를 edit으로 변경하고 저장, 종료한다.

그 후 아래 명령어 입력하여 commit 변경한다.

```bash
git commit --amend
```

마지막으로 --continue옵션을 지정하여 rebase를 실행한다.

```bash
git rebase --continue
```

### commit 날짜 변경

```bash
# 마지막 Commit 날짜를 현재 날짜로 설정
git commit --amend --no-edit --date "$(date)"

# 마지막 Commit 날짜를 임의의 날짜로 설정
git commit --amend --no-edit --date "Mon 20 Aug 2018 20:19:19 KST"
```

### author 변경

**1) commit 만 했을 때**

```bash
git commit --amend --author="yessm621 <yessm621@gmail.com>"
```