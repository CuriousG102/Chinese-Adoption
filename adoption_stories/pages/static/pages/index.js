// To my successor: Pro-tip; When you're editing this file, super handy to use
//                  the command jsx --watch staticSrc/ static/pages from the
//                  pages directory and leave it running

// Return first non-null value of list or a default value
function firstNonNullOrDefault(array, def) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]) {
            def = array[i];
            break;
        }
    }

    return def;
}

// Django CSRF Protection; https://docs.djangoproject.com/en/1.8/ref/csrf/#ajax
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var Modal = ReactModal;

var Button = React.createClass({displayName: "Button",
    render: function () {
        var class_string = this.props.class_string ? this.props.class_string : "button";
        var type_string = this.props.type_string ? this.props.type_string : "button";
        var styles = this.props.styles ? this.props.styles : {};

        return (
            React.createElement("button", {type: type_string, style: styles, className: class_string, onClick: this.props.handle_click}, 
                this.props.text
            )
        );
    }
});

var NameHeader = React.createClass({displayName: "NameHeader",
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
                stuff_to_add.push(React.createElement(Header_Tag, {class_name: header_class_string}, header));
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
            stuff_to_add.push(React.createElement(Sub_Header_Tag, {className: sub_header_class_string}, sub_headers));
        }

        var class_string = this.props.class_string ? this.props.class_string : "";
        return (
            React.createElement("div", {className: class_string}, 
                stuff_to_add
            )
        );
    }
});


// TODO: Deal with dead code in Adoptee (there's a lot around photo, which never happens)
var Adoptee = React.createClass({displayName: "Adoptee",
    render: function () {
        var Primary_Name_Tag;
        var Secondary_Name_Tag;

        if (this.props.photo) { // we render very differently with photo
            var class_string = this.props.class_string ? this.props.class_string : "adopteeListingName";
            Primary_Name_Tag = this.props.primary_name_tag ? this.props.primary_name_tag : "h3";
            Secondary_Name_Tag = this.props.secondary_name_tag ? this.props.secondary_name_tag : "h4";

            return (
                React.createElement("div", {className: class_string}, 
                    React.createElement(NameHeader, {english_name: this.props.english_name, 
                                chinese_name: this.props.chinese_name, 
                                pinyin_name: this.props.pinyin_name, 
                                header_tag: Primary_Name_Tag, 
                                sub_header_tag: Secondary_Name_Tag}), 

                    React.createElement("div", null, 
                        React.createElement("img", {src: this.props.photo})
                    )
                )
            );
        } else {
            Primary_Name_Tag = this.props.primary_name_tag ? this.props.primary_name_tag : "h2";
            Secondary_Name_Tag = this.props.secondary_name_tag ? this.props.secondary_name_tag : "h3";

            return (
                React.createElement("div", {className: "adopteeName"}, 
                    React.createElement(NameHeader, {english_name: this.props.english_name, 
                                chinese_name: this.props.chinese_name, 
                                pinyin_name: this.props.pinyin_name, 
                                header_tag: Primary_Name_Tag, 
                                sub_header_tag: Secondary_Name_Tag})
                )
            );
        }
    }
});

var RelationshipHeader = React.createClass({displayName: "RelationshipHeader",
    render: function () {
        var header_order; // preferred header from most to least preferred
        if (language === ENGLISH) header_order = [this.props.english_name,
            this.props.chinese_name];
        else                      header_order = [this.props.chinese_name,
            this.props.english_name];

        var header_text = firstNonNullOrDefault(header_order, "");

        return (
            React.createElement("div", {className: "relationshipHeader"}, React.createElement("h4", null, header_text))
        );
    }
});

var getCaption = function (media_item) {
    var caption_preference = language === ENGLISH ? [media_item.english_caption, media_item.chinese_caption]
        : [media_item.chinese_caption, media_item.english_caption];
    return firstNonNullOrDefault(caption_preference, "");
};

var Media = React.createClass({displayName: "Media",
    getInitialState: function () {
        return {
            embed_shizzle: {__html: ""}, isInnerHTML: true,
            caption: "", style_overrides: null, class_name: ""
        };
    },
    componentDidMount: function () {
        if (this.props.media.audio.length > 0) {
            var audio = this.props.media.audio[0];
            var audio_url = audio.audio;
            $.ajax({
                url: "http://soundcloud.com/oembed",
                dataType: "json",
                data: {
                    format: "json",
                    url: audio_url,
                    maxheight: 81
                },
                success: function (data) {
                    this.setState({
                        embed_shizzle: {
                            __html: data.html
                        },
                        isInnerHTML: true,
                        caption: getCaption(audio),
                        style_overrides: null,
                        class_name: "audio"
                    });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(audio_url, status, err.toString());
                }.bind(this)
            });
        } else if (this.props.media.video.length > 0) {
            var video = this.props.media.video[0];
            var video_iframe_url = video.iframe_url;
            var embed_code = React.createElement("iframe", {width: "100%", height: "315", src: video_iframe_url, frameborder: "0", 
                                     allowfullscreen: true});
            this.setState({
                embed_shizzle: embed_code,
                isInnerHTML: false,
                caption: getCaption(video),
                style_overrides: null,
                class_name: "video"
            });
        }
    },
    render: function () {
        var content;
        var class_name = this.state.class_name;
        if (this.state.isInnerHTML)
            content =
                React.createElement("div", {className: class_name}, 
                    React.createElement("div", {className: "media-embed", 
                         dangerouslySetInnerHTML: this.state.embed_shizzle}), 
                    React.createElement("div", {className: "media-caption"}, 
                        React.createElement("p", null, 
                            this.state.caption
                        )
                    )
                );
        else
            content =
                React.createElement("div", {className: class_name}, 
                    React.createElement("div", {className: "media-embed"}, 
                        this.state.embed_shizzle
                    ), 
                    React.createElement("div", {className: "media-caption"}, 
                        React.createElement("p", null, 
                            this.state.caption
                        )
                    )
                );

        return this.state.style_overrides ?
            React.createElement("div", {className: "media-container", style: this.state.style_overrides}, content)
            : React.createElement("div", {className: "media-container"}, content)
    }
});

var processStoryText = function (story_text) {
    story_text = story_text.split(/<p>|<\/p>/);
    for (var i = 1; i < story_text.length; i += 2) {
        story_text[i] = React.createElement("p", null, story_text[i])
    }
    return story_text
};

