---
title: "Intance Property"

categories:
  - IOSPassingData
tags:
  - IOS
  - Swift
  - Passing data
---

# Passing data
- 1.intance property

## intance property
- 클래스에 속해있는 변수를 넘겨주는 방법  

~~~
    @IBAction func  버튼의 이름(_ sender: Any) {
        let detailVC = swift파일이름(nibName: [.xib파일이름], bundle: nil)
    }
~~~

~~~
    @IBAction func  moveToDetail[버튼의 이름](_ sender: Any) {
        let detailVC = DetailViewController(nibName: "DetailViewController", bundle: nil)
        
        self.present(detailVC, animated: true, completion: nil)
    }
~~~
DetialViewController를 인스턴스화 시켜야하하지만,  
.xib기반으로 되어있기 때문에, nibName이라는 곳에 .xib파일이름을 넣어야한다.  
그다음으로, 기본적으로 UIViewController가 가지고있는 기능중 하나인, present를 사용해야한다.  
그다음에 인스턴스화 시킨 걸 넣어주고, animated는 true, completion은 nil로 지정해주면 된다.  
하지만, 이건 화면만 옮겨준거지 데이터를 옮겨주는게 아니다.  
옮겨주려면
~~~
class DetailViewController: UIViewController {
    
    var someString = ""

    @IBOutlet weak var someLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        someLabel.text = someString
    }

}
~~~
이렇게 someString을 하나 만들고 화면에 someLabel을 가져온후,  
viewDidLoad()에 someLabel.text에 someString을 넣어야한다.  
그리고 난후, 
~~~
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func moveToDetail(_ sender: Any) {
        let detailVC = DetailViewController(nibName: "DetailViewController", bundle: nil)
            
        detailVC.someString = "aaa 스트링"
        
        self.present(detailVC, animated: true, completion: nil)
    }
}
~~~
이렇게 detailVC.someString에 값을 넣어주면 버튼을 눌렀을때 값도 같이 이동이 된다.  
또 다른방법으로는 detailVC.someLabel이 있는데, 이거는 화면이랑 연동이 되어있는 property다.  
특징은, viewDidLoad가 올라갈때 같이 올라간다. 즉 화면에 올리는 준비를하는 present라는 기능을 호출한 다음에,  
넣어야 정상적으로 실행이 된다.  
~~~
    @IBAction func moveToDetail(_ sender: Any) {
        let detailVC = DetailViewController(nibName: "DetailViewController", bundle: nil)
            
        detailVC.someLabel.text = "bb"
        
        self.present(detailVC, animated: true, completion: nil)
    }
~~~
위에 처럼 정상적으로 작동하지 않는다, 그 이유는 화면을 올리기 전이기 떄문이다.  
하지만,  
~~~
    @IBAction func moveToDetail(_ sender: Any) {
        let detailVC = DetailViewController(nibName: "DetailViewController", bundle: nil)
        
        self.present(detailVC, animated: true, completion: nil)
    
        detailVC.someLabel.text = "bb"

    }
~~~
이런식으로 present, 즉 화면을 올려주고 난후에 적으면 정상적으로 잘 작동이된다.  
그 차이는,
~~~
class DetailViewController: UIViewController {
    
    var someString = ""

    @IBOutlet weak var someLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        someLabel.text = someString
    }

}
~~~
에서 someString은 클래스가 생성되는 시점에서 무조건 생성되는 property이고,  
IBOulet은 화면에 올라갈 준비가 됐을떄 생성되는 property이기 때문이다.  
충돌을 방지하기 위해서, 클래스가 생성될때 같이 생성되는 somString같은 변수를 만들어 놓고,  
다음에 그거를 viewDidLoad()시점에 그 레이블에 값을 넣어논다는 someLabel.text = someString 같은 코드르 넣어 놓는것이다.  
 


