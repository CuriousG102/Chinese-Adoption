// To my successor: Pro-tip; When you're editing this file, super handy to use
//                  the command jsx --watch staticSrc/ static/pages from the
//                  pages directory and leave it running

var Modal = ReactModal;

var Button = React.createClass({
    render: function () {
        var class_string = this.props.class_string ? this.props.class_string : "btn btn-primary btn-lg active";
        var type_string = this.props.type_string ? this.props.type_string : "button";
        var styles = this.props.styles ? this.props.styles : {};

        return (
            <button type={type_string} style={styles} className={class_string} onClick={this.props.handle_click}>
                {this.props.text}
            </button>
        );
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

        var class_string = this.props.class_string ? this.props.class_string : "";
        return (
            <div className={class_string}>
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
                <div className="adopteeName">
                    <NameHeader english_name={this.props.english_name}
                                chinese_name={this.props.chinese_name}
                                pinyin_name={this.props.pinyin_name}
                                header_tag={Primary_Name_Tag}
                                sub_header_tag={Secondary_Name_Tag}></NameHeader>
                </div>
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
    getInitialState: function () {
        return {
            embed_shizzle: {__html: ""}, isInnerHTML: true,
            caption: "", style_overrides: null
        };
    },
    getCaption: function (media_item) {
        var caption_preference = language === ENGLISH ? [media_item.english_caption, media_item.chinese_caption]
            : [media_item.chinese_caption, media_item.english_caption];
        for (var i = 0; i < caption_preference.length; i++) {
            if (caption_preference[i]) return caption_preference[i];
        }

        return "";
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
                        caption: this.getCaption(audio),
                        style_overrides: null
                    });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(audio_url, status, err.toString());
                }.bind(this)
            });
        } else if (this.props.media.video.length > 0) {
            var video = this.props.media.video[0];
            var video_iframe_url = video.iframe_url;
            var embed_code = <iframe width="100%" height="315" src={video_iframe_url} frameborder="0"
                                     allowfullscreen></iframe>;
            this.setState({
                embed_shizzle: embed_code,
                isInnerHTML: false,
                caption: this.getCaption(video),
                style_overrides: null
            });
        } else if (this.props.media.photo.length > 0) {
            var photo = this.props.media.photo[0];
            var photo_url = photo.photo_file;
            var special_style = {
                "max-width": "60%",
                "width": "unset"
            };
            var embed_code = <img src={photo_url}/>;
            this.setState({
                embed_shizzle: embed_code,
                isInnerHTML: false,
                caption: this.getCaption(photo),
                style_overrides: special_style
            });
        }
    },
    render: function () {
        var content;
        if (this.state.isInnerHTML)
            content =
                <div>
                    <div className="media-embed"
                         dangerouslySetInnerHTML={this.state.embed_shizzle}/>
                    <div className="media-caption">
                        <p>
                            {this.state.caption}
                        </p>
                    </div>
                </div>;
        else
            content =
                <div>
                    <div className="media-embed">
                        {this.state.embed_shizzle}
                    </div>
                    <div className="media-caption">
                        <p>
                            {this.state.caption}
                        </p>
                    </div>
                </div>;

        return this.state.style_overrides ?
            <div className="media-container" style={this.state.style_overrides}>{content}</div>
            : <div className="media-container">{content}</div>
    }
});

var processStoryText = function (story_text) {
    story_text = story_text.split("<br>");
    for (var i = 0; i < story_text.length; i++) {
        story_text[i] = <p>{story_text[i]}</p>
    }
    return story_text
};

var StoryTeller = React.createClass({
    render: function () {
        var story_text = this.props.story_text ? processStoryText(this.props.story_text)
            : <p></p>;
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

                <Media media={this.props.media}></Media>

                <div>
                    {story_text}
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
        var domNode = React.findDOMNode(this.refs.monitor_div);
        var el = $(domNode);
        el = el.children();
        el = el.last();

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

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
            <div className={class_string} ref="monitor_div">
                {items_as_rendered}
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

        if (this.props.photo_front_story) stuff_to_add.push(<img src={this.props.photo_front_story.photo_file}></img>);
        var story_text = processStoryText(this.props.front_story.story_text);
        stuff_to_add.push(<div className="story-container">
            <p className="story-text">{story_text}</p>
        </div>);

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
            // Translators: %s marks the place where a person's name should be inserted. The webpage prefers the name in the viewer's language first and then uses other names if that one is not available
            link_text = gettext("More about %s");
            link_text = interpolate(link_text, [name_for_link]);
        } else {
            link_text = gettext("More about this person");
        }
        var link = "/#/adoptee/" + this.props.id.toString();

        var class_string = this.props.className ? this.props.className : "";

        return (
            <div className={class_string}>
                {stuff_to_add}
                <a href={link} className="detail-link">
                    {link_text}
                </a>
            </div>
        );
    }
});

