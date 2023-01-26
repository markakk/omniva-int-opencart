<?php echo $header; ?>
<?php echo $column_left; ?>

<div id="content" class="omniva_int_m_content loading">
    <div class="page-header">
        <div class="container-fluid">
            <h1><img src="view/image/omniva_int_m/logo.png" alt="Omniva Logo" style="height: 33px;"></h1>
            <ul class="breadcrumb">
                <?php foreach ($breadcrumbs as $breadcrumb): ?>
                    <li><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a></li>
                <?php endforeach; ?>
            </ul>
            <span class="omniva-version">v<?php echo $omniva_int_m_version; ?></span>
        </div>
    </div>

    <!-- Errors / Success -->
    <div class="container-fluid">
        <?php if (!empty($error_warning)): ?>
            <div class="alert alert-danger">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <i class="fa fa-exclamation-circle"></i>
                <?php echo $error_warning; ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($success)): ?>
            <div class="alert alert-success">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <i class="fa fa-exclamation-circle"></i>
                <?php echo $success; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- VERSION CHECK -->
    <?php if (!empty($omniva_int_m_git_version)): ?>
        <div class="container-fluid">
            <div class="alert alert-warning"><i class="fa fa-exclamation-circle"></i> <?php echo str_replace('$$omniva_int_m_new_version$$', $omniva_int_m_git_version['version'], $omniva_int_m_new_version_notify); ?> 
                <a href="<?php echo $omniva_int_m_git_version['download_url']; ?>" target="_blank" class="btn btn-success"><?php echo $omniva_int_m_button_download_version; ?></a>
            </div>
        </div>
    <?php endif; ?>

    <!-- DB CHECK -->
    <?php if (!empty($omniva_int_m_db_check)): ?>
        <div class="container-fluid">
            <div class="alert alert-warning"><i class="fa fa-exclamation-circle"></i> <?php echo $omniva_int_m_db_fix_notify; ?> 
                <a href="<?php echo $omniva_int_m_db_fix_url; ?>" class="btn btn-success"><?php echo $omniva_int_m_button_fix_db; ?></a>
            </div>
        </div>
    <?php endif; ?>

    <!-- XML CHECK -->
    <?php if (!empty($omniva_int_m_xml_check)): ?>
        <div class="container-fluid">
            <div class="alert alert-warning"><i class="fa fa-exclamation-circle"></i> <?php echo $omniva_int_m_xml_fix_notify; ?> 
                <a href="<?php echo $omniva_int_m_xml_fix_url; ?>" class="btn btn-success"><?php echo $omniva_int_m_button_fix_xml; ?></a>
            </div>
        </div>
    <?php endif; ?>

    <ul class="container-fluid nav nav-tabs">
        <li class="active"><a href="#tab-general" data-toggle="tab"><?php echo $omniva_int_m_tab_general; ?></a></li>
        <li><a href="#tab-api" data-toggle="tab"><?php echo $omniva_int_m_tab_api; ?></a></li>
        <li><a href="#tab-shipping-method" data-toggle="tab"><?php echo $omniva_int_m_tab_shipping_method; ?></a></li>
        <li><a href="#tab-services" data-toggle="tab"><?php echo $omniva_int_m_tab_services; ?></a></li>
        <li><a href="#tab-sender-info" data-toggle="tab"><?php echo $omniva_int_m_tab_sender_info; ?></a></li>
        <li><a href="#tab-parcel-defaults" data-toggle="tab"><?php echo $omniva_int_m_tab_parcel_defaults; ?></a></li>
    </ul>

    <div class="tab-content">
        <!-- Module Settings -->
        <div class="tab-pane active" id="tab-general">
            <div class="container-fluid">
                <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fa fa-pencil"></i> <?php echo $omniva_int_m_title_edit; ?></h3>
                </div>
                <div class="panel-body">
                    <form action="<?php echo $action; ?>" method="post" enctype="multipart/form-data" id="form-omniva_int_m" class="form-horizontal">
                    <input type="hidden" name="module_settings_update">
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-tax-class"><?php echo $omniva_int_m_label_tax_class; ?></label>
                        <div class="col-sm-10">
                        <select name="omniva_int_m_tax_class_id" id="input-tax-class" class="form-control">
                            <option value="0"><?php echo $text_none; ?></option>
                            <?php foreach ($tax_classes as $tax_class): ?>
                                <?php if ($tax_class['tax_class_id'] == $omniva_int_m_tax_class_id): ?>
                                    <option value="<?php echo $tax_class['tax_class_id']; ?>" selected="selected"><?php echo $tax_class['title']; ?></option>
                                <?php else: ?>
                                    <option value="<?php echo $tax_class['tax_class_id']; ?>"><?php echo $tax_class['title']; ?></option>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-geo-zone"><?php echo $omniva_int_m_label_geo_zone; ?></label>
                        <div class="col-sm-10">
                        <select name="omniva_int_m_geo_zone_id" id="input-geo-zone" class="form-control">
                            <option value="0"><?php echo $text_all_zones; ?></option>
                            <?php foreach ($geo_zones as $geo_zone): ?>
                                <?php if ($geo_zone['geo_zone_id'] == $omniva_int_m_geo_zone_id): ?>
                                    <option value="<?php echo $geo_zone['geo_zone_id']; ?>" selected="selected"><?php echo $geo_zone['name']; ?></option>
                                <?php else: ?>
                                    <option value="<?php echo $geo_zone['geo_zone_id']; ?>"><?php echo $geo_zone['name']; ?></option>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-status"><?php echo $omniva_int_m_label_status; ?></label>
                        <div class="col-sm-10">
                        <select name="omniva_int_m_status" id="input-status" class="form-control">
                            <?php if ($omniva_int_m_status): ?>
                            <option value="1" selected="selected"><?php echo $text_enabled; ?></option>
                            <option value="0"><?php echo $text_disabled; ?></option>
                            <?php else: ?>
                            <option value="1"><?php echo $text_enabled; ?></option>
                            <option value="0" selected="selected"><?php echo $text_disabled; ?></option>
                            <?php endif; ?>
                        </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-sort-order"><?php echo $omniva_int_m_label_sort_order; ?></label>
                        <div class="col-sm-10">
                        <input type="text" name="omniva_int_m_sort_order" value="<?php echo $omniva_int_m_sort_order; ?>" id="input-sort-order" class="form-control" />
                        </div>
                    </div>
                    </form>
                </div>

                <div class="panel-footer clearfix">
                    <div class="pull-right">
                    <button type="submit" form="form-omniva_int_m" data-toggle="tooltip" title="<?php echo $omniva_int_m_generic_btn_save; ?>" class="btn btn-primary"><i class="fa fa-save"></i></button>
                    <a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="<?php echo $omniva_int_m_generic_btn_cancel; ?>" class="btn btn-default"><i class="fa fa-reply"></i></a>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <!-- API Settings -->
        <div class="tab-pane" id="tab-api">
            <div class="container-fluid">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"><i class="fa fa-cogs"></i> <?php echo $omniva_int_m_title_api_settings; ?></h3>
                    </div>

                    <div class="panel-body">
                        <form action="<?php echo $action; ?>" method="post" enctype="multipart/form-data" id="form-omniva_int_m-api" class="form-horizontal">
                            <input type="hidden" name="api_settings_update">

                            <div class="form-group">
                                <label class="col-sm-2 control-label" for="input-api-token"><?php echo $omniva_int_m_label_api_token; ?></label>
                                <div class="col-sm-10">
                                    <input type="text" name="omniva_int_m_api_token" value="<?php echo $omniva_int_m_api_token; ?>" id="input-api-token" class="form-control" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label" for="input-api-test-mode"><?php echo $omniva_int_m_label_api_test_mode; ?></label>
                                <div class="col-sm-10">
                                    <select name="omniva_int_m_api_test_mode" id="input-api-test-mode" class="form-control">
                                        <option value="0"><?php echo $omniva_int_m_generic_no; ?></option>
                                        <option value="1" <?php if ($omniva_int_m_api_test_mode == 1): ?> selected <?php endif; ?>><?php echo $omniva_int_m_generic_yes; ?></option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="col-sm-2 control-label" for="input-api-consolidate-mode"><?php echo $omniva_int_m_label_api_consolidate_mode; ?></label>
                                <div class="col-sm-10">
                                    <select name="omniva_int_m_api_consolidate" id="input-api-consolidate-mode" class="form-control">
                                        <option value="0"><?php echo $omniva_int_m_generic_no; ?></option>
                                        <option value="1" <?php if ($omniva_int_m_api_consolidate == 1): ?> selected <?php endif; ?>><?php echo $omniva_int_m_generic_yes; ?></option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="col-sm-2 control-label" for="input-api-use-price-with-tax"><?php echo $omniva_int_m_label_api_use_price_with_tax; ?></label>
                                <div class="col-sm-10">
                                    <select name="omniva_int_m_api_use_vat_price" id="input-api-use-price-with-tax" class="form-control">
                                        <option value="0"><?php echo $omniva_int_m_generic_no; ?></option>
                                        <option value="1" <?php if ($omniva_int_m_api_use_vat_price == 1): ?> selected <?php endif; ?>><?php echo $omniva_int_m_generic_yes; ?></option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="panel-footer clearfix">
                        <div class="pull-right">
                            <button type="submit" form="form-omniva_int_m-api" data-toggle="tooltip" title="<?php echo $omniva_int_m_generic_btn_save; ?>" class="btn btn-primary"><i class="fa fa-save"></i></button>
                            <a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="<?php echo $omniva_int_m_generic_btn_cancel; ?>" class="btn btn-default"><i class="fa fa-reply"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sender Settings -->
        <?php echo $sender_tab_partial; ?>

        <!-- Shipping methods -->
        <div class="tab-pane" id="tab-shipping-method">
            <div class="container-fluid">
                <div class="panel panel-default">
                    <div class="panel-heading heading-shipping-method">
                        <h3 class="panel-title"><i class="fa fa-pencil"></i> <?php echo $omniva_int_m_title_shipping_method_settings; ?></h3>
                        <button data-btn-add-option class="btn btn-success add-shipping-method-btn">+</button>
                    </div>
                    <div class="panel-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th><?php echo $omniva_int_m_sm_table_id; ?></th>
                                        <th><?php echo $omniva_int_m_sm_table_title; ?></th>
                                        <th><?php echo $omniva_int_m_sm_table_type; ?></th>
                                        <th><?php echo $omniva_int_m_sm_table_allowed_services; ?></th>
                                        <th><?php echo $omniva_int_m_sm_table_offer_priority; ?></th>
                                        <th><?php echo $omniva_int_m_sm_table_sort_order; ?></th>
                                        <th><?php echo $omniva_int_m_sm_table_enabled; ?></th>
                                        <th><?php echo $omniva_int_m_sm_table_actions; ?></th>
                                    </tr>
                                </thead>
                                <tbody id="shipping_options">
                                    <?php echo $omniva_int_shipping_options; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Available Services -->
        <div class="tab-pane" id="tab-services">
            <div class="container-fluid">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"><i class="fa fa-pencil"></i> <?php echo $omniva_int_m_title_services_settings; ?></h3>
                    </div>
                    <div class="panel-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th><?php echo $omniva_int_m_service_table_code; ?></th>
                                        <th><?php echo $omniva_int_m_service_table_name; ?></th>
                                        <th><?php echo $omniva_int_m_service_table_type; ?></th>
                                        <th><?php echo $omniva_int_m_service_table_logo; ?></th>
                                        <th><?php echo $omniva_int_m_service_table_pickup; ?></th>
                                        <th><?php echo $omniva_int_m_service_table_delivery; ?></th>
                                        <th><?php echo $omniva_int_m_service_table_terminal_type; ?></th>
                                        <th><?php echo $omniva_int_m_service_table_additional_services; ?></th>
                                    </tr>
                                </thead>
                                <tbody id="available_services">
                                    <?php foreach ($services as $service): ?>
                                        <tr>
                                            <td><?php echo $service->get('service_code'); ?></td>
                                            <td><?php echo $service->get('name'); ?></td>
                                            <td><?php echo $service->get('service_type'); ?></td>
                                            <td><img height="30" src="<?php echo $service->get('image'); ?>" alt=""></td>
                                            <td class="text-center">
                                                <?php if ($service->get('pickup_from_address')): ?>
                                                    <span class="service-enabled"></span>
                                                <?php else: ?>
                                                    <span class="service-disabled"></span>
                                                <?php endif; ?>
                                            </td>
                                            <td class="text-center">
                                                <?php if ($service->get('delivery_to_address')): ?>
                                                    <span class="service-enabled"></span>
                                                <?php else: ?>
                                                    <span class="service-disabled"></span>
                                                <?php endif; ?>
                                            </td>
                                            <td class="text-center"><?php echo $service->get('parcel_terminal_type'); ?></td>
                                            <td class="additional-services">
                                                <?php foreach ($service->getAdditionalServices() as $additional_service => $active): ?>
                                                    <span class="service-<?php if ($active): ?>enabled<?php else: ?>disabled<?php endif; ?>"><?php echo $additional_service; ?></span>
                                                <?php endforeach; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Parcel Defaults -->
        <div class="tab-pane" id="tab-parcel-defaults">
            <div class="container-fluid">
                <div class="alert alert-warning"><i class="fa fa-exclamation-circle"></i>
                    <?php echo $omniva_int_m_description_parcel_defaults; ?>
                </div>

                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"><i class="fa fa-cogs"></i> <?php echo $omniva_int_m_title_parcel_defaults; ?></h3>
                    </div>

                    <div class="panel-body">
                        <div class="form-horizontal">

                            <input type="hidden" name="omniva_int_m_pd_category_id" id="input-pd-category-id" value="<?php echo $global_parcel_default->category_id; ?>">

                            <div class="alert alert-info"><i class="fa fa-exclamation-circle"></i>
                                <?php echo $omniva_int_m_help_parcel_defaults; ?>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label" for="input-pd-hs-code"><?php echo $omniva_int_m_label_pd_hs_code; ?></label>
                                <div class="col-sm-10">
                                    <input type="text" name="omniva_int_m_pd_hs_code" value="<?php echo $global_parcel_default->hs_code; ?>" id="input-pd-hs-code" class="form-control" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label" for="input-pd-weight"><?php echo $omniva_int_m_label_pd_weight; ?></label>
                                <div class="col-sm-10">
                                    <div class="input-group">
                                        <input type="text" name="omniva_int_m_pd_weight" value="<?php echo $global_parcel_default->weight; ?>" id="input-pd-weight" class="form-control" />
                                        <span class="input-group-addon">kg</span>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group pd-dimensions">
                                <label class="col-sm-2 control-label" for="input-pd-length"><?php echo $omniva_int_m_label_pd_dimensions; ?></label>
                                <div class="col-sm-10">
                                    <div class="row">
                                        <label class="col-sm-2 control-label" for="input-pd-length"><?php echo $omniva_int_m_label_pd_length; ?></label>
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input type="text" name="omniva_int_m_pd_length" value="<?php echo $global_parcel_default->length; ?>" id="input-pd-length" class="form-control" />
                                                <span class="input-group-addon">cm</span>
                                            </div>
                                        </div>
                                        
                                        <label class="col-sm-2 control-label" for="input-pd-width"><?php echo $omniva_int_m_label_pd_width; ?></label>
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input type="text" name="omniva_int_m_pd_width" value="<?php echo $global_parcel_default->width; ?>" id="input-pd-width" class="form-control" />
                                                <span class="input-group-addon">cm</span>
                                            </div>
                                        </div>

                                        <label class="col-sm-2 control-label" for="input-pd-height"><?php echo $omniva_int_m_label_pd_height; ?></label>
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input type="text" name="omniva_int_m_pd_height" value="<?php echo $global_parcel_default->height; ?>" id="input-pd-height" class="form-control" />
                                                <span class="input-group-addon">cm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="col-sm-12 text-center">
                                    <button type="button" class="btn btn-default save-global-dimensions"><?php echo $omniva_int_m_generic_btn_save; ?></button>
                                </div>
                            </div>

                        </div>

                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th><?php echo $omniva_int_m_pd_table_id; ?></th>
                                        <th><?php echo $omniva_int_m_pd_table_name; ?></th>
                                        <th><?php echo $omniva_int_m_pd_table_has_custom_defaults; ?></th>
                                        <th><?php echo $omniva_int_m_pd_table_action; ?></th>
                                    </tr>
                                </thead>
                                <tbody id="pd-categories">
                                    <?php echo $pd_categories_partial; ?>
                                </tbody>
                            </table>
                        </div>

                        <div class="row">
                            <div id="omniva_int_m_pd_pagination" class="col-sm-12 text-center">
                                <?php echo $pd_categories_paginator; ?>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div> <!-- Content panel -->

    <!-- Service Create/Edit Modal -->
    <div class="omniva-int-m-modal hidden options-hidden" id="shipping_option_modal">
        <div class="panel panel-default">
            
            <div class="panel-heading">
                <h3 class="panel-title"><?php echo $omniva_int_m_sm_modal_title; ?></h3>
            </div>

            <div class="panel-body form-horizontal">

                <div class="form-group">
                    <label class="col-sm-2 control-label"><?php echo $omniva_int_m_label_sm_modal_enabled; ?></label>
                    <div class="col-sm-4">
                        <select name="option_enabled" class="form-control">
                            <option value="0" selected><?php echo $omniva_int_m_generic_no; ?></option>
                            <option value="1"><?php echo $omniva_int_m_generic_yes; ?></option>
                        </select>
                    </div>
                    <label class="col-sm-2 control-label" for="sm-option-sort-order"><?php echo $omniva_int_m_label_sm_modal_sort_order; ?></label>
                    <div class="col-sm-4">
                        <input type="text" name="option_sort_order" id="sm-option-sort-order" class="form-control">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-2 control-label" for="sm-option-name"><?php echo $omniva_int_m_label_sm_modal_name; ?></label>
                    <div class="col-sm-10">
                        <input type="text" name="option_name" id="sm-option-name" class="form-control">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-2 control-label"><?php echo $omniva_int_m_label_sm_modal_type; ?></label>
                    <div class="col-sm-10">
                        <select name="option_type" class="form-control">
                            <option value="0"><?php echo $omniva_int_m_generic_none; ?></option>
                            <?php foreach ($shipping_types as $key => $option): ?>
                                <option value="<?php echo $key; ?>"><?php echo $option; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="form-group sm-modal-global-price">
                    <label class="col-sm-2 control-label"><?php echo $omniva_int_m_label_sm_modal_price_type; ?></label>
                    <div class="col-sm-5">
                        <select name="option_price_type" class="form-control">
                            <?php foreach ($price_types as $key => $option): ?>
                                <option value="<?php echo $key; ?>"><?php echo $option; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-sm-5">
                        <div class="input-group">
                            <input type="text" name="option_price" class="form-control">
                            <span class="input-group-addon option_price">&euro;</span>
                        </div>
                    </div>
                </div>

                <div class="form-group sm-modal-global-price">
                    <label class="col-sm-2 control-label"><?php echo $omniva_int_m_label_sm_modal_free_shipping; ?></label>
                    <div class="col-sm-10">
                        <div class="input-group">
                            <input type="text" name="option_free_shipping" class="form-control">
                            <span class="input-group-addon">&euro;</span>
                        </div>
                    </div>
                </div>

                <div class="form-group sm-modal-offer-global-priority">
                    <label class="col-sm-2 control-label"><?php echo $omniva_int_m_label_sm_modal_offer_priority; ?></label>
                    <div class="col-sm-10">
                        <?php foreach ($priority_types as $key => $option): ?>
                        <label class="radio-inline">
                            <div class="price-priority-wrapper">
                                <input type="radio" name="option_price_priority" value="<?php echo $key; ?>"><?php echo $option; ?>
                            </div>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="form-group sm-modal-services-grid">
                    <div class="col-sm-12">
                        <div class="services-grid">
                            <div class="available-services">
                                <label><?php echo $omniva_int_m_label_sm_modal_available_services; ?></label>
                                <select multiple name="available_services" class="form-control">
                                    <?php foreach ($services_list as $key => $service_data): ?>
                                        <option value="<?php echo $key; ?>"><?php echo $service_data->name; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="service-action">
                                <button class="btn btn-default modal-select-service-btn" data-type="add" data-from="[name='available_services']" data-to="[name='selected_services']"></button>
                                <button class="btn btn-default modal-select-service-btn" data-type="remove" data-from="[name='selected_services']" data-to="[name='available_services']"></button>
                            </div>
                            <div class="selected-services">
                                <label><?php echo $omniva_int_m_label_sm_modal_selected_services; ?></label>
                                <select multiple name="selected_services" class="form-control">
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group sm-modal-api-countries">
                    <label class="col-xs-12 col-sm-2 control-label"><?php echo $omniva_int_m_label_sm_modal_country; ?></label>
                    <div class="col-xs-10 col-sm-8 api-countries-select-wrapper">
                        <select name="api_countries" class="form-control" style="width: 100%;">
                            <?php foreach ($countries as $option): ?>
                                <option value="<?php echo $option->get('code'); ?>"><?php echo $option->get('en_name'); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                        <button class="btn btn-success sm-modal-add-country-btn">+</button>
                    </div>
                </div>

                <div class="form-group sm-modal-api-countries api-countries-table">
                    <div class="col-sm-12 table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th><?php echo $omniva_int_m_sm_table_country; ?></th>
                                    <th><?php echo $omniva_int_m_sm_table_offer_priority; ?></th>
                                    <th><?php echo $omniva_int_m_sm_table_price; ?></th>
                                    <th><?php echo $omniva_int_m_sm_table_free_shipping; ?></th>
                                    <th><?php echo $omniva_int_m_sm_table_actions; ?></th>
                                </tr>
                            </thead>
                            <tbody id="sm-modal-countries">
                                <tr data-placeholder data-modal-no-country>
                                    <td colspan="5"><?php echo $omniva_int_m_sm_table_no_country; ?></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="form-group text-center">
                    <button id="save-add-shipping-method-btn" class="btn btn-default center"><?php echo $omniva_int_m_generic_btn_save; ?></button>
                    <button id="cancel-add-shipping-method-btn" class="btn btn-default center"><?php echo $omniva_int_m_generic_btn_cancel; ?></button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Parcel Defaults Edit Modal -->
    <div class="omniva-int-m-modal hidden" id="parcel_default_modal">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title" id="parcel_default_modal_title">PLACEHOLDER</h3>
            </div>
            <div class="panel-body form-horizontal">
                <input type="hidden" name="omniva_int_m_pd_category_id" id="modal-pd-category-id" value="<?php echo $global_parcel_default->category_id; ?>">

                <div class="alert alert-info"><i class="fa fa-exclamation-circle"></i>
                    <?php echo $omniva_int_m_help_parcel_defaults; ?>
                </div>

                <div class="form-group">
                    <label class="col-sm-2 control-label" for="modal-pd-hs-code"><?php echo $omniva_int_m_label_pd_hs_code; ?></label>
                    <div class="col-sm-10">
                        <input type="text" name="omniva_int_m_pd_hs_code" value="<?php echo $global_parcel_default->hs_code; ?>" id="modal-pd-hs-code" class="form-control" />
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-2 control-label" for="modal-pd-weight"><?php echo $omniva_int_m_label_pd_weight; ?></label>
                    <div class="col-sm-10">
                        <div class="input-group">
                            <input type="text" name="omniva_int_m_pd_weight" value="<?php echo $global_parcel_default->weight; ?>" id="modal-pd-weight" class="form-control" />
                            <span class="input-group-addon">kg</span>
                        </div>
                    </div>
                </div>

                <div class="form-group pd-dimensions">
                    <label class="col-sm-2 control-label" for="modal-pd-length"><?php echo $omniva_int_m_label_pd_dimensions; ?></label>
                    <div class="col-sm-10">
                        <div class="row">
                            <label class="col-sm-2 control-label" for="modal-pd-length"><?php echo $omniva_int_m_label_pd_length; ?></label>
                            <div class="col-sm-4">
                                <div class="input-group">
                                    <input type="text" name="omniva_int_m_pd_length" value="<?php echo $global_parcel_default->length; ?>" id="modal-pd-length" class="form-control" />
                                    <span class="input-group-addon">cm</span>
                                </div>
                            </div>
                            
                            <label class="col-sm-2 control-label" for="modal-pd-width"><?php echo $omniva_int_m_label_pd_width; ?></label>
                            <div class="col-sm-4">
                                <div class="input-group">
                                    <input type="text" name="omniva_int_m_pd_width" value="<?php echo $global_parcel_default->width; ?>" id="modal-pd-width" class="form-control" />
                                    <span class="input-group-addon">cm</span>
                                </div>
                            </div>

                            <label class="col-sm-2 control-label" for="modal-pd-height"><?php echo $omniva_int_m_label_pd_height; ?></label>
                            <div class="col-sm-4">
                                <div class="input-group">
                                    <input type="text" name="omniva_int_m_pd_height" value="<?php echo $global_parcel_default->height; ?>" id="modal-pd-height" class="form-control" />
                                    <span class="input-group-addon">cm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group text-center">
                    <button id="save-parcel-default-btn" class="btn btn-default center"><?php echo $omniva_int_m_generic_btn_save; ?></button>
                    <button id="cancel-parcel-default-btn" class="btn btn-default center"><?php echo $omniva_int_m_generic_btn_cancel; ?></button>
                </div>
            </div>
        </div>
    </div>

    <div class="omniva_int_m_loader">
        <div class="bs5-spinner-border"></div>
    </div>
</div>

<link rel="stylesheet" href="view/javascript/omniva_int_m/select2.min.css">
<link rel="stylesheet" href="view/javascript/omniva_int_m/select2_bs3.css">
<link rel="stylesheet" href="view/javascript/omniva_int_m/admin.css">
<script src="view/javascript/omniva_int_m/select2.min.js" defer></script>
<script>
var OMNIVA_INT_M_SETTINGS_DATA = {
    shippingTypes: <?php echo json_encode($shipping_types); ?>,
    servicesList: <?php echo json_encode($services_list); ?>,
    globalParcelDefault: <?php echo json_encode($global_parcel_default); ?>,
    url_ajax: '<?php echo $ajax_url; ?>',
    api_coutries: <?php echo json_encode($countries); ?>,
    geo_zones: <?php echo json_encode($geo_zones); ?>,
    priceTypes: <?php echo json_encode($price_types); ?>,
    priceTypeAddons: <?php echo json_encode($price_type_addons); ?>,
    pricePriorityType: <?php echo json_encode($priority_types); ?>
};
</script>
<script src="view/javascript/omniva_int_m/common.js"></script>
<script src="view/javascript/omniva_int_m/settings.js"></script>
<?php echo $footer; ?> 