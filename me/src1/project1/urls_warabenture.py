# BOF [O3o1o0gA10o0]

from django.urls import path

# [O3o1o0gA10o0] こんにちわページ1.0版
from apps1.warabenture_vol1o0.views.hello.ver1o0 import HelloView
#          ------------------             ------        ---------
#          11                             12            2
#    -------------------------------------------
#    10
# 10, 12. ディレクトリー
# 11. アプリケーション
# 2. `12.` に含まれる __init__.py ファイルにさらに含まれるクラス


urlpatterns = [

    # [O3o1o0gA10o0] こんにちわページ1.0版
    path('hello/ver1.0/',
         # ------------
         # 1
         HelloView.render, name='hello'),
    #    ----------------        -----
    #    2                       3
    # 1. 例えば `http://example.com/hello/ver1.0/` のようなURLのパスの部分
    #                              -------------
    # 2. HelloView クラスの render 静的メソッド
    # 3. HTMLテンプレートの中で {% url 'hello' %} のような形でURLを取得するのに使える
]

# EOF O3o1o0gA10o0
