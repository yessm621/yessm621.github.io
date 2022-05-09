---
title:  "파이썬 알고리즘"
# last_modified_at: 2022-05-06T17:11:00
last_modified_at: 2022-05-07T18:30:00
categories: 
  - Algorithm
tags:
  - Algorithm
  - Python
toc: true
toc_label: "Getting Started"
toc_sticky: true
#page_hidden: true
---

## 파이썬 기초 문법

### 출력방식

```python
a, b, c = 1, 2, 3

print(a, b, c, sep=', ')
# 1, 2, 3

print(a, b, c, sep='')
# 123

print(a, b, c, sep='\n')
# 1
# 2
# 3

# 줄바꿈 안함. 공백으로 구분.
print(a, end=' ')
print(b, end=' ')
print(c)
# 1 2 3
```

---

### 변수입력과 연산자

```python
# a = 2, b = 3
a=input("숫자를 입력하세요 : ")
print(type(a))
print(a)
# <class 'str'>
# 2

a, b = input("숫자를 입력하세요 : ").split()
a=int(a)
b=int(b)
print(type(a))
print(a+b)
# <class 'int'>
# 5

# 입력받은 값을 바로 int로 가져옴
a, b = map(int, input("숫자를 입력하세요 : ").split())
print(type(a))
print(a+b)
print(a-b)
print(a*b)
print(a/b) # 나누기
print(a//b) # 나누기의 몫
print(a%b) # 나누기의 나머지
print(a**b) # 제곱근
# <class 'int'>
# 5
# -1
# 6
# 0.66666666666
# 0
# 2
# 8

a=4.3
b=5
print(type(c))
print(c)
# <class 'float'> # 실수형과 정수형을 더하면 실수형으로 나옴, 범위: 실수형>정수형
# 9.3
```

---

### 반복문

```python
# range()는 정수를 순서대로 만듦
a=range(1, 11)
list(a)
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# range(10) == range(0,10)
list(range(10))
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

list(range(10, 0, -1))
# [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

list(range(10, 0, -2))
# [10, 8, 6, 4, 2]

# (i=i+1) == (i+=1)

# for ~ else 구문
for i in range(1, 11):
	print(i)
	if i==5:
		break
else:
	print(11)
# 1
# 2
# 3
# 4
# 5

for i in range(1, 11):
	print(i)
	if i>15:
		break
else:
	print(11)
# 1
# 2
# ...
# 9
# 10
# 11
```

---

### 반복문을 이용한 문제풀이

```python
'''
반복문을 이용한 문제풀이
1) 1부터 N까지 홀수 출력하기 (N은 입력받기)
2) 1부터 N까지 합 출력하기 (N은 입력받기)
3) N의 약수 출력하기 (N은 입력받기)
'''

# 1)
n = input("숫자1: ")
n = int(n)
for i in range(1, n+1):
	if i%2 == 1:
		print(i)

# 2)
n2 = int(input("숫자2: "))
sum = 0
for i in range(1, n2+1):
    sum+=i
print(sum)

# 3)
n3 = int(input("숫자3: "))
for i in range(1, n3+1):
    if n3%i==0:
        print(i, end=' ')
```

---

### 중첩 반복문(2중 for문)

```python
for i in range(5):
    print('i:', i, sep='', end=' ')
    for j in range(5):
        print('j:', j, sep='', end=' ')
    print()
```

```
i:0 j:0 j:1 j:2 j:3 j:4 
i:1 j:0 j:1 j:2 j:3 j:4 
i:2 j:0 j:1 j:2 j:3 j:4
i:3 j:0 j:1 j:2 j:3 j:4
i:4 j:0 j:1 j:2 j:3 j:4
```

```python
for i in range(5):
    print('i:', i, sep='', end=' ')
    for j in range(i+1):
        print('*', end=' ')
    print()
```

```
i:0 * 
i:1 * * 
i:2 * * *
i:3 * * * *
i:4 * * * * *
```

```python
for i in range(5):
    for j in range(5-i):
        print('*', end=' ')
    print()
```

```
* * * * * 
* * * * 
* * *
* *
*
```

---

### 문자열과 내장함수

