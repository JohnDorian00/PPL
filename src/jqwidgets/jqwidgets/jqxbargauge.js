/*
jQWidgets v9.1.6 (2020-May)
Copyright (c) 2011-2020 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

﻿/* tslint:disable */
/* eslint-disable */
(function ($)
{
    'use strict';
    $.jqx.jqxWidget('jqxBarGauge', '', {});

    $.extend($.jqx._jqxBarGauge.prototype, {
        defineInstance: function ()
        {
            var settings = {
                animationDuration: 300,
                backgroundColor: '#e0e0e0',
                barSpacing: 4,
                baseValue: null,
                colorScheme: 'scheme01',
                customColorScheme: null,
                endAngle: -45,
                disabled: false,
                formatFunction: null,
                geometry: {
                    startAngle: 225,
                    endAngle: -45
                },
                height: 400,
                labels: null,
                min: 0,
                max: 100,
                rendered: null,
                relativeInnerRadius: 0.3,
                startAngle: 225,
                title: null,
                tooltip: null,
                values: [],
                width: 400,
                useGradient: true,
                // internal flag variables
                _intervalArray: [],
                _drawnValues: [],
                _drawnSlices: [],
                _titleTemplate: {
                    text: '',
                    font: {
                        color: '#232323',
                        family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                        opacity: 1,
                        size: 28,
                        weight: 100
                    },
                    horizontalAlignment: 'center',
                    verticalAlignment: 'top',
                    placeholderSize: null,
                    margin: {
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0
                    },
                    subtitle: {
                        text: '',
                        font: {
                            color: '#232323',
                            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                            opacity: 1,
                            size: 16,
                            weight: 100
                        }
                    }
                },
                _labelTemplate: {
                    connectorColor: null,
                    connectorWidth: 1,
                    formatFunction: function (value)
                    {
                        return value;
                    },
                    font: {
                        color: null,
                        family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                        size: 16,
                        weight: 400
                    },
                    indent: 20,
                    precision: 2,
                    visible: true
                },
                _tooltipTemplate: {
                    classname: '',
                    formatFunction: function (value)
                    {
                        return value;
                    },
                    visible: false,
                    precision: 0
                },
                _colorSchemes: [
                    { name: 'scheme01', colors: ['#307DD7', '#AA4643', '#89A54E', '#71588F', '#4198AF'] },
                    { name: 'scheme02', colors: ['#7FD13B', '#EA157A', '#FEB80A', '#00ADDC', '#738AC8'] },
                    { name: 'scheme03', colors: ['#E8601A', '#FF9639', '#F5BD6A', '#599994', '#115D6E'] },
                    { name: 'scheme04', colors: ['#D02841', '#FF7C41', '#FFC051', '#5B5F4D', '#364651'] },
                    { name: 'scheme05', colors: ['#25A0DA', '#309B46', '#8EBC00', '#FF7515', '#FFAE00'] },
                    { name: 'scheme06', colors: ['#0A3A4A', '#196674', '#33A6B2', '#9AC836', '#D0E64B'] },
                    { name: 'scheme07', colors: ['#CC6B32', '#FFAB48', '#FFE7AD', '#A7C9AE', '#888A63'] },
                    { name: 'scheme08', colors: ['#3F3943', '#01A2A6', '#29D9C2', '#BDF271', '#FFFFA6'] },
                    { name: 'scheme09', colors: ['#1B2B32', '#37646F', '#A3ABAF', '#E1E7E8', '#B22E2F'] },
                    { name: 'scheme10', colors: ['#5A4B53', '#9C3C58', '#DE2B5B', '#D86A41', '#D2A825'] },
                    { name: 'scheme11', colors: ['#993144', '#FFA257', '#CCA56A', '#ADA072', '#949681'] },
                    { name: 'scheme12', colors: ['#105B63', '#EEEAC5', '#FFD34E', '#DB9E36', '#BD4932'] },
                    { name: 'scheme13', colors: ['#BBEBBC', '#F0EE94', '#F5C465', '#FA7642', '#FF1E54'] },
                    { name: 'scheme14', colors: ['#60573E', '#F2EEAC', '#BFA575', '#A63841', '#BFB8A3'] },
                    { name: 'scheme15', colors: ['#444546', '#FFBB6E', '#F28D00', '#D94F00', '#7F203B'] },
                    { name: 'scheme16', colors: ['#583C39', '#674E49', '#948658', '#F0E99A', '#564E49'] },
                    { name: 'scheme17', colors: ['#142D58', '#447F6E', '#E1B65B', '#C8782A', '#9E3E17'] },
                    { name: 'scheme18', colors: ['#4D2B1F', '#635D61', '#7992A2', '#97BFD5', '#BFDCF5'] },
                    { name: 'scheme19', colors: ['#844341', '#D5CC92', '#BBA146', '#897B26', '#55591C'] },
                    { name: 'scheme20', colors: ['#56626B', '#6C9380', '#C0CA55', '#F07C6C', '#AD5472'] },
                    { name: 'scheme21', colors: ['#96003A', '#FF7347', '#FFBC7B', '#FF4154', '#642223'] },
                    { name: 'scheme22', colors: ['#5D7359', '#E0D697', '#D6AA5C', '#8C5430', '#661C0E'] },
                    { name: 'scheme23', colors: ['#16193B', '#35478C', '#4E7AC7', '#7FB2F0', '#ADD5F7'] },
                    { name: 'scheme24', colors: ['#7B1A25', '#BF5322', '#9DA860', '#CEA457', '#B67818'] },
                    { name: 'scheme25', colors: ['#0081DA', '#3AAFFF', '#99C900', '#FFEB3D', '#309B46'] },
                    { name: 'scheme26', colors: ['#0069A5', '#0098EE', '#7BD2F6', '#FFB800', '#FF6800'] },
                    { name: 'scheme27', colors: ['#FF6800', '#A0A700', '#FF8D00', '#678900', '#0069A5'] }
                ],
                _colors: ['#307DD7', '#AA4643', '#89A54E', '#71588F', '#4198AF'],
                _colorNames: {
                    'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff',
                    'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff', 'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887',
                    'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff',
                    'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f',
                    'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
                    'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dodgerblue': '#1e90ff',
                    'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff',
                    'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080', 'green': '#008000', 'greenyellow': '#adff2f',
                    'honeydew': '#f0fff0', 'hotpink': '#ff69b4',
                    'indianred ': '#cd5c5c', 'indigo': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c',
                    'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd', 'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2',
                    'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
                    'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6',
                    'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee',
                    'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970', 'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5',
                    'navajowhite': '#ffdead', 'navy': '#000080',
                    'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6',
                    'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080',
                    'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
                    'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57', 'seashell': '#fff5ee', 'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f', 'steelblue': '#4682b4',
                    'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0',
                    'violet': '#ee82ee',
                    'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5',
                    'yellow': '#ffff00', 'yellowgreen': '#9acd32'
                },
                _dimensions: {},
                _ie: $.jqx.browser.msie,
                _oldIEbrowser: ($.jqx.browser.msie && $.jqx.browser.version <= 8),
                _ie8: ($.jqx.browser.msie && $.jqx.browser.version == 8),
                _ie7: ($.jqx.browser.msie && $.jqx.browser.version < 8),
                _centerX: null,
                _centerY: null,
                _coordinatePlane: null,
                _geometry: {
                    startAngle: -45,
                    baseAngle: -45,
                    fix: 0,
                    endAngle: 225
                },
                _userValues: [],
                _valuesToDegrees: [],
                _oldValues: [],
                _oldValuesToDegrees: [],
                _temporaryValuesToDegrees: [],
                _temporaryValues: [],
                _temporaryOldAngle: [],
                _valuesLength: 0,
                _oldValuesLength: 0,
                _alignmentIE: null,
                _title: {},
                _backgroundColor: '#e0e0e0',
                _label: {},
                _tooltip: {},
                _renderedValues: 0,
                _barWidth: 35,
                _barStartAt: 30,
                _barGaugeSlices: [],
                _barGaugeBackgroundSlices: [],
                _barGaugeSlicesStrokeWidth: 0,
                _barGaugeLabelLines: [],
                _barGaugeLabelText: [],
                _barGaugeTitle: null,
                _barGaugeSubTitle: null,
                _barGaugeTooltip: $('<div></div>'),
                _measuredText: $("<div class='jqx-bar-gauge-measure-text'></div>"),
                _measuredTextId: '',
                renderer: null,
                _barGaugeRadius: null,
                _barGaugeFigureRadius: null,
                _labelPositioningRadius: null,
                _placeholderSize: 50,
                _rendering: false,
                _titleLines: 0,
                _subTitleLines: 0,
                _initialized: false,

                // events
                _events: ['initialized', 'valueChanged', 'tooltipOpen', 'tooltipClose', 'drawStart', 'drawEnd']
            };
            if (this === $.jqx._jqxBarGauge.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function ()
        {
            var that = this;
            that._createBarGauge();
        },

        _createBarGauge: function ()
        {
            var that = this;

            that._getLiquidDimensions();
            that._addIEPolyfills();
            that._barGaugeTooltip.css({ display: 'none' });
            $(that.host).empty();
            that._attachCustomColors();
            that.geometry.startAngle = that.startAngle;
            that.geometry.endAngle = that.endAngle;

            that._validateGeometry();
            that._validateTitle();
            that._validateLabel();
            that._validateValues();
            that._validateTooltip();
            that._validateAnimationDuration();
            that._transformValuesToAngles();
            that._getColorScheme();

            if ((that.animationDuration === 0) || (that._ie8) || (that._ie7))
            {
                that._drawStaticBarGauge();
            } else
            {
                that._drawDynamicBarGauge();
            }

            that._raiseEvent('4');
            that._createTooltip();
            that._addCSS();
            //  that._drawCoordinatePlane();

            if (that._ie)
            {
                that._removeBarGaugeTitle();
                that._removeBarGaugeSubTitle();
                that._drawBarGaugeTitle();
            }

            that._addEventHandlers();
        },

        _initRenderer: function (host)
        {
            if (!$.jqx.createRenderer)
            {
                throw 'jqxBarGauge: Please include a reference to jqxdraw.js';
            }
            return $.jqx.createRenderer(this, host);
        },

        _validateValues: function ()
        {
            var that = this;
            var valuesLength,
                maxBarSpacing;

            if (that._userValues.length === 0)
            {
                that._userValues = that.values.slice();
            }

            if (that._oldValues.length === 0)
            {
                that._oldValues = that.values.slice();
            }

            that._valuesLength = that.values.length;
            for (var i = 0; i < that._valuesLength; i++)
            {
                that.values[i] = parseFloat(that.values[i]);
                if ((that.values[i] < that.startValue) || (isNaN(that.values[i])))
                {
                    that.values[i] = that.startValue;
                } else if (that.values[i] > that.max)
                {
                    that.values[i] = that.max;
                }

                that._drawnValues[i] = false;
                that._drawnSlices[i] = false;
            }

            if ((that.baseValue <= that.startValue) || (that.baseValue === null))
            {
                that.baseValue = that.min;
            } else if (that.baseValue > that.max)
            {
                that.baseValue = that.max;
            }

            if (that.relativeInnerRadius >= 1)
            {
                that.relativeInnerRadius = 0.99;
            } else if (that.relativeInnerRadius < 0)
            {
                that.relativeInnerRadius = 0;
            }

            that._calculateBarGaugeRadius();
            valuesLength = that._valuesLength || 1;
            maxBarSpacing = that._barGaugeRadius * (1 - that.relativeInnerRadius) / valuesLength - 0.01;
            if (that.barSpacing > maxBarSpacing)
            {
                that.barSpacing = maxBarSpacing;
            }

            that._backgroundColor = that._validateColor(that.backgroundColor, that._backgroundColor);
        },

        _attachCustomColors: function ()
        {
            var that = this;
            var colorSchemesLength = that._colorSchemes.length;
            var colorSchemeInSchemes = false;

            if ((that.customColorScheme !== null) && (that.customColorScheme.colors !== null) && (that.customColorScheme.name !== null))
            {
                for (var i = 0; i < colorSchemesLength; i++)
                {
                    if (that.customColorScheme.name === that._colorSchemes[i].name)
                    {
                        that._colorSchemes[i].colors = that.customColorScheme.colors.slice();
                        colorSchemeInSchemes = true;
                    }
                }

                if (!colorSchemeInSchemes)
                {
                    that._colorSchemes.push(that.customColorScheme);
                }
            }
        },

        _getLiquidDimensions: function ()
        {
            var that = this;

            if ($.isEmptyObject(that._dimensions))
            {
                that._dimensions.width = that.width;
                that._dimensions.height = that.height;
            }

            if (typeof that._dimensions.width === 'string' && that._dimensions.width.indexOf('%') !== -1)
            {
                that.width = (parseInt(that._dimensions.width, 10) / 100) * $('#' + that.element.id).parent().width();
            }

            if (typeof that._dimensions.height === 'string' && that._dimensions.height.indexOf('%') !== -1)
            {
                that.height = (parseInt(that._dimensions.height, 10) / 100) * $('#' + that.element.id).parent().height();
            }
        },

        _getLongestValue: function ()
        {
            var that = this;
            var valuesCount = that.values.length,
                longestValue = "",
                longestValueLength = 0;

            for (var i = 0; i < valuesCount; i++)
            {
                if (that.values[i].toString().length > longestValueLength)
                {
                    longestValue = that.values[i];
                    longestValueLength = longestValue.toString().length;
                }
            }

            longestValue = that._calculatePrecision(that._label.precision, longestValue);
            if ((that._label.formatFunction !== undefined) && (that._label.formatFunction !== null) && (typeof that._label.formatFunction === 'function'))
            {
                longestValue = that._label.formatFunction(longestValue);
            }
            longestValue = longestValue.toUpperCase();

            return longestValue;
        },

        _validateGeometry: function ()
        {
            var that = this;
            var startAngle = parseFloat(that.geometry.startAngle);
            var endAngle = parseFloat(that.geometry.endAngle);

            if (Math.abs(startAngle) >= 360)
            {
                startAngle = startAngle % 360;
            }
            if (startAngle < 0)
            {
                startAngle = 360 + startAngle;
            }

            if (Math.abs(endAngle) >= 360)
            {
                endAngle = endAngle % 360;
            }
            if (endAngle < 0)
            {
                endAngle = 360 + endAngle;
            }

            that.geometry.startAngle = startAngle;
            that.geometry.endAngle = endAngle;
        },

        _validateColor: function (color, defaultColor)
        {
            var that = this;
            var validatedColor;

            if ((color === undefined) || (color === null))
            {
                validatedColor = defaultColor;
            } else if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color))
            {
                validatedColor = color;
            } else if (/(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(color))
            {
                validatedColor = '#' + color;
            } else if (typeof that._colorNames[color.toLowerCase()] !== 'undefined')
            {
                validatedColor = that._colorNames[color.toLowerCase()];
            } else
            {
                validatedColor = 'transparent';
            }

            return validatedColor;
        },

        _validateTooltip: function ()
        {
            var that = this;

            if ((that.tooltip === undefined) || (that.tooltip === null) || (typeof that.tooltip !== 'object'))
            {
                that._tooltip = that._tooltipTemplate;
            } else
            {
                that._tooltip.visible = (that.tooltip.visible === false) ? false : (that.tooltip.visible || that._tooltipTemplate.visible);
                that._tooltip.classname = that.tooltip.classname || that._tooltipTemplate.classname;

                if (typeof that.tooltip.formatFunction === 'function')
                {
                    that._tooltip.formatFunction = that.tooltip.formatFunction;
                } else
                {
                    that._tooltip.formatFunction = that._tooltipTemplate.formatFunction;
                }

                if (that.tooltip.precision === null || that.tooltip.precision === undefined)
                {
                    that._tooltip.precision = that._tooltipTemplate.precision;
                } else if (parseInt(that.tooltip.precision, 10) <= 0)
                {
                    that._tooltip.precision = 0;
                } else
                {
                    that._tooltip.precision = parseInt(that.tooltip.precision, 10);
                }
            }
        },

        _validateTitle: function ()
        {
            var that = this;
            that._title = that._titleTemplate;
            that._measuredTextId = that.element.id + 'measuredText';

            if (typeof that.title === 'string')
            {
                that._title.text = that.title;
            } else if (typeof that.title === 'number')
            {
                that._title.text = String(that.title);
            } else if ((typeof that.title === 'object') && (that.title !== undefined) && (that.title !== null))
            {
                that._title.text = that.title.text || that._titleTemplate.text;
                that._title.horizontalAlignment = that.title.horizontalAlignment || that._titleTemplate.horizontalAlignment;
                that._title.verticalAlignment = that.title.verticalAlignment || that._titleTemplate.verticalAlignment;
            }

            if ((that.title === undefined) || (that.title === null) || (that.title.font === undefined) || (that.title.font === null))
            {
                that._title.font = that._titleTemplate.font;
            } else
            {
                that._title.font.family = that.title.font.family || that._titleTemplate.font.family;
                that._title.font.opacity = that.title.font.opacity || that._titleTemplate.font.opacity;
                that._title.font.size = that.title.font.size || that._titleTemplate.font.size;
                that._title.font.weight = that.title.font.weight || that._titleTemplate.font.weight;
                if ((that._ie7 || that._ie8) && (that._title.font.weight > 100))
                {
                    that._title.font.weight = 'bold';
                }
                that._title.font.color = that._validateColor(that.title.font.color, that._titleTemplate.font.color);
            }

            if ((that.title === undefined) || (that.title === null) || (that.title.margin === undefined) || (that.title.margin === null))
            {
                that._title.margin = that._titleTemplate.margin;
            } else if (typeof that.title.margin !== 'object')
            {
                var margin = parseInt(that.title.margin, 10);
                that._title.margin.top = margin;
                that._title.margin.right = margin;
                that._title.margin.bottom = margin;
                that._title.margin.left = margin;
            } else
            {
                that._title.margin.top = that.title.margin.top === 0 ? 0 : (that.title.margin.top || that._titleTemplate.margin.top);
                that._title.margin.right = that.title.margin.right === 0 ? 0 : (that.title.margin.right || that._titleTemplate.margin.right);
                that._title.margin.bottom = that.title.margin.bottom === 0 ? 0 : (that.title.margin.bottom || that._titleTemplate.margin.bottom);
                that._title.margin.left = that.title.margin.left === 0 ? 0 : (that.title.margin.left || that._titleTemplate.margin.left);
            }

            if ((that.title === undefined) || (that.title === null) || (that.title.subtitle === undefined) || (that.title.subtitle === null))
            {
                that._title.subtitle.text = that._titleTemplate.subtitle.text;
                that._title.subtitle.font = that._titleTemplate.subtitle.font;
            } else if (typeof that.title.subtitle !== 'object')
            {
                that._title.subtitle.text = String(that.title.subtitle);
                that._title.subtitle.font = that._titleTemplate.subtitle.font;
            } else if ((typeof that.title.subtitle.font === 'undefined') || (that.title.subtitle.font === null))
            {
                that._title.subtitle.text = String(that.title.subtitle.text);
                that._title.subtitle.font = that._titleTemplate.subtitle.font;
            } else
            {
                that._title.subtitle.text = String(that.title.subtitle.text);
                that._title.subtitle.font.color = that.title.subtitle.font.color || that._titleTemplate.subtitle.font.color;
                that._title.subtitle.font.family = that.title.subtitle.font.family || that._titleTemplate.subtitle.font.family;
                that._title.subtitle.font.opacity = that.title.subtitle.font.opacity || that._titleTemplate.subtitle.font.opacity;
                that._title.subtitle.font.size = that.title.subtitle.font.size || that._titleTemplate.subtitle.font.size;
                that._title.subtitle.font.weight = that.title.subtitle.font.weight || that._titleTemplate.subtitle.font.weight;
                if ((that._ie7 || that._ie8) && (that._title.subtitle.font.weight > 100))
                {
                    that._title.subtitle.font.weight = 'bold';
                }
            }

            var calculatedPlaceholderSize;
            if (that._title.text === '')
            {
                calculatedPlaceholderSize = 0;
            } else if ((that._title.subtitle.text === '') || (that._title.subtitle.text === undefined) || (that._title.subtitle.text === null))
            {
                that._titleLines = that._title.text.match(/<br>/g) !== null ? (that._title.text.match(/<br>/g).length + 1) : 1;
                calculatedPlaceholderSize = that._title.font.size * that._titleLines + that._title.margin.top + that._title.margin.bottom;
            } else
            {
                that._titleLines = that._title.text.match(/<br>/g) !== null ? (that._title.text.match(/<br>/g).length + 1) : 1;
                that._subTitleLines = that._title.subtitle.text.match(/<br>/g) !== null ? (that._title.text.match(/<br>/g).length + 1) : 1;
                calculatedPlaceholderSize = that._title.font.size * that._titleLines + that._title.subtitle.font.size * that._subTitleLines + that._title.margin.top + that._title.margin.bottom;
            }

            if ((that.title === undefined) || (that.title === null) || (that.title.placeholderSize === null) || (that.title.placeholderSize === undefined))
            {
                that._title.placeholderSize = calculatedPlaceholderSize || that.height * 0.05;
            } else
            {
                that._title.placeholderSize = that.title.placeholderSize;
            }
        },

        _validateLabel: function ()
        {
            var that = this;

            if ((that.labels === null) || (that.labels === undefined) || (typeof that.labels !== 'object'))
            {
                that._label = that._labelTemplate;
            } else
            {
                that._label.connectorColor = that._validateColor(that.labels.connectorColor, that._labelTemplate.connectorColor);
                that._label.connectorWidth = that.labels.connectorWidth || that._labelTemplate.connectorWidth;
                that._label.formatFunction = that.labels.formatFunction || that._labelTemplate.formatFunction;

                if ((that.labels.precision === undefined) || (that.labels.precision === null) || (typeof that.labels.precision !== 'number'))
                {
                    that._label.precision = that._labelTemplate.precision;
                } else
                {
                    that._label.precision = that.labels.precision;
                }

                if (that._label.precision > 15)
                {
                    that._label.precision = 15;
                } else if (that._label.precision < 0)
                {
                    that._label.precision = 0;
                }

                if ((that.labels.visible === undefined) || (that.labels.visible === null))
                {
                    that._label.visible = that._labelTemplate.visible;
                } else if (that.labels.visible === false)
                {
                    that._label.visible = false;
                } else
                {
                    that._label.visible = true;
                }

                if (((typeof that.labels.indent !== 'number') && (typeof that.labels.indent !== 'string')) || (that.labels.indent <= 0))
                {
                    that._label.indent = 0;
                } else if (((typeof that.labels.indent !== 'number') && (typeof that.labels.indent !== 'string')) || (that.labels.indent <= 0))
                {
                    that._label.indent = 0;
                } else
                {
                    that._label.indent = that.labels.indent;
                }

                if ((that.labels.font === null) || (that.labels.font === undefined) || (typeof that.labels.font !== 'object'))
                {
                    that._label.font = that._labelTemplate.font;
                } else
                {
                    that._label.font = {};
                    that._label.font.color = that._validateColor(that.labels.font.color, that._labelTemplate.font.color);
                    that._label.font.family = that.labels.font.family || that._labelTemplate.font.family;
                    that._label.font.size = that.labels.font.size || that._labelTemplate.font.size;
                    that._label.font.weight = that.labels.font.weight || that._labelTemplate.font.weight;
                    if ((that._ie7 || that._ie8) && (that._label.font.weight > 100))
                    {
                        that._label.font.weight = 'bold';
                    }
                }
            }
        },

        _validateAnimationDuration: function ()
        {
            var that = this;
            var animationDurationToInt = parseInt(that.animationDuration, 10);
            var animationDuration = animationDurationToInt > 0 ? animationDurationToInt : 0;
            if (that._oldIEbrowser)
            {
                that.animationDuration = 0;
            } else
            {
                that.animationDuration = animationDuration;
            }
        },

        _transformValuesToAngles: function ()
        {
            var that = this;
            var barGaugeAngle,
                longestValue,
                textSize,
                barGaugeFigureRadius;
            that._placeholderSize = that._title.placeholderSize || that._placeholderSize;

            if (that.geometry.endAngle < that.geometry.startAngle)
            {
                that._geometry.startAngle = parseFloat(that.geometry.endAngle) % 360;
                that._geometry.endAngle = parseFloat(that.geometry.startAngle) % 360;
            } else
            {
                that._geometry.startAngle = parseFloat(that.geometry.endAngle) % 360 - 360;
                that._geometry.endAngle = parseFloat(that.geometry.startAngle) % 360;
            }

            barGaugeAngle = that._geometry.endAngle - that._geometry.startAngle;
            if (barGaugeAngle > 360)
            {
                that._geometry.startAngle = that._geometry.startAngle + (barGaugeAngle - 360);
            }

            if ((that.baseValue !== undefined) && (that.baseValue !== null) && (that.baseValue >= that.min) && (that.baseValue <= that.max))
            {
                that._geometry.baseAngle = ((that.baseValue - that.min) * (that._geometry.endAngle - that._geometry.startAngle) / (that.max - that.min)) + that._geometry.startAngle;
                that._geometry.fix = that.geometry.startAngle + that.geometry.endAngle - 180;
            }

            longestValue = that._getLongestValue();
            textSize = that._measureText(longestValue, that._label.font.size, that._label.font.family, that._label.font.weight);
            barGaugeFigureRadius = that._barGaugeRadius - that._label.indent * 1.2 - textSize.height * 1.2;
            if ((barGaugeFigureRadius + textSize.width + that._label.indent * 1.2) > that.width / 2)
            {
                barGaugeFigureRadius = that._barGaugeRadius - that._label.indent * 1.2 - textSize.width;
            }

            if (that._label.visible === false)
            {
                barGaugeFigureRadius = that._barGaugeRadius;
            }
            barGaugeFigureRadius = barGaugeFigureRadius * 0.98;
            if (barGaugeFigureRadius < 0)
            {
                barGaugeFigureRadius = 0;
            }
            that._barGaugeFigureRadius = barGaugeFigureRadius;

            that._barWidth = barGaugeFigureRadius * (1 - that.relativeInnerRadius) / that._valuesLength - that.barSpacing;
            that._barStartAt = barGaugeFigureRadius * that.relativeInnerRadius;
            that._labelPositioningRadius = that._barStartAt + that._valuesLength * (that._barWidth + that.barSpacing) - that.barSpacing + that._label.indent;

            for (var i = 0; i < that._valuesLength; i++)
            {
                that._valuesToDegrees[i] = ((that.values[i] - that.min) / (that.max - that.min)) * (that._geometry.endAngle - that._geometry.startAngle) + that._geometry.startAngle;
            }

            $(that.host).width(that.width);
            $(that.host).height(that.height);
            if (!that._initialized)
            {
                that._initRenderer(that.host);
                that._initialized = true;
            }
        },

        _measureRadius: function ()
        {
            var that = this;
            var longestValue = that._getLongestValue();
            var textSize = that._measureText(longestValue, that._label.font.size, that._label.font.family, that._label.font.weight);
            var barGaugeFigureRadius = that._barGaugeRadius - that._label.indent * 1.2 - textSize.height * 1.2;

            if ((barGaugeFigureRadius + textSize.width + that._label.indent * 1.2) > that.width / 2)
            {
                barGaugeFigureRadius = that._barGaugeRadius - that._label.indent * 1.2 - textSize.width;
            }

            if (that._label.visible === false)
            {
                barGaugeFigureRadius = that._barGaugeRadius;
            }
            barGaugeFigureRadius = barGaugeFigureRadius * 0.98;

            if (barGaugeFigureRadius < 0)
            {
                barGaugeFigureRadius = 0;
            }

            that._barWidth = barGaugeFigureRadius * (1 - that.relativeInnerRadius) / that._valuesLength - that.barSpacing;
            that._barStartAt = barGaugeFigureRadius * that.relativeInnerRadius;
            that._labelPositioningRadius = that._barStartAt + that._valuesLength * (that._barWidth + that.barSpacing) - that.barSpacing + that._label.indent;
        },

        _drawEmptyBarGauge: function ()
        {
            var that = this;
            var emptyBarGaugeRadius,
                backgroundSliceId;
            var gaugeLayerStart = that._barStartAt;
            var gaugeLayerEnd = gaugeLayerStart + that._barWidth;

            if (that._title.text === '')
            {
                emptyBarGaugeRadius = that._barGaugeRadius;
            } else
            {
                emptyBarGaugeRadius = that._barGaugeFigureRadius;
            }

            gaugeLayerStart = that.relativeInnerRadius * emptyBarGaugeRadius;
            gaugeLayerEnd = emptyBarGaugeRadius;

            that._barGaugeBackgroundSlices[0] = that.renderer.pieslice(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, that._geometry.startAngle, that._geometry.endAngle, 0, { fill: that._backgroundColor, stroke: that._backgroundColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
            backgroundSliceId = that.element.id + 'BackgroundSlice0';
            that.renderer.attr(that._barGaugeBackgroundSlices[0], { id: backgroundSliceId });
            that.renderer.attr(that._barGaugeBackgroundSlices[0], { 'class': 'jqx-bar-gauge-background-slice' });

            that._rendered();
            that._oldValuesLength = 0;
            that._oldValues.length = 0;
        },

        _drawBarGaugeLayout: function ()
        {
            var that = this;
            var backgroundSliceId;
            var gaugeLayerStart = that._barStartAt;
            var gaugeLayerEnd = gaugeLayerStart + that._barWidth;
            that._barGaugeSlicesStrokeWidth = 0;
            that._centerX = that.width / 2;

            if (that._title.text === '')
            {
                that._centerY = that.height / 2;
            } else
            {
                if (that._title.verticalAlignment === 'top')
                {
                    that._centerY = (that.height + that._title.placeholderSize) / 2;
                } else
                {
                    that._centerY = (that.height - that._title.placeholderSize) / 2;
                }
            }

            if (that._valuesLength > 0)
            {
                for (var i = 0; i < that._valuesLength; i++)
                {
                    that._barGaugeBackgroundSlices[i] = that.renderer.pieslice(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, that._geometry.startAngle, that._geometry.endAngle, 0, { fill: that._backgroundColor, stroke: that._backgroundColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                    backgroundSliceId = that.element.id + 'BackgroundSlice' + i;
                    that.renderer.attr(that._barGaugeBackgroundSlices[i], { id: backgroundSliceId });
                    that.renderer.attr(that._barGaugeBackgroundSlices[i], { 'class': 'jqx-bar-gauge-background-slice' });

                    gaugeLayerStart = gaugeLayerEnd + that.barSpacing;
                    gaugeLayerEnd = gaugeLayerStart + that._barWidth;
                }
            } else
            {
                that._drawEmptyBarGauge();
            }
        },

        _drawBarGaugeElementsWithBase: function ()
        {
            var that = this;
            var sliceId,
                gaugeLayerStart,
                gaugeLayerEnd,
                changeContition;
            var change = 180 - that._geometry.baseAngle + that._geometry.fix;
            that._renderedValues = 0;

            gaugeLayerStart = that._barStartAt;
            gaugeLayerEnd = gaugeLayerStart + that._barWidth;
            var baseValues = [];
            for (var i = 0; i < that._valuesLength; i++)
            {
                baseValues[i] = that.baseValue;
                var drawColor = that._colors[i];

                if (that.formatFunction)
                {
                    drawColor = that.formatFunction(that.values[i], i, drawColor);
                }

                if (that._ie7 || that._ie8)
                {
                    var updatedAngle = that._valuesToDegrees[i];
                    change = 180 - updatedAngle + that._geometry.fix;
                    if (that._valuesToDegrees[i] > that._geometry.baseAngle)
                    {
                        that._barGaugeSlices[i] = that.renderer.pieslice(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, (180 - that._geometry.baseAngle + that._geometry.fix), change, 0, { fill: drawColor, stroke: drawColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                    } else
                    {
                        that._barGaugeSlices[i] = that.renderer.pieslice(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, change, (180 - that._geometry.baseAngle + that._geometry.fix), 0, { fill: drawColor, stroke: drawColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                    }

                    sliceId = that.element.id + 'Slice' + i;
                    that.renderer.attr(that._barGaugeSlices[i], { id: sliceId });
                    that.renderer.attr(that._barGaugeSlices[i], { 'class': 'jqx-bar-gauge-slice' });
                    that._drawnSlices[i] = true;

                    if (that._label.visible === true)
                    {
                        that._drawLabelsLine(gaugeLayerStart, change, i);
                        that._drawLabelsText(change, i);
                    }
                    that._rendered();
                } else
                {
                    if (that.useGradient)
                    {
                        var stops = [[0, 1.4], [100, 1]];
                        drawColor = that.renderer._toLinearGradient(drawColor, true, stops);
                    }

                    that._barGaugeSlices[i] = that.renderer.pieslice(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, change + 0.01, change, 0, { fill: drawColor, stroke: drawColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                    sliceId = that.element.id + 'Slice' + i;
                    that.renderer.attr(that._barGaugeSlices[i], { id: sliceId });
                    that.renderer.attr(that._barGaugeSlices[i], { 'class': 'jqx-bar-gauge-slice' });
                    that._drawnSlices[i] = true;
                }

                that.renderer.attr(that._barGaugeSlices[i], { id: that.element.id + 'Slice' + i });
                that.renderer.attr(that._barGaugeSlices[i], { 'class': 'jqx-bar-gauge-slice' });
                gaugeLayerStart = gaugeLayerEnd + that.barSpacing;
                gaugeLayerEnd = gaugeLayerStart + that._barWidth;
            }
            that._oldValues = baseValues;
            that._temporaryValues = baseValues.slice(0);
            that._oldValuesToDegrees.length = 0;
            for (var i = 0; i < that.values.length; i++)
            {
                that._oldValuesToDegrees[i] = that._geometry.baseAngle;
                that._temporaryValuesToDegrees[i] = that._geometry.baseAngle;
            }
            that._rendering = true;
            that._redrawWithNewValuesArray(that.values, that._oldValues);

        },

        _drawBarGaugeElementWithBase: function (gaugeLayerStart, change, amount, changeContition, valueIndex)
        {
            var that = this;
            var newPieSlicePath,
                angleStepPercent,
                angleDiff,
                valueStep;
            var animation = that._calculateAnimationInterval(valueIndex, false);
            var gaugeLayerEnd = gaugeLayerStart + that._barWidth;
            var updatedItem = that._barGaugeSlices[valueIndex];
            var updatedAngle = that._valuesToDegrees[valueIndex];

            if (that.animationDuration === 0)
            {
                change = 180 - updatedAngle + that._geometry.fix;
            }

            angleDiff = Math.abs(that._geometry.baseAngle - updatedAngle);
            if (angleDiff === 0)
            {
                angleDiff = 0.01;
            }
            angleStepPercent = Math.abs((amount / animation.smoothCoef) / angleDiff);
            valueStep = angleStepPercent * Math.abs(that.baseValue - that.values[valueIndex]);

            if (isNaN(that._temporaryValues[valueIndex]))
            {
                that._temporaryValues[valueIndex] = that.values[valueIndex];
            }
            if (isNaN(that._temporaryValuesToDegrees[valueIndex]))
            {
                that._temporaryValuesToDegrees[valueIndex] = that._valuesToDegrees[valueIndex];
            }

            that._intervalArray[valueIndex] = setInterval(function ()
            {
                calculateNewPieSlicePath();
                if (eval(changeContition) && !that.disabled)
                {
                    that.renderer.attr(updatedItem, { d: newPieSlicePath });
                    change += amount / animation.smoothCoef;
                    that._temporaryValuesToDegrees[valueIndex] = (180 - change + that._geometry.fix) % 360;
                    that._temporaryValues[valueIndex] = that._temporaryValues[valueIndex] + amount * valueStep;

                } else
                {
                    change = 180 - updatedAngle + that._geometry.fix;
                    that._temporaryValuesToDegrees[valueIndex] = updatedAngle % 360;
                    that._temporaryValues[valueIndex] = that.values[valueIndex];
                    calculateNewPieSlicePath();
                    that.renderer.attr(updatedItem, { d: newPieSlicePath });

                    clearInterval(that._intervalArray[valueIndex]);
                    that._renderedValues++;

                    if (that._renderedValues === that.values.length)
                    {
                        that._rendered();
                    }
                }
            }, animation.interval / animation.smoothCoef);

            function calculateNewPieSlicePath()
            {
                if (amount === -1)
                {
                    newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, change, (180 - that._geometry.baseAngle + that._geometry.fix), 0);
                } else
                {
                    newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, (180 - that._geometry.baseAngle + that._geometry.fix), change, 0);
                }
            }
        },

        _drawStaticBarGaugeElementsWithBase: function ()
        {
            var that = this;
            var gaugeLayerStart,
                gaugeLayerEnd,
                change,
                updatedAngle,
                sliceId;

            gaugeLayerStart = that._barStartAt;
            gaugeLayerEnd = gaugeLayerStart + that._barWidth;

            for (var i = 0; i < that._valuesLength; i++)
            {
                updatedAngle = that._valuesToDegrees[i] || (that._geometry.baseAngle);
                that._oldValues[i] = that.values[i] || that.baseValue;

                change = 180 - updatedAngle + that._geometry.fix;
                var drawColor = that._colors[i];
                if (that.useGradient)
                {
                    var stops = [[0, 1.4], [100, 1]];
                    drawColor = that.renderer._toLinearGradient(drawColor, true, stops);
                }

                if (that._valuesToDegrees[i] < that._geometry.baseAngle)
                {
                    that._barGaugeSlices[i] = that.renderer.pieslice(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, (180 - that._geometry.baseAngle + that._geometry.fix), change, 0, { fill: drawColor, stroke: drawColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                } else
                {
                    that._barGaugeSlices[i] = that.renderer.pieslice(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, change, (180 - that._geometry.baseAngle + that._geometry.fix), 0, { fill: drawColor, stroke: drawColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                }

                sliceId = that.element.id + 'Slice' + i;
                that.renderer.attr(that._barGaugeSlices[i], { id: sliceId });
                that.renderer.attr(that._barGaugeSlices[i], { 'class': 'jqx-bar-gauge-slice' });
                that._drawnSlices[i] = true;

                gaugeLayerStart = gaugeLayerEnd + that.barSpacing;
                gaugeLayerEnd = gaugeLayerStart + that._barWidth;
            }

            that._removeLabels();
            that._addLabels();
        },

        _addLabels: function (valuesToDegrees, values, index)
        {
            var that = this;
            var change,
                valueIndex,
                i;
            var gaugeLayerStart = that._barStartAt;
            var gaugeLayerEnd = gaugeLayerStart + that._barWidth;
            if (!valuesToDegrees)
            {
                valuesToDegrees = that._valuesToDegrees;
            }

            for (i = 0; i < that._valuesLength; i++)
            {
                valueIndex = i;
                if (index != undefined && i !== index)
                {
                    gaugeLayerStart = gaugeLayerEnd + that.barSpacing;
                    gaugeLayerEnd = gaugeLayerStart + that._barWidth;
                    continue;
                }

                change = 180 - valuesToDegrees[valueIndex] + that._geometry.fix;
                if (that._label.visible === true && that.disabled === false)
                {
                    that._drawLabelsLine(gaugeLayerStart, change, valueIndex);
                    if (values && values[valueIndex] !== undefined)
                    {
                        that._drawLabelsText(change, valueIndex, values[valueIndex]);
                    }
                    else
                    {
                        that._drawLabelsText(change, valueIndex);
                    }
                }

                gaugeLayerStart = gaugeLayerEnd + that.barSpacing;
                gaugeLayerEnd = gaugeLayerStart + that._barWidth;
            }
        },

        _removeLabels: function (index)
        {
            var that = this;

            for (var i = 0; i < that._barGaugeLabelText.length; i++)
            {
                if (index != undefined && i != index)
                    continue;

                $(that._barGaugeLabelLines[i]).remove();
                $(that._barGaugeLabelText[i]).remove();
                that._barGaugeLabelLines[i] = null;
                that._barGaugeLabelText[i] = null;
            }

        //    $('#' + that.element.id + ' .jqx-bar-gauge-label-text').remove();
       //     $('#' + that.element.id + ' .jqx-bar-gauge-label-line').remove();
        },

        _removeBarGaugeSlices: function ()
        {
            var that = this;
            that._removeBarGaugeBackgroundSlices();
            that._removeBarGaugeForegroundSlices();
        },

        _removeBarGaugeBackgroundSlices: function ()
        {
            var that = this;
            var valuesToRemoveCount = Math.max(that._valuesLength, that._oldValuesLength);

            for (var i = 0; i < valuesToRemoveCount; i++)
            {
                if (that._oldIEbrowser)
                {
                    $(that._barGaugeBackgroundSlices[i]).remove();
                }
                that._barGaugeBackgroundSlices[i] = null;
                that._drawnSlices[i] = false;
            }
            $('#' + that.element.id + ' .jqx-bar-gauge-background-slice').remove();
        },

        _removeBarGaugeForegroundSlices: function ()
        {
            var that = this;
            var valuesToRemoveCount = Math.max(that._valuesLength, that._oldValuesLength);

            for (var i = 0; i < valuesToRemoveCount; i++)
            {
                if (that._drawnSlices[i] === true)
                {
                    if (that._oldIEbrowser)
                    {
                        $(that._barGaugeSlices[i]).remove();
                    }
                    that._barGaugeSlices[i] = null;
                    that._drawnSlices[i] = false;
                }
            }
            $('#' + that.element.id + ' .jqx-bar-gauge-slice').remove();
        },

        _removeBarGaugeTitle: function ()
        {
            var that = this;

            if (that._oldIEbrowser && !!that._barGaugeTitle)
            {
                $(that._barGaugeTitle).remove();
            }
            $('#' + that.element.id + ' .jqx-bar-gauge-title').remove();
        },

        _removeBarGaugeSubTitle: function ()
        {
            var that = this;

            if (that._oldIEbrowser && !!that._barGaugeSubTitle)
            {
                $(that._barGaugeSubTitle).remove();
            }
            $('#' + that.element.id + ' .jqx-bar-gauge-subtitle').remove();
        },

        _renderElements: function ()
        {

            var that = this;
            var gaugeLayerStart,
                gaugeLayerEnd,
                sliceId,
                condition,
                updatedAngle,
                change,
                i;
            var afterZeroBaseAngle = (180 - that._geometry.baseAngle + that._geometry.fix);
            gaugeLayerStart = that._barStartAt;
            gaugeLayerEnd = gaugeLayerStart + that._barWidth;

            that._rendering = true;
            that._renderedValues = 0;
            that._renderingValues = 0;

            var rendering = false;
            if (!that.disabled)
            {
                gaugeLayerStart = that._barStartAt;
                gaugeLayerEnd = gaugeLayerStart + that._barWidth;

                for (i = 0; i < that._valuesLength; i++)
                {
                    if (that.values[i] >= that.baseValue)
                    {
                        if (that.values[i] > that._oldValues[i])
                        {
                            condition = '(oldAngle < newAngle)';
                            that._renderElement(gaugeLayerStart, gaugeLayerEnd, 1, condition, i, true);
                            rendering = true;
                        } else if (that.values[i] < that._oldValues[i])
                        {
                            condition = '(oldAngle > newAngle)';
                            that._renderElement(gaugeLayerStart, gaugeLayerEnd, -1, condition, i, false);
                            rendering = true;
                        }
                    } else
                    {
                        if (that.values[i] > that._oldValues[i])
                        {
                            condition = '(oldAngle < newAngle)';
                            that._renderElement(gaugeLayerStart, gaugeLayerEnd, 1, condition, i, true);
                            rendering = true;
                        } else if (that.values[i] < that._oldValues[i])
                        {
                            condition = '(oldAngle > newAngle)';
                            that._renderElement(gaugeLayerStart, gaugeLayerEnd, -1, condition, i, false);
                            rendering = true;
                        }
                    }

                    gaugeLayerStart = gaugeLayerEnd + that.barSpacing;
                    gaugeLayerEnd = gaugeLayerStart + that._barWidth;
                }
            }
            if (!rendering)
            {
                that._rendered();
            }
        },

        clearIntervals: function ()
        {
            var that = this;
            var intervalsArrayLength = that._intervalArray.length;
            for (var i = 0; i < intervalsArrayLength; i++)
            {
                clearInterval(that._intervalArray[i]);
            }

            that._intervalArray.length = 0;
        },

        _renderElement: function (gaugeLayerStart, gaugeLayerEnd, amount, condition, valueIndex, lessThan)
        {
            var that = this;
            that._renderingValues++;
            var newPieSlicePath, angleTo;
            var oldValue = that._oldValues[valueIndex];
            var newValue = that.values[valueIndex];
            var newAngle = that._valuesToDegrees[valueIndex];
            var oldAngle = that._oldValuesToDegrees[valueIndex];
            var updatedItem = that._barGaugeSlices[valueIndex];
            var animation = that._calculateAnimationInterval(valueIndex, true);
            var angleDiff = Math.abs(newAngle - oldAngle);
            var angleStepPercent = Math.abs((amount / animation.smoothCoef) / angleDiff);
            var valueStep = angleStepPercent * Math.abs(newValue - oldValue);
            var animationInterval = animation.interval / animation.smoothCoef;
            if (isNaN(that._temporaryValues[valueIndex]))
            {
                that._temporaryValues[valueIndex] = oldValue;
            }
            if (isNaN(that._temporaryValuesToDegrees[valueIndex]))
            {
                that._temporaryValuesToDegrees[valueIndex] = (180 - oldAngle + that._geometry.fix) % 360;
            }
            if (isNaN(that._temporaryOldAngle[valueIndex]))
            {
                that._temporaryOldAngle[valueIndex] = oldAngle;
            }
            var update = function ()
            {
                var newValue = that.values[valueIndex];
                var newAngle = that._valuesToDegrees[valueIndex];

                angleTo = (180 - oldAngle + that._geometry.fix);
                calculateNewPieSlicePath();
                var newCondition = false;
                if (lessThan && oldAngle < newAngle) newCondition = true;
                if (!lessThan && oldAngle > newAngle) newCondition = true;

                var updateLabels = function ()
                {
                    that._removeLabels(valueIndex);
                    var degrees = [];
                    for (var m = 0; m < that._valuesToDegrees.length; m++)
                    {
                        if (that._temporaryOldAngle[m] != undefined)
                        {
                            degrees[m] = that._temporaryOldAngle[m];
                        }
                        else
                        {
                            degrees[m] = that._valuesToDegrees[m];
                        }
                    }

                    that._addLabels(degrees, that._temporaryValues, valueIndex);
                }

                if (newCondition && (that.disabled === false) && that.animationDuration != 0)
                {
                    updateLabels();
                    that.renderer.attr(updatedItem, { d: newPieSlicePath });
                    if (that.formatFunction)
                    {
                        var drawColor = that._colors[valueIndex];
                        drawColor = that.formatFunction(that.values[valueIndex], valueIndex, drawColor);
                        that.renderer.attr(updatedItem, { fill: drawColor, stroke: drawColor });
                    }

                    oldAngle += amount / animation.smoothCoef;
                    that._temporaryOldAngle[valueIndex] = oldAngle;
                    that._temporaryValuesToDegrees[valueIndex] = (180 - oldAngle + that._geometry.fix) % 360;
                    that._temporaryValues[valueIndex] = that._temporaryValues[valueIndex] + amount * valueStep;
                    return false;
                } else
                {
                    oldAngle = newAngle;
                    angleTo = 180 - newAngle + that._geometry.fix;
                    that._temporaryOldAngle[valueIndex] = newAngle;
                    that._temporaryValuesToDegrees[valueIndex] = newAngle % 360;
                    that._temporaryValues[valueIndex] = that.values[valueIndex];
                    updateLabels();
                    createFinalPieSlicePath(angleTo, (180 - that._geometry.baseAngle + that._geometry.fix));
                    that.renderer.attr(updatedItem, { d: newPieSlicePath });
                    if (that.formatFunction)
                    {
                        var drawColor = that._colors[valueIndex];
                        drawColor = that.formatFunction(that.values[valueIndex], valueIndex, drawColor);
                        that.renderer.attr(updatedItem, { fill: drawColor, stroke: drawColor });
                    }
                    clearInterval(that._intervalArray[valueIndex]);
                    that._renderedValues++;
                    
                    if (that._renderedValues === that._renderingValues)
                    {
                        that._rendered();
                    }
                    return true;
                }
            }

            if (that.animationDuration == 0)
            {
                update();
            }
            else
            {
                var intervalFunction = function ()
                {
                    clearInterval(that._intervalArray[valueIndex]);
                    var result = update();
                    if (!that._rendering || result)
                    {
                        return;
                    }
                    var oldValue = that._oldValues[valueIndex];
                    var newValue = that.values[valueIndex];
                    var newAngle = that._valuesToDegrees[valueIndex];
                    var oldAngle = that._oldValuesToDegrees[valueIndex];
                    var updatedItem = that._barGaugeSlices[valueIndex];
                    var animation = that._calculateAnimationInterval(valueIndex, true);
                    var angleDiff = Math.abs(newAngle - oldAngle);
                    var angleStepPercent = Math.abs((amount / animation.smoothCoef) / angleDiff);
                    var valueStep = angleStepPercent * Math.abs(newValue - oldValue);
                    var animationInterval = animation.interval / animation.smoothCoef;

                    that._intervalArray[valueIndex] = setInterval(intervalFunction, animationInterval);
                }    
                if (!that._intervalArray[valueIndex])
                {
                    that._intervalArray[valueIndex] = setInterval(intervalFunction, animationInterval);
                }
            }

            function calculateNewPieSlicePath()
            {
                var angleA = angleTo;
                var angleB = (180 - that._geometry.baseAngle + that._geometry.fix);

                if (amount === 1)
                {
                    if (lessThan)
                    {
                        if (that._geometry.baseAngle < oldAngle)
                        {
                            newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, angleA, angleB, 0);
                        } else
                        {
                            newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, angleB, angleA, 0);
                        }
                    }
                } else
                {
                    if (!lessThan)
                    {
                        if (that._geometry.baseAngle < oldAngle)
                        {
                            newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, angleA, angleB, 0);
                        } else
                        {
                            newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, angleB, angleA, 0);
                        }
                    }
                }
            }

            function createFinalPieSlicePath(angleA, angleB)
            {
                if (angleA <= angleB)
                {
                    newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, angleA - 0.0001, angleB, 0);
                } else
                {
                    newPieSlicePath = $.jqx.commonRenderer.pieSlicePath(that._centerX, that._centerY, gaugeLayerStart, gaugeLayerEnd, angleB, angleA, 0);
                }
            }
        },

        _calculateAnimationInterval: function (valueIndex, redraw)
        {
            var that = this;
            var animation = {};
            var duration = that.animationDuration;
            var animationISeconds = duration / 1000;
            var intervalPer1000ms = 0;

            var easeInOutSine = function (t, b, c, d)
            {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            };

            if (redraw)
            {
                if ((that._oldValues[valueIndex] - that.values[valueIndex]) !== 0)
                {
                    intervalPer1000ms = 1000 / (Math.abs((that._oldValues[valueIndex] - that.values[valueIndex]) / (that.max - that.min) * (that._geometry.endAngle - that._geometry.startAngle)));

                    //                    var result = easeInOutSine(0, that._oldValues[valueIndex], that.values[valueIndex], that.animationDuration);
                }
            } else
            {
                if ((that.baseValue - that.values[valueIndex]) !== 0)
                {
                    intervalPer1000ms = 1000 / (Math.abs((that.baseValue - that.values[valueIndex]) / (that.max - that.min) * (that._geometry.endAngle - that._geometry.startAngle)));
                }
            }

            animation.smoothCoef = animationISeconds || 1;
            animation.interval = intervalPer1000ms * animationISeconds;
            return animation;
        },

        _calculateLabelOffset: function (angle, fontSize, textWidth)
        {
            var koefX,
                koefY;
            var offset = {};
            if (angle >= 270)
            {
                koefY = -(270 - angle) / 180;
            } else if (angle <= 90)
            {
                koefY = (90 + angle) / 180;
            } else
            {
                koefY = (270 - angle) / 180;
            }

            if (angle <= 180)
            {
                koefX = angle / 180;
            } else
            {
                koefX = (360 - angle) / 180;
            }

            offset.y = koefY * fontSize;
            offset.x = koefX * textWidth;
            return offset;
        },

        _drawCoordinatePlane: function ()
        {
            var that = this;
            var startY,
                endY;

            if (that._title.verticalAlignment === 'top')
            {
                startY = that._title.placeholderSize;
                endY = that.height;
            } else
            {
                startY = 0;
                endY = that.height - that._title.placeholderSize;
            }

            if (that._coordinatePlane !== null)
            {
                $('#' + that.element.id + ' .jqx-bar-gauge-coordinate-plane').remove();
            }
            that._coordinatePlane = {};
            that._coordinatePlane.x = that.renderer.line(0, that._centerY, that.width, that._centerY, { fill: 'gray', stroke: 'gray', 'stroke-width': 1, 'stroke-opacity': 0.1 });
            that._coordinatePlane.y = that.renderer.line(that._centerX, startY, that._centerX, endY, { fill: 'gray', stroke: 'gray', 'stroke-width': 1, 'stroke-opacity': 0.1 });
            that.renderer.attr(that._coordinatePlane.x, { 'class': 'jqx-bar-gauge-coordinate-plane' });
            that.renderer.attr(that._coordinatePlane.y, { 'class': 'jqx-bar-gauge-coordinate-plane' });
        },

        _getColorScheme: function ()
        {
            var that = this;
            var newColorSchemeIndex,
                i;
            var colorSchemesLength = that._colorSchemes.length;
            var totalColors = that.values.length || 1;
            var colorSchemesCombinations = Math.floor(totalColors / that._colorSchemes[0].colors.length);
            var colorSchemeIndex = 0;

            for (i = 0; i < colorSchemesLength; i++)
            {
                if (that.colorScheme === that._colorSchemes[i].name)
                {
                    colorSchemeIndex = i;
                }
            }

            that._colors = that._colorSchemes[colorSchemeIndex].colors;
            if (colorSchemesCombinations > 0)
            {
                for (i = 0; i < colorSchemesCombinations; i++)
                {
                    newColorSchemeIndex = (colorSchemeIndex + i + 1) % colorSchemesLength;
                    that._colors = that._colors.concat(that._colorSchemes[newColorSchemeIndex].colors);
                }
            }
        },

        _drawLabelsLine: function (radiusXY1, angle, valueIndex)
        {
            var that = this;
            var x1,
                y1,
                x2,
                y2,
                angleInRad,
                radiusXY2,
                color,
                labelLineId;

            if (angle < 0)
            {
                angle = 360 + angle;
            } else if (angle > 360)
            {
                angle = angle % 360;
            }

            angleInRad = (360 - angle) * Math.PI / 180;
            radiusXY2 = radiusXY1 + that._barWidth + (that._valuesLength - valueIndex - 1) * (that._barWidth + that.barSpacing) + that._label.indent;
            x1 = that._centerX + radiusXY1 * Math.cos(angleInRad);
            y1 = that._centerY + radiusXY1 * Math.sin(angleInRad);
            x2 = that._centerX + radiusXY2 * Math.cos(angleInRad);
            y2 = that._centerY + radiusXY2 * Math.sin(angleInRad);
            color = that._label.connectorColor || that._colors[valueIndex];
            if (that.formatFunction)
            {
                color = that.formatFunction(that.values[valueIndex], valueIndex, color);
            }
            if (that._ie7 || that._ie8)
            {
                x1 = parseInt(x1, 10);
                y1 = parseInt(y1, 10);
                x2 = parseInt(x2, 10);
                y2 = parseInt(y2, 10);
            }

            if (that._label.visible === true && that.disabled === false)
            {
                that._barGaugeLabelLines[valueIndex] = that.renderer.line(x1, y1, x2, y2, { fill: color, stroke: color, 'stroke-width': that._label.connectorWidth });
            }

            labelLineId = that.element.id + 'LabelLine' + valueIndex;
            that.renderer.attr(that._barGaugeLabelLines[valueIndex], { id: labelLineId });
            that.renderer.attr(that._barGaugeLabelLines[valueIndex], { 'class': 'jqx-bar-gauge-label-line' });
        },

        _drawLabelsText: function (angle, valueIndex, text)
        {
            var that = this;
            var textSize,
                angleInRadians,
                xText,
                yText,
                offset,
                labelId;
            var color = that._label.font.color || that._colors[valueIndex];
            if (that.formatFunction)
            {
                color = that.formatFunction(that.values[valueIndex], valueIndex, color);
            }

            var value = that._calculatePrecision(that._label.precision, that.values[valueIndex]);
            if (text !== undefined)
            {
                value = new Number(text).toFixed(that._label.precision);
                value = that._calculatePrecision(that._label.precision, value);
            }

            if ((that._label.formatFunction !== undefined) && (that._label.formatFunction !== null) && (typeof that._label.formatFunction === 'function'))
            {
                value = that._label.formatFunction(value, valueIndex);
            }

            if (!that._cachedMeasurements) that._cachedMeasurements = [];
            if (!that._cachedMeasurements[value.length])
            {
                textSize = that._measureText(value, that._label.font.size, that._label.font.family, that._label.font.weight);
                that._cachedMeasurements[value.length] = textSize;
            }
            else
            {
                textSize = that._cachedMeasurements[value.length];
            }

            if (angle < 0)
            {
                angle = 360 + angle;
            } else if (angle > 360)
            {
                angle = angle % 360;
            }

            angleInRadians = (360 - angle) * Math.PI / 180;
            xText = that._centerX + (that._labelPositioningRadius + textSize.height * 0.3) * Math.cos(angleInRadians);
            yText = that._centerY + (that._labelPositioningRadius + textSize.height * 0.3) * Math.sin(angleInRadians);
            offset = that._calculateLabelOffset(angle, textSize.height, textSize.width);
            if (that._label.visible === true && that.disabled === false)
            {
                that._barGaugeLabelText[valueIndex] = that.renderer.text(value, xText - offset.x, (yText - offset.y), undefined, undefined, 0, { 'class': 'jqx-bargauge-label', fill: color, 'font-size': that._label.font.size + 'px', 'font-family': that._label.font.family, 'font-weight': that._label.font.weight }, false, 'left', 'top', 'lefttop');
            }

            labelId = that.element.id + 'Label' + valueIndex;
            that.renderer.attr(that._barGaugeLabelText[valueIndex], { id: labelId });
            that.renderer.attr(that._barGaugeLabelText[valueIndex], { 'class': 'jqx-bar-gauge-label-text' });

            if ((that._ie7) || (that._ie8))
            {
                $('#' + labelId + ' .jqx-bargauge-label').css({
                    color: color,
                    'white-space': 'nowrap',
                    'font-size': that._label.font.size + 'px',
                    'font-family': that._label.font.family,
                    'font-weight': that._label.font.weight
                });
            }
        },

        _calculatePrecision: function (precisionBase, value)
        {
            var precision;

            precision = precisionBase + Math.abs(value).toString().split('.')[0].length;
            precision = (precision > 15) ? 15 : precision;
            value = parseFloat(value).toPrecision(precision);
            return value;
        },

        _createTooltip: function ()
        {
            var that = this;
            var tooltipId = that.element.id + 'tooltip';

            that._barGaugeTooltip.attr('id', tooltipId);
            $(that._barGaugeTooltip).addClass(that.toThemeProperty('jqx-bar-gauge-tooltip'));

            if (that._tooltip.classname.length > 0)
            {
                $(that._barGaugeTooltip).addClass(that.toThemeProperty(that._tooltip.classname));
            }

            $(document.body).append(that._barGaugeTooltip);
            if ((that._tooltip.visible === true) && (that.disabled === false) && (that._valuesLength > 0))
            {
                that._addTooltipHandlers();
            }
        },

        _refreshTooltipHandlers: function ()
        {
            var that = this;

            if (that._tooltip.visible === true && that.disabled === false)
            {
                that._removeTooltipHandlers();
                that._addTooltipHandlers();
            }
        },

        _addTooltipHandlers: function ()
        {
            var that = this;
            var id,
                tooltipText;

            that.addHandler($('#' + that.element.id + ' .jqx-bar-gauge-slice'), 'mouseenter', function ()
            {
                if ((that._tooltip.visible === true) && (that._valuesLength > 0))
                {
                    id = that.renderer.getAttr(this, 'id').substr(that.element.id.length + 5);
                    tooltipText = that._calculatePrecision(that._tooltip.precision, that.values[id]);

                    that._barGaugeTooltip.css({ 'display': 'block', 'color': that._colors[id], 'border-color': that._colors[id] });
                    if ((that._tooltip.formatFunction !== undefined) && (that._tooltip.formatFunction !== null) && (typeof that._tooltip.formatFunction === 'function'))
                    {
                        tooltipText = that._tooltip.formatFunction(tooltipText, parseInt(id));
                    }

                    that._barGaugeTooltip.html(tooltipText);
                    that._raiseEvent('2', { layer: id });
                }
            });
            that.addHandler($('#' + that.element.id + ' .jqx-bar-gauge-slice'), 'mouseleave', function ()
            {
                that._barGaugeTooltip.css({ display: 'none' });
                that._raiseEvent('3', { layer: id });
            });
            that.addHandler($('#' + that.element.id + ' .jqx-bar-gauge-slice'), 'mouseup', function ()
            {
                that._barGaugeTooltip.css({ display: 'none' });
            });
            if ($('#' + that.element.id + ' .jqx-bar-gauge-slice').length > 0)
            {
                that.addHandler($('#' + that.element.id + ' .jqx-bar-gauge-slice'), 'mousemove', function ()
                {
                    if ((that._tooltip.visible === true) && (that._valuesLength > 0))
                    {
                        id = that.renderer.getAttr(this, 'id').substr(that.element.id.length + 5);
                        tooltipText = that._calculatePrecision(that._tooltip.precision, that.values[id]);

                        that._barGaugeTooltip.css({ 'display': 'block', 'color': that._colors[id], 'border-color': that._colors[id] });
                        if ((that._tooltip.formatFunction !== undefined) && (that._tooltip.formatFunction !== null) && (typeof that._tooltip.formatFunction === 'function'))
                        {
                            tooltipText = that._tooltip.formatFunction(tooltipText, parseInt(id));
                        }
                        that._barGaugeTooltip.html(tooltipText);
                    }
                });
            }
            that.addHandler($(that.host), 'mousemove', function (event)
            {
                that._barGaugeTooltip.css({ top: (event.pageY - 10) + 'px', left: (event.pageX + 15) + 'px' });
            });

        },

        _removeTooltipHandlers: function ()
        {
            var that = this;

            if (that._barGaugeSlices.length > 0)
            {
                that.removeHandler($(that._barGaugeSlices), 'mouseenter');
                that.removeHandler($(that._barGaugeSlices), 'mouseleave');
                that.removeHandler($(that._barGaugeSlices), 'mouseup');
                that.removeHandler($(that._barGaugeSlices), 'mousemove');

                that.removeHandler($('#' + that.element.id + ' .jqx-bar-gauge-slice'), 'mouseenter mouseleave mouseup mousemove');
            }

            that.removeHandler($(that.host), 'mousemove');
        },

        _drawBarGaugeTitle: function ()
        {
            var that = this;
            that._alignmentIE = that._alignmentIE || that._title.horizontalAlignment;
            var drawn = 0;
            var coefY = 0;
            var titleParts,
                subTitleParts,
                titleTextSize,
                subTitleTextSize,
                subTitleText,
                titleText,
                subTitleId,
                titleId,
                i;

            if (that._ie7 || that._ie8)
            {
                that._title.horizontalAlignment = 'left';
            }

            if (that._titleLines > 1)
            {
                titleParts = that._title.text.split('<br>');
                for (i = 0; i < that._titleLines; i++)
                {
                    titleTextSize = that._measureText(titleParts[i] + '_', that._title.font.size, that._title.font.family, that._title.font.weight);
                    titleText = titleParts[i];

                    while (titleTextSize.width > that.width)
                    {
                        titleText = titleText.slice(0, -1);
                        titleParts[i] = titleText + '...';
                        titleTextSize = that._measureText(titleParts[i] + '_', that._title.font.size, that._title.font.family, that._title.font.weight);
                    }
                }
                that._title.text = titleParts.join('<br>');
            } else
            {
                titleTextSize = that._measureText(that._title.text + '_', that._title.font.size, that._title.font.family, that._title.font.weight);
                titleText = that._title.text;

                while (titleTextSize.width > that.width)
                {
                    titleText = titleText.slice(0, -1);
                    that._title.text = titleText + '...';
                    titleTextSize = that._measureText(that._title.text + '_', that._title.font.size, that._title.font.family, that._title.font.weight);
                }
            }

            if (that._title.verticalAlignment === 'bottom')
            {
                coefY = that.height - that._title.placeholderSize;
            }

            if ((that.title !== null) && (that.title !== undefined) && (that._title.text !== ''))
            {
                that._barGaugeTitle = that.renderer.text(that._title.text, that._title.margin.left, (coefY + that._title.margin.top), (that.width - that._title.margin.right), 0, undefined, { 'fill': that._title.font.color, 'fill-opacity': that._title.font.opacity, 'font-size': that._title.font.size, 'font-family': that._title.font.family, 'font-weight': that._title.font.weight }, false, that._title.horizontalAlignment, that._title.verticalAlignment, 'centertop');
                titleId = that.element.id + 'Title';
                that.renderer.attr(that._barGaugeTitle, { id: titleId });
                that.renderer.attr(that._barGaugeTitle, { 'class': 'jqx-bar-gauge-title' });
                if ((that._ie7) || (that._ie8))
                {
                    $('#' + titleId + ' textbox').css({
                        width: that.width + 'px !important',
                        'padding-left': '10px',
                        position: 'relative'
                    });

                    var titleLeftMargin = 0;
                    if (titleTextSize.width < that.width)
                    {
                        if (that._alignmentIE === 'center')
                        {
                            titleLeftMargin = (that.width - titleTextSize.width) / 2;
                        } else if (that._alignmentIE === 'right')
                        {
                            titleLeftMargin = that.width - titleTextSize.width;
                        }

                    }

                    $('#' + titleId + ' span').css({
                        color: that._title.font.color,
                        'margin-left': titleLeftMargin + 'px',
                        'white-space': 'nowrap',
                        'text-align': 'center',
                        'font-size': that._title.font.size + 'px',
                        'font-family': that._title.font.family,
                        'font-weight': that._title.font.weight
                    });
                    drawn++;
                }

                if ((that._title.subtitle.text !== '') && (that._title.subtitle.text !== undefined))
                {
                    if (that._subTitleLines > 1)
                    {
                        subTitleParts = that._title.subtitle.text.split('<br>');
                        for (i = 0; i < that._subTitleLines; i++)
                        {
                            subTitleTextSize = that._measureText(subTitleParts[i] + '_', that._title.subtitle.font.size, that._title.subtitle.font.family, that._title.subtitle.font.weight);
                            subTitleText = subTitleParts[i];

                            while (subTitleTextSize.width > that.width)
                            {
                                subTitleText = subTitleText.slice(0, -1);
                                subTitleParts[i] = subTitleText + '...';
                                subTitleTextSize = that._measureText(subTitleParts[i] + '_', that._title.subtitle.font.size, that._title.subtitle.font.family, that._title.subtitle.font.weight);
                            }
                        }

                        that._title.subtitle.text = subTitleParts.join('<br>');
                    } else
                    {
                        subTitleTextSize = that._measureText(that._title.subtitle.text + '_', that._title.subtitle.font.size, that._title.subtitle.font.family, that._title.subtitle.font.weight);
                        subTitleText = that._title.subtitle.text;

                        while (subTitleTextSize.width > that.width)
                        {
                            subTitleText = subTitleText.slice(0, -1);
                            that._title.subtitle.text = subTitleText + '...';
                            subTitleTextSize = that._measureText(that._title.subtitle.text + '_', that._title.subtitle.font.size, that._title.subtitle.font.family, that._title.subtitle.font.weight);
                        }
                    }

                    that._barGaugeSubTitle = that.renderer.text(that._title.subtitle.text, that._title.margin.left, (coefY + that._title.font.size * that._titleLines + that._title.margin.top), that.width - that._title.margin.right, 0, undefined, { 'fill': that._title.subtitle.font.color, 'fill-opacity': that._title.subtitle.font.opacity, 'font-size': that._title.subtitle.font.size, 'font-family': that._title.subtitle.font.family, 'font-weight': that._title.subtitle.font.weight, 'margin-top': that._title.margin.top }, false, that._title.horizontalAlignment, that._title.verticalAlignment, 'centertop');
                    subTitleId = that.element.id + 'SubTitle';
                    that.renderer.attr(that._barGaugeSubTitle, { id: subTitleId });
                    that.renderer.attr(that._barGaugeSubTitle, { 'class': 'jqx-bar-gauge-subtitle' });

                    if ((that._ie7) || (that._ie8))
                    {
                        var subTitleLeftMargin = 0;
                        if (subTitleTextSize.width < that.width)
                        {
                            if (that._alignmentIE === 'center')
                            {
                                subTitleLeftMargin = (that.width - subTitleTextSize.width) / 2;
                            } else if (that._alignmentIE === 'right')
                            {
                                subTitleLeftMargin = that.width - subTitleTextSize.width;
                            }
                        }

                        $('#' + subTitleId + ' textbox').css({
                            width: that.width + 'px !important',
                            left: subTitleLeftMargin + 'px !important',
                            position: 'relative'
                        });

                        $('#' + subTitleId + ' span').css({
                            width: '100%',
                            color: that._title.subtitle.font.color,
                            'margin-left': subTitleLeftMargin + 'px',
                            'white-space': 'nowrap',
                            'text-align': 'center',
                            'font-size': that._title.subtitle.font.size + 'px',
                            'font-family': that._title.subtitle.font.family,
                            'font-weight': that._title.subtitle.font.weight
                        });
                    }
                }
            }
        },

        _measureText: function (text, fontSize, fontFamily, fontWeight)
        {
            var that = this;
            var measuredTextProperties = {};

            if (!$('#' + that._measuredTextId).length)
            {
                that._measuredText.attr('id', that._measuredTextId);
                $(that.host).append(that._measuredText);
                that._measuredText.css({
                    'z-index': -999999,
                    'white-space': 'nowrap',
                    'font-size': fontSize + 'px',
                    'font-family': fontFamily,
                    'font-weight': fontWeight
                });
            }

            if (that._measuredText[0].style.fontSize != fontSize + "px")
            {
                that._measuredText[0].style.fontSize = fontSize + "px";
            }
            if (that._measuredText[0].style.fontFamily != fontFamily + "px")
            {
                that._measuredText[0].style.fontFamily = fontFamily;
            }
            if (that._measuredText[0].style.fontWeight != fontWeight)
            {
                that._measuredText[0].style.fontWeight = fontWeight + "px";
            }

            that._measuredText.text(text);

            measuredTextProperties.width = that._measuredText[0].offsetWidth;
            measuredTextProperties.height = that._measuredText[0].offsetHeight;
            return measuredTextProperties;
        },

        _calculateBarGaugeRadius: function ()
        {
            var that = this;

            if (that.width > (that.height - that._title.placeholderSize))
            {
                that._barGaugeRadius = (that.height - that._title.placeholderSize) / 2;
            } else
            {
                that._barGaugeRadius = that.width / 2;
            }
        },

        _addCSS: function ()
        {
            var that = this;
            $(that.host).addClass(that.toThemeProperty('jqx-widget'));
            $(that.host).addClass(that.toThemeProperty('jqx-bar-gauge'));
            $(that.host).addClass(that.toThemeProperty('jqx-widget-content'));

            if (that.disabled)
            {
                $(that.host).addClass(that.toThemeProperty('jqx-fill-state-disabled'));
            }
        },

        _rendered: function ()
        {
            var that = this;

            if ((that._rendering === true))
            {
                if ((that.rendered !== null) && (typeof that.rendered === 'function'))
                {
                    that.rendered();
                }
                that._rendering = false;
                that.clearIntervals();
                that._temporaryOldAngle.length = 0;
                that._temporaryValuesToDegrees.length = 0;
                that._temporaryValues.length = 0;

                that._raiseEvent('0');
                that._raiseEvent('5');
            }
        },

        _render: function ()
        {
            var that = this;
            that._removeAllGraphicElements();
            if (that.values.length > 0)
            {
                if ((that.animationDuration === 0) || (that._ie8) || (that._ie7))
                {
                    that._drawStaticBarGauge();
                } else
                {
                    that._drawDynamicBarGauge();
                }
            } else
            {
                that._getLiquidDimensions();
                that.host.width(that.width);
                that.host.height(that.height);
                that._validateValues();
                that._transformValuesToAngles();
                that._drawStaticBarGauge();
            }
            //  that._drawCoordinatePlane();
        },

        render: function ()
        {
            var that = this;
            that.clearIntervals();

            that._getLiquidDimensions();
            that.host.width(that.width);
            that.host.height(that.height);
            that._validateValues();
            that._transformValuesToAngles();
            that._getColorScheme();

            if (that._rendering !== true)
            {
                that._render();
            } else
            {
                that._staticRefresh();
                that._render();
            }
        },

        refresh: function (initialRefresh)
        {
            var that = this;
            if (initialRefresh !== true)
            {
                that.render();
            }
        },

        _removeAllGraphicElements: function ()
        {
            var that = this;
            that._removeLabels();
            that._removeBarGaugeSlices();
            that._removeBarGaugeTitle();
            that._removeBarGaugeSubTitle();
        },

        _drawStaticBarGauge: function ()
        {
            var that = this;
            that._rendering = true;
            that._drawBarGaugeTitle();
            that._drawBarGaugeLayout();

            if (!that.disabled)
            {
                that._getLiquidDimensions();
                that.host.width(that.width);
                that.host.height(that.height);
                that._validateValues();
                that._measureRadius();
                that._drawStaticBarGaugeElementsWithBase();
                that._rendered();
            } else
            {
                that._rendered();
            }
        },

        _drawDynamicBarGauge: function ()
        {
            var that = this;

            that._drawBarGaugeTitle();
            that._drawBarGaugeLayout();
            if (!that.disabled)
            {
                that._drawBarGaugeElementsWithBase();
            } else
            {
                that._rendered();
            }
        },

        val: function (newValues)
        {
            var that = this;

            if ((newValues !== null) && (newValues !== undefined) && (typeof newValues === 'object') && (Object.keys(newValues).length > 0))
            {
                that._raiseEvent('4', "api");
                if (newValues.length != that.values.length)
                {
                    that.values = newValues;
                    that.render();
                }
                else
                {
                    that._redrawWithNewValuesArray(newValues, that.values);
                }
            } else if ((newValues !== null) && (newValues !== undefined) && (typeof newValues === 'object') && (newValues.length === 0))
            {
                that._raiseEvent('4');
                that._removeLabels();
                that._removeBarGaugeSlices();
                that._transformValuesToAngles();
                that._drawEmptyBarGauge();
                that._removeLabels();
                that.values.length = 0;
                that._refreshTooltipHandlers();
            }

            return that.values;
        },

        _redrawWithNewValuesArray: function (newValues, oldValues)
        {
            var that = this;
            var val,
                i;

            if (that._rendering === false)
            {
                that._userValues = newValues.slice();
                if (!!oldValues)
                {
                    that._oldValues = oldValues.slice();
                } else
                {
                    that._oldValues = that.values.slice();
                }
                that._oldValuesToDegrees = that._valuesToDegrees.slice();
                that._oldValuesLength = that._valuesLength;

                if (Object.keys(newValues).length > 1)
                {
                    that.values = newValues.slice();
                } else
                {
                    if ((newValues[0] === null) || (newValues[0] === undefined))
                    {
                        that.values = [];
                    } else
                    {
                        that.values = [];
                        that.values[0] = parseFloat(newValues);
                    }
                }
                that._lastChange = new Date();
            }
            else if (that._rendering === true)
            {
                //  that.clearIntervals();
                that._userValues = newValues.slice();
                that._oldValues.length = 0;
                that._oldValuesToDegrees.length = 0;
                for (i = 0; i < that.values.length; i++)
                {
                    that._oldValues[i] = that._temporaryValues[i] != undefined ? that._temporaryValues[i]  : that.values[i];
                    that._oldValuesToDegrees[i] = that._temporaryValuesToDegrees[i] != undefined ? that._temporaryValuesToDegrees[i] : that._valuesToDegrees[i];
                }

                that._oldValuesLength = that.values.length;

                if (newValues.length > 1)
                {
                    that.values = newValues.slice();
                } else
                {
                    if ((newValues[0] === null) || (newValues[0] === undefined))
                    {
                        that.values = [];
                    } else
                    {
                        that.values = [];
                        that.values[0] = parseFloat(newValues);
                    }
                }
            } else if ((newValues === null) || (newValues === undefined))
            {
                that.values = [];
            } else if ((typeof newValues === 'string') || (typeof newValues === 'number'))
            {
                that.values = [];
                that.values[0] = parseFloat(newValues);
            } else
            {
                return that.values;
            }

            that._valuesLength = that.values.length;
            that._getColorScheme();

            if (that._valuesLength > that._oldValuesLength)
            {
                for (var v = that._oldValuesLength; v < that._valuesLength; v++)
                {
                    that._oldValuesToDegrees[v] = that._geometry.baseAngle;
                    that._oldValues[v] = that.baseValue;
                }
            }

            for (i = 0; i < that._valuesLength; i++)
            {
                if (that.values[i] < that.min)
                {
                    that.values[i] = that.min;
                } else if (that.values[i] > that.max)
                {
                    that.values[i] = that.max;
                }
                var res = that.values[i];
                if (res == 0) res = 0.03;
                val = ((res - that.min) / (that.max - that.min)) * (that._geometry.endAngle - that._geometry.startAngle) + that._geometry.startAngle;
                that._valuesToDegrees[i] = val % 360;
            }

            that._renderElements();

            that._refreshTooltipHandlers();
            that._raiseEvent('1');
        },

        _staticRefresh: function ()
        {
            var that = this;
            var animationDuration = that.animationDuration;

            if (typeof that.width === 'string' && that.width.indexOf('%') !== -1)
            {
                that._dimensions.width = that.width;
            }

            if (typeof that.height === 'string' && that.height.indexOf('%') !== -1)
            {
                that._dimensions.height = that.height;
            }

            that._getLiquidDimensions();
            that.host.width(that.width);
            that.host.height(that.height);
            $('#' + that.element.id + ' .chartContainer').width(that.width);
            $('#' + that.element.id + ' .chartContainer').height(that.height);

            that._removeBarGaugeTitle();
            that._removeBarGaugeSubTitle();
            that._validateGeometry();
            that._validateTitle();
            that._validateLabel();
            that._validateValues();
            that._validateTooltip();
            that._measureRadius();
            that.animationDuration = 0;
            that._render();
            that.animationDuration = animationDuration;
        },

        propertyChangedHandler: function (object, key, oldvalue, value)
        {
            var that = object;
            var animationDuration,
                i;

            that._cachedMeasurements = [];


            if (object.isInitialized === undefined || object.isInitialized === null || object.isInitialized === false)
            {
                return;
            }
            if (!that.ie7 && object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length === 2)
            {
                return;
            }

            if ((value !== oldvalue) || (key === 'colorScheme' || key === 'tooltip'))
            {
                animationDuration = that.animationDuration;
                that._titleTemplate = that._title;
                that._labelTemplate = that._label;
                that._tooltipTemplate = that._tooltip;

                switch (key)
                {
                    case 'width':
                    case 'height':
                        that._staticRefresh();
                        break;
                    case 'values':
                        that.values = oldvalue;
                        that.val(value);
                        break;
                    case 'animationDuration':
                        break;
                    case 'disabled':
                        if (that.disabled)
                        {
                            $(that.host).addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                        } else
                        {
                            $(that.host).removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                        }
                        that._render();
                        break;
                    case 'geometry':
                    case 'min':
                    case 'baseValue':
                    case 'max':
                    case 'barSpacing':
                    case "startAngle":
                    case "endAngle":
                    case 'relativeInnerRadius':
                        that.geometry.startAngle = that.startAngle;
                        that.geometry.endAngle = that.endAngle;

                        that.values = that._userValues.slice();
                        that._validateValues();
                        that._transformValuesToAngles();
                        that._render();
                        break;
                    case 'tooltip':
                        that._validateTooltip();
                        break;
                    case 'rendered':
                        break;
                    case 'backgroundColor':
                        that._backgroundColor = that._validateColor(that.backgroundColor, that._backgroundColor);
                        if (that._ie7 || that._ie8)
                        {
                            for (i = 0; i < that._valuesLength; i++)
                            {
                                that.renderer.attr(that._barGaugeBackgroundSlices[i], { fillcolor: that._backgroundColor, strokecolor: that._backgroundColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                            }
                        } else
                        {
                            $('#' + that.element.id + ' .jqx-bar-gauge-background-slice').attr({ 'fill': that._backgroundColor, 'stroke': that._backgroundColor, 'stroke-width': that._barGaugeSlicesStrokeWidth });
                        }
                        break;
                    case 'customColorScheme':
                        that._attachCustomColors();
                        break;
                    case 'colorScheme':
                        var connectorColor, labelColor;
                        that._getColorScheme();

                        for (i = 0; i < that._valuesLength; i++)
                        {
                            connectorColor = that._label.connectorColor || that._colors[i];
                            labelColor = that._label.font.color || that._colors[i];
                            var drawColor = that._colors[i];
                            if (that.useGradient)
                            {
                                var stops = [[0, 1.4], [100, 1]];
                                drawColor = that.renderer._toLinearGradient(drawColor, true, stops);
                            }

                            that.renderer.attr(that._barGaugeSlices[i], { fill: drawColor });
                            that.renderer.attr(that._barGaugeLabelLines[i], { fill: connectorColor, stroke: connectorColor });
                            that.renderer.attr(that._barGaugeLabelText[i], { fill: labelColor });

                            if (that._ie7 || that._ie8)
                            {
                                that.renderer.attr(that._barGaugeSlices[i], { fillcolor: that._colors[i], strokecolor: that._colors[i], 'stroke-width': that._barGaugeSlicesStrokeWidth });
                                that.renderer.attr(that._barGaugeLabelLines[i], { fillcolor: connectorColor, strokecolor: connectorColor });
                                var labelId = that.element.id + 'Label' + i;
                                $('#' + labelId + ' .jqx-bargauge-label').css({
                                    color: labelColor
                                });
                            }
                        }
                        break;
                    default:
                        that._staticRefresh();
                        break;
                }
            }
        },

        _compareArrays: function (arr1, arr2)
        {
            var arr1Length = arr1.length,
                arr2Length = arr2.length;

            if (arr1Length !== arr2Length)
            {
                return false;
            } else
            {
                for (var i = 0; i < arr1Length; i++)
                {
                    if (arr1[i] !== arr2[i])
                    {
                        return false;
                    }
                }
            }

            return true;
        },

        _addIEPolyfills: function ()
        {
            if (!Object.keys)
            {
                Object.keys = (function ()
                {
                    var hasOwnPropertyLocal = Object.prototype.hasOwnProperty,
                        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                        dontEnums = [
                          'toString',
                          'toLocaleString',
                          'valueOf',
                          'hasOwnProperty',
                          'isPrototypeOf',
                          'propertyIsEnumerable',
                          'constructor'
                        ],
                        dontEnumsLength = dontEnums.length;

                    return function (obj)
                    {
                        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
                        {
                            throw new TypeError('Object.keys called on non-object');
                        }

                        var result = [], prop, i;
                        for (prop in obj)
                        {
                            if (hasOwnPropertyLocal.call(obj, prop))
                            {
                                result.push(prop);
                            }
                        }

                        if (hasDontEnumBug)
                        {
                            for (i = 0; i < dontEnumsLength; i++)
                            {
                                if (hasOwnPropertyLocal.call(obj, dontEnums[i]))
                                {
                                    result.push(dontEnums[i]);
                                }
                            }
                        }
                        return result;
                    };
                }());
            }
        },

        destroy: function ()
        {
            var that = this;
            $('#' + that._measuredTextId).remove();
            that.renderer.clear();
            that.renderer = null;
            that._removeEventHandlers();
            that._removeTooltipHandlers();
            that.host.children().remove();
            that.host.removeData();
            that.host.removeClass();
            that.host.remove();
            that.host = null;
            that.element = null;
            delete that.element;
            delete that.host;
        },

        _addEventHandlers: function ()
        {
            var that = this;
            that.addHandler($(that.host), 'drawStart', function ()
            {
            });
            that.addHandler($(that.host), 'drawEnd', function ()
            {
                that._refreshTooltipHandlers();
            });

            that.addHandler($(window), 'resize.jqxBarGauge' + that.host[0].id, function ()
            {
                var isPercentage = false;
                if (that._dimensions.width && that._dimensions.width.toString().indexOf("%") >= 0)
                {
                    isPercentage = true;
                }
                if (that._dimensions.height && that._dimensions.height.toString().indexOf("%") >= 0)
                {
                    isPercentage = true;
                }
                if (isPercentage)
                {
                    that._staticRefresh();
                }
            });
        },

        _removeEventHandlers: function ()
        {
            var that = this;
            that.removeHandler($(that.host), 'drawStart');
            that.removeHandler($(that.host), 'drawEnd');
            that.removeHandler($(window), 'resize.jqxBarGauge' + that.host[0].id);
        },

        _refreshEventHandlers: function ()
        {
            var that = this;
            that._removeEventHandlers();
            that._addEventHandlers();
        },

        _raiseEvent: function (eventId, data)
        {
            var that = this;
            var event = $.Event(that._events[eventId]);
            event.args = data;
            return that.host.trigger(event);
        },

        _getEvent: function (event)
        {
            var that = this;
            if (that._isTouchDevice)
            {
                return that._touchEvents[event];
            } else
            {
                return event;
            }
        }
    });
})(jqxBaseFramework);


