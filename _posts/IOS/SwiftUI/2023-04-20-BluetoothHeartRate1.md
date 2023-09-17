---
title: "BluetoothHeartRate1"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---

## 권한허용 요청
Info.plist에서
~~~
Privacy - Bluetooth Always Usage Description
~~~
HRMViewModel에서
~~~
import CoreBluetooth
import Foundation

class HRMViewModel: NSObject, CBCentralManagerDelegate, ObservableObject {

    var centralManager: CBCentralManager!
    
    /// central은 블투수트 통신 받을 객체
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .unknown:
            print("central.state is .unknown")
        case .resetting:
            print("central.state is .resetting")
        case .unsupported:
            print("central.state is .unsupported")
        case .unauthorized:
            print("central.state is .unauthorized")
        case .poweredOff:
            print("central.state is .poweredOff")
        case .poweredOn:
            print("central.state is .poweredOn")
        }
    }
    
    func onApper() {
        self.centralManager = CBCentralManager(delegate: self, queue: nil)
    }
}
~~~
ContentView.class
~~~
import SwiftUI

struct ContentView: View {

    @StateObject var viewModel = HRMViewModel()

    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("Hello, world!")
        }
        .padding()
        .onAppear {
            self.viewModel.onApper()
        }
    }
}
~~~
후 실행시키면
~~~
[CoreBluetooth] API MISUSE: <CBCentralManager: 0x2839b3340> can only accept this command while in the powered on state
~~~
이런 에러를 만나볼 수 있다.  
이때, 
~~~
case .poweredOn:
	print("central.state is .poweredOn")
	// 주변 장치 검색
	centralManager.scanForPeripherals(withServices: nil )
~~~
이렇게 추가해 주면 에러가 제거된다.  

## 주변 기기를 찾기
~~~
func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    print(peripheral)
}
~~~
이런식으로 함수를 작성해주면,
~~~
<CBPeripheral: 0x2819c4000, identifier = F9EC7464-D644-A813-F2DA-FF391730EB26, name = (null), mtu = 0, state = disconnected>
<CBPeripheral: 0x2819d00d0, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 0, state = disconnected>
<CBPeripheral: 0x2819cc0d0, identifier = 16814388-63DB-B549-C660-CD25F1D8BB00, name = Jae’s MacBook Air, mtu = 0, state = disconnected>
~~~
이렇게 주변기기에 블루투스가 어떤게 있는지 확인이 가능하다.  
계속 통신하고있어서 on에서 off로 바꾸면 꺼진다.  

## 특정 장치 검색
~~~
/// 삼박계 전용 UUID
let heartRateServiceCBUUID = CBUUID(string: "0x180D")
~~~
변수설정을 해준후,  
~~~
case .poweredOn:
  print("central.state is .poweredOn")
	centralManager.scanForPeripherals(withServices: [heartRateServiceCBUUID])
~~~
이렇게 작성 해주면
~~~
<CBPeripheral: 0x281cb80d0, identifier = 67AA48A4-41A5-8D62-CFCE-E2FAEC5D8475, name = PA_0196508, mtu = 0, state = disconnected>
~~~
심박계만 log가 찍힌다.   