---
title: "Series"
layout: archive
classes: wide
permalink: categories/Series
author_profile: true
sidebar_main: true
---


{% assign posts = site.categories.Series %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}