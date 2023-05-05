var OMNIVA_INT_M_ORDER = {
    wrapper: null,
    labelResponse: null,
    terminals: null,

    init: function () {
        this.addOrderInformationPanel();
        this.addGlobalListeners();
    },

    addGlobalListeners: function () {
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-register-shipment-btn]', (e) => {
            e.preventDefault();

            const terminalLine = OMNIVA_INT_M_ORDER.wrapper.querySelector('[data-terminal]');
            if (terminalLine && !terminalLine.dataset.terminalSelected) {
                OMNIVA_INT_M_COMMON.alert({
                    message: OMNIVA_INT_M_ORDER.wrapper.querySelector('input[name="select_terminal"]').value
                });
                return;
            }

            OMNIVA_INT_M_ORDER.registerShipment();
        });

        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-cancel-shipment-btn]', (e) => {
            e.preventDefault();

            OMNIVA_INT_M_COMMON.confirm({
                message: e.target.dataset.warning,
                accept: () => {
                    OMNIVA_INT_M_ORDER.cancelShipment(e.target.dataset.cancelShipmentBtn);
                },
                cancel: () => { }
            });
        });

        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-get-label-btn]', (e) => {
            e.preventDefault();

            if (OMNIVA_INT_M_ORDER.labelResponse && OMNIVA_INT_M_ORDER.labelResponse.base64pdf) {
                OMNIVA_INT_M_COMMON.downloadPdf(OMNIVA_INT_M_ORDER.labelResponse.base64pdf, e.target.dataset.getLabelBtn);
                return;
            }

            OMNIVA_INT_M_ORDER.getLabel(e.target.dataset.getLabelBtn);
        });

        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-terminal-change-btn]', (e) => {
            e.preventDefault();

            const button = e.target;
            if (button.dataset.terminalChangeBtn === 'save') {
                button.dataset.terminalChangeBtn = 'edit';
                button.innerText = button.dataset.textChange;
                OMNIVA_INT_M_ORDER.saveTerminal();
                return;
            }

            button.dataset.terminalChangeBtn = 'save';
            button.innerText = button.dataset.textSave;
            OMNIVA_INT_M_ORDER.loadChangeTerminal();
        });
    },

    addOrderInformationPanel: function () {
        const historyPanel = document.querySelector('#history').closest('.panel');

        const wrapper = document.createElement('div');
        wrapper.id = 'omniva_int_m_panel';

        historyPanel.parentNode.insertBefore(wrapper, historyPanel);

        OMNIVA_INT_M_ORDER.wrapper = wrapper;

        this.loadOrderInformationPanel(wrapper);
    },

    loadOrderInformationPanel: function (wrapper) {
        const formData = new FormData();
        formData.set('order_id', OMNIVA_INT_M_ORDER_DATA.order_id);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, wrapper);
        fetch(OMNIVA_INT_M_ORDER_DATA.ajax + '&action=getOrderPanel', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (json.data.error) {
                    wrapper.innerHTML = `
                        <div class="alert alert-danger">
                            ${json.data.error}
                        </div>
                    `;
                    return;
                }

                if (json.data.label_response) {
                    OMNIVA_INT_M_ORDER.labelResponse = json.data.label_response;
                }

                if (json.data.panelHtml) {
                    wrapper.innerHTML = json.data.panelHtml;
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, wrapper);
            });
    },

    registerShipment: function () {
        const formData = new FormData();
        formData.set('order_id', OMNIVA_INT_M_ORDER_DATA.order_id);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, OMNIVA_INT_M_ORDER.wrapper);
        fetch(OMNIVA_INT_M_ORDER_DATA.ajax + '&action=registerShipment', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (json.data.error) {
                    OMNIVA_INT_M_COMMON.alert({
                        message: json.data.error
                    });
                    return;
                }

                OMNIVA_INT_M_COMMON.alert({
                    message: 'Shipment registered',
                    onClose: () => {
                        OMNIVA_INT_M_ORDER.loadOrderInformationPanel(OMNIVA_INT_M_ORDER.wrapper);
                    }
                });
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, OMNIVA_INT_M_ORDER.wrapper);
            });
    },

    cancelShipment: function (shipment_id) {
        if (!shipment_id) {
            OMNIVA_INT_M_COMMON.alert({
                message: 'Something is wrong, no Shipment ID is detected'
            });
            return;
        }

        const formData = new FormData();
        formData.set('order_id', OMNIVA_INT_M_ORDER_DATA.order_id);
        formData.set('shipment_id', shipment_id);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, OMNIVA_INT_M_ORDER.wrapper);
        fetch(OMNIVA_INT_M_ORDER_DATA.ajax + '&action=cancelShipment', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                const responseEl = document.querySelector('[data-api-response]');

                if (json.data.error) {
                    responseEl.innerHTML = json.data.error;
                    return;
                }

                if (json.data.canceled_result && json.data.canceled_result.status == 'deleted') {
                    OMNIVA_INT_M_COMMON.alert({
                        message: 'Shipment canceled',
                        onClose: () => {
                            OMNIVA_INT_M_ORDER.loadOrderInformationPanel(OMNIVA_INT_M_ORDER.wrapper);
                        }
                    });
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, OMNIVA_INT_M_ORDER.wrapper);
            });
    },

    getLabel: function (shipmentId) {
        const formData = new FormData();
        formData.set('order_id', OMNIVA_INT_M_ORDER_DATA.order_id);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, OMNIVA_INT_M_ORDER.wrapper);
        fetch(OMNIVA_INT_M_ORDER_DATA.ajax + '&action=getLabel', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (json.data.error) {
                    OMNIVA_INT_M_COMMON.alert({
                        message: json.data.error
                    });
                    return;
                }

                if (json.data.response) {
                    OMNIVA_INT_M_ORDER.labelResponse = json.data.response;

                    if (json.data.response.base64pdf) {
                        OMNIVA_INT_M_COMMON.downloadPdf(json.data.response.base64pdf, shipmentId);
                    }
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, OMNIVA_INT_M_ORDER.wrapper);
            });
    },

    loadChangeTerminal: function () {
        const terminalLine = OMNIVA_INT_M_ORDER.wrapper.querySelector('[data-terminal]');
        const selectorWrapper = terminalLine.querySelector('[data-terminal-selector-wrapper]');
        const apiUrl = OMNIVA_INT_M_ORDER.wrapper.querySelector('input[name="api_url"]').value;
        let countryCode = terminalLine.dataset.terminalCountry;
        let postCode = terminalLine.dataset.terminalPostcode;
        let identifier = terminalLine.dataset.terminalIdentifier;
        let selectedId = terminalLine.dataset.terminalSelected;

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, OMNIVA_INT_M_ORDER.wrapper);

        OMNIVA_INT_M_ORDER.getTerminals({ apiUrl, countryCode, postCode, identifier })
            .then(terminals => {
                const span = document.createElement('span');
                span.dataset.terminalSelectWrapper = true;
                const select = document.createElement('select');
                select.dataset.terminalSelect = true;
                select.style.width = '100%';
                let options = '';
                terminals.forEach(terminal => {
                    const selected = terminal.id == selectedId ? 'selected' : '';
                    options += `
                    <option value="${terminal.id}" ${selected}>${terminal.id} - ${terminal.name}, ${terminal.address}</option>
                    `;
                });
                select.innerHTML = options;
                span.append(select);
                selectorWrapper.append(span);
                jQuery('[data-terminal-select]').select2({
                    width: 'resolve'
                });
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, OMNIVA_INT_M_ORDER.wrapper);
            });
    },

    getTerminals: async function ({ apiUrl, countryCode, postCode, identifier, selected }) {
        if (OMNIVA_INT_M_ORDER.terminals) {
            return OMNIVA_INT_M_ORDER.terminals;
        }

        const terminals = await OMNIVA_INT_M_ORDER.getTerminalsFromApi({ apiUrl, countryCode, postCode, identifier })

        OMNIVA_INT_M_ORDER.terminals = terminals;
        return terminals;
    },

    getTerminalsFromApi: async function ({ apiUrl, countryCode, postCode, identifier }) {
        try {
            const response = await fetch(`${apiUrl}/parcel_machines?q[country_code_eq]=${countryCode}&q[identifier_eq]=${identifier}&receiver_address=${postCode}`);
            const terminals = await response.json();

            if (terminals?.result?.parcel_machines) {
                return terminals.result.parcel_machines;
            }
        } catch (error) {
            return [];
        }

        return [];
    },

    saveTerminal: function () {
        const terminalLine = OMNIVA_INT_M_ORDER.wrapper.querySelector('[data-terminal]');
        const selectorWrapper = OMNIVA_INT_M_ORDER.wrapper.querySelector('[data-terminal-select-wrapper]');
        const selector = OMNIVA_INT_M_ORDER.wrapper.querySelector('select[data-terminal-select]');

        if (selector.value == terminalLine.dataset.terminalSelected || !OMNIVA_INT_M_ORDER.terminals) {
            selectorWrapper.remove();
            console.log('Nothing changed...');
            return;
        }

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, OMNIVA_INT_M_ORDER.wrapper);

        const selectedTerminal = OMNIVA_INT_M_ORDER.terminals.find(terminal => {
            return terminal.id == selector.value;
        });

        if (!selectedTerminal) {
            selectorWrapper.remove();
            OMNIVA_INT_M_COMMON.showLoadingOverlay(false, OMNIVA_INT_M_ORDER.wrapper);
            return;
        }

        const formData = new FormData();
        formData.set('order_id', OMNIVA_INT_M_ORDER_DATA.order_id);
        Object.keys(selectedTerminal).forEach(key => {
            formData.set(key === 'id' ? 'terminal_id' : key, selectedTerminal[key]);
        });

        fetch(OMNIVA_INT_M_ORDER_DATA.ajax + '&action=updateSelectedTerminal', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    return;
                }

                if (json.data.error) {
                    OMNIVA_INT_M_COMMON.alert({
                        message: json.data.error
                    });
                    return;
                }

                if (json.data?.result) {
                    const terminalInfo = terminalLine.querySelector('[data-terminal-selector-wrapper] > pre');
                    terminalLine.dataset.terminalSelected = selectedTerminal.id;
                    terminalInfo.innerText = `${selectedTerminal.id} - ${selectedTerminal.name}, ${selectedTerminal.address}`;
                } else {
                    OMNIVA_INT_M_COMMON.alert({
                        message: 'Something went wrong while saving terminal information'
                    });
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, OMNIVA_INT_M_ORDER.wrapper);
                selectorWrapper.remove();
            });
    },

    saveInsurance: function () {
        console.log('Saving insurance');
        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, OMNIVA_INT_M_ORDER.wrapper);

        const insuranceCheckbox = OMNIVA_INT_M_ORDER.wrapper.querySelector(`input[name="insurance"]`);

        const formData = new FormData();
        formData.set('order_id', OMNIVA_INT_M_ORDER_DATA.order_id);
        formData.set('insurance', (insuranceCheckbox && insuranceCheckbox.checked ? 1 : 0));

        fetch(OMNIVA_INT_M_ORDER_DATA.ajax + '&action=updateInsurance', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);

                if (!json.data) {
                    if (json.warning) {
                        OMNIVA_INT_M_COMMON.alert({
                            message: json.warning
                        });
                        return;
                    }
                    return;
                }

                if (json.data.error) {
                    OMNIVA_INT_M_COMMON.alert({
                        message: json.data.error
                    });
                    return;
                }

                if (json.data?.result) {
                    OMNIVA_INT_M_COMMON.alert({
                        message: json.data.result
                    });
                } else {
                    OMNIVA_INT_M_COMMON.alert({
                        message: 'Something went wrong while saving terminal information'
                    });
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, OMNIVA_INT_M_ORDER.wrapper);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    OMNIVA_INT_M_ORDER.init();
});