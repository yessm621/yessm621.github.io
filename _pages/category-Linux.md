---
title: "Linux"
layout: archive
classes: wide <!-- 본문 늘리기!!!-->
permalink: /linux
author_profile: true
sidebar:
    nav: "sidebar-category"
---


{% assign posts = site.categories.Linux %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}