```python
msg = "It is Time"
print(msg.upper()) # 대문자
print(msg.lower()) # 소문자
print(msg)
tmp=msg.upper()
print(tmp)
print(tmp.find('T')) # 문자열 index 반환(첫번째 index)
print(tmp.count('T')) # 문자열 갯수 count
print(msg)
print(msg[:2]) # 0번부터 2번 전까지
print(msg[3:5]) # 3번부터 5번 전까지
print(len(msg))
for i in range(len(msg)):
    print(msg[i], end=' ')
print()

for x in msg:
    print(x, end=',')
print()

# 문자열에서 대문자만 출력
for x in msg:
    if x.isupper():
        print(x, end=' ')
print()

# 문자열에서 소문자만 출력
for x in msg:
    if x.islower():
        print(x, end=' ')
print()

# 알파벳만 출력
for x in msg:
    if x.isalpha():
        print(x, end='')
print()

# ord(): 아스키 number 출력
# A: 65, Z: 90
# tmp='AZ'
tmp='az'
for x in tmp:
    print(ord(x))

# 아스키넘버 -> 문자열로
tmp=65
print(chr(tmp))
```

```
IT IS TIME
it is time
It is Time
IT IS TIME
1
2
It is Time
It
is
10
I t   i s   T i m e
I,t, ,i,s, ,T,i,m,e,
I T
t i s i m e
ItisTime
97
122
A
```

---

### 리스트와 내장함수(1)

```python
# 빈 list 생성
a=[]
b=list()
print(a, b)
print(type(a), type(b))

a = [1, 2, 3, 4, 5]
print(a, a[0])

# range로 list 초기화
b=list(range(1,11))
print(b)

c=a+b
print(c)

# list에 값 추가
a.append(6)

# list a 에 3번째 인덱스에 7을 추가
a.insert(3, 7)
print(a)

a.pop()
# list 마지막 요소 삭제
print(a)
# list의 3번째 요소 삭제
a.pop(3)
print(a)

# 값으로 요소 삭제
a.remove(4)
print(a)

# c=[3,2,1,4,6,8,'안녕']
# c.remove('안녕')
# print(c)

# 해당하는 값의 index를 반환
print(a.index(5))

print("===================")

a=list(range(1,11))
print(a)
print(sum(a)) # 리스트의 합
print(max(a)) # 리스트의 가장 큰 값
print(min(a)) # 리스트의 가장 작은 값
print(min(7,3,5)) # 7, 3, 5 중 작은 값

import random as r
# 랜덤으로 섞기
r.shuffle(a)
print(a)

# 내림차순
a.sort(reverse=True)
print(a)

# 오름차순
a.sort()
print(a)

a.clear()
print(a)
```

```
[] []
<class 'list'> <class 'list'>
[1, 2, 3, 4, 5] 1
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[1, 2, 3, 7, 4, 5, 6]
[1, 2, 3, 7, 4, 5]
[1, 2, 3, 4, 5]
[1, 2, 3, 5]
3
==============================
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
55
10
1
3
[6, 5, 1, 10, 4, 8, 2, 7, 3, 9]
[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[]
```

---

### 리스트와 내장함수(2)

```python
a=[23,12,36,53,19]
print(a[:3])
print(a[1:4])
print(len(a))

for i in range(len(a)):
    print(a[i], end=' ')
print()

for x in a:
    print(x, end=' ')
print()

for x in a:
    if x%2==1:
        print(x, end=' ')
print()

# x가 tuple로 반환됨
for x in enumerate(a):
    print(x)

b=(1,2,3,4,5)
print(b[0])
# error. tuple은 변경이 불가능, 리스트는 변경 가능
# b[0]=7

b=[1,2,3,4,5]
b[0]=7
print(b)

for x in enumerate(a):
    print(x[0], x[1])
print()

for index, value in enumerate(a):
    print(index, value)
print()

print("============================")

# a를 for문으로 돌면서 조건에 모두 참이면 true 반환
if all(60>x for x in a):
    print("YES")
else:
    print("NO")

# a를 for문으로 돌면서 조건에 하나라도 참이면 true 반환
if any(15>x for x in a):
    print("YES")
else:
    print("NO")
```

```
[23, 12, 36]
[12, 36, 53]
5
23 12 36 53 19
23 12 36 53 19
23 53 19
(0, 23)
(1, 12)
(2, 36)
(3, 53)
(4, 19)
1
[7, 2, 3, 4, 5]
0 23
1 12
2 36
3 53
4 19

0 23
1 12
2 36
3 53
4 19

============================
YES
YES
```

---

### 2차원 리스트 생성과 접근

```python
a=[0]*3
print(a)

# 변수없이 반복문 3번 실행
# for _ in range(3)

# 2차원 리스트 -> 표로 표현하는게 좋다
# [0]*3 을 3번 반복
a=[[0]*3 for _ in range(3)]
print(a)
print()

a[0][1]=1
print(a)
print()

a[1][1]=2
print(a)
print()

for x in a:
    print(x)

for x in a:
    for y in x:
        print(y, end=' ')
    print()
```

