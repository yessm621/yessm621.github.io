---
title:  "python3, pip3 Symbolic Link 설정"
categories:
  - Python
tags:
  - Python
  - Linux
---


## 현재상태

Linux 에는 기본적으로 Python2 버전이 설치된다.

CentOS 에서 Python3 버전을 설치했는데 python 을 입력할 경우 2.x  버전으로 인식한다. 

매번 python3 으로 명령어를 입력하는게 불편하여 구글링 해보니 **Symbolic Link** 를 통해 해결할 수 있다고 한다.

<br>

## 해결방안

python3 설정
```bash
# 현재 심볼릭 링크 확인
ls -l /bin/python*

# lrwxrwxrwx. 1 root root     7 Mar 25 22:45 /bin/python -> python2
# lrwxrwxrwx. 1 root root     9 Mar 25 22:45 /bin/python2 -> python2.7
# -rwxr-xr-x. 1 root root  7216 Aug  7  2019 /bin/python2.7
# lrwxrwxrwx. 1 root root     9 Jul  7 18:13 /bin/python3 -> python3.6
# -rwxr-xr-x. 2 root root 11328 Nov 17  2020 /bin/python3.6
# -rwxr-xr-x. 2 root root 11328 Nov 17  2020 /bin/python3.6m
```

```bash
# 기존의 심볼릭 링크 삭제
sudo unlink /bin/python

# 아래와 같이 심볼릭 링크를 걸어준다
sudo ln -s /bin/python3.6 /bin/python

# 확인
ls -l /bin/python*
```

<br>

pip3 설정
```bash
ls -l /bin/pip*

-rwxr-xr-x. 1 root root 407 Oct 14  2020 /bin/pip3
lrwxrwxrwx. 1 root root   9 Jul  7 18:13 /bin/pip-3 -> ./pip-3.6
lrwxrwxrwx. 1 root root   8 Jul  7 18:13 /bin/pip-3.6 -> ./pip3.6
-rwxr-xr-x. 1 root root 407 Oct 14  2020 /bin/pip3.6

ln -s /bin/pip3.6 /bin/pip
```
<br>

설정 후 python, pip 명령어를 입력하면 3 버전을 가리키는 것을 확인할 수 있다.
