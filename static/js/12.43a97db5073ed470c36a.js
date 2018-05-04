webpackJsonp([12,59],{356:function(n,e){n.exports={rawContent:"\n[余弦相似性](https://zh.wikipedia.org/wiki/%E4%BD%99%E5%BC%A6%E7%9B%B8%E4%BC%BC%E6%80%A7): 通过计算两个向量的夹角余弦值来评估他们的相似度。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/bg2013032002.png)\n\n余弦值越接近1，就表明夹角越接近0度，也就是两个向量越相似。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/bg2013032007.png)\n\n\n在[上一篇文章](http://samurais.github.io/development/2017/06/17/word2vec/)中，给出了使用gensim的方法，如果模型通过[word2vec](https://code.google.com/archive/p/word2vec)训练好了```bin```格式的文件。\n\n```\n#! /bin/bash \n\n# constants\nbaseDir=$(cd `dirname \"$0\"`;pwd)\nW2V_CMD=word2vec/src/word2vec\nDATA=source.wordseg\nOUTPUT=w2v.bin\n\n# functions\n\n# main \n[ -z \"${BASH_SOURCE[0]}\" -o \"${BASH_SOURCE[0]}\" = \"$0\" ] || return\ncd $baseDir\n$W2V_CMD -train $DATA \\\n    -output $OUTPUT \\\n    -size 100 \\\n    -window 5 \\\n    -sample 1e-5 \\\n    -negative 1 \\\n    -hs 0 \\\n    -cbow 0 \\\n    -iter 30 \\\n    -binary 1 \\\n    -min-count 5 \\\n    -threads 20\n```\n\n## Graph Visual of Words\nWord2Vec + Principal Component Analysis + Clustering for low-dimensional semantic representation of a set of words or compositional MWEs.\n\n```\nhttps://github.com/Samurais/visual-word2vec\n```\n\n## 怎么通过其获得两个句子的相似度呢？\n\n```python\n#!/usr/bin/env python\n# -*- coding: utf-8 -*-\n#===============================================================================\n#\n# Copyright (c) 2017 <stakeholder> All Rights Reserved\n#\n#\n# File: /Users/hain/calculate_similarity.py\n# Author: Hai Liang Wang\n# Date: 2017-07-29:14:09:27\n#\n#===============================================================================\n\n\"\"\"\n   Calcualte similarity with word2vec model.\n   http://code.google.com/p/word2vec/\n\"\"\"\nfrom __future__ import print_function\nfrom __future__ import division\n\n__copyright__ = \"Copyright (c) 2017 . All Rights Reserved\"\n__author__ = \"Hai Liang Wang\"\n__date__ = \"2017-07-29:14:09:27\"\n\n\nimport os\nimport sys\ncurdir = os.path.dirname(os.path.abspath(__file__))\nsys.path.append(curdir)\n\nif sys.version_info[0] < 3:\n    reload(sys)\n    sys.setdefaultencoding(\"utf-8\")\n    # raise \"Must be using Python 3\"\n\nimport numpy as np\n\n# for text format, can resolve vector size with the model file.\nW2V_DIM_SZIE = os.environ['W2V_DIM_SZIE'] if 'W2V_DIM_SZIE' in os.environ else 100\n\ndef load_model(model_file = './w2v.bin', binary=True):\n    '''\n    Load model with C format word2vec file.\n    '''\n    if not os.path.exists(model_file):\n        raise Exception(\"Model file does not exist.\")\n    from gensim.models.keyedvectors import KeyedVectors\n    return KeyedVectors.load_word2vec_format(model_file, binary=binary, unicode_errors='ignore')\n\n# lambdas for cos similarity\nsim_molecule = lambda x: np.sum(x, axis=0) # 分子\nsim_denominator = lambda x: np.sqrt(np.sum(np.square(x)))  # 分母 \n\ndef similarity_distance(sentence1, sentence2, V):\n    '''\n    compute cosine similarity of v1 to v2:\n        (v1 dot v2)/{||v1||*||v2||)\n    '''\n\n    def _vector(sentence):\n        vectors = []\n        for x,y in enumerate(sentence.split()):\n            try:\n                y = y.decode('utf-8', errors='ignore').strip()\n                if y: # discard word if empty\n                    v =  V.wv[y]\n                    vectors.append(v)\n            except KeyError, error:\n                # define W2V_DIM_SZIE in environment\n                vectors.append(np.zeros(W2V_DIM_SZIE, dtype=float))\n\n        return vectors\n\n    # todo, compute OOV words\n    # print(\"v1\", sentence1_vectors)\n    # print(\"v2\", sentence2_vectors)\n\n    a = sim_molecule(_vector(sentence1))\n    b = sim_molecule(_vector(sentence2))\n    A = sim_denominator(a)\n    B = sim_denominator(b)\n\n    similarity = np.dot(a, b) / (A * B)\n    return float(\"%.3f\" % similarity)\n\ndef test():\n    txts = [\"登录 不 上去 怎么办 \", \"扫码 一直 不 能 成功 怎么办\"]\n    V = load_model(model_file='./w2v.bin', binary=True)\n    print('loaded.')\n    print(similarity_distance(txts[0], txts[1], V))\n\nclass SimilarityCalculator():\n    '''\n    Similarity Calculator\n    '''\n\n    def __init__(self, model_file, binary=True):\n        self.V = load_model(model_file=model_file, binary=binary)\n\n    def distance(self, s1, s2):\n        return similarity_distance(s1, s2, V=self.V)\n\nif __name__ == '__main__':\n    test()\n```\n\n",metaData:{layout:"post",title:"Word2Vec（三） - 模型训练和计算余弦距离",excerpt:"判断两个文章或者句子相似程度的一个算法。根据向量坐标，绘制在空间中，求得夹角的Cos值。Cos值越接近1，则说明夹角越小，即两向量相似。",category:"development",tags:["nlp"],disqus:!0}}}});