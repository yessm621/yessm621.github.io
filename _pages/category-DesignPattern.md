---
title: "DesignPattern"
layout: archive
permalink: /DesignPattern
author_profile: true
sidebar:
    nav: "sidebar-category"
---


{% assign posts = site.categories.DesignPattern %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}