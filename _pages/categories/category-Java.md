---
title: "Java"
layout: archive
permalink: /Java
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.Java %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
