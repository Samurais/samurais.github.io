webpackJsonp([33,52],{314:function(n,e){n.exports={rawContent:'\n>  声明：请尊重原创，转载注明来源网站[Chatbot Master](http://blog.chatbot.io)\n\n距离[上一篇文章](http://blog.chatbot.io/development/2017/01/02/approaching-a-chatbot-service-part-2-bot-engine/)的发布也有一段时间了，这一个月左右的时间，一点也没有闲下来，直到春节终于有点时间总结一下。\n\n在春晚开播的前五分钟，终于将项目重构了一下，而且以开源的形式回馈到社区。\n\n[https://github.com/Samurais/DeepQA2](https://github.com/Samurais/DeepQA2)\n\n本篇文章也就以这个开源项目为主线进行。\n\n# 数据预处理\n\n模型能聊的内容也取决于选取的语料。如果已经具备了原始聊天数据，可以用SQL通过关键字查询一些对话，也就是从大库里选取出一个小库来训练。从一些论文上，很多算法都是在数据预处理层面的，比如[Mechanism-Aware Neural Machine\nfor Dialogue Response Generation](http://git.oschina.net/ubiware/tech-books/blob/master/machine-learning-papers/aware_neural_machine_wechat_lin_fen.pdf?dir=0&filepath=machine-learning-papers%2Faware_neural_machine_wechat_lin_fen.pdf&oid=6cfcc46afb3e31e12f173d6f0a807dafa6ef8a54&sha=0c80890d5897933346fbce09452011a2a052f0c5)就介绍了，从大库中抽取小库，然后再进行融合，训练出有特色的对话来。\n\n![参考文献 7](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-12.37.01-PM.png "Ref 7")\n\n\n<p align="center">\n<i>【图 3-1】 语料预处理, Ref. #7 </i>\n</p>\n\n对于英语，需要了解[NLTK](http://www.nltk.org/book/)，NLTK提供了加载语料，语料标准化，语料分类，PoS词性标注，语意抽取等功能。\n\n另一个功能强大的工具库是[CoreNLP](http://stanfordnlp.github.io/CoreNLP/)，作为 Stanford开源出来的工具，特色是实体标注，语意抽取，支持多种语言。\n\n下面主要介绍两个内容：\n\n## 中文分词\n现在有很多[中文分词的SDK](http://mp.weixin.qq.com/s/PcinWNcumoOLiJ_eNwpt4w),分词的算法也比较多，也有很多文章对不同SDK的性能做比较。做中文分词的示例代码如下。\n\n```\n# coding:utf8\n\'\'\'\nSegmenter with Chinese\n\'\'\'\n\nimport jieba\nimport langid\n\n\ndef segment_chinese_sentence(sentence):\n    \'\'\'\n    Return segmented sentence.\n    \'\'\'\n    seg_list = jieba.cut(sentence, cut_all=False)\n    seg_sentence = u" ".join(seg_list)\n    return seg_sentence.strip().encode(\'utf8\')\n\n\ndef process_sentence(sentence):\n    \'\'\'\n    Only process Chinese Sentence.\n    \'\'\'\n    if langid.classify(sentence)[0] == \'zh\':\n        return segment_chinese_sentence(sentence)\n    return sentence\n\nif __name__ == "__main__":\n    print(process_sentence(\'飞雪连天射白鹿\'))\n    print(process_sentence(\'I have a pen.\'))\n\n```\n\n以上使用了**langid**先判断语句是否是中文，然后使用[jieba](https://github.com/fxsjy/jieba)进行分词。\n\n在功能上，jieba分词支持全切分模式，精确模式和搜索引擎模式。\n\n**全切分**：输出所有分词。\n\n**精确**：概率上的最佳分词。\n\n**所有引擎模式**：对精确切分后的长句再进行分词。\n\n### jieba分词的实现\n\n主要是分成下面三步：\n\n1)加载字典，在内存中建立字典空间。\n\n字典的构造是每行**一个词，空格，词频，空格，词性**。\n```\n上诉书 3 n\n上诉人 3 n\n上诉期 3 b\n上诉状 4 n\n上课 650 v\n```\n\n建立字典空间的是使用python的dict，采用前缀数组的方式。\n\n使用前缀数组的原因是树结构只有一层 - **word:freq**，效率高，节省空间。比如单词"dog", 字典中将这样存储：\n\n```\n{\n  "d": 0,\n  "do": 0,\n  "dog": 1 # value为词频\n}\n```\n\n==字典空间==的主要用途是对输入句子建立==有向无环图==，然后根据**算法**进行==切分==。算法的取舍主要是根据*模式* - 全切，精确还是搜索。\n\n2)对输入的语句分词，首先是建立一个有向无环图。 \n有向无环图, [Directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) (音 /ˈdæɡ/)。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-12.23.34-PM.png)\n\n\n<p align="center">\n<i>【图 3-2】 DAG</i>\n</p>\n\nDAG对于后面计算最大概率路径和使用HNN模型识别新词有直接关系。\n\n\n3)按照模式，对有向无环图进行遍历，比如，在精确模式下，便利就是求最大权重和的路径，权重来自于在字典中定义的词频。对于没有出现在词典中的词，连续的单个字符也许会构成新词。然后用HMM模型和Viterbi算法识别新词。\n\n\n精确模型切词：使用[动态规划](http://www.hawstein.com/posts/dp-novice-to-advanced.html)对最大概率路径进行求解。\n\n最大概率路径：求route = (w1, w2, w3 ,.., wn)，使得Σweight(wi)最大。Wi为该词的词频。\n\n更多的细节还需要读一下jieba的[源码](https://github.com/fxsjy/jieba)。\n\n### 自定义字典\n\njieba分词默认的字典是:1998人民日报的切分语料还有一个msr的切分语料和一些txt小说。开发者可以自行添加字典，只要符合字典构建的格式就行。\n\njieba分词同时提供接口添加词汇。\n\n## Word embedding\n\n使用机器学习训练的语言模型，网络算法是使用数字进行计算，在输入进行编码，在输出进行解码。word embedding就是编解码的手段。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-12.37.06-PM.png)\n\n<p align="center">\n<i>【图 3-3】 word embedding, Ref. #7</i>\n</p>\n\nword embedding是文本的数值化表示方法。表示法包括one-hot，bag of words，N-gram，分布式表示，共现矩阵等。 \n\n### Word2vec\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-1.41.09-PM.png)\n\n近年来，[word2vec](https://code.google.com/archive/p/word2vec/%20%20)被广泛采用。Word2vec输入文章或者其他语料，输出语料中词汇建设的词向量空间。详细可参考[word2vec数学原理解析](http://www.open-open.com/lib/view/open1420687569468.html)。\n\n\n* 使用word2vec\n\n[安装](https://radimrehurek.com/gensim/install.html)完成后，得到word2vec命令行工具。\n\n```\nword2vec -train "data/review.txt" \\\n  -output "data/review.model" \\\n  -cbow 1 \\\n  -size 100 \\\n  -window 8 \\\n  -negative 25 \\\n  -hs 0 \\\n  -sample 1e-4 \\\n  -threads 20 \\\n  -binary 1 \\\n  -iter 15\n```\n\n-train "data/review.txt" 表示在指定的语料库上训练模型\n\n-cbow 1 表示用cbow模型，设成0表示用skip-gram模型\n\n-size 100 词向量的维度为100\n\n-window 8 训练窗口的大小为8   即考虑一个单词的前八个和后八个单词\n\n-negative 25 -hs 0  是使用negative sample还是HS算法\n\n-sample 1e-4 采用阈值\n\n-threads 20 线程数\n\n-binary 1 输出model保存成2进制 \n\n-iter 15 迭代次数\n\n在训练完成后，就得到一个model，用该model可以查询每个词的词向量，在词和词之间求距离，将不同词放在数学公式中计算输出相关性的词。比如：\n\n```\nvector("法国") - vector("巴黎) + vector("英国") = vector("伦敦")"\n```\n\n对于训练不同的语料库，可以单独的训练词向量模型，可以利用已经训练好的模型。\n\n其它训练词向量空间工具推荐：[Glove](http://nlp.stanford.edu/projects/glove/)。\n\n# Seq2Seq\n2014年，[Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)提出了使用深度学习技术，基于RNN和LSTM网络训练翻译系统，取得了突破，这一方法便应用在更广泛的领域，比如问答系统，图像字幕，语音识别，撰写诗词等。Seq2Seq完成了【encoder + decoder -> target】的映射，在上面的论文中，清晰的介绍了实现方式。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-5.22.46-PM.png)\n\n<p align="center">\n<i>【图 3-4】 Seq2Seq, Ref. #1</i>\n</p>\n\n也有很多文章解读它的原理。在使用Seq2Seq的过程中，虽然也研究了它的结构，但我还不认为能理解和解释它。下面谈两点感受：\n\n*a*. RNN保存了语言顺序的特点，这和CNN在处理带有形状的模型时如出一辙，就是数学模型的设计符合物理模型。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-4.52.06-PM.png)\n\n\n<p align="center">\n<i>【图 3-5】 RNN, Ref. #6</i>\n</p>\n\n*b*. LSTM Cell的复杂度对应了自然语言处理的复杂度。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-4.52.25-PM.png)\n<p align="center">\n<i>【图 3-6】 LSTM, Ref. #6</i>\n</p>\n\n理由是，有人将LSTM Cell尝试了多种其它方案传递状态，结果也很好。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-4.56.51-PM.png)\n\n<p align="center">\n<i>【图 3-7】 GRU, Ref. #6</i>\n</p>\n\n**LSTM**的一个替代方案：**GRU**。**只要RNN的Cell足够复杂，它就能工作的很好。**\n\n# 使用DeepQA2训练语言模型\n\n准备工作，下载项目：\n```\ngit clone https://github.com/Samurais/DeepQA2.git\ncd DeepQA2\nopen README.md # 根据README.md安装依赖包\n```\n\nDeepQA2将工作分成三个过程：\n\n*a*. 数据预处理：从语料库到数据字典。\n\n*b*. 训练模型：从数据字典到语言模型。\n\n*c*. 提供服务：从语言模型到RESt API。\n\n\n## 预处理\nDeepQA2使用[Cornell Movie Dialogs Corpus](www.cs.cornell.edu/~cristian/Cornell_Movie-Dialogs_Corpus.html)作为demo语料库。\n\n原始数据就是[movie\\_lines.txt](https://github.com/Samurais/DeepQA2/blob/master/data/cornell/movie_lines.txt) 和[movie\\_conversations.txt](https://github.com/Samurais/DeepQA2/blob/master/data/cornell/movie_conversations.txt)。这两个文件的组织形式参考[README.txt](https://github.com/Samurais/DeepQA2/tree/master/data/cornell)\n\n**deepqa2/dataset/preprocesser.py**是将这两个文件处理成数据字典的模块。\n \n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-5.21.04-PM.png)\n\n*train_max_length_enco*就是*问题*的长度，*train_max_length_deco*就是*答案*的长度。在语料库中，大于该长度的部分会被截断。\n\n程序运行后，会生成*dataset-cornell-20.pkl*文件，它加载到python中是一个字典：\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-5.27.24-PM.png)\n\n*word2id*存储了{word: id}，其中word是一个单词，id是int数字，代表这个单词的id。\n\n*id2word*存储了{id: word}。\n\n*trainingSamples*存储了问答的对话对。\n\n\n> 比如 [[[1,2,3],[4,5,6]], [[7,8,9], [10, 11, 12]]]\n\n1，2，3 ... 12 都是word id。\n\n[1,2,3] 和 [4,5,6] 构成一个问答。\n[7,8,9] 和 [10, 11, 12] 构成一个问答。\n\n## 开始训练\n\n```\ncp config.sample.ini config.ini # modify keys\npython deepqa2/train.py\n```\n\nconfig.ini是配置文件, 根据config.sample.ini进行修改。训练的时间由epoch，learning rate, maxlength和对话对的数量而定。\n\ndeepqa2/train.py大约100行，完成数据字典加载、初始化tensorflow的session，saver，writer、初始化神经元模型、根据epoch进行迭代，保存模型到磁盘。\n\n*session*是网络图，由placeholder, variable, cell, layer, output 组成。\n\n*saver*是保存model的，也可以用来恢复model。model就是实例化variable的session。\n\n*writer*是查看loss fn或者其他开发者感兴趣的数据的收集器。writer的结果会被*saver*保存，然后使用*tensorboard*查看。\n\n![](https://ischlag.github.io/images/cost_graph.png)\n\n<p align="center">\n<i>【图 3-8】 TensorBoard</i>\n</p>\n\n### Model\nModel的构建要考虑输入，状态，softmax，输出。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-5.51.32-PM.png)\n\n定义损耗函数，使用*AdamOptimizer*进行迭代。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-6.28.37-PM.png)\n\n最后，参考一下训练的loop部分。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-6.33.40-PM.png)\n\n每次训练，model会被存储在 *save*路径下，文件夹的命名根据机器的hostname，时间戳生成。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/02/Screen-Shot-2017-02-07-at-6.35.57-PM.png)\n\n## 提供服务\n在TensorFlow中，提供了标准的serving模块 - tensorflow serving。但研究了很久，还专门看了一遍 《C++ Essentials》，还没有将它搞定，社区也普遍抱怨tensorflow serving不好学，不好用。训练结束后，使用下面的脚本启动服务，DeepQA2的serve部分还是调用TensorFlow的python api。\n\n```\ncd DeepQA2/save/deeplearning.cobra.vulcan.20170127.175256/deepqa2/serve\ncp db.sample.sqlite3 db.sqlite3 \npython manage.py runserver 0.0.0.0:8000\n```\n\n测试\n```\nPOST /api/v1/question HTTP/1.1\nHost: 127.0.0.1:8000\nContent-Type: application/json\nAuthorization: Basic YWRtaW46cGFzc3dvcmQxMjM=\nCache-Control: no-cache\n\n{"message": "good to know"}\n\nresponse\n{\n  "rc": 0,\n  "msg": "hello"\n}\n```\n\n> *serve*的核心代码在[*serve/api/chatbotmanager.py*](https://github.com/Samurais/DeepQA2/blob/master/deepqa2/serve/api/chatbotmanager.py)中。\n\n\n### 使用脚本\n\n\n[scripts/start_training.sh](https://github.com/Samurais/DeepQA2/blob/master/scripts/start_training.sh) 启动训练\n\n[scripts/start_tensorboard.sh](https://github.com/Samurais/DeepQA2/blob/master/scripts/start_tensorboard.sh) 启动Tensorboard\n\n[scripts/start_serving.sh](https://github.com/Samurais/DeepQA2/blob/master/scripts/start_serving.sh) 启动服务\n\n\n\n# 对模型的评价\n目前代码具有很高的维护性，这也是从DeepQA项目进行重构的原因，更清晰的数据预处理、训练和服务。有新的变更可以添加到*deepqa2/models*中，然后在*train.py*和*chatbotmanager.py*变更一下。\n\n# 有待改进的地方 \n\na. 新建models/rnn2.py, 使用dropout。目前DeepQA中已经使用了Drop.\n\nb. tensorflow rc0.12.x中已经提供了seq2seq network，可以更新成tf版本.\n\nc. 融合训练，目前model只有一个库，应该是设计一个新的模型，支持一个大库和小库，不同权重进行，就如[Mechanism-Aware Neural Machine\nfor Dialogue Response Generation](http://git.oschina.net/ubiware/tech-books/blob/master/machine-learning-papers/aware_neural_machine_wechat_lin_fen.pdf?dir=0&filepath=machine-learning-papers%2Faware_neural_machine_wechat_lin_fen.pdf&oid=6cfcc46afb3e31e12f173d6f0a807dafa6ef8a54&sha=0c80890d5897933346fbce09452011a2a052f0c5)的介绍。\n\nd. 代码支持多机多GPU运行。\n\ne. 目前训练的结果都是QA对，对于一个问题，可以有多个答案。\n\nf. 目前没有一个方法进行*accuracy*测试，一个思路是在训练中就提供干扰项，因为当前只有正确的答案，如果提供错误的答案（而且越多越好），就可以使用recall\\_at\\_k方法进行测试。\n\n\n# References\n[1. A Neural Conversational Model](https://arxiv.org/pdf/1506.05869v3.pdf)\n\n[2. Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)\n\n[3. DeepQA Project](https://github.com/Conchylicultor/DeepQA)\n\n[4. Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)\n\n[5. jieba分词分析](http://zhazha.me/jieba%E5%88%86%E8%AF%8D%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%EF%BC%88%E4%BA%8C%EF%BC%89/)\n\n[6. Tensorflow and deep learning - without a PhD by Martin Görner](https://www.youtube.com/watch?v=vq2nnJ4g6N0&t=478s)\n\n[7. Pragmatic NLP by Matt Fortier](http://git.oschina.net/ubiware/tech-books/raw/master/nlp/TALK_PragmaticNLP.pdf)\n\n# Star\n\n如果你觉得本文对你有帮助，请帮忙star。\n\n```\nhttps://github.com/Samurais/DeepQA2\n```',metaData:{layout:"post",title:"Approaching a Chatbot Service - Part 3: Bot Model",excerpt:"主要介绍基于Seq2Seq Network的生成式的语言模型。",category:"development",tags:["thoughts"],disqus:!0}}}});