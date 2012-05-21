var Chunk, Navigation, NavigationCollection, NavigationView, Page, Rendering, go_to_path;
if (!(window.console != null)) {
  window.console = {};
  window.console.data = [];
  window.console.log = function(data) {
    return window.console.data.append(data);
  };
}
Navigation = Backbone.RelationalModel.extend({
  defaults: {
    path: "/",
    title: "New Page",
    show: false,
    children: []
  },
  relations: [
    {
      type: Backbone.HasMany,
      key: 'children',
      relatedModel: 'Navigation',
      collectionType: 'NavigationCollection',
      reverseRelation: {
        key: 'parent',
        includeInJSON: 'id'
      }
    }
  ],
  schema: {
    title: 'Text',
    path: 'Text',
    show: 'Boolean',
    children: {
      type: 'List',
      listType: 'NestedModel',
      sortable: true,
      model: 'Navigation'
    }
  }
});
NavigationCollection = Backbone.Collection.extend();
NavigationView = Backbone.View.extend({
  template: _.template(window.JST.navigation),
  render: function() {
    var context, html;
    console.log("rendering nav", this);
    context = {
      collection: this.collection,
      nodeTemplate: this.nodeTemplate
    };
    html = this.template(context);
    $(this.el).append(html);
    return true;
  }
});
Rendering = Backbone.RelationalModel.extend({
  defaults: {
    location: "#some-location",
    type: "Template",
    template: "some_name",
    content: ""
  },
  tpl: function() {
    var tpl;
    if ((this.get('content') != null) && this.get('content') === !'') {
      console.log("using @content", this.get('content'));
      tpl = _.template(this.get('content'));
    } else {
      console.log("using @template", this.get('template'));
      tpl = _.template(window.JST[this.get('template')]);
    }
    return tpl;
  },
  schema: {
    location: {
      type: "Text",
      helpText: "CSS Selector for the rendering"
    },
    type: {
      type: "Select",
      options: ["Server Template", "Simple Template"]
    },
    template: "Text",
    content: {
      type: "TextArea",
      label: "Simple Template"
    }
  }
});
Page = Backbone.RelationalModel.extend({
  defaults: {
    title: "Why Hello There!",
    path: "newpage",
    content: "<p>From this day forward, Flight Control will be known by two words: 'Tough' and 'Competent.' Tough means we are forever accountable for what we do or what we fail to do. We will never again compromise our responsibilities. Every time we walk into Mission Control we will know what we stand for. Competent means we will never take anything for granted. We will never be found short in our knowledge and in our skills. Mission Control will be perfect. When you leave this meeting today you will go to your office and the first thing you will do there is to write 'Tough and Competent' on your blackboards. It will never be erased. Each day when you enter the room these words will remind you of the price paid by Grissom, White, and Chaffee. These words are the price of admission to the ranks of Mission Control.</p>"
  },
  relations: [
    {
      type: Backbone.HasMany,
      key: 'renderings',
      relatedModel: 'Rendering'
    }
  ],
  schema: {
    title: "Text",
    path: "Text",
    content: "TextArea",
    rendering: {
      type: "List"
    }
  },
  initialize: function() {
    return this.bind("change", function() {
      return this.render();
    });
  },
  render: function() {
    var page;
    page = this;
    console.log("Rendering! " + this.get('title'));
    console.log(this);
    this.get("renderings").each(function(rendering) {
      var html, t;
      t = rendering.tpl();
      console.log(t, page);
      html = t({
        page: page
      });
      $(rendering.get('location')).html(html);
      return true;
    });
    return true;
  },
  url: function() {
    return this.path + ".json";
  }
});
Chunk = Backbone.Model.extend({
  defaults: {
    template: "chunk",
    slug: "newpage",
    content: "<p>It has been said that astronomy is a humbling and character-building experience.</p>"
  },
  schema: {
    slug: "Text",
    content: "TextArea"
  },
  url: function() {
    return "_" + this.path + ".json";
  }
});
go_to_path = function(pathname) {
  console.log("going to path " + pathname);
  if (pathname[pathname.length - 1] === "/") {
    pathname += "index.json";
  } else {
    pathname += ".json";
  }
  return $.ajax({
    url: pathname,
    contentType: 'json',
    success: function(data, text) {
      var page;
      page = new Page(data);
      return page.render();
    },
    error: function(data, xhr, text) {
      return console.log(data, xhr, text);
    }
  });
};
$(function() {
  var last_state;
  $.ajax({
    url: 'navigation.json',
    contentType: 'json',
    success: function(data, text) {
      var navigation_elements, navigation_view;
      navigation_elements = new NavigationCollection(data);
      navigation_view = new NavigationView();
      navigation_view.el = $("#primary_nav")[0];
      navigation_view.collection = navigation_elements;
      return navigation_view.render();
    },
    error: function(data, xhr, text) {
      return console.log(data, xhr, text);
    }
  });
  last_state = null;
  $("a").live("click", function(e) {
    var href;
    href = $(this).attr('href');
    history.pushState({
      'href': href
    }, $(this).text(), href);
    if (last_state !== href) {
      go_to_path(href);
    }
    last_state = href;
    return e.preventDefault();
  });
  window.onpopstate = function(e) {
    var pathname;
    pathname = window.location.pathname;
    if (last_state !== pathname) {
      go_to_path(pathname);
    }
    e.preventDefault();
    last_state = window.location.pathname;
    return false;
  };
  if (!jQuery.browser.webkit) {
    go_to_path(window.location.href);
    return last_state = window.location.pathname;
  }
});