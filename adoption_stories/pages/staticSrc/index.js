var FrontPage = React.createClass({
    render: function () {
        var hello_world = gettext("Hello World!");
        return (
            <div>
                {hello_world}
            </div>
        );
    }
});

React.render(<FrontPage />,
    document.getElementById('root'));