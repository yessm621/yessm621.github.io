---
title: "BluetoothHeartRate5"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
## 심박계 위치 찾기
~~~
func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error _: Error?) {
    guard let characteristics = service.characteristics else { return }

    for characteristic in characteristics {
        if characteristic.properties.contains(.read) {
            /// 심박계 위치 정보 읽기
            print("\(characteristic.uuid): properties contains .read")
            peripheral.readValue(for: characteristic)

        }
        if characteristic.properties.contains(.notify) {
            /// 심박수가 측정 될때마다 알람
            print("\(characteristic.uuid): properties contains .notify")
        }

    }
}
~~~
심박계 위치를 찾으려고, 이렇게 코딩해줬는데 
~~~
API MISUSE: Reading characteristic value for peripheral <CBPeripheral: 0x280974000, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 23, state = connected> while delegate is either nil or does not implement peripheral:didUpdateValueForCharacteristic:error:
~~~
이런 에러가 나온다.  
이건
~~~
func peripheral(_: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error _: Error?) {
    switch characteristic.uuid {
    case self.bodySensorLocationCharacteristicCBUUID:
        print(characteristic.value ?? "no value")
    default:
        print("Unhandled Characteristic UUID: \(characteristic.uuid)")
    }
}
~~~
이렇게 작성하면 해결해 준다.  
~~~
연결 성공!
2023-04-16 00:10:20.721134+0900 BLEHeartRate[78572:5520714] [CoreBluetooth] API MISUSE: Discovering services for peripheral <CBPeripheral: 0x2823e4340, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 23, state = connected> while delegate is either nil or does not implement peripheral:didDiscoverServices:
<CBService: 0x280db8340, isPrimary = YES, UUID = Heart Rate>
2A37: properties contains .notify
2A38: properties contains .read
1 bytes
~~~
그러면 이렇게 로그가 찍히는걸 볼 수 있다.  
