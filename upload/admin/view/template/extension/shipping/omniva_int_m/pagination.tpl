<?php if ($total_pages > 0): ?>
<ul class="pagination">
    <?php if ($current_page > 1): ?>
    <li>
        <a href="#" class="omniva_int_m-paginator-btn-previous"  data-page="<?php echo $current_page - 1; ?>">&lt;&lt;</a>
    </li>
    <?php else: ?>
    <li class="disabled">
        <span>&lt;&lt;</span>
    </li>
    <?php endif; ?>
    <li class="active">
        <span class="omniva_int_m_current_page"><?php echo $current_page; ?></span>
        <span>/</span>
        <span class="omniva_int_m_total_pages"><?php echo $total_pages; ?></span>
    </li>
    <?php if ($current_page < $total_pages): ?>
    <li>
        <a href="#" class="omniva_int_m-paginator-btn-next" data-page="<?php echo $current_page + 1; ?>">&gt;&gt;</a>
    </li>
    <?php else: ?>
    <li class="disabled">
        <span>&gt;&gt;</span>
    </li>
    <?php endif; ?>
</ul>
<?php endif; ?>