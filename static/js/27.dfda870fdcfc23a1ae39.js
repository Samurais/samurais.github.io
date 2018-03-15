webpackJsonp([27,58],{332:function(n,e){n.exports={rawContent:'\n现在时间是7点半，8点下班回家，在这半个小时，让我们来聊聊SuperScript 和 Wechaty 结合带来的巨大前景。\n\n![Blue and Red pill](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/blog/samurais-the-matrix.jpg)\n\nWechaty就像是连到母体的管道，当我们还在思考着是吃红药片还是蓝药片的时候，pia，[zixia](https://github.com/zixia)就把Wechaty给做出来。然后呢？！\n\n对话，对话，对话。\n\n<!--more-->\n\n# SuperScript \n\nSuperScript是一个开源的对话引擎。使用SuperScript定义的语法，书写脚本文件，然后使用编译工具，生成对话元数据。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/blog/samrais-ss-1.png)\n\n## 脚本\n\n* 简单\n\n```\n+ 你好\n- 你好\n```\n\n用户说"你好"，bot回复"你好"\n\n* 变形\n\n```\n+ 你(在|毕业于)哪个学校\n- {keep} 北京信息科技大学\n\n+ 清河小营 [校区]\n- {keep} 我也在附近\n```\n\n"你在哪个学校"，"你毕业于哪个学校"，都会得到回复："北京信息科技大学"\n\n"清河小营"，"清河小营校区"，都会得到回复: "北京信息科技大学"\n\n\n* 插件\n\n```\n+ 聊天是一门艺术\n- {keep} ^checkMessageFeatures() 编程是一项工艺\n\n+ <nouns>是中国首屈一指的学府\n- {keep} ^checkMessageFeatures() 北京邮电大学也是\n```\n\n*checkMessageFeatures* 是一个插件，在SuperScript里，插件就是一个被注入了对话上下文环境的JavaScript函数。利用函数，我们可以实现任何业务逻辑。\n\n* 关键词提取\n\n```\n// Generic wildcards\n+ 他在旧金山创立的对冲基金 (*) 依靠 (*) 算法来处理所有的交易\n- {keep} <cap1>是一家公司<cap2>\n\n// Exact length wildcards\n+ 家里 *2 坏了\n// 此处匹配两个字\n- {keep} <cap1>坏了很多次了\n\n// Min-max wildcards\n+ 今天是 *(5-8)\n// 此处匹配5-8个字\n- {keep} 祝大家玩的开心\n\n+ [今天] (*) 天气(怎么样|如何|好么)\n- {keep} ^getWeather(<cap1>)\n```\n\n所以，在回复中，\\<capN\\> 对应着 开场白里的 *。\n注意上面的 *^getWeather*，这里是插件。[*getWeather*](https://github.com/Samurais/ss-spa/blob/develop/plugins/index.plugin.js#L24)可以实现天气查询功能。\n\n更多[介绍](http://www.leiphone.com/news/201704/JvBW78wfyvcfB4xW.html)。\n\n\n# SuperScript and Wechaty\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/blog/samurias-hifive.jpg)\n\n```\ngit clone git@github.com:Samurais/ss-wechaty.git && cd ss-wechaty\nscripts/start-docker-compose.sh\n```\n\n## Take a close look\n\n```\ngit@github.com:Samurais/ss-spa.git && cd ss-spa\nnpm install\ncp config/environment/development.sample.js config/environment/development.js # 修改配置文件\nnpm run dev:start\n```\n\n在ss-spa中，参考 **chat/zh_CN.ss**，书写新的脚本，依然放在 **chat**目录下，ss-spa会热加载。\n\n测试对话\n```\nopen http://localhost:3001\n```\n\n以任何用户名登入，并开始对话。\n\n同时支持使用 docker-compose 快速开始。\n```\ncd ss-spa\nscripts/build-docker-image.sh\nscripts/start-docker-spa.sh\n```\n\n## Deliver dialog with Wechaty\n现在，回到**ss-wechaty**。\n\n> 如果之前有启动，先停止并删除容器。\n\n```\nscripts/start-docker-compose.sh\n```\n\n\n# 后记\n现在是8:03分了，bye. 下期再见！\n\n[Click here to get the repo](https://github.com/samurais/ss-wechaty)\n',metaData:{layout:"post",title:"Deliver dialogs with SuperScript",excerpt:"SuperScript是一个开源的对话引擎。使用SuperScript定义的语法，书写脚本文件，然后使用编译工具，生成对话元数据，然后提供对话服务，本文使用wechaty和用户进行对接。",category:"development",tags:["engine"],disqus:!0}}}});