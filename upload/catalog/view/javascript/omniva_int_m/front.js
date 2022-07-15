var OMNIVA_INT_M_FRONT = {
    initialized: false,
    tmjsInstance: {}, /* mapped using code */

    init: function () {
        this.observe();
    },

    observe: function () {
        const targetNode = document.body;

        const config = { attributes: false, childList: true, subtree: true };

        const callback = function (mutationsList, observer) {
            const checkboxes = [...document.querySelectorAll('input[value^="omniva_int_m.terminal_"]:not([data-omnivaintm-initialized])')];
            if (checkboxes.length > 0) {
                checkboxes.forEach((item) => {
                    item.dataset.omnivaintmInitialized = true;
                    OMNIVA_INT_M_COMMON.showLoadingOverlay(true, item.closest('div.radio'));
                });

                OMNIVA_INT_M_FRONT.addLibraries(() => {
                    // using dummy to handle dependencies in one go
                    const dummyTmjs = OMNIVA_INT_M_FRONT.getTerminalMappingInstance();
                    dummyTmjs.depend.loadLeaflet(() => {
                        OMNIVA_INT_M_FRONT.run(checkboxes);
                    })
                });

                return;
            }
        };

        console.log('OMNIVAT_INT_M watching for terminals');
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    },

    addLibraries: function (callback) {
        if (typeof TerminalMapping === 'function') {
            console.log('OMNIVAT_INT_M: TERMINAL MAPPING ALREADY LOADED');
            callback();
            return;
        }

        console.log('OMNIVAT_INT_M: ADDING TERMINAL MAPPING');
        const script = document.createElement('script');
        script.src = "catalog/view/javascript/omniva_int_m/terminal-mapping.js";
        document.head.append(script);

        const styleDom = document.createElement('link');
        styleDom.href = "catalog/view/javascript/omniva_int_m/terminal-mapping.css";
        styleDom.rel = 'stylesheet';
        document.head.append(styleDom);

        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
            return;
        }

        //Others
        script.onload = function () {
            callback();
        };
    },

    run: function (terminalOptions) {
        const formData = new FormData();

        terminalOptions.forEach((item) => {
            OMNIVA_INT_M_COMMON.showLoadingOverlay(true, item.closest('div.radio'));
        });
        fetch(OMNIVA_INT_FRONT_DATA.ajax + '&action=getFrontCurrentData', {
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
                    console.log('OMNIVAT_INT_M ERROR: ' + json.data.error);
                    return;
                }

                if (json?.data?.offers) {
                    terminalOptions.forEach((item) => {
                        const code = item.value.split('.')[1];
                        if (!json?.data?.offers[code]) {
                            return;
                        }

                        const tmjs = OMNIVA_INT_M_FRONT.getTerminalMappingInstance();
                        // move container to option
                        let closest = item.closest('div.radio');
                        if (closest) {
                            //tm.dom.setContainerParent(closest);
                            tmjs.dom.containerParent = closest;
                            OMNIVA_INT_M_COMMON.showLoadingOverlay(false, item.closest('div.radio'));
                            OMNIVA_INT_M_COMMON.showLoadingOverlay(true, closest);
                        }
                        let options = {
                            country_code: json.data.address.iso_code_2,
                            identifier: json.data.offers[code].parcel_terminal_type,
                            receiver_address: json.data.address.postcode,
                            hideContainer: false,
                            testCode: code
                        };

                        tmjs.init(options);
                        // we can access container after init
                        tmjs.dom.UI.container.classList.add('omniva-int-m-tmjs');
                        tmjs.sub('tmjs-ready', (tm) => {
                            if (json?.data?.selection[code]) {
                                OMNIVA_INT_M_FRONT.selectCurrentActiveTerminal(tm, json.data.selection[code]);
                            }

                            if (closest) {
                                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, closest);
                            } else {
                                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, item.closest('div.radio'));
                            }

                            tm.sub('terminal-selected', (data) => {
                                OMNIVA_INT_M_FRONT.selectTerminal(item, data, tm);

                                tm.publish('close-map-modal');
                            });
                        });

                        OMNIVA_INT_M_FRONT.tmjsInstance[code] = tmjs;
                    });
                }
            })
            .finally(() => {
            });
    },

    /* This is custom version of libraries selectActiveTerminal */
    selectCurrentActiveTerminal: function (tmjs, selectedTerminal) {
        if (!selectedTerminal?.terminal_id || tmjs.map.isActive(selectedTerminal.terminal_id)) {
            return;
        }

        const location = tmjs.map.getLocationById(parseInt(selectedTerminal.terminal_id));

        if (!location) {
            return;
        }

        tmjs.dom.UI.terminalList.querySelectorAll(`li.tmjs-active`)
            .forEach(el => el.classList.remove('tmjs-active'));

        location._li.classList.add('tmjs-active');

        tmjs.map._activeLocation = location;

        tmjs.dom.UI.container.querySelector('.tmjs-selected-terminal').innerText = `${location.id} - ${location.name}, ${location.address}`;
    },

    selectTerminal: function (input, terminalData, tmjs) {
        const formData = new FormData();

        formData.set('omniva_int_m_option', input.value);
        formData.set('terminal_id', terminalData.id);
        formData.set('address', terminalData.address);
        formData.set('city', terminalData.city);
        formData.set('comment', terminalData.comment);
        formData.set('country_code', terminalData.country_code);
        formData.set('identifier', terminalData.identifier);
        formData.set('name', terminalData.name);
        formData.set('zip', terminalData.zip);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, tmjs.dom.UI.container);
        fetch(OMNIVA_INT_FRONT_DATA.ajax + '&action=selectTerminal', {
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
                    // reset
                    tmjs.dom.UI.container.querySelector('.tmjs-selected-terminal').innerText = tmjs.strings.select_pickup_point;
                    return;
                }

                tmjs.dom.UI.container.querySelector('.tmjs-selected-terminal').innerText = `${terminalData.id} - ${terminalData.name}, ${terminalData.address}`;
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, tmjs.dom.UI.container);
            });
    },

    test: function (element) {
        const formData = new FormData();

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, element);
        fetch(OMNIVA_INT_FRONT_DATA.ajax + '&action=getFrontCurrentData', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, element);
            });
    },

    getTerminalMappingInstance: function () {
        let tmjs = new TerminalMapping(OMNIVA_INT_FRONT_DATA.api_url);
        tmjs.setTranslation(OMNIVA_INT_FRONT_DATA.ts);

        tmjs.setImagesPath(OMNIVA_INT_FRONT_DATA.api_images_url);

        // replace default function with our custom one
        tmjs.dom.addOverlay = function () { return; };

        return tmjs;
    },

    isValidTerminalSelection: function () {
        const terminalOptionEl = document.querySelector('input[value^="omniva_int_m.terminal_"]:checked');
        if (!terminalOptionEl) {
            return true;
        }

        const code = terminalOptionEl.value.split('.')[1];

        const hasSelection = OMNIVA_INT_M_FRONT.tmjsInstance[code] && OMNIVA_INT_M_FRONT.tmjsInstance[code].map.getActiveLocation();

        if (!hasSelection) {
            OMNIVA_INT_M_COMMON.alert({
                message: OMNIVA_INT_FRONT_DATA.ts.no_terminal_selected
            });
        }

        return hasSelection ? true : false;
    }
};

document.addEventListener('DOMContentLoaded', function (e) {
    OMNIVA_INT_M_FRONT.init();
});