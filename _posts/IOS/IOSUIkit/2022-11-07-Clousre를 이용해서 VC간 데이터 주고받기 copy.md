---
title: "Clousre를 이용해서 VC간 데이터 주고받기"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - Closure
---

우선 간단하게 클로져부터 설명을 해본다면
# Closure란?

- 클로저는 사용자의 코드 안에서 전달되어 사용할 수 있는 로직을 가진 중괄호“{}”로 구분된 코드의 블럭이며, 일급 객체의 역할을 할 수 있다.
- 일급 객체는 전달 인자로 보낼 수 있고, 변수/상수 등으로 저장하거나 전달할 수 있으며, 함수의 반환 값이 될 수도 있다.
- 참조 타입이다.
- 함수는 클로저의 한 형태로, 이름이 있는 클로저이다.
- 그떄그때 필요한 코드를 작성하여 사용할 수 있도록 만든 코드.

# Closure의 표현 문법
~~~
{ (parameters) -> return type in
    statements
}
~~~

# 작동방식
화면1에서 장바구니를 클릭 -> 화면2에서 상품을 선택 -> 화면 1에서  상품의 개수를 띄우는 alert창 생성.
![image](https://user-images.githubusercontent.com/68246962/196261964-70ccd45b-b6bf-4854-83b4-6a2ac851dae3.png)

- 데이터 요청을 받은 Received View Controller에서 Closure 선언  
아이템 개수를 전달해주니까 Int -> Void 형태로 선언
~~~
var closure: ((Int) -> ())?        // 클로저 선언
~~~

- 장바구니 담기 버튼을 클릭했을때  
클로저를 실행하면서 장바구니에 몇개가 담겼는지 파라미터로 전달해준다.
~~~
  @IBAction func insertCartButtonTapped(_ sender: UIButton) {
        dismiss(animated: true, completion: nil)
        closure?(itemCount)
    }
~~~

- 카트 버튼 클릭했을 때 클로저를 실행해준다
버튼이 눌리면 closure가 실행되도록!
두번째 뷰컨트롤러(Received ViewController) 가 dismiss되고 closure?를 호출하면 첫번째 뷰컨트롤러( Send View Controller )에 clousre를 실행해준다.
~~~
@IBAction func cartButtonTapped() {
        let cartVC = storyboard?.instantiateViewController(identifier: "ReceiveViewController") as! ReceiveViewController

        cartVC.closure = { itemCount in
            let alertVC = UIAlertController(title: "장바구니 확인", message: "장바구니에 \(itemCount)개의 상품이 추가되었습니다.", preferredStyle: .alert)
            
            let okAction = UIAlertAction(title: "확인", style: .default, handler: nil)
            alertVC.addAction(okAction)
            
            self.present(alertVC, animated: true, completion: nil)
        }
        
        if let productName = productNameLabel.text,
           let price = priceLabel.text {
            cartVC.productName = productName
            cartVC.price = price
        }
        present(cartVC, animated: true, completion: nil)
    }

~~~