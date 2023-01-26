<div class="table-responsive">
    <table class="table table-striped table-hover">
        <caption><?php echo $omniva_int_m_manifest_caption; ?></caption>
        <thead>
            <tr>
                <th><?php echo $omniva_int_m_manifest_table_col_manifest_id; ?></th>
                <th><?php echo $omniva_int_m_manifest_table_col_order_count; ?></th>
                <th><?php echo $omniva_int_m_manifest_table_col_actions; ?></th>
            </tr>
        </thead>
        <tbody id="manifests-list">
            <?php if (!empty($manifests)): ?>
                <?php foreach ($manifests as $manifest): ?>
                    <tr>
                        <td><?php echo $manifest['manifest_id']; ?></td>
                        <td><?php echo $manifest['total_orders']; ?></td>
                        <td>
                            <button data-print-manifest="<?php echo $manifest['manifest_id']; ?>" data-warning="<?php echo $omniva_int_m_manifest_warning_btn_print; ?>" class="btn btn-default"><?php echo $omniva_int_m_manifest_btn_print; ?></button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
            <tr>
                <td colspan="3"><?php echo $omniva_int_m_manifest_table_empty; ?></td>
            </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<div class="row">
    <div id="pagination" class="col-sm-12 text-center">
        <?php echo $paginator; ?>
    </div>
</div>