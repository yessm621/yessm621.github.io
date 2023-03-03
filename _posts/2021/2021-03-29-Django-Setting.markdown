---
layout: post
title: "Django Setting"
date: 2021-03-29 00:00:00
categories: [Django]
tags:
  - Django
  - Python
author: "유자"
---

## Pipenv 를 이용하여 가상환경 Setting

**pipenv 란?**

→ python 에서 사용하는 가상환경을 구성하는 방식 중 하나.


**pipenv 를 사용하는 이유**

→ 프로젝트별로 다른 패키지를 사용하며, 같은 패키지를 사용하더라도 버전이 다른 경우가 있기 때문에 pipenv 로 가상환경을 만든다.


**설치방법**

→ pipenv 를 설치하기 전에 python 을 설치 해야 함.

아래 부터는 os에 따라 설치 방법이 다릅니다.


1. **window**

    python 이 설치 되었는지 확인

    - cmd 창에서 python 을 검색

        ![image1](https://user-images.githubusercontent.com/79130276/112807240-a0209380-90b2-11eb-997a-056a0d095915.png)


	위의 사진과 같이 나온다면 pipenv 를 설치할 준비 끝!

	```shell
	# 프로젝트 생성 및 프로젝트로 진입
	mkdir project
	cd project

	# pip 으로 pipenv 설치
	pip install pipenv

	# python 버전 확인
	python --version

	# python 3.6.8 에 해당하는 pipenv 설치
	# 위에서 나온 버전을 아래에 써줍니다.
	pipenv --python 3.6.8

	# pipenv 가 설치되었는지 확인
	pipenv

	# 가상환경으로 들어감
	pipenv shell

	# 가상환경에서 나옴
	exit
	```


2. **mac**

	맥은 기본적으로 python 이 설치 되어 있기 때문에 해당 과정은 skip 합니다.

	```bash
	brew install pipenv

	pipenv

	pipenv —three

	pipenv shell
	```

<br><br>

## Django 설치

이제 장고를 설치하도록 하겠습니다.

pipenv install django
<br><br>
장고가 정상적으로 설치되었는지 확인

→ django-admin
<br><br>
이제 서버 실행합니다!

아래와 같이 입력하면 기본 포트 8000으로 서버를 실행해주고

python [manage.py](http://manage.py) runserver
<br><br>
다음과 같이 입력하면 포트를 지정해 줄 수 있습니다.

python [manage.py](http://manage.py) runserver 8888
<br><br>
다음과 같이 화면이 나온다면 장고 기본 셋팅은 끝났습니다

![image2](https://user-images.githubusercontent.com/79130276/112807229-9dbe3980-90b2-11eb-8b49-6afc461a2189.png)