---
title:  "파이썬 알고리즘"
# last_modified_at: 2022-05-06T17:11:00
# last_modified_at: 2022-05-07T18:30:00
# last_modified_at: 2022-05-09T11:15:00
# last_modified_at: 2022-05-16T15:50:00
# last_modified_at: 2022-05-19T16:30:00
last_modified_at: 2022-05-22T20:00:00
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

# 숫자면 true, 아니면 false
isdecimal()
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

# 한 숫자의 모든 배수에 접근할 때는 range(start, end, start)

# (i=i+1) == (i+=1)

# for ~ else 구문: for문이 모두 실행된 후 else 실행
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
if any(15 > x for x in a):
    print("YES")
else:
    print("NO")

# Q: 리스트안에 튜플이 있는 형태
any(cur[1] < x[1] for x in Q)
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

### 리스트와 튜플

```python

a = [(0, 1), (1, 4), (5, 9), (3, 8), (4, 3)]

# 정렬방법
# 튜플의 첫번째 값을 기준으로 정렬
a.sort()
# [(0, 1), (1, 4), (3, 8), (4, 3), (5, 9)]

# 튜플의 두번째 값을 기준으로 정렬
a.sort(key=lambda x: (x[1], x[0]))
# [(0, 1), (4, 3), (1, 4), (3, 8), (5, 9)]

# 리스트를 받아오는 동시에 튜플의 첫번째는 인덱스, 두번째는 값을 가져오는 법
# input(): 60 50 70 80 90
Q = [(pos, val) for pos, val in enumerate(list(map(int, input().split())))]
# [(0, 60), (1, 50), (2, 70), (3, 80), (4, 90)]
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

<br>

## 알고리즘 종류

### 그리디 알고리즘

문제를 풀어나가는 과정(단계)에 있어서 그 순간에 최적이라고 생각되는 것을 선택해 나가는 방식으로 진행하여 최종적인 해답에 도달하는 것
보통의 그리디 문제는 다 `정렬`이다. 정렬 후 순서대로 선택해 나가면 됨

<br>

## 자료구조

### 리스트(List)

* 정의

    리스트는 자료를 뒤에서 부터 넣을 수 있고 만약 처음 데이터를 삭제한다면 자료가 하나씩 앞당겨 지는 것

    → 비효율적이다

* 평균 시간복잡도: O(n)

<br>

### 스택(Stack)

* 리스트와 같다 (FILO)

* append(), pop() 활용

* 활용: 후위표기식 등

* 후위표기식

    1. '(': 나오면 바로 스택에 push한다.
    2. ')': 우선순위가 가장 높은 괄호연산자가 끝난다는 뜻이므로, 괄호 안에 남아있는 연산자를 전부 pop하고 '('도 pop해줌. ')'는 처음부터 스택에 넣지 않는다.
    3. '\*', '/': 스택에 '\*', '/'가 있다면 그것들을 먼저 없어질 때까지 pop해주고 끝나면 push한다. ('+','-'은 우선순위가 낮으므로 pop안함)
    4. '+', '-': 스택에 다른 사칙연산자가 있다면 그것들을 먼저 없어질 때까지 (괄호연산자 직전가지)pop해주고 끝나면 push한다.

<br>

### 덱(Double-ended Queue, Double-linked list)

* 정의

    **양 끝**에 elements 추가/삭제 가능

    데크는 리스트와 달리 앞에서도 넣을 수 있고 뒤에서도 넣을 수 있다

    만약 처음 데이터를 삭제하더라도 자료가 이동하지 않는다 (포인터가 변경되는 것이라 생각)

    → 즉, 효율적이다!

* 평균 시간복잡도: O(1)

* deque 주요 함수
    * append()
    * appendleft()
    * pop()
    * popleft()

참고) deque의 appendleft() 대신 List는 insert()가 있는데 O(n)의 시간 복잡도이다.

<br>

### 큐(Queue): FIFO

큐를 앞뒤로 활용한 것이 deque(덱)

deque를 사용해서 풀이: popleft(), append() 사용

원형 큐는 원형인 점을 고려하여 popleft() 후 마지막에 다시 append() 해줌...

<br>

참고) 아래 그림은 덱과 리스트의 차이를 보여줌

![Untitled](https://user-images.githubusercontent.com/79130276/168561151-6f71781a-2fe4-45af-aa0e-b38a761416c0.png)
![Untitled2](https://user-images.githubusercontent.com/79130276/168561157-76aee83b-b4b2-4f34-a616-6db0b8b5504b.png)

<br>

### 이분/이진 탐색 (binary search)

* 이진 탐색을 하기 위한 전제 조건: 리스트가 정렬되어 있어야 함
* 이진 탐색 순서
	1. 탐색 리스트를 정렬
	2. left(0), right(len(list)), mid((left + right) // 2) 설정
	3. mid 값과 찾고자 하는 값 비교
	4. mid 값이 더 크면 right = mid - 1, mid 값이 더 작으면 left = mid + 1
	5. left <= right 조건이 만족할 때까지 반복
* 이진 탐색 시간복잡도: 탐색 사이즈가 계속 1/2씩 줄어들기 때문에 시간복잡도가 O(logN)

<br>

### 이진트리순회(깊이우선탐색)

1. 전위순회: 부모-왼쪽-오른쪽
2. 중위순회: 왼쪽-부모-오른쪽
3. 후위순회: 왼쪽-오른쪽-부모

대부분의 문제는 전위순회가 대부분. 후위순회는 병합정렬이 대표적, 중위순회를 사용하는 경우는 많지 않다.

코드를 작성할 때 부모가 D(i)이라 한다면, 왼쪽 자식은 D(i*2), 오른쪽 자식은 D(i*2+1)

```python
import sys
sys.stdin=open("input.txt", "r")

def DFS(v):
    if v > 7:
        return
    else:
        # 전위순회방식
        print(v)
        DFS(v * 2)
        # 중위순회방식
        print(v)
        DFS(v * 2 + 1)
        # 후위순회방식
        print(v)

if __name__=="__main__":
    DFS(1)
```

<br>