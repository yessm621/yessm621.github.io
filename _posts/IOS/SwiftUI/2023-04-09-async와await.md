---
title: "async와await"

categories:
  - SwiftUI
tags:
  - Swift 
  - UIkit
---
Swift 5.5에서 출시된 새로운 기술이라고 하는데 쉬운데 어렵다.  
일단 느낌이 잘 안온다고 해야하나? 음... 비동기함수를 사용할떄 사용한다고한다.  
대표적인 예제를 보자
~~~
func fetchThumbnail(for id: String) async throws -> UIImage {
	// (1)
	let request = thumbnailURLRequest(for: id)
	// (2)
	let (data, response) = try await URLSession.shared.data(for: request)
	guard (response as? HTTPURLResponse)?.statusCode == 200 else { throw FetchError.badID }
	// (3)
	let maybeImage = UIImage(data: data)
	// (4)
	guard let thumbnail = await maybeImage?.thumbnail else { throw FetchError.badImage }
	return thumbnail
}
~~~
일단 한번 보자, 에러가 발생할 수 있으니, throws로 던져주자 그러면 
사용할땐 이렇게
~~~
Task {
  do {
    let image:UIImage = try await fetchThumbnail(for: "image")
  } catch {
    print("에러발생")
  }
}
~~~
이런식으로 작성할 수 있다.

다른 방식으로는
~~~
func loadWebResource(_ path: String) async throws -> Resource
func decodeImage(_ r1: Resource, _ r2: Resource) async throws -> Image
func dewarpAndCleanupImage(_ i : Image) async throws -> Image

func processImageData() async throws -> Image {
  let dataResource  = try await loadWebResource("dataprofile.txt")
  let imageResource = try await loadWebResource("imagedata.dat")
  let imageTmp      = try await decodeImage(dataResource, imageResource)
  let imageResult   = try await dewarpAndCleanupImage(imageTmp)
  return imageResult
}
~~~
이런식으로 작성이 가능하기도 하다.
방식은  
completion을 return으로 바꾸고,  
메소드에 async 키워드 추가후,  
사용하는 쪽에서 await와 함께 호출해준다.  
그후 Task와 함께 사용해 주면 된다.  
~~~
override func viewDidLoad() {
    super.viewDidLoad()
    Task {
        await self.process() 
     }
}
~~~  