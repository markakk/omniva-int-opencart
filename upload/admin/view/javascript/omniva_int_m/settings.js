var OMNIVA_INT_SETTINGS = {

    parcelDefaultModal: '#parcel_default_modal',
    shippingMethodModal: '#shipping_option_modal',

    cloneList: {
        apiCountriesSelect: 'apiCountriesSelectEl',
        noCountryPlaceholder: 'noCountryPlaceholderEl'
    },

    noCountryPlaceholderEl: null,
    apiCountriesSelectEl: null,

    init: function () {
        this.cloneDefaultElements();
        this.listenForPaginator();
        this.listenForClicks();
        this.registerGlobalEvents();

        // sender tab countries select
        jQuery('#tab-sender-info .js-select-sender').select2({
            width: 'resolve'
        });

        OMNIVA_INT_M_COMMON.showLoadingOverlay(false, document.querySelector('#content'));
    },

    cloneDefaultElements: function () {
        this.noCountryPlaceholderEl = document.querySelector('[data-modal-no-country]').cloneNode(true);
        this.apiCountriesSelectEl = document.querySelector('.sm-modal-api-countries select[name="api_countries"]').cloneNode(true);
    },

    getCloneEl: function (key) {
        if (OMNIVA_INT_SETTINGS[key] instanceof Node) {
            return OMNIVA_INT_SETTINGS[key].cloneNode(true)
        }

        return null;
    },

    registerGlobalEvents: function () {
        // Shipping method add/edit
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-btn-add-option]', OMNIVA_INT_SETTINGS.openShippingMethodModal);

        // Shipping method add
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-btn-delete-option]', (e) => {
            e.preventDefault();
            OMNIVA_INT_M_COMMON.confirm({
                message: `Delete shipping option ID: ${e.target.dataset.shippingMethodId}?`,
                accept: () => {
                    console.log('Delete shipping method ID:', e.target.dataset.shippingMethodId);
                    OMNIVA_INT_SETTINGS.deleteShippingOption(e.target.dataset.shippingMethodId);
                },
                cancel: () => { }
            });
        });

        // Shipping method save
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '#save-add-shipping-method-btn', (e) => {
            e.preventDefault();
            OMNIVA_INT_SETTINGS.saveShippingOption();
        });

        // Shipping method modal type change
        OMNIVA_INT_M_COMMON.addGlobalListener('change', 'select[name="option_type"]', OMNIVA_INT_SETTINGS.shippingMethodModalTypeSelected);

        // Shipping method modal sevices select buttons
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '.modal-select-service-btn', OMNIVA_INT_SETTINGS.shippingMethodModalServicesSelect);

        // Shipping method modal, price type change
        OMNIVA_INT_M_COMMON.addGlobalListener('change', 'select[name="option_price_type"]', OMNIVA_INT_SETTINGS.shippingMethodModalPriceType);

        // Shipping method modal, add country button
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '.sm-modal-add-country-btn', (e) => {
            e.preventDefault();
            const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
            const countrySelector = modal.querySelector('select[name="api_countries"]');

            OMNIVA_INT_SETTINGS.saveOptionCountry({
                option_id: modal.dataset.shippingOptionId,
                country_code: countrySelector.value,
                offer_priority: null,
                price_type: null,
                price: null,
                free_shipping: null
            }, modal.querySelector('.panel'), (response) => {
                OMNIVA_INT_SETTINGS.shippingMethodModalAddCountryRow(response.fields);
            });
        });

        // Shipping method modal, edit country button
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-cell-btn-edit]', (e) => {
            e.preventDefault();
            console.log('Edit Country row');
            OMNIVA_INT_SETTINGS.shippingMethodModalCountryRowAction(e.target.dataset.cellBtnEdit, true);
        });
        // Shipping method modal, delete country button
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-cell-btn-delete]', (e) => {
            e.preventDefault();

            OMNIVA_INT_M_COMMON.confirm({
                message: `Delete country: ${e.target.dataset.cellBtnDelete}?`,
                accept: () => {
                    console.log('Delete Country');
                    const countryCode = e.target.dataset.cellBtnDelete;
                    const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);

                    OMNIVA_INT_SETTINGS.deleteOptionCountry(modal.dataset.shippingOptionId, countryCode, () => {
                        const countrySelector = modal.querySelector('select[name="api_countries"]');
                        const country = OMNIVA_INT_SETTINGS.findCountryData(countryCode);
                        const countryTable = modal.querySelector('#sm-modal-countries');
                        const countryRow = countryTable.querySelector(`tr[data-country-code="${countryCode}"]`);

                        if (countryRow) {
                            countryRow.remove();
                        }

                        if (country && !countrySelector.querySelector(`option[value="${countryCode}"]`)) {
                            const option = document.createElement('option');
                            option.innerText = country.en_name;
                            option.value = country.code;
                            countrySelector.append(option);
                        }

                        if (countryTable.children.length < 1 && OMNIVA_INT_SETTINGS.noCountryPlaceholderEl) {
                            countryTable.append(OMNIVA_INT_SETTINGS.getCloneEl(OMNIVA_INT_SETTINGS.cloneList.noCountryPlaceholder));
                        }
                    });
                },
                cancel: () => { }
            });
        });
        // Shipping method modal, save edit country button
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-cell-btn-save]', (e) => {
            e.preventDefault();
            console.log('Saving row data');
            const countryCode = e.target.dataset.cellBtnSave;
            const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
            const countryTable = modal.querySelector('#sm-modal-countries');
            const row = countryTable.querySelector(`tr[data-country-code="${countryCode}"]`);

            const data = {
                option_id: modal.dataset.shippingOptionId,
                country_code: countryCode,
                offer_priority: row.querySelector('[data-cell-priority] select').value,
                price_type: row.querySelector('[data-cell-price] select').value,
                price: row.querySelector('[data-cell-price] input').value,
                free_shipping: row.querySelector('[data-cell-free-shipping] input').value,
            };

            console.log('Data to save', data);
            OMNIVA_INT_SETTINGS.saveOptionCountry(data, row, (response) => {
                OMNIVA_INT_SETTINGS.shippingMethodModalCountryUpdateRowData(response.fields);
            });
        });
        // Shipping method modal, cancel edit country button
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-cell-btn-cancel]', (e) => {
            e.preventDefault();
            console.log('Canceled row edit');
            OMNIVA_INT_SETTINGS.shippingMethodModalCountryRowAction(e.target.dataset.cellBtnCancel, false);
        });
    },

    listenForClicks: function () {
        document.addEventListener('click', function (e) {
            if (e.target.matches('.save-global-dimensions')) {
                e.preventDefault();
                OMNIVA_INT_SETTINGS.handleGlobalPdUpdate(e);
                return;
            }

            if (e.target.matches('.edit-pd-category')) {
                e.preventDefault();
                console.log(e.target.dataset);
                OMNIVA_INT_SETTINGS.fillPdModal(e.target.dataset);
                return;
            }

            if (e.target.matches('.reset-pd-category')) {
                e.preventDefault();
                OMNIVA_INT_M_COMMON.confirm({
                    message: `Reset defaults for this category?`,
                    accept: () => {
                        OMNIVA_INT_SETTINGS.handlePdReset(e.target.dataset.category);
                    },
                    cancel: () => { }
                });
                return;
            }

            if (e.target.matches('#save-parcel-default-btn')) {
                e.preventDefault();
                OMNIVA_INT_SETTINGS.handlePdUpdate(e);
                return;
            }

            if (e.target.matches('#cancel-parcel-default-btn')) {
                e.preventDefault();
                document.querySelector(OMNIVA_INT_SETTINGS.parcelDefaultModal).classList.add('hidden');
                return;
            }

            if (e.target.matches('#cancel-add-shipping-method-btn')) {
                e.preventDefault();
                document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal).classList.add('hidden');
                return;
            }
        });
    },

    listenForPaginator: function () {
        const pdPaginator = document.querySelector('#omniva_int_m_pd_pagination');

        if (!pdPaginator) {
            return;
        }

        pdPaginator.addEventListener('click', function (e) {
            if (
                e.target.matches('.omniva_int_m-paginator-btn-previous')
                || e.target.matches('.omniva_int_m-paginator-btn-next')
            ) {
                e.preventDefault();
                OMNIVA_INT_SETTINGS.loadCategoryPage(e.target.dataset.page);
            }
        });
    },

    openShippingMethodModal: function (e) {
        e.preventDefault();

        const dataset = e.target.dataset;
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const modalBody = modal.querySelector('.panel-body');
        const nameEl = modal.querySelector('input[name="option_name"]');
        const typeEl = modal.querySelector('select[name="option_type"]');
        const countryTable = modal.querySelector('#sm-modal-countries');
        const apiCountriesWrapper = modal.querySelector('.api-countries-select-wrapper');

        // reset modal inputs to initial values
        nameEl.value = '';
        typeEl.setCustomValidity(''); // validation reset
        typeEl.value = 0;
        typeEl.disabled = false;
        modal.dataset.shippingOptionId = '';
        modal.classList.add('options-hidden');
        modal.querySelector('select[name="option_enabled"]').value = 0;
        modal.querySelector('input[name="option_sort_order"]').value = '';
        modal.querySelector('input[name="option_free_shipping"]').value = '';
        modal.querySelector('select[name="available_services"]').innerHTML = '';
        modal.querySelector('select[name="selected_services"]').innerHTML = '';

        // remove api countries select, will be added if its an edit action
        apiCountriesWrapper.innerHTML = '';

        // clean country table
        countryTable.innerHTML = '';
        if (OMNIVA_INT_SETTINGS.noCountryPlaceholderEl) {
            countryTable.append(OMNIVA_INT_SETTINGS.getCloneEl(OMNIVA_INT_SETTINGS.cloneList.noCountryPlaceholder));
        }

        modal.classList.remove('hidden', 'sm-create', 'sm-edit');

        nameEl.focus();

        if (dataset.shippingMethodId) {
            // add api countries select
            apiCountriesWrapper.append(OMNIVA_INT_SETTINGS.getCloneEl(OMNIVA_INT_SETTINGS.cloneList.apiCountriesSelect));

            // countries select available only during editing
            jQuery('.sm-modal-api-countries select[name="api_countries"]').select2({
                width: 'resolve'
            });

            modal.classList.add('sm-edit');
            modal.dataset.shippingOptionId = dataset.shippingMethodId;
            // call functions to load up custom data
            console.log('Loading custom shipping method data', dataset.shippingMethodId);
            OMNIVA_INT_SETTINGS.loadShippingMethod(dataset.shippingMethodId);

            return;
        }

        // if not editing mark as modal for creation (this hides country selector during creation)
        modal.classList.add('sm-create');
    },

    loadShippingMethod: function (id) {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const modalBody = modal.querySelector('.panel-body');

        const data = new FormData();
        data.set('shipping_option_id', id);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, modalBody);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=getShippingOption', {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (json.data.error) {
                    alert(json.data.error);
                    return;
                }

                OMNIVA_INT_SETTINGS.fillShippingMethodModal(json.data.shipping_method);
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, modalBody);
            });
    },

    fillShippingMethodModal: function (data) {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);

        modal.querySelector('select[name="option_enabled"]').value = data.enabled;
        modal.querySelector('input[name="option_sort_order"]').value = data.sort_order;
        modal.querySelector('input[name="option_name"]').value = data.title;

        const typeEl = modal.querySelector('select[name="option_type"]')
        typeEl.value = data.type;
        typeEl.disabled = true;

        modal.classList.remove('options-hidden');

        modal.querySelector('select[name="option_price_type"]').value = data.price_type;
        modal.querySelector('input[name="option_price"]').value = data.price;
        modal.querySelector('input[name="option_free_shipping"]').value = data.free_shipping;
        modal.querySelector(`input[name="option_price_priority"][value="${data.offer_priority}"]`).checked = true;

        let selectedServices = [];
        if (data.allowed_services) {
            selectedServices = data.allowed_services.split(',');
        }
        OMNIVA_INT_SETTINGS.buildServicesSelector(data.type, selectedServices);

        Object.values(data.countries).forEach((country) => {
            OMNIVA_INT_SETTINGS.shippingMethodModalAddCountryRow(country);
        });
    },

    shippingMethodModalTypeSelected: function (e) {
        e.preventDefault();

        const type = parseInt(e.target.value);
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);

        OMNIVA_INT_SETTINGS.buildServicesSelector(type);

        // select first priority option as selected if modal is for creation
        if (modal.matches('.sm-create')) {
            modal.querySelector('input[name="option_price_priority"]').checked = true
        }

        modal.classList.remove('options-hidden');
    },

    buildServicesSelector: function (type, selectedOptions) {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const availableServices = modal.querySelector('select[name="available_services"]');
        const selectedServices = modal.querySelector('select[name="selected_services"]');

        availableServices.innerHTML = '';
        selectedServices.innerHTML = '';

        const serviceCodes = Object.keys(OMNIVA_INT_M_SETTINGS_DATA.servicesList);

        let html = '';
        let selectedHtml = '';
        serviceCodes.forEach(code => {
            if (OMNIVA_INT_M_SETTINGS_DATA.servicesList[code].shippingType !== type) {
                return;
            }
            if (selectedOptions && selectedOptions.some(item => item === code)) {
                selectedHtml += `<option value="${code}">[ ${code} ] ${OMNIVA_INT_M_SETTINGS_DATA.servicesList[code].name}</option>`;
                return;
            }

            html += `<option value="${code}">[ ${code} ] ${OMNIVA_INT_M_SETTINGS_DATA.servicesList[code].name}</option>`;
        });

        availableServices.innerHTML = html;
        selectedServices.innerHTML = selectedHtml;
    },

    shippingMethodModalServicesSelect: function (e) {
        e.preventDefault();
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const from = modal.querySelector(e.target.dataset.from);
        const to = modal.querySelector(e.target.dataset.to);

        const selectedOptions = from.selectedOptions;

        if (selectedOptions.length > 0) {
            to.append(...selectedOptions);
        }
    },

    shippingMethodModalPriceType: function (e) {
        e.preventDefault();
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const addOnEl = modal.querySelector('.input-group-addon.option_price');
        const selectedType = e.target.value;

        addOnEl.textContent = OMNIVA_INT_M_SETTINGS_DATA.priceTypeAddons[selectedType];
    },

    shippingMethodModalAddCountryRow: function ({ country_code, free_shipping, offer_priority, price, price_type }) {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);

        // do nothing if modal is closed
        if (modal.matches('.hidden')) {
            return;
        }

        const panelBody = document.querySelector(`#sm-modal-countries tr[data-country-code="${country_code}"]`);
        const countrySelector = modal.querySelector('select[name="api_countries"]');
        const countryTable = modal.querySelector('#sm-modal-countries');
        const placeholder = countryTable.querySelector('tr[data-placeholder]');

        console.log('Adding country', arguments);



        if (placeholder) {
            placeholder.remove();
        }

        let html = `
            <td data-cell-country></td>
            <td data-cell-priority></td>
            <td data-cell-price></td>
            <td data-cell-free-shipping></td>
            <td data-cell-actions></td>
        `;

        const tr = document.createElement('tr');
        tr.dataset.countryCode = country_code;
        tr.dataset.countryName = '';
        tr.dataset.pricePriority = offer_priority;
        tr.dataset.priceType = price_type;
        tr.dataset.price = price;
        tr.dataset.freeShipping = free_shipping;
        tr.innerHTML = html;

        countryTable.append(tr);

        const countryOption = countrySelector.querySelector(`option[value="${country_code}"]`);
        if (countryOption) {
            countryOption.remove();
        }

        OMNIVA_INT_SETTINGS.shippingMethodModalCountryRowAction(country_code, false);
    },

    shippingMethodModalCountryUpdateRowData: function ({ country_code, free_shipping, offer_priority, price, price_type }) {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const row = modal.querySelector(`#sm-modal-countries tr[data-country-code="${country_code}"]`);

        row.dataset.pricePriority = offer_priority;
        row.dataset.priceType = price_type;
        row.dataset.price = price;
        row.dataset.freeShipping = free_shipping;

        OMNIVA_INT_SETTINGS.shippingMethodModalCountryRowAction(country_code, false);
    },

    shippingMethodModalCountryRowAction: function (targetRow, isEdit = false) {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const row = modal.querySelector(`#sm-modal-countries tr[data-country-code="${targetRow}"]`);

        if (!row) {
            console.log('NO ROW!');
            return;
        }

        console.log('FILLING ROW WITH DATA', row.dataset);

        let offerPriority = !row.dataset.pricePriority === '' || row.dataset.pricePriority === 'null' ? null : row.dataset.pricePriority;
        let priceType = !row.dataset.priceType || row.dataset.priceType === 'null' ? null : row.dataset.priceType;
        let freeShipping = !row.dataset.freeShipping || row.dataset.freeShipping === 'null' ? null : row.dataset.freeShipping;
        let price = !row.dataset.price || row.dataset.price === 'null' ? null : row.dataset.price;

        // default html
        let priorityHtml = offerPriority === null ? 'DEFAULT' : OMNIVA_INT_M_SETTINGS_DATA.pricePriorityType[offerPriority];
        let priceHtml = priceType === null ? 'DEFAULT' : `${price} ${OMNIVA_INT_M_SETTINGS_DATA.priceTypes[priceType]}`;
        let freeShippingHtml = freeShipping === null ? 'DEFAULT' : freeShipping;
        let actionButtonsHtml = `
            <button class="btn btn-success" data-cell-btn-edit="${targetRow}"><i class="fa fa-pencil"></i></button>
            <button class="btn btn-danger" data-cell-btn-delete="${targetRow}"><i class="fa fa-trash"></i></button>
        `;

        // for editing row html is different
        if (isEdit) {
            priorityHtml = `
                <option value="" ${offerPriority === null ? 'selected' : ''}>DEFAULT</option>
            `;
            Object.keys(OMNIVA_INT_M_SETTINGS_DATA.pricePriorityType).forEach((key) => {
                const isSelected = parseInt(key) === parseInt(offerPriority) ? 'selected' : '';
                priorityHtml += `
                    <option value="${key}" ${isSelected}>${OMNIVA_INT_M_SETTINGS_DATA.pricePriorityType[key]}</option>
                `;
            });

            priorityHtml = `
                <select class="form-control">
                    ${priorityHtml}
                </select>
            `;

            priceHtml = `
                <option value="" ${priceType === null ? 'selected' : ''}>DEFAULT</option>
            `;
            Object.keys(OMNIVA_INT_M_SETTINGS_DATA.priceTypes).forEach((key) => {
                const isSelected = parseInt(key) === parseInt(priceType) ? 'selected' : '';
                priceHtml += `
                    <option value="${key}" ${isSelected}>${OMNIVA_INT_M_SETTINGS_DATA.priceTypes[key]}</option>
                `;
            });

            priceHtml = `
                <select class="form-control">
                    ${priceHtml}
                </select>
                <input type="text" value="${price === null ? '' : price}" class="form-control">
            `;

            freeShippingHtml = `
                <input type="text" value="${freeShipping === null ? '' : freeShipping}" class="form-control">
            `;

            actionButtonsHtml = `
                <button class="btn btn-success" data-cell-btn-save="${targetRow}"><i class="fa fa-check"></i></button>
                <button class="btn btn-danger" data-cell-btn-cancel="${targetRow}"><i class="fa fa-remove"></i></button>
            `;
        }

        const country = OMNIVA_INT_SETTINGS.findCountryData(row.dataset.countryCode);

        row.querySelector('[data-cell-country]').innerHTML = country ? country.en_name : 'UNKNOWN';
        row.querySelector('[data-cell-priority]').innerHTML = priorityHtml;
        row.querySelector('[data-cell-price]').innerHTML = priceHtml;
        row.querySelector('[data-cell-free-shipping]').innerHTML = freeShippingHtml;
        row.querySelector('[data-cell-actions]').innerHTML = actionButtonsHtml;
    },

    findCountryData: function (countryCode) {
        return OMNIVA_INT_M_SETTINGS_DATA.api_coutries.find((item) => item.code === countryCode);
    },

    saveOptionCountry: function (data, loadingOn, callback) {
        // const panelBody = document.querySelector('#shipping_option_modal .panel-body');
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            formData.set(key, data[key]);
        });

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, loadingOn);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=saveOptionCountry', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (!json.data.update_result) {
                    let message = json.data.error ? json.data.error : 'Unexpected error while trying to update shipping option country data';
                    alert(message);
                    return;
                }

                callback(json.data);
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, loadingOn);
            });
    },

    deleteOptionCountry: function (optionId, countryCode, callback) {
        // const panelBody = document.querySelector('#shipping_option_modal .panel-body');
        const panelBody = document.querySelector(`#sm-modal-countries tr[data-country-code="${countryCode}"]`);
        const formData = new FormData();

        formData.set('option_id', optionId);
        formData.set('country_code', countryCode);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, panelBody);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=deleteOptionCountry', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (!json.data.update_result) {
                    let message = json.data.error ? json.data.error : 'Unexpected error while trying to delete shipping option country data';
                    alert(message);
                    return;
                }

                callback();
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, panelBody);
            });
    },

    handleGlobalPdUpdate: function (e) {
        e.preventDefault();

        const fields = {
            category_id: '#input-pd-category-id',
            hs_code: '#input-pd-hs-code',
            weight: '#input-pd-weight',
            length: '#input-pd-length',
            height: '#input-pd-height',
            width: '#input-pd-width'
        };

        const panel = document.querySelector('#tab-parcel-defaults');

        this.updateParcelDefault(fields, panel);
    },

    getPdModalFields: function () {
        return {
            category_id: '#modal-pd-category-id',
            hs_code: '#modal-pd-hs-code',
            weight: '#modal-pd-weight',
            length: '#modal-pd-length',
            height: '#modal-pd-height',
            width: '#modal-pd-width'
        };
    },

    fillPdModal: function (dataset) {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.parcelDefaultModal);

        const fieldsMap = OMNIVA_INT_SETTINGS.getPdModalFields();
        const fields = Object.keys(fieldsMap);

        const title = modal.querySelector('#parcel_default_modal_title');

        if (dataset.hasDefaults === 'false') {
            console.log('Using global defaults');
            fields.forEach(key => {
                if (key === 'category_id') {
                    return;
                }
                modal.querySelector(fieldsMap[key]).value = OMNIVA_INT_M_SETTINGS_DATA.globalParcelDefault[key];
            });
        } else {
            console.log('Using custom defaults');
            fields.forEach(key => {
                if (key === 'category_id') {
                    return;
                }
                modal.querySelector(fieldsMap[key]).value = dataset[key];
            });
        }

        modal.querySelector(fieldsMap['category_id']).value = dataset.category;
        title.textContent = dataset.categoryName;

        modal.classList.remove('hidden');
        modal.querySelector(fieldsMap.weight).focus();
    },

    handlePdUpdate: function (e) {
        const panel = document.querySelector(OMNIVA_INT_SETTINGS.parcelDefaultModal);
        this.updateParcelDefault(OMNIVA_INT_SETTINGS.getPdModalFields(), panel);
    },

    handlePdReset: function (categoryId) {
        const panelBody = document.querySelector('#tab-parcel-defaults .panel-body');
        const data = new FormData();

        data.set('category_id', categoryId);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, panelBody);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=resetPdCategory', {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (!json.data.update_result) {
                    let message = json.data.error ? json.data.error : 'Unexpected error while trying to reset category parcel defaults';
                    alert(message);
                    return;
                }

                // update page
                let currentPage = document.querySelector('#omniva_int_m_pd_pagination .omniva_int_m_current_page');
                if (currentPage) {
                    currentPage = currentPage.innerText.trim();
                } else {
                    currentPage = 1;
                }
                OMNIVA_INT_SETTINGS.loadCategoryPage(currentPage);
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, panelBody);
            });
    },

    loadCategoryPage: function (page) {
        const pdCategories = document.querySelector('#pd-categories');
        const pdPagination = document.querySelector('#omniva_int_m_pd_pagination');
        const panelBody = pdCategories.closest('.panel-body');

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, panelBody);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=getPdCategories&page=' + page)
            .then(res => res.json())
            .then(json => {
                if (!json.data) {
                    return;
                }

                pdCategories.innerHTML = json.data.pd_categories_partial;
                pdPagination.innerHTML = json.data.pd_categories_paginator;
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, panelBody);
            });
    },

    updateParcelDefault: function (fields, panel) {
        const panelBody = panel.querySelector('.panel-body');
        const data = new FormData();

        data.set('category_id', panelBody.querySelector(fields.category_id).value);
        data.set('hs_code', panelBody.querySelector(fields.hs_code).value);
        data.set('weight', panelBody.querySelector(fields.weight).value);
        data.set('length', panelBody.querySelector(fields.length).value);
        data.set('height', panelBody.querySelector(fields.height).value);
        data.set('width', panelBody.querySelector(fields.width).value);

        // remove previously marked errors from Parcel Defaults page
        panelBody.querySelectorAll('.has-error').forEach(item => item.classList.remove('has-error'));

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, panelBody);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=savePdCategory', {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                const validationFields = Object.keys(json.data.validation);

                validationFields.forEach(fieldKey => {
                    if (!json.data.validation[fieldKey]) {
                        panelBody.querySelector(fields[fieldKey]).parentNode.classList.add('has-error')
                    }
                });

                if (json.data.update_result && json.data.parcel_default && json.data.parcel_default.category_id === 0) {
                    OMNIVA_INT_M_SETTINGS_DATA.globalParcelDefault = json.data.parcel_default;
                }

                // close modal on success
                if (json.data.update_result && panel.matches('.omniva-int-m-modal')) {
                    panel.classList.add('hidden');
                    let currentPage = document.querySelector('#omniva_int_m_pd_pagination .omniva_int_m_current_page');
                    if (currentPage) {
                        currentPage = currentPage.innerText.trim();
                    } else {
                        currentPage = 1;
                    }
                    OMNIVA_INT_SETTINGS.loadCategoryPage(currentPage);
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, panelBody);
            });
    },

    saveShippingOption: function () {
        const modal = document.querySelector(OMNIVA_INT_SETTINGS.shippingMethodModal);
        const panel = modal.querySelector('.panel');
        const typeEl = modal.querySelector('select[name="option_type"]');
        typeEl.setCustomValidity('');

        if (parseInt(typeEl.value) < 1) {
            typeEl.setCustomValidity('Type must be selected');
            typeEl.focus();
            return;
        }

        if (!OMNIVA_INT_M_SETTINGS_DATA.shippingTypes[typeEl.value]) {
            typeEl.setCustomValidity('Invalid type selected');
            typeEl.focus();
            return;
        }

        /*
    public $id;
    public $title;
    public $enabled = 0;
    public $type = Service::TYPE_COURIER;
    public $allowed_services = '';
    public $offer_priority = Offer::OFFER_PRIORITY_CHEAPEST;
    public $sort_order = 0;
    public $price_type = Offer::OFFER_PRICE_FIXED;
    public $price;
    public $free_shipping;
    public $countries = [];
         */

        const data = {
            title: modal.querySelector('input[name="option_name"]').value,
            enabled: modal.querySelector('select[name="option_enabled"]').value,
            type: typeEl.value,
            allowed_services: [...modal.querySelector('select[name="selected_services"]').options].map(item => item.value).join(','),
            offer_priority: modal.querySelector('[name="option_price_priority"]:checked').value,
            sort_order: modal.querySelector('input[name="option_sort_order"]').value,
            price_type: modal.querySelector('select[name="option_price_type"]').value,
            price: modal.querySelector('input[name="option_price"]').value,
            free_shipping: modal.querySelector('input[name="option_free_shipping"]').value
        };

        const formData = new FormData();

        if (modal.dataset.shippingOptionId && modal.dataset.shippingOptionId != '') {
            formData.set('option_id', parseInt(modal.dataset.shippingOptionId));
        }

        Object.keys(data).forEach(key => {
            formData.set(key, data[key]);
        });

        console.log('Shipping method data to save', parseInt(modal.dataset.shippingOptionId), data);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, panel);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=saveShippingOption', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                // const validationFields = Object.keys(json.data.validation);

                // validationFields.forEach(fieldKey => {
                //     if (!json.data.validation[fieldKey]) {
                //         panelBody.querySelector(fields[fieldKey]).parentNode.classList.add('has-error')
                //     }
                // });

                // if (json.data.update_result && json.data.parcel_default && json.data.parcel_default.category_id === 0) {
                //     OMNIVA_INT_M_SETTINGS_DATA.globalParcelDefault = json.data.parcel_default;
                // }

                // close modal on success
                if (json.data.update_result) {
                    modal.classList.add('hidden');
                    if (!json.data.shipping_options) {
                        return;
                    }

                    document.querySelector('#shipping_options').innerHTML = json.data.shipping_options;
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, panel);
            });
    },

    deleteShippingOption: function (optionId) {
        const shippingMethodPanel = document.querySelector(`#tab-shipping-method .panel`);
        const formData = new FormData();

        formData.set('option_id', optionId);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, shippingMethodPanel);
        fetch(OMNIVA_INT_M_SETTINGS_DATA.url_ajax + '&action=deleteShippingOption', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                // remove shipping option line from table on success
                if (json.data.update_result) {
                    const shippingMethodTr = document.querySelector(`#tab-shipping-method tr[data-shipping-method-id="${optionId}"]`);
                    if (shippingMethodTr) {
                        shippingMethodTr.remove();
                    }
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, shippingMethodPanel);
            });
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    OMNIVA_INT_SETTINGS.init();
});