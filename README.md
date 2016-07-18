ShortURL Generator
===================


----------


> **Demo:**

> - https://shorturlpi2.herokuapp.com

> **Design Description:**

> - 简介：短链接核心在将原网址储存在DB中然后递增顺序发号。DB递增id的进制是10进制，每次储存完了网址之后返回这个递增的10进制id，通过服务器算法算出相应62进制的5位字母+数字的id。由于一开始10进制id是从个位数开始，所以转换为62进制的时候会空位，那么就以字典中的第0位去填充。整个算法极限是500亿10进制之后62进制才会出现重复，所以是很难达到的。

> - Shorturl parse algorithm: 1. Check and save the original url into the database and get decimal id. 2. Translate the decimal id into 62bit id using[0-9, a-z, A-Z] codex. 3. Server side monitoring the /:shorturl to redirect.  
> - Database Schema: 
```sh
var urlSchema = new Schema({
    url: String,// original url
    id : Number // decimal number id
});
```

> **Limitation:**
> - Javascript int:  javascript max integer = 9007199254740992
> - Unique result 1:1 from decimal id  to 62bit id: 50 billion