var StoryTeller = React.createClass({displayName: "StoryTeller",
    render: function () {
        var story_text = this.props.story_text ? processStoryText(this.props.story_text)
            : React.createElement("p", null);

        var classname = "storyTeller";

        if (this.props.extra_classnames) {
            classname += " " + this.props.extra_classnames;
        }

        var photo = this.props.media.photo[0];
        var photo_url = photo.photo_file;
        var photo_caption = getCaption(photo);

        return (
            React.createElement("div", {className: classname}, 
                React.createElement(NameHeader, {english_name: this.props.english_name, 
                            chinese_name: this.props.chinese_name, 
                            pinyin_name: this.props.pinyin_name, 
                            header_tag: "h2", 
                            sub_header_tag: "h3"}), 
                React.createElement(RelationshipHeader, {english_name: this.props.relationship_to_story.english_name, 
                                    chinese_name: this.props.relationship_to_story.chinese_name}
                ), 

                React.createElement(Media, {media: this.props.media}), 

                React.createElement("div", {className: "photo-container"}, 
                    React.createElement("img", {src: photo_url, className: "photo"}), 

                    React.createElement("div", {className: "photo-caption"}, 
                        React.createElement("p", null, 
                            photo_caption
                        )
                    )
                ), 

                React.createElement("div", {className: "story-text"}, 
                    story_text
                )
            )
        );
    }
});

// TODO: make this non-global
var paginator_ajax_in_progress = false;

var PaginationSection = React.createClass({displayName: "PaginationSection",
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
                            return React.createElement(Component, React.__spread({},   props))
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
    componentWillUnmount: function () {
        $(window).off('DOMContentLoaded load resize scroll', this.onChange);
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.initial_url !== this.props.initial_url) {
            this.setState({
                items: [],
                next_url: nextProps.initial_url
            });
        }
    },
    onChange: function () { // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
        if (!this.refs.monitor_div) return; // there are no divs in the paginator
        var domNode = React.findDOMNode(this.refs.monitor_div);
        var el = $(domNode);
        el = el.children();
        el = el.last();

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        if (!el) this.addItems();
        var rect = el.getBoundingClientRect();

        // once the top-left corner of the dom is out of view this will actually be false,
        // but I think that should be ok for our purposes. As long as this fires once when they scroll past it,
        // we're fine
        var divY1 = rect.top;
        var divY2 = rect.top + rect.height;
        var windowY1 = 0;
        var windowY2 = $(window).height();

        // test to see if monitor_div is within or higher than the vertical range of the window
        // we actually don't care if it's visible, we just care that the user is out of content
        var monitor_div_is_visible = (
            (divY1 < windowY1) || (divY1 <= windowY2 && divY2 >= windowY1)
        );

        if (monitor_div_is_visible) {
            this.addItems();
        }
    },
    componentDidUpdate: function (prevProps, prevState) {
        // If the initial url changed after this pagination section was first mounted,
        // then we should be clearing its contents and starting over with the contents
        // we retrieve from the new initial url. The clearing of state.items and
        // the making of the new next_url are taken care of in componentWillReceiveProps.
        // But to avoid race conditions and hard-to-understand code, we must call
        // addItems after the component has rendered with this new state
        if (this.props.initial_url === this.state.next_url) this.addItems();
    },
    render: function () {
        // We can run into problems that aren't solvable
        // in the process of updating state while keeping this component reusable.
        // The specific case that caused me to introduce this
        // solution was when I needed paginated items in a specific bootstrap grid
        var items_as_rendered;
        if (this.props.items_prerender_processor)
            items_as_rendered = this.props.items_prerender_processor(this.state.items);
        else
            items_as_rendered = this.state.items;

        var class_string = this.props.class_string ? this.props.class_string : "";
        return (
            React.createElement("div", {className: class_string, ref: "monitor_div"}, 
                items_as_rendered
            )
        );
    }
});

var StoryCard = React.createClass({displayName: "StoryCard",
    render: function () {
        var stuff_to_add = [];
        stuff_to_add.push(React.createElement("img", {src: this.props.photo_front_story}));
        stuff_to_add.push(React.createElement(Adoptee, {english_name: this.props.english_name, 
                                   chinese_name: this.props.chinese_name, 
                                   pinyin_name: this.props.pinyin_name}));
        var story_text = processStoryText(this.props.front_story.story_text);
        stuff_to_add.push(React.createElement("div", {className: "story-container"}, 
            React.createElement("p", {className: "story-text"}, story_text)
        ));

        // Translators: The ... that comes before
        var link_text = gettext("...");
        var link = "#/adoptee/" + this.props.id.toString();

        var class_string = this.props.className ? this.props.className : "";

        return (
            React.createElement("div", {className: class_string}, 
                stuff_to_add, 
                React.createElement("div", {className: "detail-link-container"}, 
                    React.createElement("a", {href: link, className: "detail-link"}, 
                        link_text
                    )
                )
            )
        );
    }
});

