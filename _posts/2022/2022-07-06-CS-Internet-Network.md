---
title:  "IP, TCP, Port, DNS"
last_modified_at: 2022-07-06T17:50:00
categories: 
  - HTTP
tags:
  - HTTP
toc: true
toc_label: "Index"
toc_sticky: true
---

# 인터넷 네트워크

### 1. 인터넷 통신

인터넷에서 클라이언트와 서버는 어떻게 통신할까?

클라이언트와 서버의 통신은 복잡한 인터넷 망(중간 노드라는 서버들)을 거쳐서 보낸다. 복잡한 인터넷 망에서 데이터를 안전하게 전송하기 위한 방법을 생각해야 한다. 그것을 이해하기 위해 먼저 IP에 대해 알아보자.

<br>

### 2. IP (Internet Protocol, 인터넷 프로토콜, IP 프로토콜)

*지정한 주소로 메시지를 전달할 수 있도록 클라이언트와 서버에 IP 주소를 부여함*

![Untitled](https://user-images.githubusercontent.com/75964737/177511215-31b0e8c6-fba3-4b9f-a7fc-517bd04aad38.png)

<br>

**IP 역할**

- 지정한 IP 주소(IP Address)에 데이터 전달
- 패킷(Packet)이라는 통신 단위로 데이터 전달

<br>

→ 패킷이란? pakage + bucket 의 합성어

<br>

**IP 패킷 정보**

- 출발지 IP
- 목적지 IP
- 전송 데이터
- 기타

<br>

클라이언트와 서버 사이에 있는 인터넷 망은 수많은 노드로 구성되어 있음

그 중에서 목적지 IP로 갈 수 있는 노드들을 통해 데이터가 전송됨

<br>

클라이언트와 서버의 패킷 전달 경로는 서로 다를 수 있다

<br>

**IP 프로토콜의 한계**

- 비연결성: 패킷을 받을 대상이 없거나 서비스 불능 상태여도 패킷 전송. 클라이언트는 서버가 패킷을 받을 수 있는 상태인지 모르고 서버가 서비스 불능상태여도 일단 패킷을 전송하고 사라짐
- 비신뢰성: 중간에 패킷이 사라질 수 있음.
    - 중간에 보내는 노드(서버)가 꺼지거나 문제가 생기면 패킷이 유실되는데, 소실된지 모른다
    - 패킷이 순서대로 오지 않을 수 있다
        - 메시지가 너무 크면 끊어서 보냄 (보통 1500byte)
        - 예) 클라이언트 1:Hello, 2:World → 서버 1. World, 2. Hello
- 프로그램 구분: 같은 IP를 사용하는 서버에서 통신하는 애플리케이션이 2개 이상이면 구분이 불가능함
    - 내가 음악이랑, 게임 둘다 하고 있는데 이 패킷들을 어떻게 구분 할까?

<br>

### 3. TCP, UDP

IP의 한계를 해결해주기 위해 TCP랑 UDP가 있는 것이다. 

***TCP**는 패킷소실을 방지해주고, 패킷 순서를 보장해준다. TCP와 달리 **UDP**는 패킷 소실 방지, 패킷 순서 보장을 해주는 것은 아니라 크게 도움이 되진 않지만, 그래도 문제를 해결해준다.*

<br>

**TCP와 UDP**는 `PORT`가 있다. IP 프로토콜엔 Port가 없다. 음악이랑 게임하는데 두 패킷을 구분하기 위해서 필요한게 PORT이다.

