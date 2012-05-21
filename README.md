Static Site CMS
---------------

It's a bit of a misnomer. It will almost certainly be renamed. Here's the idea:

Content and meta-data are stored as flat .json files in the site root. A small
amount of JS handles the routing, templating, and content negotiation.

It's really quick on modern browsers, and should work on most non-modern browsers

You can put it in the root of your commodity apache web host.


This Repo
---------

Test-site is an example. I want this repo to serve as a definition and documentation
for the format. I've got some helper scripts as well, for running coffeescript watch
files, and for packing/pushing files around.

Example site
------------

http://quint-test.servee.com --- Quint is a reference to which iteration of this
idea this is for me personally. Feel free to ignore it.

Features
--------

* Static site with variable name and number of content areas per page
* Navigation is separate from content.
* Blog is coming
* Templates can exist in the page, but most of them are at assets/js/templates.js
* Bootstrap (or any particular design/css) is not required

Content
-------

All the text came from http://spaceipsum.com

Licenses
--------

The serving code and documentation will be licensed under a BSD license. It's currently
mixed in with works from other licenses, and that needs sorted out.

How it works
------------

You request a page, An empty shell is returned, and the approporiate JSON file is
found.

### Simple Page

That json file includes the content, and how it should be rendered with any number
of "renderings":

    # index.json

    {
        "page_type": "normal",
        "title": "Home",
        "content": "<p>The Earth is a very small stage in a vast cosmic arena...",
        "renderings": [
            {
                "location": "#content",
                "template": "page"
            }
        ]
    }

### Extra Content

This one is simple, you request /, it gets index.json, and for each rendering in
`renderings` it will take the template at `window.JST[template]` and render it, replacing
the contents of `location`

    contact.json
    {
        "page_type": "normal",
        "title": "Contact",
        "content": "<p>We choose to go to the...",
        "sidebar": "<h3>Issac Kelly</h3><p>2480 Wallaby Way<br/>Sydney, Australia</p>",
        "renderings": [
            {
                "location": "#content",
                "template": "about_page"
            }
        ]
    }


The contact page has a slightly different template, that has a main content area, and
a sidebar. There's still only one rendering though.

### Navigation

Navigtaion is rendered from `navigation.json`:

    [
        {
            "path": "/",
            "title": "Home"
        },
        {
            "path": "/about",
            "title": "About"
        },
        {
            "path": "/contact",
            "title": "Contact"
        }
    ]

It's currently hardcoded to render `window.JST.navigation` into `#primary_nav`

### Tech

I'm using history.js as a pushstate/popstate polyfill. Underscore and backbone
are really the core of this, and each Page is a backbone model, as well as each
Navigation item.


Proposed Features
-----------------

* Blog, this is interesting because we need to generate the RSS feed as well, which
isn't particularly difficult, but we need to determine where that gets saved.

What I need
-----------

Feedback! Have an idea? File a ticket! Shoot me an email! (issac.kelly@gmail.com)
Think I'm an idiot? Want to help? Please get involved!
