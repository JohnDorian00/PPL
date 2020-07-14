//makeid - функция генерации ID из 5 символов нижнего регистра



//getCookie - функция получения значения куки
//name - название запрашиваемых cooki
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}


//setCookie - функция становки значения куки
//name - имя устанавливаемых cooki
//value - устанавливаемое значение
//options - обьект параметров, .expires - это время действия cooki (усли это число то воспринимает как количество секунд а если обькт типа Data то конкретное время, если поставить 0 то cooki будут сесииоными)

function setCookie(name, value, options) {
    options = options || {};
    var expires = options.expires;
    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }
    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }
    document.cookie = updatedCookie;
}


String.prototype.replaceAll = function (search, replace) {
    return (' ' + this.split(search).join(replace)).slice(1);
};

String.prototype.setID = function (replace) {
    return (' ' + this.split('IDM').join(replace)).slice(1);
};

var makeidobj = function (obj) {
    var _keys = Object.keys(obj);
    var id = makeid();
    for (var count = 0; count < _keys.length; count++) {
        if (_keys[count] === id) {
            return makeidobj(obj);
        }

    }
    return id;
};

function clerAllElemOfID(ID, layer) {
    layer = layer || 0;
    var props = Object.keys(ID);
    if (ID === document) {
        return
    }
    for (var i = 0; i < props.length; i++) {
        if (typeof ID[props[i]] === 'object' && ID[props[i]] !== null && layer < 20) {
            clerAllElemOfID(ID[props[i]], layer + 1)
        }
        ID[props[i]] = null;
        delete ID[props[i]];
    }
}

var destroiAllJqx = clerAllElemOfID;


function getTextDromParam(objData) {
    var _keys = Object.keys(objData);
    var _textData = "";
    var _counterSum = 0;
    for (var _count = 0; _count < _keys.length; _count++) {
        var _thisElem = "";
        switch (objData[_keys[_count]].type) {
            case 'text':
                _thisElem += objData[_keys[_count]].data;
                break;
            case 'mass':
                if (objData[_keys[_count]].data.length !== objData[_keys[_count]].len) {
                    //_count2 < 5 - ограничение на максимум выборки
                    for (var _count2 = 0; _count2 < objData[_keys[_count]].data.length; _count2++) {
                        _thisElem += "," + objData[_keys[_count]].data[_count2][objData[_keys[_count]].param];
                        _counterSum++;
                    }
                    _thisElem = _thisElem.substr(1);
                }
                break;
            case 'date':
                var m = ((objData[_keys[_count]].param.getMonth() + 1) < 10) ? ("0" + (objData[_keys[_count]].param.getMonth() + 1)) : (objData[_keys[_count]].param.getMonth() + 1);
                var d = ((objData[_keys[_count]].param.getDate()) < 10) ? ("0" + (objData[_keys[_count]].param.getDate())) : (objData[_keys[_count]].param.getDate());
                _thisElem += objData[_keys[_count]].param.getFullYear() + "-" + m + "-" + d + " 00:00:00";
                break;
            default:
                break;
        }
        _thisElem = '<TextParam ID="' + _keys[_count] + '">' + _thisElem + '</TextParam>';
        _textData += _thisElem;
    }
    if (!_counterSum) {
        _textData = _textData.replaceAll("<TextParam ID=\"ST_OT_ESR\"></TextParam>", "<TextParam ID=\"ST_OT_ESR\">23000</TextParam>")
    }
    return _textData;
}


function mapDOM(element) {
    var treeObject = {};

    function treeHTML(element, object) {
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object[element.nodeName] = {};
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeValue !== null) {
                        object[nodeList[i].nodeName] = (nodeList[i].nodeValue);
                    } else {
                        var node = {};
                        if (!object[nodeList[i].nodeName]) {
                            object[nodeList[i].nodeName] = [];
                        }
                        object[nodeList[i].nodeName].push(node);
                        treeHTML(nodeList[i], node);
                    }
                }
            }
            return object;
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }

    return treeHTML(element, treeObject);
}

