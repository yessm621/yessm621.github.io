---
title: "tableview 구분선 없애기"

categories:
  - IOSUIkit
tags:
  - IOS
  - Swift
---

# tableview 구분선 없애기
~~~
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
	if let cell = tableView.dequeueReusableCell(withIdentifier: "newsTableViewCell") as? NewsTableViewCell {
            
  //tableView separator 없애기
  cell.separatorInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: .greatestFiniteMagnitude)

  return cell
	}
return UITableViewCell()
}
~~~