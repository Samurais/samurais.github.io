webpackJsonp([33,59],{335:function(t,n){t.exports={rawContent:'\n# TL;DR\n\n## 启动服务\n\n```\ndocker pull samurais/hanlp-api:1.0.0\ndocker run -it --rm -p 3002:3000 samurais/hanlp-api:1.0.0\n```\n\n\n## 访问服务\n\n* 中文分词\n\n```\nPOST /tokenizer HTTP/1.1\nHost: localhost:3002\nContent-Type: application/json\n \n{\n    "type": "nlp",\n    "content": "刘德华和张学友创作了很多流行歌曲"\n}\n```\n\n* 关键词提取\n\n```\nPOST /keyword HTTP/1.1\nHost: localhost:3002\nContent-Type: application/json\n \n{\n    "num": 1,\n    "content": "刘德华和张学友创作了很多流行歌曲"\n}\n```\n\n## 词性标记规范\n包含 ICTPOS3.0词性标记集、ICTCLAS 汉语词性标注集、jieba 字典中出现的词性、simhash 中可以忽略的部分词性\n\n词的分类\n========\n* 实词：名词、动词、形容词、状态词、区别词、数词、量词、代词\n* 虚词：副词、介词、连词、助词、拟声词、叹词。\n\nICTPOS3.0词性标记集\n===================\n\n    n 名词\n\t\tnr 人名\n\t\t\tnr1 汉语姓氏\n\t\t\tnr2 汉语名字\n\t\t\tnrj 日语人名\n\t\t\tnrf 音译人名\n\t\tns 地名\n\t\t　nsf 音译地名\n\t\tnt 机构团体名\n\t\tnz 其它专名\n\t\tnl 名词性惯用语\n\t\tng 名词性语素\n\n\tt 时间词\n\t　　tg 时间词性语素\n\n\ts 处所词\n\n\tf 方位词\n\n\tv 动词\n\t\tvd 副动词\n\t\tvn 名动词\n\t\tvshi 动词“是”\n\t\tvyou 动词“有”\n\t\tvf 趋向动词\n\t\tvx 形式动词\n\t\tvi 不及物动词（内动词）\n\t\tvl 动词性惯用语\n\t\tvg 动词性语素\n\ta 形容词\n\t\tad 副形词\n\t\tan 名形词\n\t\tag 形容词性语素\n\t\tal 形容词性惯用语\n\tb 区别词\n\t\tbl 区别词性惯用语\n\tz 状态词\n\tr 代词\n\t\trr 人称代词\n\t\trz 指示代词\n\t\t\trzt 时间指示代词\n\t\t\trzs 处所指示代词\n\t\t\trzv 谓词性指示代词\n\t\try 疑问代词\n\t\t\tryt 时间疑问代词\n\t\t\trys 处所疑问代词\n\t\t\tryv 谓词性疑问代词\n\t\trg 代词性语素\n\tm 数词\n\t\tmq 数量词\n\tq 量词\n\t\tqv 动量词\n\t\tqt 时量词\n\n虚词\n====\n\n\td 副词\n\tp 介词\n\t\tpba 介词“把”\n\t\tpbei 介词“被”\n\tc 连词\n\t\tcc 并列连词\n\tu 助词\n\t\tuzhe 着\n\t\tule 了 喽\n\t\tuguo 过\n\t\tude1 的 底\n\t\tude2 地\n\t\tude3 得\n\t\tusuo 所\n\t\tudeng 等 等等 云云\n\t\tuyy 一样 一般 似的 般\n\t\tudh 的话\n\t\tuls 来讲 来说 而言 说来\n\n\t\tuzhi 之\n\t\tulian 连 （“连小学生都会”）\n\n\te 叹词\n\ty 语气词(delete yg)\n\to 拟声词\n\th 前缀\n\tk 后缀\n\tx 字符串\n\t\txx 非语素字\n\t\txu 网址URL\n\tw 标点符号\n\t\twkz 左括号，全角：（ 〔  ［  ｛  《 【  〖 〈   半角：( [ { <\n\t\twky 右括号，全角：） 〕  ］ ｝ 》  】 〗 〉 半角： ) ] { >\n\t\twyz 左引号，全角：“ ‘ 『\n\t\twyy 右引号，全角：” ’ 』\n\t\twj 句号，全角：。\n\t\tww 问号，全角：？ 半角：?\n\t\twt 叹号，全角：！ 半角：!\n\t\twd 逗号，全角：， 半角：,\n\t\twf 分号，全角：； 半角： ;\n\t\twn 顿号，全角：、\n\t\twm 冒号，全角：： 半角： :\n\t\tws 省略号，全角：……  …\n\t\twp 破折号，全角：——   －－   ——－   半角：---  ----\n\t\twb 百分号千分号，全角：％ ‰   半角：%\n\t\twh 单位符号，全角：￥ ＄ ￡  °  ℃  半角：$\n\n\nICTCLAS 汉语词性标注集\n========\n代码\t|\t名称\t|\t帮助记忆的诠释\n----\t|\t----\t|\t--------------\nAg\t|\t形语素\t|\t形容词性语素。形容词代码为a，语素代码ｇ前面置以A。\na\t|\t形容词\t|\t取英语形容词adjective的第1个字母。\nad\t|\t副形词\t|\t直接作状语的形容词。形容词代码a和副词代码d并在一起。\nan\t|\t名形词\t|\t具有名词功能的形容词。形容词代码a和名词代码n并在一起。\nb\t|\t区别词\t|\t取汉字“别”的声母。\nc\t|\t连词\t|\t取英语连词conjunction的第1个字母。\nDg\t|\t副语素\t|\t副词性语素。副词代码为d，语素代码ｇ前面置以D。\nd\t|\t副词\t|\t取adverb的第2个字母，因其第1个字母已用于形容词。\ne\t|\t叹词\t|\t取英语叹词exclamation的第1个字母。\nf\t|\t方位词\t|\t取汉字“方” 的声母。\ng\t|\t语素\t|\t绝大多数语素都能作为合成词的“词根”，取汉字“根”的声母。\nh\t|\t前接成分\t|\t取英语head的第1个字母。\ni\t|\t成语\t|\t取英语成语idiom的第1个字母。\nj\t|\t简称略语\t|\t取汉字“简”的声母。\nk\t|\t后接成分\t|\nl\t|\t习用语\t|\t习用语尚未成为成语，有点“临时性”，取“临”的声母。\nm\t|\t数词\t|\t取英语numeral的第3个字母，n，u已有他用。\nNg\t|\t名语素\t|\t名词性语素。名词代码为n，语素代码ｇ前面置以N。\nn\t|\t名词\t|\t取英语名词noun的第1个字母。\nnr\t|\t人名\t|\t名词代码n和“人(ren)”的声母并在一起。\nns\t|\t地名\t|\t名词代码n和处所词代码s并在一起。\nnt\t|\t机构团体\t|\t“团”的声母为t，名词代码n和t并在一起。\nnz\t|\t其他专名\t|\t“专”的声母的第1个字母为z，名词代码n和z并在一起。\t|\no\t|\t拟声词\t|\t取英语拟声词onomatopoeia的第1个字母。\np\t|\t介词\t|\t取英语介词prepositional的第1个字母。\nq\t|\t量词\t|\t取英语quantity的第1个字母。\nr\t|\t代词\t|\t取英语代词pronoun的第2个字母,因p已用于介词。\ns\t|\t处所词\t|\t取英语space的第1个字母。\nTg\t|\t时语素\t|\t时间词性语素。时间词代码为t,在语素的代码g前面置以T。\nt\t|\t时间词\t|\t取英语time的第1个字母。\nu\t|\t助词\t|\t取英语助词auxiliary 的第2个字母,因a已用于形容词。\nVg\t|\t动语素\t|\t动词性语素。动词代码为v。在语素的代码g前面置以V。\nv\t|\t动词\t|\t取英语动词verb的第一个字母。\nvd\t|\t副动词\t|\t直接作状语的动词。动词和副词的代码并在一起。\nvn\t|\t名动词\t|\t指具有名词功能的动词。动词和名词的代码并在一起。\nw\t|\t标点符号\t|\nx\t|\t非语素字\t|\t非语素字只是一个符号，字母x通常用于代表未知数、符号。\ny\t|\t语气词\t|\t取汉字“语”的声母。\nz\t|\t状态词\t|\t取汉字“状”的声母的前一个字母。\n\n[来源](https://gist.github.com/luw2007/6016931#file-md)\n\n## Further Reading\nhttp://www.hankcs.com/nlp/hanlp.html\nhttps://www.npmjs.com/package/node-hanlp',metaData:{layout:"post",title:"中文分词及词性标注",excerpt:"支持中文分词（N-最短路分词、CRF分词、索引分词、用户自定义词典、词性标注），命名实体识别（中国人名、音译人名、日本人名、地名、实体机构名识别），关键词提取，自动摘要，短语提取，拼音转换，简繁转换，文本推荐，依存句法分析（MaxEnt依存句法分析、CRF依存句法分析）",category:"development",tags:["pos"],disqus:!0}}}});