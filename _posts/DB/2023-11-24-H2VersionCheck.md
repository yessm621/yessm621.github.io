---
title: "H2 에러: 'Column \"start_value\" not found'"
categories:
  - DB
tags:
  - H2
toc: true
toc_sticky: true
---

SpringBoot와 H2 데이터베이스를 연동하고 애플리케이션을 실행하는데 아래와 같은 오류가 발생했다.

![1](https://github.com/yessm621/yessm621.github.io/assets/79130276/8c8d05f1-548f-43f8-aa0a-b0b15b35adbd)


해당 오류는 H2 데이터베이스 버전과 SpringBoot에서 설치한 H2 데이터베이스 라이브러리 `버전`이 맞지 않아서 발생한다. 따라서, 기존 H2 데이터베이스를 삭제 후 버전에 맞게 재 설치하면 해결된다. **주의할 점은 기존에 생성되었던 *.mv.db 파일을 삭제해야 한다.**

SpringBoot에서 설치한 H2 데이터베이스 라이브러리 버전은 아래와 같이 'External Libraries'에서 확인 가능하다.

![2](https://github.com/yessm621/yessm621.github.io/assets/79130276/ebb76a5b-d4a6-444c-9c32-3f9db945c8c2)

참고로 H2 데이터베이스의 버전을 확인하고 싶다면 아래 명령어를 입력하면 된다.

```sql
SELECT H2VERSION() FROM DUAL;
```

![3](https://github.com/yessm621/yessm621.github.io/assets/79130276/1328db4f-f4b5-4cec-a19f-4e99538e123b)