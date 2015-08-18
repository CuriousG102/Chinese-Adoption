var Modal = ReactModal;

// TODO: Comb through this and do a better job of account for possible null values
var HeaderStaticSection = React.createClass({
    render: function () {
        var header_styles = this.props.header_styles ? this.props.header_styles : {};
        var summary_styles = this.props.summary_styles ? this.props.summary_styles : {};
        var Header_Tag = this.props.header_tag ? this.props.header_tag : "h1";
        var Summary_Tag = this.props.summary_tag ? this.props.summary_tag : "p";
        return (
            <div className="headerStatic">
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

        var header = "";
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
        var story_text = this.props.story_text ? this.props.story_text
            : "";
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
                </div>
                <div>
                    <p>
                        {story_text}
                    </p>
                </div>
            </div>
        );
    }
});

var paginator_ajax_in_progress = false;

var PaginationSection = React.createClass({
    addItems: function () {
        if (this.state.next_url
            && !paginator_ajax_in_progress) { // if there's no next_url there's nothing left to add
            // paginator_ajax_in_progress keeps us from triggering
            // the same ajax request a billion times as a user scrolls
            paginator_ajax_in_progress = true;
            $.ajax({
                url: this.state.next_url,
                dataType: "json",
                success: function (data) {
                    this.setState({
                        items: this.state.items.concat(data.results.map(function (currentValue, index, array) {
                            var element_making_details = this.props.make_element(currentValue);
                            var Component = element_making_details.component;
                            var props = element_making_details.props;
                            if (index + 1 === array.length) props["ref"] = "monitor_div";
                            return <Component {... props} />
                        }, this)),
                        next_url: data.next
                    });
                    paginator_ajax_in_progress = false;
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                    paginator_ajax_in_progress = false;
                }.bind(this)
            });
        }
    },
    getInitialState: function () {
        return {
            items: [], next_url: this.props.initial_url
        };
    },
    componentDidMount: function () {
        this.addItems();
        $(window).on('DOMContentLoaded load resize scroll', this.onChange);
    },
    onChange: function () { // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
        if (!this.refs.monitor_div) return; // there are no divs in the paginator
        var el = React.findDOMNode(this.refs.monitor_div);

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        var monitor_div_is_visible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );

        if (monitor_div_is_visible) this.addItems();
    },
    render: function () {
        var class_string = this.props.class_string ? this.props.class_string : "";
        return (
            <div className={class_string}>
                {this.state.items}
            </div>
        );
    }
});

var StoryCard = React.createClass({
    render: function () {
        var stuff_to_add = [];
        stuff_to_add.push(<Adoptee english_name={this.props.english_name}
                                   chinese_name={this.props.chinese_name}
                                   pinyin_name={this.props.pinyin_name}></Adoptee>);

        if (this.props.photo_front_story) stuff_to_add.push(<img src={this.props.photo_front_story}></img>);
        stuff_to_add.push(<p>{this.props.front_story.story_text}</p>);

        var detail_params = {
            id: this.props.id
        };

        var detail_name_order = language === ENGLISH ? [this.props.english_name, this.props.pinyin_name, this.props.chinese_name]
            : [this.props.chinese_name, this.props.english_name, this.props.pinyin_name];

        var name_for_link = null;
        for (var i = 0; i < detail_name_order.length; i++) {
            if (detail_name_order[i]) {
                name_for_link = detail_name_order[i];
                break;
            }
        }

        var link_text;

        if (name_for_link) {
            link_text = gettext("More about %(name)");
            link_text = interpolate(link_text, {name: name_for_link}, true);
        } else {
            link_text = gettext("More about this person");
        }

        return (
            <div>
                {stuff_to_add}
                <Link to="adoptee" params={detail_params}>
                    {link_text}
                </Link>
            </div>
        );
    }
});

var FrontPage = React.createClass({
    render: function () {
        var title = gettext("Chinese American");
        var summary = gettext("From 1999 to 2013, 71,632 adoptions of Chinese children by American families were reported to the U.S. Department of State. There are many narratives around these adoptions, but this site is a place for those most intimately involved in the process to tell their own stories");
        var submit = gettext("Share Your Story");
        var submit_handle_click = function () {
            alert("Submit Clicked!");
        };
        var about = gettext("Who We Are");
        var about_handle_click = function () {
            alert("About Clicked!");
        };

        var story_card_maker = function (adoptee_list_json) {
            return (
            {
                "component": StoryCard,
                "props": {
                    "english_name": adoptee_list_json.english_name,
                    "chinese_name": adoptee_list_json.chinese_name,
                    "pinyin_name": adoptee_list_json.pinyin_name,
                    "id": adoptee_list_json.id,
                    "photo_front_story": adoptee_list_json.photo_front_story,
                    "front_story": adoptee_list_json.front_story
                }
            }
            )
        };

        var paginator = <PaginationSection
            make_element={story_card_maker}
            initial_url={ADOPTEE_LIST_ENDPOINT}></PaginationSection>;

        var RouteHandler = ReactRouter.RouteHandler;

        return (
            <div className="container">
                <HeaderStaticSection title={title} summary={summary}/>
                <Button text={submit} handle_click={submit_handle_click}/>
                <Button text={about} handle_click={about_handle_click}/>
                {paginator}
                <RouteHandler/>
            </div>
        );
    }
});

var BootstrapModal = React.createClass({
    mixins: [ReactRouter.Navigation],
    handleModalCloseRequest: function () {
        this.transitionTo("/");
    },
    render: function () {
        return (
            <Modal
                isOpen={true}
                className="Modal__Bootstrap modal-dialog"
                onRequestClose={this.handleModalCloseRequest}
                >
                <div className="modal-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <span className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
                            </div>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </Modal>
        );
    }
});

var AdopteeDetail = React.createClass({
    componentDidMount: function () {
        $.ajax({
            url: ADOPTEE_DETAIL_ENDPOINT.replace("999",
                this.props.params.id.toString()),
            dataType: "json",
            success: function (data) {
                this.setState({
                    english_name: data.english_name,
                    pinyin_name: data.pinyin_name,
                    chinese_name: data.chinese_name,
                    stories: data.stories
                })
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {
            english_name: null,
            chinese_name: null,
            pinyin_name: null,
            stories: []
        }
    },
    render: function () {
        var story_components = [];
        for (var i = 0; i < this.state.stories.length; i++) {
            var story = this.state.stories[i];
            story_components.push(
                <StoryTeller english_name={story.english_name}
                             chinese_name={story.chinese_name}
                             pinyin_name={story.pinyin_name}
                             relationship={story.relationship_to_story}
                             media={story.media}
                             story_text={story.story_text}
                    />
            )
        }
        return (
            <BootstrapModal>
                <Adoptee
                    english_name={this.state.english_name}
                    chinese_name={this.state.chinese_name}
                    pinyin_name={this.state.pinyin_name}
                    />
            </BootstrapModal>
        );
    }
});

var AboutView = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-md-12">
                    // about text and a couple of images
                </div>
            </div>
        )
    }
});

var Route = ReactRouter.Route;

var routes = (
    <Route handler={FrontPage}>
        <Route name="adoptee" path="adoptee/:id" handler={AdopteeDetail}/>
        <Route name="submit" path="submit" handler={ModalWrapper}/>
        <Route name="about" path="about" handler={AboutView}/>
    </Route>
);

var appElement = document.getElementById('root');
Modal.setAppElement(appElement);
Modal.injectCSS();

ReactRouter.run(routes, ReactRouter.HashLocation, (FrontPage) => {
    React.render(<FrontPage/>, appElement);
});
React.initializeTouchEvents(true);