/*
Author: Surya Nyayapati
http://www.nyayapati.com/surya

The MIT License (MIT)
Copyright (c) <2012> <Surya Nyayapati>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function (window, undefined) {
    var X2J = {
        VERSION: '1.1',
        //convert xml to x2j object
        //Rule: Get ordered list of javascript object for xml
        parseXml: function (xml, xpathExpression) {
            var isObjectEmpty = function (obj) {
                for (var name in obj) {
                    return false;
                }
                return true;
            };

            //jNode = [{jName, jValue}] || [{jIndex, jNode,jName}]
            //jIndex = [{jName, counter}]
            //jName = "node_name"
            //jValue = "node_value"
            //counter = 0..n (i.e. index for jNode)
            var GetChildNode = function (domElement) {
                var obj = {};
                obj['jName'] = domElement.nodeName;
                obj['jAttr'] = GetAttributes(domElement.attributes);

                for (var i = 0; i < domElement.childNodes.length; i++) {
                    var node1 = domElement.childNodes[i];
                    if (node1.nodeType === TEXT_NODE) {
                        if (node1.textContent.trim() !== "") {
                            obj['jValue'] = node1.textContent;
                        }
                    }
                    else
                    {
                        var tmp = {};
                        var childNode = GetChildNode(node1);
                        for (var key in childNode) {
                            if (key !== 'jIndex' && key !== 'jValue') {
                                tmp[key] = childNode[key];
                            }
                        }

                        if(!childNode['jIndex'])
                        {
                            tmp = childNode;
                            if (!tmp.hasOwnProperty('jValue')) {
                                tmp['jValue'] = '';
                            }
                        }

                        if (obj['jIndex'] === undefined) {
                            obj['jIndex'] = [];
                        }

                        if (obj.hasOwnProperty(node1.nodeName)) {
                            obj['jIndex'].push([node1.nodeName, obj[node1.nodeName].length]);
                            if (childNode['jIndex'] !== undefined) {
                                tmp['jIndex'] = childNode['jIndex'];
                            }
                            obj[node1.nodeName].push(tmp);
                        }
                        else {
                            obj[node1.nodeName] = [];
                            obj['jIndex'].push([node1.nodeName, obj[node1.nodeName].length]);
                            if (childNode['jIndex'] !== undefined) {
                                tmp['jIndex'] = childNode['jIndex'];
                            }
                            obj[node1.nodeName].push(tmp);
                        }
                    }
                }

                return obj;
            };

            //Rule: attributes are unique list of name value pair inside a node.
            //Summary: This will return an object with jIndex property as an array and all the attributes as name value properties.
            //The number of attributes in a node will be equal to jIndex length. each element inside jIndex will be same as attribute name.
            var GetAttributes = function (attrs) {
                var obj = {};
                obj['jIndex'] = [];
                if(!attrs) return obj;

                for (var i = 0; i < attrs.length; i++) {
                    obj[attrs[i].name] = attrs[i].value;
                    obj['jIndex'].push(attrs[i].name);
                }
                return obj;
            };

            if (!xml) {
                return;
            }
            if (!xpathExpression) {
                xpathExpression = '/';
            }
            //var xmlStr = (new XMLSerializer()).serializeToString(xml);
            var xmlDocument = null;
            if(typeof(xml) ==='string')
            {
                var parser = new DOMParser();
                xmlDocument = parser.parseFromString(xml, "text/xml");
            }
            else
            {
                xmlDocument = xml;
            }

            //var xmlDoc = parser.parseFromString(xmlStr, "text/xml");
            //var nodes = xmlDoc.evaluate("/", xmlDoc, null, XPathResult.ANY_TYPE, null);
            var xPathResult1 = xmlDocument.evaluate(xpathExpression, xmlDocument, null, XPathResult.ANY_TYPE, null);
            if (xPathResult1.resultType === UNORDERED_NODE_ITERATOR_TYPE
                || xPathResult1.resultType === ORDERED_NODE_ITERATOR_TYPE) {//if result is a node-set then UNORDERED_NODE_ITERATOR_TYPE is always the resulting type

                var dom_node1 = xPathResult1.iterateNext(); //returns node https://developer.mozilla.org/en/DOM/Node
                var domArr = [];
                while (dom_node1) {
                    domArr.push(GetChildNode(dom_node1));
                    dom_node1 = xPathResult1.iterateNext();
                }
                //if (domArr.length == 1) {
                //    return domArr[0];
                //}
                return domArr;

            } else {
                console.log(xPathResult1);
            }
        },
        printJNode: function (jNode, callback) {
            if (jNode === undefined) {
                return;
            }
            var _printNode = function (jNode, level) {
                if (jNode.jIndex !== undefined) {
                    for (var j = 0; j < jNode.jIndex.length; j++) {
                        var node = jNode[jNode.jIndex[j][0]][jNode.jIndex[j][1]];
                        if (node.jIndex !== undefined) {
                            callback(jNode.jIndex[j][0], node.jIndex, node.jAttr, level);
                            _printNode(node, level + 1); //go deeper
                        } else {
                            callback(node.jName, node.jValue, node.jAttr, level);
                        }
                    }
                } else {
                    callback(jNode.jName, jNode.jValue, jNode.jAttr, level);
                }
            };
            _printNode(jNode, 0);
        },
        printJAttribute: function (jAttr) {
            var strArr = [];
            if (jAttr.jIndex) {
                for (var i = 0; i < jAttr.jIndex.length; i++) {
                    strArr.push(jAttr.jIndex[i] + "=" + jAttr[jAttr.jIndex[i]]);
                }
            }
            return strArr.join(', ');
        },
        ///Safe way to get value, Use when not sure if a name is present. if not present return default_value.
        getValue: function (jNode, name, index, default_value) {//if index undefined then 0
            //console.log(jNode, name, index,default_value);
            if (jNode === undefined || jNode === null) {
                return default_value;
            }
            if (index === undefined || typeof(index) != 'number') {
                index = 0;
            }

            if (index >= 0) {//if index is present
                if (jNode.length !== undefined && jNode.length == index + 1) {//if array
                    if (jNode[index].jName !== undefined && jNode[index].jName == name) {
                        //console.log('getValue 0');
                        return jNode[index].jValue; //tested
                    }
                }
                else if (jNode[name] !== undefined) {//if not array but name obj is array then return indexOf
                    var node = jNode[name][index];
                    if (node !== undefined) {
                        if (node.jValue !== undefined) {
                            //console.log('getValue 1');
                            return node.jValue;
                        } else {
                            //console.log('getValue 2');
                            return node;
                        }
                    }
                }
                else if (jNode.jName !== undefined && jNode.jName == name) {
                    //console.log('getValue 3');
                    return jNode.jValue;
                }
                else if (jNode.length === undefined && jNode[name]) { //if not array and name exists
                    //console.log('getValue 4');
                    return jNode[name]; //tested
                }

                return default_value;
            }

            throw new RangeError("index must be positive!");

        },
        search: function (jNode, name, options) {
            //options is object with keys like 'max_deep', ...
            //same as getValue, but returns array of obj(jName,jValue/jIndex,jAttr,[jNode]??)
        },
        getAttr: function (jNode, name) {
            var isObjectEmpty = function (obj) {
                for (var name in obj) {
                    return false;
                }
                return true;
            };

            if (!jNode || !jNode.jAttr || isObjectEmpty(jNode.jAttr)) {
                return;
            }
            return jNode.jAttr[name];
        },
        getJson: function (jNode) {
            return JSON.stringify(jNode);
        },
        getXml: function (jNode) {
            var spaces = function (no) {
                if (no === 0) {
                    return '';
                }
                var space = ' ';
                for (var i = 0; i < no; i++) {
                    space += ' ';
                }
                return space;
            };
            var _printAttribute = function (jNode) {
                if (!jNode) {
                    return;
                }
                var arr = [];
                for (var i = 0; i < jNode.jAttr.jIndex.length; i++) {
                    arr.push(' ' + jNode.jAttr.jIndex[i] + '="' + jNode.jAttr[jNode.jAttr.jIndex[i]] + '"');
                }
                return arr.join('');
            }
            var _printNode = function (jNode, level) {
                if (!jNode) {
                    return;
                }
                var xml = '';
                if (jNode.jIndex) {
                    for (var j = 0; j < jNode.jIndex.length; j++) {
                        var node = jNode[jNode.jIndex[j][0]][jNode.jIndex[j][1]];
                        if (node.jIndex) {
                            xml += spaces(level) + '<' + jNode.jIndex[j][0] + _printAttribute(node) + '>\n' + _printNode(node, level + 1) + spaces(level) + '</' + jNode.jIndex[j][0] + '>\n';
                        } else {
                            xml += spaces(level) + '<' + jNode.jIndex[j][0] + _printAttribute(node) + '>' + node.jValue + '</' + jNode.jIndex[j][0] + '>\n';
                        }
                    }
                } else {
                    xml += spaces(level) + '<' + jNode.jName + _printAttribute(jNode) + '>' + jNode.jValue + '</' + jNode.jName + '>\n';
                }
                return xml;
            };
            if (jNode.length) {
                var xmlArr = [];
                for (var i = 0; i < jNode.length; i++) {
                    xmlArr.push(_printNode(jNode[i], 0))
                }
                return xmlArr;
            } else {
                return _printNode(jNode, 0);
            }
        }
    };

    window.X2J = X2J;

    //////////////////////////////////////////////////////////
    //////////////////////Constants///////////////////////
    //////////////////////////////////////////////////////////

    var ANY_TYPE = 0,                  //A result set containing whatever type naturally results from evaluation of the expression. Note that if the result is a node-set then UNORDERED_NODE_ITERATOR_TYPE is always the resulting type.
        NUMBER_TYPE = 1,                 //A result containing a single number. This is useful for example, in an XPath expression using the count() function.
        STRING_TYPE = 2,                 //A result containing a single string.
        BOOLEAN_TYPE = 3,                 //A result containing a single boolean value. This is useful for example, in an XPath expression using the not() function.
        UNORDERED_NODE_ITERATOR_TYPE = 4, //A result node-set containing all the nodes matching the expression. The nodes may not necessarily be in the same order that they appear in the document.
        ORDERED_NODE_ITERATOR_TYPE = 5, //A result node-set containing all the nodes matching the expression. The nodes in the result set are in the same order that they appear in the document.
        UNORDERED_NODE_SNAPSHOT_TYPE = 6, //A result node-set containing snapshots of all the nodes matching the expression. The nodes may not necessarily be in the same order that they appear in the document.
        ORDERED_NODE_SNAPSHOT_TYPE = 7, //A result node-set containing snapshots of all the nodes matching the expression. The nodes in the result set are in the same order that they appear in the document.
        ANY_UNORDERED_NODE_TYPE = 8, //A result node-set containing any single node that matches the expression. The node is not necessarily the first node in the document that matches the expression.
        FIRST_ORDERED_NODE_TYPE = 9;    //A result node-set containing the first node in the document that matches the expression.

    var XPathDict = {
        0: "ANY_TYPE",
        1: "NUMBER_TYPE",
        2: "STRING_TYPE",
        3: "BOOLEAN_TYPE",
        4: "UNORDERED_NODE_ITERATOR_TYPE",
        5: "ORDERED_NODE_ITERATOR_TYPE",
        6: "UNORDERED_NODE_SNAPSHOT_TYPE",
        7: "ORDERED_NODE_SNAPSHOT_TYPE",
        8: "ANY_UNORDERED_NODE_TYPE",
        9: "FIRST_ORDERED_NODE_TYPE"
    };

    var ELEMENT_NODE = 1,
        ATTRIBUTE_NODE = 2,
        TEXT_NODE = 3,
        DATA_SECTION_NODE = 4,
        ENTITY_REFERENCE_NODE = 5,
        ENTITY_NODE = 6,
        PROCESSING_INSTRUCTION_NODE = 7,
        COMMENT_NODE = 8,
        DOCUMENT_NODE = 9,
        DOCUMENT_TYPE_NODE = 10,
        DOCUMENT_FRAGMENT_NODE = 11,
        NOTATION_NODE = 12

    var ElementDict = { 1: "ELEMENT_NODE",
        2: "ATTRIBUTE_NODE",
        3: "TEXT_NODE",
        4: "DATA_SECTION_NODE",
        5: "ENTITY_REFERENCE_NODE",
        6: "ENTITY_NODE",
        7: "PROCESSING_INSTRUCTION_NODE",
        8: "COMMENT_NODE",
        9: "DOCUMENT_NODE",
        10: "DOCUMENT_TYPE_NODE",
        11: "DOCUMENT_FRAGMENT_NODE",
        12: "NOTATION_NODE"
    };
} (window));

export default {
  name: "lib",
  methods: {
    makeid : function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text.toLowerCase();
    }
  }
}
