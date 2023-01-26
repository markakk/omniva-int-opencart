<?php if (!empty($omniva_int_options)): ?>
    <?php foreach ($omniva_int_options as $omniva_int_option): ?>
        <tr data-shipping-method-id="<?php echo $omniva_int_option->id; ?>">
            <td><?php echo $omniva_int_option->id; ?></td>
            <td><?php echo $omniva_int_option->title; ?></td>
            <td><?php echo $dynamic_strings[$omniva_int_option->getTypeTranslationString()]; ?></td>
            <td><?php echo $omniva_int_option->allowed_services; ?></td>
            <td><?php echo $dynamic_strings[$omniva_int_option->getOfferPriorityTranslationString()]; ?></td>
            <td><?php echo $omniva_int_option->sort_order; ?></td>
            <td>
                <?php if ($omniva_int_option->enabled): ?>
                    <span class="service-enabled"></span>
                <?php else: ?>
                    <span class="service-disabled"></span>
                <?php endif; ?>
            </td>
            <td>
                <button class="btn btn-default" data-btn-add-option data-shipping-method-id="<?php echo $omniva_int_option->id; ?>"><?php echo $omniva_int_m_sm_table_btn_edit; ?></button>
                <button class="btn btn-danger" data-btn-delete-option data-shipping-method-id="<?php echo $omniva_int_option->id; ?>"><i class="fa fa-trash"></i></button>
            </td>
        </tr>
    <?php endforeach; ?>
<?php else: ?>
    <tr>
        <td colspan="8" class="text-center"><?php echo $omniva_int_m_sm_table_no_options; ?></td>
    </tr>
<?php endif; ?>