![Untitled2](https://user-images.githubusercontent.com/75964737/177511198-7ee2b9c7-4cc9-4574-91c6-c25c9af34df3.png)

![Untitled3](https://user-images.githubusercontent.com/75964737/177511205-519590f9-8ebc-4ae7-8c32-952ee2639d83.png)

예시. 채팅 프로그램

Hello, world! 라는 메시지를 전송하고 싶다면, 

1. Hello, world! 메시지 생성
2. SOCKET 라이브러리를 사용해서 OS 계층에 메시지를 넘긴다
3. OS 계층의 TCP가 메시지에 TCP의 정보 씌운다
4. TCP 정보에 IP정보를 씌운다 → IP 패킷 생성, TCP 데이터 포함
5. LAN카드로 서버에 보냄(Ethernet frame)

<br>

**TCP/IP 패킷 정보**

IP 내용: 출발지 IP, 목적지 IP, 기타

TCP 내용: 출발지 PORT, 목적지 PORT, 전송제어, 순서, 검증 정보

<br>

**TCP(Transmission Control Protocol, 전송 제어 프로토콜) 특징**

전송을 어떻게 할지 제어하는 것. 신뢰할 수 있는 프로토콜. 현재는 대부분 TCP를 사용함

- 연결지향 - TCP 3way handshake(가상 연결)
    - 서버와 클라이언트가 연결이 되어있는지 확인하는 것
    - 가상 연결 뜻: 물리적 연결이 아닌 논리적 연결, 클라이언트랑 서버랑 `syn -ack`을 보내면서 연결이 되어있나보다 하는 것
- 데이터 전달 보증
    - 메시지를 보냈는데 패킷이 누락이 되면 알 수 있음
- 순서 보장
    - 패킷을 보냈는데 순서가 틀리면 다 버리고 다시 보낸다
    - 예) 패킷 1, 2, 3 을 보냈는데 전송 도착이 1, 3, 2라고 하면 2번째 패킷부터 순서가 틀렸기 때문에 2번부터 다시 받음
- 신뢰할 수 있는 프로토콜
- 현재는 대부분 TCP 사용

<br>

**TCP 3way handshake**

![Untitled4](https://user-images.githubusercontent.com/75964737/177511208-a92353d8-154e-496a-97b0-e342951ab0e6.png)

1. 클라이언트에서 서버로 SYN 보냄
2. 서버에서 클라이언트로 SYN+ACK 보냄
3. 클라이언트에서 서버로 ACK 보냄
4. 클라이언트에서 서버로 데이터 전송

1,2,3: connect 과정

(SYN: 접속 요청, ACK: 요청 수락)

<br>

**UDP(User Datagram Protocol, 사용자 데이터그램 프로토콜) 특징**

- 하얀 도화지 (기능이 거의 없음)
- 연결지향 - TCP 3way handshake X
- 데이터 전달 보증 X
- 순서 보장 X
- 데이터 전달 및 순서가 보장되지 않지만, 단순하고 빠름
- IP와 거의 같고 PORT, 체크섬 정도만 추가, 애플리케이션에서 추가 작업 필요

<br>

> **참고** 
**체크섬:** 이 메세지가 맞는지 검증하는 용도, 네트워크를 통해 전달된 값이 변경되었는지를 검사하는 값으로 무결성을 제공함
> 

<br>

### 4. PORT

***PORT**는 클라이언트에서 한번에 둘 이상의 서버와 연결할 때 구분하기 위해 사용*

![Untitled5](https://user-images.githubusercontent.com/75964737/177511210-ff56c8bf-8324-4075-b65a-6a975c742659.png)

<br>

**TCP/IP 패킷 정보**에는 출발지 PORT, 목적지 PORT가 포함되어 있음

`IP + PORT = TCP`

<br>

좋은 예

- IP: 아파트
- Port: 동, 호수

<br>

- 0~65535 할당 가능
- 0~1023 잘 알려진 포트, 사용하지 않는 것이 좋음
    - FTP - 20, 21
    - TELNET - 23
    - HTTP - 80
    - HTTPS - 443

<br>

### 5. DNS (Domain Name System)

IP는 기억하기 어렵고 변경될 수 있다

- 전화번호부
- 도메인 명을 IP 주소로 변환

![Untitled6](https://user-images.githubusercontent.com/75964737/177511212-e3cf0534-50a6-45e2-8817-1f6a7ce66935.png)

<br>

### 정리

인터넷 통신을 하기 위해서 IP를 통해 출발지 IP, 목적지 IP, 메시지를 보내려고 한다. 그런데 IP 프로토콜만으로는 메세지가 잘 도착했는지 신뢰(패킷 순서, 패킷 소실 등) 하기 어렵다.

이러한 IP의 한계를 극복하기 위해 TCP 도입, Port로 같은 IP안에서 동작하는 애플리케이션을 구분해준다. UDP는 IP와 비슷한데 Port가 추가됐고 필요하면 애플리케이션에서 기능 확장이 가능하다.

IP 주소는 변경될 수 있고 기억하기 어렵기 때문에 DNS를 사용한다.