---
title: "TestCode"
layout: archive
permalink: /TestCode
author_profile: true
sidebar:
    nav: "sidebar-category"
---


{% assign posts = site.categories.TestCode %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}