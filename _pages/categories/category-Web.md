---
title: "Web"
layout: archive
classes: wide
permalink: categories/Web
author_profile: true
sidebar_main: true
---


{% assign posts = site.categories.Web %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}