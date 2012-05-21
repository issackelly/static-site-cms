# Utilities
if not window.console?
    window.console = {}
    window.console.data = []
    window.console.log = (data) ->
        window.console.data.append(data)


Navigation = Backbone.RelationalModel.extend(
    defaults:
        path: "/"
        title: "New Page"
        show: false
        children: []
    relations: [
        type: Backbone.HasMany
        key: 'children'
        relatedModel: 'Navigation'
        collectionType: 'NavigationCollection'
        reverseRelation:
            key: 'parent'
            includeInJSON: 'id'
    ]
    schema:
        title: 'Text'
        path: 'Text'
        show: 'Boolean'
        children:
            type: 'List'
            listType: 'NestedModel'
            sortable: true
            model: 'Navigation'

)
NavigationCollection = Backbone.Collection.extend(
)
NavigationView = Backbone.View.extend(
    template: _.template(window.JST.navigation)

    render: () ->
        console.log("rendering nav", @);
        context =
            collection: @collection
            nodeTemplate: @nodeTemplate
        html = @template(context)
        $(@el).append(html);
        true
)

Rendering = Backbone.RelationalModel.extend(
    defaults:
        location: "#some-location"
        type: "Template"
        template: "some_name"
        content: ""
    tpl: () ->
        if @.get('content')? and @.get('content') is not ''
            console.log("using @content", @.get('content'));
            tpl = _.template(@.get('content'))
        else
            console.log("using @template", @.get('template'));
            tpl = _.template(window.JST[@.get('template')])
        tpl
    schema:
        location:
            type: "Text"
            helpText: "CSS Selector for the rendering"
        type:
            type: "Select"
            options: [
                "Server Template",
                "Simple Template"
            ]
        template: "Text"
        content:
            type: "TextArea"
            label: "Simple Template"


)

Page = Backbone.RelationalModel.extend(
    defaults:
        title: "Why Hello There!"
        path: "newpage"
        content: "<p>From this day forward, Flight Control will be known by two words: 'Tough' and 'Competent.' Tough means we are forever accountable for what we do or what we fail to do. We will never again compromise our responsibilities. Every time we walk into Mission Control we will know what we stand for. Competent means we will never take anything for granted. We will never be found short in our knowledge and in our skills. Mission Control will be perfect. When you leave this meeting today you will go to your office and the first thing you will do there is to write 'Tough and Competent' on your blackboards. It will never be erased. Each day when you enter the room these words will remind you of the price paid by Grissom, White, and Chaffee. These words are the price of admission to the ranks of Mission Control.</p>"
    relations: [
        type: Backbone.HasMany
        key: 'renderings'
        relatedModel: 'Rendering'
    ]
    schema:
        title: "Text"
        path: "Text"
        content: "TextArea"
        rendering:
            type: "List"

    initialize: () ->
        @.bind("change", () ->
            @render()
        )

    render: () ->
        page = @;
        console.log("Rendering! " + @.get('title'));
        console.log(this)
        @.get("renderings").each((rendering) ->
            t = rendering.tpl()
            console.log(t, page)
            html = t(
                page: page
            )
            $(rendering.get('location')).html(html)
            true
        )
        true

    url: () ->
        @path + ".json"
)

Chunk = Backbone.Model.extend(
    defaults:
        template: "chunk"
        slug: "newpage"
        content: "<p>It has been said that astronomy is a humbling and character-building experience.</p>"
    schema:
        slug: "Text"
        content: "TextArea"
    url: () ->
        "_" + @path + ".json"
)



go_to_path = (pathname) ->
    console.log ("going to path " + pathname)

    if (pathname[pathname.length - 1] == "/")
        pathname += "index.json"
    else
        pathname += ".json"

    $.ajax(
        url: pathname
        contentType: 'json'
        success: (data, text) ->
            page = new Page(data)
            page.render()
        error: (data, xhr, text) ->
            console.log(data, xhr, text)
    )

$(() ->
    $.ajax(
        url: 'navigation.json'
        contentType: 'json'
        success: (data, text) ->
            navigation_elements = new NavigationCollection(data)
            navigation_view = new NavigationView()
            navigation_view.el = $("#primary_nav")[0]
            navigation_view.collection = navigation_elements
            navigation_view.render()
        error: (data, xhr, text) ->
            console.log(data, xhr, text)
    )

    last_state = null

    $("a").live("click", (e) ->
        href =  $(this).attr('href')
        history.pushState({'href': href}, $(this).text(), href)

        # Don't go if it's the same page.
        if last_state != href
            go_to_path(href)
        last_state = href
        e.preventDefault()
    )

    window.onpopstate = (e) ->
        pathname = window.location.pathname;

        # Don't go if it's the same page.
        if last_state != pathname
            go_to_path(pathname)

        e.preventDefault();
        last_state = window.location.pathname
        false

    # MS and FF don't pop state on the first load
    if not jQuery.browser.webkit
        go_to_path(window.location.href)
        last_state = window.location.pathname
)
