---
slug: promise
title: Promise
excerpt: ## promise  #### promise async/await  #### generator  遍历器    #### iterator    迭代器  #### promise 中断
date: 2025-12-18
author: 小菜权
readTime: 2 分钟
tags: []
category: blog
image: https://picsum.photos/seed/824/1200/600
---

## promise

#### promise async/await

#### generator  遍历器  

#### iterator    迭代器

#### promise 中断

#### promise resolve（）后代码是否会执行
```js
async function test(){
    let arr=[3,2,1];
    for(const item of arr){
        const res =await fetch(item);
        console.log(res);
    }
    console.log("end");
}
```

```js
async function test(){
    let arr =[3,2,1];
    for(var i=0;i< arr.length;i++){
        const res = await fetch(arr[i]);
        console.log(res);
    }
    console.log("end");
}
function fetch(x) {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(x);
        },500 * x);
    });
}
test();
```
