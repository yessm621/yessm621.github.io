---
title: "Dispatch Queue"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - Dispatch Queue
---

## Dispatch Queue
- 쓰레드를 여러개 만들어서 관리한다.  

## 쓰레드
메인쓰레드  
~~~
    @IBAction func action1(_ sender: Any) {
        simpleClosure {
            finishLabel.text = "끝"
        }
    }
    
    func simpleClosure(completion: () -> Void) {
        
        for index in 0..<10 {
            Thread.sleep(forTimeInterval: 0.1)
            print(index)
        }
        
        completion()
    }
~~~
이렇게 작성을 하면 메인쓰레드을 사용해가지고, 다른 작업을 못할수도있다.(쓰레드가 할 일이 너무 많이 때문에)  
하지만 이럴떄 쓰레드를 하나 더 추가해주면 된다.(쓰레드는 일꾼같은 느낌이다.)  

쓰레드를 하나 더 추가해 주려면,  
~~~
    @IBAction func action1(_ sender: Any) {
        simpleClosure {
            self.finishLabel.text = "끝"
        }
    }
    
    func simpleClosure(completion: @escaping () -> Void) {
        
        DispatchQueue.global().async {
            for index in 0..<10 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
        
            DispatchQueue.main.async {
                completion()
            }
        }
    }
~~~
또는,  
~~~
    @IBAction func action1(_ sender: Any) {
        simpleClosure {
            DispatchQueue.main.async {
                self.finishLabel.text = "끝"
            }
        }
    }
    
    func simpleClosure(completion: @escaping () -> Void) {
        
        DispatchQueue.global().async {
            for index in 0..<10 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
                completion()
        }
    }
~~~
이런 방식으로 사용할 수도 있다.  
쓰레드의 개념을 좀 더 살펴보면,  
~~~
    @IBAction func action2(_ sender: Any) {
        
        let dispatchGroup = DispatchGroup()
        
        let queue1 = DispatchQueue(label: "q1")
        
        queue1.async(group: dispatchGroup) {
            for index in 0..<10 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
        }
        
        queue1.async(group: dispatchGroup) {
            for index in 10..<20 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
        }
        
        queue1.async(group: dispatchGroup) {
            for index in 20..<30 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
        }  
        
    }
~~~
를 살펴보면 원래 async가 있어서 바로바로 실행이 되어야 하지만,  
queue1이라는 한 쓰레드 안에서 작동되기 때문에 sync로 작동이 되는 것이다.  
만약에, 바로바로 실행시키려면 쓰레드를 추가하면 된다.  
~~~
    @IBAction func action2(_ sender: Any) {
        
        let dispatchGroup = DispatchGroup()
        
        let queue1 = DispatchQueue(label: "q1")
        let queue2 = DispatchQueue(label: "q2")
        let queue3 = DispatchQueue(label: "q3")
        
        queue1.async(group: dispatchGroup) {
            for index in 0..<10 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
        }
        
        queue2.async(group: dispatchGroup) {
            for index in 10..<20 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
        }
        
        queue3.async(group: dispatchGroup) {
            for index in 20..<30 {
                Thread.sleep(forTimeInterval: 0.2)
                print(index)
            }
        }
    }
~~~
이렇게 작동하면 쓰레드가 3개가 되어서 각각 작동하는걸 볼 수 있다.  
하지만, 만약에 이 쓰레드3개가 끝나는 시점을 알고 싶다면 어떻게해야 할까? 그건 바로 dispatchGroup를 사용하면된다.  
~~~
        dispatchGroup.notify(queue: DispatchQueue.main){
            print("끝")
        }
~~~
.notify라는 메서드가 이제 위의 3개의 쓰레드가 각각 끝이 났으면 작동되는 메서드이다.  
하지만, 이렇게 쓰레드안에 쓰레드를 넣으면 어떻게 작동될까?  
~~~
    @IBAction func action2(_ sender: Any) {
        
        let dispatchGroup = DispatchGroup()
        
        let queue1 = DispatchQueue(label: "q1")
        let queue2 = DispatchQueue(label: "q2")
        let queue3 = DispatchQueue(label: "q3")
        
        queue1.async(group: dispatchGroup) {
            DispatchQueue.global().async {
                for index in 0..<10 {
                    Thread.sleep(forTimeInterval: 0.2)
                    print(index)
                }
            }
        }
        
        queue2.async(group: dispatchGroup) {
            DispatchQueue.global().async {
                for index in 0..<10 {
                    Thread.sleep(forTimeInterval: 0.2)
                    print(index)
                }
            }
        }
        
        queue3.async(group: dispatchGroup) {
            DispatchQueue.global().async {
                for index in 0..<10 {
                    Thread.sleep(forTimeInterval: 0.2)
                    print(index)
                }
            }
        }

        dispatchGroup.notify(queue: DispatchQueue.main){
            print("끝")
        }
        
    }
