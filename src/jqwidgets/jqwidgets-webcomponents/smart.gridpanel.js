
/* Smart UI v7.4.0 (2020-Apr) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */ //

/**
 * GridPanel custom element.
 */
Smart('smart-grid-panel', class GridPanel extends Smart.BaseElement {
    // GridPanel's properties.
    static get properties() {
        return {
            'closeButtonPosition': {
                value: 'left',
                allowedValues: ['left', 'right'],
                type: 'string'
            },
            'dataSource': {
                value: [],
                type: 'array',
                reflectToAttribute: false
            },
            'messages': {
                value: {
                    'en': {
                        'apply': 'Apply',
                        'booleanFirst': '☐',
                        'booleanLast': '☑',
                        'cancel': 'Cancel',
                        'dateFirst': '1',
                        'dateLast': '9',
                        'from': 'from',
                        'numberFirst': '1',
                        'numberLast': '9',
                        'stringFirst': 'A',
                        'stringLast': 'Z',
                        'thenBy': 'then by'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
     * GridPanel's event listeners.
     */
    static get listeners() {
        return {
            'change': '_changeHandler',
            'click': '_clickHandler',
            'keydown': '_keydownHandler',
            'sortable.dragEnd': '_sortableDragEndHandler'
        };
    }

    /**
     * GridPanel's required files.
     */
    static get requires() {
        return {
            'Smart.Input': 'smart.input.js',
            'Smart.Sortable': 'smart.sortable.js'
        };
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.gridpanel.css'
        ]
    }

    /**
     * GridPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <smart-sortable id="sortable" animation="[[animation]]" disabled="[[readonly]]" right-to-left="[[rightToLeft]]" 
                            drag-mode="handle" handle-position="right" handle-visibility="visible" theme="[[theme]]">
                    </smart-sortable>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <smart-input id="inputNotSorted" right-to-left="[[rightToLeft]]" animation="[[animation]]" readonly theme="[[theme]]"></smart-input>
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Called when the element is ready
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        that.setAttribute('role', 'dialog');

        if (that.closeButtonPosition === 'right') {
            that.$.sortable.handlePosition = 'left';
        }

        that._localize();
        that._createSources();

        super.render();
    }

    /**
    * Updates the GridPanel when a property is  changed.
    * @param {string} propertyName The name of the property.
    * @param {number/string} oldValue The previously entered value.
    * @param {number/string} newValue The new entered value.
    */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'animation':
            case 'theme': {
                const inputs = Array.from(that.$.sortable.getElementsByTagName('smart-input'));

                inputs.forEach(input => input[propertyName] = newValue);
                break;
            }
            case 'disabled':
            case 'unfocusable':
                that._setFocusable();
                break;
            case 'closeButtonPosition':
                if (that.closeButtonPosition === 'right') {
                    that.$.sortable.handlePosition = 'left';
                }
                else {
                    that.$.sortable.handlePosition = 'right';
                }

                break;
            case 'dataSource':
                that.$.sortable.$.container.innerHTML = '';
                that._createSources();
                break;
            case 'locale':
            case 'messages': {
                const items = that.$.sortable._items;

                that._localize();

                if (items.length) {
                    items[0].children[1].innerHTML = that.localize('firstBy');

                    items.forEach(function (item, index) {
                        if (index !== 0) {
                            item.children[1].innerHTML = that.localize('thenBy');
                        }

                        const itemInfo = that._HTMLToSourceMap.get(item),
                            ascDescTemplates = that._ascDescTemplates[itemInfo.dataType] || that._ascDescTemplates.string;

                        item.children[3].innerHTML = that.localize('from');
                        item.children[4].firstElementChild.innerHTML = ascDescTemplates[0];
                        item.children[4].children[1].innerHTML = ascDescTemplates[1];
                    });
                }

                break;
            }
            case 'maxLevel':
                if (newValue !== undefined && newValue !== null) {
                    while (that.$.sortable._items.length > 0 && that.$.sortable._items.length > newValue) {
                        that._interactionHandler(that.$.sortable._items[that.$.sortable._items.length - 1].firstElementChild);
                    }
                }

                that._disableItemAddition();
                break;
            case 'rightToLeft':
                that.$.inputNotSorted.rightToLeft = newValue;
                that.$.inputNotSorted.dropDownButtonPosition = newValue ? 'left' : 'right';
                that.$.sortable._items.forEach(item => {
                    const input = item.querySelector('smart-input');

                    input.rightToLeft = newValue;
                    input.dropDownButtonPosition = newValue ? 'left' : 'right';
                });
                break;
        }
    }

    /**
     * change handler.
     */
    _changeHandler(event) {
        const that = this,
            target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target;

        if (that.$.inputNotSorted.contains(target)) {
            const value = that.$.inputNotSorted.value,
                newInfo = that._labelToSourceMap.get(value);

            that._createSortItem(newInfo, that.$.sortable._items.length);
            that.$.sortable.updateItems();
            that._visibleLabels.push(value);
            that._updateHiddenSource();
            that._disableItemAddition();
            that.$.inputNotSorted.value = '';
            return;
        }

        const input = target.closest('smart-input');

        if (!input) {
            return;
        }

        const sortItem = input.parentElement.parentElement,
            sortAsc = sortItem.children[4].firstElementChild,
            sortDesc = sortItem.children[4].children[1],
            value = input.value,
            oldValue = that._HTMLToSourceMap.get(sortItem).label,
            newInfo = that._labelToSourceMap.get(value),
            ascDescTemplates = that._ascDescTemplates[newInfo.dataType] || that._ascDescTemplates.string;

        that._HTMLToSourceMap.set(sortItem, newInfo);
        that._visibleLabels.splice(that._visibleLabels.indexOf(oldValue), 1, value);
        that._updateHiddenSource();

        sortAsc.innerHTML = ascDescTemplates[0];
        sortDesc.innerHTML = ascDescTemplates[1];

        if (!newInfo.sortDirection || newInfo.sortDirection.indexOf('asc') !== -1) {
            sortAsc.classList.add('selected');
            sortDesc.classList.remove('selected');
        }
        else {
            sortDesc.classList.add('selected');
            sortAsc.classList.remove('selected');
        }
    }

    /**
     * Updates the list of unsorted columns.
     */
    _updateHiddenSource() {
        const that = this;

        that._hiddenSource = that.dataSource.map(item => {
            return { label: item.label, value: item.dataField, icon: item.icon };
        }).filter(item => that._visibleLabels.indexOf(item.label) === -1);
        that.$.inputNotSorted.dataSource = that._hiddenSource;
        that.$.sortable._items.forEach(item => item.getElementsByTagName('smart-input')[0].dataSource = that._hiddenSource);
        that._disableItemAddition();
    }

    /**
     * click handler.
     */
    _clickHandler(event) {
        const that = this;

        that._interactionHandler(that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target, event);
    }

    /**
     * Interaction handler.
     */
    _interactionHandler(target, event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return true;
        }

        const sortItem = target.closest('.smart-grid-panel-item');

        if (sortItem) {
            if (target === sortItem.firstElementChild) {
                // close button is clicked
                const itemInfo = that._HTMLToSourceMap.get(sortItem),
                    label = itemInfo.label;

                that.$.sortable.$.container.removeChild(sortItem);
                that.$.sortable.updateItems();

                that._visibleLabels.splice(that._visibleLabels.indexOf(label), 1);
                that._updateHiddenSource();
                that._disableItemAddition();

                if (that.$.sortable._items.length) {
                    that.$.sortable._items[0].children[1].innerHTML = that.localize('firstBy');
                }
            }
            else if (sortItem.children[4].contains(target)) {
                // sort direction buttons are clicked
                const sortAsc = sortItem.children[4].firstElementChild,
                    sortDesc = sortItem.children[4].children[1];

                if (event.type === 'click') {
                    if (!target.classList.contains('selected')) {
                        if (target === sortAsc) {
                            sortDesc.classList.remove('selected');
                            sortAsc.classList.add('selected');
                            that._HTMLToSourceMap.get(sortItem).sortDirection = 'ascending';
                        }
                        else if (target === sortDesc) {
                            sortAsc.classList.remove('selected');
                            sortDesc.classList.add('selected');
                            that._HTMLToSourceMap.get(sortItem).sortDirection = 'descending';
                        }
                    }
                }
                else {
                    sortAsc.classList.toggle('selected');
                    sortDesc.classList.toggle('selected');
                    that._HTMLToSourceMap.get(sortItem).sortDirection = sortAsc.classList.contains('selected') ? 'ascending' : 'descending';
                }
            }

            return true;
        }

        if (target === that.$.buttonsContainer.firstElementChild) {
            // "Cancel" button is clicked
            that.$.fireEvent('cancel');
            return true;
        }

        if (target === that.$.buttonsContainer.children[1]) {
            // "Apply" button is clicked
            const value = [],
                sortByInfo = { dataFields: [], dataTypes: [], orderBy: [] },
                detail = { value: value };

            that.$.sortable._items.forEach(item => {
                const itemInfo = that._HTMLToSourceMap.get(item);

                value.push({ dataField: itemInfo.dataField, sortDirection: itemInfo.sortDirection });
                sortByInfo.dataFields.push(itemInfo.dataField);
                sortByInfo.dataTypes.push(itemInfo.dataType);
                sortByInfo.orderBy.push(itemInfo.sortDirection);
            });

            if (that instanceof Smart.SortPanel) {
                detail.sortByInfo = sortByInfo;
            }

            that.$.fireEvent('apply', detail);
            return true;
        }
    }

    /**
     * keydown handler.
     */
    _keydownHandler(event) {
        const that = this,
            key = event.key;

        if (key === ' ' || key === 'Enter') {
            event.preventDefault();
            that._interactionHandler((that.shadowRoot || that.getRootNode()).activeElement, event);
        }
    }

    /**
     * sortable dragEnd handler.
     */
    _sortableDragEndHandler(event) {
        const that = this,
            oldIndex = event.detail.oldIndex,
            newIndex = event.detail.newIndex,
            maxIndex = Math.max(oldIndex, newIndex),
            items = that.$.sortable._items;

        if ((oldIndex && newIndex) === 0) {
            items[0].children[1].innerHTML = that.localize('firstBy');
            items[1].children[1].innerHTML = that.localize('thenBy');

            if (maxIndex > 1) {
                items[maxIndex].children[1].innerHTML = that.localize('thenBy');
            }
        }
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        const that = this;

        that.$.inputNotSorted.placeholder = that.localize('pickAnother');
        that.$.buttonsContainer.firstElementChild.innerHTML = that.localize('cancel');
        that.$.buttonsContainer.children[1].innerHTML = that.localize('apply');

        that._ascDescTemplates = {
            boolean: [that.localize('booleanFirst') + ' → ' + that.localize('booleanLast'), that.localize('booleanLast') + ' → ' + that.localize('booleanFirst')],
            date: [that.localize('dateFirst') + ' → ' + that.localize('dateLast'), that.localize('dateLast') + ' → ' + that.localize('dateFirst')],
            number: [that.localize('numberFirst') + ' → ' + that.localize('numberLast'), that.localize('numberLast') + ' → ' + that.localize('numberFirst')],
            string: [that.localize('stringFirst') + ' → ' + that.localize('stringLast'), that.localize('stringLast') + ' → ' + that.localize('stringFirst')]
        };
    }

    /**
     * Gets items collection.
     */
    _createSources() {
        const that = this,
            positioningIndex = (that instanceof Smart.SortPanel ? 'sort' : 'group') + 'Index',
            visible = [],
            visibleLabels = [];

        that._HTMLToSourceMap = new Map();
        that._labelToSourceMap = new Map();

        that.dataSource.forEach((item) => {
            that._labelToSourceMap.set(item.label, item);

            if (item[positioningIndex] !== -1 && item[positioningIndex] !== undefined) {
                visible.push(item);
            }
        });

        visible.sort((a, b) => a[positioningIndex] - b[positioningIndex]);

        if (that.maxLevel !== undefined && that.maxLevel !== null) {
            while (visible.length > 0 && visible.length > that.maxLevel) {
                visible.pop();
            }
        }

        that.$.inputNotSorted.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
        visible.forEach(item => visibleLabels.push(item.label));
        that._visibleLabels = visibleLabels;
        that._updateHiddenSource();
        visible.forEach((item, index) => {
            that._createSortItem(item, index);
        });
        that.$.sortable.updateItems();
        that._disableItemAddition();
        that._setFocusable();
    }

    /**
     * Creates a sort item.
     */
    _createSortItem(item, index) {
        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0,
            sortItem = document.createElement('div'),
            ascDescTemplates = that._ascDescTemplates[item.dataType] || that._ascDescTemplates.string;

        sortItem.className = 'smart-grid-panel-item';

        sortItem.innerHTML = `<div class="smart-grid-panel-item-close-button" tabindex="${tabindex}" role="button" aria-label="Close"></div>
<div class="smart-grid-panel-label-by smart-unselectable" role="presentation">${that.localize(index > 0 ? 'thenBy' : 'firstBy')}</div>
<div class="smart-grid-panel-field-container" role="presentation"><smart-input class="smart-grid-panel-field-selection" value="${item.label}" animation="${that.animation}" readonly theme="${that.theme}" aria-label="Field name"></smart-input></div>
<div class="smart-grid-panel-from smart-unselectable" role="presentation">${that.localize('from')}</div >
<div class="smart-grid-panel-direction smart-unselectable" tabindex="${tabindex}" role="presentation">
    <div class="smart-grid-panel-asc" role="button" aria-label="Ascending">${ascDescTemplates[0]}</div >
    <div class="smart-grid-panel-desc" role="button" aria-label="Descending">${ascDescTemplates[1]}</div>
</div>
`;
        const inputElement = sortItem.querySelector('smart-input');

        inputElement.dataSource = that._hiddenSource;
        inputElement.rightToLeft = that.rightToLeft;
        inputElement.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';

        that.$.sortable.$.container.appendChild(sortItem);

        inputElement.tabIndex = tabindex;

        if (!item.sortDirection || item.sortDirection.indexOf('asc') !== -1) {
            item.sortDirection = 'ascending';
            sortItem.children[4].firstElementChild.classList.add('selected');
        }
        else {
            sortItem.children[4].children[1].classList.add('selected');
        }

        that._HTMLToSourceMap.set(sortItem, item);
    }

    /**
     * Disables or enables item addition.
     */
    _disableItemAddition() {
        const that = this,
            maxLevel = that.maxLevel,
            disabled = that._hiddenSource.length === 0 ||
                maxLevel !== undefined && maxLevel !== null &&
                Math.max(0, maxLevel) === that.$.sortable._items.length;

        that.$.inputNotSorted.disabled = disabled;

        if (disabled) {
            that.$.inputNotSorted.removeAttribute('focus');
        }
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0,
            closeButtons = Array.from(that.getElementsByClassName('smart-grid-panel-item-close-button')),
            directions = Array.from(that.getElementsByClassName('smart-grid-panel-direction')),
            inputs = Array.from(that.getElementsByTagName('input')),
            allFocusable = closeButtons.concat(directions).concat(inputs);

        that.$.buttonsContainer.firstElementChild.tabIndex = tabindex;
        that.$.buttonsContainer.children[1].tabIndex = tabindex;
        allFocusable.forEach(element => element.tabIndex = tabindex);
    }
});

/**
 * SortPanel custom element.
 */
Smart('smart-sort-panel', class SortPanel extends Smart.GridPanel {
    // SortPanel's properties.
    static get properties() {
        return {
            'messages': {
                value: {
                    'en': {
                        'firstBy': 'Sort by',
                        'noSorting': 'No sorting applied',
                        'pickAnother': 'Pick another field to sort by'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
  * CSS files needed for the element (ShadowDOM)
  */
    static get styleUrls() {
        return [
            'smart.textbox.css'
        ]
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        super._localize();

        const that = this;

        that.$.sortable.$.container.setAttribute('no-sorting', that.localize('noSorting'));
    }
});

/**
 * GroupPanel custom element.
 */
Smart('smart-group-panel', class GroupPanel extends Smart.GridPanel {
    // GroupPanel's properties.
    static get properties() {
        return {
            'maxLevel': {
                value: 8,
                type: 'number?'
            },
            'messages': {
                value: {
                    'en': {
                        'collapseAll': 'Collapse all',
                        'expandAll': 'Expand all',
                        'firstBy': 'Group by',
                        'noGrouping': 'No grouping',
                        'pickAnother': 'Pick another field to group by'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
     * GroupPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <smart-sortable right-to-left="[[rightToLeft]]" id="sortable" animation="[[animation]]" disabled="[[readonly]]" drag-mode="handle" handle-position="right" handle-visibility="visible" theme="[[theme]]"></smart-sortable>
                    <div id="expandCollapseContainer" class="smart-grid-panel-buttons-container smart-grid-panel-expand-collapse smart-unselectable" role="presentation">
                        <span class="smart-group-panel-collapse-button" role="button"></span>
                        <span class="smart-group-panel-expand-button" role="button"></span>
                    </div>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <smart-input right-to-left="[[rightToLeft]]" id="inputNotSorted" animation="[[animation]]" readonly theme="[[theme]]"></smart-input>
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Interaction handler.
     */
    _interactionHandler(target, event) {
        const that = this,
            result = super._interactionHandler(target, event);

        if (result) {
            return;
        }

        if (target === that.$.expandCollapseContainer.firstElementChild) {
            // "Collapse all" button is clicked
            that.$.fireEvent('collapseAll');
        }
        else if (target === that.$.expandCollapseContainer.children[1]) {
            // "Expand all" button is clicked
            that.$.fireEvent('expandAll');
        }
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        super._localize();

        const that = this;

        that.$.expandCollapseContainer.firstElementChild.innerHTML = that.localize('collapseAll');
        that.$.expandCollapseContainer.children[1].innerHTML = that.localize('expandAll');
        that.$.sortable.$.container.setAttribute('no-grouping', that.localize('noGrouping'));
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        super._setFocusable();

        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0;

        that.$.expandCollapseContainer.firstElementChild.tabIndex = tabindex;
        that.$.expandCollapseContainer.children[1].tabIndex = tabindex;
    }
});

/**
 * MultiColumnFilterPanel custom element.
 */
Smart('smart-multi-column-filter-panel', class MultiColumnFilterPanel extends Smart.BaseElement {
    // MultiColumnFilterPanel's properties.
    static get properties() {
        return {
            'closeButtonPosition': {
                value: 'left',
                allowedValues: ['left', 'right'],
                type: 'string'
            },
            'dataSource': {
                value: [],
                type: 'array',
                reflectToAttribute: false
            },
            'editorCallback': {
                value: null,
                type: 'function?',
                reflectToAttribute: false
            },
            'editorPlaceholder': {
                value: 'Value',
                type: 'string'
            },
            'messages': {
                value: {
                    'en': {
                        'addFilter': '+ Add filter',
                        'and': 'And',
                        'apply': 'Apply',
                        'cancel': 'Cancel',
                        'CONTAINS': 'contains',
                        'CONTAINS_CASE_SENSITIVE': 'contains (case sensitive)',
                        'DOES_NOT_CONTAIN': 'does not contain',
                        'DOES_NOT_CONTAIN_CASE_SENSITIVE': 'does not contain (case sensitive)',
                        'EMPTY': 'empty',
                        'ENDS_WITH': 'ends with',
                        'ENDS_WITH_CASE_SENSITIVE': 'ends with (case sensitive)',
                        'EQUAL': 'equal',
                        'EQUAL_CASE_SENSITIVE': 'equal (case sensitive)',
                        'GREATER_THAN': 'greater than',
                        'GREATER_THAN_OR_EQUAL': 'greater than or equal',
                        'LESS_THAN': 'less than',
                        'LESS_THAN_OR_EQUAL': 'less than or equal',
                        'noFilters': 'No filters applied',
                        'NOT_EMPTY': 'not empty',
                        'NOT_EQUAL': 'not equal',
                        'NOT_NULL': 'not null',
                        'NULL': 'null',
                        'or': 'Or',
                        'STARTS_WITH': 'starts with',
                        'STARTS_WITH_CASE_SENSITIVE': 'starts with (case sensitive)',
                        'where': 'Where',
                    }
                },
                type: 'object',
                extend: true
            },
            'operator': {
                value: 'and',
                allowedValues: ['and', 'or'],
                type: 'string',
            },
            'value': {
                value: [],
                type: 'array'
            }
        };
    }

    /**
     * MultiColumnFilterPanel's event listeners.
     */
    static get listeners() {
        return {
            'change': '_changeHandler',
            'click': '_interactionHandler',
            'keydown': '_interactionHandler'
        };
    }

    /**
     * MultiColumnFilterPanel's required files.
     */
    static get requires() {
        return {
            'Smart.Button': 'smart.button.js',
            'Smart.CheckBox': 'smart.checkbox.js',
            'Smart.DateTimePicker': 'smart.datetimepicker.js',
            'Smart.FilterGroup': 'smart.filter.js',
            'Smart.Input': 'smart.input.js',
            'Smart.NumericTextBox': 'smart.numerictextbox.js'
        };
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.gridpanel.css'
        ]
    }

    /**
     * MultiColumnFilterPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <div id="itemsContainer" class="smart-filter-panel-items-container smart-unselectable"></div>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <div id="addFilterButton" class="smart-filter-panel-add-filter-button smart-unselectable" role="button"></div>
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Called when the element is ready
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        that.setAttribute('role', 'dialog');

        that._setFocusable();
        that._localize();
        that._applyValue();
        super.render();
    }

    /**
     * Updates the MultiColumnFilterPanel when a property is  changed.
     * @param {string} propertyName The name of the property.
     * @param {number/string} oldValue The previously entered value.
     * @param {number/string} newValue The new entered value.
     */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'animation':
            case 'theme':
            case 'rightToLeft':
                Array.from(that.$.itemsContainer.querySelectorAll('smart-date-time-picker, smart-numeric-text-box, smart-check-box, smart-input'))
                    .forEach(element => {
                        element[propertyName] = newValue;

                        if (element.tagName.toLowerCase() === 'smart-input' && propertyName === 'rightToLeft' && element.dropDownButtonPosition !== 'none') {
                            element.dropDownButtonPosition = newValue ? 'left' : 'right';
                        }
                    });
                break;
            case 'disabled':
            case 'unfocusable':
                that._setFocusable(true);
                break;
            case 'dataSource':
            case 'value':
                that._applyValue();
                break;
            case 'editorPlaceholder':
                Array.from(that.$.itemsContainer.getElementsByClassName('editor'))
                    .forEach(element => element.placeholder = newValue);
                break;
            case 'locale':
            case 'messages':
                that._localize(true);
                break;
            case 'operator':
                that._setOperator();
                break;
        }
    }

    /**
     * Sets operator.
     */
    _setOperator() {
        const that = this,
            label = that.localize(that.operator);

        for (let i = 2; i < that._items.length; i++) {
            that._items[i].children[1].innerHTML = label;
        }
    }

    /**
     * change handler.
     */
    _changeHandler(event) {
        const that = this,
            target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target;

        if (target instanceof Smart.Input === false) {
            return;
        }

        const item = target.parentElement,
            itemElements = item.children;

        if (target === itemElements[1]) {
            // operator
            that.operator = target.$.input.dataValue;
            that._setOperator();
        }
        else if (target === itemElements[2]) {
            // data field
            const oldDataType = that.dataSource.find(col => col.dataField === event.detail.oldValue).dataType,
                newColumn = that.dataSource.find(col => col.dataField === event.detail.value),
                newDataType = newColumn.dataType;

            if (newDataType !== 'enum' && newDataType === oldDataType) {
                if (that.editorCallback) {
                    that.editorCallback(itemElements[4], newColumn);
                }

                return;
            }

            const currentCondition = itemElements[3].value;
            let conditionsSource, newEditor;

            switch (newDataType) {
                case 'date':
                    conditionsSource = that._numberAndDateConditions;
                    newEditor = document.createElement('smart-date-time-picker');
                    newEditor.calendarButton = true;
                    newEditor.dropDownAppendTo = 'body';
                    newEditor.dropDownDisplayMode = 'auto';
                    newEditor.formatString = 'M/d/yy H:mm';
                    break;
                case 'number':
                    conditionsSource = that._numberAndDateConditions;
                    newEditor = document.createElement('smart-numeric-text-box');
                    break;
                case 'boolean':
                    conditionsSource = that._booleanConditions;
                    newEditor = document.createElement('smart-check-box');
                    break;
                case 'enum':
                    conditionsSource = that._enumConditions;
                    newEditor = document.createElement('smart-input');
                    newEditor.dataSource = newColumn.options;
                    newEditor.readonly = true;
                    newEditor.dropDownButtonPosition = 'right';
                    break;
                default:
                    conditionsSource = that._stringConditions;
                    newEditor = document.createElement('smart-input');
                    break;
            }

            newEditor.rightToLeft = that.rightToLeft;
            newEditor.animation = that.animation;
            newEditor.theme = that.theme;
            newEditor.unfocusable = that.disabled || that.unfocusable;

            if (newDataType !== 'boolean') {
                newEditor.placeholder = that.editorPlaceholder;
            }

            if (that.editorCallback) {
                that.editorCallback(newEditor, newColumn);
            }

            itemElements[4].remove();
            item.appendChild(newEditor);

            if (currentCondition !== '' &&
                !conditionsSource.find(condition => condition.label === currentCondition)) {
                itemElements[3].value = '';
            }

            itemElements[3].dataSource = conditionsSource;
            item.dataType = newDataType;
        }
        else if (target === itemElements[3]) {
            // condition
            const editor = itemElements[4],
                dataValue = target.$.input.dataValue;

            if (dataValue.indexOf('NULL') !== -1 || dataValue.indexOf('EMPTY') !== -1) {
                editor.value = '';
                editor.checked = false;
                editor.classList.add('smart-visibility-hidden');
            }
            else {
                editor.classList.remove('smart-visibility-hidden');
            }

            target.condition = dataValue;
        }
    }

    /**
     * Interaction handler.
     */
    _interactionHandler(event) {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        if (event.type === 'keydown') {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
            }
            else {
                return;
            }
        }

        const target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target,
            item = target.closest('.smart-grid-panel-item');

        if (item) {
            if (target === item.firstElementChild) {
                const itemIndex = that._items.indexOf(item);
                let operator;

                that._items.splice(itemIndex, 1);
                item.remove();

                if (that._items.length > 0 && itemIndex < 2) {
                    if (itemIndex === 0) {
                        that._items[0].children[1].remove();
                        operator = document.createElement('div');
                        operator.innerHTML = that.localize('where');
                        that._items[0].insertBefore(operator, that._items[0].children[1]);
                    }

                    if (that._items.length > 1) {
                        that._items[1].children[1].remove();
                        operator = document.createElement('smart-input');
                        operator.className = 'underlined';
                        operator.dataSource = [{ value: 'and', label: that.localize('and') }, { value: 'or', label: that.localize('or') }];
                        operator.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
                        operator.readonly = true;
                        operator.value = that.localize(that.operator);
                        operator.animation = that.animation;
                        operator.theme = that.theme;
                        operator.rightToLeft = that.rightToLeft;
                        operator.unfocusable = that.disabled || that.unfocusable;
                        that._items[1].insertBefore(operator, that._items[1].children[1]);
                    }
                }
            }

            return;
        }

        if (target === that.$.addFilterButton && that.dataSource.length > 0) {
            that.$.itemsContainer.appendChild(
                that._createItem(that.dataSource[0], '', '', that._items.length));
            return;
        }

        if (target === that.$.buttonsContainer.firstElementChild) {
            // "Cancel" button is clicked
            that.$.fireEvent('cancel');
            return;
        }

        if (target === that.$.buttonsContainer.children[1]) {
            // "Apply" button is clicked
            const allConditions = that._stringConditions.concat(that._numberAndDateConditions),
                operator = that.operator,
                validValue = [],
                filterGroups = {},
                result = [];

            that._items.forEach(item => {
                const column = that.dataSource.find(col => col.label === item.children[2].value),
                    filter = [];
                let condition = item.children[3].value;

                if (condition === '') {
                    return;
                }

                let dataType = column.dataType;

                condition = allConditions.find(cond => cond.label === condition).value;
                filter.push(column.dataField, condition);

                if (condition.indexOf('NULL') === -1 && condition.indexOf('EMPTY') === -1) {
                    if (dataType === 'boolean') {
                        filter.push(item.children[4].checked);
                    }
                    else if (dataType === 'date') {
                        filter.push(item.children[4].value.toDate());
                    }
                    else if (dataType === 'enum') {
                        let value = item.children[4].$.input.dataValue;

                        if (value === undefined) {
                            const selectedOption = column.options.find(option => option.label === item.children[4].value);

                            if (!selectedOption) {
                                return;
                            }

                            value = selectedOption.value;
                        }

                        dataType = 'string';
                        filter.push(value);
                    }
                    else {
                        filter.push(item.children[4].value);
                    }
                }

                let filterGroup = filterGroups[filter[0]];

                if (filterGroup === undefined) {
                    filterGroup = new Smart.Utilities.FilterGroup();
                    filterGroups[filter[0]] = filterGroup;
                }

                const filterObject = filterGroup.createFilter(dataType, filter[2], filter[1]);

                filterGroup.addFilter(operator, filterObject);
                validValue.push(filter);
            });

            for (let dataField in filterGroups) {
                result.push([dataField, filterGroups[dataField]]);
            }

            that.value = validValue;

            that.$.fireEvent('apply', { filters: result, operator: operator, value: validValue });
        }
    }

    /**
     * Applies filter value.
     */
    _applyValue() {
        const that = this,
            structure = document.createDocumentFragment();
        let index = 0;

        that._items = [];

        while (that.$.itemsContainer.firstElementChild) {
            that.$.itemsContainer.firstElementChild.remove();
        }

        if (that.dataSource.length === 0) {
            return;
        }

        that.value.forEach(filter => {
            if (!Array.isArray(filter)) {
                return;
            }

            const dataField = filter[0],
                column = that.dataSource.find(col => col.dataField === dataField);

            if (!column) {
                return;
            }

            const item = that._createItem(column, filter[1], filter[2], index);

            structure.appendChild(item);
            index++;
        });

        that.$.itemsContainer.appendChild(structure);
    }

    /**
     * Creates an item.
     */
    _createItem(column, condition, value, index) {
        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0,
            item = document.createElement('div'),
            structure = document.createDocumentFragment(),
            closeButton = document.createElement('div'),
            fieldInput = document.createElement('smart-input'),
            conditionInput = document.createElement('smart-input');
        let operator, editor;

        closeButton.className = 'smart-grid-panel-item-close-button';
        closeButton.tabIndex = tabindex;
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('aria-label', 'button');
        structure.appendChild(closeButton);

        if (index === 0) {
            operator = document.createElement('div');
            operator.innerHTML = that.localize('where');
            operator.setAttribute('role', 'presentation');
        }
        else if (index === 1) {
            operator = document.createElement('smart-input');
            operator.className = 'underlined';
            operator.dataSource = [{ value: 'and', label: that.localize('and') }, { value: 'or', label: that.localize('or') }];
            operator.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
            operator.readonly = true;
            operator.value = that.localize(that.operator);
            operator.animation = that.animation;
            operator.theme = that.theme;
            operator.rightToLeft = that.rightToLeft;
            operator.unfocusable = that.disabled || that.unfocusable;
            operator.setAttribute('aria-label', 'Operator');
        }
        else {
            operator = document.createElement('div');
            operator.innerHTML = that.localize(that.operator);
            operator.setAttribute('role', 'presentation');
        }

        structure.appendChild(operator);

        fieldInput.className = 'underlined';
        fieldInput.dataSource = that.dataSource.map(col => {
            return { value: col.dataField, label: col.label, icon: col.icon };
        });
        fieldInput.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
        fieldInput.readonly = true;
        fieldInput.value = column.label;
        fieldInput.animation = that.animation;
        fieldInput.theme = that.theme;
        fieldInput.rightToLeft = that.rightToLeft;
        fieldInput.unfocusable = that.disabled || that.unfocusable;
        fieldInput.setAttribute('aria-label', 'Field');
        structure.appendChild(fieldInput);

        if (column.dataType === 'boolean') {
            conditionInput.dataSource = that._booleanConditions;
            editor = document.createElement('smart-check-box');
            editor.checked = typeof value === 'boolean' ? value : false;
        }
        else if (column.dataType === 'date') {
            conditionInput.dataSource = that._numberAndDateConditions;
            editor = document.createElement('smart-date-time-picker');
            editor.dropDownDisplayMode = 'auto';
            editor.calendarButton = true;
            editor.dropDownAppendTo = 'body';
            editor.formatString = 'M/d/yy H:mm';
            editor.value = value;
        }
        else if (column.dataType === 'number') {
            conditionInput.dataSource = that._numberAndDateConditions;
            editor = document.createElement('smart-numeric-text-box');
            editor.value = typeof value === 'number' || typeof value === 'string' ? value : 0;
        }
        else if (column.dataType === 'enum') {
            conditionInput.dataSource = that._enumConditions;
            editor = document.createElement('smart-input');
            editor.dataSource = column.options;
            editor.readonly = true;
            editor.dropDownButtonPosition = 'right';
            editor.value = value ? column.options.find(option => option.value === value).label : '';
        }
        else {
            conditionInput.dataSource = that._stringConditions;
            editor = document.createElement('smart-input');
            editor.value = value !== undefined && value !== null ? value.toString() : '';
        }

        conditionInput.className = 'underlined';
        conditionInput.dropDownButtonPosition = that.rightToLeft ? 'left' : 'right';
        conditionInput.readonly = true;
        conditionInput.animation = that.animation;
        conditionInput.theme = that.theme;
        conditionInput.rightToLeft = that.rightToLeft;
        conditionInput.unfocusable = that.disabled || that.unfocusable;
        conditionInput.setAttribute('aria-label', 'Condition');

        if (conditionInput.dataSource.find(defaultCondition => defaultCondition.value === condition)) {
            conditionInput.value = that.localize(condition);
            conditionInput.condition = condition;
        }
        else {
            editor.value = '';
            editor.checked = false;
        }

        if (condition !== undefined &&
            (condition.indexOf('NULL') !== -1 || condition.indexOf('EMPTY') !== -1)) {
            editor.value = '';
            editor.checked = false;
            editor.classList.add('smart-visibility-hidden');
        }

        editor.animation = that.animation;
        editor.classList.add('editor');
        editor.rightToLeft = that.rightToLeft;
        editor.theme = that.theme;
        editor.unfocusable = that.disabled || that.unfocusable;

        if (column.dataType !== 'boolean') {
            editor.placeholder = that.editorPlaceholder;
        }

        if (that.editorCallback) {
            that.editorCallback(editor, column);
        }

        structure.appendChild(conditionInput);
        structure.appendChild(editor);
        item.appendChild(structure);
        item.className = 'smart-grid-panel-item';
        that._items.push(item);
        item.dataType = column.dataType;

        return item;
    }

    /**
     * Localizes labels in template
     */
    _localize(propertyChangedHandler) {
        const that = this;

        that.$.addFilterButton.innerHTML = that.localize('addFilter');
        that.$.buttonsContainer.firstElementChild.innerHTML = that.localize('cancel');
        that.$.buttonsContainer.children[1].innerHTML = that.localize('apply');
        that.$.itemsContainer.setAttribute('no-filters', that.localize('noFilters'));

        that._stringConditions = [
            { value: 'EMPTY', label: that.localize('EMPTY') },
            { value: 'NOT_EMPTY', label: that.localize('NOT_EMPTY') },
            { value: 'CONTAINS', label: that.localize('CONTAINS') },
            { value: 'CONTAINS_CASE_SENSITIVE', label: that.localize('CONTAINS_CASE_SENSITIVE') },
            { value: 'DOES_NOT_CONTAIN', label: that.localize('DOES_NOT_CONTAIN') },
            { value: 'DOES_NOT_CONTAIN_CASE_SENSITIVE', label: that.localize('DOES_NOT_CONTAIN_CASE_SENSITIVE') },
            { value: 'STARTS_WITH', label: that.localize('STARTS_WITH') },
            { value: 'STARTS_WITH_CASE_SENSITIVE', label: that.localize('STARTS_WITH_CASE_SENSITIVE') },
            { value: 'ENDS_WITH', label: that.localize('ENDS_WITH') },
            { value: 'ENDS_WITH_CASE_SENSITIVE', label: that.localize('ENDS_WITH_CASE_SENSITIVE') },
            { value: 'EQUAL', label: that.localize('EQUAL') },
            { value: 'EQUAL_CASE_SENSITIVE', label: that.localize('EQUAL_CASE_SENSITIVE') },
            { value: 'NULL', label: that.localize('NULL') },
            { value: 'NOT_NULL', label: that.localize('NOT_NULL') }
        ];
        that._enumConditions = [
            { value: 'EQUAL', label: that.localize('EQUAL') },
            { value: 'NOT_EQUAL', label: that.localize('NOT_EQUAL') }
        ];
        that._numberAndDateConditions = [
            { value: 'EQUAL', label: that.localize('EQUAL') },
            { value: 'NOT_EQUAL', label: that.localize('NOT_EQUAL') },
            { value: 'LESS_THAN', label: that.localize('LESS_THAN') },
            { value: 'LESS_THAN_OR_EQUAL', label: that.localize('LESS_THAN_OR_EQUAL') },
            { value: 'GREATER_THAN', label: that.localize('GREATER_THAN') },
            { value: 'GREATER_THAN_OR_EQUAL', label: that.localize('GREATER_THAN_OR_EQUAL') },
            { value: 'NULL', label: that.localize('NULL') },
            { value: 'NOT_NULL', label: that.localize('NOT_NULL') }
        ];
        that._booleanConditions = [
            { value: 'EQUAL', label: that.localize('EQUAL') },
            { value: 'NOT_EQUAL', label: that.localize('NOT_EQUAL') },
            { value: 'NULL', label: that.localize('NULL') },
            { value: 'NOT_NULL', label: that.localize('NOT_NULL') }
        ];

        if (!propertyChangedHandler) {
            return;
        }

        that._items.forEach((item, index) => {
            const operatorElement = item.children[1],
                conditionElement = item.children[3];

            if (index === 0) {
                operatorElement.innerHTML = that.localize('where');
            }
            else if (index === 1) {
                operatorElement.dataSource = [{ value: 'and', label: that.localize('and') }, { value: 'or', label: that.localize('or') }];
                operatorElement.value = that.localize(that.operator);
            }
            else {
                operatorElement.innerHTML = that.localize(that.operator);
            }

            if (item.dataType === 'string') {
                conditionElement.dataSource = that._stringConditions;
            }
            else if (item.dataType === 'enum') {
                conditionElement.dataSource = that._enumConditions;
            }
            else if (item.dataType === 'boolean') {
                conditionElement.dataSource = that._booleanConditions;
            }
            else {
                conditionElement.dataSource = that._numberAndDateConditions;
            }

            conditionElement.value = conditionElement.condition ? that.localize(conditionElement.condition) : '';
        });
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable(propertyChangedHandler) {
        const that = this,
            tabindex = (that.disabled || that.unfocusable) ? -1 : 0;

        that.$.addFilterButton.tabIndex = tabindex;
        that.$.buttonsContainer.firstElementChild.tabIndex = tabindex;
        that.$.buttonsContainer.children[1].tabIndex = tabindex;

        if (propertyChangedHandler) {
            const closeButtons = Array.from(that.$.itemsContainer.getElementsByClassName('smart-grid-panel-item-close-button')),
                customElements = Array.from(that.$.itemsContainer.querySelectorAll('smart-date-time-picker, smart-numeric-text-box, smart-check-box, smart-input'));

            closeButtons.forEach(closeButton => closeButton.tabIndex = tabindex);
            customElements.forEach(element => element.unfocusable = that.disabled || that.unfocusable);
        }
    }
});

/**
 * ColumnPanel custom element.
 */
Smart('smart-column-panel', class ColumnPanel extends Smart.BaseElement {
    // ColumnPanel's properties.
    static get properties() {
        return {
            'dataSource': {
                value: [],
                type: 'array',
                reflectToAttribute: false
            },
            'messages': {
                value: {
                    'en': {
                        'apply': 'Apply',
                        'cancel': 'Cancel',
                        'find': 'Find a field',
                        'noResults': 'No results'
                    }
                },
                type: 'object',
                extend: true
            }
        };
    }

    /**
     * ColumnPanel's event listeners.
     */
    static get listeners() {
        return {
            'click': '_interactionHandler',
            'keydown': '_interactionHandler',
            'find.keyup': '_findKeyupHandler',
            'sortable.dragEnd': '_sortableDragEndHandler'
        };
    }

    /**
     * ColumnPanel's required files.
     */
    static get requires() {
        return {
            'Smart.Sortable': 'smart.sortable.js'
        };
    }

    /**
    * CSS files needed for the element (ShadowDOM)
    */
    static get styleUrls() {
        return [
            'smart.gridpanel.css'
        ]
    }

    /**
     * ColumnPanel's HTML template.
     */
    template() {
        return `<div id="container" role="presentation">
                    <div class="smart-column-panel-find-container" role="search">
                        <input id="find" readonly="[[readonly]]" role="searchbox" aria-label="Find a field"></input>
                        <span id="clearButton" class="clear-button smart-hidden" role="button" aria-label="Clear"></span>
                    </div>
                    <smart-sortable id="sortable" right-to-left="[[rightToLeft]]" animation="[[animation]]" disabled="[[readonly]]" drag-mode="handle" handle-position="right" handle-visibility="visible" theme="[[theme]]"></smart-sortable>
                    <div id="footer" class="smart-grid-panel-container-footer" role="presentation">
                        <div id="buttonsContainer" class="smart-grid-panel-buttons-container smart-unselectable" role="presentation">
                            <span class="smart-grid-panel-cancel-button" role="button"></span>
                            <span class="smart-grid-panel-apply-button" role="button"></span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Called when the element is ready
     */
    ready() {
        super.ready();
    }

    render() {
        const that = this;

        that.setAttribute('role', 'dialog');

        that._positionChanged = false;
        that._localize();
        that._createSortItems();
        super.render();
    }

    /**
     * Updates the ColumnPanel when a property is  changed.
     * @param {string} propertyName The name of the property.
     * @param {number/string} oldValue The previously entered value.
     * @param {number/string} newValue The new entered value.
     */
    propertyChangedHandler(propertyName, oldValue, newValue) {
        super.propertyChangedHandler(propertyName, oldValue, newValue);

        const that = this;

        switch (propertyName) {
            case 'disabled':
            case 'unfocusable':
                that._setFocusable();
                break;
            case 'dataSource': {
                const container = that.$.sortable.$.container;

                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                that._createSortItems();
                that._positionChanged = false;
                that.$.find.value = '';
                break;
            }
            case 'locale':
            case 'messages':
                that._localize();
                break;
        }
    }

    /**
     * Creates sort items.
     */
    _createSortItems() {
        const that = this,
            fragment = document.createDocumentFragment();

        that._HTMLToSourceMap = new Map();
        that.dataSource.forEach(column => fragment.appendChild(that._createSortItem(column)));
        that.$.sortable.$.container.appendChild(fragment);
        that.$.sortable.updateItems();
        that._setFocusable();
    }

    /**
     * Creates a sort item.
     */
    _createSortItem(column) {
        const that = this,
            sortItem = document.createElement('div'),
            labelId = that.id + 'Label' + column.dataField;

        that._HTMLToSourceMap.set(sortItem, column);

        sortItem.className = 'smart-grid-panel-item';
        sortItem.innerHTML = `<div class="toggle-visibility${column.visible !== false ? '' : ' hidden'}${column.disableToggle ? ' disable-toggle' : ''}" role="button" aria-controls="${labelId}" aria-label="Toggle visibility"></div>
<span id="${labelId}" class="smart-column-panel-label smart-unselectable${column.icon ? ' icon ' + column.icon : ''}">${column.label}</span>`;
        return sortItem;
    }

    /**
     * click/keydown handler.
     */
    _interactionHandler(event) {
        const that = this;

        if (that.disabled || that.readonly ||
            event.type === 'keydown' && [' ', 'Enter'].indexOf(event.key) === -1) {
            return;
        }

        const target = that.shadowRoot || that.isInShadowDOM ? event.composedPath()[0] : event.target;

        if (target.classList.contains('toggle-visibility')) {
            target.classList.toggle('hidden');
        }
        else if (target.parentElement === that.$.buttonsContainer) {
            if (target === that.$.buttonsContainer.firstElementChild) {
                // "Cancel" button is clicked
                that.$.fireEvent('cancel');
                return;
            }

            if (target === that.$.buttonsContainer.children[1]) {
                // "Apply" button is clicked
                const value = [];

                that.$.sortable._items.forEach(item => {
                    const column = Object.assign({}, that._HTMLToSourceMap.get(item));

                    column.visible = !item.firstElementChild.classList.contains('hidden');
                    value.push(column);
                });

                that.$.fireEvent('apply', { value: value, positionChanged: that._positionChanged });
                that._positionChanged = false;
            }
        }
        else if (target.classList.contains('clear-button')) {
            that.$.find.value = '';
            that._findKeyupHandler();
        }
    }

    /**
     * "Find a field" input keyup handler.
     */
    _findKeyupHandler() {
        const that = this;

        if (that.disabled || that.readonly) {
            return;
        }

        const input = that.$.find,
            value = input.value,
            items = that.$.sortable._items;

        if (that._disabledSortable === undefined) {
            that._disabledSortable = that.$.sortable.disabled;
        }

        if (value === '') {
            input.parentElement.classList.remove('no-results');
            that.$.clearButton.classList.add('smart-hidden');
            items.forEach(item => item.classList.remove('smart-hidden'));
            that.$.sortable.disabled = that._disabledSortable || that.readonly;
            delete that._disabledSortable;
            return;
        }

        let noResults = true;

        that.$.clearButton.classList.remove('smart-hidden');
        items.forEach(item => {
            const column = that._HTMLToSourceMap.get(item);

            if (column.label.toLowerCase().indexOf(value.toLowerCase()) === -1) {
                item.classList.add('smart-hidden');
            }
            else {
                item.classList.remove('smart-hidden');
                noResults = false;
            }
        });

        that.$.sortable.disabled = true;

        if (noResults) {
            input.parentElement.classList.add('no-results');
        }
        else {
            input.parentElement.classList.remove('no-results');
        }
    }

    /**
     * sortable dragEnd handler.
     */
    _sortableDragEndHandler() {
        this._positionChanged = true;
    }

    /**
     * Localizes labels in template
     */
    _localize() {
        const that = this;

        that.$.find.placeholder = that.localize('find');
        that.$.buttonsContainer.firstElementChild.innerHTML = that.localize('cancel');
        that.$.buttonsContainer.children[1].innerHTML = that.localize('apply');
        that.$.container.firstElementChild.setAttribute('no-results', that.localize('noResults'));
    }

    /**
     * Sets whether the element can be focused.
     */
    _setFocusable() {
        const that = this,
            tabIndex = (that.disabled || that.unfocusable) ? -1 : 0,
            toggleIcons = Array.from(that.$.sortable.getElementsByClassName('toggle-visibility'));

        that.$.find.tabIndex = tabIndex;
        that.$.clearButton.tabIndex = tabIndex;
        that.$.buttonsContainer.firstElementChild.tabIndex = tabIndex;
        that.$.buttonsContainer.children[1].tabIndex = tabIndex;
        toggleIcons.forEach(icon => icon.tabIndex = icon.classList.contains('disable-toggle') ? -1 : tabIndex);
    }
});

/**
 * DataView parent class.
 */
Smart('smart-data-view', class DataView extends Smart.BaseElement {
    // DataView's properties.
    static get properties() {
        return {
            'addNewButton': {
                value: false,
                type: 'boolean'
            },
            'allowDrag': {
                value: false,
                type: 'boolean'
            },
            'collapsible': {
                value: false,
                type: 'boolean'
            },
            'columns': {
                value: [],
                type: 'object',
                reflectToAttribute: false
            },
            'dataSource': {
                value: null,
                type: 'object?',
                reflectToAttribute: false
            },
            'editable': {
                value: false,
                type: 'boolean'
            },
            'headerPosition': {
                value: 'none',
                allowedValues: ['none', 'top', 'bottom'],
                type: 'string'
            },
            'messages': {
                value: {
                    'en': {
                        'addFilter': '+ Add filter',
                        'and': 'And',
                        'apply': 'Apply',
                        'booleanFirst': '☐',
                        'booleanLast': '☑',
                        'cancel': 'Cancel',
                        'CONTAINS': 'contains',
                        'CONTAINS_CASE_SENSITIVE': 'contains (case sensitive)',
                        'dateFirst': '1',
                        'dateLast': '9',
                        'DOES_NOT_CONTAIN': 'does not contain',
                        'DOES_NOT_CONTAIN_CASE_SENSITIVE': 'does not contain (case sensitive)',
                        'EMPTY': 'empty',
                        'ENDS_WITH': 'ends with',
                        'ENDS_WITH_CASE_SENSITIVE': 'ends with (case sensitive)',
                        'EQUAL': 'equal',
                        'EQUAL_CASE_SENSITIVE': 'equal (case sensitive)',
                        'filter': 'Filter',
                        'filteredByMultiple': '{{n}} filters',
                        'filteredByOne': '1 filter',
                        'filterValuePlaceholder': 'Value',
                        'find': 'Find a field',
                        'findInView': 'Find in view',
                        'firstBy': 'Sort by',
                        'found': '{{nth}} of {{n}}',
                        'from': 'from',
                        'GREATER_THAN': 'greater than',
                        'GREATER_THAN_OR_EQUAL': 'greater than or equal',
                        'LESS_THAN': 'less than',
                        'LESS_THAN_OR_EQUAL': 'less than or equal',
                        'noFilters': 'No filters applied',
                        'noResults': 'No results',
                        'noSorting': 'No sorting applied',
                        'NOT_EMPTY': 'not empty',
                        'NOT_EQUAL': 'not equal',
                        'NOT_NULL': 'not null',
                        'NULL': 'null',
                        'numberFirst': '1',
                        'numberLast': '9',
                        'ok': 'OK',
                        'or': 'Or',
                        'pickAnother': 'Pick another field to sort by',
                        'sort': 'Sort',
                        'sortedByMultiple': 'Sorted by {{n}} fields',
                        'sortedByOne': 'Sorted by 1 field',
                        'STARTS_WITH': 'starts with',
                        'STARTS_WITH_CASE_SENSITIVE': 'starts with (case sensitive)',
                        'stringFirst': 'A',
                        'stringLast': 'Z',
                        'thenBy': 'then by',
                        'where': 'Where'
                    }
                }
            }
        };
    }

    /**
     * DataView's event listeners.
     */
    static get listeners() {
        return {
            'header.apply': '_applyHandler',
            'header.cancel': 'closePanel',
            'headerDropDown.transitionend': '_headerDropDownTransitionendHandler',
            'searchInput.keyup': '_searchInputKeyupHandler',
            'resize': '_resizeHandler',
            'document.move': '_documentMoveHandler',
            'document.up': '_documentUpHandler'
        };
    }

    render() {
        const that = this;

        if (!that.$.headerDropDown.id) {
            that.$.headerDropDown.id = that.id + 'HeaderDropDown';
        }

        that.setAttribute('role', 'group');

        that._isMobile = Smart.Utilities.Core.isMobile;

        super.render();
    }

    /**
     * Adds filtering.
     *
     * @param {Array} filters Filter information.
     * @param {String} operator Optional Logical operator between the filters of different fields.
     */
    addFilter(filters, operator = 'and') {
        const that = this;

        if (!Array.isArray(filters) || filters.length > 0 && !Array.isArray(filters[0])) {
            return;
        }

        let newFiltering;

        that.closePanel();

        if (arguments[2]) {
            newFiltering = { filters: arguments[2], operator: operator };
        }
        else {
            newFiltering = { filters: [], operator: operator };

            filters.forEach(filterGroup => {
                filterGroup[1].filters.forEach(filterObject => {
                    newFiltering.filters.push([filterGroup[0], filterObject.condition, filterObject.value]);
                });
            });
        }

        if (JSON.stringify(newFiltering) === JSON.stringify(that._appliedFiltering)) {
            return;
        }

        const numberOfFilters = newFiltering.filters.length;

        that._appliedFiltering = newFiltering;

        that._applyFilter(filters, operator);

        that.$.fireEvent('filter');

        if (numberOfFilters === 0) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filter');
            that.$.filterButton.classList.remove('filtered');
            return;
        }

        if (numberOfFilters === 1) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByOne');
        }
        else {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByMultiple', { n: numberOfFilters });
        }

        that.$.filterButton.classList.add('filtered');
    }

    /**
     * Adds sorting.
     *
     * @param {Array/String} dataFields The data field(s) to sort by.
     * @param {Array/String} orderBy The sort direction(s) to sort the data field(s) by.
     */
    addSort(dataFields, orderBy) {
        const that = this,
            dataSource = that.dataSource,
            oldSorting = JSON.stringify(that._appliedSorting);
        let sortByInfo;

        function validate(dataField, index) {
            const column = that.columns.find(col => col.dataField === dataField);

            if (column) {
                let columnOrderBy = Array.isArray(orderBy) ? orderBy[index] : typeof orderBy === 'string' ? orderBy : 'ascending';

                sortByInfo.dataFields.push(dataField);
                sortByInfo.dataTypes.push(dataSource.dataFields.find(sourceField => sourceField.name === dataField).dataType);
                columnOrderBy = columnOrderBy ? columnOrderBy.indexOf('desc') !== -1 ? 'descending' : 'ascending' : 'ascending';
                sortByInfo.orderBy.push(columnOrderBy);
            }
        }

        if (arguments.length === 0 || !dataSource || dataSource.length === 0) {
            return;
        }

        that.closePanel();

        if (arguments.length === 1 && typeof dataFields === 'object') {
            sortByInfo = dataFields;
        }
        else {
            sortByInfo = { dataFields: [], dataTypes: [], orderBy: [] };

            if (Array.isArray(dataFields)) {
                dataFields.forEach(validate);
            }
            else if (typeof dataFields === 'string') {
                validate(dataFields, 0);
            }
            else {
                return;
            }
        }

        that.closePanel();
        that._appliedSorting = sortByInfo;

        if (oldSorting === JSON.stringify(that._appliedSorting)) {
            return;
        }

        const sortedFields = that._appliedSorting.dataFields.length;

        that._applySort();

        that.$.fireEvent('sort');

        if (sortedFields === 0) {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sort');
            that.$.sortButton.classList.remove('sorted');
            return;
        }

        if (sortedFields === 1) {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByOne');
        }
        else {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByMultiple', { n: sortedFields });
        }

        that.$.sortButton.classList.add('sorted');
    }

    /**
     * Closes any open header panel (drop down).
     */
    closePanel() {
        const that = this,
            headerDropDown = that.$.headerDropDown;

        headerDropDown.classList.add('smart-visibility-hidden');
        that._closeSearchPanel();

        if (headerDropDown.controlledBy) {
            headerDropDown.controlledBy.removeAttribute('aria-controls');
            headerDropDown.controlledBy.setAttribute('aria-expanded', false);
            delete headerDropDown.controlledBy;
        }
    }

    /**
     * Opens the "Filter" header panel (drop down).
     */
    openFilterPanel(filterPanelDataSource, filterPanelEditorCallback) {
        const that = this,
            dataSource = that.dataSource;

        if (!dataSource || dataSource.length === 0 || that.disabled || that.headerPosition === 'none') {
            return;
        }

        let filterPanel;

        if (that._editInfo) {
            that._editInfo.window.close();
        }

        that.$.headerDropDown.classList.add('filter-panel');
        that.$.headerDropDown.classList.remove('customize-panel', 'sort-panel', 'search-panel');
        that.$.filter.classList.remove('smart-hidden');
        that.$.customize.classList.add('smart-hidden');
        that.$.sort.classList.add('smart-hidden');
        that.$.search.classList.add('smart-hidden');
        that._closeSearchPanel();

        if (!that._filterPartCreated) {
            filterPanel = document.createElement('smart-multi-column-filter-panel');
            filterPanel.rightToLeft = that.rightToLeft;
            filterPanel.animation = that.animation;
            filterPanel.dataSource = filterPanelDataSource;
            filterPanel.locale = that.locale;
            filterPanel.messages = that._innerElementMessages.multiColumnFilterPanel;
            filterPanel.operator = that._appliedFiltering.operator;
            filterPanel.editorPlaceholder = that.localize('filterValuePlaceholder');
            filterPanel.theme = that.theme;
            filterPanel.value = that._appliedFiltering.filters;
            filterPanel.editorCallback = filterPanelEditorCallback;
            that.$.filter.appendChild(filterPanel);
            that._filterPartCreated = true;
        }
        else {
            filterPanel = that.$.filter.firstElementChild;
            filterPanel.set('operator', that._appliedFiltering.operator);
            filterPanel.set('value', that._appliedFiltering.filters);
            filterPanel._applyValue();
            filterPanel.rightToLeft = that.rightToLeft;
        }

        that._openHeaderDropDown(that.$.filterButton);
    }

    /**
     * Opens the "Sort" header panel (drop down).
     */
    openSortPanel(sortPanelDataSource) {
        const that = this,
            dataSource = that.dataSource;

        if (!dataSource || dataSource.length === 0 || that.disabled || that.headerPosition === 'none') {
            return;
        }

        let sortPanel;

        that._closeDialog();

        that.$.headerDropDown.classList.add('sort-panel');
        that.$.headerDropDown.classList.remove('customize-panel', 'filter-panel', 'search-panel');
        that.$.sort.classList.remove('smart-hidden');
        that.$.customize.classList.add('smart-hidden');
        that.$.filter.classList.add('smart-hidden');
        that.$.search.classList.add('smart-hidden');
        that._closeSearchPanel();

        if (!that._sortPartCreated) {
            sortPanel = document.createElement('smart-sort-panel');
            sortPanel.rightToLeft = that.rightToLeft;
            sortPanel.animation = that.animation;
            sortPanel.dataSource = sortPanelDataSource;
            sortPanel.locale = that.locale;
            sortPanel.messages = that._innerElementMessages.sortPanel;
            sortPanel.theme = that.theme;
            that.$.sort.appendChild(sortPanel);
            that._sortPartCreated = true;
        }
        else {
            sortPanel = that.$.sort.firstElementChild;
            sortPanel.rightToLeft = that.rightToLeft;
            sortPanel.set('dataSource', sortPanelDataSource);
            sortPanel.propertyChangedHandler('dataSource', undefined, sortPanelDataSource);
        }

        that._openHeaderDropDown(that.$.sortButton);
    }

    /**
     * Removes filtering.
     */
    removeFilter() {
        this.addFilter([]);
    }

    /**
     * Removes sorting.
     */
    removeSort() {
        this.addSort({ dataFields: [], dataTypes: [], orderBy: [] });
    }

    /**
     * Clears filter and sort classes and flags.
     */
    _clearFilterAndSortUI() {
        const that = this;

        that._appliedFiltering = { filters: [], operator: 'and' };
        that._appliedSorting = { dataFields: [], dataTypes: [], orderBy: [] };

        that.$.filterButton.classList.remove('filtered');
        that.$.sortButton.classList.remove('sorted');
        that.$.filterButton.firstElementChild.innerHTML = that.localize('filter');
        that.$.sortButton.firstElementChild.innerHTML = that.localize('sort');
    }

    /**
     * Gets messages used for localization of inner custom elements.
     */
    _getInnerElementMessages() {
        const that = this,
            locale = that.locale,
            innerElementMessages = {};

        innerElementMessages.columnPanel = {};
        innerElementMessages.multiColumnFilterPanel = {};
        innerElementMessages.sortPanel = {};
        innerElementMessages.dateTimePicker = {};

        innerElementMessages.columnPanel[locale] = {
            'apply': that.localize('apply'),
            'cancel': that.localize('cancel'),
            'find': that.localize('find'),
            'noResults': that.localize('noResults')
        };

        innerElementMessages.multiColumnFilterPanel[locale] = {
            'addFilter': that.localize('addFilter'),
            'and': that.localize('and'),
            'apply': that.localize('apply'),
            'cancel': that.localize('cancel'),
            'CONTAINS': that.localize('CONTAINS'),
            'CONTAINS_CASE_SENSITIVE': that.localize('CONTAINS_CASE_SENSITIVE'),
            'DOES_NOT_CONTAIN': that.localize('DOES_NOT_CONTAIN'),
            'DOES_NOT_CONTAIN_CASE_SENSITIVE': that.localize('DOES_NOT_CONTAIN_CASE_SENSITIVE'),
            'EMPTY': that.localize('EMPTY'),
            'ENDS_WITH': that.localize('ENDS_WITH'),
            'ENDS_WITH_CASE_SENSITIVE': that.localize('ENDS_WITH_CASE_SENSITIVE'),
            'EQUAL': that.localize('EQUAL'),
            'EQUAL_CASE_SENSITIVE': that.localize('EQUAL_CASE_SENSITIVE'),
            'GREATER_THAN': that.localize('GREATER_THAN'),
            'GREATER_THAN_OR_EQUAL': that.localize('GREATER_THAN_OR_EQUAL'),
            'LESS_THAN': that.localize('LESS_THAN'),
            'LESS_THAN_OR_EQUAL': that.localize('LESS_THAN_OR_EQUAL'),
            'noFilters': that.localize('noFilters'),
            'NOT_EMPTY': that.localize('NOT_EMPTY'),
            'NOT_EQUAL': that.localize('NOT_EQUAL'),
            'NOT_NULL': that.localize('NOT_NULL'),
            'NULL': that.localize('NULL'),
            'or': that.localize('or'),
            'STARTS_WITH': that.localize('STARTS_WITH'),
            'STARTS_WITH_CASE_SENSITIVE': that.localize('STARTS_WITH_CASE_SENSITIVE'),
            'where': that.localize('where')
        };

        innerElementMessages.sortPanel[locale] = {
            'apply': that.localize('apply'),
            'booleanFirst': that.localize('booleanFirst'),
            'booleanLast': that.localize('booleanLast'),
            'cancel': that.localize('cancel'),
            'dateFirst': that.localize('dateFirst'),
            'dateLast': that.localize('dateLast'),
            'firstBy': that.localize('firstBy'),
            'from': that.localize('from'),
            'numberFirst': that.localize('numberFirst'),
            'numberLast': that.localize('numberLast'),
            'noSorting': that.localize('noSorting'),
            'pickAnother': that.localize('pickAnother'),
            'stringFirst': that.localize('stringFirst'),
            'stringLast': that.localize('stringLast'),
            'thenBy': that.localize('thenBy')
        };

        innerElementMessages.dateTimePicker[locale] = {
            'now': that.localize('now'),
            'dateTabLabel': that.localize('dateTabLabel'),
            'timeTabLabel': that.localize('timeTabLabel')
        };

        that._innerElementMessages = innerElementMessages;
    }

    /**
     * Handles header position.
     */
    _handleHeaderPosition(mainContainer) {
        const that = this,
            headerPosition = that.headerPosition,
            header = that.$.header;

        if (headerPosition === 'none') {
            header.classList.add('smart-hidden');
            return;
        }

        header.classList.remove('smart-hidden');

        if (headerPosition === 'top' && header.nextElementSibling !== mainContainer) {
            that.$.container.insertBefore(header, mainContainer);
        }
        else if (headerPosition === 'bottom' && header.previousElementSibling !== mainContainer) {
            that.$.container.insertBefore(header, that.$.loadingIndicatorContainer);
        }
    }

    /**
     * Header click handler.
     */
    _headerClickHandler(target, cardContainer) {
        const that = this,
            headerDropDown = that.$.headerDropDown;

        function toggle(part, openMethod) {
            if (headerDropDown.classList.contains('smart-visibility-hidden') ||
                part.classList.contains('smart-hidden')) {
                that[openMethod]();
            }
            else {
                that.closePanel();
            }
        }

        if (that.$.customizeButton.contains(target)) {
            toggle(that.$.customize, 'openCustomizePanel');
        }
        else if (that.$.filterButton.contains(target)) {
            toggle(that.$.filter, 'openFilterPanel');
        }
        else if (that.$.sortButton.contains(target)) {
            toggle(that.$.sort, 'openSortPanel');
        }
        else if (target === that.$.searchButton) {
            toggle(that.$.search, '_openSearchPanel');
        }
        else if (target === that.$.searchClose) {
            that.closePanel();
        }
        else if (target === that.$.searchPrev || target === that.$.searchNext) {
            const searchInfo = that._searchInfo,
                foundIdsArray = searchInfo.foundIdsArray,
                next = target === that.$.searchNext,
                numberOfFoundItems = foundIdsArray.length;
            let indexToHighlight;

            if (searchInfo.highlighted === undefined) {
                indexToHighlight = next ? 0 : numberOfFoundItems - 1;
            }
            else if (foundIdsArray.length === 1) {
                return;
            }
            else {
                const previousHighlightedIndex = foundIdsArray.indexOf(searchInfo.highlighted),
                    highlightedCards = Array.from(cardContainer.getElementsByClassName('smart-data-view-highlighted'));

                highlightedCards.forEach(highlightedCard => highlightedCard.classList.remove('smart-data-view-highlighted'));

                indexToHighlight = next ? (previousHighlightedIndex + 1) % numberOfFoundItems :
                    previousHighlightedIndex - 1 >= 0 ? previousHighlightedIndex - 1 : numberOfFoundItems - 1;
            }

            searchInfo.highlighted = foundIdsArray[indexToHighlight];

            const card = that.ensureVisible(searchInfo.highlighted);

            card.classList.add('smart-data-view-highlighted');

            that.$.searchLabel.innerHTML = that.localize('found', { nth: indexToHighlight + 1, n: foundIdsArray.length });
        }
    }

    /**
     * Header drop down transitionend handler.
     */
    _headerDropDownTransitionendHandler(event) {
        const that = this,
            dropDown = that.$.headerDropDown;

        if (event &&
            (event.propertyName !== 'visibility' ||
                dropDown.classList.contains('smart-visibility-hidden'))) {
            return;
        }

        if (dropDown.classList.contains('search-panel')) {
            that.$.searchInput.focus();
            return;
        }

        if (that.unfocusable === false) {
            if (dropDown.classList.contains('customize-panel')) {
                dropDown.querySelector('smart-column-panel').$.find.focus();
            }
            else if (dropDown.classList.contains('filter-panel')) {
                dropDown.querySelector('smart-multi-column-filter-panel').$.addFilterButton.focus();
            }
            else if (dropDown.classList.contains('sort-panel')) {
                dropDown.querySelector('smart-sort-panel').$.inputNotSorted.focus();
            }
        }
    }

    /**
     * Localizes labels in the header.
     */
    _localizeHeader() {
        const that = this;

        that.$.customizeButton.firstElementChild.innerHTML = that.localize('customize');

        if (that._appliedFiltering.filters.length === 0) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filter');
        }
        else if (that._appliedFiltering.filters.length === 1) {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByOne');
        }
        else {
            that.$.filterButton.firstElementChild.innerHTML = that.localize('filteredByMultiple', { n: that._appliedFiltering.filters.length });
        }

        if (that._appliedSorting.dataFields.length === 0) {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sort');
        }
        else if (that._appliedSorting.dataFields.length === 1) {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByOne');
        }
        else {
            that.$.sortButton.firstElementChild.innerHTML = that.localize('sortedByMultiple', { n: that._appliedSorting.dataFields.length });
        }

        that.$.searchInput.placeholder = that.localize('findInView');
    }

    /**
     * Opens header drop down.
     */
    _openHeaderDropDown(target) {
        const that = this,
            dropDown = that.$.headerDropDown;

        if (that.headerPosition === 'top') {
            dropDown.style.bottom = null;
            dropDown.style.top = '100%';
        }
        else {
            dropDown.style.top = null;
            dropDown.style.bottom = '100%';
        }

        if (target !== that.$.searchButton) {
            dropDown.style.left = target.offsetLeft - (that.rightToLeft ? dropDown.offsetWidth - target.offsetWidth : 0) + 'px';
        }
        else {
            dropDown.style.left = (that.rightToLeft ? target.offsetLeft : target.offsetLeft + target.offsetWidth - dropDown.offsetWidth) + 'px';
        }

        dropDown.classList.remove('smart-visibility-hidden');

        if (dropDown.controlledBy) {
            dropDown.controlledBy.removeAttribute('aria-controls');
            dropDown.controlledBy.setAttribute('aria-expanded', false);
        }

        dropDown.controlledBy = target;
        target.setAttribute('aria-controls', dropDown.id);
        target.setAttribute('aria-expanded', true);

        that._headerDropDownTransitionendHandler();
    }

    /**
     * Search input keyup handler.
     */
    _searchInputKeyupHandler() {
        const that = this;

        function executeSearch() {
            if (that._searchInfo && that.$.searchInput.value !== that._searchInfo.query) {
                that._search(that.$.searchInput.value);
            }
        }

        clearTimeout(that._searchInputTimeout);

        if (event.key === 'Enter' && that._searchInfo.foundIdsArray && that._searchInfo.foundIdsArray.length > 1) {
            executeSearch();
            that._headerClickHandler(that.$.searchNext, that.$.cardContainer || that.$.body);
            return;
        }

        that._searchInputTimeout = setTimeout(executeSearch, 500);
    }
});
