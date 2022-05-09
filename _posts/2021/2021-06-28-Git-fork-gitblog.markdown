---
title:  "jekyll 로 fork 해온 git blog 테마, 잔디밭 안심어질 때"
categories:
  - Git
tags:
  - Git
  - GitBlog
  - GitHub
---

## 현재상태

git blog 를 생성하면서 jekyll 테마를 fork 해서 내 repository 에 생성을 했었는데
 잔디밭이 안심어지는 현상을 발견! (이왕이면 심어지면 좋으니까..)

아마 내 repository 가 아닌 다른 사람의 repository 에 push 되고 있는게 아닐까 생각..

<br>

## 해결방안

1. github 에 새로운 repository 를 생성 (new_blog)
2. 기존에 있는 repository 를 bare clone 한다

    ```bash
    git clone --bare https://github.com/user/old_blog.git
    ```

3. 새로운 레파지토리로 mirror-push

    ```bash
    cd old_blog.git
    git push --mirror https://github.com/user/new_blog.git
    ```

<br>


**git clone 옵션**

--normal: commit 이력 모두 담고 있고, 기본 branch 로 설정된 소스코드가 working tree 에 존재

--bare: commit 이력만 담고 있다

--mirror: 일반적인 commit 이력뿐만 아니라 숨어있는 모든 이력들을 담고 있다
