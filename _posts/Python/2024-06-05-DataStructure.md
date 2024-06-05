---
title: "파이썬 자료구조"
categories:
  - Python
tags:
  - Algorithm
  - DataStructure
toc: true
toc_sticky: true
---

## 해시

파이썬에서 `해시(Hash)`는 딕셔너리(dictinary, dict)라는 자료구조로 구현할 수 있다.

```python
# dict = {key(키) : value(값)}
dict = {'apple' : 3, 'banana' : 4}
```

해시는 인덱스 값을 숫자가 아닌 다른 값으로 사용하려고 할 때나, 빠른 접근과 탐색이 필요할 때 사용하면 좋다.

딕셔너리는 리스트에 비해 빠른 시간 복잡도를 가지고 있기 때문에 원소를 추가, 삭제 등이 많을 때에는 딕셔너리를 사용하는 것이 효율적이다.

### get() 메서드

딕셔너리에서 원소를 가져오는 방법이다.

```python
get(key) # 딕셔너리에 key에 해당하는 value 값을, 없으면 None을 반환.
get(key, x) # 딕셔너리에 key 값이 없는 경우, x를 반환함.
```

**예제 코드**

```python
nums = [3,4,5]
d = {3: 2, 1: 1, 2: 1}
for n in nums:
    print(d.get(n))
print(d)

# 결과값
# 2
# None
# None
```

```python
nums = [3,1,2,3]
d = {}
for n in nums:
    print(d.get(n))
    # d.get(n, 0): d에 n값이 없으면 0을 반환함
    d[n] = d.get(n, 0) + 1
print(d)

# 결과값
# {3: 2, 1: 1, 2: 1}
```

### 해시 for문 조회

```python
d = {3: 2, 1: 1, 2: 1}
for key, value in d.items():
    print(key, value)
```

```python
dict = {'apple' : 3, 'banana' : 0}
    result = [k for k, v in dict.items() if v == 0]
    print(result)
# 결과값
# ['banana']
```

```python
clothes = [["yellow_hat", "headgear"], ["blue_sunglasses", "eyewear"], ["green_turban", "headgear"]]
d = {}
for name, key in clothes:
    if d.get(key):
        d[key] += [name]
    else:
        d[key] = [name]
print(d)
# 결과값
# {'headgear': ['yellow_hat', 'green_turban'], 'eyewear': ['blue_sunglasses']}
```

```python

```