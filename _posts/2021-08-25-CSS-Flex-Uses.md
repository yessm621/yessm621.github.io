---
title:  "Flex 유용한 기법들"
categories:
  - CSS
tags:
  - CSS
toc: true
toc_label: "Getting Started"
---

## flex items 중 하나만 오른쪽 끝으로 붙이고 싶을 때

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>CSS Flex</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div class="flex-container">
	  <div class="flex-item">A</div>
    <div class="flex-item">B</div>
		<div class="flex-item">C</div>
  </div>
</body>
</html>
```

```css
.flex-container {
	display: flex;
	/* justify-content: space-between; */
	/* width: 600px; */
}

.flex-item {
	width: 150px;
}

.flex-item:last-child {
	margin-left: auto;
}
```

![Untitled](https://user-images.githubusercontent.com/79130276/130750090-b0057369-6334-41e7-b7e6-6cf9b1f3dc21.png)

<br>
<br>

## 고정폭 컬럼과 가변폭 컬럼 혼합

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>CSS Flex</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div class="flex-container">
	  <div class="flex-item">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo temporibus perspiciatis voluptas asperiores explicabo, Quo iusto atque expedita est?
		</div>
    <div class="flex-item">
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, excepturi? Doloribus, hic dicta praesentium ullam, aperiam ex rem quo modi est cupiditate voluptatem alias reprehenderit suscipit? Nam corrupti non officiis.
		</div>
		<div class="flex-item">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod soluta cumque, placeat ea vel libero necessitatibus consectetur ducimus, commodi officiis provident magnam totam.</div>
	</div>
</body>
</html>
```

```css
.flex-container {
	display: flex;
}

.flex-item:nth-child(1) {
	flex-shrink: 0;
	/* flex: 0 0 auto; */
	width: 150px;
}

.flex-item:nth-child(2) {
	flex-grow: 1;
}

.flex-item:nth-child(3) {
	width: 200px;
}
```


**flex-shrink: 0;**

→ 아이템 크기가 flex-basis 보다 작아지지 않음

**flex-grow: 1;**

→ 아이템 크기가 flex-basis 보다 커질 수 있다.

