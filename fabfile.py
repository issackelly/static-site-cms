from fabric.api import *
from fabric.contrib.project import rsync_project

env.user = 'ubuntu'
env.key_file = '~/.ssh/id_rsa.pub'
env.hosts = [
    'servee2'
]


def pack_css(minify=True):
    less_files = [
        'bootstrap',
        'responsive',
    ]

    css_files = [
        'bootstrap',
        'responsive',
        'backbone-forms',
    ]

    for f in less_files:
        local("lessc test-site/assets/less/%s.less > test-site/assets/css/%s.css" % (f, f))

    if minify:
        for f in css_files:
            local("java -jar bin/yuicompressor-2.4.6.jar --type css test-site/assets/css/%s.css >> test-site/assets/css/min.css" % f)
    else:
        for f in css_files:
            local("cat test-site/assets/css/%s.css >> test-site/assets/css/min.css" % f)


def pack_js(minify=True):
    local("cat test-site/assets/js/jquery.js > test-site/assets/js/min.js")
    local("echo '' >> test-site/assets/js/min.js")

    files = [
        'modernizr',
        'underscore',
        'backbone',
        'backbone-relational',
        'backbone-forms',
        'templates/bootstrap',
        'history',

        'heart',

        'bootstrap-collapse',
        'less',
    ]

    if minify:
        for f in files:
            local("java -jar bin/yuicompressor-2.4.6.jar --type js test-site/assets/js/%s.js >> test-site/assets/js/min.js" % f)

    else:
        for f in files:
            local("cat js/%s.js >> test-site/assets/js/min.js" % f)
            local("echo '' >> test-site/assets/js/min.js")


def pack(minify=True):
    pack_css(minify)
    pack_js(minify)


def push(minify=True):
    pack(minify=minify)
    rsync_project('/var/sites/quint-test.servee.com/', 'test-site/')
