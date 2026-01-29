---
slug: notes
title: notes
excerpt: # 交通灯问题  交通灯问题本质上是计时，有两种实现方式，一是计时器，二是问询  计时器不考虑，因为他有不精确的问题，  样式 trafficLight  color  time => date  这
date: 2026-01-14
author: 小菜权
readTime: 4 分钟
tags: []
category: blog
image: https://picsum.photos/seed/384/1200/600
---

# 交通灯问题

交通灯问题本质上是计时，有两种实现方式，一是计时器，二是问询

计时器不考虑，因为他有不精确的问题，

样式
trafficLight  color

time => date

这里我们就用问询实现

TrafficLight 类
class TrafficLight(){
    constructor(lights){
        this._lights = lights
        this._currentIndex = 0;
        this._time = Date.now()
    }
    get currentLight(){
        return this._lights[this._currentIndex]
    }
    _disTime(){
        return Date.now() - this._time;
    }
    _update(){
        while(1){
            if(this._disTime() <= this.currentLight.date){
                break;
            }
            this._time += this.currentLight.date;
            this._currentIndex = (this._currentIndex +1) % this._lights.length;

        }

    }
    getCurrentLight(){
        this._update()
        return {
            color:this.currentLight.color,
            remain:this.currentLight.date - this._disTime()
        }
    }
}

const lights = [
    {
        type:"red",
        date:10000
    },
    {
        type:"yellow",
        date:3000
    },
    {
        type:"green",
        date:30000
    }
]
const  light =  new TrafficLight(lights);

let current = light.getCurrentLight();

current.color
current.time

const trafficLight =  document.querySelector('.traffic-light')
const time =  document.querySelector('.time')


function update(){
   const  current = light.getCurrentLight();
   trafficLight.classname = `traffic-light ${current.color}`
   time.textContent = Math.ceil(current.getTime() / 1000);

}

update()

function raf(){
    requestAnimationFrame(()=>{
        raf()
        update()
    })
}
raf()
