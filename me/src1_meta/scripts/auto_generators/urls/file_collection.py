# BOF [O3o2o_1o0g2o_4o4o0]

import glob
from pathlib import Path


class FileCollection:

    @staticmethod
    def find_to(path_pattern):

        # 名前がマッチしているファイルを探す
        # print(f"[FileCollection find_to] path_pattern:{path_pattern}")
        target_path_objects = glob.glob(path_pattern)
        print(
            f"[DirectFileCollectionory find_to] len(target_path_objects):{len(target_path_objects)}")

        # 文字列のリストに変換
        target_path_str_list = []

        for target_path_o in target_path_objects:
            # print(f"[FileCollection find_to] target_path_o:{target_path_o}")
            target_path_str_list.append(str(target_path_o))

        return FileCollection(target_path_str_list)

    def __init__(self, target_path_str_list):
        self._target_path_str_list = target_path_str_list

    @property
    def target_path_str_list(self):
        return self._target_path_str_list

    def remove_all(self, removee_file_str_list):
        for file_str in removee_file_str_list:
            s = str(Path(file_str).absolute().resolve())
            try:
                self._target_path_str_list.remove(s)
            except ValueError as e:
                print(f"[FileCollection remove_all] Remove failed. error:{e}")
                pass

# EOF [O3o2o_1o0g2o_4o4o0]