var FrontPage = React.createClass({displayName: "FrontPage",
    mixins: [ReactRouter.Navigation],
    render: function () {
        // Translators: Summary of the site
        var summary = gettext("Since 1992, some 140,000 children have left China for homes in sixteen countries. Here, Chinese adoptees, their families and friends tell their stories.");
        // Translators: Button label
        var submit = gettext("Share Your Story");
        var submit_handle_click = function () {
            this.transitionTo("submit");
        }.bind(this);
        // Translators: Button label
        var about = gettext("Who We Are");
        var about_handle_click = function () {
            this.transitionTo("about");
        }.bind(this);

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
                    "front_story": adoptee_list_json.front_story,
                    "key": adoptee_list_json.id,
                    "className": "story-card"
                }
            }
            )
        };

        var items_prerender_processor = function (items) {
            var items_to_return = [];
            var ITEMS_IN_A_ROW = 3;
            var columned_items_for_rows = items.map(function(item) {
                return React.createElement("div", {className: "col-md-4 front-page-card"}, item)
            });

            for (var i = 0; i < columned_items_for_rows.length; i += ITEMS_IN_A_ROW) {
                var end_slice_index = i + ITEMS_IN_A_ROW > columned_items_for_rows.length ?
                    columned_items_for_rows.length
                    : i + ITEMS_IN_A_ROW;
                var row_items = columned_items_for_rows.slice(i, end_slice_index);
                items_to_return.push(
                    React.createElement("div", {className: "row"}, 
                        row_items
                    )
                );
            }

            return items_to_return;
        };

        var paginator = React.createElement(PaginationSection, {
            make_element: story_card_maker, 
            initial_url: ADOPTEE_LIST_ENDPOINT, 
            items_prerender_processor: items_prerender_processor});

        var RouteHandler = ReactRouter.RouteHandler;
        var other_language_prompt = language === ENGLISH ? "中文" : "Switch to English";
        var other_language_link = language === ENGLISH ? "/zh-hans/#" : "/en/#";

        return (
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "headerRow"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("div", {className: "logoSwitchLinkContainer"}, 
                            React.createElement("div", {className: "otherLanguagePromptContainer"}, 
                                React.createElement("a", {href: other_language_link}, other_language_prompt)
                            ), 
                            React.createElement("div", {className: "imageContainer"}, 
                                React.createElement("img", {className: "logo", src: LOGO_LOCATION})
                            )
                        ), 
                        React.createElement("div", {className: "summaryContainer"}, 
                            React.createElement("p", null, summary)
                        ), 
                        React.createElement("div", {className: "buttonContainer"}, 
                            React.createElement("div", {className: "buttons"}, 
                                React.createElement(Button, {text: submit, handle_click: submit_handle_click}), 
                                React.createElement(Button, {text: about, handle_click: about_handle_click})
                            )
                        )
                    )
                ), 
                paginator, 
                React.createElement(RouteHandler, null)
            )
        );
    }
});

var BootstrapModal = React.createClass({displayName: "BootstrapModal",
    mixins: [ReactRouter.Navigation],
    handleModalCloseRequest: function () {
        this.transitionTo("/");
    },
    render: function () {
        var class_name = "modal-content";

        if (this.props.extra_class) {
            class_name += " " + this.props.extra_class;
        }

        return (
            React.createElement(Modal, {
                isOpen: true, 
                className: "Modal__Bootstrap modal-lg", 
                onRequestClose: this.handleModalCloseRequest
                }, 
                React.createElement("div", {className: class_name}, 
                    React.createElement("div", {className: "container-fluid"}, 
                        React.createElement("div", {className: "row", id: "close-row"}, 
                            React.createElement("div", {className: "col-md-11"}), 
                            React.createElement("div", {className: "col-md-1"}, 
                                React.createElement("div", {className: "x-icon", onClick: this.handleModalCloseRequest})
                            )
                        ), 
                        this.props.children
                    )
                )
            )
        );
    }
});

var AdopteeDetail = React.createClass({displayName: "AdopteeDetail",
    componentDidMount: function () {
        $.ajax({
            url: ADOPTEE_DETAIL_ENDPOINT.replace("999999999",
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
        var story_components = this.state.stories.map(function(story, i, arr) {
            var extra_class;
            if (i === 0) extra_class = "first";
            else if (i === arr.length - 1) extra_class = "last";
            else extra_class = "middle";
            story_components.push(
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement(StoryTeller, {english_name: story.english_name, 
                                     chinese_name: story.chinese_name, 
                                     pinyin_name: story.pinyin_name, 
                                     relationship_to_story: story.relationship_to_story, 
                                     media: story.media, 
                                     story_text: story.story_text, 
                                     extra_classnames: extra_class}
                            )
                    )
                )
            )
        });

        return (
            React.createElement(BootstrapModal, {
                extra_class: "detail-modal"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement(Adoptee, {
                            english_name: this.state.english_name, 
                            chinese_name: this.state.chinese_name, 
                            pinyin_name: this.state.pinyin_name}
                            )
                    )
                ), 
                story_components
            )
        );
    }
});

var AboutPerson = React.createClass({displayName: "AboutPerson",
    render: function () {
        // TODO: This is scattered so many places. At the very least there should be a utility function to return the first non-null value from a list or a default value
        var caption_order_preference = language === ENGLISH ?
            [this.props.english_caption, this.props.chinese_caption] :
            [this.props.chinese_caption, this.props.english_caption];
        var caption = firstNonNullOrDefault(caption_order_preference, "");

        var text_order_preference = language === ENGLISH ?
            [this.props.about_text_english, this.props.about_text_chinese] :
            [this.props.about_text_chinese, this.props.about_text_english];
        var text = firstNonNullOrDefault(text_order_preference, "");
        var class_name = "about-person";
        if (this.props.extra_class) {
            class_name += " " + this.props.extra_class;
        }

        return (
            React.createElement("div", {className: class_name}, 
                React.createElement(NameHeader, {
                    english_name: this.props.english_name, 
                    chinese_name: this.props.chinese_name, 
                    pinyin_name: this.props.pinyin_name, 
                    header_tag: "h2", 
                    sub_header_tag: "h3"}), 

                React.createElement("div", {className: "photo-container"}, 
                    React.createElement("img", {src: this.props.photo, className: "photo"}), 

                    React.createElement("div", {className: "photo-caption"}, 
                        React.createElement("p", null, 
                            caption
                        )
                    )
                ), 
                React.createElement("div", {className: "about-text-container"}, 
                    text
                )
            )
        );
    }
});

var AboutView = React.createClass({displayName: "AboutView",
    render: function () {
        var about_person_maker = function (about_person_json) {
            return (
            {
                "component": AboutPerson,
                "props": {
                    "english_name": about_person_json.english_name,
                    "chinese_name": about_person_json.chinese_name,
                    "pinyin_name": about_person_json.pinyin_name,
                    "about_text_english": about_person_json.about_text_english,
                    "about_text_chinese": about_person_json.about_text_chinese,
                    "english_caption": about_person_json.english_caption,
                    "chinese_caption": about_person_json.chinese_caption,
                    "photo": about_person_json.photo
                }
            }
            )
        };

        var items_prerender_processor = function (items) {
            return items.map(function (item, i, arr) {
                // This isn't the best idea but it's not terrible either for this case ...
                // https://facebook.github.io/react/docs/jsx-spread.html
                if (i === 0) {
                    item.props.extra_class = "first";
                } else if (i === arr.length - 1) {
                    item.props.extra_class = "last";
                } else {
                    item.props.extra_class = "middle";
                }
                return (
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-12"}, 
                            item
                        )
                    )
                );
            });
        };

        var who_we_are = gettext("Who We Are");

        return (
            React.createElement(BootstrapModal, {
                extra_class: "about-modal"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h3", {className: "whoWeAreTitle"}, who_we_are)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement(PaginationSection, {
                            initial_url: ABOUT_PERSON_LIST_ENDPOINT, 
                            make_element: about_person_maker, 
                            items_prerender_processor: items_prerender_processor})
                    )
                )
            )
        );
    }
});

