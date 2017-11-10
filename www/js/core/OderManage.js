var OrderPageIndex = 1;
var OrderCurrentResultCount;
var Last_customer_id;

function fetchOrderList() {
    OrderPageIndex = 1;
    var oderStatus = jQuery("#oderStatus").val();
    var Order_order = jQuery("#Order_order").val();
    fetchOrderListByStatus(oderStatus, Order_order);
}

function fetchOrderListByStatus(oderStatus, Order_order) {
    activate_page("#OrderListPage");


    jQuery.get("page/orderList.html", function (data) {
        jQuery("#OrderListPageContent").html(data);

        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return;
        myApp.showProgressbar(container, 'multi');

        if (oderStatus == null) {
            oderStatus = "any";
        }
        jQuery("#oderStatus").val(oderStatus);

        if (Order_order == null) {
            Order_order = "desc";
        }
        jQuery("#Order_order").val(Order_order);

        var request = {
            url: HostURL + "wp-json/wc/v2/orders",
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

        oauth_data["status"] = oderStatus;
        oauth_data["order"] = Order_order;
        oauth_data['page'] = OrderPageIndex;
        oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret),
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
                    var dataListGenrate = "";
                    OrderCurrentResultCount = dataList.length;
                    for (var i = 0; i < dataList.length; i++) {
                        dataListGenrate += GenerateOrderRow(dataList[i]);
                    }
                    jQuery("#orderListContent").html(dataListGenrate);
                    myApp.hideProgressbar();
                    translateReload(appLang);
                    pageConfigOrderList();
                }
            });


    }, 'html');
}

function appendOrder() {

    var oderStatus = jQuery("#oderStatus").val();
    var Order_order = jQuery("#Order_order").val();


    var request = {
        url: HostURL + "wp-json/wc/v2/orders",
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

    oauth_data["status"] = oderStatus;
    oauth_data["order"] = Order_order;
    oauth_data['page'] = OrderPageIndex;
    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret),
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
                var dataListGenrate = jQuery("#orderListContent").html();
                OrderCurrentResultCount = dataList.length;

                for (var i = 0; i < dataList.length; i++) {
                    dataListGenrate += GenerateOrderRow(dataList[i]);
                }
                jQuery("#orderListContent").html(dataListGenrate);
                translateReload(appLang);
            }
        });
}


function GenerateOrderRow(order) {
    var dataListGenrate = "";

    dataListGenrate += '<li class="widget" data-uib="framework7/input" data-ver="0" onclick="GoSingleOrder(' + order.id + ')" >';
    dataListGenrate += '<div class="card">';
    dataListGenrate += '<div class="card-header">';
    dataListGenrate += '<b tkey="OrderID"></b> :' + order.id + '<br/>';
    dataListGenrate += '<b class="' + order.status + '_tag" tkey="' + order.status + '">' + order.status + '</b><br/>';
    dataListGenrate += '</div>';
    dataListGenrate += '<div class = "card-content" >';
    dataListGenrate += '<div class = "card-content-inner" >';
    //  dataListGenrate += '<b>' + dataList.orders[i].customer.first_name + ' ' + dataList.orders[i].customer.last_name + '<b><br/>';
    dataListGenrate += '<b>' + order.date_created + '</b><br/>';
    dataListGenrate += '<b>' + order.total + " " + echoCurrency(order.currency) + '</b><br/>';
    dataListGenrate += '<b tkey="Product"></b> : ' + order.line_items.length + '<br/>';
    dataListGenrate += '</div>';
    dataListGenrate += '</div></div></li>';

    return dataListGenrate;
}

function pageConfigOrderList() {
    var $$ = Dom7;
    var loading = false;

    // Last loaded index
    var lastIndex = $$('.list_block_orderList li').length;

    // Max items to load
    var maxItems = 60;

    // Append items per load
    var itemsPerLoad = 10;

    var ptrContent = $$('.pull-to-refresh-content_orderList');
    ptrContent.on('ptr:refresh', function (e) {
        // Emulate 2s loading
        // Random image
        //   setTimeout(function () {
        fetchOrderList();
        myApp.pullToRefreshDone();
        //  }, 2000);
    });


    $$('.pull-to-refresh-content_orderList').on('infinite', function () {

        // Exit, if loading in progress
        if (loading) return;

        // Set loading flag
        loading = true;

        // Emulate 1s loading
        setTimeout(function () {
            // Reset loading flag
            loading = false;

            if (OrderCurrentResultCount >= itemsPerLoad) {
                OrderPageIndex++;
                // Generate new items HTML
                appendOrder();
                // Update last loaded index
                lastIndex = $$('.list_block_orderList li').length;
            }
        }, 1000);
    });


}

