function goproductListPage() {
    activate_page("#productListPage");
    categoryName = null;
    searchKey = "";
    fecthProductList();
    return false;
}

function goOrderListPage() {
    fetchOrderListByStatus('any')
    return false;
}

function goCustomerPage() {
    fetchMyCustomer();
    activate_page("#CustomerPage");
    return false;
}



function fetchDashboardReport() {
    var containers = $$('body');
    if (containers.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(containers, 'multi');
    var urls = HostURL + "wp-json/wooadmin/dashboard/"+consumerSecret;

    jQuery.get("page/dashboard.html", function (data) {
        jQuery(".dashboardContent").html(data);
        translateReload(appLang);
        jQuery(".dashboardContent").fadeIn(300);
        $.ajax({
            type: "GET",
            url: urls,
            dataType: 'json',
            async: true,
            cache: true,
            headers: {
                "Authorization": "Basic " + btoa(wooKey)
            },
            success: function (dataList) {
                //console.log(dataList);
                
                jQuery("#shopName").html(dataList.shopName);
                jQuery("#oreder-completed").html(dataList.completed);
                jQuery("#oreder-processing").html(dataList.processing);
                jQuery("#oreder-onhold").html(dataList.onhold);
                jQuery("#oreder-pending").html(dataList.pending);
                jQuery("#oreder-cancelled").html(dataList.cancelled);
                jQuery("#oreder-refunded").html(dataList.refunded);
                jQuery("#oreder-failed").html(dataList.failed);

                
                jQuery("#TotalProduct").html(dataList.productLive);
                /*
                jQuery("#productCount").html(dataList.productCount);
                jQuery("#productPendingReview").html(dataList.productPendingReview);
                jQuery("#productTrash").html(dataList.productTrash);
                */
                jQuery("#TotalSale").html(dataList.totalSale);
                jQuery("#TotalCustomer").html(dataList.customer);
                
                $('#TotalSale').priceFormat({
                    prefix: '',
                    suffix: ' ' + echoCurrency(dataList.currency),
                    centsSeparator: ',',
                    thousandsSeparator: ',',
                    centsLimit: 0
                });
                myApp.hideProgressbar();

                initNotification();
            }
        });

        jQuery("#MenuSideBar").show();
    }, 'html');


}