// For debouncing certain ajax requests
// It fulfills the last function call and throws out the rest
// http://davidwalsh.name/javascript-debounce-function

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
var debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var AreaTextEditor = React.createClass({displayName: "AreaTextEditor",
    mixins: [ReactScriptLoaderMixin],
    getInitialState: function () {
        return {
            scriptLoading: true,
            scriptLoadError: false
        };
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return false;
    },
    getScriptURL: function () {
        return CK_EDITOR_URL;
    },
    onScriptLoaded: function () {
        this.setState({scriptLoading: false});
        this.forceUpdate(function () {
            CKEDITOR.replace("tellStoryTextArea");
        });
    },
    onScriptError: function () {
        this.setState({
            scriptLoading: false,
            scriptLoadError: true
        });
        this.forceUpdate();
    },
    getText: function () {
        return CKEDITOR.instances.tellStoryTextArea.getData()
    },
    render: function () {
        if (this.state.scriptLoading) {
            var text_editor_loading = gettext("Text editor loading");
            return React.createElement("div", {id: "tellStoryTextAreaLoading"}, text_editor_loading);
        } else if (this.state.scriptLoadError) {
            var error_message = gettext("There is a problem with your connectivity " +
                "or with the website");
            return React.createElement("div", {id: "tellStoryTextAreaError"}, error_message);
        } else {
            return React.createElement("textarea", {id: "tellStoryTextArea"});
        }
    }
});

var Thanks = React.createClass({displayName: "Thanks",
    mixins: [ReactRouter.Navigation],
    continueForward: function () {
        this.transitionTo("/");
    },
    render: function () {
        var thanks = gettext("Thank you for your time and your story." +
            " Your content will be reviewed and posted as soon as possible.");
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("h4", null, thanks)
                )
            )
        );
    }
});

var SoundcloudForm = React.createClass({displayName: "SoundcloudForm",
    re_detect: /^(http(s)?:\/\/(www\.)?)?soundcloud\.com\/.*/,
    is_valid: function (url) {
        return this.re_detect.test(url);
    },
    post_data: function () {
        if (this.is_valid(this.state.soundcloud_url))
            return this.state.soundcloud_url;
        else
            return null
    },
    getInitialState: function () {
        return {
            soundcloud_url: gettext("Please paste a soundcloud url of your audio here"),
            embed_shizzle: {__html: ""}
        };
    },
    getEmbed: debounce(function (url) {
        $.ajax({
            url: "http://soundcloud.com/oembed",
            dataType: "json",
            data: {
                format: "json",
                url: url,
                maxheight: 81
            },
            success: function (initial_url, data) {
                // if statement guards against scenario where user has changed url but the reuest has returned
                // for a stale one
                if (this.state.soundcloud_url === initial_url) {
                    this.setState({
                        embed_shizzle: {
                            __html: data.html
                        }
                    });
                }
            }.bind(this, url),
            error: function (initial_url, xhr, status, err) {
                console.error(initial_url, status, err.toString());
            }.bind(this, url)
        })
    }, 1000),
    handleChange: function (event) {
        this.setState({
            soundcloud_url: event.target.value,
            embed_shizzle: {__html: ""}
        });
        if (this.is_valid(event.target.value)) {
            this.getEmbed(event);
        }
    },
    render: function () {
        var url_input_classname = this.is_valid(this.state.soundcloud_url) ?
            "valid" : "invalid";
        if (!this.props.wants_to_provide) return React.createElement("div", null);
        var explain = gettext("Be sure you are in a quiet place with minimal background noise when you record your SoundCloud clip. Your clip should not be longer than five minutes.");
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, explain)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {id: "soundCloudURLInput", 
                               value: this.state.soundcloud_url, 
                               onChange: this.handleChange, 
                               className: url_input_classname})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("div", {className: "media-embed", 
                             dangerouslySetInnerHTML: this.state.embed_shizzle})
                    )
                )
            )
        );
    }
});

var YoutubeForm = React.createClass({displayName: "YoutubeForm",
    re_detect: /^(http(s)?:\/\/)?(www\.|m\.)?youtu(\.?)be(\.com)?\/.*/,
    is_valid: function (url) {
        return this.re_detect.test(url);
    },
    post_data: function () {
        if (this.is_valid(this.state.youtube_url))
            return this.state.youtube_url;
        else
            return null
    },
    getInitialState: function () {
        return {
            youtube_url: gettext("Please paste a youtube url of your video here"),
            // embed_shizzle: {__html: ""}
        };
    },
    handleChange: function (event) {
        this.setState({
            youtube_url: event.target.value,
            // embed_shizzle: {__html: ""}
        });

    },
    render: function () {
        var url_input_classname = this.is_valid(this.state.youtube_url) ?
            "valid" : "invalid";
        var explain = gettext("When shooting your photo or YouTube video, be sure you are not standing with light behind you. If you are using your phone to shoot video, be sure the phone is horizontal.");
        if (!this.props.wants_to_provide) return React.createElement("div", null);
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, explain)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {id: "soundCloudURLInput", 
                               value: this.state.youtube_url, 
                               onChange: this.handleChange, 
                               className: url_input_classname})
                    )
                )
            )
        );
    }
});