```
[0, 0, 0]
[[0, 0, 0], [0, 0, 0], [0, 0, 0]]

[[0, 1, 0], [0, 0, 0], [0, 0, 0]]

[[0, 1, 0], [0, 2, 0], [0, 0, 0]]

[0, 1, 0]
[0, 2, 0]
[0, 0, 0]
0 1 0
0 2 0
0 0 0
```

---

### 함수만들기

```python
# 함수는 항상 메인 스크립트 위에 생성해야 함
def add(a, b):
    c = a+b
    return c

x = add(3,2)
print(add(3,2))
print(x)

print("==========================")

# 함수에서 여러개의 값을 return 할 수 있다
# 튜플로 return 됨
def cal(a, b):
    c=a+b
    d=a-b
    return c, d

print(cal(3,2))

print("==========================")

# 소수면 true 반환
def isPrime(x):
    for i in range(2,x):
        if x%i==0:
            return False
    return True

arr=[12, 13, 7, 9, 19]
for a in arr:
    if isPrime(a):
        print(a, end=' ')
```

```
5
5
==========================
(5, 1)
==========================
13 7 19
```

---

### 람다함수

```python
def plus_one(x):
    return x+1
print(plus_one(1))

plus_two=lambda x: x+2
print(plus_two(1))

a=[1, 2, 3]
# map(함수명, 인자)
# map(int, a)
print(list(map(plus_one, a)))
print(list(map(lambda x: x+1, a)))
```

```
2
3        
[2, 3, 4]
[2, 3, 4]
```

---

### 숫자, 문자열 역순
```python
# 숫자 역순 할 때 사용
def reverse(x):
    res = 0
    while x > 0:
        t = x % 10
        res = res * 10 + t
        x = x//10
    return res

# 숫자와 문자열 역순 할 때 사용
def reverse(x):
    x = list(str(x))
    x.reverse()
    x = ''.join(x)

    return int(x)
```

---

## 소수 관련

### 소수를 구하는 방법 (에라토스테네스의 체)
```python
# 소수를 구하는 방법은 다양하게 있으나 가장 빠른 방법은 에라토스테네스 체

# 받은 입력만큼의 크기를 가진 리스트를 만든다
ch=[0]*(n+1)

# 소수인 경우 카운트를 할 변수 초기화
cnt=0

# 소수의 갯수를 구하기 위해 2부터 n까지 for문을 실행
for i in range(2, n+1):
		# ch[i]가 0이면 소수
    if ch[i] == 0:
        cnt += 1
				# ch[j]의 배수를 모두 1로 초기화
        for j in range(i, n+1, i):
            ch[j] = 1
```

![Untitled](https://user-images.githubusercontent.com/79130276/167248339-a45d976f-d833-4a3c-ad01-51a7d6acc363.png)

[에라토스테네스의 체]

1. 1은 제거

2. 지워지지 않은 수 중 제일 작은 2를 소수로 채택하고, 나머지 2의 배수를 모두 지운다.

3. 지워지지 않은 수 중 제일 작은 3을 소수로 채택하고, 나머지 3의 배수를 모두 지운다.

4. 지워지지 않은 수 중 제일 작은 5를 소수로 채택하고, 나머지 5의 배수를 모두 지운다.

5. (반복)

<br>

### 소수 판별

```python
def isPrime(x):
    if x == 1:
        return False
    for i in range(2, x//2+1):
        if x%i == 0:
            return False
    else:
        return True
```

---

## 내장 함수

### itertools (순열, 조합)

```python
from itertools import combinations, combinations_with_replacement

arr = [1,2,3]

for a in combinations(arr, 2):
    print(a)

print("=========")

for a in combinations_with_replacement(arr, 2):
    print(a)

# (1, 2)
# (1, 3)
# (2, 3)
# =========
# (1, 1)
# (1, 2)
# (1, 3)
# (2, 2)
# (2, 3)
# (3, 3)
```

### collections

```python
from collections import Counter

# 가장 흔한 값
arr = [1,4,5,6,3,2,4,5,6,1,1,4,5]
counts = Counter(arr)
res = counts.most_common(2)
print(res)
print(res[0][0], res[0][1])
print(res[1][0], res[1][1],)
# [(1, 3), (4, 3)]
# 1 3
# 4 3
```