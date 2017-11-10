var customer_search = "";

function fetchMyCustomer() {
    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');

    var request = {
        url: HostURL + "wp-json/wc/v2/customers",
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
    oauth_data["search"] = customer_search;
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
            console.log(dataList);
            var CustomerRows = "";
            var customers = dataList;
            for (var i = 0; i < customers.length; i++) {
                CustomerRows += '<div class="row no-gutter orderItemRow" onclick="fectchACustomer(' + customers[i].id + ')">';
                CustomerRows += '<div class="col-70" align="right">';
                CustomerRows += "<b>" + customers[i].username + "</b><br/>";
                CustomerRows += customers[i].first_name + ' ' + customers[i].last_name;
                CustomerRows += '</div>';
                CustomerRows += '<div class="col-30" align="center">';
                CustomerRows += "<img src='" + customers[i].avatar_url + "' width='64' />";
                CustomerRows += '</div>';
                CustomerRows += "</div>";
            }
            jQuery("#CustomerList").html(CustomerRows);
            myApp.hideProgressbar();
        }
    });

}

function searhItCustomer() {
    if (event.keyCode == 13) {
        customer_search = jQuery("#CustomersearchInput").val();
        fetchMyCustomer();
    }
}

function ShowSearchCustomer() {
    jQuery("#myCustomerHeeadr").hide();
    jQuery("#CustomerSearchHeader").show();
    jQuery("#CustomersearchInput").focus();
}

function hideSearchCustomer() {
    jQuery("#myCustomerHeeadr").show();
    jQuery("#CustomerSearchHeader").hide();
    customer_search = "";
    jQuery("#CustomersearchInput").val("");
    fetchMyCustomer();
}



function fectchACustomer(userID) {
    activate_page("#SingleCustomer");

    LastCustomerId = userID;

    jQuery.get("page/CustomerProfile.html", function (data) {
        jQuery(".customerData").html(data);
        translateReload(appLang);
    }, 'html');

    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');

    setTimeout(function () {
        var request = {
            url: HostURL + "wc-api/v3/customers/" + userID,
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
        oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
        $.ajax({
            type: "GET",
            url: request.url + '?' + oauth.getParameterString(request, oauth_data),
            dataType: 'json',
            cache: true,
            headers: {
                "Authorization": "Basic " + btoa(wooKey)
            },
            success: function (UserInfo) {
                console.log(UserInfo);
                jQuery("#SingleCustomerHeader").html(UserInfo.customer.username);
                jQuery("#UserOrderCount").html(UserInfo.customer.orders_count);


                jQuery("#user_first_name").html(UserInfo.customer.first_name);
                jQuery("#user_last_name").html(UserInfo.customer.last_name);
                jQuery("#user_username").html(UserInfo.customer.username);
                jQuery("#user_email").html(UserInfo.customer.email);

                jQuery("#user_billing_first_name").html(UserInfo.customer.billing_address.first_name);
                jQuery("#user_billing_last_name").html(UserInfo.customer.billing_address.last_name);
                jQuery("#user_billing_company").html(UserInfo.customer.billing_address.company);
                jQuery("#user_billing_address_1").html(UserInfo.customer.billing_address.address_1);
                jQuery("#user_billing_address_2").html(UserInfo.customer.billing_address.address_2);
                jQuery("#user_billing_state").html(UserInfo.customer.billing_address.state);
                jQuery("#user_billing_postcode").html(UserInfo.customer.billing_address.postcode);
                jQuery("#user_billing_country").html(UserInfo.customer.billing_address.country);
                jQuery("#user_billing_email").html(UserInfo.customer.billing_address.email);
                jQuery("#user_billing_phone").html(UserInfo.customer.billing_address.phone);
                jQuery("#user_billing_phone").prop("href", "tel:" + UserInfo.customer.billing_address.phone);

                jQuery("#user_shipping_first_name").html(UserInfo.customer.shipping_address.first_name);
                jQuery("#user_shipping_last_name").html(UserInfo.customer.shipping_address.last_name);
                jQuery("#user_shipping_company").html(UserInfo.customer.shipping_address.company);
                jQuery("#user_shipping_address_1").html(UserInfo.customer.shipping_address.address_1);
                jQuery("#user_shipping_address_2").html(UserInfo.customer.shipping_address.address_2);
                jQuery("#user_shipping_state").html(UserInfo.customer.shipping_address.state);
                jQuery("#user_shipping_postcode").html(UserInfo.customer.shipping_address.postcode);
                jQuery("#user_shipping_country").html(UserInfo.customer.shipping_address.country);
                jQuery("#user_shipping_email").html(UserInfo.customer.shipping_address.email);
                jQuery("#user_shipping_phone").html(UserInfo.customer.shipping_address.phone);
                jQuery("#user_shipping_phone").prop("href", "tel:" + UserInfo.customer.shipping_address.phone);


                myApp.hideProgressbar();
            }
        });





    }, 50);

}

function fetchThisUserOrder() {
    jQuery("#UserOrderHistoryList").html("");

    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');


    var request = {
        url: HostURL + "wc-api/v3/customers/" + LastCustomerId + "/orders",
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
            console.log(dataList);
            var CustomerOderRows = "";
            var orders = dataList.orders;
            for (var i = 0; i < orders.length; i++) {
                CustomerOderRows += '<div class="card" onclick="GoSingleOrder(' + orders[i].id + ')">';
                CustomerOderRows += '<div class="card-header">' + orders[i].status + '</div>';
                CustomerOderRows += '<div class="card-content">';
                CustomerOderRows += '<div class="card-content-inner">';

                CustomerOderRows += '<div class="row no-gutter">';
                CustomerOderRows += '<div class="col-50">';
                CustomerOderRows += '<b>Order ID :' + dataList.orders[i].id + '<b>';
                CustomerOderRows += '</div>';
                CustomerOderRows += '<div class="col-50">';
                CustomerOderRows += orders[i].total + " " + echoCurrency(orders[i].currency);
                CustomerOderRows += '</div></div>';

                CustomerOderRows += '<div class="row no-gutter">';
                CustomerOderRows += '<div class="col-50">';
                CustomerOderRows += dataList.orders[i].completed_at;
                CustomerOderRows += '</div>';
                CustomerOderRows += '<div class="col-50">';
                CustomerOderRows += '<b>quantity :' + orders[i].total_line_items_quantity + '<b>';
                CustomerOderRows += '</div></div>';


                CustomerOderRows += '</div></div></div>';

            }

            jQuery("#UserOrderHistoryList").html(CustomerOderRows);

            myApp.hideProgressbar();
        }
    });

}