---
title: "디자인 패턴"
layout: archive
permalink: /DesignPattern
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.DesignPattern %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
