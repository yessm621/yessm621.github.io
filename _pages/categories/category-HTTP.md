---
title: "HTTP"
layout: archive
permalink: /HTTP
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.HTTP %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
