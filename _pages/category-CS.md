---
title: "CS"
layout: archive
classes: wide <!-- 본문 늘리기!!!-->
permalink: /cs
author_profile: true
sidebar:
    nav: "sidebar-category"
---


{% assign posts = site.categories.CS %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}