var FrontPage = React.createClass({
    mixins: [ReactRouter.Navigation],
    render: function () {
        // Translators: Title for the site
        var title = gettext("Chinese-American");
        // Translators: Summary of the site
        var summary = gettext("From 1999 to 2013, 71,632 adoptions of Chinese children by American families were reported to the U.S. Department of State. There are many narratives around these adoptions, but this site is a place for those most intimately involved in the process to tell their own stories");
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
            // put three items in each row with widths of 6, 3, 3
            //                                            3, 6, 3
            //                                            3, 3, 6 etc.
            var columned_items_for_rows = [];
            var ITEMS_IN_A_ROW = 3;
            for (var i = 0; i < items.length; i++) {
                var row = Math.floor(i / ITEMS_IN_A_ROW) % ITEMS_IN_A_ROW; // so, 0th, 1st, and 2nd rows
                var col = i % ITEMS_IN_A_ROW;
                var item = items[i];
                if (row === col)
                    columned_items_for_rows.push(
                        <div className="col-md-6">{item}</div>
                    );
                else
                    columned_items_for_rows.push(
                        <div className="col-md-3">{item}</div>
                    );
            }

            for (var i = 0; i < columned_items_for_rows.length; i += ITEMS_IN_A_ROW) {
                var end_slice_index = i + ITEMS_IN_A_ROW > columned_items_for_rows.length ?
                    columned_items_for_rows.length
                    : i + ITEMS_IN_A_ROW;
                var row_items = columned_items_for_rows.slice(i, end_slice_index);
                items_to_return.push(
                    <div className="row">
                        {row_items}
                    </div>
                );
            }

            return items_to_return;
        };

        var paginator = <PaginationSection
            make_element={story_card_maker}
            initial_url={ADOPTEE_LIST_ENDPOINT}
            items_prerender_processor={items_prerender_processor}></PaginationSection>;

        var RouteHandler = ReactRouter.RouteHandler;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 id="front-page-header">{title}</h1>
                    </div>
                </div>
                <div className="row" id="header-bottom-row">
                    <div className="col-md-7">
                        <p>{summary}</p>
                    </div>
                    <div className="col-md-5">
                        <Button text={submit} handle_click={submit_handle_click}/>
                        <Button text={about} handle_click={about_handle_click}/>
                    </div>
                </div>
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
                className="Modal__Bootstrap modal-lg"
                onRequestClose={this.handleModalCloseRequest}
                >
                <div className="modal-content">
                    <div className="container-fluid">
                        <div className="row" id="close-row">
                            <div className="col-md-11"/>
                            <div className="col-md-1">
                                <span className="glyphicon glyphicon-remove-circle" aria-hidden="true"
                                      onClick={this.handleModalCloseRequest}></span>
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
                <div className="row">
                    <div className="col-md-12">
                        <StoryTeller english_name={story.english_name}
                                     chinese_name={story.chinese_name}
                                     pinyin_name={story.pinyin_name}
                                     relationship_to_story={story.relationship_to_story}
                                     media={story.media}
                                     story_text={story.story_text}
                            />
                    </div>
                </div>
            )
        }
        return (
            <BootstrapModal>
                <div className="row">
                    <div className="col-md-12">
                        <Adoptee
                            english_name={this.state.english_name}
                            chinese_name={this.state.chinese_name}
                            pinyin_name={this.state.pinyin_name}
                            />
                    </div>
                </div>
                {story_components}
            </BootstrapModal>
        );
    }
});