![Untitled1](https://user-images.githubusercontent.com/79130276/130750096-11d5c08a-7877-4129-b4cf-f050cac380ae.png)

<br>
<br>

## 3. footer 하단에 고정시키기

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>CSS Flex</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div class="page">
		<div class="header flex-item">header</div>
		<section class="content">
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste, totam. Voluptates tempore dicta expedita autem voluptas? Necessitatibus, totam voluptatum culpa doloribus minima, nobis maxime inventore exercitationem tempora saepe suscipit voluptatibus in laudantium quo quibusdam? Dolore hic corrupti neque fugiat cumque doloremque, maiores dolorum ratione atque, voluptates qui cupiditate iure voluptate soluta quibusdam nisi officia cum, magni voluptatibus. Cupiditate provident veritatis consequuntur distinctio temporibus sequi veniam harum quam! In voluptatibus veniam qui minus reiciendis aliquam, perspiciatis accusantium nisi, saepe quos quisquam magnam vel explicabo. Optio quidem accusantium ipsum qui corrupti. Eius ea esse illo ratione a minus rerum odit corporis, dolorum cum perspiciatis aliquid veritatis numquam ipsam hic repudiandae laudantium. Nam, quisquam? Autem mollitia sint suscipit, ipsa assumenda excepturi sunt debitis voluptatibus enim dolorem consequuntur iusto, quos aliquid dolores modi dolorum tempora quibusdam nobis earum eum nam. Necessitatibus quis optio odit quibusdam at, porro doloribus dolor. Nesciunt iste quia eius, voluptas possimus non nihil ipsum doloribus consequuntur qui inventore dolores sit aperiam suscipit earum illum odio harum. Recusandae, voluptatibus cum! Quisquam optio dolor doloremque unde, quo aliquid quibusdam reiciendis, sunt modi pariatur nesciunt dolores fugit ipsam voluptate incidunt repellat sapiente ullam porro laboriosam dolorum hic earum recusandae voluptatibus? Voluptate iusto cumque ad fuga est recusandae accusantium molestias quisquam facere incidunt sit, odit consequuntur libero ullam natus iste quod minima pariatur vitae deserunt sequi quasi provident commodi! Maxime ut dolorem possimus laboriosam ipsa. Quos minima similique, magni modi iste magnam quisquam quasi dolore dolorem voluptatibus, facilis error amet. Dignissimos repudiandae ea eligendi officiis alias, amet mollitia obcaecati similique atque eum, fugit laborum aliquam, perspiciatis totam excepturi quod reprehenderit voluptates nisi laudantium corporis. Impedit repellat, nesciunt animi debitis similique consectetur. Saepe nobis reprehenderit voluptate! Officia, recusandae pariatur quasi, voluptatem corrupti magni harum velit iste libero cupiditate, fugiat provident earum quam? Consequuntur nisi ipsam magni alias? Ut, quasi sapiente. Officia nesciunt ratione dolore cumque, veniam id. Odit quasi mollitia ab itaque excepturi optio amet vero nisi sint quia? Numquam quia tenetur a rem nemo quos repellendus, dolore earum. Odio doloribus illo vitae in repellendus laboriosam! Totam, illo quae sit recusandae quidem nisi excepturi ea fuga itaque illum ratione? Doloremque, atque reprehenderit, quaerat assumenda laudantium accusamus fugiat eos officia provident veniam quod voluptatem dignissimos at animi aliquid soluta rerum vero nobis hic, a delectus excepturi rem possimus. Natus expedita sapiente velit quas odit consectetur, fugit architecto asperiores officia repellat voluptas omnis. Quas tenetur quo eligendi consectetur laborum ipsum veritatis dolorum provident, error impedit nam. Dicta ad nulla autem sequi minus consequatur. Temporibus animi beatae aperiam amet odit possimus dolorem in, eaque voluptatibus, suscipit recusandae alias deleniti rerum harum, ducimus quo illo modi saepe provident doloremque quibusdam! Beatae dolor nostrum expedita molestiae? Reiciendis dolor eaque aut minima velit soluta natus excepturi, ad, voluptatibus exercitationem fugiat non accusamus, maiores pariatur et provident voluptates eum corrupti illum cupiditate omnis quo culpa! Eos perspiciatis voluptates minima sapiente, reprehenderit sit in quaerat itaque! Aut error voluptatem deserunt quam! Repudiandae dolorum ea soluta iusto voluptatibus. Nobis eum ratione praesentium ipsam corporis?
		</section>
		<div class="footer flex-item">footer</div>
  </div>
</body>
</html>
```

```css
.page {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	/* height: 100vh; */
}

.content {
	/* overflow: auto; */
	flex: 1 auto;
	padding: 1.5rem;
}
```

![Untitled2](https://user-images.githubusercontent.com/79130276/130750100-d261eade-b022-44b6-a82a-f55853b7a6d1.png)

![Untitled3](https://user-images.githubusercontent.com/79130276/130750103-36291098-a6e3-414b-92f5-94681fdee4e4.png)

<br>

### 스크롤과 상관없이 footer 를 하단에 고정

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>CSS Flex</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div class="page">
		<div class="header flex-item">header</div>
		<section class="content">
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste, totam. Voluptates tempore dicta expedita autem voluptas? Necessitatibus, totam voluptatum culpa doloribus minima, nobis maxime inventore exercitationem tempora saepe suscipit voluptatibus in laudantium quo quibusdam? Dolore hic corrupti neque fugiat cumque doloremque, maiores dolorum ratione atque, voluptates qui cupiditate iure voluptate soluta quibusdam nisi officia cum, magni voluptatibus. Cupiditate provident veritatis consequuntur distinctio temporibus sequi veniam harum quam! In voluptatibus veniam qui minus reiciendis aliquam, perspiciatis accusantium nisi, saepe quos quisquam magnam vel explicabo. Optio quidem accusantium ipsum qui corrupti. Eius ea esse illo ratione a minus rerum odit corporis, dolorum cum perspiciatis aliquid veritatis numquam ipsam hic repudiandae laudantium. Nam, quisquam? Autem mollitia sint suscipit, ipsa assumenda excepturi sunt debitis voluptatibus enim dolorem consequuntur iusto, quos aliquid dolores modi dolorum tempora quibusdam nobis earum eum nam. Necessitatibus quis optio odit quibusdam at, porro doloribus dolor. Nesciunt iste quia eius, voluptas possimus non nihil ipsum doloribus consequuntur qui inventore dolores sit aperiam suscipit earum illum odio harum. Recusandae, voluptatibus cum! Quisquam optio dolor doloremque unde, quo aliquid quibusdam reiciendis, sunt modi pariatur nesciunt dolores fugit ipsam voluptate incidunt repellat sapiente ullam porro laboriosam dolorum hic earum recusandae voluptatibus? Voluptate iusto cumque ad fuga est recusandae accusantium molestias quisquam facere incidunt sit, odit consequuntur libero ullam natus iste quod minima pariatur vitae deserunt sequi quasi provident commodi! Maxime ut dolorem possimus laboriosam ipsa. Quos minima similique, magni modi iste magnam quisquam quasi dolore dolorem voluptatibus, facilis error amet. Dignissimos repudiandae ea eligendi officiis alias, amet mollitia obcaecati similique atque eum, fugit laborum aliquam, perspiciatis totam excepturi quod reprehenderit voluptates nisi laudantium corporis. Impedit repellat, nesciunt animi debitis similique consectetur. Saepe nobis reprehenderit voluptate! Officia, recusandae pariatur quasi, voluptatem corrupti magni harum velit iste libero cupiditate, fugiat provident earum quam? Consequuntur nisi ipsam magni alias? Ut, quasi sapiente. Officia nesciunt ratione dolore cumque, veniam id. Odit quasi mollitia ab itaque excepturi optio amet vero nisi sint quia? Numquam quia tenetur a rem nemo quos repellendus, dolore earum. Odio doloribus illo vitae in repellendus laboriosam! Totam, illo quae sit recusandae quidem nisi excepturi ea fuga itaque illum ratione? Doloremque, atque reprehenderit, quaerat assumenda laudantium accusamus fugiat eos officia provident veniam quod voluptatem dignissimos at animi aliquid soluta rerum vero nobis hic, a delectus excepturi rem possimus. Natus expedita sapiente velit quas odit consectetur, fugit architecto asperiores officia repellat voluptas omnis. Quas tenetur quo eligendi consectetur laborum ipsum veritatis dolorum provident, error impedit nam. Dicta ad nulla autem sequi minus consequatur. Temporibus animi beatae aperiam amet odit possimus dolorem in, eaque voluptatibus, suscipit recusandae alias deleniti rerum harum, ducimus quo illo modi saepe provident doloremque quibusdam! Beatae dolor nostrum expedita molestiae? Reiciendis dolor eaque aut minima velit soluta natus excepturi, ad, voluptatibus exercitationem fugiat non accusamus, maiores pariatur et provident voluptates eum corrupti illum cupiditate omnis quo culpa! Eos perspiciatis voluptates minima sapiente, reprehenderit sit in quaerat itaque! Aut error voluptatem deserunt quam! Repudiandae dolorum ea soluta iusto voluptatibus. Nobis eum ratione praesentium ipsam corporis?
		</section>
		<div class="footer flex-item">footer</div>
  </div>
</body>
</html>
```

```css
.page {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.content {
	overflow: auto;
	flex: 1 auto;
	padding: 1.5rem;
}
```

![Untitled4](https://user-images.githubusercontent.com/79130276/130750108-157bad66-2243-4485-b639-87b4ae3854f4.png)
