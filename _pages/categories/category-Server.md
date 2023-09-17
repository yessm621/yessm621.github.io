---
title: "Server"
layout: archive
classes: wide <!-- 본문 늘리기!!!-->
permalink: categories/Server
author_profile: true
sidebar_main: true
---


{% assign posts = site.categories.Server %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}