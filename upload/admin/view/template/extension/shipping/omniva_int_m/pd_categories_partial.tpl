<?php foreach ($omniva_int_m_categories as $pd_category): ?>
    <tr>
        <td><?php echo $pd_category['category_id']; ?></td>
        <td><?php echo $pd_category['name']; ?></td>
        <td>
            <?php if ($pd_category['default_data']): ?>
                <span class="service-enabled"></span>
            <?php else: ?>
                <span class="service-disabled"></span>
            <?php endif; ?>
        </td>
        <td>
            <button type="button" class="btn btn-default edit-pd-category"
                data-category="<?php echo $pd_category['category_id']; ?>"
                data-category-name="<?php echo $pd_category['name']; ?>"
                
                <?php if ($pd_category['default_data']): ?>
                    data-has-defaults="true"
                <?php else: ?>
                    data-has-defaults="false"
                <?php endif; ?>

                <?php foreach ($pd_category['default_data'] as $key => $default_data): ?>
                data-<?php echo $key; ?>="<?php echo $default_data; ?>"
                <?php endforeach; ?>
            ><?php echo $omniva_int_m_pd_btn_edit; ?></button>
            
            <?php if ($pd_category['default_data']): ?>
            <button type="button" class="btn btn-default reset-pd-category"
                data-category="<?php echo $pd_category['category_id']; ?>"
            ><?php echo $omniva_int_m_pd_btn_reset; ?></button>
            <?php endif; ?>
        </td>
    </tr>
<?php endforeach; ?>