function getAOrder(orderID) {
    LastOrderID = orderID;
    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');


    jQuery(".productListorder").removeClass("active");
    jQuery(".orderDtial").removeClass("active");
    jQuery(".orderNote").removeClass("active");

    jQuery(".productListorder").addClass("active");
    jQuery("#orderFoooterInfo").show();
    jQuery("#orderChat").hide();

    var request = {
        url: HostURL + "wc-api/v3/orders/" + orderID,
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

    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret),
        $.ajax({
            type: "GET",
            url: request.url + '?' + oauth.getParameterString(request, oauth_data),
            dataType: 'json',
            cache: true,
            headers: {
                "Authorization": "Basic " + btoa(wooKey)
            },
            success: function (dataList) {
                console.log(dataList);
                Order = dataList.order;
                jQuery("#SingleOrderNumber").html("#:" + Order.id);
                jQuery("#ThisOrder").val(Order.status);
                jQuery("#orderTime").html(Order.completed_at);
                jQuery("#orderTotalPrice").html(Order.total + "  " + echoCurrency(Order.currency));

                var products = Order.line_items;
                var productRows = "";
                for (var i = 0; i < products.length; i++) {
                    productRows += '<div class="row no-gutter orderItemRow" onclick="fetchProductInfo(' + products[i].product_id + ')">';
                    productRows += '<div class="col-20"><img src="img/ico-products.png" width="64"/></div>';

                    productRows += '<div class="col-40">';
                    productRows += "<b>" + products[i].name + "</b></br>";
                    productRows += "<i># : </i><b>" + products[i].product_id + "</b>";
                    productRows += '</div>';

                    productRows += '<div class="col-40" dir="auto">';
                    productRows += "<i tkey='Quantity'></i> : <b>" + products[i].quantity + "</b></br>";
                    productRows += "<i tkey='Price'></i> : <b>" + products[i].price + "</b>";
                    productRows += '</div>';
                    productRows += '</div>';
                }
                jQuery("#productListOrder").html(productRows);


                jQuery.get("page/OrderDetail.html", function (data) {
                    jQuery("#orderDtialPage").html(data);
                    
                    Last_customer_id = Order.customer_id;
                    fillCustomerFeild(Order.customer, Order.payment_details.method_title, Order.payment_details.paid, Order.shipping_methods);

                    console.log(appLang);
                    translateReload(appLang);

                }, 'html');


                jQuery("#productListOrder").show();
                jQuery("#orderDtialPage").hide();
                jQuery("#orderNotePage").hide();



                myApp.hideProgressbar();
            }
        });

}


function fetchOrderNote() {
    //  jQuery("#orderNotePage").html("");

    myApp.hideProgressbar();
    var containers = $$('body');
    if (containers.children('.progressbar, .progressbar-infinite').length) return;
    myApp.showProgressbar(containers, 'multi');

    console.log("Note");

    var request = {
        url: HostURL + "wc-api/v3/orders/" + LastOrderID + "/notes",
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

    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret),
        $.ajax({
            type: request.method,
            url: request.url + '?' + oauth.getParameterString(request, oauth_data),
            dataType: 'json',
            cache: true,
            headers: {
                "Authorization": "Basic " + btoa(wooKey)
            },
            success: function (dataList) {
                //console.log(dataList);
                var notes = "";
                var order_notes = dataList.order_notes;
                for (var i = 0; i < order_notes.length; i++) {

                    notes += '<div class="row no-gutter note_row" dir="auto">';
                    notes += '<div class="col-90">' + order_notes[i].note + '</div>';
                    notes += '<div class="col-10">';
                    notes += '<p><a href="#" class="color-red button-round" onclick="deleteNoteOrder(' + order_notes[i].id + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                    notes += '</div></div>';
                }

                jQuery("#orderNotePage").html(notes);

                myApp.hideProgressbar();
            }
        });
}

function deleteNoteOrder(noteID) {
    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return;
    myApp.showProgressbar(container, 'multi');

    var request = {
        url: HostURL + "wc-api/v3/orders/" + LastOrderID + "/notes/" + noteID,
        method: 'DELETE',
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

    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret),
        $.ajax({
            type: request.method,
            url: request.url + '?' + oauth.getParameterString(request, oauth_data),
            dataType: 'json',
            cache: true,
            headers: {
                "Authorization": "Basic " + btoa(wooKey)
            },
            success: function (dataList) {
                myApp.hideProgressbar();
                setTimeout(function () {
                    fetchOrderNote();
                }, 500);

            }
        });
}

