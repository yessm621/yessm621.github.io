---
title: "Settings App"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
  - Settings App
---

## 새로만든 xib파일 가져오는 방법  
~~~
        let 변수1 = UINib(nibName: "만든파일의이름", bundle: nil)
        
        사용할배경변수.register(변수1, forCellReuseIdentifier: "만든파일안에identifier")
~~~
예시,  
~~~
import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var settingTableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let nib = UINib(nibName: "ProfileCell", bundle: nil)        
        settingTableView.register(nib, forCellReuseIdentifier: "ProfileCell")
    }
}
~~~
이렇게 사용해야한다. 

## 테이블뷰를 사용하려면 프로토콜 규격세팅하는 방법  
UITableViewDelegate, UITableViewDataSource 프로토코를 추가해준다.  
선언을 하면 반드시 구현해야하는게 필요하다.  
~~~
extension ViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "ProfileCell", for: indexPath)
        
        return cell
        
    }
}
~~~
이런식으로 extension을 사용해서 추가해주면된다.  
그러면 이제 구현해야할 것이 두개가 있다  
첫번째로는, numberOfRowsInSection 이 셀을 몇개를 나타낼것인지를 return 뒤에 적어주면 된다.  
두번째로는, cellForRowAt은 어떤 셀을 보여주게 할것이냐 인데,  
tableView에 dequeueReusableCell라는(재사용이 가능한) 걸 사용하고,  
그 cell을 return할꺼면 cell로 적어주면  
 
<img src="https://user-images.githubusercontent.com/68246962/141635406-8410b593-3a58-4954-96ca-8a543736dea2.png" width="250" height="100">  

내가 만들었던 cell이 추가가 된걸 볼 수 있다.  

## 네비게이션 컨트롤러
이 사진 처럼 위에 글자가 있고  
<img src="https://user-images.githubusercontent.com/68246962/141688818-7601b142-43ac-4114-ad25-419fdc60cf82.png" width="250" height="100">   

아래로 스크롤을 하면 상단에 띄우고싶다면,  
<img src="https://user-images.githubusercontent.com/68246962/141688893-be242427-fa82-4333-91c2-cf99f455c7d6.png" width="250" height="100">  

Main에 가서 일단 Navigation Controller를 추가시켜준다.  

<img src="https://user-images.githubusercontent.com/68246962/141688752-5b4fbde4-4c78-4797-a1f1-91ccace76b05.png" width="250" height="100">   

그다음, viewDidLoad()안에
~~~
        title = "Settings"
        navigationController?.navigationBar.prefersLargeTitles = true
        self.view.backgroundColor = UIColor(white: 245/255, alpha: 1)
~~~
이렇게 타이틀을 정해주고, 세팅을한후, 배경색을 골라주면 완성 된다. title과 navigationController앞에는 self.가 생략되어 있다.  