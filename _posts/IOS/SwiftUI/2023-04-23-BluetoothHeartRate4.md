---
title: "BluetoothHeartRate4"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
## 서비스의 특징 찾는법
~~~
func peripheral(_ peripheral: CBPeripheral, didDiscoverServices _: Error?) {
    guard let services = peripheral.services else { return }
    for service in services {
        print(service)
        peripheral.discoverCharacteristics(nil, for: service)
    }
}
~~~
이런 식으로 추가해주면
~~~
API MISUSE: Discovering characteristics on peripheral <CBPeripheral: 0x281ba0000, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 23, state = connected> while delegate is either nil or does not implement peripheral:didDiscoverCharacteristicsForService:error:
~~~
이런 에러를 만나볼 수 있는데,  
~~~
func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?)
~~~
함수를 작성안해줘서 생긴 문제이다.  
~~~
func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
    guard let characteristics = service.characteristics else { return }

      for characteristic in characteristics {
        print(characteristic)
      }
}
~~~
이런식으로 작성해주면 
~~~
<CBCharacteristic: 0x28179c900, UUID = 2A37, properties = 0x10, value = (null), notifying = NO>
<CBCharacteristic: 0x28179c3c0, UUID = 2A38, properties = 0x2, value = (null), notifying = NO>
~~~
이런 로그가 찍히는데, 하나는 심박수 측정,
하나는 심박수 위치 이다.
~~~
/// 심박수측정
let heartRateMeasurementCharacteristicCBUUID = CBUUID(string: "2A37")
/// 심박계 위치
let bodySensorLocationCharacteristicCBUUID = CBUUID(string: "2A38")
~~~
이런 방식으로 변수를 설정해주고,  
~~~
func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
    guard let characteristics = service.characteristics else { return }

      for characteristic in characteristics {
          if characteristic.properties.contains(.read) {
            /// 심박계 위치 정보 읽기
            print("\(characteristic.uuid): properties contains .read")
          }
          if characteristic.properties.contains(.notify) {
            /// 심박수가 측정 될때마다 알람
            print("\(characteristic.uuid): properties contains .notify")
          }

      }
}
~~~
이렇게 작성해주면 된다.  