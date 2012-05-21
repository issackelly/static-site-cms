window.JST = {
  navigation: "<ul class=\"nav\">\n    <% collection.each(function(node){ %>\n        <li class=\"<%\n            if (node.path == window.location.href) {print(\"active \")};\n        %>\"><a href=\"<%= node.get(\"path\")%>\"><%= node.get(\"title\") %></a>\n        </li>\n    <%}); %>\n</ul>",
  page: "<div class=\"row\">\n    <div class=\"span9\">\n        <h1><%= page.get('title') %></h1>\n        <%= page.get('content') %>\n    </div>\n</div>",
  about_page: "<div class=\"row\">\n    <div class=\"span9\">\n        <h1><%= page.get('title') %></h1>\n        <%= page.get('content') %>\n    </div>\n    <div class=\"span3\">\n        <%= page.get('sidebar') %>\n    </div>\n</div>",
  chunk: "<div class=\"span3\">\n    <%= chunk.content %>\n</div>"
};