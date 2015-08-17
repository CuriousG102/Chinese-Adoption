// TODO: Comb through this and do a better job of account for possible null values
var HeaderStaticSection = React.createClass({displayName: "HeaderStaticSection",
    render: function () {
        var header_styles = this.props.header_styles ? this.props.header_styles : {};
        var summary_styles = this.props.summary_styles ? this.props.summary_styles : {};
        var Header_Tag = this.props.Header_Tag ? this.props.Header_Tag : "h1";
        var Summary_Tag = this.props.Summary_Tag ? this.props.Summary_Tag : "p";
        return (
            React.createElement("div", {class: "headerStatic"}, 
                React.createElement(Header_Tag, {style: header_styles}, this.props.title), 
                React.createElement(Summary_Tag, {style: summary_styles}, this.props.summary)
            )
        );
    }
});

var Button = React.createClass({displayName: "Button",
    render: function () {
        var class_string = this.props.class_string ? this.props.class_string : "btn btn-primary btn-lg active";
        var type_string = this.props.type_string ? this.props.type_string : "button";
        var styles = this.props.styles ? this.props.styles : {};

        return (
            React.createElement("button", {type: type_string, style: styles, className: class_string, onClick: this.props.handle_click}, 
                this.props.text
            ))
    }
});

var Adoptee = React.createClass({displayName: "Adoptee",
    render: function () {
        var primary_name = language === ENGLISH ? this.props.english_name : this.props.chinese_name;
        var secondary_name = language === ENGLISH ? [this.props.chinese_name, this.props.pinyin_name].join(" ")
            : this.props.english_name;

        var class_string;
        var Primary_Name_Tag;
        var Secondary_Name_Tag;

        if (this.props.photo) { // we render very differently with photo
            class_string = this.props.class_string ? this.props.class_string : "adopteeListingName";
            Primary_Name_Tag = this.props.Primary_Name_Tag ? this.props.Primary_Name_Tag : "h3";
            Secondary_Name_Tag = this.props.Secondary_Name_Tag ? this.props.Secondary_Name_Tag : "h4";

            return (
                React.createElement("div", {className: class_string}, 
                    React.createElement("div", null, 
                        React.createElement(Primary_Name_Tag, null, primary_name), 
                        React.createElement(Secondary_Name_Tag, null, secondary_name)
                    ), 
                    React.createElement("div", null, 
                        React.createElement("img", {src: this.props.photo})
                    )
                )
            );
        } else {
            Primary_Name_Tag = this.props.Primary_Name_Tag ? this.props.Primary_Name_Tag : "h2";
            Secondary_Name_Tag = this.props.Secondary_Name_Tag ? this.props.Secondary_Name_Tag : "h3";

            return (
                React.createElement("div", null, 
                    React.createElement(Primary_Name_Tag, null, primary_name), 
                    React.createElement(Secondary_Name_Tag, null, secondary_name)
                )
            )
        }
    }
});

// TODO: Finish up this here
var StoryTeller = React.createClass({displayName: "StoryTeller",
    render: function () {
        stuffToAdd = [];
        if (language === ENGLISH) {
            if (this.props.english_name) stuffToAdd.push(React.createElement("h3", null, this.props.english_name));
            if (this.props.chinese_name && this.props.pinyin_name) {
                var concatenated = [this.props.chinese_name,
                    this.props.pinyin_name].join(" ");
                stuffToAdd.push(React.createElement("h4", null, concatenated))
            } else {

            }

        }
    }
});

var FrontPage = React.createClass({displayName: "FrontPage",
    render: function () {
        var title = gettext("Chinese American");
        var summary = gettext("From 1999 to 2013, 71,632 adoptions of Chinese children by American families were reported to the U.S. Department of State. There are many narratives around these adoptions, but this site is a place for those most intimately involved in the process to tell their own stories");
        var submit = gettext("Share Your Story");
        var submit_handle_click = function () {
            alert("Submit Clicked!")
        };
        var about = gettext("Who We Are");
        var about_handle_click = function () {
            alert("About Clicked!")
        };
        return (
            React.createElement("div", null, 
                React.createElement(HeaderStaticSection, {title: title, summary: summary}), 
                React.createElement(Button, {text: submit, handle_click: submit_handle_click}), 
                React.createElement(Button, {text: about, handle_click: about_handle_click})
            )
        );
    }
});

React.render(React.createElement(FrontPage, null),
    document.getElementById('root'));