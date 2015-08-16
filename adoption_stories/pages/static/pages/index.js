var FrontPage = React.createClass({displayName: "FrontPage",
    render: function () {
        var hello_world = gettext("Hello World!");
        return (
            React.createElement("div", null, 
                hello_world
            )
        );
    }
});

React.render(React.createElement(FrontPage, null),
    document.getElementById('root'));