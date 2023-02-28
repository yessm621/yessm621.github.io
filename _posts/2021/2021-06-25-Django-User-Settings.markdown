---
layout: post
title:  "Django User Settings"
date: 2021-06-25 00:00:00
categories: [Django]
tags:
  - Django
  - Python
author: "유자"
---

## AUTH_USER_MODEL 설정

장고에는 기본적으로 내장되어있는 AbstractUser 이 있다.

내장된 AbstractUser 를 사용할 수도 있지만 보통은 새롭게 정의해서 사용하기 때문에

아래 설정을 settings.py 파일에서 해준다.

→ 아래 설정을 생략하면 장고의 기본적으로 세팅되어있는 user 모델과 혼동이 올 수 있음

```python
AUTH_USER_MODEL = 'users.User'
```

<br>

## LOGIN_URL, LOGIN_REDIRECT_URL 설정

Django 의  Login, Logout 메커니즘은

1. next 라는 변수를 먼저 찾음. 없다면,

2. login_redirect_url 을 찾는다. 없다면,

3. default 로 간다.


settings.py

```python
LOGIN_URL = reverse_lazy('account:login')
LOGIN_REDIRECT_URL = reverse_lazy('main:index')
```

next 를 사용했는데 login_redirect_url 를 설정할 필요가 있을까?

→ yes!! 주소창에서 직접 들어가게 되면 next 변수가 없어서 default 로 가게 됨. 따라서 오류 발생
