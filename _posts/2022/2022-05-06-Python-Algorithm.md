---
layout: post
title: "파이썬 알고리즘"
date: 2022-05-22 20:00:00
categories: [Algorithm]
tags:
  - Python
  - Algorithm
author: "유자"
---

## 시간복잡도

[파이썬 기본함수에 대한 시간복잡도](https://wiki.python.org/moin/TimeComplexity)

![pasted image 0](https://user-images.githubusercontent.com/79130276/232639109-07339104-0ea9-4454-8112-e6f4b1afe26d.png)

### 알고리즘 수행 시간

코드의 수행 횟수란 말 그대로 해당 코드가 몇 번 수행 됐는지 횟수를 나타낸다.

아래 코드에서 CODE 1의 수행 횟수는 n번이다. 그리고 수행 횟수를 다항식으로 나타내었을 때 최고차항의 차수는 1이다.

```python
for _ in range(n):
    print(n) # CODE 1
```

아래 코드에서 CODE 1의 수행 횟수는 n*n번이다. 그리고 수행 횟수를 다항식으로 나타내었을 때 최고차항의 차수는 2이다.

```python
for _ in range(n):
    for _ in range(n):
        print(n) # CODE 1
```

## 변수 입/출력

### 입력방식

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
print(a+b, a-b, a*b)
print(a/b) # 나누기
print(a//b) # 나누기의 몫
print(a%b) # 나누기의 나머지
print(a**b) # 제곱근
# <class 'int'>
# 5 -1 6
# 0.66666666666
# 0
# 2
# 8

# 리스트로 입력 받기
a = list(map(int, input().split()))

a = list(int(input()) for _ in range(n))

# 입력받아야 하는 값이 몇개인지 모를 때
import sys
s = sys.stdin.readlines()
for i in s:
    print(i.strip())
```

대량의 데이터를 입력받는 상황에서는 input() 보다는 sys.stdin.readline()을 사용해야 시간초과가 발생하지 않는다.

```python
import sys

T = int(input())
for _ in range(T):
        a,b = map(int, sys.stdin.readline().split())
        print(a+b)
```

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

문자열 출력 시 format(), %d 사용하기

```python
print('{} * {} = {}'.format(4, 3, 12))
# 4 * 3 = 12
print('%d * %d =' %(3, 2), 6)
# 3 * 2 = 6
```



### 연산자

```python
a=4.3
b=5
print(type(c))
print(c)
# <class 'float'> # 실수형과 정수형을 더하면 실수형으로 나옴, 범위: 실수형>정수형
# 9.3

# 숫자면 true, 아니면 false
isdecimal()

# 값 비교하여 더 큰 값을 return
largest = 20
tmp = 30
largest = max(largest, tmp)
# largest = 30

tmp = 10
largest = max(largest, tmp)
# largest = 30
```

**소숫점 출력**

format을 이용한다. 소숫점 4번째 자리에서 반올림을 해서 3자리까지 출력을 하겠다는 뜻이다.

```python
x = 57.1434444
print("{:.3f}%".format(x))
# 57.143%
```

### 문자열

```python
s = ' dsjlkdjfk lsf '
# 문자열 양 옆의 공백 삭제
s = s.strip()
# dsjlkdjfk lsf

# 문자열 공백으로 분리
s = s.split(' ')
# ['dsjlkdjfk', 'lsf']

word = 'happy'
word.count('p')
# 2
word.count('1')
# 0
```

### 조건문

if A in B 구문은 B에 값들 중에 A가 있는지 확인하는 것이다.
```python
data = 'UNUCIC'
alphabet = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ']

result = 0
for i in range(len(data)):
    for a in alphabet:
        if data[i] in a:
            result += alphabet.index(a) + 3
print(result)
```

### 특수문자

파이썬에서 특수문자인 \, ", ' (순서대로 백슬래시, 큰따옴표, 작은따옴표)를 출력하기 위해선 해당 문자 앞에 \(백슬래시)를 붙여야 한다.

```python
print(" \\ \" \' ")
# \ " '
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

### 딕셔너리

알파벳의 개수를 구하기 위해 딕셔너리를 사용했다.

```python
s = 'Mississipi'.upper()
data = {}
for x in s:
    if x in data:
        data[x] += 1
    else:
        data[x] = 1
# {'M': 1, 'I': 4, 'S': 4, 'P': 1}
```

딕셔너리에서 가장 큰 값을 구할 때 (최대 값이 2개 이상일 때)

```python
data = {'M': 1, 'I': 4, 'S': 4, 'P': 1}

# 리스트 컴프리핸션 사용
tmp = [k for k,v in a.items() if max(a.values()) == v]
print(tmp)
# ['I', 'S']
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

# 10*10 배열
a = [[0] * 10 for _ in range(10)]

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

# 특정 구간을 역순으로 넣고 싶을 때
a = [1, 2, 3, 4, 5]
temp = a[1:4]
temp.reverse()
a[1:4] = temp
# a = [1, 4, 3, 2, 5]

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

## 진법 변환

### N진법 -> 10진법 변환

```python
# int(변환할 String, N진법)
# 'ZZZZZ' 문자를 36진법으로 변경
int('ZZZZZ', 36)
```

### 10진법 -> N진법 변환

```python
# n: 10진법 수, b: N진법
n = 60466175
b = 36
tmp = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

answer = ''
while n != 0:
    answer += str(tmp[n % b])
    n = n // b
print(answer[::-1])
```

## 알파벳

함수를 사용해서 알파벳을 자동 생성하는 방법

```python
from string import ascii_lowercase
alphabet = list(ascii_lowercase)
```

## 소수 관련

### 소수를 구하는 방법 (에라토스테네스의 체)
```python
# 소수를 구하는 방법은 다양하게 있으나 가장 빠른 방법은 에라토스테네스 체

# 받은 입력만큼의 크기를 가진 리스트를 만든다
ch = [0] * (n + 1)

# 소수인 경우 카운트를 할 변수 초기화
cnt = 0
# 소수의 갯수를 구하기 위해 2부터 n까지 for문을 실행
for i in range(2, n + 1):
	# ch[i]가 0이면 소수
    if ch[i] == 0:
        cnt += 1
		
        # ch[j]의 배수를 모두 1로 초기화
        for j in range(i, n + 1, i):
            ch[j] = 1
```

![Untitled](https://user-images.githubusercontent.com/79130276/167248339-a45d976f-d833-4a3c-ad01-51a7d6acc363.png)

[에라토스테네스의 체]

1. 1은 제거

2. 지워지지 않은 수 중 제일 작은 2를 소수로 채택하고, 나머지 2의 배수를 모두 지운다.

3. 지워지지 않은 수 중 제일 작은 3을 소수로 채택하고, 나머지 3의 배수를 모두 지운다.

4. 지워지지 않은 수 중 제일 작은 5를 소수로 채택하고, 나머지 5의 배수를 모두 지운다.

5. (반복)

### 소수 판별

아래 함수를 이용하면 소수인지 판별할 수 있다. (시간 복잡도 O(n))

```python
def isPrime(x):
    for i in range(2, x):
        if x % i == 0:
            return False
    return True
```

그런데 아래와 같은 식으로도 가능하다. 위의 코드와 아래의 코드의 차이점은 for문은 x 중간값까지만 돌린다는 것이다. 이렇게 하는 이유는 약수의 특성을 이용한 것이다. 약수의 특성을 이용하여 이 연산의 횟수를 반으로 줄일 수 있다.

16을 예로 들면 16의 약수는 1, 2, 4, 8, 16 이다. 중간값인 4를 기준으로 한 쪽만 검사해도 다른 쪽의 약수를 알 수 있다.

따라서, for문의 범위를 2 부터 x//2+1 까지 돌린 것이다. 시간 복잡도가 짧은 아래 코드를 사용하는 것을 권장한다.

```python
def isPrime(x):
    if x == 1:
        return False
    for i in range(2, (x // 2) + 1):
        if x % i == 0:
            return False
    else:
        return True
```

## 소인수분해

소인수란 소수인 인수들을 뜻한다.

소인수 분해는 1보다 큰 자연수를 소인수들만의 곱으로 나타내는 것이다.

```python
n = int(input())
prime = []
i = 2

while i <= n:
    if n % i == 0:
        prime.append(i)
        n = n // i
    else:
        i += 1

for p in prime:
    print(p)
```

## 최대 공약수, 최소 공배수

유클리드 알고리즘을 사용해서 최대공약수를 구할 수 있다. 유클리드 알고리즘은 두 수의 최대공약수를 구하는 알고리즘으로 큰 수를 작은 수로 나누어 나머지를 구하고 나머지가 0이 아니면 작은 수를 나머지로, 나머지가 0이면 그 때의 작은 수가 두 수의 최대공약수이다.

최소 공배수는 두 수의 곱을 최대공약수로 나눈 값이다.

```python
n1, n2 = 24, 18
# 유클리드 알고리즘을 사용하여 최대공약수를 구함
a, b = n1, n2
while b != 0:
    a, b = b, a % b
gcd = a

# 최소공배수를 구함
lcm = n1 * n2 // gcd

print(gcd)
print(lcm)
```

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

from itertools import product
a = ['A', 'B']
for i in product(a, repeat=3):
	print(i)

'''
출력결과:
('A', 'A', 'A')
('A', 'A', 'B')
('A', 'B', 'A')
('A', 'B', 'B')
('B', 'A', 'A')
('B', 'A', 'B')
('B', 'B', 'A')
('B', 'B', 'B')
'''
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

## 자료구조

### 리스트(List)

* 정의

    리스트는 자료를 뒤에서 부터 넣을 수 있고 만약 처음 데이터를 삭제한다면 자료가 하나씩 앞당겨 지는 것

    → 비효율적이다

* 평균 시간복잡도: O(n)

### 스택(Stack)

* 리스트와 같다 (FILO)

* append(), pop() 활용

* top()은 stack[-1]로 확인

* 활용: 후위표기식 등

* 후위표기식

    1. '(': 나오면 바로 스택에 push한다.
    2. ')': 우선순위가 가장 높은 괄호연산자가 끝난다는 뜻이므로, 괄호 안에 남아있는 연산자를 전부 pop하고 '('도 pop해줌. ')'는 처음부터 스택에 넣지 않는다.
    3. '\*', '/': 스택에 '\*', '/'가 있다면 그것들을 먼저 없어질 때까지 pop해주고 끝나면 push한다. ('+','-'은 우선순위가 낮으므로 pop안함)
    4. '+', '-': 스택에 다른 사칙연산자가 있다면 그것들을 먼저 없어질 때까지 (괄호연산자 직전가지)pop해주고 끝나면 push한다.


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

### 큐(Queue): FIFO

큐를 앞뒤로 활용한 것이 deque(덱)

deque를 사용해서 풀이: popleft(), append() 사용

원형 큐는 원형인 점을 고려하여 popleft() 후 마지막에 다시 append() 해줌...

참고) 아래 그림은 덱과 리스트의 차이를 보여줌

![Untitled](https://user-images.githubusercontent.com/79130276/168561151-6f71781a-2fe4-45af-aa0e-b38a761416c0.png)
![Untitled2](https://user-images.githubusercontent.com/79130276/168561157-76aee83b-b4b2-4f34-a616-6db0b8b5504b.png)

### 이분/이진 탐색 (binary search)

* 이진 탐색을 하기 위한 전제 조건: 리스트가 정렬되어 있어야 함
* 이진 탐색 순서
	1. 탐색 리스트를 정렬
	2. left(0), right(len(list)), mid((left + right) // 2) 설정
	3. mid 값과 찾고자 하는 값 비교
	4. mid 값이 더 크면 right = mid - 1, mid 값이 더 작으면 left = mid + 1
	5. left <= right 조건이 만족할 때까지 반복
* 이진 탐색 시간복잡도: 탐색 사이즈가 계속 1/2씩 줄어들기 때문에 시간복잡도가 O(logN)

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

### 그리디 알고리즘

문제를 풀어나가는 과정(단계)에 있어서 그 순간에 최적이라고 생각되는 것을 선택해 나가는 방식으로 진행하여 최종적인 해답에 도달하는 것
보통의 그리디 문제는 다 `정렬`이다. 정렬 후 순서대로 선택해 나가면 됨
