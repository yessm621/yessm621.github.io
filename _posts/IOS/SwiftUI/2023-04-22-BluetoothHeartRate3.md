---
title: "BluetoothHeartRate3"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
## 서비스 사용
연결을 하였으니 사용해야하는는데 어떻게 하면 사용할 수 있을까?  
~~~
/// 심박계가 연결됐는지 확인하기
func centralManager(_: CBCentralManager, didConnect _: CBPeripheral) {
    print("연결 성공!")
    self.heartRatePeripheral.discoverServices(nil)
}
~~~
이렇게 코드를 추가해보면,  
~~~
API MISUSE: Discovering services for peripheral <CBPeripheral: 0x280c6c000, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 23, state = connected> while delegate is either nil or does not implement peripheral:didDiscoverServices:
~~~
이런 에러를 만나볼 수 있는데,  
에러에서볼 수 있듯이
~~~
extension HRMViewModel: CBPeripheralDelegate {
    
}
~~~
확장시켜준후,  
~~~
func peripheral(_ peripheral: CBPeripheral, didDiscoverServices _: Error?) {
    guard let services = peripheral.services else { return }
    for service in services {
        print(service)
    }
}
~~~
함수를 작성해주면,  
~~~
API MISUSE: Discovering services for peripheral <CBPeripheral: 0x280c6c000, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 23, state = connected> while delegate is either nil or does not implement peripheral:didDiscoverServices:
~~~
될줄 알았는데 여전히 같은 에러가 생긴다 그 이유는 뭘까 ??  
바로 대리자를 설정 안해주었기 때문이다.  
~~~
/// 심박계가 연결됐는지 확인하기
func centralManager(_: CBCentralManager, didConnect _: CBPeripheral) {
    print("연결 성공!")
    self.heartRatePeripheral.discoverServices(nil)
    self.heartRatePeripheral.delegate = self
}
~~~
그후 실행시키면
~~~
<CBService: 0x28188c240, isPrimary = YES, UUID = FD00>
<CBService: 0x28188c100, isPrimary = YES, UUID = Heart Rate>
<CBService: 0x28188dc00, isPrimary = YES, UUID = 181C>
<CBService: 0x28188db80, isPrimary = YES, UUID = Battery>
<CBService: 0x28188db00, isPrimary = YES, UUID = Device Information>
~~~
이런식으로 로그가찍힌다.  
이중 가져오고싶은걸 선택하면 되는데 나는 심박수만 할거라서 이런식으로 작성하였다.
~~~
self.heartRatePeripheral.discoverServices([heartRateServiceCBUUID])
~~~
그러면
~~~
<CBService: 0x280ae4880, isPrimary = YES, UUID = Heart Rate>
~~~
심박수만 가져오게 된다.  