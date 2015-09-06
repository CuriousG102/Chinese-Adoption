﻿(function (m) {
    if ("object" == typeof exports && "object" == typeof module)module.exports = m(); else {
        if ("function" == typeof define && define.amd)return define([], m);
        this.CodeMirror = m()
    }
})(function () {
    function m(a, b) {
        if (!(this instanceof m))return new m(a, b);
        this.options = b = b ? S(b) : {};
        S(jf, b, !1);
        rc(b);
        var c = b.value;
        "string" == typeof c && (c = new M(c, b.mode));
        this.doc = c;
        var d = new m.inputStyles[b.inputStyle](this), d = this.display = new kf(a, c, d);
        d.wrapper.CodeMirror = this;
        sd(this);
        td(this);
        b.lineWrapping && (this.display.wrapper.className +=
            " CodeMirror-wrap");
        b.autofocus && !Xa && d.input.focus();
        ud(this);
        this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: !1,
            delayingBlurEvent: !1,
            focused: !1,
            suppressEdits: !1,
            pasteIncoming: !1,
            cutIncoming: !1,
            draggingText: !1,
            highlight: new Ya,
            keySeq: null,
            specialChars: null
        };
        var e = this;
        y && 11 > z && setTimeout(function () {
            e.display.input.reset(true)
        }, 20);
        lf(this);
        vd || (mf(), vd = !0);
        Fa(this);
        this.curOp.forceUpdate = !0;
        wd(this, c);
        b.autofocus && !Xa || e.hasFocus() ? setTimeout(Za(sc, this), 20) : $a(this);
        for (var f in Ga)if (Ga.hasOwnProperty(f))Ga[f](this,
            b[f], xd);
        yd(this);
        b.finishInit && b.finishInit(this);
        for (c = 0; c < tc.length; ++c)tc[c](this);
        Ha(this);
        E && (b.lineWrapping && "optimizelegibility" == getComputedStyle(d.lineDiv).textRendering) && (d.lineDiv.style.textRendering = "auto")
    }

    function kf(a, b, c) {
        this.input = c;
        this.scrollbarFiller = q("div", null, "CodeMirror-scrollbar-filler");
        this.scrollbarFiller.setAttribute("cm-not-content", "true");
        this.gutterFiller = q("div", null, "CodeMirror-gutter-filler");
        this.gutterFiller.setAttribute("cm-not-content", "true");
        this.lineDiv =
            q("div", null, "CodeMirror-code");
        this.selectionDiv = q("div", null, null, "position: relative; z-index: 1");
        this.cursorDiv = q("div", null, "CodeMirror-cursors");
        this.measure = q("div", null, "CodeMirror-measure");
        this.lineMeasure = q("div", null, "CodeMirror-measure");
        this.lineSpace = q("div", [this.measure, this.lineMeasure, this.selectionDiv, this.cursorDiv, this.lineDiv], null, "position: relative; outline: none");
        this.mover = q("div", [q("div", [this.lineSpace], "CodeMirror-lines")], null, "position: relative");
        this.sizer = q("div",
            [this.mover], "CodeMirror-sizer");
        this.sizerWidth = null;
        this.heightForcer = q("div", null, null, "position: absolute; height: " + zd + "px; width: 1px;");
        this.gutters = q("div", null, "CodeMirror-gutters");
        this.lineGutter = null;
        this.scroller = q("div", [this.sizer, this.heightForcer, this.gutters], "CodeMirror-scroll");
        this.scroller.setAttribute("tabIndex", "-1");
        this.wrapper = q("div", [this.scrollbarFiller, this.gutterFiller, this.scroller], "CodeMirror");
        y && 8 > z && (this.gutters.style.zIndex = -1, this.scroller.style.paddingRight =
            0);
        if (!E && (!sa || !Xa))this.scroller.draggable = !0;
        a && (a.appendChild ? a.appendChild(this.wrapper) : a(this.wrapper));
        this.reportedViewFrom = this.reportedViewTo = this.viewFrom = this.viewTo = b.first;
        this.view = [];
        this.externalMeasured = this.renderedView = null;
        this.lastWrapHeight = this.lastWrapWidth = this.viewOffset = 0;
        this.updateLineNumbers = null;
        this.nativeBarWidth = this.barHeight = this.barWidth = 0;
        this.scrollbarsClipped = !1;
        this.lineNumWidth = this.lineNumInnerWidth = this.lineNumChars = null;
        this.alignWidgets = !1;
        this.maxLine =
            this.cachedCharWidth = this.cachedTextHeight = this.cachedPaddingH = null;
        this.maxLineLength = 0;
        this.maxLineChanged = !1;
        this.wheelDX = this.wheelDY = this.wheelStartX = this.wheelStartY = null;
        this.shift = !1;
        this.activeTouch = this.selForContextMenu = null;
        c.init(this)
    }

    function uc(a) {
        a.doc.mode = m.getMode(a.options, a.doc.modeOption);
        ab(a)
    }

    function ab(a) {
        a.doc.iter(function (a) {
            a.stateAfter && (a.stateAfter = null);
            a.styles && (a.styles = null)
        });
        a.doc.frontier = a.doc.first;
        bb(a, 100);
        a.state.modeGen++;
        a.curOp && N(a)
    }

    function Ad(a) {
        var b =
            ta(a.display), c = a.options.lineWrapping, d = c && Math.max(5, a.display.scroller.clientWidth / cb(a.display) - 3);
        return function (e) {
            if (ua(a.doc, e))return 0;
            var f = 0;
            if (e.widgets)for (var g = 0; g < e.widgets.length; g++)e.widgets[g].height && (f += e.widgets[g].height);
            return c ? f + (Math.ceil(e.text.length / d) || 1) * b : f + b
        }
    }

    function vc(a) {
        var b = a.doc, c = Ad(a);
        b.iter(function (a) {
            var b = c(a);
            b != a.height && Z(a, b)
        })
    }

    function td(a) {
        a.display.wrapper.className = a.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + a.options.theme.replace(/(^|\s)\s*/g,
                " cm-s-");
        db(a)
    }

    function eb(a) {
        sd(a);
        N(a);
        setTimeout(function () {
            wc(a)
        }, 20)
    }

    function sd(a) {
        var b = a.display.gutters, c = a.options.gutters;
        va(b);
        for (var d = 0; d < c.length; ++d) {
            var e = c[d], f = b.appendChild(q("div", null, "CodeMirror-gutter " + e));
            "CodeMirror-linenumbers" == e && (a.display.lineGutter = f, f.style.width = (a.display.lineNumWidth || 1) + "px")
        }
        b.style.display = d ? "" : "none";
        xc(a)
    }

    function xc(a) {
        a.display.sizer.style.marginLeft = a.display.gutters.offsetWidth + "px"
    }

    function Gb(a) {
        if (0 == a.height)return 0;
        for (var b = a.text.length,
                 c, d = a; c = wa(d, !0);)c = c.find(0, !0), d = c.from.line, b += c.from.ch - c.to.ch;
        for (d = a; c = wa(d, !1);)c = c.find(0, !0), b -= d.text.length - c.from.ch, d = c.to.line, b += d.text.length - c.to.ch;
        return b
    }

    function yc(a) {
        var b = a.display, a = a.doc;
        b.maxLine = r(a, a.first);
        b.maxLineLength = Gb(b.maxLine);
        b.maxLineChanged = !0;
        a.iter(function (a) {
            var d = Gb(a);
            d > b.maxLineLength && (b.maxLineLength = d, b.maxLine = a)
        })
    }

    function rc(a) {
        var b = G(a.gutters, "CodeMirror-linenumbers");
        -1 == b && a.lineNumbers ? a.gutters = a.gutters.concat(["CodeMirror-linenumbers"]) :
        -1 < b && !a.lineNumbers && (a.gutters = a.gutters.slice(0), a.gutters.splice(b, 1))
    }

    function fb(a) {
        var b = a.display, c = b.gutters.offsetWidth, d = Math.round(a.doc.height + (a.display.mover.offsetHeight - a.display.lineSpace.offsetHeight));
        return {
            clientHeight: b.scroller.clientHeight,
            viewHeight: b.wrapper.clientHeight,
            scrollWidth: b.scroller.scrollWidth,
            clientWidth: b.scroller.clientWidth,
            viewWidth: b.wrapper.clientWidth,
            barLeft: a.options.fixedGutter ? c : 0,
            docHeight: d,
            scrollHeight: d + $(a) + b.barHeight,
            nativeBarWidth: b.nativeBarWidth,
            gutterWidth: c
        }
    }

    function zc(a, b, c) {
        this.cm = c;
        var d = this.vert = q("div", [q("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"), e = this.horiz = q("div", [q("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        a(d);
        a(e);
        p(d, "scroll", function () {
            d.clientHeight && b(d.scrollTop, "vertical")
        });
        p(e, "scroll", function () {
            e.clientWidth && b(e.scrollLeft, "horizontal")
        });
        this.checkedOverlay = !1;
        y && 8 > z && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px")
    }

    function Ac() {
    }

    function ud(a) {
        a.display.scrollbars &&
        (a.display.scrollbars.clear(), a.display.scrollbars.addClass && gb(a.display.wrapper, a.display.scrollbars.addClass));
        a.display.scrollbars = new m.scrollbarModel[a.options.scrollbarStyle](function (b) {
            a.display.wrapper.insertBefore(b, a.display.scrollbarFiller);
            p(b, "mousedown", function () {
                a.state.focused && setTimeout(function () {
                    a.display.input.focus()
                }, 0)
            });
            b.setAttribute("cm-not-content", "true")
        }, function (b, c) {
            c == "horizontal" ? Ia(a, b) : hb(a, b)
        }, a);
        a.display.scrollbars.addClass && ib(a.display.wrapper, a.display.scrollbars.addClass)
    }

    function Ja(a, b) {
        b || (b = fb(a));
        var c = a.display.barWidth, d = a.display.barHeight;
        Bd(a, b);
        for (var e = 0; 4 > e && c != a.display.barWidth || d != a.display.barHeight; e++)c != a.display.barWidth && a.options.lineWrapping && Hb(a), Bd(a, fb(a)), c = a.display.barWidth, d = a.display.barHeight
    }

    function Bd(a, b) {
        var c = a.display, d = c.scrollbars.update(b);
        c.sizer.style.paddingRight = (c.barWidth = d.right) + "px";
        c.sizer.style.paddingBottom = (c.barHeight = d.bottom) + "px";
        d.right && d.bottom ? (c.scrollbarFiller.style.display = "block", c.scrollbarFiller.style.height =
            d.bottom + "px", c.scrollbarFiller.style.width = d.right + "px") : c.scrollbarFiller.style.display = "";
        d.bottom && a.options.coverGutterNextToScrollbar && a.options.fixedGutter ? (c.gutterFiller.style.display = "block", c.gutterFiller.style.height = d.bottom + "px", c.gutterFiller.style.width = b.gutterWidth + "px") : c.gutterFiller.style.display = ""
    }

    function Bc(a, b, c) {
        var d = c && null != c.top ? Math.max(0, c.top) : a.scroller.scrollTop, d = Math.floor(d - a.lineSpace.offsetTop), e = c && null != c.bottom ? c.bottom : d + a.wrapper.clientHeight, d = xa(b, d),
            e = xa(b, e);
        if (c && c.ensure) {
            var f = c.ensure.from.line, c = c.ensure.to.line;
            f < d ? (d = f, e = xa(b, ga(r(b, f)) + a.wrapper.clientHeight)) : Math.min(c, b.lastLine()) >= e && (d = xa(b, ga(r(b, c)) - a.wrapper.clientHeight), e = c)
        }
        return {from: d, to: Math.max(e, d + 1)}
    }

    function wc(a) {
        var b = a.display, c = b.view;
        if (b.alignWidgets || b.gutters.firstChild && a.options.fixedGutter) {
            for (var d = Cc(b) - b.scroller.scrollLeft + a.doc.scrollLeft, e = b.gutters.offsetWidth, f = d + "px", g = 0; g < c.length; g++)if (!c[g].hidden) {
                a.options.fixedGutter && c[g].gutter && (c[g].gutter.style.left =
                    f);
                var h = c[g].alignable;
                if (h)for (var i = 0; i < h.length; i++)h[i].style.left = f
            }
            a.options.fixedGutter && (b.gutters.style.left = d + e + "px")
        }
    }

    function yd(a) {
        if (!a.options.lineNumbers)return !1;
        var b = a.doc, b = "" + a.options.lineNumberFormatter(b.first + b.size - 1 + a.options.firstLineNumber), c = a.display;
        if (b.length != c.lineNumChars) {
            var d = c.measure.appendChild(q("div", [q("div", b)], "CodeMirror-linenumber CodeMirror-gutter-elt")), e = d.firstChild.offsetWidth, d = d.offsetWidth - e;
            c.lineGutter.style.width = "";
            c.lineNumInnerWidth =
                Math.max(e, c.lineGutter.offsetWidth - d) + 1;
            c.lineNumWidth = c.lineNumInnerWidth + d;
            c.lineNumChars = c.lineNumInnerWidth ? b.length : -1;
            c.lineGutter.style.width = c.lineNumWidth + "px";
            xc(a);
            return !0
        }
        return !1
    }

    function Cc(a) {
        return a.scroller.getBoundingClientRect().left - a.sizer.getBoundingClientRect().left
    }

    function Ib(a, b, c) {
        var d = a.display;
        this.viewport = b;
        this.visible = Bc(d, a.doc, b);
        this.editorIsHidden = !d.wrapper.offsetWidth;
        this.wrapperHeight = d.wrapper.clientHeight;
        this.wrapperWidth = d.wrapper.clientWidth;
        this.oldDisplayWidth =
            la(a);
        this.force = c;
        this.dims = Dc(a);
        this.events = []
    }

    function Ec(a, b) {
        var c = a.display, d = a.doc;
        if (b.editorIsHidden)return ma(a), !1;
        if (!b.force && b.visible.from >= c.viewFrom && b.visible.to <= c.viewTo && (null == c.updateLineNumbers || c.updateLineNumbers >= c.viewTo) && c.renderedView == c.view && 0 == Cd(a))return !1;
        yd(a) && (ma(a), b.dims = Dc(a));
        var e = d.first + d.size, f = Math.max(b.visible.from - a.options.viewportMargin, d.first), g = Math.min(e, b.visible.to + a.options.viewportMargin);
        c.viewFrom < f && 20 > f - c.viewFrom && (f = Math.max(d.first,
            c.viewFrom));
        c.viewTo > g && 20 > c.viewTo - g && (g = Math.min(e, c.viewTo));
        na && (f = Fc(a.doc, f), g = Dd(a.doc, g));
        d = f != c.viewFrom || g != c.viewTo || c.lastWrapHeight != b.wrapperHeight || c.lastWrapWidth != b.wrapperWidth;
        e = a.display;
        0 == e.view.length || f >= e.viewTo || g <= e.viewFrom ? (e.view = Jb(a, f, g), e.viewFrom = f) : (e.viewFrom > f ? e.view = Jb(a, f, e.viewFrom).concat(e.view) : e.viewFrom < f && (e.view = e.view.slice(ya(a, f))), e.viewFrom = f, e.viewTo < g) ? e.view = e.view.concat(Jb(a, e.viewTo, g)) : e.viewTo > g && (e.view = e.view.slice(0, ya(a, g)));
        e.viewTo =
            g;
        c.viewOffset = ga(r(a.doc, c.viewFrom));
        a.display.mover.style.top = c.viewOffset + "px";
        g = Cd(a);
        if (!d && 0 == g && !b.force && c.renderedView == c.view && (null == c.updateLineNumbers || c.updateLineNumbers >= c.viewTo))return !1;
        f = aa();
        4 < g && (c.lineDiv.style.display = "none");
        nf(a, c.updateLineNumbers, b.dims);
        4 < g && (c.lineDiv.style.display = "");
        c.renderedView = c.view;
        f && (aa() != f && f.offsetHeight) && f.focus();
        va(c.cursorDiv);
        va(c.selectionDiv);
        c.gutters.style.height = 0;
        d && (c.lastWrapHeight = b.wrapperHeight, c.lastWrapWidth = b.wrapperWidth,
            bb(a, 400));
        c.updateLineNumbers = null;
        return !0
    }

    function Ed(a, b) {
        for (var c = b.viewport, d = !0; ; d = !1) {
            if (!d || !(a.options.lineWrapping && b.oldDisplayWidth != la(a)))if (c && null != c.top && (c = {top: Math.min(a.doc.height + (a.display.mover.offsetHeight - a.display.lineSpace.offsetHeight) - Gc(a), c.top)}), b.visible = Bc(a.display, a.doc, c), b.visible.from >= a.display.viewFrom && b.visible.to <= a.display.viewTo)break;
            if (!Ec(a, b))break;
            Hb(a);
            d = fb(a);
            jb(a);
            Hc(a, d);
            Ja(a, d)
        }
        b.signal(a, "update", a);
        if (a.display.viewFrom != a.display.reportedViewFrom ||
            a.display.viewTo != a.display.reportedViewTo)b.signal(a, "viewportChange", a, a.display.viewFrom, a.display.viewTo), a.display.reportedViewFrom = a.display.viewFrom, a.display.reportedViewTo = a.display.viewTo
    }

    function Ic(a, b) {
        var c = new Ib(a, b);
        if (Ec(a, c)) {
            Hb(a);
            Ed(a, c);
            var d = fb(a);
            jb(a);
            Hc(a, d);
            Ja(a, d);
            c.finish()
        }
    }

    function Hc(a, b) {
        a.display.sizer.style.minHeight = b.docHeight + "px";
        var c = b.docHeight + a.display.barHeight;
        a.display.heightForcer.style.top = c + "px";
        a.display.gutters.style.height = Math.max(c + $(a), b.clientHeight) +
            "px"
    }

    function Hb(a) {
        for (var a = a.display, b = a.lineDiv.offsetTop, c = 0; c < a.view.length; c++) {
            var d = a.view[c], e;
            if (!d.hidden) {
                if (y && 8 > z) {
                    var f = d.node.offsetTop + d.node.offsetHeight;
                    e = f - b;
                    b = f
                } else e = d.node.getBoundingClientRect(), e = e.bottom - e.top;
                f = d.line.height - e;
                2 > e && (e = ta(a));
                if (0.001 < f || -0.001 > f)if (Z(d.line, e), Fd(d.line), d.rest)for (e = 0; e < d.rest.length; e++)Fd(d.rest[e])
            }
        }
    }

    function Fd(a) {
        if (a.widgets)for (var b = 0; b < a.widgets.length; ++b)a.widgets[b].height = a.widgets[b].node.offsetHeight
    }

    function Dc(a) {
        for (var b =
            a.display, c = {}, d = {}, e = b.gutters.clientLeft, f = b.gutters.firstChild, g = 0; f; f = f.nextSibling, ++g)c[a.options.gutters[g]] = f.offsetLeft + f.clientLeft + e, d[a.options.gutters[g]] = f.clientWidth;
        return {
            fixedPos: Cc(b),
            gutterTotalWidth: b.gutters.offsetWidth,
            gutterLeft: c,
            gutterWidth: d,
            wrapperWidth: b.wrapper.clientWidth
        }
    }

    function nf(a, b, c) {
        function d(b) {
            var c = b.nextSibling;
            E && T && a.display.currentWheelTarget == b ? b.style.display = "none" : b.parentNode.removeChild(b);
            return c
        }

        for (var e = a.display, f = a.options.lineNumbers,
                 g = e.lineDiv, h = g.firstChild, i = e.view, e = e.viewFrom, j = 0; j < i.length; j++) {
            var k = i[j];
            if (!k.hidden)if (!k.node || k.node.parentNode != g) {
                var n = of(a, k, e, c);
                g.insertBefore(n, h)
            } else {
                for (; h != k.node;)h = d(h);
                h = f && null != b && b <= e && k.lineNumber;
                k.changes && (-1 < G(k.changes, "gutter") && (h = !1), Gd(a, k, e, c));
                h && (va(k.lineNumber), k.lineNumber.appendChild(document.createTextNode("" + a.options.lineNumberFormatter(e + a.options.firstLineNumber))));
                h = k.node.nextSibling
            }
            e += k.size
        }
        for (; h;)h = d(h)
    }

    function Gd(a, b, c, d) {
        for (var e = 0; e < b.changes.length; e++) {
            var f =
                b.changes[e];
            if ("text" == f) {
                var f = b, g = f.text.className, h = Hd(a, f);
                f.text == f.node && (f.node = h.pre);
                f.text.parentNode.replaceChild(h.pre, f.text);
                f.text = h.pre;
                h.bgClass != f.bgClass || h.textClass != f.textClass ? (f.bgClass = h.bgClass, f.textClass = h.textClass, Jc(f)) : g && (f.text.className = g)
            } else if ("gutter" == f)Id(a, b, c, d); else if ("class" == f)Jc(b); else if ("widget" == f) {
                f = a;
                g = b;
                h = d;
                g.alignable && (g.alignable = null);
                for (var i = g.node.firstChild, j = void 0; i; i = j)j = i.nextSibling, "CodeMirror-linewidget" == i.className && g.node.removeChild(i);
                Jd(f, g, h)
            }
        }
        b.changes = null
    }

    function Kb(a) {
        a.node == a.text && (a.node = q("div", null, null, "position: relative"), a.text.parentNode && a.text.parentNode.replaceChild(a.node, a.text), a.node.appendChild(a.text), y && 8 > z && (a.node.style.zIndex = 2));
        return a.node
    }

    function Hd(a, b) {
        var c = a.display.externalMeasured;
        return c && c.line == b.line ? (a.display.externalMeasured = null, b.measure = c.measure, c.built) : Kd(a, b)
    }

    function Jc(a) {
        var b = a.bgClass ? a.bgClass + " " + (a.line.bgClass || "") : a.line.bgClass;
        b && (b += " CodeMirror-linebackground");
        if (a.background)b ? a.background.className = b : (a.background.parentNode.removeChild(a.background), a.background = null); else if (b) {
            var c = Kb(a);
            a.background = c.insertBefore(q("div", null, b), c.firstChild)
        }
        a.line.wrapClass ? Kb(a).className = a.line.wrapClass : a.node != a.text && (a.node.className = "");
        a.text.className = (a.textClass ? a.textClass + " " + (a.line.textClass || "") : a.line.textClass) || ""
    }

    function Id(a, b, c, d) {
        b.gutter && (b.node.removeChild(b.gutter), b.gutter = null);
        var e = b.line.gutterMarkers;
        if (a.options.lineNumbers ||
            e) {
            var f = Kb(b), g = b.gutter = q("div", null, "CodeMirror-gutter-wrapper", "left: " + (a.options.fixedGutter ? d.fixedPos : -d.gutterTotalWidth) + "px; width: " + d.gutterTotalWidth + "px");
            a.display.input.setUneditable(g);
            f.insertBefore(g, b.text);
            b.line.gutterClass && (g.className += " " + b.line.gutterClass);
            if (a.options.lineNumbers && (!e || !e["CodeMirror-linenumbers"]))b.lineNumber = g.appendChild(q("div", "" + a.options.lineNumberFormatter(c + a.options.firstLineNumber), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + d.gutterLeft["CodeMirror-linenumbers"] +
                "px; width: " + a.display.lineNumInnerWidth + "px"));
            if (e)for (b = 0; b < a.options.gutters.length; ++b)c = a.options.gutters[b], (f = e.hasOwnProperty(c) && e[c]) && g.appendChild(q("div", [f], "CodeMirror-gutter-elt", "left: " + d.gutterLeft[c] + "px; width: " + d.gutterWidth[c] + "px"))
        }
    }

    function of(a, b, c, d) {
        var e = Hd(a, b);
        b.text = b.node = e.pre;
        e.bgClass && (b.bgClass = e.bgClass);
        e.textClass && (b.textClass = e.textClass);
        Jc(b);
        Id(a, b, c, d);
        Jd(a, b, d);
        return b.node
    }

    function Jd(a, b, c) {
        Ld(a, b.line, b, c, !0);
        if (b.rest)for (var d = 0; d < b.rest.length; d++)Ld(a,
            b.rest[d], b, c, !1)
    }

    function Ld(a, b, c, d, e) {
        if (b.widgets)for (var f = Kb(c), g = 0, b = b.widgets; g < b.length; ++g) {
            var h = b[g], i = q("div", [h.node], "CodeMirror-linewidget");
            h.handleMouseEvents || i.setAttribute("cm-ignore-events", "true");
            var j = h, k = i, n = d;
            if (j.noHScroll) {
                (c.alignable || (c.alignable = [])).push(k);
                var l = n.wrapperWidth;
                k.style.left = n.fixedPos + "px";
                j.coverGutter || (l -= n.gutterTotalWidth, k.style.paddingLeft = n.gutterTotalWidth + "px");
                k.style.width = l + "px"
            }
            j.coverGutter && (k.style.zIndex = 5, k.style.position = "relative",
            j.noHScroll || (k.style.marginLeft = -n.gutterTotalWidth + "px"));
            a.display.input.setUneditable(i);
            e && h.above ? f.insertBefore(i, c.gutter || c.text) : f.appendChild(i);
            H(h, "redraw")
        }
    }

    function Lb(a, b) {
        return 0 > v(a, b) ? b : a
    }

    function Mb(a, b) {
        return 0 > v(a, b) ? a : b
    }

    function Md(a) {
        a.state.focused || (a.display.input.focus(), sc(a))
    }

    function Nb(a) {
        return a.options.readOnly || a.doc.cantEdit
    }

    function Kc(a, b, c, d, e) {
        var f = a.doc;
        a.display.shift = !1;
        d || (d = f.sel);
        var g = oa(b), h = null;
        a.state.pasteIncoming && 1 < d.ranges.length && (U && U.join("\n") ==
        b ? h = 0 == d.ranges.length % U.length && kb(U, oa) : g.length == d.ranges.length && (h = kb(g, function (a) {
            return [a]
        })));
        for (var i = d.ranges.length - 1; 0 <= i; i--) {
            var j = d.ranges[i], k = j.from(), n = j.to();
            j.empty() && (c && 0 < c ? k = o(k.line, k.ch - c) : a.state.overwrite && !a.state.pasteIncoming && (n = o(n.line, Math.min(r(f, n.line).text.length, n.ch + x(g).length))));
            var l = a.curOp.updateInput, k = {
                from: k,
                to: n,
                text: h ? h[i % h.length] : g,
                origin: e || (a.state.pasteIncoming ? "paste" : a.state.cutIncoming ? "cut" : "+input")
            };
            Ka(a.doc, k);
            H(a, "inputRead", a, k);
            if (b && !a.state.pasteIncoming && a.options.electricChars && a.options.smartIndent && 100 > j.head.ch && (!i || d.ranges[i - 1].head.line != j.head.line)) {
                j = a.getModeAt(j.head);
                k = pa(k);
                n = !1;
                if (j.electricChars)for (var s = 0; s < j.electricChars.length; s++) {
                    if (-1 < b.indexOf(j.electricChars.charAt(s))) {
                        n = lb(a, k.line, "smart");
                        break
                    }
                } else j.electricInput && j.electricInput.test(r(f, k.line).text.slice(0, k.ch)) && (n = lb(a, k.line, "smart"));
                n && H(a, "electricInput", a, k.line)
            }
        }
        La(a);
        a.curOp.updateInput = l;
        a.curOp.typing = !0;
        a.state.pasteIncoming =
            a.state.cutIncoming = !1
    }

    function Nd(a) {
        for (var b = [], c = [], d = 0; d < a.doc.sel.ranges.length; d++) {
            var e = a.doc.sel.ranges[d].head.line, e = {anchor: o(e, 0), head: o(e + 1, 0)};
            c.push(e);
            b.push(a.getRange(e.anchor, e.head))
        }
        return {text: b, ranges: c}
    }

    function Od(a) {
        a.setAttribute("autocorrect", "off");
        a.setAttribute("autocapitalize", "off");
        a.setAttribute("spellcheck", "false")
    }

    function Lc(a) {
        this.cm = a;
        this.prevInput = "";
        this.pollingFast = !1;
        this.polling = new Ya;
        this.hasSelection = this.inaccurateSelection = !1;
        this.composing = null
    }

    function Pd() {
        var a = q("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none"), b = q("div", [a], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        E ? a.style.width = "1000px" : a.setAttribute("wrap", "off");
        Ma && (a.style.border = "1px solid black");
        Od(a);
        return b
    }

    function Mc(a) {
        this.cm = a;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new Ya;
        this.gracePeriod = !1
    }

    function Qd(a, b) {
        var c = Nc(a, b.line);
        if (!c ||
            c.hidden)return null;
        var d = r(a.doc, b.line), c = Rd(c, d, b.line);
        (d = V(d)) && Ob(d, b.ch);
        d = Sd(c.map, b.ch, "left");
        d.offset = "right" == d.collapse ? d.end : d.start;
        return d
    }

    function Na(a, b) {
        b && (a.bad = !0);
        return a
    }

    function Pb(a, b, c) {
        var d;
        if (b == a.display.lineDiv) {
            d = a.display.lineDiv.childNodes[c];
            if (!d)return Na(a.clipPos(o(a.display.viewTo - 1)), !0);
            b = null;
            c = 0
        } else for (d = b; ; d = d.parentNode) {
            if (!d || d == a.display.lineDiv)return null;
            if (d.parentNode && d.parentNode == a.display.lineDiv)break
        }
        for (var e = 0; e < a.display.view.length; e++) {
            var f =
                a.display.view[e];
            if (f.node == d)return pf(f, b, c)
        }
    }

    function pf(a, b, c) {
        function d(b, c, d) {
            for (var e = -1; e < (j ? j.length : 0); e++)for (var f = 0 > e ? i.map : j[e], g = 0; g < f.length; g += 3) {
                var h = f[g + 2];
                if (h == b || h == c) {
                    c = C(0 > e ? a.line : a.rest[e]);
                    e = f[g] + d;
                    if (0 > d || h != b)e = f[g + (d ? 1 : 0)];
                    return o(c, e)
                }
            }
        }

        var e = a.text.firstChild, f = !1;
        if (!b || !Oc(e, b))return Na(o(C(a.line), 0), !0);
        if (b == e && (f = !0, b = e.childNodes[c], c = 0, !b))return c = a.rest ? x(a.rest) : a.line, Na(o(C(c), c.text.length), f);
        var g = 3 == b.nodeType ? b : null, h = b;
        !g && (1 == b.childNodes.length &&
        3 == b.firstChild.nodeType) && (g = b.firstChild, c && (c = g.nodeValue.length));
        for (; h.parentNode != e;)h = h.parentNode;
        var i = a.measure, j = i.maps;
        if (b = d(g, h, c))return Na(b, f);
        e = h.nextSibling;
        for (g = g ? g.nodeValue.length - c : 0; e; e = e.nextSibling) {
            if (b = d(e, e.firstChild, 0))return Na(o(b.line, b.ch - g), f);
            g += e.textContent.length
        }
        h = h.previousSibling;
        for (g = c; h; h = h.previousSibling) {
            if (b = d(h, h.firstChild, -1))return Na(o(b.line, b.ch + g), f);
            g += e.textContent.length
        }
    }

    function qf(a, b, c, d, e) {
        function f(a) {
            return function (b) {
                return b.id ==
                    a
            }
        }

        function g(b) {
            if (1 == b.nodeType) {
                var c = b.getAttribute("cm-text");
                if (null != c)"" == c && (c = b.textContent.replace(/\u200b/g, "")), h += c; else {
                    var c = b.getAttribute("cm-marker"), n;
                    if (c) {
                        if (b = a.findMarks(o(d, 0), o(e + 1, 0), f(+c)), b.length && (n = b[0].find()))h += za(a.doc, n.from, n.to).join("\n")
                    } else if ("false" != b.getAttribute("contenteditable")) {
                        for (n = 0; n < b.childNodes.length; n++)g(b.childNodes[n]);
                        /^(pre|div|p)$/i.test(b.nodeName) && (i = !0)
                    }
                }
            } else if (3 == b.nodeType && (b = b.nodeValue))i && (h += "\n", i = !1), h += b
        }

        for (var h = "",
                 i = !1; ;) {
            g(b);
            if (b == c)break;
            b = b.nextSibling
        }
        return h
    }

    function ha(a, b) {
        this.ranges = a;
        this.primIndex = b
    }

    function w(a, b) {
        this.anchor = a;
        this.head = b
    }

    function W(a, b) {
        var c = a[b];
        a.sort(function (a, b) {
            return v(a.from(), b.from())
        });
        b = G(a, c);
        for (c = 1; c < a.length; c++) {
            var d = a[c], e = a[c - 1];
            if (0 <= v(e.to(), d.from())) {
                var f = Mb(e.from(), d.from()), g = Lb(e.to(), d.to()), d = e.empty() ? d.from() == d.head : e.from() == e.head;
                c <= b && --b;
                a.splice(--c, 2, new w(d ? g : f, d ? f : g))
            }
        }
        return new ha(a, b)
    }

    function ba(a, b) {
        return new ha([new w(a, b ||
            a)], 0)
    }

    function t(a, b) {
        if (b.line < a.first)return o(a.first, 0);
        var c = a.first + a.size - 1;
        if (b.line > c)return o(c, r(a, c).text.length);
        var c = r(a, b.line).text.length, d = b.ch, c = null == d || d > c ? o(b.line, c) : 0 > d ? o(b.line, 0) : b;
        return c
    }

    function mb(a, b) {
        return b >= a.first && b < a.first + a.size
    }

    function nb(a, b, c, d) {
        return a.cm && a.cm.display.shift || a.extend ? (a = b.anchor, d && (b = 0 > v(c, a), b != 0 > v(d, a) ? (a = c, c = d) : b != 0 > v(c, d) && (c = d)), new w(a, c)) : new w(d || c, c)
    }

    function Qb(a, b, c, d) {
        A(a, new ha([nb(a, a.sel.primary(), b, c)], 0), d)
    }

    function Td(a,
                b, c) {
        for (var d = [], e = 0; e < a.sel.ranges.length; e++)d[e] = nb(a, a.sel.ranges[e], b[e], null);
        b = W(d, a.sel.primIndex);
        A(a, b, c)
    }

    function Pc(a, b, c, d) {
        var e = a.sel.ranges.slice(0);
        e[b] = c;
        A(a, W(e, a.sel.primIndex), d)
    }

    function rf(a, b) {
        var c = {
            ranges: b.ranges, update: function (b) {
                this.ranges = [];
                for (var c = 0; c < b.length; c++)this.ranges[c] = new w(t(a, b[c].anchor), t(a, b[c].head))
            }
        };
        F(a, "beforeSelectionChange", a, c);
        a.cm && F(a.cm, "beforeSelectionChange", a.cm, c);
        return c.ranges != b.ranges ? W(c.ranges, c.ranges.length - 1) : b
    }

    function Ud(a,
                b, c) {
        var d = a.history.done, e = x(d);
        e && e.ranges ? (d[d.length - 1] = b, Rb(a, b, c)) : A(a, b, c)
    }

    function A(a, b, c) {
        Rb(a, b, c);
        var b = a.sel, d = a.cm ? a.cm.curOp.id : NaN, e = a.history, f = c && c.origin, g;
        if (!(g = d == e.lastSelOp))if (g = f)if (g = e.lastSelOrigin == f)if (!(g = e.lastModTime == e.lastSelTime && e.lastOrigin == f)) {
            g = x(e.done);
            var h = f.charAt(0);
            g = "*" == h || "+" == h && g.ranges.length == b.ranges.length && g.somethingSelected() == b.somethingSelected() && new Date - a.history.lastSelTime <= (a.cm ? a.cm.options.historyEventDelay : 500)
        }
        g ? e.done[e.done.length -
        1] = b : Sb(b, e.done);
        e.lastSelTime = +new Date;
        e.lastSelOrigin = f;
        e.lastSelOp = d;
        c && !1 !== c.clearRedo && Vd(e.undone)
    }

    function Rb(a, b, c) {
        if (P(a, "beforeSelectionChange") || a.cm && P(a.cm, "beforeSelectionChange"))b = rf(a, b);
        var d = c && c.bias || (0 > v(b.primary().head, a.sel.primary().head) ? -1 : 1);
        Wd(a, Xd(a, b, d, !0));
        !(c && !1 === c.scroll) && a.cm && La(a.cm)
    }

    function Wd(a, b) {
        b.equals(a.sel) || (a.sel = b, a.cm && (a.cm.curOp.updateInput = a.cm.curOp.selectionChanged = !0, Yd(a.cm)), H(a, "cursorActivity", a))
    }

    function Zd(a) {
        Wd(a, Xd(a, a.sel, null,
            !1), ca)
    }

    function Xd(a, b, c, d) {
        for (var e, f = 0; f < b.ranges.length; f++) {
            var g = b.ranges[f], h = Tb(a, g.anchor, c, d), i = Tb(a, g.head, c, d);
            if (e || h != g.anchor || i != g.head)e || (e = b.ranges.slice(0, f)), e[f] = new w(h, i)
        }
        return e ? W(e, b.primIndex) : b
    }

    function Tb(a, b, c, d) {
        var e = !1, f = b, g = c || 1;
        a.cantEdit = !1;
        a:for (; ;) {
            var h = r(a, f.line);
            if (h.markedSpans)for (var i = 0; i < h.markedSpans.length; ++i) {
                var j = h.markedSpans[i], k = j.marker;
                if ((null == j.from || (k.inclusiveLeft ? j.from <= f.ch : j.from < f.ch)) && (null == j.to || (k.inclusiveRight ? j.to >= f.ch :
                    j.to > f.ch))) {
                    if (d && (F(k, "beforeCursorEnter"), k.explicitlyCleared))if (h.markedSpans) {
                        --i;
                        continue
                    } else break;
                    if (k.atomic) {
                        i = k.find(0 > g ? -1 : 1);
                        if (0 == v(i, f) && (i.ch += g, 0 > i.ch ? i = i.line > a.first ? t(a, o(i.line - 1)) : null : i.ch > h.text.length && (i = i.line < a.first + a.size - 1 ? o(i.line + 1, 0) : null), !i)) {
                            if (e) {
                                if (!d)return Tb(a, b, c, !0);
                                a.cantEdit = !0;
                                return o(a.first, 0)
                            }
                            e = !0;
                            i = b;
                            g = -g
                        }
                        f = i;
                        continue a
                    }
                }
            }
            return f
        }
    }

    function jb(a) {
        a.display.input.showSelection(a.display.input.prepareSelection())
    }

    function $d(a, b) {
        for (var c = a.doc,
                 d = {}, e = d.cursors = document.createDocumentFragment(), f = d.selection = document.createDocumentFragment(), g = 0; g < c.sel.ranges.length; g++)if (!(!1 === b && g == c.sel.primIndex)) {
            var h = c.sel.ranges[g], i = h.empty();
            if (i || a.options.showCursorWhenSelecting) {
                var j = a, k = e, n = ia(j, h.head, "div", null, null, !j.options.singleCursorHeightPerLine), l = k.appendChild(q("div", " ", "CodeMirror-cursor"));
                l.style.left = n.left + "px";
                l.style.top = n.top + "px";
                l.style.height = Math.max(0, n.bottom - n.top) * j.options.cursorHeight + "px";
                n.other && (j = k.appendChild(q("div",
                    " ", "CodeMirror-cursor CodeMirror-secondarycursor")), j.style.display = "", j.style.left = n.other.left + "px", j.style.top = n.other.top + "px", j.style.height = 0.85 * (n.other.bottom - n.other.top) + "px")
            }
            i || sf(a, h, f)
        }
        return d
    }

    function sf(a, b, c) {
        function d(a, b, c, d) {
            0 > b && (b = 0);
            b = Math.round(b);
            d = Math.round(d);
            h.appendChild(q("div", null, "CodeMirror-selected", "position: absolute; left: " + a + "px; top: " + b + "px; width: " + (null == c ? k - a : c) + "px; height: " + (d - b) + "px"))
        }

        function e(b, c, e) {
            var f = r(g, b), h = f.text.length, i, n;
            tf(V(f),
                c || 0, null == e ? h : e, function (g, m, q) {
                    var r = Ub(a, o(b, g), "div", f, "left"), p, t;
                    g == m ? (p = r, q = t = r.left) : (p = Ub(a, o(b, m - 1), "div", f, "right"), "rtl" == q && (q = r, r = p, p = q), q = r.left, t = p.right);
                    null == c && 0 == g && (q = j);
                    3 < p.top - r.top && (d(q, r.top, null, r.bottom), q = j, r.bottom < p.top && d(q, r.bottom, null, p.top));
                    null == e && m == h && (t = k);
                    if (!i || r.top < i.top || r.top == i.top && r.left < i.left)i = r;
                    if (!n || p.bottom > n.bottom || p.bottom == n.bottom && p.right > n.right)n = p;
                    q < j + 1 && (q = j);
                    d(q, p.top, t - q, p.bottom)
                });
            return {start: i, end: n}
        }

        var f = a.display, g = a.doc,
            h = document.createDocumentFragment(), i = ae(a.display), j = i.left, k = Math.max(f.sizerWidth, la(a) - f.sizer.offsetLeft) - i.right, f = b.from(), b = b.to();
        if (f.line == b.line)e(f.line, f.ch, b.ch); else {
            var n = r(g, f.line), i = r(g, b.line), i = da(n) == da(i), f = e(f.line, f.ch, i ? n.text.length + 1 : null).end, b = e(b.line, i ? 0 : null, b.ch).start;
            i && (f.top < b.top - 2 ? (d(f.right, f.top, null, f.bottom), d(j, b.top, b.left, b.bottom)) : d(f.right, f.top, b.left - f.right, f.bottom));
            f.bottom < b.top && d(j, f.bottom, null, b.top)
        }
        c.appendChild(h)
    }

    function Qc(a) {
        if (a.state.focused) {
            var b =
                a.display;
            clearInterval(b.blinker);
            var c = !0;
            b.cursorDiv.style.visibility = "";
            0 < a.options.cursorBlinkRate ? b.blinker = setInterval(function () {
                b.cursorDiv.style.visibility = (c = !c) ? "" : "hidden"
            }, a.options.cursorBlinkRate) : 0 > a.options.cursorBlinkRate && (b.cursorDiv.style.visibility = "hidden")
        }
    }

    function bb(a, b) {
        a.doc.mode.startState && a.doc.frontier < a.display.viewTo && a.state.highlight.set(b, Za(uf, a))
    }

    function uf(a) {
        var b = a.doc;
        b.frontier < b.first && (b.frontier = b.first);
        if (!(b.frontier >= a.display.viewTo)) {
            var c = +new Date +
                a.options.workTime, d = Oa(b.mode, ob(a, b.frontier)), e = [];
            b.iter(b.frontier, Math.min(b.first + b.size, a.display.viewTo + 500), function (f) {
                if (b.frontier >= a.display.viewFrom) {
                    var g = f.styles, h = be(a, f, d, true);
                    f.styles = h.styles;
                    var i = f.styleClasses;
                    if (h = h.classes)f.styleClasses = h; else if (i)f.styleClasses = null;
                    i = !g || g.length != f.styles.length || i != h && (!i || !h || i.bgClass != h.bgClass || i.textClass != h.textClass);
                    for (h = 0; !i && h < g.length; ++h)i = g[h] != f.styles[h];
                    i && e.push(b.frontier);
                    f.stateAfter = Oa(b.mode, d)
                } else {
                    Rc(a, f.text,
                        d);
                    f.stateAfter = b.frontier % 5 == 0 ? Oa(b.mode, d) : null
                }
                ++b.frontier;
                if (+new Date > c) {
                    bb(a, a.options.workDelay);
                    return true
                }
            });
            e.length && Q(a, function () {
                for (var b = 0; b < e.length; b++)ja(a, e[b], "text")
            })
        }
    }

    function vf(a, b, c) {
        for (var d, e, f = a.doc, g = c ? -1 : b - (a.doc.mode.innerMode ? 1E3 : 100); b > g; --b) {
            if (b <= f.first)return f.first;
            var h = r(f, b - 1);
            if (h.stateAfter && (!c || b <= f.frontier))return b;
            h = X(h.text, null, a.options.tabSize);
            if (null == e || d > h)e = b - 1, d = h
        }
        return e
    }

    function ob(a, b, c) {
        var d = a.doc, e = a.display;
        if (!d.mode.startState)return !0;
        var f = vf(a, b, c), g = f > d.first && r(d, f - 1).stateAfter, g = g ? Oa(d.mode, g) : wf(d.mode);
        d.iter(f, b, function (c) {
            Rc(a, c.text, g);
            c.stateAfter = f == b - 1 || 0 == f % 5 || f >= e.viewFrom && f < e.viewTo ? Oa(d.mode, g) : null;
            ++f
        });
        c && (d.frontier = f);
        return g
    }

    function ae(a) {
        if (a.cachedPaddingH)return a.cachedPaddingH;
        var b = R(a.measure, q("pre", "x")), b = window.getComputedStyle ? window.getComputedStyle(b) : b.currentStyle, b = {
            left: parseInt(b.paddingLeft),
            right: parseInt(b.paddingRight)
        };
        !isNaN(b.left) && !isNaN(b.right) && (a.cachedPaddingH = b);
        return b
    }

    function $(a) {
        return zd - a.display.nativeBarWidth
    }

    function la(a) {
        return a.display.scroller.clientWidth - $(a) - a.display.barWidth
    }

    function Gc(a) {
        return a.display.scroller.clientHeight - $(a) - a.display.barHeight
    }

    function Rd(a, b, c) {
        if (a.line == b)return {map: a.measure.map, cache: a.measure.cache};
        for (var d = 0; d < a.rest.length; d++)if (a.rest[d] == b)return {
            map: a.measure.maps[d],
            cache: a.measure.caches[d]
        };
        for (d = 0; d < a.rest.length; d++)if (C(a.rest[d]) > c)return {
            map: a.measure.maps[d],
            cache: a.measure.caches[d],
            before: !0
        }
    }

    function Nc(a, b) {
        if (b >= a.display.viewFrom && b < a.display.viewTo)return a.display.view[ya(a, b)];
        var c = a.display.externalMeasured;
        if (c && b >= c.lineN && b < c.lineN + c.size)return c
    }

    function Vb(a, b) {
        var c = C(b), d = Nc(a, c);
        d && !d.text ? d = null : d && d.changes && Gd(a, d, c, Dc(a));
        if (!d) {
            var e;
            e = da(b);
            d = C(e);
            e = a.display.externalMeasured = new ce(a.doc, e, d);
            e.lineN = d;
            d = e.built = Kd(a, e);
            e.text = d.pre;
            R(a.display.lineMeasure, d.pre);
            d = e
        }
        c = Rd(d, b, c);
        return {line: b, view: d, rect: null, map: c.map, cache: c.cache, before: c.before, hasHeights: !1}
    }

    function Sc(a, b, c, d, e) {
        b.before && (c = -1);
        var f = c + (d || "");
        if (b.cache.hasOwnProperty(f))a = b.cache[f]; else {
            b.rect || (b.rect = b.view.text.getBoundingClientRect());
            if (!b.hasHeights) {
                var g = b.view, h = b.rect, i = a.options.lineWrapping, j = i && la(a);
                if (!g.measure.heights || i && g.measure.width != j) {
                    var k = g.measure.heights = [];
                    if (i) {
                        g.measure.width = j;
                        g = g.text.firstChild.getClientRects();
                        for (i = 0; i < g.length - 1; i++) {
                            var j = g[i], n = g[i + 1];
                            2 < Math.abs(j.bottom - n.bottom) && k.push((j.bottom + n.top) / 2 - h.top)
                        }
                    }
                    k.push(h.bottom - h.top)
                }
                b.hasHeights = !0
            }
            var g = d, i = Sd(b.map, c, g), d = i.node, h = i.start, j = i.end, c = i.collapse, l;
            if (3 == d.nodeType) {
                for (k = 0; 4 > k; k++) {
                    for (; h && pb(b.line.text.charAt(i.coverStart + h));)--h;
                    for (; i.coverStart + j < i.coverEnd && pb(b.line.text.charAt(i.coverStart + j));)++j;
                    if (y && 9 > z && 0 == h && j == i.coverEnd - i.coverStart)l = d.parentNode.getBoundingClientRect(); else if (y && a.options.lineWrapping) {
                        var s = Aa(d, h, j).getClientRects();
                        l = s.length ? s["right" == g ? s.length - 1 : 0] : Tc
                    } else l = Aa(d, h, j).getBoundingClientRect() || Tc;
                    if (l.left || l.right || 0 == h)break;
                    j =
                        h;
                    h -= 1;
                    c = "right"
                }
                if (y && 11 > z) {
                    if (!(s = !window.screen))if (!(s = null == screen.logicalXDPI))if (!(s = screen.logicalXDPI == screen.deviceXDPI))null != Uc ? s = Uc : (k = R(a.display.measure, q("span", "x")), s = k.getBoundingClientRect(), k = Aa(k, 0, 1).getBoundingClientRect(), s = Uc = 1 < Math.abs(s.left - k.left)), s = !s;
                    s || (s = screen.logicalXDPI / screen.deviceXDPI, k = screen.logicalYDPI / screen.deviceYDPI, l = {
                        left: l.left * s,
                        right: l.right * s,
                        top: l.top * k,
                        bottom: l.bottom * k
                    })
                }
            } else 0 < h && (c = g = "right"), l = a.options.lineWrapping && 1 < (s = d.getClientRects()).length ?
                s["right" == g ? s.length - 1 : 0] : d.getBoundingClientRect();
            if (y && 9 > z && !h && (!l || !l.left && !l.right))l = (l = d.parentNode.getClientRects()[0]) ? {
                left: l.left,
                right: l.left + cb(a.display),
                top: l.top,
                bottom: l.bottom
            } : Tc;
            s = l.top - b.rect.top;
            d = l.bottom - b.rect.top;
            h = (s + d) / 2;
            g = b.view.measure.heights;
            for (k = 0; k < g.length - 1 && !(h < g[k]); k++);
            c = {
                left: ("right" == c ? l.right : l.left) - b.rect.left,
                right: ("left" == c ? l.left : l.right) - b.rect.left,
                top: k ? g[k - 1] : 0,
                bottom: g[k]
            };
            !l.left && !l.right && (c.bogus = !0);
            a.options.singleCursorHeightPerLine ||
            (c.rtop = s, c.rbottom = d);
            a = c;
            a.bogus || (b.cache[f] = a)
        }
        return {left: a.left, right: a.right, top: e ? a.rtop : a.top, bottom: e ? a.rbottom : a.bottom}
    }

    function Sd(a, b, c) {
        for (var d, e, f, g, h = 0; h < a.length; h += 3) {
            var i = a[h], j = a[h + 1];
            if (b < i)e = 0, f = 1, g = "left"; else if (b < j)e = b - i, f = e + 1; else if (h == a.length - 3 || b == j && a[h + 3] > b)f = j - i, e = f - 1, b >= j && (g = "right");
            if (null != e) {
                d = a[h + 2];
                if (i == j && c == (d.insertLeft ? "left" : "right"))g = c;
                if ("left" == c && 0 == e)for (; h && a[h - 2] == a[h - 3] && a[h - 1].insertLeft;)d = a[(h -= 3) + 2], g = "left";
                if ("right" == c && e == j - i)for (; h <
                                                      a.length - 3 && a[h + 3] == a[h + 4] && !a[h + 5].insertLeft;)d = a[(h += 3) + 2], g = "right";
                break
            }
        }
        return {node: d, start: e, end: f, collapse: g, coverStart: i, coverEnd: j}
    }

    function de(a) {
        if (a.measure && (a.measure.cache = {}, a.measure.heights = null, a.rest))for (var b = 0; b < a.rest.length; b++)a.measure.caches[b] = {}
    }

    function ee(a) {
        a.display.externalMeasure = null;
        va(a.display.lineMeasure);
        for (var b = 0; b < a.display.view.length; b++)de(a.display.view[b])
    }

    function db(a) {
        ee(a);
        a.display.cachedCharWidth = a.display.cachedTextHeight = a.display.cachedPaddingH =
            null;
        a.options.lineWrapping || (a.display.maxLineChanged = !0);
        a.display.lineNumChars = null
    }

    function Vc(a, b, c, d) {
        if (b.widgets)for (var e = 0; e < b.widgets.length; ++e)if (b.widgets[e].above) {
            var f = qb(b.widgets[e]);
            c.top += f;
            c.bottom += f
        }
        if ("line" == d)return c;
        d || (d = "local");
        b = ga(b);
        b = "local" == d ? b + a.display.lineSpace.offsetTop : b - a.display.viewOffset;
        if ("page" == d || "window" == d)a = a.display.lineSpace.getBoundingClientRect(), b += a.top + ("window" == d ? 0 : window.pageYOffset || (document.documentElement || document.body).scrollTop),
            d = a.left + ("window" == d ? 0 : window.pageXOffset || (document.documentElement || document.body).scrollLeft), c.left += d, c.right += d;
        c.top += b;
        c.bottom += b;
        return c
    }

    function fe(a, b, c) {
        if ("div" == c)return b;
        var d = b.left, b = b.top;
        if ("page" == c)d -= window.pageXOffset || (document.documentElement || document.body).scrollLeft, b -= window.pageYOffset || (document.documentElement || document.body).scrollTop; else if ("local" == c || !c)c = a.display.sizer.getBoundingClientRect(), d += c.left, b += c.top;
        a = a.display.lineSpace.getBoundingClientRect();
        return {left: d - a.left, top: b - a.top}
    }

    function Ub(a, b, c, d, e) {
        d || (d = r(a.doc, b.line));
        return Vc(a, d, Sc(a, Vb(a, d), b.ch, e), c)
    }

    function ia(a, b, c, d, e, f) {
        function g(b, g) {
            var h = Sc(a, e, b, g ? "right" : "left", f);
            g ? h.left = h.right : h.right = h.left;
            return Vc(a, d, h, c)
        }

        function h(a, b) {
            var c = i[b], d = c.level % 2;
            a == (c.level % 2 ? c.to : c.from) && b && c.level < i[b - 1].level ? (c = i[--b], a = Wc(c) - (c.level % 2 ? 0 : 1), d = !0) : a == Wc(c) && (b < i.length - 1 && c.level < i[b + 1].level) && (c = i[++b], a = (c.level % 2 ? c.to : c.from) - c.level % 2, d = !1);
            return d && a == c.to && a > c.from ?
                g(a - 1) : g(a, d)
        }

        d = d || r(a.doc, b.line);
        e || (e = Vb(a, d));
        var i = V(d), b = b.ch;
        if (!i)return g(b);
        var j = Ob(i, b), j = h(b, j);
        null != rb && (j.other = h(b, rb));
        return j
    }

    function ge(a, b) {
        var c = 0, b = t(a.doc, b);
        a.options.lineWrapping || (c = cb(a.display) * b.ch);
        var d = r(a.doc, b.line), e = ga(d) + a.display.lineSpace.offsetTop;
        return {left: c, right: c, top: e, bottom: e + d.height}
    }

    function Wb(a, b, c, d) {
        a = o(a, b);
        a.xRel = d;
        c && (a.outside = !0);
        return a
    }

    function Xc(a, b, c) {
        var d = a.doc, c = c + a.display.viewOffset;
        if (0 > c)return Wb(d.first, 0, !0, -1);
        var e = xa(d,
            c), f = d.first + d.size - 1;
        if (e > f)return Wb(d.first + d.size - 1, r(d, f).text.length, !0, 1);
        0 > b && (b = 0);
        for (d = r(d, e); ;)if (e = xf(a, d, e, b, c), f = (d = wa(d, !1)) && d.find(0, !0), d && (e.ch > f.from.ch || e.ch == f.from.ch && 0 < e.xRel))e = C(d = f.to.line); else return e
    }

    function xf(a, b, c, d, e) {
        function f(d) {
            d = ia(a, o(c, d), "line", b, j);
            h = !0;
            if (g > d.bottom)return d.left - i;
            if (g < d.top)return d.left + i;
            h = !1;
            return d.left
        }

        var g = e - ga(b), h = !1, i = 2 * a.display.wrapper.clientWidth, j = Vb(a, b), k = V(b), n = b.text.length, e = Xb(b), l = Yb(b), s = f(e), I = h, m = f(l), q = h;
        if (d > m)return Wb(c, l, q, 1);
        for (; ;) {
            if (k ? l == e || l == Yc(b, e, 1) : 1 >= l - e) {
                k = d < s || d - s <= m - d ? e : l;
                for (d -= k == e ? s : m; pb(b.text.charAt(k));)++k;
                return Wb(c, k, k == e ? I : q, -1 > d ? -1 : 1 < d ? 1 : 0)
            }
            var r = Math.ceil(n / 2), p = e + r;
            if (k)for (var p = e, t = 0; t < r; ++t)p = Yc(b, p, 1);
            t = f(p);
            if (t > d) {
                l = p;
                m = t;
                if (q = h)m += 1E3;
                n = r
            } else e = p, s = t, I = h, n -= r
        }
    }

    function ta(a) {
        if (null != a.cachedTextHeight)return a.cachedTextHeight;
        if (null == Ba) {
            Ba = q("pre");
            for (var b = 0; 49 > b; ++b)Ba.appendChild(document.createTextNode("x")), Ba.appendChild(q("br"));
            Ba.appendChild(document.createTextNode("x"))
        }
        R(a.measure,
            Ba);
        b = Ba.offsetHeight / 50;
        3 < b && (a.cachedTextHeight = b);
        va(a.measure);
        return b || 1
    }

    function cb(a) {
        if (null != a.cachedCharWidth)return a.cachedCharWidth;
        var b = q("span", "xxxxxxxxxx"), c = q("pre", [b]);
        R(a.measure, c);
        b = b.getBoundingClientRect();
        b = (b.right - b.left) / 10;
        2 < b && (a.cachedCharWidth = b);
        return b || 10
    }

    function Fa(a) {
        a.curOp = {
            cm: a,
            viewChanged: !1,
            startHeight: a.doc.height,
            forceUpdate: !1,
            updateInput: null,
            typing: !1,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: !1,
            updateMaxLine: !1,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: !1,
            id: ++yf
        };
        Pa ? Pa.ops.push(a.curOp) : a.curOp.ownsGroup = Pa = {ops: [a.curOp], delayedCallbacks: []}
    }

    function Ha(a) {
        if (a = a.curOp.ownsGroup)try {
            var b = a.delayedCallbacks, c = 0;
            do {
                for (; c < b.length; c++)b[c]();
                for (var d = 0; d < a.ops.length; d++) {
                    var e = a.ops[d];
                    if (e.cursorActivityHandlers)for (; e.cursorActivityCalled < e.cursorActivityHandlers.length;)e.cursorActivityHandlers[e.cursorActivityCalled++](e.cm)
                }
            } while (c < b.length)
        } finally {
            Pa = null;
            for (b = 0; b < a.ops.length; b++)a.ops[b].cm.curOp =
                null;
            a = a.ops;
            for (b = 0; b < a.length; b++) {
                var e = a[b], c = e.cm, f = d = c.display;
                !f.scrollbarsClipped && f.scroller.offsetWidth && (f.nativeBarWidth = f.scroller.offsetWidth - f.scroller.clientWidth, f.heightForcer.style.height = $(c) + "px", f.sizer.style.marginBottom = -f.nativeBarWidth + "px", f.sizer.style.borderRightWidth = $(c) + "px", f.scrollbarsClipped = !0);
                e.updateMaxLine && yc(c);
                e.mustUpdate = e.viewChanged || e.forceUpdate || null != e.scrollTop || e.scrollToPos && (e.scrollToPos.from.line < d.viewFrom || e.scrollToPos.to.line >= d.viewTo) ||
                    d.maxLineChanged && c.options.lineWrapping;
                e.update = e.mustUpdate && new Ib(c, e.mustUpdate && {
                            top: e.scrollTop,
                            ensure: e.scrollToPos
                        }, e.forceUpdate)
            }
            for (b = 0; b < a.length; b++)e = a[b], e.updatedDisplay = e.mustUpdate && Ec(e.cm, e.update);
            for (b = 0; b < a.length; b++)if (e = a[b], c = e.cm, d = c.display, e.updatedDisplay && Hb(c), e.barMeasure = fb(c), d.maxLineChanged && !c.options.lineWrapping && (e.adjustWidthTo = Sc(c, Vb(c, d.maxLine), d.maxLine.text.length, void 0).left + 3, c.display.sizerWidth = e.adjustWidthTo, e.barMeasure.scrollWidth = Math.max(d.scroller.clientWidth,
                    d.sizer.offsetLeft + e.adjustWidthTo + $(c) + c.display.barWidth), e.maxScrollLeft = Math.max(0, d.sizer.offsetLeft + e.adjustWidthTo - la(c))), e.updatedDisplay || e.selectionChanged)e.preparedSelection = d.input.prepareSelection();
            for (b = 0; b < a.length; b++)e = a[b], c = e.cm, null != e.adjustWidthTo && (c.display.sizer.style.minWidth = e.adjustWidthTo + "px", e.maxScrollLeft < c.doc.scrollLeft && Ia(c, Math.min(c.display.scroller.scrollLeft, e.maxScrollLeft), !0), c.display.maxLineChanged = !1), e.preparedSelection && c.display.input.showSelection(e.preparedSelection),
            e.updatedDisplay && Hc(c, e.barMeasure), (e.updatedDisplay || e.startHeight != c.doc.height) && Ja(c, e.barMeasure), e.selectionChanged && Qc(c), c.state.focused && e.updateInput && c.display.input.reset(e.typing), e.focus && e.focus == aa() && Md(e.cm);
            for (b = 0; b < a.length; b++) {
                e = a[b];
                c = e.cm;
                d = c.display;
                f = c.doc;
                e.updatedDisplay && Ed(c, e.update);
                if (null != d.wheelStartX && (null != e.scrollTop || null != e.scrollLeft || e.scrollToPos))d.wheelStartX = d.wheelStartY = null;
                if (null != e.scrollTop && (d.scroller.scrollTop != e.scrollTop || e.forceScroll))f.scrollTop =
                    Math.max(0, Math.min(d.scroller.scrollHeight - d.scroller.clientHeight, e.scrollTop)), d.scrollbars.setScrollTop(f.scrollTop), d.scroller.scrollTop = f.scrollTop;
                if (null != e.scrollLeft && (d.scroller.scrollLeft != e.scrollLeft || e.forceScroll))f.scrollLeft = Math.max(0, Math.min(d.scroller.scrollWidth - la(c), e.scrollLeft)), d.scrollbars.setScrollLeft(f.scrollLeft), d.scroller.scrollLeft = f.scrollLeft, wc(c);
                if (e.scrollToPos) {
                    var g = void 0, h = t(f, e.scrollToPos.from), g = t(f, e.scrollToPos.to), i = e.scrollToPos.margin;
                    null == i &&
                    (i = 0);
                    for (var j = 0; 5 > j; j++) {
                        var k = !1, n = ia(c, h), l = !g || g == h ? n : ia(c, g), l = Zb(c, Math.min(n.left, l.left), Math.min(n.top, l.top) - i, Math.max(n.left, l.left), Math.max(n.bottom, l.bottom) + i), s = c.doc.scrollTop, I = c.doc.scrollLeft;
                        null != l.scrollTop && (hb(c, l.scrollTop), 1 < Math.abs(c.doc.scrollTop - s) && (k = !0));
                        null != l.scrollLeft && (Ia(c, l.scrollLeft), 1 < Math.abs(c.doc.scrollLeft - I) && (k = !0));
                        if (!k)break
                    }
                    g = n;
                    if (e.scrollToPos.isCursor && c.state.focused && !ea(c, "scrollCursorIntoView")) {
                        i = c.display;
                        j = i.sizer.getBoundingClientRect();
                        h = null;
                        if (0 > g.top + j.top)h = !0; else if (g.bottom + j.top > (window.innerHeight || document.documentElement.clientHeight))h = !1;
                        null != h && !zf && (g = q("div", "​", null, "position: absolute; top: " + (g.top - i.viewOffset - c.display.lineSpace.offsetTop) + "px; height: " + (g.bottom - g.top + $(c) + i.barHeight) + "px; left: " + g.left + "px; width: 2px;"), c.display.lineSpace.appendChild(g), g.scrollIntoView(h), c.display.lineSpace.removeChild(g))
                    }
                }
                h = e.maybeHiddenMarkers;
                g = e.maybeUnhiddenMarkers;
                if (h)for (i = 0; i < h.length; ++i)h[i].lines.length ||
                F(h[i], "hide");
                if (g)for (i = 0; i < g.length; ++i)g[i].lines.length && F(g[i], "unhide");
                d.wrapper.offsetHeight && (f.scrollTop = c.display.scroller.scrollTop);
                e.changeObjs && F(c, "changes", c, e.changeObjs);
                e.update && e.update.finish()
            }
        }
    }

    function Q(a, b) {
        if (a.curOp)return b();
        Fa(a);
        try {
            return b()
        } finally {
            Ha(a)
        }
    }

    function B(a, b) {
        return function () {
            if (a.curOp)return b.apply(a, arguments);
            Fa(a);
            try {
                return b.apply(a, arguments)
            } finally {
                Ha(a)
            }
        }
    }

    function J(a) {
        return function () {
            if (this.curOp)return a.apply(this, arguments);
            Fa(this);
            try {
                return a.apply(this, arguments)
            } finally {
                Ha(this)
            }
        }
    }

    function K(a) {
        return function () {
            var b = this.cm;
            if (!b || b.curOp)return a.apply(this, arguments);
            Fa(b);
            try {
                return a.apply(this, arguments)
            } finally {
                Ha(b)
            }
        }
    }

    function ce(a, b, c) {
        for (var d = this.line = b, e; d = wa(d, !1);)d = d.find(1, !0).line, (e || (e = [])).push(d);
        this.size = (this.rest = e) ? C(x(this.rest)) - c + 1 : 1;
        this.node = this.text = null;
        this.hidden = ua(a, b)
    }

    function Jb(a, b, c) {
        var d = [], e;
        for (e = b; e < c;)b = new ce(a.doc, r(a.doc, e), e), e += b.size, d.push(b);
        return d
    }

    function N(a,
               b, c, d) {
        null == b && (b = a.doc.first);
        null == c && (c = a.doc.first + a.doc.size);
        d || (d = 0);
        var e = a.display;
        if (d && c < e.viewTo && (null == e.updateLineNumbers || e.updateLineNumbers > b))e.updateLineNumbers = b;
        a.curOp.viewChanged = !0;
        if (b >= e.viewTo)na && Fc(a.doc, b) < e.viewTo && ma(a); else if (c <= e.viewFrom)na && Dd(a.doc, c + d) > e.viewFrom ? ma(a) : (e.viewFrom += d, e.viewTo += d); else if (b <= e.viewFrom && c >= e.viewTo)ma(a); else if (b <= e.viewFrom) {
            var f = $b(a, c, c + d, 1);
            f ? (e.view = e.view.slice(f.index), e.viewFrom = f.lineN, e.viewTo += d) : ma(a)
        } else if (c >=
            e.viewTo)(f = $b(a, b, b, -1)) ? (e.view = e.view.slice(0, f.index), e.viewTo = f.lineN) : ma(a); else {
            var f = $b(a, b, b, -1), g = $b(a, c, c + d, 1);
            f && g ? (e.view = e.view.slice(0, f.index).concat(Jb(a, f.lineN, g.lineN)).concat(e.view.slice(g.index)), e.viewTo += d) : ma(a)
        }
        if (a = e.externalMeasured)c < a.lineN ? a.lineN += d : b < a.lineN + a.size && (e.externalMeasured = null)
    }

    function ja(a, b, c) {
        a.curOp.viewChanged = !0;
        var d = a.display, e = a.display.externalMeasured;
        e && (b >= e.lineN && b < e.lineN + e.size) && (d.externalMeasured = null);
        b < d.viewFrom || b >= d.viewTo ||
        (a = d.view[ya(a, b)], null != a.node && (a = a.changes || (a.changes = []), -1 == G(a, c) && a.push(c)))
    }

    function ma(a) {
        a.display.viewFrom = a.display.viewTo = a.doc.first;
        a.display.view = [];
        a.display.viewOffset = 0
    }

    function ya(a, b) {
        if (b >= a.display.viewTo)return null;
        b -= a.display.viewFrom;
        if (0 > b)return null;
        for (var c = a.display.view, d = 0; d < c.length; d++)if (b -= c[d].size, 0 > b)return d
    }

    function $b(a, b, c, d) {
        var e = ya(a, b), f = a.display.view;
        if (!na || c == a.doc.first + a.doc.size)return {index: e, lineN: c};
        for (var g = 0, h = a.display.viewFrom; g <
        e; g++)h += f[g].size;
        if (h != b) {
            if (0 < d) {
                if (e == f.length - 1)return null;
                b = h + f[e].size - b;
                e++
            } else b = h - b;
            c += b
        }
        for (; Fc(a.doc, c) != c;) {
            if (e == (0 > d ? 0 : f.length - 1))return null;
            c += d * f[e - (0 > d ? 1 : 0)].size;
            e += d
        }
        return {index: e, lineN: c}
    }

    function Cd(a) {
        for (var a = a.display.view, b = 0, c = 0; c < a.length; c++) {
            var d = a[c];
            !d.hidden && (!d.node || d.changes) && ++b
        }
        return b
    }

    function lf(a) {
        function b() {
            d.activeTouch && (e = setTimeout(function () {
                d.activeTouch = null
            }, 1E3), f = d.activeTouch, f.end = +new Date)
        }

        function c(a, b) {
            if (null == b.left)return !0;
            var c = b.left - a.left, d = b.top - a.top;
            return 400 < c * c + d * d
        }

        var d = a.display;
        p(d.scroller, "mousedown", B(a, he));
        y && 11 > z ? p(d.scroller, "dblclick", B(a, function (b) {
            if (!ea(a, b)) {
                var c = Qa(a, b);
                c && (!Zc(a, b, "gutterClick", !0, H) && !ka(a.display, b)) && (L(b), b = a.findWordAt(c), Qb(a.doc, b.anchor, b.head))
            }
        })) : p(d.scroller, "dblclick", function (b) {
            ea(a, b) || L(b)
        });
        $c || p(d.scroller, "contextmenu", function (b) {
            ie(a, b)
        });
        var e, f = {end: 0};
        p(d.scroller, "touchstart", function (a) {
            var b;
            1 != a.touches.length ? b = !1 : (b = a.touches[0], b = 1 >= b.radiusX &&
                1 >= b.radiusY);
            b || (clearTimeout(e), b = +new Date, d.activeTouch = {
                start: b,
                moved: !1,
                prev: 300 >= b - f.end ? f : null
            }, 1 == a.touches.length && (d.activeTouch.left = a.touches[0].pageX, d.activeTouch.top = a.touches[0].pageY))
        });
        p(d.scroller, "touchmove", function () {
            d.activeTouch && (d.activeTouch.moved = !0)
        });
        p(d.scroller, "touchend", function (e) {
            var f = d.activeTouch;
            if (f && !ka(d, e) && null != f.left && !f.moved && 300 > new Date - f.start) {
                var g = a.coordsChar(d.activeTouch, "page"), f = !f.prev || c(f, f.prev) ? new w(g, g) : !f.prev.prev || c(f, f.prev.prev) ?
                    a.findWordAt(g) : new w(o(g.line, 0), t(a.doc, o(g.line + 1, 0)));
                a.setSelection(f.anchor, f.head);
                a.focus();
                L(e)
            }
            b()
        });
        p(d.scroller, "touchcancel", b);
        p(d.scroller, "scroll", function () {
            d.scroller.clientHeight && (hb(a, d.scroller.scrollTop), Ia(a, d.scroller.scrollLeft, !0), F(a, "scroll", a))
        });
        p(d.scroller, "mousewheel", function (b) {
            je(a, b)
        });
        p(d.scroller, "DOMMouseScroll", function (b) {
            je(a, b)
        });
        p(d.wrapper, "scroll", function () {
            d.wrapper.scrollTop = d.wrapper.scrollLeft = 0
        });
        d.dragFunctions = {
            simple: function (b) {
                ea(a, b) || ad(b)
            },
            start: function (b) {
                if (y && (!a.state.draggingText || 100 > +new Date - ke))ad(b); else if (!ea(a, b) && !ka(a.display, b) && (b.dataTransfer.setData("Text", a.getSelection()), b.dataTransfer.setDragImage && !le)) {
                    var c = q("img", null, null, "position: fixed; left: 0; top: 0;");
                    c.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    Y && (c.width = c.height = 1, a.display.wrapper.appendChild(c), c._top = c.offsetTop);
                    b.dataTransfer.setDragImage(c, 0, 0);
                    Y && c.parentNode.removeChild(c)
                }
            }, drop: B(a, Af)
        };
        var g = d.input.getField();
        p(g, "keyup", function (b) {
            me.call(a, b)
        });
        p(g, "keydown", B(a, ne));
        p(g, "keypress", B(a, oe));
        p(g, "focus", Za(sc, a));
        p(g, "blur", Za($a, a))
    }

    function Bf(a) {
        var b = a.display;
        b.lastWrapHeight == b.wrapper.clientHeight && b.lastWrapWidth == b.wrapper.clientWidth || (b.cachedCharWidth = b.cachedTextHeight = b.cachedPaddingH = null, b.scrollbarsClipped = !1, a.setSize())
    }

    function ka(a, b) {
        for (var c = b.target || b.srcElement; c != a.wrapper; c = c.parentNode)if (!c || 1 == c.nodeType && "true" == c.getAttribute("cm-ignore-events") || c.parentNode == a.sizer &&
            c != a.mover)return !0
    }

    function Qa(a, b, c, d) {
        var e = a.display;
        if (!c && "true" == (b.target || b.srcElement).getAttribute("cm-not-content"))return null;
        var f, g, c = e.lineSpace.getBoundingClientRect();
        try {
            f = b.clientX - c.left, g = b.clientY - c.top
        } catch (h) {
            return null
        }
        var b = Xc(a, f, g), i;
        if (d && 1 == b.xRel && (i = r(a.doc, b.line).text).length == b.ch)d = X(i, i.length, a.options.tabSize) - i.length, b = o(b.line, Math.max(0, Math.round((f - ae(a.display).left) / cb(a.display)) - d));
        return b
    }

    function he(a) {
        var b = this.display;
        if (!(b.activeTouch &&
            b.input.supportsTouch() || ea(this, a)))if (b.shift = a.shiftKey, ka(b, a))E || (b.scroller.draggable = !1, setTimeout(function () {
            b.scroller.draggable = !0
        }, 100)); else if (!Zc(this, a, "gutterClick", !0, H)) {
            var c = Qa(this, a);
            window.focus();
            switch (pe(a)) {
                case 1:
                    c ? Cf(this, a, c) : (a.target || a.srcElement) == b.scroller && L(a);
                    break;
                case 2:
                    E && (this.state.lastMiddleDown = +new Date);
                    c && Qb(this.doc, c);
                    setTimeout(function () {
                        b.input.focus()
                    }, 20);
                    L(a);
                    break;
                case 3:
                    $c ? ie(this, a) : Df(this)
            }
        }
    }

    function Cf(a, b, c) {
        y ? setTimeout(Za(Md, a), 0) :
            a.curOp.focus = aa();
        var d = +new Date, e;
        ac && ac.time > d - 400 && 0 == v(ac.pos, c) ? e = "triple" : bc && bc.time > d - 400 && 0 == v(bc.pos, c) ? (e = "double", ac = {
            time: d,
            pos: c
        }) : (e = "single", bc = {time: d, pos: c});
        var d = a.doc.sel, f = T ? b.metaKey : b.ctrlKey, g;
        a.options.dragDrop && Ef && !Nb(a) && "single" == e && -1 < (g = d.contains(c)) && !d.ranges[g].empty() ? Ff(a, b, c, f) : Gf(a, b, c, e, f)
    }

    function Ff(a, b, c, d) {
        var e = a.display, f = +new Date, g = B(a, function (h) {
            E && (e.scroller.draggable = !1);
            a.state.draggingText = !1;
            fa(document, "mouseup", g);
            fa(e.scroller, "drop", g);
            10 > Math.abs(b.clientX - h.clientX) + Math.abs(b.clientY - h.clientY) && (L(h), !d && +new Date - 200 < f && Qb(a.doc, c), E || y && 9 == z ? setTimeout(function () {
                document.body.focus();
                e.input.focus()
            }, 20) : e.input.focus())
        });
        E && (e.scroller.draggable = !0);
        a.state.draggingText = g;
        e.scroller.dragDrop && e.scroller.dragDrop();
        p(document, "mouseup", g);
        p(e.scroller, "drop", g)
    }

    function Gf(a, b, c, d, e) {
        function f(b) {
            if (0 != v(m, b))if (m = b, "rect" == d) {
                for (var e = [], f = a.options.tabSize, g = X(r(j, c.line).text, c.ch, f), h = X(r(j, b.line).text, b.ch, f), i =
                    Math.min(g, h), g = Math.max(g, h), h = Math.min(c.line, b.line), s = Math.min(a.lastLine(), Math.max(c.line, b.line)); h <= s; h++) {
                    var I = r(j, h).text, q = qe(I, i, f);
                    i == g ? e.push(new w(o(h, q), o(h, q))) : I.length > q && e.push(new w(o(h, q), o(h, qe(I, g, f))))
                }
                e.length || e.push(new w(c, c));
                A(j, W(l.ranges.slice(0, n).concat(e), n), {origin: "*mouse", scroll: !1});
                a.scrollIntoView(b)
            } else e = k, f = e.anchor, i = b, "single" != d && (b = "double" == d ? a.findWordAt(b) : new w(o(b.line, 0), t(j, o(b.line + 1, 0))), 0 < v(b.anchor, f) ? (i = b.head, f = Mb(e.from(), b.anchor)) :
                (i = b.anchor, f = Lb(e.to(), b.head))), e = l.ranges.slice(0), e[n] = new w(t(j, f), i), A(j, W(e, n), bd)
        }

        function g(b) {
            var c = ++u, e = Qa(a, b, !0, "rect" == d);
            if (e)if (0 != v(e, m)) {
                a.curOp.focus = aa();
                f(e);
                var h = Bc(i, j);
                (e.line >= h.to || e.line < h.from) && setTimeout(B(a, function () {
                    u == c && g(b)
                }), 150)
            } else {
                var k = b.clientY < q.top ? -20 : b.clientY > q.bottom ? 20 : 0;
                k && setTimeout(B(a, function () {
                    u == c && (i.scroller.scrollTop += k, g(b))
                }), 50)
            }
        }

        function h(a) {
            u = Infinity;
            L(a);
            i.input.focus();
            fa(document, "mousemove", y);
            fa(document, "mouseup", x);
            j.history.lastSelOrigin =
                null
        }

        var i = a.display, j = a.doc;
        L(b);
        var k, n, l = j.sel, s = l.ranges;
        e && !b.shiftKey ? (n = j.sel.contains(c), k = -1 < n ? s[n] : new w(c, c)) : (k = j.sel.primary(), n = j.sel.primIndex);
        if (b.altKey)d = "rect", e || (k = new w(c, c)), c = Qa(a, b, !0, !0), n = -1; else if ("double" == d) {
            var I = a.findWordAt(c);
            k = a.display.shift || j.extend ? nb(j, k, I.anchor, I.head) : I
        } else"triple" == d ? (I = new w(o(c.line, 0), t(j, o(c.line + 1, 0))), k = a.display.shift || j.extend ? nb(j, k, I.anchor, I.head) : I) : k = nb(j, k, c);
        e ? -1 == n ? (n = s.length, A(j, W(s.concat([k]), n), {scroll: !1, origin: "*mouse"})) :
            1 < s.length && s[n].empty() && "single" == d && !b.shiftKey ? (A(j, W(s.slice(0, n).concat(s.slice(n + 1)), 0)), l = j.sel) : Pc(j, n, k, bd) : (n = 0, A(j, new ha([k], 0), bd), l = j.sel);
        var m = c, q = i.wrapper.getBoundingClientRect(), u = 0, y = B(a, function (a) {
            pe(a) ? g(a) : h(a)
        }), x = B(a, h);
        p(document, "mousemove", y);
        p(document, "mouseup", x)
    }

    function Zc(a, b, c, d, e) {
        try {
            var f = b.clientX, g = b.clientY
        } catch (h) {
            return !1
        }
        if (f >= Math.floor(a.display.gutters.getBoundingClientRect().right))return !1;
        d && L(b);
        var d = a.display, i = d.lineDiv.getBoundingClientRect();
        if (g > i.bottom || !P(a, c))return cd(b);
        g -= i.top - d.viewOffset;
        for (i = 0; i < a.options.gutters.length; ++i) {
            var j = d.gutters.childNodes[i];
            if (j && j.getBoundingClientRect().right >= f)return f = xa(a.doc, g), e(a, c, a, f, a.options.gutters[i], b), cd(b)
        }
    }

    function Af(a) {
        var b = this;
        if (!ea(b, a) && !ka(b.display, a)) {
            L(a);
            y && (ke = +new Date);
            var c = Qa(b, a, !0), d = a.dataTransfer.files;
            if (c && !Nb(b))if (d && d.length && window.FileReader && window.File)for (var e = d.length, f = Array(e), g = 0, a = function (a, d) {
                var h = new FileReader;
                h.onload = B(b, function () {
                    f[d] =
                        h.result;
                    if (++g == e) {
                        c = t(b.doc, c);
                        var a = {from: c, to: c, text: oa(f.join("\n")), origin: "paste"};
                        Ka(b.doc, a);
                        Ud(b.doc, ba(c, pa(a)))
                    }
                });
                h.readAsText(a)
            }, h = 0; h < e; ++h)a(d[h], h); else if (b.state.draggingText && -1 < b.doc.sel.contains(c))b.state.draggingText(a), setTimeout(function () {
                b.display.input.focus()
            }, 20); else try {
                if (f = a.dataTransfer.getData("Text")) {
                    if (b.state.draggingText && !(T ? a.altKey : a.ctrlKey))var i = b.listSelections();
                    Rb(b.doc, ba(c, c));
                    if (i)for (h = 0; h < i.length; ++h)sb(b.doc, "", i[h].anchor, i[h].head, "drag");
                    b.replaceSelection(f, "around", "paste");
                    b.display.input.focus()
                }
            } catch (j) {
            }
        }
    }

    function hb(a, b) {
        2 > Math.abs(a.doc.scrollTop - b) || (a.doc.scrollTop = b, sa || Ic(a, {top: b}), a.display.scroller.scrollTop != b && (a.display.scroller.scrollTop = b), a.display.scrollbars.setScrollTop(b), sa && Ic(a), bb(a, 100))
    }

    function Ia(a, b, c) {
        if (!(c ? b == a.doc.scrollLeft : 2 > Math.abs(a.doc.scrollLeft - b)))b = Math.min(b, a.display.scroller.scrollWidth - a.display.scroller.clientWidth), a.doc.scrollLeft = b, wc(a), a.display.scroller.scrollLeft != b && (a.display.scroller.scrollLeft =
            b), a.display.scrollbars.setScrollLeft(b)
    }

    function je(a, b) {
        var c = re(b), d = c.x, c = c.y, e = a.display, f = e.scroller;
        if (d && f.scrollWidth > f.clientWidth || c && f.scrollHeight > f.clientHeight) {
            if (c && T && E) {
                var g = b.target, h = e.view;
                a:for (; g != f; g = g.parentNode)for (var i = 0; i < h.length; i++)if (h[i].node == g) {
                    a.display.currentWheelTarget = g;
                    break a
                }
            }
            if (d && !sa && !Y && null != O)c && hb(a, Math.max(0, Math.min(f.scrollTop + c * O, f.scrollHeight - f.clientHeight))), Ia(a, Math.max(0, Math.min(f.scrollLeft + d * O, f.scrollWidth - f.clientWidth))), L(b),
                e.wheelStartX = null; else if (c && null != O && (g = c * O, h = a.doc.scrollTop, i = h + e.wrapper.clientHeight, 0 > g ? h = Math.max(0, h + g - 50) : i = Math.min(a.doc.height, i + g + 50), Ic(a, {
                    top: h,
                    bottom: i
                })), 20 > cc)null == e.wheelStartX ? (e.wheelStartX = f.scrollLeft, e.wheelStartY = f.scrollTop, e.wheelDX = d, e.wheelDY = c, setTimeout(function () {
                    if (e.wheelStartX != null) {
                        var a = f.scrollLeft - e.wheelStartX, b = f.scrollTop - e.wheelStartY, a = b && e.wheelDY && b / e.wheelDY || a && e.wheelDX && a / e.wheelDX;
                        e.wheelStartX = e.wheelStartY = null;
                        if (a) {
                            O = (O * cc + a) / (cc + 1);
                            ++cc
                        }
                    }
                },
                200)) : (e.wheelDX += d, e.wheelDY += c)
        }
    }

    function dc(a, b, c) {
        if ("string" == typeof b && (b = ec[b], !b))return !1;
        a.display.input.ensurePolled();
        var d = a.display.shift, e = !1;
        try {
            Nb(a) && (a.state.suppressEdits = !0), c && (a.display.shift = !1), e = b(a) != se
        } finally {
            a.display.shift = d, a.state.suppressEdits = !1
        }
        return e
    }

    function Hf(a, b, c) {
        for (var d = 0; d < a.state.keyMaps.length; d++) {
            var e = tb(b, a.state.keyMaps[d], c, a);
            if (e)return e
        }
        return a.options.extraKeys && tb(b, a.options.extraKeys, c, a) || tb(b, a.options.keyMap, c, a)
    }

    function fc(a, b,
                c, d) {
        var e = a.state.keySeq;
        if (e) {
            if (If(b))return "handled";
            Jf.set(50, function () {
                a.state.keySeq == e && (a.state.keySeq = null, a.display.input.reset())
            });
            b = e + " " + b
        }
        d = Hf(a, b, d);
        "multi" == d && (a.state.keySeq = b);
        "handled" == d && H(a, "keyHandled", a, b, c);
        if ("handled" == d || "multi" == d)L(c), Qc(a);
        return e && !d && /\'$/.test(b) ? (L(c), !0) : !!d
    }

    function te(a, b) {
        var c = Kf(b, !0);
        return !c ? !1 : b.shiftKey && !a.state.keySeq ? fc(a, "Shift-" + c, b, function (b) {
            return dc(a, b, true)
        }) || fc(a, c, b, function (b) {
            if (typeof b == "string" ? /^go[A-Z]/.test(b) :
                    b.motion)return dc(a, b)
        }) : fc(a, c, b, function (b) {
            return dc(a, b)
        })
    }

    function Lf(a, b, c) {
        return fc(a, "'" + c + "'", b, function (b) {
            return dc(a, b, !0)
        })
    }

    function ne(a) {
        this.curOp.focus = aa();
        if (!ea(this, a)) {
            y && (11 > z && 27 == a.keyCode) && (a.returnValue = !1);
            var b = a.keyCode;
            this.display.shift = 16 == b || a.shiftKey;
            var c = te(this, a);
            Y && (dd = c ? b : null, !c && (88 == b && !ue && (T ? a.metaKey : a.ctrlKey)) && this.replaceSelection("", null, "cut"));
            18 == b && !/\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className) && Mf(this)
        }
    }

    function Mf(a) {
        function b(a) {
            if (18 ==
                a.keyCode || !a.altKey)gb(c, "CodeMirror-crosshair"), fa(document, "keyup", b), fa(document, "mouseover", b)
        }

        var c = a.display.lineDiv;
        ib(c, "CodeMirror-crosshair");
        p(document, "keyup", b);
        p(document, "mouseover", b)
    }

    function me(a) {
        16 == a.keyCode && (this.doc.sel.shift = !1);
        ea(this, a)
    }

    function oe(a) {
        if (!ka(this.display, a) && !ea(this, a) && !(a.ctrlKey && !a.altKey || T && a.metaKey)) {
            var b = a.keyCode, c = a.charCode;
            if (Y && b == dd)dd = null, L(a); else if (!Y || a.which && !(10 > a.which) || !te(this, a))if (b = String.fromCharCode(null == c ? b : c), !Lf(this,
                    a, b))this.display.input.onKeyPress(a)
        }
    }

    function Df(a) {
        a.state.delayingBlurEvent = !0;
        setTimeout(function () {
            a.state.delayingBlurEvent && (a.state.delayingBlurEvent = !1, $a(a))
        }, 100)
    }

    function sc(a) {
        a.state.delayingBlurEvent && (a.state.delayingBlurEvent = !1);
        "nocursor" != a.options.readOnly && (a.state.focused || (F(a, "focus", a), a.state.focused = !0, ib(a.display.wrapper, "CodeMirror-focused"), !a.curOp && a.display.selForContextMenu != a.doc.sel && (a.display.input.reset(), E && setTimeout(function () {
                a.display.input.reset(true)
            },
            20)), a.display.input.receivedFocus()), Qc(a))
    }

    function $a(a) {
        a.state.delayingBlurEvent || (a.state.focused && (F(a, "blur", a), a.state.focused = !1, gb(a.display.wrapper, "CodeMirror-focused")), clearInterval(a.display.blinker), setTimeout(function () {
            if (!a.state.focused)a.display.shift = false
        }, 150))
    }

    function ie(a, b) {
        var c;
        if (!(c = ka(a.display, b)))c = P(a, "gutterContextMenu") ? Zc(a, b, "gutterContextMenu", !1, F) : !1;
        if (!c)a.display.input.onContextMenu(b)
    }

    function ve(a, b) {
        if (0 > v(a, b.from))return a;
        if (0 >= v(a, b.to))return pa(b);
        var c = a.line + b.text.length - (b.to.line - b.from.line) - 1, d = a.ch;
        a.line == b.to.line && (d += pa(b).ch - b.to.ch);
        return o(c, d)
    }

    function ed(a, b) {
        for (var c = [], d = 0; d < a.sel.ranges.length; d++) {
            var e = a.sel.ranges[d];
            c.push(new w(ve(e.anchor, b), ve(e.head, b)))
        }
        return W(c, a.sel.primIndex)
    }

    function we(a, b, c) {
        return a.line == b.line ? o(c.line, a.ch - b.ch + c.ch) : o(c.line + (a.line - b.line), a.ch)
    }

    function xe(a, b, c) {
        b = {
            canceled: !1, from: b.from, to: b.to, text: b.text, origin: b.origin, cancel: function () {
                this.canceled = !0
            }
        };
        c && (b.update = function (b,
                                   c, f, g) {
            b && (this.from = t(a, b));
            c && (this.to = t(a, c));
            f && (this.text = f);
            void 0 !== g && (this.origin = g)
        });
        F(a, "beforeChange", a, b);
        a.cm && F(a.cm, "beforeChange", a.cm, b);
        return b.canceled ? null : {from: b.from, to: b.to, text: b.text, origin: b.origin}
    }

    function Ka(a, b, c) {
        if (a.cm) {
            if (!a.cm.curOp)return B(a.cm, Ka)(a, b, c);
            if (a.cm.state.suppressEdits)return
        }
        if (P(a, "beforeChange") || a.cm && P(a.cm, "beforeChange"))if (b = xe(a, b, !0), !b)return;
        if (c = ye && !c && Nf(a, b.from, b.to))for (var d = c.length - 1; 0 <= d; --d)ze(a, {
            from: c[d].from, to: c[d].to,
            text: d ? [""] : b.text
        }); else ze(a, b)
    }

    function ze(a, b) {
        if (!(1 == b.text.length && "" == b.text[0] && 0 == v(b.from, b.to))) {
            var c = ed(a, b);
            Ae(a, b, c, a.cm ? a.cm.curOp.id : NaN);
            ub(a, b, c, fd(a, b));
            var d = [];
            Ca(a, function (a, c) {
                !c && -1 == G(d, a.history) && (Be(a.history, b), d.push(a.history));
                ub(a, b, null, fd(a, b))
            })
        }
    }

    function gc(a, b, c) {
        if (!a.cm || !a.cm.state.suppressEdits) {
            for (var d = a.history, e, f = a.sel, g = "undo" == b ? d.done : d.undone, h = "undo" == b ? d.undone : d.done, i = 0; i < g.length && !(e = g[i], c ? e.ranges && !e.equals(a.sel) : !e.ranges); i++);
            if (i !=
                g.length) {
                for (d.lastOrigin = d.lastSelOrigin = null; ;)if (e = g.pop(), e.ranges) {
                    Sb(e, h);
                    if (c && !e.equals(a.sel)) {
                        A(a, e, {clearRedo: !1});
                        return
                    }
                    f = e
                } else break;
                c = [];
                Sb(f, h);
                h.push({changes: c, generation: d.generation});
                d.generation = e.generation || ++d.maxGeneration;
                d = P(a, "beforeChange") || a.cm && P(a.cm, "beforeChange");
                for (i = e.changes.length - 1; 0 <= i; --i) {
                    var j = e.changes[i];
                    j.origin = b;
                    if (d && !xe(a, j, !1)) {
                        g.length = 0;
                        break
                    }
                    c.push(gd(a, j));
                    f = i ? ed(a, j) : x(g);
                    ub(a, j, f, Ce(a, j));
                    !i && a.cm && a.cm.scrollIntoView({from: j.from, to: pa(j)});
                    var k = [];
                    Ca(a, function (a, b) {
                        !b && -1 == G(k, a.history) && (Be(a.history, j), k.push(a.history));
                        ub(a, j, null, Ce(a, j))
                    })
                }
            }
        }
    }

    function De(a, b) {
        if (0 != b && (a.first += b, a.sel = new ha(kb(a.sel.ranges, function (a) {
                return new w(o(a.anchor.line + b, a.anchor.ch), o(a.head.line + b, a.head.ch))
            }), a.sel.primIndex), a.cm)) {
            N(a.cm, a.first, a.first - b, b);
            for (var c = a.cm.display, d = c.viewFrom; d < c.viewTo; d++)ja(a.cm, d, "gutter")
        }
    }

    function ub(a, b, c, d) {
        if (a.cm && !a.cm.curOp)return B(a.cm, ub)(a, b, c, d);
        if (b.to.line < a.first)De(a, b.text.length - 1 -
            (b.to.line - b.from.line)); else if (!(b.from.line > a.lastLine())) {
            if (b.from.line < a.first) {
                var e = b.text.length - 1 - (a.first - b.from.line);
                De(a, e);
                b = {from: o(a.first, 0), to: o(b.to.line + e, b.to.ch), text: [x(b.text)], origin: b.origin}
            }
            e = a.lastLine();
            b.to.line > e && (b = {from: b.from, to: o(e, r(a, e).text.length), text: [b.text[0]], origin: b.origin});
            b.removed = za(a, b.from, b.to);
            c || (c = ed(a, b));
            a.cm ? Of(a.cm, b, d) : hd(a, b, d);
            Rb(a, c, ca)
        }
    }

    function Of(a, b, c) {
        var d = a.doc, e = a.display, f = b.from, g = b.to, h = !1, i = f.line;
        a.options.lineWrapping ||
        (i = C(da(r(d, f.line))), d.iter(i, g.line + 1, function (a) {
            if (a == e.maxLine)return h = !0
        }));
        -1 < d.sel.contains(b.from, b.to) && Yd(a);
        hd(d, b, c, Ad(a));
        a.options.lineWrapping || (d.iter(i, f.line + b.text.length, function (a) {
            var b = Gb(a);
            if (b > e.maxLineLength) {
                e.maxLine = a;
                e.maxLineLength = b;
                e.maxLineChanged = true;
                h = false
            }
        }), h && (a.curOp.updateMaxLine = !0));
        d.frontier = Math.min(d.frontier, f.line);
        bb(a, 400);
        c = b.text.length - (g.line - f.line) - 1;
        b.full ? N(a) : f.line == g.line && 1 == b.text.length && !Ee(a.doc, b) ? ja(a, f.line, "text") : N(a, f.line,
            g.line + 1, c);
        c = P(a, "changes");
        if ((d = P(a, "change")) || c)b = {
            from: f,
            to: g,
            text: b.text,
            removed: b.removed,
            origin: b.origin
        }, d && H(a, "change", a, b), c && (a.curOp.changeObjs || (a.curOp.changeObjs = [])).push(b);
        a.display.selForContextMenu = null
    }

    function sb(a, b, c, d, e) {
        d || (d = c);
        if (0 > v(d, c))var f = d, d = c, c = f;
        "string" == typeof b && (b = oa(b));
        Ka(a, {from: c, to: d, text: b, origin: e})
    }

    function Zb(a, b, c, d, e) {
        var f = a.display, g = ta(a.display);
        0 > c && (c = 0);
        var h = a.curOp && null != a.curOp.scrollTop ? a.curOp.scrollTop : f.scroller.scrollTop, i = Gc(a),
            j = {};
        e - c > i && (e = c + i);
        var k = a.doc.height + (f.mover.offsetHeight - f.lineSpace.offsetHeight), n = c < g, g = e > k - g;
        c < h ? j.scrollTop = n ? 0 : c : e > h + i && (c = Math.min(c, (g ? k : e) - i), c != h && (j.scrollTop = c));
        h = a.curOp && null != a.curOp.scrollLeft ? a.curOp.scrollLeft : f.scroller.scrollLeft;
        a = la(a) - (a.options.fixedGutter ? f.gutters.offsetWidth : 0);
        (f = d - b > a) && (d = b + a);
        10 > b ? j.scrollLeft = 0 : b < h ? j.scrollLeft = Math.max(0, b - (f ? 0 : 10)) : d > a + h - 3 && (j.scrollLeft = d + (f ? 0 : 10) - a);
        return j
    }

    function id(a, b, c) {
        (null != b || null != c) && hc(a);
        null != b && (a.curOp.scrollLeft =
            (null == a.curOp.scrollLeft ? a.doc.scrollLeft : a.curOp.scrollLeft) + b);
        null != c && (a.curOp.scrollTop = (null == a.curOp.scrollTop ? a.doc.scrollTop : a.curOp.scrollTop) + c)
    }

    function La(a) {
        hc(a);
        var b = a.getCursor(), c = b, d = b;
        a.options.lineWrapping || (c = b.ch ? o(b.line, b.ch - 1) : b, d = o(b.line, b.ch + 1));
        a.curOp.scrollToPos = {from: c, to: d, margin: a.options.cursorScrollMargin, isCursor: !0}
    }

    function hc(a) {
        var b = a.curOp.scrollToPos;
        if (b) {
            a.curOp.scrollToPos = null;
            var c = ge(a, b.from), d = ge(a, b.to), b = Zb(a, Math.min(c.left, d.left), Math.min(c.top,
                    d.top) - b.margin, Math.max(c.right, d.right), Math.max(c.bottom, d.bottom) + b.margin);
            a.scrollTo(b.scrollLeft, b.scrollTop)
        }
    }

    function lb(a, b, c, d) {
        var e = a.doc, f;
        null == c && (c = "add");
        "smart" == c && (e.mode.indent ? f = ob(a, b) : c = "prev");
        var g = a.options.tabSize, h = r(e, b), i = X(h.text, null, g);
        h.stateAfter && (h.stateAfter = null);
        var j = h.text.match(/^\s*/)[0], k;
        if (!d && !/\S/.test(h.text))k = 0, c = "not"; else if ("smart" == c && (k = e.mode.indent(f, h.text.slice(j.length), h.text), k == se || 150 < k)) {
            if (!d)return;
            c = "prev"
        }
        "prev" == c ? k = b > e.first ?
            X(r(e, b - 1).text, null, g) : 0 : "add" == c ? k = i + a.options.indentUnit : "subtract" == c ? k = i - a.options.indentUnit : "number" == typeof c && (k = i + c);
        k = Math.max(0, k);
        c = "";
        d = 0;
        if (a.options.indentWithTabs)for (a = Math.floor(k / g); a; --a)d += g, c += "\t";
        d < k && (c += Fe(k - d));
        if (c != j)return sb(e, c, o(b, 0), o(b, j.length), "+input"), h.stateAfter = null, !0;
        for (a = 0; a < e.sel.ranges.length; a++)if (g = e.sel.ranges[a], g.head.line == b && g.head.ch < j.length) {
            d = o(b, j.length);
            Pc(e, a, new w(d, d));
            break
        }
    }

    function ic(a, b, c, d) {
        var e = b, f = b;
        "number" == typeof b ? f = r(a,
            Math.max(a.first, Math.min(b, a.first + a.size - 1))) : e = C(b);
        if (null == e)return null;
        d(f, e) && a.cm && ja(a.cm, e, c);
        return f
    }

    function Ra(a, b) {
        for (var c = a.doc.sel.ranges, d = [], e = 0; e < c.length; e++) {
            for (var f = b(c[e]); d.length && 0 >= v(f.from, x(d).to);) {
                var g = d.pop();
                if (0 > v(g.from, f.from)) {
                    f.from = g.from;
                    break
                }
            }
            d.push(f)
        }
        Q(a, function () {
            for (var b = d.length - 1; 0 <= b; b--)sb(a.doc, "", d[b].from, d[b].to, "+delete");
            La(a)
        })
    }

    function jd(a, b, c, d, e) {
        function f(b) {
            var d = (e ? Yc : Ge)(j, h, c, !0);
            if (null == d) {
                if (b = !b)b = g + c, b < a.first || b >= a.first +
                a.size ? b = k = !1 : (g = b, b = j = r(a, b));
                if (b)h = e ? (0 > c ? Yb : Xb)(j) : 0 > c ? j.text.length : 0; else return k = !1
            } else h = d;
            return !0
        }

        var g = b.line, h = b.ch, i = c, j = r(a, g), k = !0;
        if ("char" == d)f(); else if ("column" == d)f(!0); else if ("word" == d || "group" == d)for (var n = null, d = "group" == d, b = a.cm && a.cm.getHelper(b, "wordChars"), l = !0; !(0 > c) || f(!l); l = !1) {
            var s = j.text.charAt(h) || "\n", s = jc(s, b) ? "w" : d && "\n" == s ? "n" : !d || /\s/.test(s) ? null : "p";
            d && (!l && !s) && (s = "s");
            if (n && n != s) {
                0 > c && (c = 1, f());
                break
            }
            s && (n = s);
            if (0 < c && !f(!l))break
        }
        i = Tb(a, o(g, h), i, !0);
        k ||
        (i.hitSide = !0);
        return i
    }

    function He(a, b, c, d) {
        var e = a.doc, f = b.left, g;
        "page" == d ? (d = Math.min(a.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight), g = b.top + c * (d - (0 > c ? 1.5 : 0.5) * ta(a.display))) : "line" == d && (g = 0 < c ? b.bottom + 3 : b.top - 3);
        for (; ;) {
            var h = Xc(a, f, g);
            if (!h.outside)break;
            if (0 > c ? 0 >= g : g >= e.height) {
                h.hitSide = !0;
                break
            }
            g += 5 * c
        }
        return h
    }

    function u(a, b, c, d) {
        m.defaults[a] = b;
        c && (Ga[a] = d ? function (a, b, d) {
            d != xd && c(a, b, d)
        } : c)
    }

    function Pf(a) {
        for (var b = a.split(/-(?!$)/), a = b[b.length -
        1], c, d, e, f, g = 0; g < b.length - 1; g++) {
            var h = b[g];
            if (/^(cmd|meta|m)$/i.test(h))f = !0; else if (/^a(lt)?$/i.test(h))c = !0; else if (/^(c|ctrl|control)$/i.test(h))d = !0; else if (/^s(hift)$/i.test(h))e = !0; else throw Error("Unrecognized modifier name: " + h);
        }
        c && (a = "Alt-" + a);
        d && (a = "Ctrl-" + a);
        f && (a = "Cmd-" + a);
        e && (a = "Shift-" + a);
        return a
    }

    function kc(a) {
        return "string" == typeof a ? qa[a] : a
    }

    function Sa(a, b, c, d, e) {
        if (d && d.shared)return Qf(a, b, c, d, e);
        if (a.cm && !a.cm.curOp)return B(a.cm, Sa)(a, b, c, d, e);
        var f = new Da(a, e), e = v(b, c);
        d &&
        S(d, f, !1);
        if (0 < e || 0 == e && !1 !== f.clearWhenEmpty)return f;
        f.replacedWith && (f.collapsed = !0, f.widgetNode = q("span", [f.replacedWith], "CodeMirror-widget"), d.handleMouseEvents || f.widgetNode.setAttribute("cm-ignore-events", "true"), d.insertLeft && (f.widgetNode.insertLeft = !0));
        if (f.collapsed) {
            if (Ie(a, b.line, b, c, f) || b.line != c.line && Ie(a, c.line, b, c, f))throw Error("Inserting collapsed marker partially overlapping an existing one");
            na = !0
        }
        f.addToHistory && Ae(a, {from: b, to: c, origin: "markText"}, a.sel, NaN);
        var g = b.line,
            h = a.cm, i;
        a.iter(g, c.line + 1, function (a) {
            h && (f.collapsed && !h.options.lineWrapping && da(a) == h.display.maxLine) && (i = true);
            f.collapsed && g != b.line && Z(a, 0);
            var d = new lc(f, g == b.line ? b.ch : null, g == c.line ? c.ch : null);
            a.markedSpans = a.markedSpans ? a.markedSpans.concat([d]) : [d];
            d.marker.attachLine(a);
            ++g
        });
        f.collapsed && a.iter(b.line, c.line + 1, function (b) {
            ua(a, b) && Z(b, 0)
        });
        f.clearOnEnter && p(f, "beforeCursorEnter", function () {
            f.clear()
        });
        f.readOnly && (ye = !0, (a.history.done.length || a.history.undone.length) && a.clearHistory());
        f.collapsed && (f.id = ++kd, f.atomic = !0);
        if (h) {
            i && (h.curOp.updateMaxLine = !0);
            if (f.collapsed)N(h, b.line, c.line + 1); else if (f.className || f.title || f.startStyle || f.endStyle || f.css)for (d = b.line; d <= c.line; d++)ja(h, d, "text");
            f.atomic && Zd(h.doc);
            H(h, "markerAdded", h, f)
        }
        return f
    }

    function Qf(a, b, c, d, e) {
        d = S(d);
        d.shared = !1;
        var f = [Sa(a, b, c, d, e)], g = f[0], h = d.widgetNode;
        Ca(a, function (a) {
            h && (d.widgetNode = h.cloneNode(!0));
            f.push(Sa(a, t(a, b), t(a, c), d, e));
            for (var j = 0; j < a.linked.length; ++j)if (a.linked[j].isParent)return;
            g =
                x(f)
        });
        return new mc(f, g)
    }

    function Je(a) {
        return a.findMarks(o(a.first, 0), a.clipPos(o(a.lastLine())), function (a) {
            return a.parent
        })
    }

    function Rf(a) {
        for (var b = 0; b < a.length; b++) {
            var c = a[b], d = [c.primary.doc];
            Ca(c.primary.doc, function (a) {
                d.push(a)
            });
            for (var e = 0; e < c.markers.length; e++) {
                var f = c.markers[e];
                -1 == G(d, f.doc) && (f.parent = null, c.markers.splice(e--, 1))
            }
        }
    }

    function lc(a, b, c) {
        this.marker = a;
        this.from = b;
        this.to = c
    }

    function vb(a, b) {
        if (a)for (var c = 0; c < a.length; ++c) {
            var d = a[c];
            if (d.marker == b)return d
        }
    }

    function fd(a,
                b) {
        if (b.full)return null;
        var c = mb(a, b.from.line) && r(a, b.from.line).markedSpans, d = mb(a, b.to.line) && r(a, b.to.line).markedSpans;
        if (!c && !d)return null;
        var e = b.from.ch, f = b.to.ch, g = 0 == v(b.from, b.to);
        if (c)for (var h = 0, i; h < c.length; ++h) {
            var j = c[h], k = j.marker;
            if (null == j.from || (k.inclusiveLeft ? j.from <= e : j.from < e) || j.from == e && "bookmark" == k.type && (!g || !j.marker.insertLeft)) {
                var n = null == j.to || (k.inclusiveRight ? j.to >= e : j.to > e);
                (i || (i = [])).push(new lc(k, j.from, n ? null : j.to))
            }
        }
        c = i;
        if (d)for (var h = 0, l; h < d.length; ++h)if (i =
                d[h], j = i.marker, null == i.to || (j.inclusiveRight ? i.to >= f : i.to > f) || i.from == f && "bookmark" == j.type && (!g || i.marker.insertLeft))k = null == i.from || (j.inclusiveLeft ? i.from <= f : i.from < f), (l || (l = [])).push(new lc(j, k ? null : i.from - f, null == i.to ? null : i.to - f));
        d = l;
        g = 1 == b.text.length;
        l = x(b.text).length + (g ? e : 0);
        if (c)for (f = 0; f < c.length; ++f)h = c[f], null == h.to && ((i = vb(d, h.marker)) ? g && (h.to = null == i.to ? null : i.to + l) : h.to = e);
        if (d)for (f = 0; f < d.length; ++f)(h = d[f], null != h.to && (h.to += l), null == h.from) ? (i = vb(c, h.marker), i || (h.from = l,
        g && (c || (c = [])).push(h))) : (h.from += l, g && (c || (c = [])).push(h));
        c && (c = Ke(c));
        d && d != c && (d = Ke(d));
        e = [c];
        if (!g) {
            var g = b.text.length - 2, s;
            if (0 < g && c)for (f = 0; f < c.length; ++f)null == c[f].to && (s || (s = [])).push(new lc(c[f].marker, null, null));
            for (f = 0; f < g; ++f)e.push(s);
            e.push(d)
        }
        return e
    }

    function Ke(a) {
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            null != c.from && (c.from == c.to && !1 !== c.marker.clearWhenEmpty) && a.splice(b--, 1)
        }
        return !a.length ? null : a
    }

    function Ce(a, b) {
        var c;
        if (c = b["spans_" + a.id]) {
            for (var d = 0, e = []; d < b.text.length; ++d)e.push(Sf(c[d]));
            c = e
        } else c = null;
        d = fd(a, b);
        if (!c)return d;
        if (!d)return c;
        for (e = 0; e < c.length; ++e) {
            var f = c[e], g = d[e];
            if (f && g) {
                var h = 0;
                a:for (; h < g.length; ++h) {
                    for (var i = g[h], j = 0; j < f.length; ++j)if (f[j].marker == i.marker)continue a;
                    f.push(i)
                }
            } else g && (c[e] = g)
        }
        return c
    }

    function Nf(a, b, c) {
        var d = null;
        a.iter(b.line, c.line + 1, function (a) {
            if (a.markedSpans)for (var b = 0; b < a.markedSpans.length; ++b) {
                var c = a.markedSpans[b].marker;
                if (c.readOnly && (!d || -1 == G(d, c)))(d || (d = [])).push(c)
            }
        });
        if (!d)return null;
        a = [{from: b, to: c}];
        for (b = 0; b < d.length; ++b)for (var c =
            d[b], e = c.find(0), f = 0; f < a.length; ++f) {
            var g = a[f];
            if (!(0 > v(g.to, e.from) || 0 < v(g.from, e.to))) {
                var h = [f, 1], i = v(g.from, e.from), j = v(g.to, e.to);
                (0 > i || !c.inclusiveLeft && !i) && h.push({from: g.from, to: e.from});
                (0 < j || !c.inclusiveRight && !j) && h.push({from: e.to, to: g.to});
                a.splice.apply(a, h);
                f += h.length - 1
            }
        }
        return a
    }

    function Le(a) {
        var b = a.markedSpans;
        if (b) {
            for (var c = 0; c < b.length; ++c)b[c].marker.detachLine(a);
            a.markedSpans = null
        }
    }

    function Me(a, b) {
        if (b) {
            for (var c = 0; c < b.length; ++c)b[c].marker.attachLine(a);
            a.markedSpans =
                b
        }
    }

    function Ne(a, b) {
        var c = a.lines.length - b.lines.length;
        if (0 != c)return c;
        var c = a.find(), d = b.find(), e = v(c.from, d.from) || (a.inclusiveLeft ? -1 : 0) - (b.inclusiveLeft ? -1 : 0);
        return e ? -e : (c = v(c.to, d.to) || (a.inclusiveRight ? 1 : 0) - (b.inclusiveRight ? 1 : 0)) ? c : b.id - a.id
    }

    function wa(a, b) {
        var c = na && a.markedSpans, d;
        if (c)for (var e, f = 0; f < c.length; ++f)if (e = c[f], e.marker.collapsed && null == (b ? e.from : e.to) && (!d || 0 > Ne(d, e.marker)))d = e.marker;
        return d
    }

    function Ie(a, b, c, d, e) {
        a = r(a, b);
        if (a = na && a.markedSpans)for (b = 0; b < a.length; ++b) {
            var f =
                a[b];
            if (f.marker.collapsed) {
                var g = f.marker.find(0), h = v(g.from, c) || (f.marker.inclusiveLeft ? -1 : 0) - (e.inclusiveLeft ? -1 : 0), i = v(g.to, d) || (f.marker.inclusiveRight ? 1 : 0) - (e.inclusiveRight ? 1 : 0);
                if (!(0 <= h && 0 >= i || 0 >= h && 0 <= i))if (0 >= h && (0 < v(g.to, c) || f.marker.inclusiveRight && e.inclusiveLeft) || 0 <= h && (0 > v(g.from, d) || f.marker.inclusiveLeft && e.inclusiveRight))return !0
            }
        }
    }

    function da(a) {
        for (var b; b = wa(a, !0);)a = b.find(-1, !0).line;
        return a
    }

    function Fc(a, b) {
        var c = r(a, b), d = da(c);
        return c == d ? b : C(d)
    }

    function Dd(a, b) {
        if (b >
            a.lastLine())return b;
        var c = r(a, b), d;
        if (!ua(a, c))return b;
        for (; d = wa(c, !1);)c = d.find(1, !0).line;
        return C(c) + 1
    }

    function ua(a, b) {
        var c = na && b.markedSpans;
        if (c)for (var d, e = 0; e < c.length; ++e)if (d = c[e], d.marker.collapsed && (null == d.from || !d.marker.widgetNode && 0 == d.from && d.marker.inclusiveLeft && ld(a, b, d)))return !0
    }

    function ld(a, b, c) {
        if (null == c.to)return b = c.marker.find(1, !0), ld(a, b.line, vb(b.line.markedSpans, c.marker));
        if (c.marker.inclusiveRight && c.to == b.text.length)return !0;
        for (var d, e = 0; e < b.markedSpans.length; ++e)if (d =
                b.markedSpans[e], d.marker.collapsed && !d.marker.widgetNode && d.from == c.to && (null == d.to || d.to != c.from) && (d.marker.inclusiveLeft || c.marker.inclusiveRight) && ld(a, b, d))return !0
    }

    function Oe(a, b, c) {
        ga(b) < (a.curOp && a.curOp.scrollTop || a.doc.scrollTop) && id(a, null, c)
    }

    function qb(a) {
        if (null != a.height)return a.height;
        var b = a.doc.cm;
        if (!b)return 0;
        if (!Oc(document.body, a.node)) {
            var c = "position: relative;";
            a.coverGutter && (c += "margin-left: -" + b.display.gutters.offsetWidth + "px;");
            a.noHScroll && (c += "width: " + b.display.wrapper.clientWidth +
                "px;");
            R(b.display.measure, q("div", [a.node], null, c))
        }
        return a.height = a.node.offsetHeight
    }

    function Tf(a, b, c, d) {
        var e = new nc(a, c, d), f = a.cm;
        f && e.noHScroll && (f.display.alignWidgets = !0);
        ic(a, b, "widget", function (b) {
            var c = b.widgets || (b.widgets = []);
            e.insertAt == null ? c.push(e) : c.splice(Math.min(c.length - 1, Math.max(0, e.insertAt)), 0, e);
            e.line = b;
            if (f && !ua(a, b)) {
                c = ga(b) < a.scrollTop;
                Z(b, b.height + qb(e));
                c && id(f, null, e.height);
                f.curOp.forceUpdate = true
            }
            return true
        });
        return e
    }

    function Pe(a, b) {
        if (a)for (; ;) {
            var c = a.match(/(?:^|\s+)line-(background-)?(\S+)/);
            if (!c)break;
            var a = a.slice(0, c.index) + a.slice(c.index + c[0].length), d = c[1] ? "bgClass" : "textClass";
            null == b[d] ? b[d] = c[2] : RegExp("(?:^|s)" + c[2] + "(?:$|s)").test(b[d]) || (b[d] += " " + c[2])
        }
        return a
    }

    function Qe(a, b) {
        if (a.blankLine)return a.blankLine(b);
        if (a.innerMode) {
            var c = m.innerMode(a, b);
            if (c.mode.blankLine)return c.mode.blankLine(c.state)
        }
    }

    function md(a, b, c, d) {
        for (var e = 0; 10 > e; e++) {
            d && (d[0] = m.innerMode(a, c).mode);
            var f = a.token(b, c);
            if (b.pos > b.start)return f
        }
        throw Error("Mode " + a.name + " failed to advance stream.");
    }

    function Re(a, b, c, d) {
        function e(a) {
            return {start: k.start, end: k.pos, string: k.current(), type: h || null, state: a ? Oa(f.mode, j) : j}
        }

        var f = a.doc, g = f.mode, h, b = t(f, b), i = r(f, b.line), j = ob(a, b.line, c), k = new oc(i.text, a.options.tabSize), n;
        for (d && (n = []); (d || k.pos < b.ch) && !k.eol();)k.start = k.pos, h = md(g, k, j), d && n.push(e(!0));
        return d ? n : e()
    }

    function Se(a, b, c, d, e, f, g) {
        var h = c.flattenSpans;
        null == h && (h = a.options.flattenSpans);
        var i = 0, j = null, k = new oc(b, a.options.tabSize), n, l = a.options.addModeClass && [null];
        for ("" == b && Pe(Qe(c,
            d), f); !k.eol();) {
            k.pos > a.options.maxHighlightLength ? (h = !1, g && Rc(a, b, d, k.pos), k.pos = b.length, n = null) : n = Pe(md(c, k, d, l), f);
            if (l) {
                var s = l[0].name;
                s && (n = "m-" + (n ? s + " " + n : s))
            }
            if (!h || j != n) {
                for (; i < k.start;)i = Math.min(k.start, i + 5E4), e(i, j);
                j = n
            }
            k.start = k.pos
        }
        for (; i < k.pos;)a = Math.min(k.pos, i + 5E4), e(a, j), i = a
    }

    function be(a, b, c, d) {
        var e = [a.state.modeGen], f = {};
        Se(a, b.text, a.doc.mode, c, function (a, b) {
            e.push(a, b)
        }, f, d);
        for (c = 0; c < a.state.overlays.length; ++c) {
            var g = a.state.overlays[c], h = 1, i = 0;
            Se(a, b.text, g.mode, !0, function (a,
                                                b) {
                for (var c = h; i < a;) {
                    var d = e[h];
                    d > a && e.splice(h, 1, a, e[h + 1], d);
                    h = h + 2;
                    i = Math.min(a, d)
                }
                if (b)if (g.opaque) {
                    e.splice(c, h - c, a, "cm-overlay " + b);
                    h = c + 2
                } else for (; c < h; c = c + 2) {
                    d = e[c + 1];
                    e[c + 1] = (d ? d + " " : "") + "cm-overlay " + b
                }
            }, f)
        }
        return {styles: e, classes: f.bgClass || f.textClass ? f : null}
    }

    function Te(a, b, c) {
        if (!b.styles || b.styles[0] != a.state.modeGen) {
            var d = be(a, b, b.stateAfter = ob(a, C(b)));
            b.styles = d.styles;
            d.classes ? b.styleClasses = d.classes : b.styleClasses && (b.styleClasses = null);
            c === a.doc.frontier && a.doc.frontier++
        }
        return b.styles
    }

    function Rc(a, b, c, d) {
        var e = a.doc.mode, f = new oc(b, a.options.tabSize);
        f.start = f.pos = d || 0;
        for ("" == b && Qe(e, c); !f.eol() && f.pos <= a.options.maxHighlightLength;)md(e, f, c), f.start = f.pos
    }

    function Ue(a, b) {
        if (!a || /^\s*$/.test(a))return null;
        var c = b.addModeClass ? Uf : Vf;
        return c[a] || (c[a] = a.replace(/\S+/g, "cm-$&"))
    }

    function Kd(a, b) {
        var c = q("span", null, null, E ? "padding-right: .1px" : null), c = {
            pre: q("pre", [c]),
            content: c,
            col: 0,
            pos: 0,
            cm: a,
            splitSpaces: (y || E) && a.getOption("lineWrapping")
        };
        b.measure = {};
        for (var d = 0; d <= (b.rest ?
            b.rest.length : 0); d++) {
            var e = d ? b.rest[d - 1] : b.line, f;
            c.pos = 0;
            c.addToken = Wf;
            var g;
            if (null != nd)g = nd; else {
                g = R(a.display.measure, document.createTextNode("AخA"));
                var h = Aa(g, 0, 1).getBoundingClientRect();
                g = !h || h.left == h.right ? !1 : nd = 3 > Aa(g, 1, 2).getBoundingClientRect().right - h.right
            }
            if (g && (f = V(e)))c.addToken = Xf(c.addToken, f);
            c.map = [];
            h = b != a.display.externalMeasured && C(e);
            a:{
                g = c;
                var h = Te(a, e, h), i = e.markedSpans, j = e.text, k = 0;
                if (i)for (var n = j.length, l = 0, s = 1, m = "", o = void 0, r = void 0, p = 0, t = void 0, u = void 0, v = void 0,
                               x = void 0, w = void 0; ;) {
                    if (p == l) {
                        for (var t = u = v = x = r = "", w = null, p = Infinity, z = [], B = 0; B < i.length; ++B) {
                            var D = i[B], A = D.marker;
                            if ("bookmark" == A.type && D.from == l && A.widgetNode)z.push(A); else if (D.from <= l && (null == D.to || D.to > l || A.collapsed && D.to == l && D.from == l)) {
                                if (null != D.to && (D.to != l && p > D.to) && (p = D.to, u = ""), A.className && (t += " " + A.className), A.css && (r = A.css), A.startStyle && D.from == l && (v += " " + A.startStyle), A.endStyle && D.to == p && (u += " " + A.endStyle), A.title && !x && (x = A.title), A.collapsed && (!w || 0 > Ne(w.marker, A)))w = D
                            } else D.from >
                            l && p > D.from && (p = D.from)
                        }
                        if (w && (w.from || 0) == l) {
                            Ve(g, (null == w.to ? n + 1 : w.to) - l, w.marker, null == w.from);
                            if (null == w.to)break a;
                            w.to == l && (w = !1)
                        }
                        if (!w && z.length)for (B = 0; B < z.length; ++B)Ve(g, 0, z[B])
                    }
                    if (l >= n)break;
                    for (z = Math.min(n, p); ;) {
                        if (m) {
                            B = l + m.length;
                            w || (D = B > z ? m.slice(0, z - l) : m, g.addToken(g, D, o ? o + t : t, v, l + D.length == p ? u : "", x, r));
                            if (B >= z) {
                                m = m.slice(z - l);
                                l = z;
                                break
                            }
                            l = B;
                            v = ""
                        }
                        m = j.slice(k, k = h[s++]);
                        o = Ue(h[s++], g.cm.options)
                    }
                } else for (var s = 1; s < h.length; s += 2)g.addToken(g, j.slice(k, k = h[s]), Ue(h[s + 1], g.cm.options))
            }
            if (e.styleClasses &&
                (e.styleClasses.bgClass && (c.bgClass = od(e.styleClasses.bgClass, c.bgClass || "")), e.styleClasses.textClass))c.textClass = od(e.styleClasses.textClass, c.textClass || "");
            0 == c.map.length && c.map.push(0, 0, c.content.appendChild(Yf(a.display.measure)));
            0 == d ? (b.measure.map = c.map, b.measure.cache = {}) : ((b.measure.maps || (b.measure.maps = [])).push(c.map), (b.measure.caches || (b.measure.caches = [])).push({}))
        }
        E && /\bcm-tab\b/.test(c.content.lastChild.className) && (c.content.className = "cm-tab-wrap-hack");
        F(a, "renderLine", a,
            b.line, c.pre);
        c.pre.className && (c.textClass = od(c.pre.className, c.textClass || ""));
        return c
    }

    function Wf(a, b, c, d, e, f, g) {
        if (b) {
            var h = a.splitSpaces ? b.replace(/ {3,}/g, Zf) : b, i = a.cm.state.specialChars, j = !1;
            if (i.test(b))for (var k = document.createDocumentFragment(), n = 0; ;) {
                i.lastIndex = n;
                var l = i.exec(b), s = l ? l.index - n : b.length - n;
                if (s) {
                    var m = document.createTextNode(h.slice(n, n + s));
                    y && 9 > z ? k.appendChild(q("span", [m])) : k.appendChild(m);
                    a.map.push(a.pos, a.pos + s, m);
                    a.col += s;
                    a.pos += s
                }
                if (!l)break;
                n += s + 1;
                "\t" == l[0] ? (m =
                    a.cm.options.tabSize, l = m - a.col % m, m = k.appendChild(q("span", Fe(l), "cm-tab")), m.setAttribute("role", "presentation"), m.setAttribute("cm-text", "\t"), a.col += l) : (m = a.cm.options.specialCharPlaceholder(l[0]), m.setAttribute("cm-text", l[0]), y && 9 > z ? k.appendChild(q("span", [m])) : k.appendChild(m), a.col += 1);
                a.map.push(a.pos, a.pos + 1, m);
                a.pos++
            } else {
                a.col += b.length;
                var k = document.createTextNode(h);
                a.map.push(a.pos, a.pos + b.length, k);
                y && 9 > z && (j = !0);
                a.pos += b.length
            }
            if (c || d || e || j || g)return b = c || "", d && (b += d), e && (b += e),
                d = q("span", [k], b, g), f && (d.title = f), a.content.appendChild(d);
            a.content.appendChild(k)
        }
    }

    function Zf(a) {
        for (var b = " ", c = 0; c < a.length - 2; ++c)b += c % 2 ? " " : " ";
        return b + " "
    }

    function Xf(a, b) {
        return function (c, d, e, f, g, h, i) {
            for (var e = e ? e + " cm-force-border" : "cm-force-border", j = c.pos, k = j + d.length; ;) {
                for (var n = 0; n < b.length; n++) {
                    var l = b[n];
                    if (l.to > j && l.from <= j)break
                }
                if (l.to >= k)return a(c, d, e, f, g, h, i);
                a(c, d.slice(0, l.to - j), e, f, null, h, i);
                f = null;
                d = d.slice(l.to - j);
                j = l.to
            }
        }
    }

    function Ve(a, b, c, d) {
        var e = !d && c.widgetNode;
        e && a.map.push(a.pos, a.pos + b, e);
        !d && a.cm.display.input.needsContentAttribute && (e || (e = a.content.appendChild(document.createElement("span"))), e.setAttribute("cm-marker", c.id));
        e && (a.cm.display.input.setUneditable(e), a.content.appendChild(e));
        a.pos += b
    }

    function Ee(a, b) {
        return 0 == b.from.ch && 0 == b.to.ch && "" == x(b.text) && (!a.cm || a.cm.options.wholeLineUpdateBefore)
    }

    function hd(a, b, c, d) {
        function e(a) {
            return c ? c[a] : null
        }

        function f(a, c, e) {
            var f = d;
            a.text = c;
            a.stateAfter && (a.stateAfter = null);
            a.styles && (a.styles = null);
            null != a.order && (a.order = null);
            Le(a);
            Me(a, e);
            c = f ? f(a) : 1;
            c != a.height && Z(a, c);
            H(a, "change", a, b)
        }

        function g(a, b) {
            for (var c = a, f = []; c < b; ++c)f.push(new wb(j[c], e(c), d));
            return f
        }

        var h = b.from, i = b.to, j = b.text, k = r(a, h.line), n = r(a, i.line), l = x(j), s = e(j.length - 1), m = i.line - h.line;
        if (b.full)a.insert(0, g(0, j.length)), a.remove(j.length, a.size - j.length); else if (Ee(a, b)) {
            var o = g(0, j.length - 1);
            f(n, n.text, s);
            m && a.remove(h.line, m);
            o.length && a.insert(h.line, o)
        } else k == n ? 1 == j.length ? f(k, k.text.slice(0, h.ch) + l + k.text.slice(i.ch),
            s) : (o = g(1, j.length - 1), o.push(new wb(l + k.text.slice(i.ch), s, d)), f(k, k.text.slice(0, h.ch) + j[0], e(0)), a.insert(h.line + 1, o)) : 1 == j.length ? (f(k, k.text.slice(0, h.ch) + j[0] + n.text.slice(i.ch), e(0)), a.remove(h.line + 1, m)) : (f(k, k.text.slice(0, h.ch) + j[0], e(0)), f(n, l + n.text.slice(i.ch), s), o = g(1, j.length - 1), 1 < m && a.remove(h.line + 1, m - 1), a.insert(h.line + 1, o));
        H(a, "change", a, b)
    }

    function xb(a) {
        this.lines = a;
        this.parent = null;
        for (var b = 0, c = 0; b < a.length; ++b)a[b].parent = this, c += a[b].height;
        this.height = c
    }

    function yb(a) {
        this.children =
            a;
        for (var b = 0, c = 0, d = 0; d < a.length; ++d) {
            var e = a[d], b = b + e.chunkSize(), c = c + e.height;
            e.parent = this
        }
        this.size = b;
        this.height = c;
        this.parent = null
    }

    function Ca(a, b, c) {
        function d(a, f, g) {
            if (a.linked)for (var h = 0; h < a.linked.length; ++h) {
                var i = a.linked[h];
                if (i.doc != f) {
                    var j = g && i.sharedHist;
                    if (!c || j)b(i.doc, j), d(i.doc, a, j)
                }
            }
        }

        d(a, null, !0)
    }

    function wd(a, b) {
        if (b.cm)throw Error("This document is already in use.");
        a.doc = b;
        b.cm = a;
        vc(a);
        uc(a);
        a.options.lineWrapping || yc(a);
        a.options.mode = b.modeOption;
        N(a)
    }

    function r(a, b) {
        b -=
            a.first;
        if (0 > b || b >= a.size)throw Error("There is no line " + (b + a.first) + " in the document.");
        for (var c = a; !c.lines;)for (var d = 0; ; ++d) {
            var e = c.children[d], f = e.chunkSize();
            if (b < f) {
                c = e;
                break
            }
            b -= f
        }
        return c.lines[b]
    }

    function za(a, b, c) {
        var d = [], e = b.line;
        a.iter(b.line, c.line + 1, function (a) {
            a = a.text;
            e == c.line && (a = a.slice(0, c.ch));
            e == b.line && (a = a.slice(b.ch));
            d.push(a);
            ++e
        });
        return d
    }

    function pd(a, b, c) {
        var d = [];
        a.iter(b, c, function (a) {
            d.push(a.text)
        });
        return d
    }

    function Z(a, b) {
        var c = b - a.height;
        if (c)for (var d = a; d; d =
            d.parent)d.height += c
    }

    function C(a) {
        if (null == a.parent)return null;
        for (var b = a.parent, a = G(b.lines, a), c = b.parent; c; b = c, c = c.parent)for (var d = 0; c.children[d] != b; ++d)a += c.children[d].chunkSize();
        return a + b.first
    }

    function xa(a, b) {
        var c = a.first;
        a:do {
            for (var d = 0; d < a.children.length; ++d) {
                var e = a.children[d], f = e.height;
                if (b < f) {
                    a = e;
                    continue a
                }
                b -= f;
                c += e.chunkSize()
            }
            return c
        } while (!a.lines);
        for (d = 0; d < a.lines.length; ++d) {
            e = a.lines[d].height;
            if (b < e)break;
            b -= e
        }
        return c + d
    }

    function ga(a) {
        for (var a = da(a), b = 0, c = a.parent,
                 d = 0; d < c.lines.length; ++d) {
            var e = c.lines[d];
            if (e == a)break; else b += e.height
        }
        for (a = c.parent; a; c = a, a = c.parent)for (d = 0; d < a.children.length && !(e = a.children[d], e == c); ++d)b += e.height;
        return b
    }

    function V(a) {
        var b = a.order;
        null == b && (b = a.order = $f(a.text));
        return b
    }

    function pc(a) {
        this.done = [];
        this.undone = [];
        this.undoDepth = Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOrigin = this.lastSelOrigin = this.lastOp = this.lastSelOp = null;
        this.generation = this.maxGeneration = a || 1
    }

    function gd(a, b) {
        var c = {
            from: o(b.from.line,
                b.from.ch), to: pa(b), text: za(a, b.from, b.to)
        };
        We(a, c, b.from.line, b.to.line + 1);
        Ca(a, function (a) {
            We(a, c, b.from.line, b.to.line + 1)
        }, !0);
        return c
    }

    function Vd(a) {
        for (; a.length;)if (x(a).ranges)a.pop(); else break
    }

    function Ae(a, b, c, d) {
        var e = a.history;
        e.undone.length = 0;
        var f = +new Date, g, h;
        if (h = e.lastOp == d || e.lastOrigin == b.origin && b.origin && ("+" == b.origin.charAt(0) && a.cm && e.lastModTime > f - a.cm.options.historyEventDelay || "*" == b.origin.charAt(0))) {
            var i;
            e.lastOp == d ? (Vd(e.done), i = x(e.done)) : e.done.length && !x(e.done).ranges ?
                i = x(e.done) : 1 < e.done.length && !e.done[e.done.length - 2].ranges && (e.done.pop(), i = x(e.done));
            h = g = i
        }
        if (h) {
            var j = x(g.changes);
            0 == v(b.from, b.to) && 0 == v(b.from, j.to) ? j.to = pa(b) : g.changes.push(gd(a, b))
        } else {
            g = x(e.done);
            (!g || !g.ranges) && Sb(a.sel, e.done);
            g = {changes: [gd(a, b)], generation: e.generation};
            for (e.done.push(g); e.done.length > e.undoDepth;)e.done.shift(), e.done[0].ranges || e.done.shift()
        }
        e.done.push(c);
        e.generation = ++e.maxGeneration;
        e.lastModTime = e.lastSelTime = f;
        e.lastOp = e.lastSelOp = d;
        e.lastOrigin = e.lastSelOrigin =
            b.origin;
        j || F(a, "historyAdded")
    }

    function Sb(a, b) {
        var c = x(b);
        (!c || !c.ranges || !c.equals(a)) && b.push(a)
    }

    function We(a, b, c, d) {
        var e = b["spans_" + a.id], f = 0;
        a.iter(Math.max(a.first, c), Math.min(a.first + a.size, d), function (c) {
            c.markedSpans && ((e || (e = b["spans_" + a.id] = {}))[f] = c.markedSpans);
            ++f
        })
    }

    function Sf(a) {
        if (!a)return null;
        for (var b = 0, c; b < a.length; ++b)a[b].marker.explicitlyCleared ? c || (c = a.slice(0, b)) : c && c.push(a[b]);
        return !c ? a : c.length ? c : null
    }

    function Ta(a, b, c) {
        for (var d = 0, e = []; d < a.length; ++d) {
            var f = a[d];
            if (f.ranges)e.push(c ? ha.prototype.deepCopy.call(f) : f); else {
                var f = f.changes, g = [];
                e.push({changes: g});
                for (var h = 0; h < f.length; ++h) {
                    var i = f[h], j;
                    g.push({from: i.from, to: i.to, text: i.text});
                    if (b)for (var k in i)if ((j = k.match(/^spans_(\d+)$/)) && -1 < G(b, Number(j[1])))x(g)[k] = i[k], delete i[k]
                }
            }
        }
        return e
    }

    function Xe(a, b, c, d) {
        c < a.line ? a.line += d : b < a.line && (a.line = b, a.ch = 0)
    }

    function Ye(a, b, c, d) {
        for (var e = 0; e < a.length; ++e) {
            var f = a[e], g = !0;
            if (f.ranges) {
                f.copied || (f = a[e] = f.deepCopy(), f.copied = !0);
                for (var h = 0; h < f.ranges.length; h++)Xe(f.ranges[h].anchor,
                    b, c, d), Xe(f.ranges[h].head, b, c, d)
            } else {
                for (h = 0; h < f.changes.length; ++h) {
                    var i = f.changes[h];
                    if (c < i.from.line)i.from = o(i.from.line + d, i.from.ch), i.to = o(i.to.line + d, i.to.ch); else if (b <= i.to.line) {
                        g = !1;
                        break
                    }
                }
                g || (a.splice(0, e + 1), e = 0)
            }
        }
    }

    function Be(a, b) {
        var c = b.from.line, d = b.to.line, e = b.text.length - (d - c) - 1;
        Ye(a.done, c, d, e);
        Ye(a.undone, c, d, e)
    }

    function cd(a) {
        return null != a.defaultPrevented ? a.defaultPrevented : !1 == a.returnValue
    }

    function pe(a) {
        var b = a.which;
        null == b && (a.button & 1 ? b = 1 : a.button & 2 ? b = 3 : a.button & 4 &&
        (b = 2));
        T && (a.ctrlKey && 1 == b) && (b = 3);
        return b
    }

    function H(a, b) {
        function c(a) {
            return function () {
                a.apply(null, e)
            }
        }

        var d = a._handlers && a._handlers[b];
        if (d) {
            var e = Array.prototype.slice.call(arguments, 2), f;
            Pa ? f = Pa.delayedCallbacks : zb ? f = zb : (f = zb = [], setTimeout(ag, 0));
            for (var g = 0; g < d.length; ++g)f.push(c(d[g]))
        }
    }

    function ag() {
        var a = zb;
        zb = null;
        for (var b = 0; b < a.length; ++b)a[b]()
    }

    function ea(a, b, c) {
        "string" == typeof b && (b = {
            type: b, preventDefault: function () {
                this.defaultPrevented = !0
            }
        });
        F(a, c || b.type, a, b);
        return cd(b) ||
            b.codemirrorIgnore
    }

    function Yd(a) {
        var b = a._handlers && a._handlers.cursorActivity;
        if (b)for (var a = a.curOp.cursorActivityHandlers || (a.curOp.cursorActivityHandlers = []), c = 0; c < b.length; ++c)-1 == G(a, b[c]) && a.push(b[c])
    }

    function P(a, b) {
        var c = a._handlers && a._handlers[b];
        return c && 0 < c.length
    }

    function Ua(a) {
        a.prototype.on = function (a, c) {
            p(this, a, c)
        };
        a.prototype.off = function (a, c) {
            fa(this, a, c)
        }
    }

    function Ya() {
        this.id = null
    }

    function qe(a, b, c) {
        for (var d = 0, e = 0; ;) {
            var f = a.indexOf("\t", d);
            -1 == f && (f = a.length);
            var g = f - d;
            if (f == a.length || e + g >= b)return d + Math.min(g, b - e);
            e += f - d;
            e += c - e % c;
            d = f + 1;
            if (e >= b)return d
        }
    }

    function Fe(a) {
        for (; qc.length <= a;)qc.push(x(qc) + " ");
        return qc[a]
    }

    function x(a) {
        return a[a.length - 1]
    }

    function G(a, b) {
        for (var c = 0; c < a.length; ++c)if (a[c] == b)return c;
        return -1
    }

    function kb(a, b) {
        for (var c = [], d = 0; d < a.length; d++)c[d] = b(a[d], d);
        return c
    }

    function Ab() {
    }

    function Ze(a, b) {
        var c;
        Object.create ? c = Object.create(a) : (Ab.prototype = a, c = new Ab);
        b && S(b, c);
        return c
    }

    function S(a, b, c) {
        b || (b = {});
        for (var d in a)if (a.hasOwnProperty(d) &&
            (!1 !== c || !b.hasOwnProperty(d)))b[d] = a[d];
        return b
    }

    function Za(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return function () {
            return a.apply(null, b)
        }
    }

    function jc(a, b) {
        return !b ? $e(a) : -1 < b.source.indexOf("\\w") && $e(a) ? !0 : b.test(a)
    }

    function af(a) {
        for (var b in a)if (a.hasOwnProperty(b) && a[b])return !1;
        return !0
    }

    function pb(a) {
        return 768 <= a.charCodeAt(0) && bg.test(a)
    }

    function q(a, b, c, d) {
        a = document.createElement(a);
        c && (a.className = c);
        d && (a.style.cssText = d);
        if ("string" == typeof b)a.appendChild(document.createTextNode(b));
        else if (b)for (c = 0; c < b.length; ++c)a.appendChild(b[c]);
        return a
    }

    function va(a) {
        for (var b = a.childNodes.length; 0 < b; --b)a.removeChild(a.firstChild);
        return a
    }

    function R(a, b) {
        return va(a).appendChild(b)
    }

    function aa() {
        return document.activeElement
    }

    function Bb(a) {
        return RegExp("(^|\\s)" + a + "(?:$|\\s)\\s*")
    }

    function od(a, b) {
        for (var c = a.split(" "), d = 0; d < c.length; d++)c[d] && !Bb(c[d]).test(b) && (b += " " + c[d]);
        return b
    }

    function bf(a) {
        if (document.body.getElementsByClassName)for (var b = document.body.getElementsByClassName("CodeMirror"),
                                                          c = 0; c < b.length; c++) {
            var d = b[c].CodeMirror;
            d && a(d)
        }
    }

    function mf() {
        var a;
        p(window, "resize", function () {
            null == a && (a = setTimeout(function () {
                a = null;
                bf(Bf)
            }, 100))
        });
        p(window, "blur", function () {
            bf($a)
        })
    }

    function Yf(a) {
        if (null == qd) {
            var b = q("span", "​");
            R(a, q("span", [b, document.createTextNode("x")]));
            0 != a.firstChild.offsetHeight && (qd = 1 >= b.offsetWidth && 2 < b.offsetHeight && !(y && 8 > z))
        }
        a = qd ? q("span", "​") : q("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
        a.setAttribute("cm-text", "");
        return a
    }

    function tf(a, b, c, d) {
        if (!a)return d(b, c, "ltr");
        for (var e = !1, f = 0; f < a.length; ++f) {
            var g = a[f];
            if (g.from < c && g.to > b || b == c && g.to == b)d(Math.max(g.from, b), Math.min(g.to, c), 1 == g.level ? "rtl" : "ltr"), e = !0
        }
        e || d(b, c, "ltr")
    }

    function Wc(a) {
        return a.level % 2 ? a.from : a.to
    }

    function Xb(a) {
        return (a = V(a)) ? a[0].level % 2 ? a[0].to : a[0].from : 0
    }

    function Yb(a) {
        var b = V(a);
        return !b ? a.text.length : Wc(x(b))
    }

    function cf(a, b) {
        var c = r(a.doc, b), d = da(c);
        d != c && (b = C(d));
        c = V(d);
        d = !c ? 0 : c[0].level % 2 ? Yb(d) : Xb(d);
        return o(b, d)
    }

    function df(a, b) {
        var c =
            cf(a, b.line), d = r(a.doc, c.line), e = V(d);
        return !e || 0 == e[0].level ? (d = Math.max(0, d.text.search(/\S/)), o(c.line, b.line == c.line && b.ch <= d && b.ch ? 0 : d)) : c
    }

    function Ob(a, b) {
        rb = null;
        for (var c = 0, d; c < a.length; ++c) {
            var e = a[c];
            if (e.from < b && e.to > b)return c;
            if (e.from == b || e.to == b)if (null == d)d = c; else {
                var f;
                f = e.level;
                var g = a[d].level, h = a[0].level;
                f = f == h ? !0 : g == h ? !1 : f < g;
                if (f)return e.from != e.to && (rb = d), c;
                e.from != e.to && (rb = c);
                break
            }
        }
        return d
    }

    function rd(a, b, c, d) {
        if (!d)return b + c;
        do b += c; while (0 < b && pb(a.text.charAt(b)));
        return b
    }

    function Yc(a, b, c, d) {
        var e = V(a);
        if (!e)return Ge(a, b, c, d);
        for (var f = Ob(e, b), g = e[f], b = rd(a, b, g.level % 2 ? -c : c, d); ;) {
            if (b > g.from && b < g.to)return b;
            if (b == g.from || b == g.to) {
                if (Ob(e, b) == f)return b;
                g = e[f + c];
                return 0 < c == g.level % 2 ? g.to : g.from
            }
            g = e[f += c];
            if (!g)return null;
            b = 0 < c == g.level % 2 ? rd(a, g.to, -1, d) : rd(a, g.from, 1, d)
        }
    }

    function Ge(a, b, c, d) {
        b += c;
        if (d)for (; 0 < b && pb(a.text.charAt(b));)b += c;
        return 0 > b || b > a.text.length ? null : b
    }

    var sa = /gecko\/\d/i.test(navigator.userAgent), ef = /MSIE \d/.test(navigator.userAgent), ff = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent),
        y = ef || ff, z = y && (ef ? document.documentMode || 6 : ff[1]), E = /WebKit\//.test(navigator.userAgent), cg = E && /Qt\/\d+\.\d+/.test(navigator.userAgent), dg = /Chrome\//.test(navigator.userAgent), Y = /Opera\//.test(navigator.userAgent), le = /Apple Computer/.test(navigator.vendor), eg = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent), zf = /PhantomJS/.test(navigator.userAgent), Ma = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent), Xa = Ma || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),
        T = Ma || /Mac/.test(navigator.platform), fg = /win/i.test(navigator.platform), Ea = Y && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
    Ea && (Ea = Number(Ea[1]));
    Ea && 15 <= Ea && (Y = !1, E = !0);
    var gf = T && (cg || Y && (null == Ea || 12.11 > Ea)), $c = sa || y && 9 <= z, ye = !1, na = !1;
    zc.prototype = S({
            update: function (a) {
                var b = a.scrollWidth > a.clientWidth + 1, c = a.scrollHeight > a.clientHeight + 1, d = a.nativeBarWidth;
                if (c) {
                    this.vert.style.display = "block";
                    this.vert.style.bottom = b ? d + "px" : "0";
                    this.vert.firstChild.style.height = Math.max(0, a.scrollHeight - a.clientHeight +
                            (a.viewHeight - (b ? d : 0))) + "px"
                } else {
                    this.vert.style.display = "";
                    this.vert.firstChild.style.height = "0"
                }
                if (b) {
                    this.horiz.style.display = "block";
                    this.horiz.style.right = c ? d + "px" : "0";
                    this.horiz.style.left = a.barLeft + "px";
                    this.horiz.firstChild.style.width = a.scrollWidth - a.clientWidth + (a.viewWidth - a.barLeft - (c ? d : 0)) + "px"
                } else {
                    this.horiz.style.display = "";
                    this.horiz.firstChild.style.width = "0"
                }
                if (!this.checkedOverlay && a.clientHeight > 0) {
                    d == 0 && this.overlayHack();
                    this.checkedOverlay = true
                }
                return {
                    right: c ? d : 0, bottom: b ?
                        d : 0
                }
            }, setScrollLeft: function (a) {
                if (this.horiz.scrollLeft != a)this.horiz.scrollLeft = a
            }, setScrollTop: function (a) {
                if (this.vert.scrollTop != a)this.vert.scrollTop = a
            }, overlayHack: function () {
                this.horiz.style.minHeight = this.vert.style.minWidth = T && !eg ? "12px" : "18px";
                var a = this, b = function (b) {
                    (b.target || b.srcElement) != a.vert && (b.target || b.srcElement) != a.horiz && B(a.cm, he)(b)
                };
                p(this.vert, "mousedown", b);
                p(this.horiz, "mousedown", b)
            }, clear: function () {
                var a = this.horiz.parentNode;
                a.removeChild(this.horiz);
                a.removeChild(this.vert)
            }
        },
        zc.prototype);
    Ac.prototype = S({
        update: function () {
            return {bottom: 0, right: 0}
        }, setScrollLeft: function () {
        }, setScrollTop: function () {
        }, clear: function () {
        }
    }, Ac.prototype);
    m.scrollbarModel = {"native": zc, "null": Ac};
    Ib.prototype.signal = function (a, b) {
        P(a, b) && this.events.push(arguments)
    };
    Ib.prototype.finish = function () {
        for (var a = 0; a < this.events.length; a++)F.apply(null, this.events[a])
    };
    var o = m.Pos = function (a, b) {
        if (!(this instanceof o))return new o(a, b);
        this.line = a;
        this.ch = b
    }, v = m.cmpPos = function (a, b) {
        return a.line -
            b.line || a.ch - b.ch
    }, U = null;
    Lc.prototype = S({
        init: function (a) {
            function b(a) {
                if (d.somethingSelected()) {
                    U = d.getSelections();
                    if (c.inaccurateSelection) {
                        c.prevInput = "";
                        c.inaccurateSelection = false;
                        f.value = U.join("\n");
                        Va(f)
                    }
                } else if (d.options.lineWiseCopyCut) {
                    var b = Nd(d);
                    U = b.text;
                    if (a.type == "cut")d.setSelections(b.ranges, null, ca); else {
                        c.prevInput = "";
                        f.value = b.text.join("\n");
                        Va(f)
                    }
                } else return;
                if (a.type == "cut")d.state.cutIncoming = true
            }

            var c = this, d = this.cm, e = this.wrapper = Pd(), f = this.textarea = e.firstChild;
            a.wrapper.insertBefore(e,
                a.wrapper.firstChild);
            if (Ma)f.style.width = "0px";
            p(f, "input", function () {
                if (y && z >= 9 && c.hasSelection)c.hasSelection = null;
                c.poll()
            });
            p(f, "paste", function () {
                if (E && !d.state.fakedLastChar && !(new Date - d.state.lastMiddleDown < 200)) {
                    var a = f.selectionStart, b = f.selectionEnd;
                    f.value = f.value + "$";
                    f.selectionEnd = b;
                    f.selectionStart = a;
                    d.state.fakedLastChar = true
                }
                d.state.pasteIncoming = true;
                c.fastPoll()
            });
            p(f, "cut", b);
            p(f, "copy", b);
            p(a.scroller, "paste", function (b) {
                if (!ka(a, b)) {
                    d.state.pasteIncoming = true;
                    c.focus()
                }
            });
            p(a.lineSpace,
                "selectstart", function (b) {
                    ka(a, b) || L(b)
                });
            p(f, "compositionstart", function () {
                var a = d.getCursor("from");
                c.composing = {start: a, range: d.markText(a, d.getCursor("to"), {className: "CodeMirror-composing"})}
            });
            p(f, "compositionend", function () {
                if (c.composing) {
                    c.poll();
                    c.composing.range.clear();
                    c.composing = null
                }
            })
        }, prepareSelection: function () {
            var a = this.cm, b = a.display, c = a.doc, d = $d(a);
            if (a.options.moveInputWithCursor) {
                var a = ia(a, c.sel.primary().head, "div"), c = b.wrapper.getBoundingClientRect(), e = b.lineDiv.getBoundingClientRect();
                d.teTop = Math.max(0, Math.min(b.wrapper.clientHeight - 10, a.top + e.top - c.top));
                d.teLeft = Math.max(0, Math.min(b.wrapper.clientWidth - 10, a.left + e.left - c.left))
            }
            return d
        }, showSelection: function (a) {
            var b = this.cm.display;
            R(b.cursorDiv, a.cursors);
            R(b.selectionDiv, a.selection);
            if (a.teTop != null) {
                this.wrapper.style.top = a.teTop + "px";
                this.wrapper.style.left = a.teLeft + "px"
            }
        }, reset: function (a) {
            if (!this.contextMenuPending) {
                var b, c, d = this.cm, e = d.doc;
                if (d.somethingSelected()) {
                    this.prevInput = "";
                    b = e.sel.primary();
                    c = (b = ue &&
                        (b.to().line - b.from().line > 100 || (c = d.getSelection()).length > 1E3)) ? "-" : c || d.getSelection();
                    this.textarea.value = c;
                    d.state.focused && Va(this.textarea);
                    if (y && z >= 9)this.hasSelection = c
                } else if (!a) {
                    this.prevInput = this.textarea.value = "";
                    if (y && z >= 9)this.hasSelection = null
                }
                this.inaccurateSelection = b
            }
        }, getField: function () {
            return this.textarea
        }, supportsTouch: function () {
            return false
        }, focus: function () {
            if (this.cm.options.readOnly != "nocursor" && (!Xa || aa() != this.textarea))try {
                this.textarea.focus()
            } catch (a) {
            }
        }, blur: function () {
            this.textarea.blur()
        },
        resetPosition: function () {
            this.wrapper.style.top = this.wrapper.style.left = 0
        }, receivedFocus: function () {
            this.slowPoll()
        }, slowPoll: function () {
            var a = this;
            a.pollingFast || a.polling.set(this.cm.options.pollInterval, function () {
                a.poll();
                a.cm.state.focused && a.slowPoll()
            })
        }, fastPoll: function () {
            function a() {
                if (!c.poll() && !b) {
                    b = true;
                    c.polling.set(60, a)
                } else {
                    c.pollingFast = false;
                    c.slowPoll()
                }
            }

            var b = false, c = this;
            c.pollingFast = true;
            c.polling.set(20, a)
        }, poll: function () {
            var a = this.cm, b = this.textarea, c = this.prevInput;
            if (!a.state.focused || gg(b) && !c || Nb(a) || a.options.disableInput || a.state.keySeq)return false;
            if (a.state.pasteIncoming && a.state.fakedLastChar) {
                b.value = b.value.substring(0, b.value.length - 1);
                a.state.fakedLastChar = false
            }
            var d = b.value;
            if (d == c && !a.somethingSelected())return false;
            if (y && z >= 9 && this.hasSelection === d || T && /[\uf700-\uf7ff]/.test(d)) {
                a.display.input.reset();
                return false
            }
            if (a.doc.sel == a.display.selForContextMenu) {
                var e = d.charCodeAt(0);
                e == 8203 && !c && (c = "​");
                if (e == 8666) {
                    this.reset();
                    return this.cm.execCommand("undo")
                }
            }
            for (var f =
                0, e = Math.min(c.length, d.length); f < e && c.charCodeAt(f) == d.charCodeAt(f);)++f;
            var g = this;
            Q(a, function () {
                Kc(a, d.slice(f), c.length - f, null, g.composing ? "*compose" : null);
                d.length > 1E3 || d.indexOf("\n") > -1 ? b.value = g.prevInput = "" : g.prevInput = d;
                if (g.composing) {
                    g.composing.range.clear();
                    g.composing.range = a.markText(g.composing.start, a.getCursor("to"), {className: "CodeMirror-composing"})
                }
            });
            return true
        }, ensurePolled: function () {
            if (this.pollingFast && this.poll())this.pollingFast = false
        }, onKeyPress: function () {
            if (y && z >=
                9)this.hasSelection = null;
            this.fastPoll()
        }, onContextMenu: function (a) {
            function b() {
                if (g.selectionStart != null) {
                    var a = e.somethingSelected(), b = "​" + (a ? g.value : "");
                    g.value = "⇚";
                    g.value = b;
                    d.prevInput = a ? "" : "​";
                    g.selectionStart = 1;
                    g.selectionEnd = b.length;
                    f.selForContextMenu = e.doc.sel
                }
            }

            function c() {
                d.contextMenuPending = false;
                d.wrapper.style.position = "relative";
                g.style.cssText = j;
                if (y && z < 9)f.scrollbars.setScrollTop(f.scroller.scrollTop = i);
                if (g.selectionStart != null) {
                    (!y || y && z < 9) && b();
                    var a = 0, c = function () {
                        f.selForContextMenu ==
                        e.doc.sel && g.selectionStart == 0 && g.selectionEnd > 0 && d.prevInput == "​" ? B(e, ec.selectAll)(e) : a++ < 10 ? f.detectingSelectAll = setTimeout(c, 500) : f.input.reset()
                    };
                    f.detectingSelectAll = setTimeout(c, 200)
                }
            }

            var d = this, e = d.cm, f = e.display, g = d.textarea, h = Qa(e, a), i = f.scroller.scrollTop;
            if (h && !Y) {
                e.options.resetSelectionOnContextMenu && e.doc.sel.contains(h) == -1 && B(e, A)(e.doc, ba(h), ca);
                var j = g.style.cssText;
                d.wrapper.style.position = "absolute";
                g.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (a.clientY -
                    5) + "px; left: " + (a.clientX - 5) + "px; z-index: 1000; background: " + (y ? "rgba(255, 255, 255, .05)" : "transparent") + "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
                if (E)var k = window.scrollY;
                f.input.focus();
                E && window.scrollTo(null, k);
                f.input.reset();
                if (!e.somethingSelected())g.value = d.prevInput = " ";
                d.contextMenuPending = true;
                f.selForContextMenu = e.doc.sel;
                clearTimeout(f.detectingSelectAll);
                y && z >= 9 && b();
                if ($c) {
                    ad(a);
                    var n = function () {
                        fa(window, "mouseup",
                            n);
                        setTimeout(c, 20)
                    };
                    p(window, "mouseup", n)
                } else setTimeout(c, 50)
            }
        }, setUneditable: Ab, needsContentAttribute: !1
    }, Lc.prototype);
    Mc.prototype = S({
        init: function (a) {
            function b(a) {
                if (d.somethingSelected()) {
                    U = d.getSelections();
                    a.type == "cut" && d.replaceSelection("", null, "cut")
                } else if (d.options.lineWiseCopyCut) {
                    var b = Nd(d);
                    U = b.text;
                    a.type == "cut" && d.operation(function () {
                        d.setSelections(b.ranges, 0, ca);
                        d.replaceSelection("", null, "cut")
                    })
                } else return;
                if (a.clipboardData && !Ma) {
                    a.preventDefault();
                    a.clipboardData.clearData();
                    a.clipboardData.setData("text/plain", U.join("\n"))
                } else {
                    var c = Pd(), a = c.firstChild;
                    d.display.lineSpace.insertBefore(c, d.display.lineSpace.firstChild);
                    a.value = U.join("\n");
                    var h = document.activeElement;
                    Va(a);
                    setTimeout(function () {
                        d.display.lineSpace.removeChild(c);
                        h.focus()
                    }, 50)
                }
            }

            var c = this, d = c.cm, a = c.div = a.lineDiv;
            a.contentEditable = "true";
            Od(a);
            p(a, "paste", function (a) {
                var b = a.clipboardData && a.clipboardData.getData("text/plain");
                if (b) {
                    a.preventDefault();
                    d.replaceSelection(b, null, "paste")
                }
            });
            p(a, "compositionstart",
                function (a) {
                    a = a.data;
                    c.composing = {sel: d.doc.sel, data: a, startData: a};
                    if (a) {
                        var b = d.doc.sel.primary(), g = d.getLine(b.head.line).indexOf(a, Math.max(0, b.head.ch - a.length));
                        if (g > -1 && g <= b.head.ch)c.composing.sel = ba(o(b.head.line, g), o(b.head.line, g + a.length))
                    }
                });
            p(a, "compositionupdate", function (a) {
                c.composing.data = a.data
            });
            p(a, "compositionend", function (a) {
                var b = c.composing;
                if (b) {
                    if (a.data != b.startData && !/\u200b/.test(a.data))b.data = a.data;
                    setTimeout(function () {
                        b.handled || c.applyComposition(b);
                        if (c.composing ==
                            b)c.composing = null
                    }, 50)
                }
            });
            p(a, "touchstart", function () {
                c.forceCompositionEnd()
            });
            p(a, "input", function () {
                c.composing || c.pollContent() || Q(c.cm, function () {
                    N(d)
                })
            });
            p(a, "copy", b);
            p(a, "cut", b)
        }, prepareSelection: function () {
            var a = $d(this.cm, false);
            a.focus = this.cm.state.focused;
            return a
        }, showSelection: function (a) {
            if (a && this.cm.display.view.length) {
                a.focus && this.showPrimarySelection();
                this.showMultipleSelections(a)
            }
        }, showPrimarySelection: function () {
            var a = window.getSelection(), b = this.cm.doc.sel.primary(), c =
                Pb(this.cm, a.anchorNode, a.anchorOffset), d = Pb(this.cm, a.focusNode, a.focusOffset);
            if (!c || c.bad || !d || d.bad || !(v(Mb(c, d), b.from()) == 0 && v(Lb(c, d), b.to()) == 0)) {
                c = Qd(this.cm, b.from());
                d = Qd(this.cm, b.to());
                if (c || d) {
                    var e = this.cm.display.view, b = a.rangeCount && a.getRangeAt(0);
                    if (c) {
                        if (!d) {
                            d = e[e.length - 1].measure;
                            d = d.maps ? d.maps[d.maps.length - 1] : d.map;
                            d = {node: d[d.length - 1], offset: d[d.length - 2] - d[d.length - 3]}
                        }
                    } else c = {node: e[0].measure.map[2], offset: 0};
                    try {
                        var f = Aa(c.node, c.offset, d.offset, d.node)
                    } catch (g) {
                    }
                    if (f) {
                        a.removeAllRanges();
                        a.addRange(f);
                        b && a.anchorNode == null ? a.addRange(b) : sa && this.startGracePeriod()
                    }
                    this.rememberSelection()
                }
            }
        }, startGracePeriod: function () {
            var a = this;
            clearTimeout(this.gracePeriod);
            this.gracePeriod = setTimeout(function () {
                a.gracePeriod = false;
                a.selectionChanged() && a.cm.operation(function () {
                    a.cm.curOp.selectionChanged = true
                })
            }, 20)
        }, showMultipleSelections: function (a) {
            R(this.cm.display.cursorDiv, a.cursors);
            R(this.cm.display.selectionDiv, a.selection)
        }, rememberSelection: function () {
            var a = window.getSelection();
            this.lastAnchorNode =
                a.anchorNode;
            this.lastAnchorOffset = a.anchorOffset;
            this.lastFocusNode = a.focusNode;
            this.lastFocusOffset = a.focusOffset
        }, selectionInEditor: function () {
            var a = window.getSelection();
            if (!a.rangeCount)return false;
            a = a.getRangeAt(0).commonAncestorContainer;
            return Oc(this.div, a)
        }, focus: function () {
            this.cm.options.readOnly != "nocursor" && this.div.focus()
        }, blur: function () {
            this.div.blur()
        }, getField: function () {
            return this.div
        }, supportsTouch: function () {
            return true
        }, receivedFocus: function () {
            function a() {
                if (b.cm.state.focused) {
                    b.pollSelection();
                    b.polling.set(b.cm.options.pollInterval, a)
                }
            }

            var b = this;
            this.selectionInEditor() ? this.pollSelection() : Q(this.cm, function () {
                b.cm.curOp.selectionChanged = true
            });
            this.polling.set(this.cm.options.pollInterval, a)
        }, selectionChanged: function () {
            var a = window.getSelection();
            return a.anchorNode != this.lastAnchorNode || a.anchorOffset != this.lastAnchorOffset || a.focusNode != this.lastFocusNode || a.focusOffset != this.lastFocusOffset
        }, pollSelection: function () {
            if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
                var a =
                    window.getSelection(), b = this.cm;
                this.rememberSelection();
                var c = Pb(b, a.anchorNode, a.anchorOffset), d = Pb(b, a.focusNode, a.focusOffset);
                c && d && Q(b, function () {
                    A(b.doc, ba(c, d), ca);
                    if (c.bad || d.bad)b.curOp.selectionChanged = true
                })
            }
        }, pollContent: function () {
            var a = this.cm, b = a.display, c = a.doc.sel.primary(), d = c.from(), c = c.to();
            if (d.line < b.viewFrom || c.line > b.viewTo - 1)return false;
            var e;
            if (d.line == b.viewFrom || (e = ya(a, d.line)) == 0) {
                d = C(b.view[0].line);
                e = b.view[0].node
            } else {
                d = C(b.view[e].line);
                e = b.view[e - 1].node.nextSibling
            }
            var f =
                ya(a, c.line);
            if (f == b.view.length - 1) {
                c = b.viewTo - 1;
                b = b.view[f].node
            } else {
                c = C(b.view[f + 1].line) - 1;
                b = b.view[f + 1].node.previousSibling
            }
            b = oa(qf(a, e, b, d, c));
            for (e = za(a.doc, o(d, 0), o(c, r(a.doc, c).text.length)); b.length > 1 && e.length > 1;)if (x(b) == x(e)) {
                b.pop();
                e.pop();
                c--
            } else if (b[0] == e[0]) {
                b.shift();
                e.shift();
                d++
            } else break;
            for (var g = 0, f = 0, h = b[0], i = e[0], j = Math.min(h.length, i.length); g < j && h.charCodeAt(g) == i.charCodeAt(g);)++g;
            h = x(b);
            i = x(e);
            for (j = Math.min(h.length - (b.length == 1 ? g : 0), i.length - (e.length == 1 ? g : 0)); f <
            j && h.charCodeAt(h.length - f - 1) == i.charCodeAt(i.length - f - 1);)++f;
            b[b.length - 1] = h.slice(0, h.length - f);
            b[0] = b[0].slice(g);
            d = o(d, g);
            c = o(c, e.length ? x(e).length - f : 0);
            if (b.length > 1 || b[0] || v(d, c)) {
                sb(a.doc, b, d, c, "+input");
                return true
            }
        }, ensurePolled: function () {
            this.forceCompositionEnd()
        }, reset: function () {
            this.forceCompositionEnd()
        }, forceCompositionEnd: function () {
            if (this.composing && !this.composing.handled) {
                this.applyComposition(this.composing);
                this.composing.handled = true;
                this.div.blur();
                this.div.focus()
            }
        }, applyComposition: function (a) {
            a.data &&
            a.data != a.startData && B(this.cm, Kc)(this.cm, a.data, 0, a.sel)
        }, setUneditable: function (a) {
            a.setAttribute("contenteditable", "false")
        }, onKeyPress: function (a) {
            a.preventDefault();
            B(this.cm, Kc)(this.cm, String.fromCharCode(a.charCode == null ? a.keyCode : a.charCode), 0)
        }, onContextMenu: Ab, resetPosition: Ab, needsContentAttribute: !0
    }, Mc.prototype);
    m.inputStyles = {textarea: Lc, contenteditable: Mc};
    ha.prototype = {
        primary: function () {
            return this.ranges[this.primIndex]
        }, equals: function (a) {
            if (a == this)return true;
            if (a.primIndex !=
                this.primIndex || a.ranges.length != this.ranges.length)return false;
            for (var b = 0; b < this.ranges.length; b++) {
                var c = this.ranges[b], d = a.ranges[b];
                if (v(c.anchor, d.anchor) != 0 || v(c.head, d.head) != 0)return false
            }
            return true
        }, deepCopy: function () {
            for (var a = [], b = 0; b < this.ranges.length; b++)a[b] = new w(o(this.ranges[b].anchor.line, this.ranges[b].anchor.ch), o(this.ranges[b].head.line, this.ranges[b].head.ch));
            return new ha(a, this.primIndex)
        }, somethingSelected: function () {
            for (var a = 0; a < this.ranges.length; a++)if (!this.ranges[a].empty())return true;
            return false
        }, contains: function (a, b) {
            b || (b = a);
            for (var c = 0; c < this.ranges.length; c++) {
                var d = this.ranges[c];
                if (v(b, d.from()) >= 0 && v(a, d.to()) <= 0)return c
            }
            return -1
        }
    };
    w.prototype = {
        from: function () {
            return Mb(this.anchor, this.head)
        }, to: function () {
            return Lb(this.anchor, this.head)
        }, empty: function () {
            return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
        }
    };
    var Tc = {left: 0, right: 0, top: 0, bottom: 0}, Ba, Pa = null, yf = 0, bc, ac, ke = 0, cc = 0, O = null;
    y ? O = -0.53 : sa ? O = 15 : dg ? O = -0.7 : le && (O = -1 / 3);
    var re = function (a) {
        var b =
            a.wheelDeltaX, c = a.wheelDeltaY;
        if (b == null && a.detail && a.axis == a.HORIZONTAL_AXIS)b = a.detail;
        if (c == null && a.detail && a.axis == a.VERTICAL_AXIS)c = a.detail; else if (c == null)c = a.wheelDelta;
        return {x: b, y: c}
    };
    m.wheelEventPixels = function (a) {
        a = re(a);
        a.x = a.x * O;
        a.y = a.y * O;
        return a
    };
    var Jf = new Ya, dd = null, pa = m.changeEnd = function (a) {
        return !a.text ? a.to : o(a.from.line + a.text.length - 1, x(a.text).length + (a.text.length == 1 ? a.from.ch : 0))
    };
    m.prototype = {
        constructor: m, focus: function () {
            window.focus();
            this.display.input.focus()
        }, setOption: function (a,
                                b) {
            var c = this.options, d = c[a];
            if (!(c[a] == b && a != "mode")) {
                c[a] = b;
                Ga.hasOwnProperty(a) && B(this, Ga[a])(this, b, d)
            }
        }, getOption: function (a) {
            return this.options[a]
        }, getDoc: function () {
            return this.doc
        }, addKeyMap: function (a, b) {
            this.state.keyMaps[b ? "push" : "unshift"](kc(a))
        }, removeKeyMap: function (a) {
            for (var b = this.state.keyMaps, c = 0; c < b.length; ++c)if (b[c] == a || b[c].name == a) {
                b.splice(c, 1);
                return true
            }
        }, addOverlay: J(function (a, b) {
            var c = a.token ? a : m.getMode(this.options, a);
            if (c.startState)throw Error("Overlays may not be stateful.");
            this.state.overlays.push({mode: c, modeSpec: a, opaque: b && b.opaque});
            this.state.modeGen++;
            N(this)
        }), removeOverlay: J(function (a) {
            for (var b = this.state.overlays, c = 0; c < b.length; ++c) {
                var d = b[c].modeSpec;
                if (d == a || typeof a == "string" && d.name == a) {
                    b.splice(c, 1);
                    this.state.modeGen++;
                    N(this);
                    break
                }
            }
        }), indentLine: J(function (a, b, c) {
            typeof b != "string" && typeof b != "number" && (b = b == null ? this.options.smartIndent ? "smart" : "prev" : b ? "add" : "subtract");
            mb(this.doc, a) && lb(this, a, b, c)
        }), indentSelection: J(function (a) {
            for (var b = this.doc.sel.ranges,
                     c = -1, d = 0; d < b.length; d++) {
                var e = b[d];
                if (e.empty()) {
                    if (e.head.line > c) {
                        lb(this, e.head.line, a, true);
                        c = e.head.line;
                        d == this.doc.sel.primIndex && La(this)
                    }
                } else {
                    for (var f = e.from(), e = e.to(), g = Math.max(c, f.line), c = Math.min(this.lastLine(), e.line - (e.ch ? 0 : 1)) + 1, e = g; e < c; ++e)lb(this, e, a);
                    e = this.doc.sel.ranges;
                    f.ch == 0 && (b.length == e.length && e[d].from().ch > 0) && Pc(this.doc, d, new w(f, e[d].to()), ca)
                }
            }
        }), getTokenAt: function (a, b) {
            return Re(this, a, b)
        }, getLineTokens: function (a, b) {
            return Re(this, o(a), b, true)
        }, getTokenTypeAt: function (a) {
            var a =
                t(this.doc, a), b = Te(this, r(this.doc, a.line)), c = 0, d = (b.length - 1) / 2, a = a.ch, e;
            if (a == 0)e = b[2]; else for (; ;) {
                var f = c + d >> 1;
                if ((f ? b[f * 2 - 1] : 0) >= a)d = f; else if (b[f * 2 + 1] < a)c = f + 1; else {
                    e = b[f * 2 + 2];
                    break
                }
            }
            b = e ? e.indexOf("cm-overlay ") : -1;
            return b < 0 ? e : b == 0 ? null : e.slice(0, b - 1)
        }, getModeAt: function (a) {
            var b = this.doc.mode;
            return !b.innerMode ? b : m.innerMode(b, this.getTokenAt(a).state).mode
        }, getHelper: function (a, b) {
            return this.getHelpers(a, b)[0]
        }, getHelpers: function (a, b) {
            var c = [];
            if (!Wa.hasOwnProperty(b))return c;
            var d = Wa[b],
                e = this.getModeAt(a);
            if (typeof e[b] == "string")d[e[b]] && c.push(d[e[b]]); else if (e[b])for (var f = 0; f < e[b].length; f++) {
                var g = d[e[b][f]];
                g && c.push(g)
            } else e.helperType && d[e.helperType] ? c.push(d[e.helperType]) : d[e.name] && c.push(d[e.name]);
            for (f = 0; f < d._global.length; f++) {
                g = d._global[f];
                g.pred(e, this) && G(c, g.val) == -1 && c.push(g.val)
            }
            return c
        }, getStateAfter: function (a, b) {
            var c = this.doc, a = Math.max(c.first, Math.min(a == null ? c.first + c.size - 1 : a, c.first + c.size - 1));
            return ob(this, a + 1, b)
        }, cursorCoords: function (a, b) {
            var c;
            c = this.doc.sel.primary();
            c = a == null ? c.head : typeof a == "object" ? t(this.doc, a) : a ? c.from() : c.to();
            return ia(this, c, b || "page")
        }, charCoords: function (a, b) {
            return Ub(this, t(this.doc, a), b || "page")
        }, coordsChar: function (a, b) {
            a = fe(this, a, b || "page");
            return Xc(this, a.left, a.top)
        }, lineAtHeight: function (a, b) {
            a = fe(this, {top: a, left: 0}, b || "page").top;
            return xa(this.doc, a + this.display.viewOffset)
        }, heightAtLine: function (a, b) {
            var c = false, d;
            if (typeof a == "number") {
                d = this.doc.first + this.doc.size - 1;
                if (a < this.doc.first)a = this.doc.first;
                else if (a > d) {
                    a = d;
                    c = true
                }
                d = r(this.doc, a)
            } else d = a;
            return Vc(this, d, {top: 0, left: 0}, b || "page").top + (c ? this.doc.height - ga(d) : 0)
        }, defaultTextHeight: function () {
            return ta(this.display)
        }, defaultCharWidth: function () {
            return cb(this.display)
        }, setGutterMarker: J(function (a, b, c) {
            return ic(this.doc, a, "gutter", function (a) {
                var e = a.gutterMarkers || (a.gutterMarkers = {});
                e[b] = c;
                if (!c && af(e))a.gutterMarkers = null;
                return true
            })
        }), clearGutter: J(function (a) {
            var b = this, c = b.doc, d = c.first;
            c.iter(function (c) {
                if (c.gutterMarkers &&
                    c.gutterMarkers[a]) {
                    c.gutterMarkers[a] = null;
                    ja(b, d, "gutter");
                    if (af(c.gutterMarkers))c.gutterMarkers = null
                }
                ++d
            })
        }), lineInfo: function (a) {
            if (typeof a == "number") {
                if (!mb(this.doc, a))return null;
                var b = a, a = r(this.doc, a);
                if (!a)return null
            } else {
                b = C(a);
                if (b == null)return null
            }
            return {
                line: b,
                handle: a,
                text: a.text,
                gutterMarkers: a.gutterMarkers,
                textClass: a.textClass,
                bgClass: a.bgClass,
                wrapClass: a.wrapClass,
                widgets: a.widgets
            }
        }, getViewport: function () {
            return {from: this.display.viewFrom, to: this.display.viewTo}
        }, addWidget: function (a,
                                b, c, d, e) {
            var f = this.display, a = ia(this, t(this.doc, a)), g = a.bottom, h = a.left;
            b.style.position = "absolute";
            b.setAttribute("cm-ignore-events", "true");
            this.display.input.setUneditable(b);
            f.sizer.appendChild(b);
            if (d == "over")g = a.top; else if (d == "above" || d == "near") {
                var i = Math.max(f.wrapper.clientHeight, this.doc.height), j = Math.max(f.sizer.clientWidth, f.lineSpace.clientWidth);
                if ((d == "above" || a.bottom + b.offsetHeight > i) && a.top > b.offsetHeight)g = a.top - b.offsetHeight; else if (a.bottom + b.offsetHeight <= i)g = a.bottom;
                h +
                b.offsetWidth > j && (h = j - b.offsetWidth)
            }
            b.style.top = g + "px";
            b.style.left = b.style.right = "";
            if (e == "right") {
                h = f.sizer.clientWidth - b.offsetWidth;
                b.style.right = "0px"
            } else {
                e == "left" ? h = 0 : e == "middle" && (h = (f.sizer.clientWidth - b.offsetWidth) / 2);
                b.style.left = h + "px"
            }
            if (c) {
                a = Zb(this, h, g, h + b.offsetWidth, g + b.offsetHeight);
                a.scrollTop != null && hb(this, a.scrollTop);
                a.scrollLeft != null && Ia(this, a.scrollLeft)
            }
        }, triggerOnKeyDown: J(ne), triggerOnKeyPress: J(oe), triggerOnKeyUp: me, execCommand: function (a) {
            if (ec.hasOwnProperty(a))return ec[a](this)
        },
        findPosH: function (a, b, c, d) {
            var e = 1;
            if (b < 0) {
                e = -1;
                b = -b
            }
            for (var f = 0, a = t(this.doc, a); f < b; ++f) {
                a = jd(this.doc, a, e, c, d);
                if (a.hitSide)break
            }
            return a
        }, moveH: J(function (a, b) {
            var c = this;
            c.extendSelectionsBy(function (d) {
                return c.display.shift || c.doc.extend || d.empty() ? jd(c.doc, d.head, a, b, c.options.rtlMoveVisually) : a < 0 ? d.from() : d.to()
            }, Cb)
        }), deleteH: J(function (a, b) {
            var c = this.doc;
            this.doc.sel.somethingSelected() ? c.replaceSelection("", null, "+delete") : Ra(this, function (d) {
                var e = jd(c, d.head, a, b, false);
                return a < 0 ? {
                    from: e,
                    to: d.head
                } : {from: d.head, to: e}
            })
        }), findPosV: function (a, b, c, d) {
            var e = 1;
            if (b < 0) {
                e = -1;
                b = -b
            }
            for (var f = 0, a = t(this.doc, a); f < b; ++f) {
                a = ia(this, a, "div");
                d == null ? d = a.left : a.left = d;
                a = He(this, a, e, c);
                if (a.hitSide)break
            }
            return a
        }, moveV: J(function (a, b) {
            var c = this, d = this.doc, e = [], f = !c.display.shift && !d.extend && d.sel.somethingSelected();
            d.extendSelectionsBy(function (g) {
                if (f)return a < 0 ? g.from() : g.to();
                var i = ia(c, g.head, "div");
                if (g.goalColumn != null)i.left = g.goalColumn;
                e.push(i.left);
                var j = He(c, i, a, b);
                b == "page" && g == d.sel.primary() &&
                id(c, null, Ub(c, j, "div").top - i.top);
                return j
            }, Cb);
            if (e.length)for (var g = 0; g < d.sel.ranges.length; g++)d.sel.ranges[g].goalColumn = e[g]
        }), findWordAt: function (a) {
            var b = r(this.doc, a.line).text, c = a.ch, d = a.ch;
            if (b) {
                var e = this.getHelper(a, "wordChars");
                (a.xRel < 0 || d == b.length) && c ? --c : ++d;
                for (var f = b.charAt(c), f = jc(f, e) ? function (a) {
                    return jc(a, e)
                } : /\s/.test(f) ? function (a) {
                    return /\s/.test(a)
                } : function (a) {
                    return !/\s/.test(a) && !jc(a)
                }; c > 0 && f(b.charAt(c - 1));)--c;
                for (; d < b.length && f(b.charAt(d));)++d
            }
            return new w(o(a.line,
                c), o(a.line, d))
        }, toggleOverwrite: function (a) {
            if (!(a != null && a == this.state.overwrite)) {
                (this.state.overwrite = !this.state.overwrite) ? ib(this.display.cursorDiv, "CodeMirror-overwrite") : gb(this.display.cursorDiv, "CodeMirror-overwrite");
                F(this, "overwriteToggle", this, this.state.overwrite)
            }
        }, hasFocus: function () {
            return this.display.input.getField() == aa()
        }, scrollTo: J(function (a, b) {
            (a != null || b != null) && hc(this);
            if (a != null)this.curOp.scrollLeft = a;
            if (b != null)this.curOp.scrollTop = b
        }), getScrollInfo: function () {
            var a =
                this.display.scroller;
            return {
                left: a.scrollLeft,
                top: a.scrollTop,
                height: a.scrollHeight - $(this) - this.display.barHeight,
                width: a.scrollWidth - $(this) - this.display.barWidth,
                clientHeight: Gc(this),
                clientWidth: la(this)
            }
        }, scrollIntoView: J(function (a, b) {
            if (a == null) {
                a = {from: this.doc.sel.primary().head, to: null};
                if (b == null)b = this.options.cursorScrollMargin
            } else typeof a == "number" ? a = {from: o(a, 0), to: null} : a.from == null && (a = {from: a, to: null});
            if (!a.to)a.to = a.from;
            a.margin = b || 0;
            if (a.from.line != null) {
                hc(this);
                this.curOp.scrollToPos =
                    a
            } else {
                var c = Zb(this, Math.min(a.from.left, a.to.left), Math.min(a.from.top, a.to.top) - a.margin, Math.max(a.from.right, a.to.right), Math.max(a.from.bottom, a.to.bottom) + a.margin);
                this.scrollTo(c.scrollLeft, c.scrollTop)
            }
        }), setSize: J(function (a, b) {
            function c(a) {
                return typeof a == "number" || /^\d+$/.test("" + a) ? a + "px" : a
            }

            var d = this;
            if (a != null)d.display.wrapper.style.width = c(a);
            if (b != null)d.display.wrapper.style.height = c(b);
            d.options.lineWrapping && ee(this);
            var e = d.display.viewFrom;
            d.doc.iter(e, d.display.viewTo, function (a) {
                if (a.widgets)for (var b =
                    0; b < a.widgets.length; b++)if (a.widgets[b].noHScroll) {
                    ja(d, e, "widget");
                    break
                }
                ++e
            });
            d.curOp.forceUpdate = true;
            F(d, "refresh", this)
        }), operation: function (a) {
            return Q(this, a)
        }, refresh: J(function () {
            var a = this.display.cachedTextHeight;
            N(this);
            this.curOp.forceUpdate = true;
            db(this);
            this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop);
            xc(this);
            (a == null || Math.abs(a - ta(this.display)) > 0.5) && vc(this);
            F(this, "refresh", this)
        }), swapDoc: J(function (a) {
            var b = this.doc;
            b.cm = null;
            wd(this, a);
            db(this);
            this.display.input.reset();
            this.scrollTo(a.scrollLeft, a.scrollTop);
            this.curOp.forceScroll = true;
            H(this, "swapDoc", this, b);
            return b
        }), getInputField: function () {
            return this.display.input.getField()
        }, getWrapperElement: function () {
            return this.display.wrapper
        }, getScrollerElement: function () {
            return this.display.scroller
        }, getGutterElement: function () {
            return this.display.gutters
        }
    };
    Ua(m);
    var jf = m.defaults = {}, Ga = m.optionHandlers = {}, xd = m.Init = {
        toString: function () {
            return "CodeMirror.Init"
        }
    };
    u("value", "", function (a, b) {
        a.setValue(b)
    }, !0);
    u("mode",
        null, function (a, b) {
            a.doc.modeOption = b;
            uc(a)
        }, !0);
    u("indentUnit", 2, uc, !0);
    u("indentWithTabs", !1);
    u("smartIndent", !0);
    u("tabSize", 4, function (a) {
        ab(a);
        db(a);
        N(a)
    }, !0);
    u("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function (a, b, c) {
        a.state.specialChars = RegExp(b.source + (b.test("\t") ? "" : "|\t"), "g");
        c != m.Init && a.refresh()
    });
    u("specialCharPlaceholder", function (a) {
        var b = q("span", "•", "cm-invalidchar");
        b.title = "\\u" + a.charCodeAt(0).toString(16);
        b.setAttribute("aria-label", b.title);
        return b
    }, function (a) {
        a.refresh()
    }, !0);
    u("electricChars", !0);
    u("inputStyle", Xa ? "contenteditable" : "textarea", function () {
        throw Error("inputStyle can not (yet) be changed in a running editor");
    }, !0);
    u("rtlMoveVisually", !fg);
    u("wholeLineUpdateBefore", !0);
    u("theme", "default", function (a) {
        td(a);
        eb(a)
    }, !0);
    u("keyMap", "default", function (a, b, c) {
        b = kc(b);
        (c = c != m.Init && kc(c)) && c.detach && c.detach(a, b);
        b.attach && b.attach(a, c || null)
    });
    u("extraKeys", null);
    u("lineWrapping", !1, function (a) {
        if (a.options.lineWrapping) {
            ib(a.display.wrapper,
                "CodeMirror-wrap");
            a.display.sizer.style.minWidth = "";
            a.display.sizerWidth = null
        } else {
            gb(a.display.wrapper, "CodeMirror-wrap");
            yc(a)
        }
        vc(a);
        N(a);
        db(a);
        setTimeout(function () {
            Ja(a)
        }, 100)
    }, !0);
    u("gutters", [], function (a) {
        rc(a.options);
        eb(a)
    }, !0);
    u("fixedGutter", !0, function (a, b) {
        a.display.gutters.style.left = b ? Cc(a.display) + "px" : "0";
        a.refresh()
    }, !0);
    u("coverGutterNextToScrollbar", !1, function (a) {
        Ja(a)
    }, !0);
    u("scrollbarStyle", "native", function (a) {
        ud(a);
        Ja(a);
        a.display.scrollbars.setScrollTop(a.doc.scrollTop);
        a.display.scrollbars.setScrollLeft(a.doc.scrollLeft)
    }, !0);
    u("lineNumbers", !1, function (a) {
        rc(a.options);
        eb(a)
    }, !0);
    u("firstLineNumber", 1, eb, !0);
    u("lineNumberFormatter", function (a) {
        return a
    }, eb, !0);
    u("showCursorWhenSelecting", !1, jb, !0);
    u("resetSelectionOnContextMenu", !0);
    u("lineWiseCopyCut", !0);
    u("readOnly", !1, function (a, b) {
        if (b == "nocursor") {
            $a(a);
            a.display.input.blur();
            a.display.disabled = true
        } else {
            a.display.disabled = false;
            b || a.display.input.reset()
        }
    });
    u("disableInput", !1, function (a, b) {
            b || a.display.input.reset()
        },
        !0);
    u("dragDrop", !0, function (a, b, c) {
        if (!b != !(c && c != m.Init)) {
            c = a.display.dragFunctions;
            b = b ? p : fa;
            b(a.display.scroller, "dragstart", c.start);
            b(a.display.scroller, "dragenter", c.simple);
            b(a.display.scroller, "dragover", c.simple);
            b(a.display.scroller, "drop", c.drop)
        }
    });
    u("cursorBlinkRate", 530);
    u("cursorScrollMargin", 0);
    u("cursorHeight", 1, jb, !0);
    u("singleCursorHeightPerLine", !0, jb, !0);
    u("workTime", 100);
    u("workDelay", 100);
    u("flattenSpans", !0, ab, !0);
    u("addModeClass", !1, ab, !0);
    u("pollInterval", 100);
    u("undoDepth",
        200, function (a, b) {
            a.doc.history.undoDepth = b
        });
    u("historyEventDelay", 1250);
    u("viewportMargin", 10, function (a) {
        a.refresh()
    }, !0);
    u("maxHighlightLength", 1E4, ab, !0);
    u("moveInputWithCursor", !0, function (a, b) {
        b || a.display.input.resetPosition()
    });
    u("tabindex", null, function (a, b) {
        a.display.input.getField().tabIndex = b || ""
    });
    u("autofocus", null);
    var hf = m.modes = {}, Db = m.mimeModes = {};
    m.defineMode = function (a, b) {
        if (!m.defaults.mode && a != "null")m.defaults.mode = a;
        if (arguments.length > 2)b.dependencies = Array.prototype.slice.call(arguments,
            2);
        hf[a] = b
    };
    m.defineMIME = function (a, b) {
        Db[a] = b
    };
    m.resolveMode = function (a) {
        if (typeof a == "string" && Db.hasOwnProperty(a))a = Db[a]; else if (a && typeof a.name == "string" && Db.hasOwnProperty(a.name)) {
            var b = Db[a.name];
            typeof b == "string" && (b = {name: b});
            a = Ze(b, a);
            a.name = b.name
        } else if (typeof a == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(a))return m.resolveMode("application/xml");
        return typeof a == "string" ? {name: a} : a || {name: "null"}
    };
    m.getMode = function (a, b) {
        var b = m.resolveMode(b), c = hf[b.name];
        if (!c)return m.getMode(a,
            "text/plain");
        c = c(a, b);
        if (Eb.hasOwnProperty(b.name)) {
            var d = Eb[b.name], e;
            for (e in d)if (d.hasOwnProperty(e)) {
                c.hasOwnProperty(e) && (c["_" + e] = c[e]);
                c[e] = d[e]
            }
        }
        c.name = b.name;
        if (b.helperType)c.helperType = b.helperType;
        if (b.modeProps)for (e in b.modeProps)c[e] = b.modeProps[e];
        return c
    };
    m.defineMode("null", function () {
        return {
            token: function (a) {
                a.skipToEnd()
            }
        }
    });
    m.defineMIME("text/plain", "null");
    var Eb = m.modeExtensions = {};
    m.extendMode = function (a, b) {
        var c = Eb.hasOwnProperty(a) ? Eb[a] : Eb[a] = {};
        S(b, c)
    };
    m.defineExtension =
        function (a, b) {
            m.prototype[a] = b
        };
    m.defineDocExtension = function (a, b) {
        M.prototype[a] = b
    };
    m.defineOption = u;
    var tc = [];
    m.defineInitHook = function (a) {
        tc.push(a)
    };
    var Wa = m.helpers = {};
    m.registerHelper = function (a, b, c) {
        Wa.hasOwnProperty(a) || (Wa[a] = m[a] = {_global: []});
        Wa[a][b] = c
    };
    m.registerGlobalHelper = function (a, b, c, d) {
        m.registerHelper(a, b, d);
        Wa[a]._global.push({pred: c, val: d})
    };
    var Oa = m.copyState = function (a, b) {
        if (b === true)return b;
        if (a.copyState)return a.copyState(b);
        var c = {}, d;
        for (d in b) {
            var e = b[d];
            e instanceof
            Array && (e = e.concat([]));
            c[d] = e
        }
        return c
    }, wf = m.startState = function (a, b, c) {
        return a.startState ? a.startState(b, c) : true
    };
    m.innerMode = function (a, b) {
        for (; a.innerMode;) {
            var c = a.innerMode(b);
            if (!c || c.mode == a)break;
            b = c.state;
            a = c.mode
        }
        return c || {mode: a, state: b}
    };
    var ec = m.commands = {
        selectAll: function (a) {
            a.setSelection(o(a.firstLine(), 0), o(a.lastLine()), ca)
        }, singleSelection: function (a) {
            a.setSelection(a.getCursor("anchor"), a.getCursor("head"), ca)
        }, killLine: function (a) {
            Ra(a, function (b) {
                if (b.empty()) {
                    var c = r(a.doc,
                        b.head.line).text.length;
                    return b.head.ch == c && b.head.line < a.lastLine() ? {
                        from: b.head,
                        to: o(b.head.line + 1, 0)
                    } : {from: b.head, to: o(b.head.line, c)}
                }
                return {from: b.from(), to: b.to()}
            })
        }, deleteLine: function (a) {
            Ra(a, function (b) {
                return {from: o(b.from().line, 0), to: t(a.doc, o(b.to().line + 1, 0))}
            })
        }, delLineLeft: function (a) {
            Ra(a, function (a) {
                return {from: o(a.from().line, 0), to: a.from()}
            })
        }, delWrappedLineLeft: function (a) {
            Ra(a, function (b) {
                var c = a.charCoords(b.head, "div").top + 5;
                return {
                    from: a.coordsChar({left: 0, top: c}, "div"),
                    to: b.from()
                }
            })
        }, delWrappedLineRight: function (a) {
            Ra(a, function (b) {
                var c = a.charCoords(b.head, "div").top + 5, c = a.coordsChar({
                    left: a.display.lineDiv.offsetWidth + 100,
                    top: c
                }, "div");
                return {from: b.from(), to: c}
            })
        }, undo: function (a) {
            a.undo()
        }, redo: function (a) {
            a.redo()
        }, undoSelection: function (a) {
            a.undoSelection()
        }, redoSelection: function (a) {
            a.redoSelection()
        }, goDocStart: function (a) {
            a.extendSelection(o(a.firstLine(), 0))
        }, goDocEnd: function (a) {
            a.extendSelection(o(a.lastLine()))
        }, goLineStart: function (a) {
            a.extendSelectionsBy(function (b) {
                return cf(a,
                    b.head.line)
            }, {origin: "+move", bias: 1})
        }, goLineStartSmart: function (a) {
            a.extendSelectionsBy(function (b) {
                return df(a, b.head)
            }, {origin: "+move", bias: 1})
        }, goLineEnd: function (a) {
            a.extendSelectionsBy(function (b) {
                for (var b = b.head.line, c, d = r(a.doc, b); c = wa(d, false);) {
                    d = c.find(1, true).line;
                    b = null
                }
                c = V(d);
                c = !c ? d.text.length : c[0].level % 2 ? Xb(d) : Yb(d);
                return o(b == null ? C(d) : b, c)
            }, {origin: "+move", bias: -1})
        }, goLineRight: function (a) {
            a.extendSelectionsBy(function (b) {
                b = a.charCoords(b.head, "div").top + 5;
                return a.coordsChar({
                    left: a.display.lineDiv.offsetWidth +
                    100, top: b
                }, "div")
            }, Cb)
        }, goLineLeft: function (a) {
            a.extendSelectionsBy(function (b) {
                b = a.charCoords(b.head, "div").top + 5;
                return a.coordsChar({left: 0, top: b}, "div")
            }, Cb)
        }, goLineLeftSmart: function (a) {
            a.extendSelectionsBy(function (b) {
                var c = a.charCoords(b.head, "div").top + 5, c = a.coordsChar({left: 0, top: c}, "div");
                return c.ch < a.getLine(c.line).search(/\S/) ? df(a, b.head) : c
            }, Cb)
        }, goLineUp: function (a) {
            a.moveV(-1, "line")
        }, goLineDown: function (a) {
            a.moveV(1, "line")
        }, goPageUp: function (a) {
            a.moveV(-1, "page")
        }, goPageDown: function (a) {
            a.moveV(1,
                "page")
        }, goCharLeft: function (a) {
            a.moveH(-1, "char")
        }, goCharRight: function (a) {
            a.moveH(1, "char")
        }, goColumnLeft: function (a) {
            a.moveH(-1, "column")
        }, goColumnRight: function (a) {
            a.moveH(1, "column")
        }, goWordLeft: function (a) {
            a.moveH(-1, "word")
        }, goGroupRight: function (a) {
            a.moveH(1, "group")
        }, goGroupLeft: function (a) {
            a.moveH(-1, "group")
        }, goWordRight: function (a) {
            a.moveH(1, "word")
        }, delCharBefore: function (a) {
            a.deleteH(-1, "char")
        }, delCharAfter: function (a) {
            a.deleteH(1, "char")
        }, delWordBefore: function (a) {
            a.deleteH(-1, "word")
        },
        delWordAfter: function (a) {
            a.deleteH(1, "word")
        }, delGroupBefore: function (a) {
            a.deleteH(-1, "group")
        }, delGroupAfter: function (a) {
            a.deleteH(1, "group")
        }, indentAuto: function (a) {
            a.indentSelection("smart")
        }, indentMore: function (a) {
            a.indentSelection("add")
        }, indentLess: function (a) {
            a.indentSelection("subtract")
        }, insertTab: function (a) {
            a.replaceSelection("\t")
        }, insertSoftTab: function (a) {
            for (var b = [], c = a.listSelections(), d = a.options.tabSize, e = 0; e < c.length; e++) {
                var f = c[e].from(), f = X(a.getLine(f.line), f.ch, d);
                b.push(Array(d -
                    f % d + 1).join(" "))
            }
            a.replaceSelections(b)
        }, defaultTab: function (a) {
            a.somethingSelected() ? a.indentSelection("add") : a.execCommand("insertTab")
        }, transposeChars: function (a) {
            Q(a, function () {
                for (var b = a.listSelections(), c = [], d = 0; d < b.length; d++) {
                    var e = b[d].head, f = r(a.doc, e.line).text;
                    if (f) {
                        e.ch == f.length && (e = new o(e.line, e.ch - 1));
                        if (e.ch > 0) {
                            e = new o(e.line, e.ch + 1);
                            a.replaceRange(f.charAt(e.ch - 1) + f.charAt(e.ch - 2), o(e.line, e.ch - 2), e, "+transpose")
                        } else if (e.line > a.doc.first) {
                            var g = r(a.doc, e.line - 1).text;
                            g && a.replaceRange(f.charAt(0) +
                                "\n" + g.charAt(g.length - 1), o(e.line - 1, g.length - 1), o(e.line, 1), "+transpose")
                        }
                    }
                    c.push(new w(e, e))
                }
                a.setSelections(c)
            })
        }, newlineAndIndent: function (a) {
            Q(a, function () {
                for (var b = a.listSelections().length, c = 0; c < b; c++) {
                    var d = a.listSelections()[c];
                    a.replaceRange("\n", d.anchor, d.head, "+input");
                    a.indentLine(d.from().line + 1, null, true);
                    La(a)
                }
            })
        }, toggleOverwrite: function (a) {
            a.toggleOverwrite()
        }
    }, qa = m.keyMap = {};
    qa.basic = {
        Left: "goCharLeft",
        Right: "goCharRight",
        Up: "goLineUp",
        Down: "goLineDown",
        End: "goLineEnd",
        Home: "goLineStartSmart",
        PageUp: "goPageUp",
        PageDown: "goPageDown",
        Delete: "delCharAfter",
        Backspace: "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        Tab: "defaultTab",
        "Shift-Tab": "indentAuto",
        Enter: "newlineAndIndent",
        Insert: "toggleOverwrite",
        Esc: "singleSelection"
    };
    qa.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        fallthrough: "basic"
    };
    qa.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Alt-F": "goWordRight",
        "Alt-B": "goWordLeft",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-D": "delWordAfter",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars"
    };
    qa.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        fallthrough: ["basic", "emacsy"]
    };
    qa["default"] =
        T ? qa.macDefault : qa.pcDefault;
    m.normalizeKeyMap = function (a) {
        var b = {}, c;
        for (c in a)if (a.hasOwnProperty(c)) {
            var d = a[c];
            if (!/^(name|fallthrough|(de|at)tach)$/.test(c)) {
                if (d != "...")for (var e = kb(c.split(" "), Pf), f = 0; f < e.length; f++) {
                    var g, h;
                    if (f == e.length - 1) {
                        h = c;
                        g = d
                    } else {
                        h = e.slice(0, f + 1).join(" ");
                        g = "..."
                    }
                    var i = b[h];
                    if (i) {
                        if (i != g)throw Error("Inconsistent bindings for " + h);
                    } else b[h] = g
                }
                delete a[c]
            }
        }
        for (var j in b)a[j] = b[j];
        return a
    };
    var tb = m.lookupKey = function (a, b, c, d) {
        var b = kc(b), e = b.call ? b.call(a, d) : b[a];
        if (e === false)return "nothing";
        if (e === "...")return "multi";
        if (e != null && c(e))return "handled";
        if (b.fallthrough) {
            if (Object.prototype.toString.call(b.fallthrough) != "[object Array]")return tb(a, b.fallthrough, c, d);
            for (e = 0; e < b.fallthrough.length; e++) {
                var f = tb(a, b.fallthrough[e], c, d);
                if (f)return f
            }
        }
    }, If = m.isModifierKey = function (a) {
        a = typeof a == "string" ? a : ra[a.keyCode];
        return a == "Ctrl" || a == "Alt" || a == "Shift" || a == "Mod"
    }, Kf = m.keyName = function (a, b) {
        if (Y && a.keyCode == 34 && a["char"])return false;
        var c = ra[a.keyCode], d =
            c;
        if (d == null || a.altGraphKey)return false;
        a.altKey && c != "Alt" && (d = "Alt-" + d);
        if ((gf ? a.metaKey : a.ctrlKey) && c != "Ctrl")d = "Ctrl-" + d;
        if ((gf ? a.ctrlKey : a.metaKey) && c != "Cmd")d = "Cmd-" + d;
        !b && (a.shiftKey && c != "Shift") && (d = "Shift-" + d);
        return d
    };
    m.fromTextArea = function (a, b) {
        function c() {
            a.value = i.getValue()
        }

        b = b ? S(b) : {};
        b.value = a.value;
        if (!b.tabindex && a.tabIndex)b.tabindex = a.tabIndex;
        if (!b.placeholder && a.placeholder)b.placeholder = a.placeholder;
        if (b.autofocus == null) {
            var d = aa();
            b.autofocus = d == a || a.getAttribute("autofocus") !=
                null && d == document.body
        }
        if (a.form) {
            p(a.form, "submit", c);
            if (!b.leaveSubmitMethodAlone) {
                var e = a.form, f = e.submit;
                try {
                    var g = e.submit = function () {
                        c();
                        e.submit = f;
                        e.submit();
                        e.submit = g
                    }
                } catch (h) {
                }
            }
        }
        b.finishInit = function (b) {
            b.save = c;
            b.getTextArea = function () {
                return a
            };
            b.toTextArea = function () {
                b.toTextArea = isNaN;
                c();
                a.parentNode.removeChild(b.getWrapperElement());
                a.style.display = "";
                if (a.form) {
                    fa(a.form, "submit", c);
                    if (typeof a.form.submit == "function")a.form.submit = f
                }
            }
        };
        a.style.display = "none";
        var i = m(function (b) {
            a.parentNode.insertBefore(b,
                a.nextSibling)
        }, b);
        return i
    };
    var oc = m.StringStream = function (a, b) {
        this.pos = this.start = 0;
        this.string = a;
        this.tabSize = b || 8;
        this.lineStart = this.lastColumnPos = this.lastColumnValue = 0
    };
    oc.prototype = {
        eol: function () {
            return this.pos >= this.string.length
        }, sol: function () {
            return this.pos == this.lineStart
        }, peek: function () {
            return this.string.charAt(this.pos) || void 0
        }, next: function () {
            if (this.pos < this.string.length)return this.string.charAt(this.pos++)
        }, eat: function (a) {
            var b = this.string.charAt(this.pos);
            if (typeof a ==
                "string" ? b == a : b && (a.test ? a.test(b) : a(b))) {
                ++this.pos;
                return b
            }
        }, eatWhile: function (a) {
            for (var b = this.pos; this.eat(a););
            return this.pos > b
        }, eatSpace: function () {
            for (var a = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;
            return this.pos > a
        }, skipToEnd: function () {
            this.pos = this.string.length
        }, skipTo: function (a) {
            a = this.string.indexOf(a, this.pos);
            if (a > -1) {
                this.pos = a;
                return true
            }
        }, backUp: function (a) {
            this.pos = this.pos - a
        }, column: function () {
            if (this.lastColumnPos < this.start) {
                this.lastColumnValue =
                    X(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
                this.lastColumnPos = this.start
            }
            return this.lastColumnValue - (this.lineStart ? X(this.string, this.lineStart, this.tabSize) : 0)
        }, indentation: function () {
            return X(this.string, null, this.tabSize) - (this.lineStart ? X(this.string, this.lineStart, this.tabSize) : 0)
        }, match: function (a, b, c) {
            if (typeof a == "string") {
                var d = this.string.substr(this.pos, a.length);
                if ((c ? d.toLowerCase() : d) == (c ? a.toLowerCase() : a)) {
                    if (b !== false)this.pos = this.pos + a.length;
                    return true
                }
            } else {
                if ((a = this.string.slice(this.pos).match(a)) && a.index > 0)return null;
                if (a && b !== false)this.pos = this.pos + a[0].length;
                return a
            }
        }, current: function () {
            return this.string.slice(this.start, this.pos)
        }, hideFirstChars: function (a, b) {
            this.lineStart = this.lineStart + a;
            try {
                return b()
            } finally {
                this.lineStart = this.lineStart - a
            }
        }
    };
    var kd = 0, Da = m.TextMarker = function (a, b) {
        this.lines = [];
        this.type = b;
        this.doc = a;
        this.id = ++kd
    };
    Ua(Da);
    Da.prototype.clear = function () {
        if (!this.explicitlyCleared) {
            var a = this.doc.cm, b =
                a && !a.curOp;
            b && Fa(a);
            if (P(this, "clear")) {
                var c = this.find();
                c && H(this, "clear", c.from, c.to)
            }
            for (var d = c = null, e = 0; e < this.lines.length; ++e) {
                var f = this.lines[e], g = vb(f.markedSpans, this);
                if (a && !this.collapsed)ja(a, C(f), "text"); else if (a) {
                    g.to != null && (d = C(f));
                    g.from != null && (c = C(f))
                }
                for (var h = f, i = f.markedSpans, j = g, k = void 0, n = 0; n < i.length; ++n)i[n] != j && (k || (k = [])).push(i[n]);
                h.markedSpans = k;
                g.from == null && (this.collapsed && !ua(this.doc, f) && a) && Z(f, ta(a.display))
            }
            if (a && this.collapsed && !a.options.lineWrapping)for (e =
                                                                        0; e < this.lines.length; ++e) {
                f = da(this.lines[e]);
                g = Gb(f);
                if (g > a.display.maxLineLength) {
                    a.display.maxLine = f;
                    a.display.maxLineLength = g;
                    a.display.maxLineChanged = true
                }
            }
            c != null && (a && this.collapsed) && N(a, c, d + 1);
            this.lines.length = 0;
            this.explicitlyCleared = true;
            if (this.atomic && this.doc.cantEdit) {
                this.doc.cantEdit = false;
                a && Zd(a.doc)
            }
            a && H(a, "markerCleared", a, this);
            b && Ha(a);
            this.parent && this.parent.clear()
        }
    };
    Da.prototype.find = function (a, b) {
        a == null && this.type == "bookmark" && (a = 1);
        for (var c, d, e = 0; e < this.lines.length; ++e) {
            var f =
                this.lines[e], g = vb(f.markedSpans, this);
            if (g.from != null) {
                c = o(b ? f : C(f), g.from);
                if (a == -1)return c
            }
            if (g.to != null) {
                d = o(b ? f : C(f), g.to);
                if (a == 1)return d
            }
        }
        return c && {from: c, to: d}
    };
    Da.prototype.changed = function () {
        var a = this.find(-1, true), b = this, c = this.doc.cm;
        a && c && Q(c, function () {
            var d = a.line, e = C(a.line);
            if (e = Nc(c, e)) {
                de(e);
                c.curOp.selectionChanged = c.curOp.forceUpdate = true
            }
            c.curOp.updateMaxLine = true;
            if (!ua(b.doc, d) && b.height != null) {
                e = b.height;
                b.height = null;
                (e = qb(b) - e) && Z(d, d.height + e)
            }
        })
    };
    Da.prototype.attachLine =
        function (a) {
            if (!this.lines.length && this.doc.cm) {
                var b = this.doc.cm.curOp;
                if (!b.maybeHiddenMarkers || G(b.maybeHiddenMarkers, this) == -1)(b.maybeUnhiddenMarkers || (b.maybeUnhiddenMarkers = [])).push(this)
            }
            this.lines.push(a)
        };
    Da.prototype.detachLine = function (a) {
        this.lines.splice(G(this.lines, a), 1);
        if (!this.lines.length && this.doc.cm) {
            a = this.doc.cm.curOp;
            (a.maybeHiddenMarkers || (a.maybeHiddenMarkers = [])).push(this)
        }
    };
    var kd = 0, mc = m.SharedTextMarker = function (a, b) {
        this.markers = a;
        this.primary = b;
        for (var c = 0; c < a.length; ++c)a[c].parent =
            this
    };
    Ua(mc);
    mc.prototype.clear = function () {
        if (!this.explicitlyCleared) {
            this.explicitlyCleared = true;
            for (var a = 0; a < this.markers.length; ++a)this.markers[a].clear();
            H(this, "clear")
        }
    };
    mc.prototype.find = function (a, b) {
        return this.primary.find(a, b)
    };
    var nc = m.LineWidget = function (a, b, c) {
        if (c)for (var d in c)c.hasOwnProperty(d) && (this[d] = c[d]);
        this.doc = a;
        this.node = b
    };
    Ua(nc);
    nc.prototype.clear = function () {
        var a = this.doc.cm, b = this.line.widgets, c = this.line, d = C(c);
        if (d != null && b) {
            for (var e = 0; e < b.length; ++e)b[e] == this &&
            b.splice(e--, 1);
            if (!b.length)c.widgets = null;
            var f = qb(this);
            Z(c, Math.max(0, c.height - f));
            a && Q(a, function () {
                Oe(a, c, -f);
                ja(a, d, "widget")
            })
        }
    };
    nc.prototype.changed = function () {
        var a = this.height, b = this.doc.cm, c = this.line;
        this.height = null;
        var d = qb(this) - a;
        if (d) {
            Z(c, c.height + d);
            b && Q(b, function () {
                b.curOp.forceUpdate = true;
                Oe(b, c, d)
            })
        }
    };
    var wb = m.Line = function (a, b, c) {
        this.text = a;
        Me(this, b);
        this.height = c ? c(this) : 1
    };
    Ua(wb);
    wb.prototype.lineNo = function () {
        return C(this)
    };
    var Vf = {}, Uf = {};
    xb.prototype = {
        chunkSize: function () {
            return this.lines.length
        },
        removeInner: function (a, b) {
            for (var c = a, d = a + b; c < d; ++c) {
                var e = this.lines[c];
                this.height = this.height - e.height;
                var f = e;
                f.parent = null;
                Le(f);
                H(e, "delete")
            }
            this.lines.splice(a, b)
        }, collapse: function (a) {
            a.push.apply(a, this.lines)
        }, insertInner: function (a, b, c) {
            this.height = this.height + c;
            this.lines = this.lines.slice(0, a).concat(b).concat(this.lines.slice(a));
            for (a = 0; a < b.length; ++a)b[a].parent = this
        }, iterN: function (a, b, c) {
            for (b = a + b; a < b; ++a)if (c(this.lines[a]))return true
        }
    };
    yb.prototype = {
        chunkSize: function () {
            return this.size
        },
        removeInner: function (a, b) {
            this.size = this.size - b;
            for (var c = 0; c < this.children.length; ++c) {
                var d = this.children[c], e = d.chunkSize();
                if (a < e) {
                    var f = Math.min(b, e - a), g = d.height;
                    d.removeInner(a, f);
                    this.height = this.height - (g - d.height);
                    if (e == f) {
                        this.children.splice(c--, 1);
                        d.parent = null
                    }
                    if ((b = b - f) == 0)break;
                    a = 0
                } else a = a - e
            }
            if (this.size - b < 25 && (this.children.length > 1 || !(this.children[0]instanceof xb))) {
                c = [];
                this.collapse(c);
                this.children = [new xb(c)];
                this.children[0].parent = this
            }
        }, collapse: function (a) {
            for (var b = 0; b <
            this.children.length; ++b)this.children[b].collapse(a)
        }, insertInner: function (a, b, c) {
            this.size = this.size + b.length;
            this.height = this.height + c;
            for (var d = 0; d < this.children.length; ++d) {
                var e = this.children[d], f = e.chunkSize();
                if (a <= f) {
                    e.insertInner(a, b, c);
                    if (e.lines && e.lines.length > 50) {
                        for (; e.lines.length > 50;) {
                            a = e.lines.splice(e.lines.length - 25, 25);
                            a = new xb(a);
                            e.height = e.height - a.height;
                            this.children.splice(d + 1, 0, a);
                            a.parent = this
                        }
                        this.maybeSpill()
                    }
                    break
                }
                a = a - f
            }
        }, maybeSpill: function () {
            if (!(this.children.length <=
                10)) {
                var a = this;
                do {
                    var b = a.children.splice(a.children.length - 5, 5), b = new yb(b);
                    if (a.parent) {
                        a.size = a.size - b.size;
                        a.height = a.height - b.height;
                        var c = G(a.parent.children, a);
                        a.parent.children.splice(c + 1, 0, b)
                    } else {
                        c = new yb(a.children);
                        c.parent = a;
                        a.children = [c, b];
                        a = c
                    }
                    b.parent = a.parent
                } while (a.children.length > 10);
                a.parent.maybeSpill()
            }
        }, iterN: function (a, b, c) {
            for (var d = 0; d < this.children.length; ++d) {
                var e = this.children[d], f = e.chunkSize();
                if (a < f) {
                    f = Math.min(b, f - a);
                    if (e.iterN(a, f, c))return true;
                    if ((b = b - f) == 0)break;
                    a = 0
                } else a = a - f
            }
        }
    };
    var hg = 0, M = m.Doc = function (a, b, c) {
        if (!(this instanceof M))return new M(a, b, c);
        c == null && (c = 0);
        yb.call(this, [new xb([new wb("", null)])]);
        this.first = c;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.frontier = c;
        c = o(c, 0);
        this.sel = ba(c);
        this.history = new pc(null);
        this.id = ++hg;
        this.modeOption = b;
        typeof a == "string" && (a = oa(a));
        hd(this, {from: c, to: c, text: a});
        A(this, ba(c), ca)
    };
    M.prototype = Ze(yb.prototype, {
        constructor: M, iter: function (a, b, c) {
            c ? this.iterN(a - this.first,
                b - a, c) : this.iterN(this.first, this.first + this.size, a)
        }, insert: function (a, b) {
            for (var c = 0, d = 0; d < b.length; ++d)c = c + b[d].height;
            this.insertInner(a - this.first, b, c)
        }, remove: function (a, b) {
            this.removeInner(a - this.first, b)
        }, getValue: function (a) {
            var b = pd(this, this.first, this.first + this.size);
            return a === false ? b : b.join(a || "\n")
        }, setValue: K(function (a) {
            var b = o(this.first, 0), c = this.first + this.size - 1;
            Ka(this, {from: b, to: o(c, r(this, c).text.length), text: oa(a), origin: "setValue", full: true}, true);
            A(this, ba(b))
        }), replaceRange: function (a,
                                    b, c, d) {
            b = t(this, b);
            c = c ? t(this, c) : b;
            sb(this, a, b, c, d)
        }, getRange: function (a, b, c) {
            a = za(this, t(this, a), t(this, b));
            return c === false ? a : a.join(c || "\n")
        }, getLine: function (a) {
            return (a = this.getLineHandle(a)) && a.text
        }, getLineHandle: function (a) {
            if (mb(this, a))return r(this, a)
        }, getLineNumber: function (a) {
            return C(a)
        }, getLineHandleVisualStart: function (a) {
            typeof a == "number" && (a = r(this, a));
            return da(a)
        }, lineCount: function () {
            return this.size
        }, firstLine: function () {
            return this.first
        }, lastLine: function () {
            return this.first +
                this.size - 1
        }, clipPos: function (a) {
            return t(this, a)
        }, getCursor: function (a) {
            var b = this.sel.primary();
            return a == null || a == "head" ? b.head : a == "anchor" ? b.anchor : a == "end" || a == "to" || a === false ? b.to() : b.from()
        }, listSelections: function () {
            return this.sel.ranges
        }, somethingSelected: function () {
            return this.sel.somethingSelected()
        }, setCursor: K(function (a, b, c) {
            a = t(this, typeof a == "number" ? o(a, b || 0) : a);
            A(this, ba(a, null), c)
        }), setSelection: K(function (a, b, c) {
            var d = t(this, a), a = t(this, b || a);
            A(this, ba(d, a), c)
        }), extendSelection: K(function (a,
                                         b, c) {
            Qb(this, t(this, a), b && t(this, b), c)
        }), extendSelections: K(function (a) {
            for (var b = [], c = 0; c < a.length; c++)b[c] = t(this, a[c]);
            Td(this, b)
        }), extendSelectionsBy: K(function (a, b) {
            Td(this, kb(this.sel.ranges, a), b)
        }), setSelections: K(function (a, b, c) {
            if (a.length) {
                for (var d = 0, e = []; d < a.length; d++)e[d] = new w(t(this, a[d].anchor), t(this, a[d].head));
                b == null && (b = Math.min(a.length - 1, this.sel.primIndex));
                A(this, W(e, b), c)
            }
        }), addSelection: K(function (a, b, c) {
            var d = this.sel.ranges.slice(0);
            d.push(new w(t(this, a), t(this, b || a)));
            A(this, W(d, d.length - 1), c)
        }), getSelection: function (a) {
            for (var b = this.sel.ranges, c, d = 0; d < b.length; d++) {
                var e = za(this, b[d].from(), b[d].to());
                c = c ? c.concat(e) : e
            }
            return a === false ? c : c.join(a || "\n")
        }, getSelections: function (a) {
            for (var b = [], c = this.sel.ranges, d = 0; d < c.length; d++) {
                var e = za(this, c[d].from(), c[d].to());
                a !== false && (e = e.join(a || "\n"));
                b[d] = e
            }
            return b
        }, replaceSelection: function (a, b, c) {
            for (var d = [], e = 0; e < this.sel.ranges.length; e++)d[e] = a;
            this.replaceSelections(d, b, c || "+input")
        }, replaceSelections: K(function (a,
                                          b, c) {
            for (var d = [], e = this.sel, f = 0; f < e.ranges.length; f++) {
                var g = e.ranges[f];
                d[f] = {from: g.from(), to: g.to(), text: oa(a[f]), origin: c}
            }
            if (f = b)if (f = b != "end") {
                f = [];
                c = a = o(this.first, 0);
                for (e = 0; e < d.length; e++) {
                    var h = d[e], g = we(h.from, a, c), i = we(pa(h), a, c), a = h.to, c = i;
                    if (b == "around") {
                        h = this.sel.ranges[e];
                        h = v(h.head, h.anchor) < 0;
                        f[e] = new w(h ? i : g, h ? g : i)
                    } else f[e] = new w(g, g)
                }
                f = new ha(f, this.sel.primIndex)
            }
            b = f;
            for (f = d.length - 1; f >= 0; f--)Ka(this, d[f]);
            b ? Ud(this, b) : this.cm && La(this.cm)
        }), undo: K(function () {
            gc(this, "undo")
        }),
        redo: K(function () {
            gc(this, "redo")
        }), undoSelection: K(function () {
            gc(this, "undo", true)
        }), redoSelection: K(function () {
            gc(this, "redo", true)
        }), setExtending: function (a) {
            this.extend = a
        }, getExtending: function () {
            return this.extend
        }, historySize: function () {
            for (var a = this.history, b = 0, c = 0, d = 0; d < a.done.length; d++)a.done[d].ranges || ++b;
            for (d = 0; d < a.undone.length; d++)a.undone[d].ranges || ++c;
            return {undo: b, redo: c}
        }, clearHistory: function () {
            this.history = new pc(this.history.maxGeneration)
        }, markClean: function () {
            this.cleanGeneration =
                this.changeGeneration(true)
        }, changeGeneration: function (a) {
            if (a)this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
            return this.history.generation
        }, isClean: function (a) {
            return this.history.generation == (a || this.cleanGeneration)
        }, getHistory: function () {
            return {done: Ta(this.history.done), undone: Ta(this.history.undone)}
        }, setHistory: function (a) {
            var b = this.history = new pc(this.history.maxGeneration);
            b.done = Ta(a.done.slice(0), null, true);
            b.undone = Ta(a.undone.slice(0), null, true)
        }, addLineClass: K(function (a,
                                     b, c) {
            return ic(this, a, b == "gutter" ? "gutter" : "class", function (a) {
                var e = b == "text" ? "textClass" : b == "background" ? "bgClass" : b == "gutter" ? "gutterClass" : "wrapClass";
                if (a[e]) {
                    if (Bb(c).test(a[e]))return false;
                    a[e] = a[e] + (" " + c)
                } else a[e] = c;
                return true
            })
        }), removeLineClass: K(function (a, b, c) {
            return ic(this, a, b == "gutter" ? "gutter" : "class", function (a) {
                var e = b == "text" ? "textClass" : b == "background" ? "bgClass" : b == "gutter" ? "gutterClass" : "wrapClass", f = a[e];
                if (f)if (c == null)a[e] = null; else {
                    var g = f.match(Bb(c));
                    if (!g)return false;
                    var h = g.index + g[0].length;
                    a[e] = f.slice(0, g.index) + (!g.index || h == f.length ? "" : " ") + f.slice(h) || null
                } else return false;
                return true
            })
        }), addLineWidget: K(function (a, b, c) {
            return Tf(this, a, b, c)
        }), removeLineWidget: function (a) {
            a.clear()
        }, markText: function (a, b, c) {
            return Sa(this, t(this, a), t(this, b), c, "range")
        }, setBookmark: function (a, b) {
            var c = {
                replacedWith: b && (b.nodeType == null ? b.widget : b),
                insertLeft: b && b.insertLeft,
                clearWhenEmpty: false,
                shared: b && b.shared,
                handleMouseEvents: b && b.handleMouseEvents
            }, a = t(this, a);
            return Sa(this,
                a, a, c, "bookmark")
        }, findMarksAt: function (a) {
            var a = t(this, a), b = [], c = r(this, a.line).markedSpans;
            if (c)for (var d = 0; d < c.length; ++d) {
                var e = c[d];
                if ((e.from == null || e.from <= a.ch) && (e.to == null || e.to >= a.ch))b.push(e.marker.parent || e.marker)
            }
            return b
        }, findMarks: function (a, b, c) {
            var a = t(this, a), b = t(this, b), d = [], e = a.line;
            this.iter(a.line, b.line + 1, function (f) {
                if (f = f.markedSpans)for (var g = 0; g < f.length; g++) {
                    var h = f[g];
                    if (!(e == a.line && a.ch > h.to || h.from == null && e != a.line || e == b.line && h.from > b.ch) && (!c || c(h.marker)))d.push(h.marker.parent ||
                        h.marker)
                }
                ++e
            });
            return d
        }, getAllMarks: function () {
            var a = [];
            this.iter(function (b) {
                if (b = b.markedSpans)for (var c = 0; c < b.length; ++c)b[c].from != null && a.push(b[c].marker)
            });
            return a
        }, posFromIndex: function (a) {
            var b, c = this.first;
            this.iter(function (d) {
                d = d.text.length + 1;
                if (d > a) {
                    b = a;
                    return true
                }
                a = a - d;
                ++c
            });
            return t(this, o(c, b))
        }, indexFromPos: function (a) {
            var a = t(this, a), b = a.ch;
            if (a.line < this.first || a.ch < 0)return 0;
            this.iter(this.first, a.line, function (a) {
                b = b + (a.text.length + 1)
            });
            return b
        }, copy: function (a) {
            var b =
                new M(pd(this, this.first, this.first + this.size), this.modeOption, this.first);
            b.scrollTop = this.scrollTop;
            b.scrollLeft = this.scrollLeft;
            b.sel = this.sel;
            b.extend = false;
            if (a) {
                b.history.undoDepth = this.history.undoDepth;
                b.setHistory(this.getHistory())
            }
            return b
        }, linkedDoc: function (a) {
            a || (a = {});
            var b = this.first, c = this.first + this.size;
            if (a.from != null && a.from > b)b = a.from;
            if (a.to != null && a.to < c)c = a.to;
            b = new M(pd(this, b, c), a.mode || this.modeOption, b);
            if (a.sharedHist)b.history = this.history;
            (this.linked || (this.linked =
                [])).push({doc: b, sharedHist: a.sharedHist});
            b.linked = [{doc: this, isParent: true, sharedHist: a.sharedHist}];
            a = Je(this);
            for (c = 0; c < a.length; c++) {
                var d = a[c], e = d.find(), f = b.clipPos(e.from), e = b.clipPos(e.to);
                if (v(f, e)) {
                    f = Sa(b, f, e, d.primary, d.primary.type);
                    d.markers.push(f);
                    f.parent = d
                }
            }
            return b
        }, unlinkDoc: function (a) {
            if (a instanceof m)a = a.doc;
            if (this.linked)for (var b = 0; b < this.linked.length; ++b)if (this.linked[b].doc == a) {
                this.linked.splice(b, 1);
                a.unlinkDoc(this);
                Rf(Je(this));
                break
            }
            if (a.history == this.history) {
                var c =
                    [a.id];
                Ca(a, function (a) {
                    c.push(a.id)
                }, true);
                a.history = new pc(null);
                a.history.done = Ta(this.history.done, c);
                a.history.undone = Ta(this.history.undone, c)
            }
        }, iterLinkedDocs: function (a) {
            Ca(this, a)
        }, getMode: function () {
            return this.mode
        }, getEditor: function () {
            return this.cm
        }
    });
    M.prototype.eachLine = M.prototype.iter;
    var ig = ["iter", "insert", "remove", "copy", "getEditor"], Fb;
    for (Fb in M.prototype)M.prototype.hasOwnProperty(Fb) && 0 > G(ig, Fb) && (m.prototype[Fb] = function (a) {
        return function () {
            return a.apply(this.doc, arguments)
        }
    }(M.prototype[Fb]));
    Ua(M);
    var L = m.e_preventDefault = function (a) {
        a.preventDefault ? a.preventDefault() : a.returnValue = false
    }, jg = m.e_stopPropagation = function (a) {
        a.stopPropagation ? a.stopPropagation() : a.cancelBubble = true
    }, ad = m.e_stop = function (a) {
        L(a);
        jg(a)
    }, p = m.on = function (a, b, c) {
        if (a.addEventListener)a.addEventListener(b, c, false); else if (a.attachEvent)a.attachEvent("on" + b, c); else {
            a = a._handlers || (a._handlers = {});
            (a[b] || (a[b] = [])).push(c)
        }
    }, fa = m.off = function (a, b, c) {
        if (a.removeEventListener)a.removeEventListener(b, c, false); else if (a.detachEvent)a.detachEvent("on" +
            b, c); else if (a = a._handlers && a._handlers[b])for (b = 0; b < a.length; ++b)if (a[b] == c) {
            a.splice(b, 1);
            break
        }
    }, F = m.signal = function (a, b) {
        var c = a._handlers && a._handlers[b];
        if (c)for (var d = Array.prototype.slice.call(arguments, 2), e = 0; e < c.length; ++e)c[e].apply(null, d)
    }, zb = null, zd = 30, se = m.Pass = {
        toString: function () {
            return "CodeMirror.Pass"
        }
    }, ca = {scroll: !1}, bd = {origin: "*mouse"}, Cb = {origin: "+move"};
    Ya.prototype.set = function (a, b) {
        clearTimeout(this.id);
        this.id = setTimeout(b, a)
    };
    var X = m.countColumn = function (a, b, c, d, e) {
        if (b ==
            null) {
            b = a.search(/[^\s\u00a0]/);
            if (b == -1)b = a.length
        }
        d = d || 0;
        for (e = e || 0; ;) {
            var f = a.indexOf("\t", d);
            if (f < 0 || f >= b)return e + (b - d);
            e = e + (f - d);
            e = e + (c - e % c);
            d = f + 1
        }
    }, qc = [""], Va = function (a) {
        a.select()
    };
    Ma ? Va = function (a) {
        a.selectionStart = 0;
        a.selectionEnd = a.value.length
    } : y && (Va = function (a) {
        try {
            a.select()
        } catch (b) {
        }
    });
    var kg = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/, $e = m.isWordChar = function (a) {
            return /\w/.test(a) || a > "" && (a.toUpperCase() != a.toLowerCase() ||
                kg.test(a))
        }, bg = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/,
        Aa;
    Aa = document.createRange ? function (a, b, c, d) {
        var e = document.createRange();
        e.setEnd(d || a, c);
        e.setStart(a, b);
        return e
    } : function (a, b, c) {
        var d = document.body.createTextRange();
        try {
            d.moveToElementText(a.parentNode)
        } catch (e) {
            return d
        }
        d.collapse(true);
        d.moveEnd("character", c);
        d.moveStart("character", b);
        return d
    };
    var Oc = m.contains = function (a, b) {
        if (b.nodeType == 3)b = b.parentNode;
        if (a.contains)return a.contains(b);
        do {
            if (b.nodeType == 11)b = b.host;
            if (b == a)return true
        } while (b = b.parentNode)
    };
    y && 11 > z && (aa = function () {
        try {
            return document.activeElement
        } catch (a) {
            return document.body
        }
    });
    var gb = m.rmClass = function (a, b) {
        var c = a.className, d = Bb(b).exec(c);
        if (d) {
            var e = c.slice(d.index + d[0].length);
            a.className = c.slice(0, d.index) + (e ? d[1] + e : "")
        }
    }, ib = m.addClass = function (a, b) {
        var c = a.className;
        if (!Bb(b).test(c))a.className = a.className + ((c ? " " : "") + b)
    }, vd = !1, Ef = function () {
        if (y && z < 9)return false;
        var a = q("div");
        return "draggable"in a || "dragDrop"in a
    }(), qd, nd, oa = m.splitLines = 3 != "\n\nb".split(/\n/).length ? function (a) {
        for (var b = 0, c = [], d = a.length; b <= d;) {
            var e = a.indexOf("\n", b);
            if (e == -1)e = a.length;
            var f =
                a.slice(b, a.charAt(e - 1) == "\r" ? e - 1 : e), g = f.indexOf("\r");
            if (g != -1) {
                c.push(f.slice(0, g));
                b = b + (g + 1)
            } else {
                c.push(f);
                b = e + 1
            }
        }
        return c
    } : function (a) {
        return a.split(/\r\n?|\n/)
    }, gg = window.getSelection ? function (a) {
        try {
            return a.selectionStart != a.selectionEnd
        } catch (b) {
            return false
        }
    } : function (a) {
        try {
            var b = a.ownerDocument.selection.createRange()
        } catch (c) {
        }
        return !b || b.parentElement() != a ? false : b.compareEndPoints("StartToEnd", b) != 0
    }, ue = function () {
        var a = q("div");
        if ("oncopy"in a)return true;
        a.setAttribute("oncopy", "return;");
        return typeof a.oncopy == "function"
    }(), Uc = null, ra = {
        3: "Enter",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        107: "=",
        109: "-",
        127: "Delete",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
    };
    m.keyNames = ra;
    (function () {
        for (var a = 0; a < 10; a++)ra[a + 48] = ra[a + 96] = "" + a;
        for (a = 65; a <= 90; a++)ra[a] = String.fromCharCode(a);
        for (a = 1; a <= 12; a++)ra[a + 111] = ra[a + 63235] = "F" + a
    })();
    var rb, $f = function () {
        function a(a) {
            return a <= 247 ? c.charAt(a) : 1424 <= a && a <= 1524 ? "R" : 1536 <= a && a <= 1773 ? d.charAt(a - 1536) : 1774 <= a && a <= 2220 ? "r" : 8192 <= a && a <= 8203 ? "w" : a == 8204 ? "b" : "L"
        }

        function b(a, b, c) {
            this.level = a;
            this.from = b;
            this.to = c
        }

        var c = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",
            d = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm", e = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, f = /[stwN]/, g = /[LRr]/, h = /[Lb1n]/, i = /[1n]/;
        return function (c) {
            if (!e.test(c))return false;
            for (var d = c.length, n = [], l = 0, m; l < d; ++l)n.push(a(c.charCodeAt(l)));
            for (var l = 0, o = "L"; l < d; ++l) {
                m = n[l];
                m == "m" ? n[l] = o : o = m
            }
            l = 0;
            for (o =
                     "L"; l < d; ++l) {
                m = n[l];
                if (m == "1" && o == "r")n[l] = "n"; else if (g.test(m)) {
                    o = m;
                    m == "r" && (n[l] = "R")
                }
            }
            l = 1;
            for (o = n[0]; l < d - 1; ++l) {
                m = n[l];
                if (m == "+" && o == "1" && n[l + 1] == "1")n[l] = "1"; else if (m == "," && o == n[l + 1] && (o == "1" || o == "n"))n[l] = o;
                o = m
            }
            for (l = 0; l < d; ++l) {
                m = n[l];
                if (m == ",")n[l] = "N"; else if (m == "%") {
                    for (o = l + 1; o < d && n[o] == "%"; ++o);
                    var p = l && n[l - 1] == "!" || o < d && n[o] == "1" ? "1" : "N";
                    for (m = l; m < o; ++m)n[m] = p;
                    l = o - 1
                }
            }
            l = 0;
            for (o = "L"; l < d; ++l) {
                m = n[l];
                o == "L" && m == "1" ? n[l] = "L" : g.test(m) && (o = m)
            }
            for (l = 0; l < d; ++l)if (f.test(n[l])) {
                for (o = l + 1; o < d &&
                f.test(n[o]); ++o);
                m = (o < d ? n[o] : "L") == "L";
                p = (l ? n[l - 1] : "L") == "L" || m ? "L" : "R";
                for (m = l; m < o; ++m)n[m] = p;
                l = o - 1
            }
            for (var o = [], q, l = 0; l < d;)if (h.test(n[l])) {
                m = l;
                for (++l; l < d && h.test(n[l]); ++l);
                o.push(new b(0, m, l))
            } else {
                var r = l, p = o.length;
                for (++l; l < d && n[l] != "L"; ++l);
                for (m = r; m < l;)if (i.test(n[m])) {
                    r < m && o.splice(p, 0, new b(1, r, m));
                    r = m;
                    for (++m; m < l && i.test(n[m]); ++m);
                    o.splice(p, 0, new b(2, r, m));
                    r = m
                } else++m;
                r < l && o.splice(p, 0, new b(1, r, l))
            }
            if (o[0].level == 1 && (q = c.match(/^\s+/))) {
                o[0].from = q[0].length;
                o.unshift(new b(0, 0, q[0].length))
            }
            if (x(o).level ==
                1 && (q = c.match(/\s+$/))) {
                x(o).to -= q[0].length;
                o.push(new b(0, d - q[0].length, d))
            }
            o[0].level == 2 && o.unshift(new b(1, o[0].to, o[0].to));
            o[0].level != x(o).level && o.push(new b(o[0].level, d, d));
            return o
        }
    }();
    m.version = "5.2.0";
    return m
});