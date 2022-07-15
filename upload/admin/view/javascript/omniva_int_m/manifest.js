var OMNIVA_INT_M_MANIFEST = {
    init: function () {
        this.addGlobalListeners();
        OMNIVA_INT_M_COMMON.showLoadingOverlay(false, document.querySelector('#content'));
    },

    addGlobalListeners: function () {
        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-print-manifest]', (e) => {
            e.preventDefault();

            OMNIVA_INT_M_COMMON.confirm({
                message: e.target.dataset.warning,
                accept: () => {
                    console.log('Generate manifest', e.target.dataset.printManifest);
                    OMNIVA_INT_M_MANIFEST.getManifest(e.target.dataset.printManifest);
                }
            });
        });

        OMNIVA_INT_M_COMMON.addGlobalListener('click', '[data-page]', (e) => {
            e.preventDefault();
            OMNIVA_INT_M_MANIFEST.loadManifestPage(e.target.dataset.page);
        });
    },

    loadManifestPage: function (page) {
        console.log(page);
        const panel = document.querySelector('#omniva_int_m-panel');
        const tableWrapper = document.querySelector('#manifest-list-table');
        const formData = new FormData();
        formData.set('page', page);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, panel);
        fetch(OMNIVA_INT_M_MANIFEST_DATA.ajax + '&action=loadManifestPage', {
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

                if (json.data.html) {
                    tableWrapper.innerHTML = json.data.html;
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, panel);
            });
    },

    getManifest: function (manifestId) {
        const panel = document.querySelector('#omniva_int_m-panel');
        const formData = new FormData();
        formData.set('manifest_id', manifestId);

        OMNIVA_INT_M_COMMON.showLoadingOverlay(true, panel);
        fetch(OMNIVA_INT_M_MANIFEST_DATA.ajax + '&action=getManifest', {
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

                if (json.data.response && json.data.response.manifest == null) {
                    OMNIVA_INT_M_COMMON.alert({
                        message: 'Manifest is not ready. Please try again later'
                    });
                }

                if (json.data.response && json.data.response.manifest) {
                    OMNIVA_INT_M_COMMON.downloadPdf(json.data.response.manifest, manifestId + '_manifest');
                }

                // if response has labels data ask if user wants it
                if (json.data.response && json.data.response.labels) {
                    OMNIVA_INT_M_COMMON.confirm({
                        message: 'Download manifest labels?',
                        accept: () => {
                            OMNIVA_INT_M_COMMON.downloadPdf(json.data.response.labels, manifestId + '_labels');
                        }
                    });
                }
            })
            .finally(() => {
                OMNIVA_INT_M_COMMON.showLoadingOverlay(false, panel);
            });
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    OMNIVA_INT_M_MANIFEST.init();
});