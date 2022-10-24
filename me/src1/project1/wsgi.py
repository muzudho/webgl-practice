"""
WSGI config for project1 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

# O2o1o0g9o1o3o0 プロジェクト名の一般化
from .settings import PROJECT_NAME
#    ]--------        ------------
#    12               3
# 1. 同じディレクトリー
# 2. `src1/projectN/settings.py`
#                   --------
# 3. 変数

from django.core.wsgi import get_wsgi_application

# * 変更前
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project1.settings')
# * 変更後
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'{PROJECT_NAME}.settings')
#                                                 -----------------------
#                                                 1
# 1. 設定モジュール名 `src1/projectN/settings.py`
#                         -----------------

application = get_wsgi_application()
