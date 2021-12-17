---
layout: post
title:  "Django Forms"
date:   2021-06-17 14:00:00 0100
categories: Django Python
---
<br>

## Django Form

---

장고에는 Model 클래스를 이용하여 Form 을 자동으로 생성하는 기능이 있다.

장고의 폼에는 is_valid() 라는 함수가 있다

**is_valid() 란?**

⇒ 입력받은 폼에 대한 유효성을 검사

views.py
```python
from django.views import View
from django.shortcuts import render
from . import forms

class LoginView(View):
    def get(self, request):
        form = forms.LoginForm(initial={"email": ""})
        return render(request, "users/login.html", {"form": form})

    def post(self, request):
        form = forms.LoginForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
        return render(request, "users/login.html", {"form": form})
```

<br>

**cleaned_data 란?**

is_valid() 라는 함수를 이용하여 유효성 검사가 끝나고 그 값이 true 일때 각 값들은 cleaned_data 에 저장된다.

clean 으로 시작하는 메서드 들은 각각의 값들의 유효성을 검사할 수 있다.

forms.py
```python
from django import forms
from . import models

class LoginForm(forms.Form):

    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean_email(self):
        email = self.cleaned_data.get("email")
        try:
            models.User.objects.get(username=email)
            return email
        except models.User.DoesNotExist:
            raise forms.ValidationError("User does not exist")

    def clean_password(self):
        return "lalal"
```

<br>


django 에서 post 로 전송 시 **csrf_token** 을 붙여줘야 한다

login.html
```html
{% raw %}
{% extends 'base.html' %}

{% block page_title %}
    Log In
{% endblock page_title %}

{% block search-bar %}
{% endblock search-bar %}

{% block content %}
    <form method="POST" action="{% url 'users:login' %}">
        {% csrf_token %}
        {{form.as_p}}
        <button>Login</button>
    </form>
{% endblock content %}
{% endraw %}
```






<br><br>