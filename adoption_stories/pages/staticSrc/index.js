// TODO: Comb through this and do a better job of account for possible null values
var HeaderStaticSection = React.createClass({
    render: function () {
        var header_styles = this.props.header_styles ? this.props.header_styles : {};
        var summary_styles = this.props.summary_styles ? this.props.summary_styles : {};
        var Header_Tag = this.props.header_tag ? this.props.header_tag : "h1";
        var Summary_Tag = this.props.summary_tag ? this.props.summary_tag : "p";
        return (
            <div class="headerStatic">
                <Header_Tag style={header_styles}>{this.props.title}</Header_Tag>
                <Summary_Tag style={summary_styles}>{this.props.summary}</Summary_Tag>
            </div>
        );
    }
});

var Button = React.createClass({
    render: function () {
        var class_string = this.props.class_string ? this.props.class_string : "btn btn-primary btn-lg active";
        var type_string = this.props.type_string ? this.props.type_string : "button";
        var styles = this.props.styles ? this.props.styles : {};

        return (
            <button type={type_string} style={styles} className={class_string} onClick={this.props.handle_click}>
                {this.props.text}
            </button>)
    }
});

var NameHeader = React.createClass({
    render: function () {
        var stuff_to_add = [];
        var order_of_headers;
        if (language === ENGLISH)
            order_of_headers = [this.props.english_name, this.props.chinese_name,
                this.props.pinyin_name];
        else
            order_of_headers = [this.props.chinese_name, this.props.english_name];

        var i = 0;
        var Header_Tag = this.props.header_tag;
        var header_class_string = this.props.header_class_string ? this.props.header_class_string : "";
        for (; i < order_of_headers.length; i++) {
            var header = order_of_headers[i];
            if (header) {
                stuff_to_add.push(<Header_Tag class_name={header_class_string}>{header}</Header_Tag>);
                i++;
                break;
            }
        }

        var sub_headers = [];
        for (; i < order_of_headers.length; i++) {
            var sub_header = order_of_headers[i];
            if (sub_header) sub_headers.push(sub_header);
        }

        if (sub_headers.length > 0) {
            var Sub_Header_Tag = this.props.sub_header_tag;
            var sub_header_class_string = this.props.sub_header_class_string ? this.props.sub_header_class_string : "";
            if (sub_headers.length > 1) sub_headers = sub_headers.join(" ");
            else sub_headers = sub_headers[0];
            stuff_to_add.push(<Sub_Header_Tag className={sub_header_class_string}>{sub_headers}</Sub_Header_Tag>);
        }

        return (
            <div>
                {stuff_to_add}
            </div>
        );
    }
});

var Adoptee = React.createClass({
    render: function () {
        var Primary_Name_Tag;
        var Secondary_Name_Tag;

        if (this.props.photo) { // we render very differently with photo
            var class_string = this.props.class_string ? this.props.class_string : "adopteeListingName";
            Primary_Name_Tag = this.props.primary_name_tag ? this.props.primary_name_tag : "h3";
            Secondary_Name_Tag = this.props.secondary_name_tag ? this.props.secondary_name_tag : "h4";

            return (
                <div className={class_string}>
                    <NameHeader english_name={this.props.english_name}
                                chinese_name={this.props.chinese_name}
                                pinyin_name={this.props.pinyin_name}
                                header_tag={Primary_Name_Tag}
                                sub_header_tag={Secondary_Name_Tag}></NameHeader>
                    <div>
                        <img src={this.props.photo}/>
                    </div>
                </div>
            );
        } else {
            Primary_Name_Tag = this.props.primary_name_tag ? this.props.primary_name_tag : "h2";
            Secondary_Name_Tag = this.props.secondary_name_tag ? this.props.secondary_name_tag : "h3";

            return (
                <NameHeader english_name={this.props.english_name}
                            chinese_name={this.props.chinese_name}
                            pinyin_name={this.props.pinyin_name}
                            header_tag={Primary_Name_Tag}
                            sub_header_tag={Secondary_Name_Tag}></NameHeader>
            );
        }
    }
});

var RelationshipHeader = React.createClass({
    render: function () {
        var header_order; // preferred header from most to least preferred
        if (language === ENGLISH) header_order = [this.props.english_name,
            this.props.chinese_name];
        else                      header_order = [this.props.chinese_name,
            this.props.english_name];

        var header;
        for (var i = 0; i < header_order.length; i++) {
            if (header_order[i]) {
                var header_text = header_order[i];
                header = <h4>{header_text}</h4>;
                break;
            }
        }


        return (
            <div className="relationshipHeader">{header}</div>
        );
    }
});

var Media = React.createClass({
    render: function () {
        return (
            <div>
                <h2>Media not yet implemented :-/</h2>
            </div>
        );
    }
});

var StoryTeller = React.createClass({
    render: function () {
        return (
            <div className="storyTeller">
                <NameHeader english_name={this.props.english_name}
                            chinese_name={this.props.chinese_name}
                            pinyin_name={this.props.pinyin_name}
                            header_tag="h3"
                            sub_header_tag="h4"></NameHeader>
                <RelationshipHeader english_name={this.props.relationship_to_story.english_name}
                                    chinese_name={this.props.relationship_to_story.chinese_name}>
                </RelationshipHeader>

                <div className="media">
                    <Media media={this.props.media}></Media>

                    <div>
                        <p>
                            {this.props.story_text}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
});

var PaginationSection = React.createClass({
    addItems: function () {
        $.ajax({
            url: this.state.next_url,
            dataType: "json",
            success: function (data) {
                this.setState({
                    items: this.state.items.concat(data.results.map(this.props.make_element)),
                    next_url: data.next
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {items: [], next_url: this.props.initial_url};
    },
    componentDidMount: function () {
        addItems();
    }
});


var FrontPage = React.createClass({
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
            <div>
                <HeaderStaticSection title={title} summary={summary}/>
                <Button text={submit} handle_click={submit_handle_click}/>
                <Button text={about} handle_click={about_handle_click}/>
            </div>
        );
    }
});

React.render(<FrontPage />,
    document.getElementById('root'));