<div id="omniva_int_m-panel" class="panel panel-default">
	<div class="panel-heading">
		<h3 class="panel-title">
			<i class="fa fa-info-circle"></i>
			<?php echo $omniva_int_m_panel_title; ?>
		</h3>
	</div>
	<div class="panel-body">
        <div class="form-horizontal">
            <div class="form-group">
                <label class="col-sm-4 control-label"><?php echo $omniva_int_m_panel_label_status; ?></label>
                <div class="col-sm-8">
                    <pre><?php echo $shipment_status; ?></pre>
                </div>
            </div>

            <div class="form-group">
                <label class="col-sm-4 control-label"><?php echo $omniva_int_m_panel_label_service; ?></label>
                <div class="col-sm-8">
                    <pre>[ <?php echo $offer['service_code']; ?> ] <?php echo $offer['name']; ?></pre>
                </div>
            </div>
            
            <div class="form-group">
                <label class="col-sm-4 control-label" for="insurance-input"><?php echo $omniva_int_m_panel_label_insurance; ?></label>
                <div class="col-sm-8">
                    <label class="omniva-toggle">
                        <input type="checkbox" name="insurance" id="insurance-input"
                            onchange="OMNIVA_INT_M_ORDER.saveInsurance(); return false;"
                            
                            <?php if ($is_insurance): ?>
                                checked="checked"
                            <?php endif; ?>

                            <?php if ($api_data || !$offer['additional_services']['insurance']): ?>
                                disabled
                            <?php endif; ?>
                        />
                    </label>
                </div>
            </div>

            <?php if ($api_data): ?>
                <div class="form-group">
                    <label class="col-sm-4 control-label"><?php echo $omniva_int_m_panel_label_manifest_id; ?></label>
                    <div class="col-sm-4">
                        <pre><?php echo $api_data['manifest_id']; ?></pre>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-4 control-label"><?php echo $omniva_int_m_panel_label_shipment_id; ?></label>
                    <div class="col-md-4">
                        <pre><?php echo $api_data['shipment_id']; ?></pre>
                    </div>
                    <div class="col-md-4">
                        <?php if ($label_status): ?>
                        <button data-get-label-btn="<?php echo $api_data['shipment_id']; ?>" class="btn btn-default"><?php echo $omniva_int_m_panel_btn_get_label; ?></button>
                        <?php else: ?>
                        <button data-get-label-btn="<?php echo $api_data['shipment_id']; ?>" class="btn btn-default"><?php echo $omniva_int_m_panel_btn_check_status; ?></button>
                        <?php endif; ?>
                        <button data-cancel-shipment-btn="<?php echo $api_data['shipment_id']; ?>" data-warning="<?php echo htmlspecialchars($omniva_int_m_panel_warning_cancel); ?>" class="btn btn-danger"><?php echo $omniva_int_m_panel_btn_cancel_shipment; ?></button>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <?php if (isset($label_status) && $label_status->tracking_numbers): ?>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <caption><?php echo $omniva_int_m_panel_table_caption_tracking_numbers; ?></caption>
                    <thead>
                        <tr>
                            <th><?php echo $omniva_int_m_panel_table_col_tracking_number; ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($label_status->tracking_numbers as $tracking): ?>
                            <tr>
                                <td><?php echo $tracking; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

        <?php if ($is_terminal): ?>
        <div class="form-horizontal">
            <input type="hidden" name="api_url" value="<?php echo $api_url; ?>">
            <input type="hidden" name="select_terminal" value="<?php echo htmlspecialchars($omniva_int_m_panel_warning_select_terminal); ?>">
            <div class="form-group" 
                data-terminal data-terminal-postcode="<?php echo $order['shipping_postcode']; ?>" 
                data-terminal-country="<?php echo $order['shipping_iso_code_2']; ?>"
                data-terminal-identifier="<?php echo $offer['parcel_terminal_type']; ?>"
                data-terminal-selected="<?php echo $terminal_id; ?>"
            >
                <label class="col-sm-2 control-label"><?php echo $omniva_int_m_panel_label_selected_terminal; ?></label>
                <div class="col-sm-8" data-terminal-selector-wrapper>
                    <?php if ($terminal_id): ?>
                    <pre><?php echo $terminal_id; ?> - <?php echo $terminal_data['name']; ?>, <?php echo $terminal_data['address']; ?></pre>
                    <?php else: ?>
                    <pre><?php echo $omniva_int_m_panel_warning_select_terminal; ?></pre>
                    <?php endif; ?>
                </div>
                <div class="col-sm-2">
                    <?php if (!$api_data): ?>
                    <button class="btn btn-default"
                        data-terminal-change-btn="edit" 
                        data-text-change="<?php echo $omniva_int_m_generic_btn_change; ?>" 
                        data-text-save="<?php echo $omniva_int_m_generic_btn_save; ?>"
                    ><?php echo $omniva_int_m_generic_btn_change; ?></button>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>
    
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <caption><?php echo $omniva_int_m_panel_table_caption_parcels_info; ?></caption>
                <thead>
                    <tr>
                        <th><?php echo $omniva_int_m_panel_table_col_amount; ?></th>
                        <th><?php echo $omniva_int_m_panel_table_col_weight; ?></th>
                        <th><?php echo $omniva_int_m_panel_table_col_width; ?></th>
                        <th><?php echo $omniva_int_m_panel_table_col_length; ?></th>
                        <th><?php echo $omniva_int_m_panel_table_col_height; ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($parcels as $parcel): ?>
                        <tr>
                            <td><?php echo $parcel['amount']; ?></td>
                            <td><?php echo $parcel['weight']; ?></td>
                            <td><?php echo $parcel['x']; ?></td>
                            <td><?php echo $parcel['y']; ?></td>
                            <td><?php echo $parcel['z']; ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div data-api-response></div>
	</div>
    <?php if (!$api_data): ?>
        <div class="panel-footer">
            <button data-register-shipment-btn class="btn btn-success"><?php echo $omniva_int_m_panel_btn_register_shipment; ?></button> 
        </div>
    <?php endif; ?>
</div>