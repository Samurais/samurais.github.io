webpackJsonp([7,41],{318:function(n,o){n.exports={rawContent:"\n## Get started gensim\n```\nhttps://github.com/Samurais/word2vec_get_started\n```\n\n## 训练\n\n* 构建词汇表\ndict\n\n* 将文件(doc collection)按行处理成向量\ncorpus\n\n```\ncorpus = []\ncorpus_memory_friendly = MyCorpus()\nfor vector in corpus_memory_friendly:\n    corpus.append(vector)\n\ncorpora.MmCorpus.serialize('../data/deerwester.mm', corpus)\n```\n\n* 使用 corpus 训练 transform\n\n```\ndictionary = corpora.Dictionary.load('../data/deerwester.dict')\ncorpus = corpora.MmCorpus('../data/deerwester.mm')\nlsi = models.LsiModel(corpus, id2word=dictionary, num_topics=2)\n```\n\ntransfrom有很多种，比如 tf-idf, lsi, etc.\n\n不同transform可以 chain起来。有的transform可以在初始化后，使用append的模式更新，有的则不能。\n\ntopic用来指代被分布到多维空间的doc。对于 lsi可以等可以指定多维，根据语料大小衡量。\n\n* 使用余弦距离计算相似度\n\n```\ndoc = \"Human computer interaction\"\nvec_bow = dictionary.doc2bow(doc.lower().split())\nvec_lsi = lsi[vec_bow]\n\nindex = similarities.MatrixSimilarity(lsi[corpus])\nsims = index[vec_lsi]\n\nsims = sorted(enumerate(sims), key=lambda item: -item[1])\nprint(sims)\n```\n\n## 参考\n\n[论文地址](http://papers.nips.cc/paper/5021-distributed-representations-of-words-and-phrases-and-their-compositionality.pdf)\n\n[Google官方实现(C版本)](https://code.google.com/archive/p/word2vec/source/default/source)\n\n[Python开源实现](https://radimrehurek.com/gensim/tutorial.html)\n\n[word2vec in TensorFlow](https://www.tensorflow.org/tutorials/word2vec)",metaData:{layout:"post",title:"Word2Vec",excerpt:"Word2Vec完成了从文字，句子到空间向量的映射，是计算相似度和检索常用的方法。在使用机器学习技术训练文本以前，常用来做Word Embedding。",category:"development",tags:["program"],disqus:!0}}}});