var AboutView = React.createClass({
    render: function () {
        return (
            <BootstrapModal>
                <div className="row">
                    <div className="col-md-12">
                        // about text and a couple of images
                    </div>
                </div>
            </BootstrapModal>
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

var EnterStoryForm = React.createClass({
    render: function () {
        return (
            <div>
                You see nothing, nothing!
            </div>
        );
    }
});

var AdopteeSearchListing = React.createClass({
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
        text = interpolate(text, names_text);
        this.props.select_adoptee(this.props.id, text);
    },
    render: function () {
        var photo = this.props.photo ? <img src={this.props.photo}/> : [];
        return (
            <div className="adopteeListing" onClick={this.handleClick}>
                <NameHeader header_tag="h3"
                            sub_header_tag="h4"
                            class_string="adopteeListingName"
                            english_name={this.props.english_name}
                            chinese_name={this.props.chinese_name}
                            pinyin_name={this.props.pinyin_name}/>

                <div className="adopteeListingPhoto">
                    {photo}
                </div>
            </div>
        );
    }
});

var createAdopteeForm = React.createClass({
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
    continueForward() {
        // TODO: Make this block duplicate posts
        var get_name_value = function (name, valid) {
            if (valid && name)
                return name;

            return null;
        };

        if (this.state.english_name_valid ||
            this.state.pinyin_name_valid ||
            this.state.chinese_name_valid) {
            $.ajax({
                url: ADOPTEE_CREATE_ENDPOINT,
                type: 'POST',
                dataType: "json",
                data: JSON.stringify({
                    english_name: get_name_value(this.state.english_name,
                        this.state.english_name_valid),
                    chinese_name: get_name_value(this.state.chinese_name,
                        this.state.chinese_name_valid),
                    pinyin_name: get_name_value(this.state.pinyin_name,
                        this.state.pinyin_name_valid)
                }),
                success: function (data) {
                    this.props.transition(<EnterStoryForm adoptee_id={data.id}
                                                          ref="content"/>)
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(ADOPTEE_CREATE_ENDPOINT, status, err.toString());
                }.bind(this)
            })
        }
    },
    render: function () {
        var what_is_name = gettext("What is the name of the adoptee connected to your story?");
        return (
            <div className="personCreatorContainer">
                <h4>{what_is_name}</h4>
                <input className="nameCreationInput"
                       value={this.state.english_name}
                       onChange={this.englishInputChange}/>
                <input className="nameCreationInput"
                       value={this.state.pinyin_name}
                       onChange={this.pinyinInputChange}/>
                <input className="nameCreationInput"
                       value={this.state.chinese_name}
                       onChange={this.chineseInputChange}/>
            </div>
        );
    }
});

var AddToAdopteeForm = React.createClass({
    getInitialState: function () {
        return {
            value: gettext('Name'),
            search_url: ADOPTEE_SEARCH_ENDPOINT
            + "? "
            + $.param({q: ""}),
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
            + "?"
            + $.param({q: this.state.value})
        });
    }, 250),
    selectAdoptee: function (id, text) {
        this.setState({
            selected_adoptee: id,
            value: text
        });
    },
    continueForward () {
        if (this.state.selected_adoptee) {
            this.props.transition(<EnterStoryForm adoptee_id={this.state.selected_adoptee}
                                                  ref="content"/>)
        }
    },
    render: function () {
        var search_result_maker = function (search_result_json) {
            return {
                "component": AdopteeSearchListing,
                "english_name": search_result_json.english_name,
                "chinese_name": search_result_json.chinese_name,
                "pinyin_name": search_result_json.pinyin_name,
                "photo": search_result_json.photo_front_story,
                "id": search_result_json.id,
                "select_adoptee": this.selectAdoptee
            };
        }.bind(this);
        var matching_adoptees = <PaginationSection make_element={search_result_maker}
                                                   initial_url={this.state.search_url}
                                                   class_string="adopteeListingDropdown"/>;
        var what_is_name = gettext("What is the name of the adoptee connected to your story?");
        return (
            <div className="row">
                <div className="col-md-12">
                    <div id="personPickerContainer">
                        <h4>{what_is_name}</h4>
                        <input type="text"
                               value={this.state.value}
                               onChange={this.handleChange}/>
                        {matching_adoptees}
                    </div>
                </div>
            </div>
        );
    }
});

var ProvideForm = React.createClass({
    getInitialState: function () {
        return {other_content: true}
    },
    noOtherContent: function () {
        this.hasOtherContent(false);
    },
    otherContent: function () {
        this.hasOtherContent(true);
    },
    hasOtherContent(has_content) {
        this.setState({other_content: has_content});
    },
    continueForward() {
        this.refs.form.continueForward();
    },
    render: function () {
        var other_content_question = gettext("Does the adoptee in your story have other content on this site?");
        var no = gettext("No");
        var yes = gettext("Yes");
        var form = this.state.other_content ? <AddToAdopteeForm active_button_class={this.props.active_button_class}
                                                                inactive_button_class={this.props.inactive_button_class}
                                                                transition={this.props.transition}
                                                                ref="form"/>
            : <CreateAdopteeForm active_button_class={this.props.active_button_class}
                                 inactive_button_class={this.props.inactive_button_class}
                                 transition={this.props.transition}
                                 ref="form"/>;
        var no_other_content_class = this.state.other_content ? this.props.inactive_button_class
            : this.props.active_button_class;
        var other_content_class = this.state.other_content ? this.props.active_button_class
            : this.props.inactive_button_class;

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h4>{other_content_question}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <button id="hasNoOtherContentButton"
                                className={no_other_content_class}
                                onClick={this.noOtherContent}>
                            {no}
                        </button>
                        <button id="hasOtherContentButton"
                                className={other_content_class}
                                onClick={this.otherContent}>
                            {yes}
                        </button>
                    </div>
                </div>
                {form}
            </div>
        );
    }
});

