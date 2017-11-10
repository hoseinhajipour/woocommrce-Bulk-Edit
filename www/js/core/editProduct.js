var lastedProductData;
var LastedPid;

var EditProductImageUrl = [];

function loadEditProduct(productId) {
    CurrentPageState = "EditProduct";
    myApp.closeModal();
    activate_page("#editProductPage");

    jQuery.get("page/editProduct.html", function (data) {
        jQuery(".editProductContent").html(data);
        fillProductInfoForEdit(productId);
    }, 'html');
}

function fillProductInfoForEdit(productId) {
    LastedPid = productId;
    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');

    var dataListGenrate = "";
    //jQuery(".productList").html("");

    var request = {
        url: HostURL + "wc-api/v3/products/" + productId,
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
        success: function (productInfo) {
            //console.log(productInfo);
            lastedProductData = productInfo;
            var catRow = "";
            for (var i = 0; i < productInfo.product.categories.length; i++) {
                catRow += productInfo.product.categories[i];
                if (i < productInfo.product.categories.length - 1) {
                    catRow += ' <i class="fa fa-chevron-right" aria-hidden="true"></i> ';
                }
            }

            jQuery("#EditProductSelectedCategory").html(catRow);

            jQuery("#editProductName").val(productInfo.product.title);
            jQuery("#editProductPrice").val(productInfo.product.regular_price);
            jQuery("#editProductSalePrice").val(productInfo.product.sale_price);
            jQuery("#editProductdescription").val($(productInfo.product.description).text());
            jQuery("#editProductShortdescription").val($(productInfo.product.short_description).text());
            jQuery("#editProduct_stock_quantity").val(productInfo.product.stock_quantity);
            jQuery("#editProduct_SKU").val(productInfo.product.sku);

            jQuery("#editProduct_Weight").val(productInfo.product.weight);
            jQuery("#editProduct_length").val(productInfo.product.dimensions.length);
            jQuery("#editProduct_width").val(productInfo.product.dimensions.width);
            jQuery("#editProduct_height").val(productInfo.product.dimensions.height);
            jQuery("#editProduct_unit").val(productInfo.product.dimensions.unit);

            shippingName = decodeURIComponent(productInfo.product.shipping_class);

            EditProductImageUrl = productInfo.product.images;
            generateImageListForEdit(EditProductImageUrl);

            var shippingContent = '<option selected value="' + productInfo.product.shipping_class_id + ',' + shippingName +
                '">' + shippingName + '</option>';
            jQuery("#Editshipping_classes").append(shippingContent);



            myApp.hideProgressbar();

            fetch_shipping_classes();
            translateReload(appLang);
        }
    });
}


function UpdateProduct() {
    var request = {
        url: HostURL + "wp-json/wc/v2/products/" + LastedPid,
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

    var shipping_classes_id = jQuery("#Editshipping_classes").val();
    var shipping_classes_name = "";
    if (shipping_classes_id === "none") {
        shipping_classes_name = "";
        shipping_classes_id = null;
    } else {
        var sp = shipping_classes_id.split(',');
        shipping_classes_id = sp[0];
        shipping_classes_name = sp[1];
    }

    var productbj = {
        "name": jQuery("#editProductName").val(),
        "description": jQuery("#editProductdescription").val(),
        "short_description": jQuery("#editProductShortdescription").val(),
        "stock_quantity": jQuery("#editProduct_stock_quantity").val(),
        "regular_price": jQuery("#editProductPrice").val(),
        "sale_price": jQuery("#editProductSalePrice").val(),
        "sku": jQuery("#editProduct_SKU").val(),
        "shipping_class": shipping_classes_name,
        "shipping_class_id": shipping_classes_id,
        "weight": jQuery("#editProduct_Weight").val(),
        "dimensions": {
            "length": jQuery("#editProduct_length").val(),
            "width": jQuery("#editProduct_width").val(),
            "height": jQuery("#editProduct_height").val(),
            "unit": jQuery("#editProduct_unit").val()
        },
        "categories": convertCategory(NewCetgoryArray),
        "attributes": GenerateAttributeObjectEdit(),

    };
    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);

    $.ajax(request.url + '?' + oauth.getParameterString(request, oauth_data), {
        'data': JSON.stringify(productbj),
        'type': 'PUT',
        'processData': false,
        'contentType': 'application/json',
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (dataCallBack) {
            //console.log(dataCallBack);
        }
    });
}

function generateImageListForEdit(imageList) {
    var newImage="";
    for (var i = 0; i < imageList.length; i++) {
        newImage += "<img id='newProductImage_" + i + "' src='" + imageList[i].src + "' width='64' height='64' onclick='removeThisImage(" + i + ")'/>"
    }
    
     jQuery("#EditProductImageList").html(newImage);
}

function convertCategory(catArray) {
    var ConvertArray = [];
    for (var i = 0; i < catArray.length; i++) {
        ConvertArray.push({
            "id": catArray[i]
        });
    }
    return ConvertArray;
}

function GenerateAttributeObjectEdit() {
    var barcodeNumber = jQuery("#editProduct_Barcode").val();
    var finalAtt = [];
    if (barcodeNumber !== "") {
        finalAtt.push({
            "name": "barcode",
            "visible": false,
            "options": [barcodeNumber]
        });
    }
    Object.keys(NewAttributeRowArray).forEach(function (key) {
        finalAtt.push({
            "name": NewAttributeRowArray[key].name,
            "visible": true,
            "options": NewAttributeRowArray[key].value
        });
    });
    return finalAtt;
}