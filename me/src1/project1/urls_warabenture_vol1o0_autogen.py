# AutoGenBegin [O3o2o_1o0g4o0]

from django.urls import path

from apps1.warabenture_vol1o0.views.hello.ver1o0 import HelloView
from apps1.warabenture_vol1o0.views.portal.ver1o0 import PortalView
from apps1.warabenture_vol1o0.views.portal.ver1o1o0 import PortalView


urlpatterns = [
    # O3o2o_1o0g1o0 練習1.0巻 こんにちわ別名1.0版
    path('hello-alias/ver1.0/', HelloView.render, name='warabenture_vol1o0_hello_alias'),

    # ポータル
    path('portal/ver1.0/', PortalView.render, name='potal'),

    # ポータル
    path('', PortalView.render, name='potal'),
]

# AutoGenEnd [O3o2o_1o0g4o0]
