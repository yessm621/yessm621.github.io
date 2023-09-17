---
title: "Email보내기 기능 구현"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

# MessageUI
https://developer.apple.com/documentation/messageui  
우선 공식문서를 살펴보면,   
- 이메일 작성
- 메시지 작성  

두가지로 나눌수 있는데 이번에 내가 앱에서 사용한것은 __이메일작성__ 이다.  

![image](https://user-images.githubusercontent.com/68246962/201331950-03bf626a-207d-4959-add9-40c15bbab021.png)  

기본적인 인터페이스는 애플 공식문서에 있는 이 사진과 동일하다.  

# 이메일이 사용 가능한지 확인하기
공식 문서에 따라 일단 메일 서비스가 가능한지 확인해야한다.  
우선 
~~~
import MessageUI
~~~
import를 해준후,  

~~~
private func checkEmailAvailability() {
    if !MFMailComposeViewController.canSendMail() {
        print("Mail services are not available")
        return
    }
}
~~~
재대로 작동을하는지 값을받아오면 된다.  
시뮬레이션으로 실행을 시키면, 위에있는 print문이 나와버린다.  
그 이유는 시뮬레이터는 이메일 기능을 지원하지 않기 때문이다.

# 구성 인터페이스 구성 및 표시
이제 뭘 어떤걸 누구한테 보낼지 정하면 되는데 우선
MFMailComposeViewController를 인스턴스화 시켜야한다.  
~~~
let composeVC = MFMailComposeViewController()
~~~
그리고 내용물을 정하면 되는데,
~~~
func sendMail() {
  let messageBody =
  """
  OS Version: \(UIDevice.current.systemVersion)
        
  앱 개선 요청사항 및 문제
  """
        
  composeVC.setToRecipients(["chl9338@naver.com"])
  composeVC.setSubject("앱 피드백")
  composeVC.setMessageBody(messageBody, isHTML: false)
        
  self.present(composeVC, animated: true, completion: nil)
}
~~~
이런식으로 작성을 해주면 된다.

그러면 실제기기에서 동작해보면,  
![IMG_5024](https://user-images.githubusercontent.com/68246962/201333330-be279e7c-7fe0-4b6c-bd3d-8ba12d0fc9bc.jpg)


이러한 이미지가 나오는걸 볼 수 있다.

# 메일 작성 보기 컨트롤러 닫기
취소 버튼을 눌러보면 ActionAlert이 뜨는데, ComposeVC가 dismiss되지 않는걸 볼 수 있다. 이러한 문제를 해결하기위해선,  

~~~
composeVC.mailComposeDelegate = self
~~~
이런식으로 대리자 설정을 해준다음,  

~~~
extension ViewController: MFMailComposeViewControllerDelegate {
    
    func mailComposeController(_ controller: MFMailComposeViewController,
                               didFinishWith result: MFMailComposeResult, error: Error?) {
        dismiss(animated: true, completion: nil)
    }
    
}
~~~
를 작성해주면 된다. 

참고문서
https://developer.apple.com/documentation/messageui/mfmailcomposeviewcontroller