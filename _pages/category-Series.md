---
title: "Series"
layout: archive
permalink: /Series
author_profile: true
sidebar:
    nav: "sidebar-category"
---


{% assign posts = site.categories.Series %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}