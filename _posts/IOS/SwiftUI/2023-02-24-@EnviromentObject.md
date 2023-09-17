---
title: "@EnviromentObject"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
- 앱이 살아있는 한, 계속 메모리에 존재하는 퍼블리셔
- 주의점: EnvironmentObject는 조상 view에서 넘겨줘야 한다. preview crash 의 원인이 될 수도 있다.
~~~
@main
struct Twitter_Clone_SwiftUIApp: App {
    
    init() {
        FirebaseApp.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(AuthViewModel())
        }
    }
}
~~~
후 사용할땐,
~~~
@EnvironmentObject var viewModel: AuthViewModel
~~~

## preview에 사용하려면
~~~
ContentView().environmentObject(UserSettings())
~~~