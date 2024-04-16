---
title: "Nginx 를 이용하여 SpringBoot 무중단 배포하기"
categories:
  - DevOps
tags:
  - Spring
  - Java
  - Nginx
toc: true
toc_sticky: true
---

## 구조

- Nginx 1대, 스프링부트 jar 2대
- Nginx에는 80(http), 443(https) 포트를 할당합니다.
- 스프링부트 jar1에는 8081포트로 , 스프링부트 jar2에는 8082포트로 실행합니다.(포트는 원하시는 포트를 사용하시면 됩니다.)
- 구조는 아래의 그림같이 형성

![Untitled](https://user-images.githubusercontent.com/79130276/140848043-6e291b45-9b96-423b-9e00-8bd93d081082.png)

위 그림의 동작 과정

1. 사용자는 80, 443 포트로 서비스에 접속
2. Nginx 는 해당 요청을 받아 현재 동작중인 스프링부트 Jar1(Port: 8081) 으로 전달함
3. 스프링부트 Jar2(Port: 8082) 는 현재 동작중이지 않기 때문에 받지 못함



![Untitled2](https://user-images.githubusercontent.com/79130276/140848044-12b0776b-fa45-4e15-9db8-2197ba6475c3.png)

위 그림의 신규 버전 배포시 동작 과정

1. 2.0 버전으로 신규 배포가 진행되면 현재 동작중이지 않은 스프링부트 Jar2(8082) 로 배포
2. 배포하는 동안에는 사용자는 스프링부트 Jar1(8081)를 계속해서 바라보고 있는 중
3. 배포가 정상적으로 끝난다면, 스프링부트 Jar2(8082)의 구동 여부를 확인
4. 정상 구동 중이라면 nginx 는 스프링부트 Jar2(8082)를 바라보도록 설정

배포에 문제가 생길 시에는 정상 구동 중인 스프링부트 Jar로 돌아감



![Untitled3](https://user-images.githubusercontent.com/79130276/140848046-e4c4abf4-32bd-4ad6-ab6d-72908f149aee.png)


위 그림 동작 과정

1. 2.1 버전으로 신규 배포가 진행되면 현재 동작중이지 않은 스프링부트 Jar1(8081)로 배포
2. 배포하는 동안에는 사용자는 스프링부터 Jar2(8082)를 계속해서 바라보고 있는 중
3. 배포 도중 문제가 생겼다면, nignx 는 그대로 스프링부트 Jar2(8082)를 바라보도록 함
4. 배포의 문제를 확인하고 다시 배포를 진행

## 프로젝트 경로

```
# /usr/local/web
.
├── config                    - 무중단배포 포트관련 설정파일
├── cutelovelycat             - 프로젝트 경로 (git)
│   ├── build
│   ├── gradle
│   └── src
└── nonstop                   - 무중단배포
    ├── cutelovelycat
    └── jar                   - 배포시 실제 적용되는 jar 파일
```


## 프로젝트 settings

### 1) nginx 설치

1. nginx 저장소 추가

    yum 저장소에는 nginx 라이브러리가 없기 때문에 저장소를 임의로 추가

    ```bash
    vi /etc/yum.repos.d/nginx.repo
    ```

    **nginx.repo 파일 만들고 아래 내용 추가**

    ```bash
    [nginx]
    name=nginx repo
    baseurl=http://nginx.org/packages/centos/7/$basearch/
    gpgcheck=0
    enabled=1
    ```


2. nginx 설치

    ```bash
    yum install -y nginx
    ```


3. nginx 서비스 등록 및 시작

    ```bash
    # 서비스 등록
    systemctl enable nginx
    # 서비스 시작
    systemctl start nginx
    # 서비스 상태 확인
    systemctl status nginx
    ```


4. nginx 설정파일 수정

    **/etc/nginx/conf.d/*.conf**

    ```bash
    server {
        listen 80;
        listen [::]:80;
        server_name localhost;

        include /etc/nginx/conf.d/service-url.inc;

        location / {
            proxy_pass $service_url;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
        }
    }
    ```

    **service-url.inc**

    ```bash
    set $service_url http://127.0.0.1:8081;
    ```


    **nginx 재시작**

    ```bash
    systemctl restart nginx
    ```



> **참고** Nginx 동적 프록시 설정
<br>
> nginx 가 set1(port: 8081) 과 set2(port: 8082) 를 번갈아가면서 바라보도록 하는 프록시 설정
>
> ```bash
> location / {
> 		# 동적으로 Proxy Pass 를 변경
> 		proxy_pass $service_url;
>     proxy_set_header X-Real-IP $remote_addr;
>     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
>     proxy_set_header Host $http_host;
> }
> ```


### 2) github repository 연결

1. SSH key 파일 확인 및 public key 등록

    ```bash
    cd ~/.ssh
    ls
    ```

    ![4](https://user-images.githubusercontent.com/79130276/140850047-6b781060-e631-4452-a458-a025e5f6d230.png)

    위의 사진처럼 키파일이 있다면 github settings 에서 ssh key 를 등록해주면 된다.

    `주의! 반드시 퍼블릭키를 등록해야 한다 (*.pub)`

    > **참고**
    <br>
    > [[Git (7)] Github 비밀번호 입력 없이 pull/push 하기(github ssh key 설정)](https://goddaehee.tistory.com/254)



2. git clone ssh 주소

    프로젝트 경로에 clone 을 할때 ssh 주소로 가져옴

    ```bash
    git clone git@github.com:nnyang0110/cat.git
    ```


### 3) 프로젝트 설정

프로젝트의 기본 경로는 /usr/local/web 이다

```bash
cd /usr/local/web
```


실제 운영환경 설정파일

```bash
vi ./cutelovelycat/src/main/resources/application.yml
```

application.yml

```bash
spring:
  devtools:
    livereload:
      enabled: true
    restart:
      enabled: true
    thymeleaf:
      cache: false
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/dbname?useUnicode=true&characterEncoding=utf8&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=Asia/Seoul
    username: 
    password: 
    driver-class-name: com.mysql.cj.jdbc.Driver

  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: 
            redirectUri: "{baseUrl}/{action}/oauth2/code/{registrationId}"
            client-authentication-method: POST
            authorization-grant-type: authorization_code
            scope: profile_nickname, account_email
            client-name: Kakao
        provider:
          kakao:
            authorization_uri: https://kauth.kakao.com/oauth/authorize
            token_uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user_name_attribute: kakao_account

  jpa:
    hibernate:
      ddl-auto: none
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    org.hibernate.SQL: debug
```


**무중단 배포를 위한 설정파일**

→ profiles 에 따라 포트를 다르게 줌

```bash
vi ./config/real-application.yml
```

real-application.yml

```bash
---
spring:
  profiles: set1
server:
  port: 8081

---
spring:
  profiles: set2

server:
  port: 8082
```


### 4) 무중단 배포 설정

기본 경로는 /usr/local/web/nonstop 이다

```bash
cd /usr/local/web/nonstop
```

```
.
├── cutelovelycat
│   └── build
│       └── libs
│           └── cat-0.0.1-SNAPSHOT.jar
├── deploy.sh
├── jar
│   ├── cat-0.0.1-SNAPSHOT.jar
│   ├── set1-cat.jar -> /usr/local/web/nonstop/jar/cat-0.0.1-SNAPSHOT.jar
│   └── set2-cat.jar -> /usr/local/web/nonstop/jar/cat-0.0.1-SNAPSHOT.jar
├── nohup.out
└── switch.sh
```

**자동 배포, 무중단 배포 스크립트**

deploy.sh

```bash
#!/bin/bash

REPOSITORY=/usr/local/web
DEPLOY_PATH=$REPOSITORY/nonstop/cutelovelycat/build/libs/

cd $REPOSITORY/cutelovelycat/

echo "> Git Pull"
git pull

echo "> 프로젝트 Build 시작"
./gradlew build

echo "> 배포 경로에 복사"
JAR_NAME=$(ls $REPOSITORY/cutelovelycat/build/libs/ |grep 'cat' |grep 'SNAPSHOT.jar' | tail -n 1)

echo "> JAR Name: $JAR_NAME"

cp ./build/libs/$JAR_NAME $DEPLOY_PATH

BASE_PATH=/usr/local/web/nonstop
BUILD_PATH=$(ls $BASE_PATH/cutelovelycat/build/libs/*.jar)
JAR_NAME=$(basename $BUILD_PATH)
echo "> build 파일명: $JAR_NAME"

echo "> build 파일 복사"
DEPLOY_PATH=$BASE_PATH/jar/
cp $BUILD_PATH $DEPLOY_PATH

echo "> 현재 구동중인 Set 확인"
CURRENT_PROFILE=$(curl -s http://localhost/profile)
echo "> $CURRENT_PROFILE"

# 쉬고 있는 set 찾기: set1이 사용중이면 set2가 쉬고 있고, 반대면 set1이 쉬고 있음
# Nginx 에 연결되어 있지 않은 Profile 찾기
# set1 이 구동중이면 set2 를 연결
# set2 이 구동중이면 set1 를 연결
if [ $CURRENT_PROFILE == set1 ]
then
  IDLE_PROFILE=set2
  IDLE_PORT=8082
elif [ $CURRENT_PROFILE == set2 ]
then
  IDLE_PROFILE=set1
  IDLE_PORT=8081
else
  echo "> 일치하는 Profile이 없습니다. Profile: $CURRENT_PROFILE"
  echo "> set1을 할당합니다. IDLE_PROFILE: set1"
  IDLE_PROFILE=set1
  IDLE_PORT=8081
fi

# 미연결된 Jar 로 신규 Jar 심볼릭 링크 (ln)
echo "> application.jar 교체"
IDLE_APPLICATION=$IDLE_PROFILE-cat.jar
IDLE_APPLICATION_PATH=$DEPLOY_PATH$IDLE_APPLICATION

ln -Tfs $DEPLOY_PATH$JAR_NAME $IDLE_APPLICATION_PATH

# Nginx 와 연결되지 않은 Profile 종료
echo "> $IDLE_PROFILE 에서 구동중인 애플리케이션 pid 확인"
IDLE_PID=$(pgrep -f $IDLE_APPLICATION)

if [ -z $IDLE_PID ]
then
  echo "> 현재 구동중인 애플리케이션이 없으므로 종료하지 않습니다."
else
  echo "> kill -15 $IDLE_PID"
  kill -15 $IDLE_PID
  sleep 5
fi

# Nginx 와 연결된 Profile Jar 로 실행
echo "> $IDLE_PROFILE 배포"
nohup java -jar -Dspring.profiles.active=$IDLE_PROFILE $IDLE_APPLICATION_PATH &

# 프로젝트 상태 확인
echo "> $IDLE_PROFILE 10초 후 Health check 시작"
echo "> curl -s http://localhost:$IDLE_PORT/profile"
sleep 10

for retry_count in {1..10}
do
  response=$(curl -s http://localhost:$IDLE_PORT/profile)
  up_count=$(echo $response | grep 'set' | wc -l)

  if [ $up_count -ge 1 ]
  then # $up_count >= 1 ("set" 문자열이 있는지 검증)
      echo "> Health check 성공"
      break
  else
      echo "> Health check의 응답을 알 수 없거나 혹은 status가 UP이 아닙니다."
      echo "> Health check: ${response}"
  fi

  if [ $retry_count -eq 10 ]
  then
    echo "> Health check 실패. "
    echo "> Nginx에 연결하지 않고 배포를 종료합니다."
    exit 1
  fi

  echo "> Health check 연결 실패. 재시도..."
  sleep 10
done

# 아래 추가
echo "> 스위칭"
sleep 10
/usr/local/web/nonstop/switch.sh
```



동적 프록시 환경이 구축된 Nginx 가 `배포 시점에 바라보는 Profile 을 자동으로 변경`하는 switch 스크립트 생성

switch.sh

```bash
#!/bin/bash
echo "> 현재 구동중인 Port 확인"
CURRENT_PROFILE=$(curl -s http://localhost/profile)

# 쉬고 있는 set 찾기: set1이 사용중이면 set2가 쉬고 있고, 반대면 set1이 쉬고 있음
if [ $CURRENT_PROFILE == set1 ]
then
  IDLE_PORT=8082
elif [ $CURRENT_PROFILE == set2 ]
then
  IDLE_PORT=8081
else
  echo "> 일치하는 Profile이 없습니다. Profile: $CURRENT_PROFILE"
  echo "> 8081을 할당합니다."
  IDLE_PORT=8081
fi

echo "> 전환할 Port: $IDLE_PORT"
echo "> Port 전환"
echo "set \$service_url http://127.0.0.1:${IDLE_PORT};" |sudo tee /etc/nginx/conf.d/service-url.inc

PROXY_PORT=$(curl -s http://localhost/profile)
echo "> Nginx Current Proxy Port: $PROXY_PORT"

echo "> Nginx Reload"
sudo service nginx reload
```



> **참고**
<br>
> gradlew 의 실행권한이 없다는 메시지가 뜬다면

```bash
chmod +x ./gradlew
```

nginx proxy 오류 (포트 설정에 대한 부분)

→ SELinux 가 차단하여 발생

```bash
/usr/sbin/setsebool httpd_can_network_connect true
```


결과적으로 아래와 같이 두개의 jar 파일이 돌고 있고

![1](https://user-images.githubusercontent.com/79130276/140849762-0ed8dd0d-e6ce-4e02-8668-d62f15a0646d.png)



현재 set2 가 실행 중이다

![2](https://user-images.githubusercontent.com/79130276/140849765-b8469966-e491-4f35-b197-f818b5e08c1e.png)



코드가 수정되고 배포를 하게 되면 set1 이 실행되게 된다.

![3](https://user-images.githubusercontent.com/79130276/140849766-7b89eefd-51e4-4a3b-bbe5-2f66c961070b.png)


## Reference

스프링 부트와 AWS로 혼자 구현하는 웹서비스

[[SpringBoot] 웹서비스 출시하기 - 5. Nginx를 활용한 무중단 배포 구축하기](https://dev-jwblog.tistory.com/42)
