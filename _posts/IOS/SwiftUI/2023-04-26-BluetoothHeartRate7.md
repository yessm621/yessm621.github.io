---
title: "BluetoothHeartRate7"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
## 심박수 측정
드디어 심박수를 측정해 보겠다.
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
            peripheral.setNotifyValue(true, for: characteristic)

        }

    }
}
~~~
이렇게
~~~
peripheral.setNotifyValue(true, for: characteristic)
~~~
를 추가했더니
~~~
Unhandled Characteristic UUID: 2A37
~~~
이런 로그가 찍히는데 이건

![Untitled](https://user-images.githubusercontent.com/68246962/232306631-ffa5cf4a-a6e6-4cf6-9084-b46fec5c7821.png)
또 문서를 봐야한다…

첫번째 바이트에는 여러개가 포함되어 있고,

첫번째 비트가 심박수 측정이 8비트인지, 16비트 인지 값을 나타내는 것이다.

첫번쨰 비트가 만약 0이면, 심박수 값 형식은 UINT8이고 즉, 8비트이고

첫번쨰 비트가 만약 1이면, 심박수 값 형식은 UINT16, 즉 16비트 란다.

우리가 원하는 심박수는 두번쨰 바이트 또는 세번째 바이트부터 찾을 수 있다고 한다.

제목이 ***Requires*** 인 맨 마지막 열에는 비트 값이 ***0 일 때 C1*** , 비트 값이 ***1 일 때 C2*** 가 표시가 된다고한다.
![Untitled](https://user-images.githubusercontent.com/68246962/232306715-efddb661-954f-420e-b349-ab05604db398.png)
잘 모르겠고 코드로 보면
~~~
private func heartRate(from characteristic: CBCharacteristic) -> Int {
    guard let characteristicData = characteristic.value else { return -1 }
    let byteArray = [UInt8](characteristicData)
    let firstBitValue = byteArray[0] & 0x01
    if firstBitValue == 0 {
        return Int(byteArray[1])
    } else {
        return (Int(byteArray[1]) << 8) + Int(byteArray[2])
    }
}
~~~
이렇게 추가하면 된다.  
자세한 예제는
https://github.com/choijaegwon/BluetoothHeartRate  
를 참고하면 된다.  
