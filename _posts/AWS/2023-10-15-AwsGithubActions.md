---
title: "AWS, Github Actions을 이용한 Spring Boot 배포"
categories:
  - AWS
tags:
  - AWS
  - Github
  - SpringBoot
toc: true
toc_sticky: true
---

Github Actions를 이용하여 main 브랜치에 push 하면 AWS EC2에 자동으로 배포되는 과정에 대해 작성했다.

## 사전 준비

1. [EC2 생성](https://yessm621.github.io/aws/EC2Setting/)
2. [RDS 생성](https://yessm621.github.io/aws/RDSSetting/)
3. [S3 생성](https://yessm621.github.io/aws/S3Setting/)

## 배포 과정

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/a57b798d-a3ba-42ce-a22d-25fa58fb0d73)

1. 인텔리제이에서 main 브랜치로 push 또는 PR을 통해 main으로 merge
2. Github Actions에서 코드 빌드
3. AWS 인증
4. AWS S3에 압축된 코드(*.jar)를 업로드
5. AWS CodeDeploy 실행하여 S3에 있는 코드 EC2에 배포

## EC2 설정

기존에 생성했던 인스턴스에 추가적으로 작업한다.

### Tag 추가

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/29b9063a-7f93-488b-8f21-81f943828a20)

이름을 지정한 후 역할 생성 버튼을 클릭한다.

### IAM 역할 추가

IAM 대시보드에서 역할 관리 페이지로 이동하여 `역할 만들기` 버튼을 클릭한다.

![2](https://github.com/yessm621/yessm621.github.io/assets/79130276/14511421-c1ed-4aeb-83ae-ba26bed0afee)

그리고 아래와 같은 과정을 진행한다.

![3](https://github.com/yessm621/yessm621.github.io/assets/79130276/b101dd1f-c741-46c4-af62-4f740035d6d9)

![4](https://github.com/yessm621/yessm621.github.io/assets/79130276/01bbbbac-14ac-4e20-ac0b-8af86aa3a063)

![5](https://github.com/yessm621/yessm621.github.io/assets/79130276/42128eac-79fb-4f5b-a861-a163fa5b63a3)

그 후 다시 EC2 인스턴스로 이동해서 IAM 역할 수정을 눌러 방금 만들었던 IAM 역할을 등록해준다.

![6](https://github.com/yessm621/yessm621.github.io/assets/79130276/0cd0b1eb-89a0-4e2a-8672-cbe9d4545599)

### CodeDeploy Agent 설치

공식 문서를 참고하여 CodeDeploy Agent를 설치한다. EC2에 접속한 후 아래 명령어를 차례대로 입력하자.

```bash
sudo apt update
sudo apt install ruby-full
sudo apt install wget
cd /home/ubuntu
wget https://aws-codedeploy-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto > /tmp/logfile
sudo service codedeploy-agent status
```

아래와 같은 화면이 나오면 정상적으로 설치된 것이다.

![7](https://github.com/yessm621/yessm621.github.io/assets/79130276/c7920642-9abd-48c1-9199-e57219451ba8)

## CodeDeploy 생성

배포를 도와주는 CodeDeploy 생성 및 설정을 진행하자.

### CodeDeploy 전용 IAM 역할 만들기

CodeDeploy를 사용하기 위해 IAM에서 역할을 만들어야 한다. IAM 대시보드에서 역할 만들기를 선택하여 아래 과정을 진행한다.

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/293ead90-7754-4d64-af55-ea30a0f55bbf)

### CodeDeploy 애플리케이션 생성

![2](https://github.com/yessm621/yessm621.github.io/assets/79130276/107c78dc-1b11-4a8c-b4ce-7e1594b0ac97)

![3](https://github.com/yessm621/yessm621.github.io/assets/79130276/db23e2f8-194e-41f5-b74d-47f771882708)

![4](https://github.com/yessm621/yessm621.github.io/assets/79130276/a0993991-7bfd-4b84-98b2-d5dee078842a)

![5](https://github.com/yessm621/yessm621.github.io/assets/79130276/2365aa8f-44db-4c29-9c1e-cd3954c52ffd)

## Github Actions에서 사용할 IAM 사용자 추가

Github Actions에서 AWS에 접근하려면 권한이 필요하다. IAM 사용자를 추가해보자.

권한 설정 부분에서 직접 정책 연결을 선택하여 `AmazonS3FullAccess`와 `AWSCodeDeployFullAccess` 권한을 할당한다.

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/e6d18fa1-b902-4617-a3eb-ec7dfdef5656)

![2](https://github.com/yessm621/yessm621.github.io/assets/79130276/36d3b0e3-f95c-4caf-aaa8-9361d42be929)

액세스 키를 발급받는다.

![스크린샷 2024-03-28 오후 7 09 02](https://github.com/yessm621/yessm621.github.io/assets/79130276/960825ae-f0c0-4812-82e6-6b2e36e8a6eb)
발급 받은 액세스 키를 Github 에 등록해준다.

![3](https://github.com/yessm621/yessm621.github.io/assets/79130276/96ad8196-dce4-404e-95c9-c238039b9f0c)

![4](https://github.com/yessm621/yessm621.github.io/assets/79130276/4c69b4ee-e60b-41a6-8d5d-3648af601ec0)

## AppSpec 파일 작성

AppSpec 파일은 CodeDeploy에서 배포를 관리하는데 사용하는 YAML 형식의 파일이다.

appspec.yml

```bash
version: 0.0
os: linux

files:
  - source:  /
    destination: /home/ubuntu/app
    overwrite: yes

permissions:
  - object: /
    pattern: "**"
    owner: ubuntu
    group: ubuntu

hooks:
  AfterInstall:
    - location: scripts/stop.sh
      timeout: 60
      runas: ubuntu
  ApplicationStart:
    - location: scripts/start.sh
      timeout: 60
      runas: ubuntu
```

appspec.yml은 프로젝트의 루트 경로에 추가하면 된다.

![5](https://github.com/yessm621/yessm621.github.io/assets/79130276/ce633606-787e-438d-bd0b-37c30263ff6a)

## 배포 스크립트 작성

### stop.sh

```bash
#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
JAR_FILE="$PROJECT_ROOT/pinterest.jar"

DEPLOY_LOG="$PROJECT_ROOT/deploy.log"

TIME_NOW=$(date +%c)

# 현재 구동 중인 애플리케이션 pid 확인
CURRENT_PID=$(pgrep -f $JAR_FILE)

# 프로세스가 켜져 있으면 종료
if [ -z $CURRENT_PID ]; then
  echo "$TIME_NOW > 현재 실행중인 애플리케이션이 없습니다" >> $DEPLOY_LOG
else
  echo "$TIME_NOW > 실행중인 $CURRENT_PID 애플리케이션 종료 " >> $DEPLOY_LOG
  kill -15 $CURRENT_PID
fi
```

### start.sh

```bash
#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
JAR_FILE="$PROJECT_ROOT/pinterest.jar"
PROFILES="--spring.profiles.active=prod"

APP_LOG="$PROJECT_ROOT/application.log"
ERROR_LOG="$PROJECT_ROOT/error.log"
DEPLOY_LOG="$PROJECT_ROOT/deploy.log"

TIME_NOW=$(date +%c)

# build 파일 복사
echo "$TIME_NOW > $JAR_FILE 파일 복사" >> $DEPLOY_LOG
cp $PROJECT_ROOT/build/libs/*.jar $JAR_FILE

# jar 파일 실행
echo "$TIME_NOW > $JAR_FILE 파일 실행" >> $DEPLOY_LOG
nohup java -jar $JAR_FILE $PROFILES > $APP_LOG 2> $ERROR_LOG &

CURRENT_PID=$(pgrep -f $JAR_FILE)
echo "$TIME_NOW > 실행된 프로세스 아이디 $CURRENT_PID 입니다." >> $DEPLOY_LOG
```

start.sh와 stop.sh는 프로젝트 루트 경로에서 scripts 폴더 안에 포함되게 생성한다.

![6](https://github.com/yessm621/yessm621.github.io/assets/79130276/51f90fdd-61a2-4d47-858e-967c4ce62861)

### build.gradle 파일 수정

스프링 부트 2.5버전 부터 빌드 시 jar 파일 하나와 -plain.jar 파일 하나가 함께 만들어진다. plain.jar 파일은 생성되지 않도록 아래 코드를 추가한다.

build.gradle

```
jar {
    enabled = false
}
```

## Github Actions 작성

Github의 프로젝트 페이지로 가서 Actions 탭을 선택하여 Simple workflow를 선택한다.

### deploy.yml 파일 작성

```yaml
name: Deploy to Amazon EC2

on:
  push:
    branches: [ "main" ]

# AWS에서 설정한 값들을 작성
# 리전, 버킷 이름, CodeDeploy 앱 이름, CodeDeploy 배포 그룹 이름
env:
  AWS_REGION: ap-northeast-2
  S3_BUCKET_NAME: pinterest-file
  CODE_DEPLOY_APPLICATION_NAME: pinterest
  CODE_DEPLOY_DEPLOYMENT_GROUP_NAME: pinterest-deployment-group

permissions:
  contents: read

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment: production

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    # JDK 11 설치
    - name: Set up JDK 11
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'

    # 운영환경에 대한 설정 파일 정보
    - name: Set YML File
      run: |
        cd ./src/main/resources
        touch ./application.yml
        echo "${{ secrets.APPLICATION_PROD }}" > ./application-prod.yml

    - name: Build with Gradle
      uses: gradle/gradle-build-action@0d13054264b0bb894ded474f08ebb30921341cee
      with:
        arguments: clean build -x test

    # AWS 인증 (IAM 사용자 Access Key, Secret Key 적용)
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    # 빌드 결과물을 s3 버킷에 업로드
    - name: Upload to AWS S3
      run: |
        aws deploy push \
          --application-name ${{ env.CODE_DEPLOY_APPLICATION_NAME }} \
          --ignore-hidden-files \
          --s3-location s3://$S3_BUCKET_NAME/$GITHUB_SHA.zip \
          --source .

    # 버킷에 있는 파일을 대상으로 CodeDeploy 실행
    - name: Deploy to AWS EC2 from S3
      run: |
        aws deploy create-deployment \
          --application-name ${{ env.CODE_DEPLOY_APPLICATION_NAME }} \
          --deployment-config-name CodeDeployDefault.AllAtOnce \
          --deployment-group-name ${{ env.CODE_DEPLOY_DEPLOYMENT_GROUP_NAME }} \
          --s3-location bucket=$S3_BUCKET_NAME,key=$GITHUB_SHA.zip,bundleType=zip
```

- AWS_REGION은 로그인 후 내 계정 왼쪽에서 확인 가능하다.
    <img width="654" alt="1" src="https://github.com/yessm621/yessm621.github.io/assets/79130276/91c2419c-18e1-4dc8-a7d9-e736d1dd8489">
    
- APPLICATION_PROD에 대한 값을 AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY 처럼 등록해야 한다.
- APPLICATION_PROD에 들어가는 값은 운영환경의 설정 파일을 등록해주면 된다.
    
    ![7](https://github.com/yessm621/yessm621.github.io/assets/79130276/4bf019e5-7e3c-424f-9a0d-3ee46637239c)
    

**application-prod.yml 예시**

```yaml
spring:
  datasource:
    url: 
    username: 
    password: 
    driver-class-name: org.mariadb.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: none
    open-in-view: false
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        default_batch_fetch_size: 100
```

deploy.yml 파일을 작성한 후 커밋을 하면 Actions 탭에서 진행상황을 확인할 수 있다.

![8](https://github.com/yessm621/yessm621.github.io/assets/79130276/0e32b06f-26e5-4b36-a157-5ced5159dd6b)

![9](https://github.com/yessm621/yessm621.github.io/assets/79130276/83c9a442-24e5-4c5f-898e-55a3c5bd6d04)

CodeDeploy에서 배포 내역을 확인할 수 있다.

![10](https://github.com/yessm621/yessm621.github.io/assets/79130276/50c2eef4-28cb-45b0-a754-4346dcc6cf71)

![11](https://github.com/yessm621/yessm621.github.io/assets/79130276/0a839a53-9a09-4a73-ad66-919aa9cf9337)

![12](https://github.com/yessm621/yessm621.github.io/assets/79130276/ae8ce2c8-6793-4168-a12a-70314b858ec4)

정상적으로 배포된 것을 확인할 수 있다.

<img width="1100" alt="스크린샷 2024-03-29 오후 10 38 58" src="https://github.com/yessm621/yessm621.github.io/assets/79130276/d789c4eb-f31b-4b1f-b6f8-929fb7fb90e3">