function GoSingleOrder(orderID) {
    activate_page("#SingleOrder");
    getAOrder(orderID);
    return false;
}

function fillCustomerFeild(customer, payment_details, payment_paid, shipping_methods) {
    //console.log(customer);

    //   jQuery("#orderCustomerAvatar").attr("src", customer.avatar_url);
    jQuery("#orderCustomerName").html(customer.first_name);
    jQuery("#orderCustomerFamily").html(customer.last_name);
    jQuery("#orderCustomerEmail").html(customer.email);

    jQuery("#order_payment_details").html(payment_details);
    var payment_paid_html = "";
    if (payment_paid) {
        payment_paid_html = '<b class="paid" tkey="paid">paid</b>';
    } else {
        payment_paid_html = '<b class="Notpaid" tkey="notpaid">Not paid</b>';
    }
    jQuery("#order_payment_paid").html(payment_paid_html);


    jQuery("#order_shipping_methods").html(shipping_methods);


    jQuery("#billing_address_1").html(customer.billing_address.address_1);
    jQuery("#billing_address_2").html(customer.billing_address.address_2);
    jQuery("#billing_address_City").html(customer.billing_address.city);
    jQuery("#billing_address_email").html(customer.billing_address.email);
    jQuery("#billing_address_first_name").html(customer.billing_address.first_name);
    jQuery("#billing_address_last_name").html(customer.billing_address.last_name);
    jQuery("#billing_address_phone").html(customer.billing_address.phone);
    jQuery("#billing_address_phone").prop("href", "tel:" + customer.billing_address.phone);

    jQuery("#billing_address_postcode").html(customer.billing_address.postcode);

    jQuery("#shipping_address_1").html(customer.shipping_address.address_1);
    jQuery("#shipping_address_2").html(customer.shipping_address.address_2);
    jQuery("#shipping_address_City").html(customer.shipping_address.city);
    jQuery("#shipping_address_email").html(customer.shipping_address.email);
    jQuery("#shipping_address_first_name").html(customer.shipping_address.first_name);
    jQuery("#shipping_address_last_name").html(customer.shipping_address.last_name);
    jQuery("#shipping_address_phone").html(customer.shipping_address.phone);
    jQuery("#shipping_address_phone").prop("href", "tel:" + customer.shipping_address.phone);
    jQuery("#shipping_address_postcode").html(customer.shipping_address.postcode);
}

function changeOrderStatus() {
    var oderStatus = jQuery("#ThisOrder").val();


    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');

    var request = {
        url: HostURL + "wp-json/wc/v2/orders/" + LastOrderID,
        method: 'PUT',
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
    var statusObj = {
        "status": oderStatus
    };
    //console.log(oderStatus);
    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
    $.ajax({
        type: request.method,
        'data': JSON.stringify(statusObj),
        'contentType': 'application/json',
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (Result) {
            myApp.hideProgressbar();
        }
    });



}


function sendNewNoteOrder() {
    var orderNote = jQuery("#orderNoteText").val();

    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');

    var request = {
        url: HostURL + "wp-json/wc/v2/orders/" + LastOrderID + "/notes",
        method: 'POST',
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
    var noteObj = {
        "note": orderNote
    };

    //console.log(oderStatus);
    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
    $.ajax({
        type: request.method,
        'data': JSON.stringify(noteObj),
        'contentType': 'application/json',
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (Result) {
            jQuery("#orderNoteText").val("");
            myApp.hideProgressbar();
            setTimeout(function () {
                fetchOrderNote();
            }, 500);

        }
    });


}


function removeLastedOrder() {
    myApp.confirm('Remove Order', 'Are you sure?',
        function () {

            var request = {
                url: HostURL + "wp-json/wc/v2/orders/" + LastOrderID,
                method: 'DELETE',
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

            oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
            $.ajax({
                type: "DELETE",
                url: request.url + '?' + oauth.getParameterString(request, oauth_data),
                dataType: 'json',
                cache: true,
                headers: {
                    "Authorization": "Basic " + btoa(wooKey)
                },
                success: function (Result) {
                    window.history.back();
                }
            });


        },
        function () {

        }
    );
}


function goUserProfile() {
    fectchACustomer(Last_customer_id);
}