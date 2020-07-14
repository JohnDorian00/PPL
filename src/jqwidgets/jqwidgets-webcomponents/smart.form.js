
/* Smart UI v7.4.0 (2020-Apr) 
Copyright (c) 2011-2020 jQWidgets. 
License: https://htmlelements.com/license/ */ //

class FormControl {
    constructor(element) {
        const that = this;

        that.element = element;
        that._parent = null;

        that.init(element);

        const attach = () => {
            that.element.addEventListener('blur', that.onTouched);
            that.element.addEventListener('change', that.onChange);
        }

        if (that.element.isReady) {
            attach();
        }

        that.element.onAttached = () => {
            attach();
        }

        that.element.onDetached = () => {
            that.element.removeEventListener('blur', that.onTouched);
            that.element.removeEventListener('change', that.onChange);
        }

        if (!element.name) {
            const id = element.nodeName.toLowerCase() + Smart.Utilities.Core.createGUID();
            element.name = id.replace(/-/ig, '');
        }

        that.validate(element);
    }

    init() {
        const that = this;
        const element = that.element;

        element.classList.add('smart-untouched');
        element.classList.add('smart-pristine');
        that._state.touched = false;
        that._state.pristine = true;
        that._state.valid = false;
    }

    get parent() {
        return this_parent;
    }

    set parent(value) {
        this._parent = value;
    }

    set value(value) {
        const that = this;

        if (that.element.selectedValues) {
            if (Array.isArray(value)) {
                that.element.selectedValues = value;
            }
            else {
                that.element.selectedValues = [].push(value);
            }
        }
        else if (that.element.selectedDates) {
            if (Array.isArray(value)) {
                that.element.selectedDates = value;
            }
            else {
                that.element.selectedDates = [].push(value);
            }
        }
        else if (that.element.checked !== undefined) {
            if (value === '') {
                value = null;
            }

            that.element.checked = normalizedValue;
        }
        else {
            that.element.value = value;
        }
    }

    get value() {
        const that = this;

        const selectedValues = that.element.selectedValues !== undefined ? 'selectedValues' : that.element.selectedDates !== undefined ? 'selectedDates' : null;

        if (selectedValues) {
            if (that.element[selectedValues].length > 1) {
                return that.element.selectedValues;
            }
            else if (that.element[selectedValues].length === 1) {
                return that.element.selectedValues[0];
            }
            else if (that.element.querySelector('input')) {
                return that.element.querySelector('input').value;
            }
            else {
                return null;
            }
        }
        else if (that.element.checked !== undefined) {
            return that.element.checked;
        }
        else {
            return that.element.value;
        }

        return null;
    }

    validate() {
        const that = this;
        const element = that.element;

        element.classList.remove('smart-invalid');
        element.classList.remove('smart-valid');

        if (element.selectedValues !== undefined && element.selectedValues.length > 0) {
            element.classList.add('smart-valid');
        }
        else if (element.selectedDates !== undefined && element.selectedDates.length > 0) {
            element.classList.add('smart-valid');
        }
        else if (element.value !== undefined && element.value !== '' && element.value !== null) {
            element.classList.add('smart-valid');
        }
        else if (element.checked !== undefined && element.checked !== '' && element.checked === true) {
            element.classList.add('smart-valid');
        }
        else if (element.hasAttribute('aria-owns')) {
            const ownedElement = document.querySelector('#' + element.getAttribute('aria-owns'));
            const formElement = ownedElement.querySelector('[name]');
            const isValid = that.validate(formElement);

            element.classList.add(isValid ? 'smart-valid' : 'smart-invalid');
        }
        else {
            element.classList.add('smart-invalid');
        }


        const isValid = element.classList.contains('smart-valid');
        element.setAttribute('aria-invalid', !isValid);

        element.$.fireEvent('validate', {
            'success': () => {
                element.classList.remove('smart-invalid');
                element.classList.add('smart-valid');
                that.setState('valid', true);
                element.setAttribute('aria-invalid', false);
            },
            'error': () => {
                element.classList.add('smart-invalid');
                element.classList.remove('smart-valid');
                that.setState('valid', false);
                element.setAttribute('aria-invalid', true);
            }
        });

        return isValid;
    }

    reset(element) {

    }

    onTouched() {
        const that = this;

        that.element.classList.remove('smart-untouched');
        that.element.classList.add('smart-touched');
        that.element.touched = true;

        that.validate();
    }

    onChange() {
        const that = this;

        that.element.classList.remove('smart-pristine');
        that.element.classList.add('smart-dirty');
        that.element.pristine = false;

        that.validate(element);

        return true;
    }
}

class FormGroup {
    constructor(validators) {
        this._controls = new Smart.ObservableArray([]);
        this._parent = null;
    }

    get controls() {
        return this._controls;
    }

    set value(value) {

    }

    get value() {

    }

    get root() {
        let x = this;
        while (x.parent) {
            x = x.parent;
        }
        return x;
    }

    get pristine() {
        return this._pristine;
    }

    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }

    _calculateStatus() {
        if (this._allControls('disabled')) {
            return 'disabled';
        }
        if (this.errors) {
            return 'invalid';
        }
        if (this._anyControls('pending')) {
            return 'pending';
        }
        if (this._anyControls('invalid')) {
            return 'pending';
        }

        return 'valid';
    }


    _allControls(condition) {
        let result = true;

        for (let i = 0; i < this.controls.length; i++) {
            const control = this.controls[i];

            result = result && control[condition];
        }

        return result;
    }

    _anyControls(condition) {
        let result = false;

        for (let i = 0; i < this.controls.length; i++) {
            const control = this.controls[i];

            result = result || control[condition];
        }

        return result;
    }

    _updatePristine() {
        this._pristine = !this._anyControls('dirty')();

        if (this._parent) {
            this._parent._updatePristine(opts);
        }
    }
}
