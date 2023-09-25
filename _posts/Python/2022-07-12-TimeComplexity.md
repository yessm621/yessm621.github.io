---
title: "시간 복잡도와 공간 복잡도"
categories:
  - Python
tags:
  - Python
  - Algorithm
toc: true
toc_sticky: true
---

알고리즘 평가할 때 시간 복잡도와 공간 복잡도를 사용함

- 시간 복잡도: 알고리즘의 수행시간을 평가
- 공간 복잡도: 알고리즘 수행에 필요한 메모리 양을 평가

<br>

## 시간 복잡도

*시간 복잡도는 알고리즘의 수행시간을 나타냄.*

시간 복잡도를 낮출 수 있다면 프로그램에 큰 성능 향상을 기대할 수 있음

<br>

### O(1) - 상수 시간

입력 크기(N)에 상관없이 일정한 연산을 수행

<br>

### O(logN) - 로그 시간

입력 크기(N)가 커질 때 연산 횟수가 logN에 비례해서 증가

```java
for (i=1; i<=n; i*2) {}
```

<br>

### O(n) - 선형 시간

입력 크기(n)가 커질 때 연산 횟수가 n에 비례해서 증가하면 시간 복잡도는 O(n).

- 연산횟수가 선형적으로 증가하는 형태

```java
for (i=0; i<n; i++) {}
```

<br>

### O(N^2) - 2차 시간

입력 크기(n)가 커질 때 연산 횟수가 n^2에 비례해서 증가

예) 중첩 for문…

<br>

### O(2^N) - 지수 시간

입력 크기가 커질 때 연산수가 2^N에 비례해서 증가

예) 피보나치 수열…

<br>

![Untitled](https://user-images.githubusercontent.com/79130276/178433222-3b550022-9b55-4e97-b7e6-71eb5bb77b57.png)

<br>

### 파이썬 주요 함수, 메소드의 시간 복잡도

### list

| Operation | Example | Big-O | Notes |
| --- | --- | --- | --- |
| Index | l[i] | O(1) |  |
| Store | l[i] = 0 | O(1) |  |
| Length | len(l) | O(1) |  |
| Append | l.append(5) | O(1) |  |
| Pop | l.pop() | O(1) | l.pop(-1) 과 동일 |
| Clear | l.clear() | O(1) | l = [] 과 유사 |
| Slice | l[a:b] | O(b-a) | l[:] : O(len(l)-0) = O(N) |
| Extend | l.extend(…) | O(len(…)) | 확장 길이에 따라 |
| Construction | list(…) | O(len(…)) | 요소 길이에 따라 |
| check ==, ≠ | l1 == l2 | O(N) | 비교 |
| Insert | l.insert(i, v) | O(N) | i 위치에 v를 추가 |
| Delete | del l[i] | O(N) |  |
| Remove | l.remove(…) | O(N) |  |
| Containment | x in/not in l | O(N) | 검색 |
| Copy | l.copy() | O(N) | l[:] 과 동일 - O(N) |
| Pop | l.pop(i) | O(N) | l.pop(0):O(N) |
| Extreme value | min(l)/max(l) | O(N) | 검색 |
| Reverse | l.reverse() | O(N) | 그대로 반대로 |
| Interation | for v in l: | O(N) |  |
| Sort | l.sort() | O(N Log N) |  |
| Multiply | k*l | O(k N) | [1,2,3] * 3 » O(N**2) |

<br>

### Dict

| Operation | Example | Big-O | Notes |
| --- | --- | --- | --- |
| Index | d[k] | O(1) |  |
| Store | d[k] = v | O(1) |  |
| Length | len(d) | O(1) |  |
| Delete | del d[k] | O(1) |  |
| get/setdefault | d.method | O(1) |  |
| Pop | d.pop(k) | O(1) |  |
| Pop item | d.popitem() | O(1) |  |
| Clear | d.clear() | O(1) | s = {} or = dict() 유사 |
| View | d.keys() | O(1) | d.values() 동일 |
| Construction | dict(…) | O(len(…)) |  |
| Iteration | for k in d: | O(N) |  |

<br>

## 공간 복잡도

*공간 복잡도는 알고리즘에서 사용하는 메모리 양을 나타냄.*

공간 복잡도는 보조공간과 입력 공간을 합친 포괄적인 개념. 보조 공간은 알고리즘이 실행되는 동안 사용하는 임시 공간