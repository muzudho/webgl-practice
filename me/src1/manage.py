#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project1.settings')
    #                                                -----------------
    #                                                1
    # 1. Django設定のPythonモジュール。分からなければ、Djangoの設定ファイル（src1/project1/settings.py）の拡張子抜きのドット区切りと考えればよい
    #                                                                        -----------------
    #    例えばレッスンの最初に project1 プロジェクトを作成したなら、
    #    デフォルトでは project1 プロジェクトの settings.py ファイルを指定するようハードコーディングされる。
    #    コマンドライン引数で設定ファイルを指定できるので、ここを編集する必要はない    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
