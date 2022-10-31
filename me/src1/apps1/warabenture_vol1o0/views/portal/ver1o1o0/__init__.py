# BOF [O3o1o0g9o0]

from django.shortcuts import render


class PortalView():
    """ポータル"""

    @staticmethod
    def render(request):
        """描画"""

        template_path = 'warabenture_vol1o0/portal/ver1o1o0.html'
        #                ---------------------------------------
        #                1
        # 1. `src1/apps1/warabenture_vol1o0/templates/warabenture_vol1o0/portal/ver1o1o0.html` を取得
        #                                             ---------------------------------------

        context = {}
        return render(request, template_path, context)

# EOF [O3o1o0g9o0]
