---
title: "M1 Mac에서 github.io 블로그 준비하기"

categories:
  - GitHubBlog
tags:
  - Ruby
  - Jekyll
  - Programming
  - GitHub Pages
---
### 처음부터 이블로그를 통해 만든사람은 1번부터 그냥 따라 하면 된다.
솔직히 말하자면 나는 여기서 오래 걸린것같다.   
우선 블로그를 만들기전에, 깔아야할 프로그램들이 있다.  
Ruby를 설치하라고 해서 따라서 하는데
이런 오류가 계속 발생했는데, Gem::FilePermissionError  

~~~
$ gem install bundler
ERROR:  While executing gem ... (Gem::FilePermissionError)
    You don't have write permissions for the /Library/Ruby/Gems/2.3.0 directory.
~~~

그이유는 맥북에서 시스템에서  
이미 Ruby를 사용하고 있을지 누가 알았을까?
어찌됐든, 내가 해결한 방법을 공유하려고 한다.

## 1. Homebrew
우선 다들 깔려있을테지만, 혹시나 안깔려 있는 분들을 위해 
<https://brew.sh/index_ko> 공식 홈페이지에 들어가서 Homebrew를 깔아주면 된다.

## 2. rbenv설치 및 오류 해결
먼저 brew를 통해 rbenv를 설치해야한다.
~~~
brew update
brew install rbenv ruby-build
~~~
그다음, rbenv가 잘 설치되었는지 확인해보자.
~~~
rbenv versions
~~~
현재 나의 경우는 Ruby가 system Ruby를 사용하고 있다.
~~~
* system (set by /Users/idong-uk/.rbenv/version)
~~~
따라서, rbenv로 관리되는 Ruby를 설치해야 한다.
설치할 수 Ruby 버전은 다음 명령으로 확인할 수 있다.
~~~
rbenv install -l
~~~
그러면 아래와 같이 설치 가능한 Ruby의 버전들이 나온다.  

![image](https://user-images.githubusercontent.com/68246962/120061746-935ff200-c099-11eb-958f-091923fde9f3.png)  
2021년 05월 29일 기준으로 가장 최신 버전인 3.0.1를 선택해서 설치해보자.
~~~
rbenv install 3.0.1
~~~
그후, rbenv로 버전을 다시 확인해보면,
~~~
rbenv versions
~~~
여전히 system으로 되어있지만, 방금 설치한 3.0.1 버전도 보인다.
~~~
* system
  3.0.1 (set by/Users/jaekwonchoi/.rbenv/version)
~~~
그러면 이제, rbenv로 글로벌 버전을 3.0.1로 변경하자.
~~~
rbenv global 3.0.1
~~~
다시 버전을 확인하면
~~~
rbenv versions
~~~
아래와 같이 바뀐걸 볼 수 있다.
~~~
  system
* 3.0.1 (set by /Users/jaekwonchoi/.rbenv/version)
~~~
마지막으로 rbenv PATH를 추가하기 위해 본인의 쉘 설정 파일 (..zshrc, .bashrc) 을 열어 다음의 코드를 추가해야한다.   
나는 zsh를 사용하니 .zshrc에 추가하면,
~~~
vim ~/.zshrc
~~~
~~~
[[ -d ~/.rbenv  ]] && \
  export PATH=${HOME}/.rbenv/bin:${PATH} && \
  eval "$(rbenv init -)"
~~~
코드를 추가했다면 source로 코드를 적용해야한다.
~~~
source ~/.zshrc
~~~
그리고 다시 gem install을 수행해보면,
~~~
gem install bundler
~~~
정상적으로 실행되는 것을 확인할 수 있다.

## 3. Jekyll 과 bundler 설치하기
아래와같이 gem install 명령어를 사용하여 jekyll과 bundler를 설치한다.  
젬(gem)은 분산 패키지 시스템으로 라이브러리의 작성이나 공개, 설치를 도와주는 시스템이다.  
리눅스에서의 apt 시스템과 유사하다. 루비는 젬(gem)을 사용하여 라이브러리 설치를 진행한다.
~~~
gem install jekyll bundler
~~~
이후 jekyll이 잘 설치 되었는지 확인하자.
~~~
jekyll -v
~~~
나는 
~~~
jekyll 4.2.0
~~~
버전으로 깔려있다.

그러면 기본적인건 설치가 다 되었다 다음으로 넘어가자.