---
title:  "[Mac] Django 프로젝트 셋팅 중 mysqlclient 오류"
last_modified_at: 2022-11-24T13:40:00
categories: 
  - Mac
tags:
  - Mac
  - MySQL
  - Python
---

Django 프로젝트를 셋팅하는 중에 mysqlclient 패키지 설치 시 오류가 발생했다.

원인을 찾아보던 중 mysqlclient 패키지의 버전에 따라 python의 버전을 변경해줘야 한다는 것을 보고 python 버전을 3.9에서 3.7로 낮춰주었다.

brew 설치된 상태에서 아래 명령어를 입력하여 python3.7 버전 설치

```bash
brew install python@3.7
```

python 3.7 버전으로 설치되었는지 확인

```bash
python3
```

설치한 파이썬 경로를 .bash_profile에 환경변수 등록해야 한다.

```bash
vi ~/.bash_profile
```

아래 내용을 .bash_profile에 입력하고 :wq 로 저장하고 나옴

```bash
export PATH=/usr/local/opt/python@3.7/libexec/bin:$PATH
export LDFLAGS="-L/usr/local/opt/python@3.7/lib"
```

터미널을 껏다 켜도 적용되도록 아래 명령어 입력

```bash
source ~/.bash_profile
```

새로운 터미널을 열어 환경변수가 잘 적용되었는지 확인하면 끝난다.

만약, 새로운 터미널을 열었는데 적용이 안된다면 zsh 문제일 수 있다. (필자의 경우가 그랬다.)

터미널 테마가 zsh였는데, zsh의 경우엔 터미널이 실행될 때 ~/.zshrc를 실행한다고 한다. .zshrc에는 파이썬과 관련된 환경변수를 설정하지 않았으니 당연히 초기화 되는 것처럼 보일 수 밖에 없다.

따라서, .bash_profile을 수정하면 .zshrc에서도 수정되도록 설정하자.

```bash
vi ~/.zshrc
```

.zshrc에 아래 내용을 입력 후 :wq 명령어를 통해 저장하고 나온다.

```bash
if [ -f ~/.bash_profile ]; then
	. ~/.bash_profile
fi
```

환경변수를 적용한다.

```bash
source ~/.zshrc
```

만약 아래와 같은 오류가 발생한다면,

```bash
compinit:503: no such file or directory: /usr/local/share/zsh/site-functions/_brew_services
```

아래 명령어를 통해 해결

```bash
brew cleanup
```

다시 터미널을 새로 열어서 환경변수가 잘 적용되었는지 확인한다.