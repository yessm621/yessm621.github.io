---
title: "Django"
layout: archive
permalink: /Django
author_profile: true
sidebar:
    nav: "docs"
---

{% assign posts = site.categories.Django %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}
