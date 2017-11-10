function goSaleReportPage() {
    jQuery.get("page/saleReport.html", function (data) {
        jQuery(".SaleReportContent").html(data);
        FetchSaleReport("tab_report_week");
    }, 'html');
}

function GetWeekReport() {
    FetchSaleReport("tab_report_week");
}

function GetMonthReport() {
    FetchSaleReport("tab_report_month");
}

function GetYearReport() {
    FetchSaleReport("tab_report_year");
}

function FetchSaleReport(pageId) {

    var period = pageId.replace("tab_report_", "");
    myApp.showPreloader('loading');
    var request = {
        url: HostURL + "wc-api/v3/reports/sales",
        method: 'GET',
    };

    var timestamp = new Date();
    timestamp = timestamp.valueOf().toString().substr(0, 10);

    var oauth = OAuth({
        consumer: {
            key: consumerKey,
            secret: consumerSecret
        },
        signature_method: 'HMAC-SHA1',
        hash_function: function (base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    });
    var oauth_data = {
        oauth_consumer_key: oauth.consumer.key,
        oauth_nonce: rand(10),
        oauth_signature_method: oauth.signature_method,
        oauth_version: "1.0",
        oauth_timestamp: timestamp,
    };
    oauth_data['filter[period]'] = period;
    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
    $.ajax({
        type: "GET",
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        dataType: 'json',
        cache: true,
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (dataList) {
            //console.log(dataList);
            var report_data = "";
            report_data += '<label>total sales :</label><b>' + dataList.sales.total_sales + '</b><br/>';
            report_data += '<label>net sales :</label><b>' + dataList.sales.net_sales + '</b><br/>';
            report_data += '<label>average sales :</label><b>' + dataList.sales.average_sales + '</b><br/>';
            report_data += '<label>total items :</label><b>' + dataList.sales.total_items + '</b><br/>';
            report_data += '<label>total tax :</label><b>' + dataList.sales.total_tax + '</b><br/>';
            report_data += '<label>total shipping :</label><b>' + dataList.sales.total_shipping + '</b><br/>';
            report_data += '<label>total refunds :</label><b>' + dataList.sales.total_refunds + '</b><br/>';
            report_data += '<label>total discount :</label><b>' + dataList.sales.total_discount + '</b><br/><hr/>';
            report_data += '<div id="chartContainer_' + pageId + '" style="height: 300px; width: 100%;"></div>';

            jQuery("#" + pageId).html(report_data);

            var dataPointsSale = [];

            $.map(dataList.sales.totals, function (value, index) {
                dataPointsSale.push({
                    x: new Date(index),
                    y: value.sales / 10
                });
            });
            myApp.hidePreloader();
            var options = {
                title: {
                    text: "total sales by " + period
                },
                animationEnabled: true,
                data: [
                    {
                        type: "line",
                        dataPoints: dataPointsSale
    		}
    		]
            };

            $("#chartContainer_" + pageId).CanvasJSChart(options);
        }
    });
}
/***********************************************************************************************/
function goTopSaleReportPage() {
    jQuery.get("page/topSaleReport.html", function (data) {
        jQuery(".TopSalePageContent").html(data);
        FetchTopSaleReport("tab_topSale_week");
    }, 'html');
}

function GetWeekReportTopSale() {
    FetchTopSaleReport("tab_topSale_week");
}

function GetMonthReportTopSale() {
    FetchTopSaleReport("tab_topSale_month");
}

function GetYearReportTopSale() {
    FetchTopSaleReport("tab_topSale_year");
}

function FetchTopSaleReport(pageId) {

    var period = pageId.replace("tab_topSale_", "");
    myApp.showPreloader('loading');
    var request = {
        url: HostURL + "wc-api/v3/reports/sales/top_sellers",
        method: 'GET',
    };

    var timestamp = new Date();
    timestamp = timestamp.valueOf().toString().substr(0, 10);

    var oauth = OAuth({
        consumer: {
            key: consumerKey,
            secret: consumerSecret
        },
        signature_method: 'HMAC-SHA1',
        hash_function: function (base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    });
    var oauth_data = {
        oauth_consumer_key: oauth.consumer.key,
        oauth_nonce: rand(10),
        oauth_signature_method: oauth.signature_method,
        oauth_version: "1.0",
        oauth_timestamp: timestamp,
    };
    oauth_data['filter[period]'] = "last_" + period;

    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
    $.ajax({
        type: "GET",
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        dataType: 'json',
        cache: true,
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (dataList) {
            //console.log(dataList);

            var report_data = "";
            for (var i = 0; i < dataList.top_sellers.length; i++) {
                report_data += '<div class="card" onclick="fetchProductInfo(' + dataList.top_sellers[i].product_id + ')">';
                report_data += '<div class="card-header">' + dataList.top_sellers[i].title + '</div>';
                report_data += '<div class="card-content">';
                report_data += '<div class="card-content-inner">quantity : ' + dataList.top_sellers[i].quantity + '</div>';
                report_data += '</div></div>';
            }
            //console.log(report_data);
            jQuery("#" + pageId).html(report_data);

            myApp.hidePreloader();

        }
    });
}