var MediaUpload = React.createClass({displayName: "MediaUpload",
    MULTIMEDIA_FORMS: {
        soundcloud: {
            name: gettext("SoundCloud"),
            tag: SoundcloudForm,
            upload_field_name: "audio",
            endpoint: AUDIO_UPLOAD_ENDPOINT
        },
        youtube: {
            name: gettext("YouTube"),
            tag: YoutubeForm,
            upload_field_name: "video",
            endpoint: VIDEO_UPLOAD_ENDPOINT
        }
    },
    ENGLISH_CAPTION_DEFAULT: gettext("English caption for multimedia (if able)"),
    CHINESE_CAPTION_DEFAULT: gettext("Chinese caption for multimedia (if able)"),
    getInitialState: function () {
        return {
            wants_to_provide: true,
            selected_form: "soundcloud",
            english_caption: this.ENGLISH_CAPTION_DEFAULT,
            chinese_caption: this.CHINESE_CAPTION_DEFAULT,
            photo_english_caption: this.ENGLISH_CAPTION_DEFAULT,
            photo_chinese_caption: this.CHINESE_CAPTION_DEFAULT,
            photo_data_file: null
        };
    },
    handle_type_selection: function (event) {
        this.setState({
            selected_form: event.target.value
        });
    },
    provide: function (event) {
        this.setState({
            wants_to_provide: true
        });
    },
    dont_provide: function (event) {
        this.setState({
            wants_to_provide: false
        });
    },
    continueForward: function () {
        var get_value = function (text, boiler) {
            if (text !== boiler && text.length > 0) return text;
            return null;
        };
        if (this.state.photo_data_file === null) return;
        var photo_upload_data = {
            english_caption: get_value(this.state.photo_english_caption,
                this.ENGLISH_CAPTION_DEFAULT),
            chinese_caption: get_value(this.state.photo_chinese_caption,
                this.CHINESE_CAPTION_DEFAULT),
            story_teller: this.props.story_teller,
            photo_file: this.state.photo_data_file
        };
        var photo_upload_form_data = new FormData();
        var keys = Object.keys(photo_upload_data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            photo_upload_form_data.append(key, photo_upload_data[key]);
        }
        // TODO: Make this concurrent using promises rather than a callback hack
        var upload_and_transition = function (data) {
            if (!this.state.wants_to_provide) {
                this.props.transition({
                    tag: Thanks,
                    props: {}
                });
            } else {
                var upload_field = this.refs.multimedia_form.post_data();
                if (!upload_field) return; // not a valid upload
                var upload_data = {
                    english_caption: get_value(this.state.english_caption,
                        this.ENGLISH_CAPTION_DEFAULT),
                    chinese_caption: get_value(this.state.chinese_caption,
                        this.CHINESE_CAPTION_DEFAULT),
                    story_teller: this.props.story_teller
                };
                var upload_field_name = this.MULTIMEDIA_FORMS[this.state.selected_form].upload_field_name;
                upload_data[upload_field_name] = upload_field;
                var endpoint = this.MULTIMEDIA_FORMS[this.state.selected_form].endpoint;
                $.ajax({
                    url: endpoint,
                    type: 'POST',
                    dataType: "json",
                    data: upload_data,
                    success: function (data) {
                        this.props.transition({
                            tag: Thanks,
                            props: {}
                        });
                    }.bind(this),
                    error: function (endpoint, xhr, status, err) {
                        console.error(endpoint, status, err.toString());
                    }.bind(this, endpoint)
                });
            }
        }.bind(this);
        $.ajax({
            url: PHOTO_UPLOAD_ENDPOINT,
            type: 'POST',
            dataType: "json",
            data: photo_upload_form_data,
            processData: false,
            contentType: false,
            success: upload_and_transition,
            error: function (endpoint, xhr, status, err) {
                console.error(endpoint, status, err.toString());
            }.bind(this, PHOTO_UPLOAD_ENDPOINT)
        });

    },
    handleEnglishChange: function (event) {
        this.setState({
            english_caption: event.target.value
        });
    },
    handleChineseChange: function (event) {
        this.setState({
            chinese_caption: event.target.value
        });
    },
    handlePhotoEnglishChange: function (event) {
        this.setState({
            photo_english_caption: event.target.value
        });
    },
    handlePhotoChineseChange: function (event) {
        this.setState({
            photo_chinese_caption: event.target.value
        });
    },
    handleFile: function (e) {
        var file = e.target.files[0];
        this.setState({
            photo_data_file: file
        });
    },
    render: function () {
        var do_you_wish_to_provide = gettext("Do you wish to provide a multimedia item (video or audio) " +
            "to accompany your story?");
        var no = gettext("No");
        var yes = gettext("Yes");
        var what_kind = gettext("Will the multimedia item be a photo, YouTube video, or a SoundCloud clip?");
        var type_selection_options = [];
        $.each(Object.keys(this.MULTIMEDIA_FORMS), function (type_selection_options, i, key) {
            var form_option = this.MULTIMEDIA_FORMS[key];
            type_selection_options.push(React.createElement("option", {value: key, key: key}, form_option.name));
        }.bind(this, type_selection_options));

        var media_type_form = this.state.wants_to_provide ?
            [
                React.createElement("div", {id: "multimediaKindForm"}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-12"}, 
                            React.createElement("h4", null, what_kind)
                        )
                    ), 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-12"}, 
                            React.createElement("select", {value: this.state.selected_form, 
                                    onChange: this.handle_type_selection}, 
                                type_selection_options
                            )
                        )
                    )
                )
            ] :
            [];
        var dont_provide_multimedia_button_class = this.state.wants_to_provide ?
            this.props.inactive_button_class : this.props.active_button_class;
        var provide_multimedia_button_class = this.state.wants_to_provide ?
            this.props.active_button_class : this.props.inactive_button_class;

        var MultimediaFormTag = this.MULTIMEDIA_FORMS[this.state.selected_form].tag;
        var caption = this.state.wants_to_provide ?
            [React.createElement("input", {id: "multimediaEnglishCaption", 
                    onChange: this.handleEnglishChange, 
                    value: this.state.english_caption}),
                React.createElement("input", {id: "multimediaChineseCaption", 
                       onChange: this.handleChineseChange, 
                       value: this.state.chinese_caption})] : [];
        var select_a_photo = gettext(
            "Please use the space below to upload a photo to your story. " +
            "The photo should have a width and height greater than 400px " +
            "each, be no larger than 2.5 megabytes, and be a JPEG."
        );
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        select_a_photo
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {type: "file", id: "photoUploadField", onChange: this.handleFile})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {id: "photoEnglishCaption", 
                               onChange: this.handlePhotoEnglishChange, 
                               value: this.state.photo_english_caption}), 
                        React.createElement("input", {id: "photoChineseCaption", 
                               onChange: this.handlePhotoChineseChange, 
                               value: this.state.photo_chinese_caption})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, do_you_wish_to_provide)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("button", {id: "provideMultimediaButton", 
                                className: provide_multimedia_button_class, 
                                onClick: this.provide}, 
                            yes
                        ), 
                        React.createElement("button", {id: "dontProvideMultimediaButton", 
                                className: dont_provide_multimedia_button_class, 
                                onClick: this.dont_provide}, 
                            no
                        )
                    )
                ), 
                media_type_form, 
                React.createElement(MultimediaFormTag, {wants_to_provide: this.state.wants_to_provide, 
                                   ref: "multimedia_form"}), 

                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        caption
                    )
                )
            )
        );
    }
});

