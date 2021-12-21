---
title:  "Django, Nginx, Gunicorn Setting (CentOS)"
categories:
  - Django
tags:
  - Django
  - Python
  - Nginx
  - Gunicorn
---

## Python3 설치

yum 으로 python3 설치  
```bash
yum install python3 -y
```

yum 으로 python3 을 설치하면 pip3 도 같이 설치됨  

python3 를 입력. 아래와 같이 나오면 설치 완료

![1](https://user-images.githubusercontent.com/79130276/113995871-999fd200-9891-11eb-8ee5-883643f88db7.png)

설치하고자 하는 프로젝트 경로에 가상환경 설치

```bash
/usr/local/thriller/thriller
pip3 install virtualenv
virtualenv venv
```

가상환경에 접속

```bash
source venv/bin/activate
```

![2](https://user-images.githubusercontent.com/79130276/113996287-fdc29600-9891-11eb-9b04-0b634895105d.png)

가상환경에서 빠져나옴

```bash
deactivate
```

![3](https://user-images.githubusercontent.com/79130276/113996292-fe5b2c80-9891-11eb-9299-7e50aaf1ab16.png)
<br><br><br>

## MySQL DataBase, 사용자 생성 및 권한 부여

mysql 에 접속

![4](https://user-images.githubusercontent.com/79130276/113996294-fe5b2c80-9891-11eb-944e-78fe7d8aaeb0.png)

데이터베이스 생성

```sql
mysql> CREATE DATABASE 데이터베이스명 default CHARACTER SET UTF8;
```

사용자 생성, 권한 부여

```sql
mysql> CREATE USER '사용자명'@'localhost' IDENTIFIED BY '비밀번호';

mysql> GRANT ALL PRIVILEGES on 데이터베이스명.* TO '사용자명'@'localhost' identified by '비밀번호';
mysql> GRANT ALL PRIVILEGES on 데이터베이스명.* TO '사용자명'@'127.0.0.1' identified by '비밀번호';
mysql> FLUSH PRIVILEGES;
```

![5](https://user-images.githubusercontent.com/79130276/113996280-fc916900-9891-11eb-9ef4-bf5fd651e12b.png)

데이터베이스, 사용자 삭제

```sql
mysql> DROP DATABASE 데이터베이스명;
mysql> DROP USER 사용자명@SERVER명;
```

사용자 조회

```sql
mysql> use mysql;
Database changed
mysql> select host, user from user;
+---------------+-----------+
| host          | user      |
+---------------+-----------+
| 127.0.0.1     | thriller  |
| 59.15.244.217 | thriller  |
| localhost     | mysql.sys |
| localhost     | root      |
| localhost     | thriller  |
+---------------+-----------+
5 rows in set (0.00 sec)
```

다음 과정부터는 프로젝트 경로에 git으로 프로젝트를 받아왔다고 가정하고 진행합니다.

<br><br>

## gunicorn 설정

gunicorn 설치 (가상환경 상태에서)

```bash
(venv) > pip3 install gunicorn
```

mysql 연결

```bash
yum install mysql-devel

yum install python3-devel

(venv) pip install mysqlclient
```

테스트 구동

```bash
> python manage.py runserver 0.0.0.0:8000
> gunicorn --bind 0.0.0.0:8000 thriller.wsgi:application
[2021-04-06 16:27:23 +0900] [9674] [INFO] Starting gunicorn 20.1.0
[2021-04-06 16:27:23 +0900] [9674] [INFO] Listening at: http://0.0.0.0:8000 (9674)
[2021-04-06 16:27:23 +0900] [9674] [INFO] Using worker: sync
[2021-04-06 16:27:23 +0900] [9677] [INFO] Booting worker with pid: 9677
```

구동이 잘되면 가상환경 빠져나온다

```bash
> deactivate
```

```bash
> mkdir /run/gunicorn

> sudo chown youurUserName.yourGroup /run/gunicorn

# youurUserName => > whoami
# yourGroup => > groups
```

vi /etc/systemd/system/gunicorn.service

```bash
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
PIDFile=/run/gunicorn/pid
User=root
Group=root
WorkingDirectory=/usr/local/thriller/thriller
ExecStart=/usr/local/thriller/thriller/venv/bin/gunicorn \
        --pid /run/gunicorn/pid \
        --workers 2 \
        --bind unix:/run/gunicorn/gunicorn.sock \
        thriller.wsgi:application

ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s TERM $MAINPID

[Install]
WantedBy=multi-user.target
```

수정 후 적용시 아래 명령어 입력

```bash
> systemctl daemon-reload
```

```bash
systemctl start gunicorn
# 서버 재부팅 시에도 자동으로 실행되게
systemctl enable gunicorn 
```

![6](https://user-images.githubusercontent.com/79130276/113996284-fdc29600-9891-11eb-8ad1-051b10ccd221.png)

<br><br>

## Nginx 설정

/etc/nginx/conf.d 아래에 프로젝트 명에 해당하는 config 파일 생성

vi /etc/nginx/conf.d/thriller.conf

```bash
server {
    listen 80;
    server_name 112.175.88.124;

    location /static {
        alias /usr/local/thriller/staticfiles;
    }

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://unix:/run/gunicorn/gunicorn.sock;
    }
}
```

nginx 재시작

```bash
nginx -s reload
```
<br>
설정 완료!😁
