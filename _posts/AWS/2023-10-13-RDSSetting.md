---
title: "AWS RDS 생성과 설정"
categories:
  - AWS
tags:
  - AWS
toc: true
toc_sticky: true
---

## DB 생성

RDS를 생성해보자. 표준 생성을 선택하고 원하는 DB 종류를 선택한다. 나의 경우 MariaDB를 선택했다.

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/46fb7f33-5b63-4a07-9508-31c0456c8444)

## 템플릿

템플릿은 무료로 이용하기 위해 프리티어를 선택한다.

![2](https://github.com/yessm621/yessm621.github.io/assets/79130276/de68f83d-e900-4f8c-8a36-cc00428c5fb3)

## 설정

설정에선 DB의 마스터를 설정해야 한다. 마스터는 root로 설정하고 암호를 입력한다.

![3](https://github.com/yessm621/yessm621.github.io/assets/79130276/210fedda-79cb-4d1b-9415-66ea752ff275)

## 인스턴스 구성

인스턴스는 db.t2.micro를 선택한다.

![4](https://github.com/yessm621/yessm621.github.io/assets/79130276/9df29415-8222-42d4-9d8d-2250c6902176)

## 스토리지

스토리지 자동 조정 활성화를 체크 해제한다.

![5](https://github.com/yessm621/yessm621.github.io/assets/79130276/40cd3a7e-4105-4e68-8394-5f5b88153d8d)

## 연결

EC2와 연결하는 것은 RDS 설정이 완료된 후에 할 예정이라 여기선 스킵하겠다.

![6](https://github.com/yessm621/yessm621.github.io/assets/79130276/494a88b7-0a98-4547-a392-d21264fc6cff)

VPC 보안 그룹은 새로 생성한다.

![7](https://github.com/yessm621/yessm621.github.io/assets/79130276/4eccdd54-1862-4dde-91d7-c4f35ba91f0c)

## 데이터베이스 인증

![8](https://github.com/yessm621/yessm621.github.io/assets/79130276/e3594dd7-0afa-4ed2-ae4d-952b21f0fad1)

## 추가 구성

추가 구성에서는 과금을 방지하기 위해 자동 백업 활성화 해제와 마이너 버전 자동 업그레이드를 해제한다.

![9](https://github.com/yessm621/yessm621.github.io/assets/79130276/db46f21c-c967-484d-8406-e5916247a20b)

> **참고** RDS 과금을 방지하기 위한 3가지
<br>
> 
> 1. 스토리지 → 스토리지 자동 조정 활성화 해제
> 2. 추가구성 → 백업 → 자동 백업 체크 해제
> 3. 추가구성 → 유지관리 → 마이너 버전 자동 업그레이드 체크 해제

## 파라미터 그룹

파라미터 그룹 생성 버튼을 누른다.

![10](https://github.com/yessm621/yessm621.github.io/assets/79130276/1259a4b1-4419-4a37-b044-9eed6f15fc77)

파라미터 그룹 패밀리는 RDS 생성 시 선택했던 DB 종류의 버전을 선택하면 된다. 그룹 이름을 작성하고 생성을 누른다.

![11](https://github.com/yessm621/yessm621.github.io/assets/79130276/8103e8b6-ccb6-47a7-9d69-84f92cb3d956)

생성된 파라미터 그룹을 선택하고 편집 버튼을 누른다.

![12](https://github.com/yessm621/yessm621.github.io/assets/79130276/9940e2e0-3a6d-4985-a3cf-301faa0fc557)

아래 3가지 항목에 대해 설정한 후 변경 사항 저장을 누른다.

![13](https://github.com/yessm621/yessm621.github.io/assets/79130276/d20f1ce2-a626-4d69-a424-f8d7c2378f75)

- time_zone: Asia/Seoul
- char로 검색시 나오는 6개의 항목: utf8mb4
- Collation 검색 시 나오는 2개의 항목: utf8mb4_general_ci

## RDS 보안그룹 설정

인바운드 규칙

- 내 로컬 IP 등록
- 생성했던 EC2의 보안그룹 등록

![14](https://github.com/yessm621/yessm621.github.io/assets/79130276/536b925f-ef3d-450c-ac81-d70a0981c562)

RDS 생성과 설정을 완료했다.