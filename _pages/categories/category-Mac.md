---
title: "Mac"
layout: archive
permalink: /Mac
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.Mac %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