~~~
이렇게 하면 일단, "끝"부터나오고 쓰레드들이 작동이 된다.  
그 이유는 일단 쓰레드가 작동이 되고, 그안에 다른쓰레드가 작동이 되든 말든 밑에 queue2부터 실행이되고, 마찬가지로 queue3이 작동이된다.  
그래서 "끝" 부터 나오고 쓰레드들이 실행이 되는것이다. 이걸 방지 하려면 어떻게 해야할까?  
~~~
    @IBAction func action2(_ sender: Any) {
        
        let dispatchGroup = DispatchGroup()
        
        let queue1 = DispatchQueue(label: "q1")
        let queue2 = DispatchQueue(label: "q2")
        let queue3 = DispatchQueue(label: "q3")
        
        queue1.async(group: dispatchGroup) {
            dispatchGroup.enter()
            DispatchQueue.global().async {
                for index in 0..<10 {
                    Thread.sleep(forTimeInterval: 0.2)
                    print(index)
                }
                dispatchGroup.leave()
            }
        }
        
        queue2.async(group: dispatchGroup) {
            dispatchGroup.enter()
            DispatchQueue.global().async {
                for index in 0..<10 {
                    Thread.sleep(forTimeInterval: 0.2)
                    print(index)
                }
                dispatchGroup.leave()
            }
        }
        
        queue3.async(group: dispatchGroup) {
            dispatchGroup.enter()
            DispatchQueue.global().async {
                for index in 0..<10 {
                    Thread.sleep(forTimeInterval: 0.2)
                    print(index)
                }
                dispatchGroup.leave()
            }
        }

        dispatchGroup.notify(queue: DispatchQueue.main){
            print("끝")
        }
        
    }
~~~
이렇게 dispatchGroup에있는 메서드(enter나 leave)를 사용해여 내가 작업이 끝났다 라는것을 수동으로 작성해줘야 한다.   

만약에 sync를 사용하는데 같은 쓰레드안에서 사용하면 어떻게 될까? 바로 deadlock이 걸려버린다.
~~~
    @IBAction func action3(_ sender: Any) {
        let queue1 = DispatchQueue(label: "q1")
        
        queue1.sync {
                for index in 0..<10 {
                    Thread.sleep(forTimeInterval: 0.2)
                    print(index)
                }   
                queue1.sync {
                    for index in 10..<19 {
                        Thread.sleep(forTimeInterval: 0.2)
                        print(index)
                }
        }
    }
}
~~~
코드를 잘 살펴보면, 겉에있는 sync가 실행되는데 안에 sync가 있어버려가지고, 안에 있는 sync는 밖에있는 sync가 끝나길 기다리고,  
안에있는 sync는 밖에있는 sync가 끝나길 기다리는 상태 즉, 무한 루프에 걸려버린것이다.  
같은 이치로,  

~~~
        DispatchQueue.main.sync {
            
        }
~~~
이렇게 메인 쓰레드에서 sync를 해버리면 앱자체가 바로 죽어버린다.  
메인 쓰레드는 작업이 안끝나기 때문이다.  

## qos 우선순위
~~~
    @available(macOS 10.10, iOS 8.0, *)
    public static let background: DispatchQoS

    @available(macOS 10.10, iOS 8.0, *)
    public static let utility: DispatchQoS

    @available(macOS 10.10, iOS 8.0, *)
    public static let `default`: DispatchQoS

    @available(macOS 10.10, iOS 8.0, *)
    public static let userInitiated: DispatchQoS

    @available(macOS 10.10, iOS 8.0, *)
    public static let userInteractive: DispatchQoS
~~~
맨위가 제일 느리고, 점점 빨라지는 식이다. 우선순위가 높아지는것이지 무조건 먼저 실행되는건 아니다.  

## deadlock
- 서로의 작업이 끝날때 까지, 기다리는 상태

## sync
- 나 말고 다른 쓰레드는 다멈추고 내 작업을 최우선으로 실행 시킨다.

## @escaping
- Escaping 클로저는 클로저가 함수의 인자로 전달됐을 때, 함수의 실행이 종료된 후 실행되는 클로저.(함수밖에서 실행됨)  
Non-Escaping 클로저는 이와 반대로 함수의 실행이 종료되기 전에 실행되는 클로저이다.