var EnterStoryForm = React.createClass({displayName: "EnterStoryForm",
    getInitialState: function () {
        return {
            categories: [],
            categories_loading: true,
            selected_category: -1,
            new_category_english: this.props.new_category_english_text,
            new_category_chinese: this.props.new_category_chinese_text,
            english_name: this.props.english_name_text,
            chinese_name: this.props.chinese_name_text,
            pinyin_name: this.props.pinyin_name_text,
            email: this.props.email_text
        };
    },
    continueForward: function () {
        // TODO: All this validation is bs. Validation should be tied to specific fields so I can give meaningful error messages :-/
        if (parseInt(this.state.selected_category) === -1 ||
            (parseInt(this.state.selected_category) === -2 &&
            (this.state.new_category_english === this.props.new_category_english_text || this.state.new_category_english.length === 0) &&
            (this.state.new_category_chinese === this.props.new_category_chinese_text || this.state.new_category_chinese.length === 0)) ||
            this.refs.textArea.getText().length === 0 ||
            ((this.state.english_name === this.props.english_name_text || this.state.english_name.length === 0) &&
            (this.state.chinese_name === this.props.chinese_name_text || this.state.chinese_name.length === 0) &&
            (this.state.pinyin_name === this.props.pinyin_name_text || this.state.pinyin_name.length === 0)) || !this.emailIsValid(this.state.email)) return;

        var postStoryteller = function (category_id) {
            $.ajax({
                method: "POST",
                url: STORYTELLER_ENDPOINT,
                dataType: "json",
                data: {
                    relationship_to_story: category_id,
                    story_text: this.refs.textArea.getText(),
                    email: this.state.email,
                    related_adoptee: this.props.adoptee_id,
                    // TODO: The validation logic below is repeated like, everywhere, and should really be its own function
                    english_name: this.state.english_name !== this.props.english_name_text
                    && this.state.english_name.length > 0 ?
                        this.state.english_name : null,
                    chinese_name: this.state.chinese_name !== this.props.chinese_name_text
                    && this.state.chinese_name.length > 0 ?
                        this.state.chinese_name : null,
                    pinyin_name: this.state.pinyin_name !== this.props.pinyin_name_text
                    && this.state.pinyin_name.length > 0 ?
                        this.state.pinyin_name : null
                },
                success: function (data) {
                    this.props.transition({
                        tag: MediaUpload,
                        props: {story_teller: data.id}
                    });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(STORYTELLER_ENDPOINT, status, err.toString());
                }.bind(this)
            })
        }.bind(this);
        if (parseInt(this.state.selected_category) === -2) {
            // TODO: Since error is boilerplate on all our AJAX calls it can probably be implemented as part of ajaxSetup
            $.ajax({
                method: "POST",
                url: CATEGORY_ENDPOINT,
                dataType: "json",
                data: {
                    english_name: this.state.new_category_english !== this.props.new_category_english_text
                    && this.state.new_category_english.length > 0 ?
                        this.state.new_category_english : null,
                    chinese_name: this.state.new_category_chinese !== this.props.new_category_chinese_text
                    && this.state.new_category_chinese.length > 0 ?
                        this.state.new_category_chinese : null
                },
                success: function (data) {
                    postStoryteller(data.id);
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(CATEGORY_ENDPOINT, status, err.toString());
                }.bind(this)
            });
        } else {
            postStoryteller(this.state.selected_category)
        }
    },
    getDefaultProps: function () {
        return {
            // Translators: Seen by person when creating a new relationship category
            new_category_english_text: gettext("Relationship name in English"),
            // Translators: Seen by person when creating a new relationship category
            new_category_chinese_text: gettext("Relationship name in Chinese"),
            english_name_text: gettext("Your name in English (if applicable)"),
            chinese_name_text: gettext("Your name in Chinese (if applicable)"),
            pinyin_name_text: gettext("Your name in Pinyin (if applicable)"),
            email_text: gettext("Your email")
        };
    },
    componentDidMount: function () {
        $.ajax({
            url: CATEGORY_ENDPOINT,
            dataType: "json",
            success: function (data) {
                this.setState({
                    categories: data,
                    categories_loading: false
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(CATEGORY_ENDPOINT, status, err.toString());
            }.bind(this)
        });
    },
    handleSelection: function (event) {
        this.setState({
            selected_category: event.target.value
        });
    },
    // to-do: Clean up the ridiculously non-DRY pattern here
    handleCategoryCreatorEnglishChange: function (event) {
        this.setState({
            new_category_english: event.target.value
        });
    },
    handleCategoryCreatorChineseChange: function (event) {
        this.setState({
            new_category_chinese: event.target.value
        });
    },
    handleEnglishNameChange: function (event) {
        this.setState({
            english_name: event.target.value
        });
    },
    handleChineseNameChange: function (event) {
        this.setState({
            chinese_name: event.target.value
        });
    },
    handlePinyinNameChange: function (event) {
        this.setState({
            pinyin_name: event.target.value
        });
    },
    handleEmailChange: function (event) {
        this.setState({
            email: event.target.value
        });
    },
    emailIsValid: function (email) {
        // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email);
    },
    render: function () {
        var what_is_your_name = gettext("What is your name?");
        var what_is_your_email = gettext("What is your email?");
        var what_is_your_relationship = gettext("What is your relationship to the adoptee?");
        var enter_story_instructions = gettext("Please enter your story below. We recommend that you first" +
            " type in Word to avoid losing your work. You will have an opportunity " +
            "to upload multimedia in the next prompt. ");
        var categories;
        if (this.state.categories_loading) {
            var loading = gettext("Loading");
            categories = [React.createElement("option", {value: -1}, loading)]
        }
        else {
            categories = [];
            var select_a_category = gettext("Select relationship");
            categories.push(React.createElement("option", {value: -1, key: -1}, select_a_category));
            categories.push(this.state.categories.map(function (json, i, arr) {
                var order_of_names;
                if (language === ENGLISH)
                    order_of_names = [json.english_name, json.chinese_name];
                else
                    order_of_names = [json.chinese_name, json.english_name];
                var name = firstNonNullOrDefault(order_of_names, null);
                return React.createElement("option", {value: json.id, key: json.id}, name);
            }));
            var other = gettext("Other relationship");
            categories.push(React.createElement("option", {value: -2, key: -2}, other));
        }
        var other_category_creator;
        if (parseInt(this.state.selected_category) === -2) {
            // Translators: Seen by person when creating a new relationship category
            var instructions = gettext("Please fill out the relationship " +
                "name in at least one language");
            other_category_creator = [
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, instructions)
                    )
                ),
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {value: this.state.new_category_english, 
                               onChange: this.handleCategoryCreatorEnglishChange})
                    )
                ),
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {value: this.state.new_category_chinese, 
                               onChange: this.handleCategoryCreatorChineseChange})
                    )
                )
            ]
        } else {
            other_category_creator = [];
        }
        var email_class = this.emailIsValid(this.state.email) ? "validEmail" : "invalidEmail";
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, what_is_your_name)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {value: this.state.english_name, onChange: this.handleEnglishNameChange}), 
                        React.createElement("input", {value: this.state.chinese_name, onChange: this.handleChineseNameChange}), 
                        React.createElement("input", {value: this.state.pinyin_name, onChange: this.handlePinyinNameChange})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, what_is_your_email)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("input", {value: this.state.email, 
                               onChange: this.handleEmailChange, 
                               className: email_class})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, what_is_your_relationship)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("select", {value: this.state.selected_category, 
                                onChange: this.handleSelection}, 
                            categories
                        )
                    )
                ), 
                other_category_creator, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        enter_story_instructions
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement(AreaTextEditor, {ref: "textArea"})
                    )
                )
            )
        );
    }
});

