---
title: "BluetoothHeartRate6"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
## Interpreting the Binary Data of a Characteristic’s Value
![Untitled](https://user-images.githubusercontent.com/68246962/232306178-10c7a204-e8e9-41d8-92ca-0849bf9c1f6d.png)
뭐.. 이런 구조를 가지고 있다고 한다… 뭐 그렇다는데 어떻게 그런거지..
나는 잘 모르겠고 코드로 보면 
~~~
/// 심박계 위치 정보
private func bodyLocation(from characteristic: CBCharacteristic) -> String {
  guard let characteristicData = characteristic.value,
    let byte = characteristicData.first else { return "Error" }

  switch byte {
    case 0: return "Other"
    case 1: return "Chest"
    case 2: return "Wrist"
    case 3: return "Finger"
    case 4: return "Hand"
    case 5: return "Ear Lobe"
    case 6: return "Foot"
    default:
      return "Reserved for future use"
  }
}
~~~
이렇게 생각보단 간단하다.  
사용하려면  
우선 심박계 위치 정보를 String으로 반환해주는 함수를 작성해 준후,
~~~
func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
  switch characteristic.uuid {
    case bodySensorLocationCharacteristicCBUUID:
      let bodySensorLocation = bodyLocation(from: characteristic)
      self.BLElocation = bodySensorLocation
    default:
      print("Unhandled Characteristic UUID: \(characteristic.uuid)")
  }
}
~~~
위 함수를 다시 작성해주면,  
현재 심박계블루투스 장치가 어느 위치에 있는지 대략적으로 알 수 있다.