---
slug: 编码转码与-url
title: 编码转码与 url
excerpt:  #### 编码方式     1. escape()         除 ASCII字母，数字，标点符号“@*_+-./f” 外，编码     2. encodeURL()         除常见符号
date: 2025-12-18
author: 小菜权
readTime: 1 分钟
tags: []
category: blog
---

#### 编码方式
    1. escape()
        除 ASCII字母，数字，标点符号“@*_+-./f” 外，编码
    2. encodeURL()
        除常见符号外，还有特殊符号“;/?:@&=+$#”不编码，
    3. encodeURLComponent()
        “;/?:@&=+$#” 会编码



#### url组成
 
{protocol}//{host}:{port}/{path}?{search}#{hash}

`${url.protocol}//${url.host}:${url.port}${url.pathname}?${url.search}#${url.hash}`

#### window.location


#### new URL()

#### 跨域
