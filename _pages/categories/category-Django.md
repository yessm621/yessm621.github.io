---
title: "Django"
layout: archive
classes: wide
permalink: categories/Django
author_profile: true
sidebar_main: true
---


{% assign posts = site.categories.Django %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}