var ThanksForContacting = React.createClass({
    render: function () {
        var thank_you = gettext("Thank you for your contact information. We " +
            "will be in touch with you shortly.");
        return <h4>{thank_you}</h4>
    }
});

var ContactForm = React.createClass({
    handleChange: function (event) {
        this.setState({
            value: event.target.value
        })
    },
    continueForward: function () {
        // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var validateEmail = function (email) {
            var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(email);
        };
        if (validateEmail(this.state.value)) {
            // TODO: Make an endpoint we can submit contact requests to
            this.props.transition(<ThanksForContacting
                ref="content"/>)
        }
    },
    render: function () {
        var submit = gettext("Submit");
        return (
            <div className="row">
                <div className="col-md-12">
                    <input id="emailInput"
                           value={this.state.value}
                           onChange={this.handleChange}/>
                    <button id="emailButton"
                            className="btn btn-primary active"
                            onClick={this.continueForward}>
                        {submit}
                    </button>
                </div>
            </div>
        );
    }
});

var SubmitStart = React.createClass({
    getInitialState: function () {
        return {provide_own_story: true}
    },
    contact: function () {
        this.willBeContacted(true);
    },
    provide: function () {
        this.willBeContacted(false);
    },
    willBeContacted: function (beContacted) {
        this.setState({
            provide_own_story: !beContacted
        });
    },
    continueForward: function () {
        this.refs.form.continueForward();
    },
    render: function () {
        // Translators: Prompt for story submission
        var how_tell_story = gettext("How would you like to tell your story?");
        // Translators: Option for story submission: Opposing option is 'Provide my own story'
        var be_contacted = gettext("Be contacted");
        // Translators: Option for story submission: Opposing option is 'Be contacted'
        var provide_my_own = gettext("Provide my own story");
        // Translators: Prompt for story submission

        var be_contacted_button_class = this.state.provide_own_story ? this.props.inactive_button_class
            : this.props.active_button_class;
        var provide_your_own_button_class = this.state.provide_own_story ? this.props.active_button_class
            : this.props.inactive_button_class;
        var form = this.state.provide_my_own_story ? <ProvideForm active_button_class={this.props.active_button_class}
                                                                  inactive_button_class={this.props.inactive_button_class}
                                                                  transition={this.props.transition}
                                                                  ref="form"/>
            : <ContactForm active_button_class={this.props.active_button_class}
                           inactive_button_class={this.props.inactive_button_class}
                           transition={this.props.transition}
                           ref="form"/>;

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h4>{how_tell_story}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <button id="beContactedButton"
                                className={be_contacted_button_class}
                                onClick={this.contact}>
                            {be_contacted}
                        </button>
                        <button id="provideStoryButton"
                                className={provide_your_own_button_class}
                                onClick={this.provide}>
                            {provide_my_own}
                        </button>
                    </div>
                </div>
                {form}
            </div>
        );
    }
});

var SubmitPrompt = React.createClass({
    getInitialState: function () {
        return {
            content: <SubmitStart active_button_class={this.props.active_button_class}
                                  inactive_button_class={this.props.inactive_button_class}
                                  transition={this.transition}
                                  ref="content"/>
        }
    },
    getDefaultProps: function () {
        return {
            active_button_class: "btn btn-primary btn-lg active-form-selector",
            inactive_button_class: "btn btn-default btn-lg active-form-selector"
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
        return (
            <BootstrapModal>
                <div className="row">
                    <div className="col-md-12">
                        <h2>{tell_your_story}</h2>
                    </div>
                </div>
                {this.state.content}
                <div className="row">
                    <div className="col-md-12">
                        <button id="continueButton"
                                className={this.props.active_button_class}
                                onClick={this.childContinue}>
                            {continue_text}
                        </button>
                    </div>
                </div>
            </BootstrapModal>
        )
    }
});

var Route = ReactRouter.Route;

var routes = (
    <Route handler={FrontPage}>
        <Route name="adoptee" path="adoptee/:id" handler={AdopteeDetail}/>
        <Route name="submit" path="submit" handler={SubmitPrompt}/>
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