---
title: "BluetoothHeartRate2"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
심박계 연결을 위한 장치 변수를 만들어주고,  
~~~
/// 심박계 장치
var heartRatePeripheral: CBPeripheral!
~~~

## 주변 기기를 찾기
~~~
func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    print(peripheral)
    /// 찾은 장치를 변수에 저장
    self.heartRatePeripheral = peripheral
    /// 스캔을 멈추고
    self.centralManager.stopScan()
    /// 연결을 해주기
    self.centralManager.connect(heartRatePeripheral)
}
~~~
함수안에 다시 작성을 해주면, 심박계 기기를 찾은후, 바로 연결을 해준다.  
잘 연결되어 있는지 확인해주려면
~~~
/// 심박계가 연결됐는지 확인하기
func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
    print("연결 성공!")
}
~~~
이런 함수를 작성해주면 된다.  
그러면 로그가 
~~~
central.state is .poweredOn
<CBPeripheral: 0x281200000, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 0, state = disconnected>
연결 성공!
~~~
잘 찍히는걸 볼 수 있다.  