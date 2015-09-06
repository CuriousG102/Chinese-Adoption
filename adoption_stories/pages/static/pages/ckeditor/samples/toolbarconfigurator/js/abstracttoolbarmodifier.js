﻿"function" != typeof Object.create && function () {
    var a = function () {
    };
    Object.create = function (b) {
        if (1 < arguments.length)throw Error("Second argument not supported");
        if (null === b)throw Error("Cannot set a null [[Prototype]]");
        if ("object" != typeof b)throw TypeError("Argument must be an object");
        a.prototype = b;
        return new a
    }
}();
CKEDITOR.plugins.add("toolbarconfiguratorarea", {
    afterInit: function (a) {
        a.addMode("wysiwyg", function (b) {
            var c = CKEDITOR.dom.element.createFromHtml('<div class="cke_wysiwyg_div cke_reset" hidefocus="true"></div>');
            a.ui.space("contents").append(c);
            c = a.editable(c);
            c.detach = CKEDITOR.tools.override(c.detach, function (b) {
                return function () {
                    b.apply(this, arguments);
                    this.remove()
                }
            });
            a.setData(a.getData(1), b);
            a.fire("contentDom")
        });
        a.dataProcessor.toHtml = function (b) {
            return b
        };
        a.dataProcessor.toDataFormat = function (b) {
            return b
        }
    }
});
Object.keys || (Object.keys = function () {
    var a = Object.prototype.hasOwnProperty, b = !{toString: null}.propertyIsEnumerable("toString"), c = "toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(" "), e = c.length;
    return function (d) {
        if ("object" !== typeof d && ("function" !== typeof d || null === d))throw new TypeError("Object.keys called on non-object");
        var g = [], f;
        for (f in d)a.call(d, f) && g.push(f);
        if (b)for (f = 0; f < e; f++)a.call(d, c[f]) && g.push(c[f]);
        return g
    }
}());
(function () {
    function a(b, c) {
        this.cfg = c || {};
        this.hidden = false;
        this.editorId = b;
        this.fullToolbarEditor = new ToolbarConfigurator.FullToolbarEditor;
        this.actualConfig = this.originalConfig = this.mainContainer = null;
        this.isEditableVisible = this.waitForReady = false;
        this.toolbarContainer = null;
        this.toolbarButtons = []
    }

    ToolbarConfigurator.AbstractToolbarModifier = a;
    a.prototype.setConfig = function (b) {
        this._onInit(void 0, b, true)
    };
    a.prototype.init = function (b) {
        var c = this;
        this.mainContainer = new CKEDITOR.dom.element("div");
        if (this.fullToolbarEditor.editorInstance !== null)throw"Only one instance of ToolbarModifier is allowed";
        this.editorInstance || this._createEditor(false);
        this.editorInstance.once("loaded", function () {
            c.fullToolbarEditor.init(function () {
                c._onInit(b);
                if (typeof c.onRefresh == "function")c.onRefresh()
            }, c.editorInstance.config)
        });
        return this.mainContainer
    };
    a.prototype._onInit = function (b, c) {
        this.originalConfig = this.editorInstance.config;
        this.actualConfig = c ? JSON.parse(c) : JSON.parse(JSON.stringify(this.originalConfig));
        if (!this.actualConfig.toolbarGroups && !this.actualConfig.toolbar) {
            for (var a = this.actualConfig, d = this.editorInstance.toolbar, g = [], f = d.length, i = 0; i < f; i++) {
                var h = d[i];
                typeof h == "string" ? g.push(h) : g.push({name: h.name, groups: h.groups ? h.groups.slice() : []})
            }
            a.toolbarGroups = g
        }
        typeof b === "function" && b(this.mainContainer)
    };
    a.prototype._createModifier = function () {
        this.mainContainer.addClass("unselectable");
        this.modifyContainer && this.modifyContainer.remove();
        this.modifyContainer = new CKEDITOR.dom.element("div");
        this.modifyContainer.addClass("toolbarModifier");
        this.mainContainer.append(this.modifyContainer);
        return this.mainContainer
    };
    a.prototype.getEditableArea = function () {
        return this.editorInstance.container.findOne("#" + this.editorInstance.id + "_contents")
    };
    a.prototype._hideEditable = function () {
        var b = this.getEditableArea();
        this.isEditableVisible = false;
        this.lastEditableAreaHeight = b.getStyle("height");
        b.setStyle("height", "0")
    };
    a.prototype._showEditable = function () {
        this.isEditableVisible = true;
        this.getEditableArea().setStyle("height",
            this.lastEditableAreaHeight || "auto")
    };
    a.prototype._toggleEditable = function () {
        this.isEditableVisible ? this._hideEditable() : this._showEditable()
    };
    a.prototype._refreshEditor = function () {
        function b() {
            c.editorInstance.destroy();
            c._createEditor(true, c.getActualConfig());
            c.waitForReady = false
        }

        var c = this, a = this.editorInstance.status;
        if (!this.waitForReady)if (a == "unloaded" || a == "loaded") {
            this.waitForReady = true;
            this.editorInstance.once("instanceReady", function () {
                b()
            }, this)
        } else b()
    };
    a.prototype._createEditor = function (b,
                                          c) {
        function e() {
        }

        var d = this;
        this.editorInstance = CKEDITOR.replace(this.editorId);
        this.editorInstance.on("configLoaded", function () {
            var b = d.editorInstance.config;
            c && CKEDITOR.tools.extend(b, c, true);
            a.extendPluginsConfig(b)
        });
        this.editorInstance.on("uiSpace", function (b) {
            b.data.space != "top" && b.stop()
        }, null, null, -999);
        this.editorInstance.once("loaded", function () {
            var c = d.editorInstance.ui.instances, a;
            for (a in c)if (c[a]) {
                c[a].click = e;
                c[a].onClick = e
            }
            d.isEditableVisible || d._hideEditable();
            d.currentActive && d.currentActive.name &&
            d._highlightGroup(d.currentActive.name);
            d.hidden ? d.hideUI() : d.showUI();
            if (b && typeof d.onRefresh === "function")d.onRefresh()
        })
    };
    a.prototype.getActualConfig = function () {
        return JSON.parse(JSON.stringify(this.actualConfig))
    };
    a.prototype._createToolbar = function () {
        if (this.toolbarButtons.length) {
            this.toolbarContainer = new CKEDITOR.dom.element("div");
            this.toolbarContainer.addClass("toolbar");
            for (var b = this.toolbarButtons.length, c = 0; c < b; c = c + 1)this._createToolbarBtn(this.toolbarButtons[c])
        }
    };
    a.prototype._createToolbarBtn =
        function (b) {
            var c = ToolbarConfigurator.FullToolbarEditor.createButton(typeof b.text === "string" ? b.text : b.text.inactive, b.cssClass);
            this.toolbarContainer.append(c);
            c.data("group", b.group);
            c.addClass(b.position);
            c.on("click", function () {
                b.clickCallback.call(this, c, b)
            }, this);
            return c
        };
    a.prototype._fixGroups = function (b) {
        for (var b = b.toolbarGroups || [], c = b.length, a = 0; a < c; a = a + 1) {
            var d = b[a];
            if (d == "/") {
                d = b[a] = {};
                d.type = "separator";
                d.name = "separator" + CKEDITOR.tools.getNextNumber()
            } else {
                d.groups = d.groups || [];
                if (CKEDITOR.tools.indexOf(d.groups,
                        d.name) == -1) {
                    this.editorInstance.ui.addToolbarGroup(d.name, d.groups[d.groups.length - 1], d.name);
                    d.groups.push(d.name)
                }
                this._fixSubgroups(d)
            }
        }
    };
    a.prototype._fixSubgroups = function (b) {
        for (var b = b.groups, c = b.length, a = 0; a < c; a = a + 1) {
            var d = b[a];
            b[a] = {
                name: d,
                totalBtns: ToolbarConfigurator.ToolbarModifier.getTotalSubGroupButtonsNumber(d, this.fullToolbarEditor)
            }
        }
    };
    a.stringifyJSONintoOneLine = function (b, a) {
        var a = a || {}, e = JSON.stringify(b, null, ""), e = e.replace(/\n/g, "");
        if (a.addSpaces) {
            e = e.replace(/(\{|:|,|\[|\])/g,
                function (a) {
                    return a + " "
                });
            e = e.replace(/(\])/g, function (a) {
                return " " + a
            })
        }
        a.noQuotesOnKey && (e = e.replace(/"(\w*)":/g, function (a, b) {
            return b + ":"
        }));
        a.singleQuotes && (e = e.replace(/\"/g, "'"));
        return e
    };
    a.prototype.hideUI = function () {
        this.hidden = true;
        this.mainContainer.hide();
        this.editorInstance.container && this.editorInstance.container.hide()
    };
    a.prototype.showUI = function () {
        this.hidden = false;
        this.mainContainer.show();
        this.editorInstance.container && this.editorInstance.container.show()
    };
    a.extendPluginsConfig =
        function (a) {
            var c = a.extraPlugins;
            a.extraPlugins = (c ? c + "," : "") + "toolbarconfiguratorarea"
        }
})();