var AdopteeSearchListing = React.createClass({displayName: "AdopteeSearchListing",
    handleClick: function (event) {
        // Translators: which adoptee someone has selected to add to
        var text = gettext("Selected: %s");
        var names = [this.props.english_name, this.props.chinese_name, this.props.pinyin_name];
        var names_text = [];
        for (var i = 0; i < names.length; i++) {
            if (names[i])
                names_text.push(names[i]);
        }
        names_text = names_text.join(" ");
        text = interpolate(text, [names_text]);
        this.props.select_adoptee(this.props.id, text);
    },
    render: function () {
        var photo = this.props.photo;
        return (
            React.createElement("div", {className: "adopteeListing", onClick: this.handleClick}, 
                React.createElement(NameHeader, {header_tag: "h3", 
                            sub_header_tag: "h4", 
                            class_string: "adopteeListingName", 
                            english_name: this.props.english_name, 
                            chinese_name: this.props.chinese_name, 
                            pinyin_name: this.props.pinyin_name}), 

                React.createElement("div", {className: "adopteeListingPhoto"}, 
                    React.createElement("img", {src: photo})
                )
            )
        );
    }
});

var CreateAdopteeForm = React.createClass({displayName: "CreateAdopteeForm",
    getInitialState: function () {
        return {
            // Translators: Part of the adoptee creation form
            english_name: gettext("English Name"),
            english_name_valid: false,
            // Translators: Part of the adoptee creation form
            pinyin_name: gettext("Pinyin Name"),
            pinyin_name_valid: false,
            // Translators: Part of the adoptee creation form
            chinese_name: gettext("Chinese Name"),
            chinese_name_valid: false
        }
    },
    englishInputChange: function (event) {
        this.setState({english_name: event.target.value, english_name_valid: true});
    },
    pinyinInputChange: function (event) {
        this.setState({pinyin_name: event.target.value, pinyin_name_valid: true});
    },
    chineseInputChange: function (event) {
        this.setState({chinese_name: event.target.value, chinese_name_valid: true});
    },
    continueForward: function () {
        // TODO: Make this block duplicate posts
        var get_name_value = function (name, valid) {
            if (valid && name && name.length > 0)
                return name;

            return null;
        };

        // TODO: Refactor
        if ((this.state.english_name_valid && this.state.english_name.length > 0) ||
            (this.state.pinyin_name_valid && this.state.pinyin_name.length > 0) ||
            (this.state.chinese_name_valid && this.state.chinese_name.length > 0)) {
            $.ajax({
                url: ADOPTEE_CREATE_ENDPOINT,
                type: 'POST',
                dataType: "json",
                data: {
                    english_name: get_name_value(this.state.english_name,
                        this.state.english_name_valid),
                    chinese_name: get_name_value(this.state.chinese_name,
                        this.state.chinese_name_valid),
                    pinyin_name: get_name_value(this.state.pinyin_name,
                        this.state.pinyin_name_valid)
                },
                success: function (data) {
                    this.props.transition({
                        tag: EnterStoryForm,
                        props: {adoptee_id: data.id}
                    });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(ADOPTEE_CREATE_ENDPOINT, status, err.toString());
                }.bind(this)
            });
        }
    },
    render: function () {
        var what_is_name = gettext("What is the name of the adoptee connected to your story?");
        return (
            React.createElement("div", {className: "personCreatorContainer"}, 
                React.createElement("h4", null, what_is_name), 
                React.createElement("input", {className: "nameCreationInput", 
                       value: this.state.english_name, 
                       onChange: this.englishInputChange}), 
                React.createElement("input", {className: "nameCreationInput", 
                       value: this.state.pinyin_name, 
                       onChange: this.pinyinInputChange}), 
                React.createElement("input", {className: "nameCreationInput", 
                       value: this.state.chinese_name, 
                       onChange: this.chineseInputChange})
            )
        );
    }
});

