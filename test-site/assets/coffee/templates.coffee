window.JST =
    navigation: """
        <ul class="nav">
            <% collection.each(function(node){ %>
                <li class="<%
                    if (node.path == window.location.href) {print("active ")};
                %>"><a href="<%= node.get("path")%>"><%= node.get("title") %></a>
                </li>
            <%}); %>
        </ul>
    """
    page: """
        <div class="row">
            <div class="span9">
                <h1><%= page.get('title') %></h1>
                <%= page.get('content') %>
            </div>
        </div>
    """
    about_page: """
        <div class="row">
            <div class="span9">
                <h1><%= page.get('title') %></h1>
                <%= page.get('content') %>
            </div>
            <div class="span3">
                <%= page.get('sidebar') %>
            </div>
        </div>
    """
    chunk: """
        <div class="span3">
            <%= chunk.content %>
        </div>
    """
