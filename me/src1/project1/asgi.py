"""
ASGI config for project1 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# vvvv 追加ここから
# O2o1o0g9o1o1o0 プロジェクト名の一般化
from .settings import PROJECT_NAME
#    ]--------        ------------
#    12               3
# 1. 同じディレクトリー
# 2. `src1/projectN/settings.py`
#                   --------
# 3. 変数

# * 変更前
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project1.settings')
# * O2o1o0g9o1o1o0 プロジェクト名の一般化
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'{PROJECT_NAME}.settings')
#                                                 -----------------------
#                                                 1
# 1. 設定モジュール名 `src1/projectN/settings.py`
#                         -----------------
# ^^^^ 追加ここまで

application = get_asgi_application()
