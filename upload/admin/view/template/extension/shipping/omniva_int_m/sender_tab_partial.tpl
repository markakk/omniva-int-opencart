<div class="tab-pane" id="tab-sender-info">
    <div class="container-fluid">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-pencil"></i> <?php echo $omniva_int_m_title_sender_settings; ?></h3>
            </div>

            <div class="panel-body">
                <form action="<?php echo $action; ?>" method="post" enctype="multipart/form-data" id="form-omniva_int_m-sender" class="form-horizontal">
                    <input type="hidden" name="sender_settings_update">

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-sender-name"><?php echo $omniva_int_m_label_sender_name; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="omniva_int_m_sender_name" value="<?php echo $omniva_int_m_sender_name; ?>" id="input-sender-name" class="form-control" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-sender-street"><?php echo $omniva_int_m_label_sender_street; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="omniva_int_m_sender_street" value="<?php echo $omniva_int_m_sender_street; ?>" id="input-sender-street" class="form-control" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-sender-postcode"><?php echo $omniva_int_m_label_sender_postcode; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="omniva_int_m_sender_postcode" value="<?php echo $omniva_int_m_sender_postcode; ?>" id="input-sender-postcode" class="form-control" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-sender-city"><?php echo $omniva_int_m_label_sender_city; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="omniva_int_m_sender_city" value="<?php echo $omniva_int_m_sender_city; ?>" id="input-sender-city" class="form-control" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label"><?php echo $omniva_int_m_label_sender_country; ?></label>
                        <div class="col-sm-10">
                            <select name="omniva_int_m_sender_country" class="js-select-sender" style="width: 100%">
                                <option value=""></option>
                                <?php foreach ($countries as $country): ?>
                                    <option value="<?php echo $country->get('code'); ?>" <?php if ($country->get('code') == $omniva_int_m_sender_country): ?> selected <?php endif; ?>><?php echo $country->get('en_name'); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-sender-phone"><?php echo $omniva_int_m_label_sender_phone; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="omniva_int_m_sender_phone" value="<?php echo $omniva_int_m_sender_phone; ?>" id="input-sender-phone" class="form-control" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="input-sender-email"><?php echo $omniva_int_m_label_sender_email; ?></label>
                        <div class="col-sm-10">
                            <input type="text" name="omniva_int_m_sender_email" value="<?php echo $omniva_int_m_sender_email; ?>" id="input-sender-email" class="form-control" />
                        </div>
                    </div>
                </form>
            </div>

            <div class="panel-footer clearfix">
                <div class="pull-right">
                    <button type="submit" form="form-omniva_int_m-sender" data-toggle="tooltip" title="<?php echo $omniva_int_m_generic_btn_save; ?>" class="btn btn-primary"><i class="fa fa-save"></i></button>
                    <a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="<?php echo $omniva_int_m_generic_btn_cancel; ?>" class="btn btn-default"><i class="fa fa-reply"></i></a>
                </div>
            </div>
        </div> <!-- Panel -->
    </div> <!-- Container -->
</div> <!-- Pane -->