var AddToAdopteeForm = React.createClass({displayName: "AddToAdopteeForm",
    getInitialState: function () {
        return {
            value: gettext('Name'),
            search_url: ADOPTEE_SEARCH_ENDPOINT,
            selected_adoptee: null
        };
    },
    handleChange: function (event) {
        this.setState({
            value: event.target.value,
            selected_adoptee: null
        }, this.getAdoptees);
    },
    getAdoptees: debounce(function () {
        this.setState({
            search_url: ADOPTEE_SEARCH_ENDPOINT
                .slice(0, ADOPTEE_SEARCH_ENDPOINT.indexOf("999999999"))
            + this.state.value + "/"
        });
    }, 250),
    selectAdoptee: function (id, text) {
        this.setState({
            selected_adoptee: id,
            value: text
        });
    },
    continueForward: function () {
        if (this.state.selected_adoptee) {
            this.props.transition({
                tag: EnterStoryForm,
                props: {adoptee_id: this.state.selected_adoptee}
            });
        }
    },
    render: function () {
        var search_result_maker = function (search_result_json) {
            return {
                "component": AdopteeSearchListing,
                "props": {
                    "english_name": search_result_json.english_name,
                    "chinese_name": search_result_json.chinese_name,
                    "pinyin_name": search_result_json.pinyin_name,
                    "photo": search_result_json.photo_front_story,
                    "id": search_result_json.id,
                    "select_adoptee": this.selectAdoptee
                }
            };
        }.bind(this);
        var dropdown = this.state.selected_adoptee ? []
            : React.createElement(PaginationSection, {make_element: search_result_maker, 
                                 initial_url: this.state.search_url, 
                                 class_string: "adopteeListingDropdown"});
        var what_is_name = gettext("What is the name of the adoptee connected to your story?");
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("div", {id: "personPickerContainer"}, 
                        React.createElement("h4", null, what_is_name), 
                        React.createElement("input", {type: "text", 
                               value: this.state.value, 
                               onChange: this.handleChange, 
                               className: "form-control"}), 
                        dropdown
                    )
                )
            )
        );
    }
});

var ProvideForm = React.createClass({displayName: "ProvideForm",
    getInitialState: function () {
        return {other_content: true}
    },
    noOtherContent: function () {
        this.hasOtherContent(false);
    },
    otherContent: function () {
        this.hasOtherContent(true);
    },
    hasOtherContent: function (has_content) {
        this.setState({other_content: has_content});
    },
    continueForward: function () {
        this.refs.form.continueForward();
    },
    render: function () {
        var other_content_question = gettext("Does the adoptee in your story have other content on this site?");
        var no = gettext("No");
        var yes = gettext("Yes");
        var form = this.state.other_content ?
        {
            tag: AddToAdopteeForm,
            props: {
                active_button_class: this.props.active_button_class,
                inactive_button_class: this.props.inactive_button_class,
                transition: this.props.transition
            }
        }
            :
        {
            tag: CreateAdopteeForm,
            props: {
                active_button_class: this.props.active_button_class,
                inactive_button_class: this.props.inactive_button_class,
                transition: this.props.transition
            }
        };
        var no_other_content_class = this.state.other_content ? this.props.inactive_button_class
            : this.props.active_button_class;
        var other_content_class = this.state.other_content ? this.props.active_button_class
            : this.props.inactive_button_class;

        var FormTag = form.tag;
        var form_props = form.props;

        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, other_content_question)
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("button", {id: "hasOtherContentButton", 
                                className: other_content_class, 
                                onClick: this.otherContent}, 
                            yes
                        ), 
                        React.createElement("button", {id: "hasNoOtherContentButton", 
                                className: no_other_content_class, 
                                onClick: this.noOtherContent}, 
                            no
                        )
                    )
                ), 
                React.createElement(FormTag, React.__spread({},  form_props, {ref: "form"}))
            )
        );
    }
});

var ThanksForContacting = React.createClass({displayName: "ThanksForContacting",
    render: function () {
        var thank_you = gettext("Thank you for your contact information. We " +
            "will be in touch with you shortly.");
        return React.createElement("h4", null, thank_you)
    }
});

var SubmitStart = React.createClass({displayName: "SubmitStart",
    continueForward: function () {
        this.refs.form.continueForward();
    },
    render: function () {
        var form_props = {
            active_button_class: this.props.active_button_class,
            inactive_button_class: this.props.inactive_button_class,
            transition: this.props.transition
        };

        var tos = gettext("By submitting your story to this site, you are agreeing to post your content publicly. You are also promising that the content is not plagiarized from anyone, that it does not infringe a copyright or trademark, and that it isn’t libelous or otherwise unlawful or misleading. You also agree to be bound by this site’s Terms of Use and Privacy Policy.");

        return (
            React.createElement("div", null, 
                React.createElement(ProvideForm, React.__spread({},  form_props, {ref: "form"})), 

                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("p", {className: "tiny-tos"}, 
                            tos
                        )
                    )
                )
            )
        );
    }
});

var SubmitPrompt = React.createClass({displayName: "SubmitPrompt",
    getInitialState: function () {
        return {
            content: {
                tag: SubmitStart,
                props: {}
            }
        }
    },
    getDefaultProps: function () {
        return {
            active_button_class: "button active",
            inactive_button_class: "button"
        }
    },
    transition: function (content) {
        this.setState({
            content: content
        });
    },
    childContinue: function () {
        this.refs.content.continueForward();
    },
    render: function () {
        // Translators: Title of the modal for someone submitting a story to the site
        var tell_your_story = gettext("Tell Your Story");

        // Translators: Continue button on story submission modal
        var continue_text = gettext("Continue");

        var ContentTag = this.state.content.tag;
        var content_props = this.state.content.props;
        content_props['active_button_class'] = this.props.active_button_class;
        content_props['inactive_button_class'] = this.props.inactive_button_class;
        content_props['transition'] = this.transition;
        return (
            React.createElement(BootstrapModal, {
                extra_class: "prompt-modal"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h3", {className: "promptTitle"}, tell_your_story)
                    )
                ), 
                React.createElement(ContentTag, React.__spread({},  content_props, {ref: "content"})), 

                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("button", {id: "continueButton", 
                                className: this.props.active_button_class, 
                                onClick: this.childContinue}, 
                            continue_text
                        )
                    )
                )
            )
        )
    }
});

var Route = ReactRouter.Route;

var routes = (
    React.createElement(Route, {handler: FrontPage}, 
        React.createElement(Route, {name: "adoptee", path: "adoptee/:id", handler: AdopteeDetail}), 
        React.createElement(Route, {name: "submit", path: "submit", handler: SubmitPrompt}), 
        React.createElement(Route, {name: "about", path: "about", handler: AboutView})
    )
);

var appElement = document.getElementById('root');
Modal.setAppElement(appElement);
Modal.injectCSS();


function analytics(state, options) {
    if (!options) {
        options = {};
    }
    options.page = state.path;
    ga('send', 'pageview', options);
}

ReactRouter.run(routes, ReactRouter.HashLocation, function (FrontPage, state) {
    React.render(React.createElement(FrontPage, null), appElement);
    // TODO: Analytics here
    // analytics(state)
});
React.initializeTouchEvents(true);