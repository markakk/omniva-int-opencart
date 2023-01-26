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
        </div>
    </div>

    <div id="omniva_int_m-panel" class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">
                <i class="fa fa-info-circle"></i>
                <?php echo $omniva_int_m_manifest_page_title; ?>
            </h3>
        </div>
        <div class="panel-body" id="manifest-list-table">
            <?php echo $manifests_partial; ?>
        </div>

        <div class="panel-footer">
            
        </div>
    </div>

    <div class="omniva_int_m_loader">
        <div class="bs5-spinner-border"></div>
    </div>
</div>

<link rel="stylesheet" href="view/javascript/omniva_int_m/admin.css">
<script>
var OMNIVA_INT_M_MANIFEST_DATA = {
    ajax: '<?php echo $ajax_url; ?>'
};
</script>
<script src="view/javascript/omniva_int_m/common.js"></script>
<script src="view/javascript/omniva_int_m/manifest.js"></script>
<?php echo $footer; ?> 