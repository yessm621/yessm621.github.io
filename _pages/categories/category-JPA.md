---
title: "JPA"
layout: archive
permalink: /JPA
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.JPA %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
