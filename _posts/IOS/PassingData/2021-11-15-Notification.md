---
title: "Notification"

categories:
  - IOSPassingData
tags:
  - IOS
  - Swift
  - Passing data
---
# Passing data
- 6.Notification
- 알려주고 통제해주는 개념
- 호출부, 구현부가 따로 되어 있음

## Notification
~~~
//구현부
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let notificationName = Notification.Name("sendSomeString")
        
        NotificationCenter.default.addObserver(self, selector: #selector(showSomeString), name: notificationName, object: nil)
        
    }
    
    @objc func showSomeString(notification: Notification) {
        if let str = notification.userInfo?["str"] as? String {
            self.dataLabel.text = str
        }
    }
~~~
위 코드를 보면, 일단 이름이 필요해서 "sendSomeString"라는 이름으로 정했고,  
NotificationCenter쪽에, default가 있고, addObserver가 있는데,  
#selector는 특정한 함수를 호출하겠다는 것이다.  
그래서 그 호출하겠다는 함수를 밑에 showSomeString이라고 만든 것인데  
여기에는 notification 정보를 받아올 수 있다.  
여기에서 userInfo라고하는게 key, values 형태로 들어 있고, 키로 접근을 하고, 그안에 있는 데이터를  
self.dataLabel.text = str, 즉 화며에 뿌려주겠다는 소리이다.  

~~~
//버튼
    @IBAction func moveToNoti(_ sender: Any) {
        
        let detailVC = NotiDetailViewController(nibName: "NotiDetailViewController", bundle: nil)
        self.present(detailVC, animated: true, completion: nil)
    }
~~~
버튼을 눌렀을때 작동하게 만든 코드  

~~~
//호출부
class NotiDetailViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
    }

    @IBAction func notiAction(_ sender: Any) {
        
        let notificationName = Notification.Name("sendSomeString")
        
        let strDic = ["str" : "noti string"]
        
        NotificationCenter.default.post(name: notificationName, object: nil, userInfo: strDic)
        self.dismiss(animated: true, completion: nil)
    }
}
~~~
버튼이 눌려졌을때, NotificationCenter.default에 post라고 있는데,  
post는 notification이름으로 호출할수가 있다. userInfo로 데이터값을 전달해준다.  
그리고 키는 str 벨류는 noti string로 만든것이다.  

## 텍스트필드를 누르면 키보드가 올라오게하기  
~~~
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let notificationName = Notification.Name("sendSomeString")
        
        NotificationCenter.default.addObserver(self, selector: #selector(showSomeString), name: notificationName, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
    }
}
~~~
그리곤
~~~
    @objc func keyboardWillShow() {
        print("will show")
    }
~~~
이렇게 해주면 된다.  
notification은 연결점이 없을때, 그쪽에 전달을 하거나, 호출을 할때 사용이 가능하다.  
연결점이 전혀 없을때 사용하는 것이다.  