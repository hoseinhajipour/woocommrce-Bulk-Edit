var NewAttributeRowCount = 0;
var NewAttributeRowArray = [];
var imageURL = [];
var imagerowCount = 0;
var imageReadyForUploadCount = 0;
var imageUploadedCount = 0;
var newProductImageUrl = [];
/************************************************************/

function win(r) {
    var newImageUpRow = {
        "src": r.response,
        "position": imageUploadedCount,
    };
    newProductImageUrl.push(newImageUpRow);

    imageUploadedCount++;
    if (imageUploadedCount == imageReadyForUploadCount) {
        UploadNewProdcut();
    } else if (imageUploadedCount < imageReadyForUploadCount) {
        uploadQueue(imageUploadedCount);
    }

}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    myApp.hidePreloader();
}

function onSuccess(imageURI) {
    imageURL.push({
        id: imagerowCount,
        src: imageURI
    });

    var oldImageList = jQuery("#newProductImageList").html();
    var newImage = "<img id='newProductImage_" + imagerowCount + "' src='" + imageURI + "' width='64' height='64' onclick='removeThisImage(" + imagerowCount + ")'/>";
    jQuery("#newProductImageList").html(oldImageList + newImage);
    imagerowCount++;
}

function removeThisImage(imageId) {
    myApp.confirm('Remove This Picture', 'Are you sure?', function () {
        Object.keys(imageURL).forEach(function (key) {
            if (imageURL[key].id == imageId) {
                delete imageURL[key];
            }
        });
        jQuery("#newProductImage_" + imageId).remove();
    });
}


function onFail(message) {
    alert('Failed because: ' + message);
}

function appendImageProduct() {
    navigator.camera.cleanup(cleanuponSuccess, cleanuponFail);
    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true,
    };
    navigator.camera.getPicture(onSuccess, onFail, options);
}

function TakeImageProduct() {
    navigator.camera.cleanup(cleanuponSuccess, cleanuponFail);
    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true,
    };
    navigator.camera.getPicture(onSuccess, onFail, options);
}

/***********************************************************************************************/


function UploadNewProdcut() {
    var newProductName = jQuery("#newProductName").val();
    var newProductPrice = jQuery("#newProductPrice").val();
    var newProductSalePrice = jQuery("#newProductSalePrice").val();
    var newProductdescription = jQuery("#newProductdescription").val();
    var newProductShortdescription = jQuery("#newProductShortdescription").val();
    var newProduct_stock_quantity = jQuery("#newProduct_stock_quantity").val();

    var newProduct_SKU = jQuery("#newProduct_SKU").val();



    var shipping_classes_id = jQuery("#shipping_classes").val();
    var shipping_classes_name = "";
    if (shipping_classes_id === "none") {
        shipping_classes_name = "";
        shipping_classes_id = null;
    } else {
        var sp = shipping_classes_id.split(',');
        shipping_classes_id = sp[0];
        shipping_classes_name = sp[1];
    }

    var newProduct_length = jQuery("#newProduct_length").val();
    var newProduct_width = jQuery("#newProduct_width").val();
    var newProduct_height = jQuery("#newProduct_height").val();
    var newProduct_unit = jQuery("#newProduct_unit").val();

    var dimensions = {
        "length": newProduct_length,
        "width": newProduct_width,
        "height": newProduct_height,
        "unit": newProduct_unit
    };
    var weight = jQuery("#newProduct_Weight").val();

    var productbj;
    productbj = {
        "product": {
            "title": newProductName,
            "type": "simple",
            "images": newProductImageUrl,
            "regular_price": newProductPrice,
            "sale_price": newProductSalePrice,
            "description": newProductdescription,
            "short_description": newProductShortdescription,
            "sku": newProduct_SKU,
            "managing_stock": true,
            "in_stock": true,
            "stock_quantity": newProduct_stock_quantity,
            "shipping_class": shipping_classes_name,
            "shipping_class_id": shipping_classes_id,
            "attributes": GenerateAttributeObject(),
            "dimensions": dimensions,
            "weight": weight,
            "categories": NewCetgoryArray,
        }
    };
    //console.log(productbj);

    var request = {
        url: HostURL + "wc-api/v3/products/",
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

    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
    //console.log(oauth.getParameterString(request, oauth_data));


    $.ajax(request.url + '?' + oauth.getParameterString(request, oauth_data), {
        'data': JSON.stringify(productbj),
        'type': 'POST',
        'processData': false,
        'contentType': 'application/json',
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (dataCallBack) {
            myApp.hidePreloader();
            activate_page("#productListPage");
            fecthProductList();
            restProductForm();
        }
    });

}



function restProductForm() {
    imageURL = [];
    newProductImageUrl = null;
    NewAttributeRowCount = 0;
    NewAttributeRowArray = [];
    NewCetgoryArray = [];
    imageReadyForUploadCount = 0;
    imageUploadedCount = 0;
    newProductImageUrl = [];

    jQuery("#newProductName").val("");
    jQuery("#newProductPrice").val("");
    jQuery("#newProductdescription").val("");
    jQuery("#NewAttributeList").html("");
    jQuery("#newProductImageList").html("");
}

function loadNewProductContentField() {
    CurrentPageState = "newProduct";

    jQuery.get("page/newProduct.html", function (data) {
        jQuery(".newProductContent").html(data);
        fetch_shipping_classes();
    }, 'html');
}

function getRealUrlName(keyNumber) {
    var ImageSrc = "";
    Object.keys(imageURL).forEach(function (key) {
        if (imageURL[key].id == keyNumber) {
            ImageSrc = imageURL[key].src;
        }
    });
    var name = ImageSrc.substr(ImageSrc.lastIndexOf('/') + 1);
    var find = name.indexOf('?');
    if (find > -1) {
        name = name.substring(0, find);
    }
    return name;
}

function getRealUrl(keyNumber) {
    var ImageSrc = "";
    Object.keys(imageURL).forEach(function (key) {
        if (imageURL[key].id == keyNumber) {
            ImageSrc = imageURL[key].src;
        }
    });


    return ImageSrc;
}

function uploadQueue(keyNumber) {
    var urlUpload = HostURL + "wp-content/plugins/wooadmin/upload.php";
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = getRealUrlName(keyNumber);
    options.mimeType = "text/plain";

    var params = {};
    params.value1 = "hosein";
    params.value2 = "123";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(getRealUrl(keyNumber), encodeURI(urlUpload), win, fail, options);

}

function CreateNewProduct() {
    myApp.showPreloader('loading');

    imageReadyForUploadCount = 0;
    Object.keys(imageURL).forEach(function (key) {
        imageReadyForUploadCount++;
    });
    if (imageReadyForUploadCount > 0) {
        uploadQueue(imageUploadedCount);
    } else {
        UploadNewProdcut();
    }
}


function OpenBarcodeReader() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            jQuery("#newProduct_Barcode").val(result.text);
        },
        function (error) {
            alert("Scanning failed: " + error);
        }, {
            preferFrontCamera: false, // iOS and Android 
            showFlipCameraButton: false, // iOS and Android 
            showTorchButton: true, // iOS and Android 
            torchOn: true, // Android, launch with the torch switched on (if available) 
            prompt: "Place a barcode inside the scan area", // Android 
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500 
            formats: "QR_CODE,PDF_417,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,RSS_EXPANDED", // default: all but PDF_417 and RSS_EXPANDED 
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device 
            disableAnimations: false, // iOS 
            disableSuccessBeep: false // iOS 
        }
    );
}

function fetch_shipping_classes() {
    /*
    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');
*/
//console.log("shipping_classesList");
    var request = {
        url: HostURL + "wc-api/v3/products/shipping_classes",
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
        success: function (shipping_classesList) {
            //console.log(shipping_classesList);
            if (CurrentPageState == "newProduct") {
                var shippingContent = "";
                shippingContent += '<option value="none">none</option>';
                for (var i = 0; i < shipping_classesList.product_shipping_classes.length; i++) {
                    shippingContent += '<option value="' + shipping_classesList.product_shipping_classes[i].id + ',' + shipping_classesList.product_shipping_classes[i].name +
                        '">' + shipping_classesList.product_shipping_classes[i].name + '</option>';
                }
                jQuery("#shipping_classes").html(shippingContent);
            }
            if (CurrentPageState == "EditProduct") {
                var shippingContent = jQuery("#Editshipping_classes").html();
                shippingContent += '<option value="none">none</option>';
                for (var i = 0; i < shipping_classesList.product_shipping_classes.length; i++) {
                    shippingContent += '<option value="' + shipping_classesList.product_shipping_classes[i].id + ',' + shipping_classesList.product_shipping_classes[i].name +
                        '">' + shipping_classesList.product_shipping_classes[i].name + '</option>';
                }
                jQuery("#Editshipping_classes").html(shippingContent);
            }
            myApp.hideProgressbar();
        }
    });
}


/***************************************************************************************************/
function GenerateAttributeObject() {
    var barcodeNumber = jQuery("#newProduct_Barcode").val();
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

function addNewAttribute() {
    myApp.modal({
        title: 'New Attribute',
        afterText: '<div class="swiper-container" style="width: auto; margin:5px -15px -15px">' +
            '<input id="NewAttributeName" type="text" placeholder="Name"/></br/>' +
            '<input id="NewAttributeValue" type="text" placeholder="Value"/>' +
            '</div>',
        buttons: [
            {
                text: 'Cancel'
      },
            {
                text: 'Add',
                bold: true,
                close: false,
                onClick: function () {
                    var NewAttributeName = jQuery("#NewAttributeName").val();
                    var NewAttributeValue = jQuery("#NewAttributeValue").val();
                    if ((NewAttributeName !== "") && (NewAttributeValue !== "")) {
                        var newAttRow = "";
                        newAttRow += '<div id="NewAttribute_' + NewAttributeRowCount + '" class="row no-gutter broder-bottom">';
                        newAttRow += '<div class="col-45"><b>' + NewAttributeName + '</b></div>';
                        newAttRow += '<div class="col-45">' + NewAttributeValue + '</div>';
                        newAttRow += '<div class="col-10"><i class="fa fa-minus-circle red-minus" aria-hidden="true" onclick="removeThisAtt(' + NewAttributeRowCount + ')"></i></div>';
                        newAttRow += '</div>';

                        oldAtt = jQuery("#NewAttributeList").html();

                        NewAttributeRowArray.push({
                            id: NewAttributeRowCount,
                            name: NewAttributeName,
                            value: NewAttributeValue
                        });
                        NewAttributeRowCount++;
                        jQuery("#NewAttributeList").html(oldAtt + newAttRow);

                        myApp.closeModal();
                    }

                }
      },
    ]
    });
}

function removeThisAtt(rowNum) {

    Object.keys(NewAttributeRowArray).forEach(function (key) {
        if (NewAttributeRowArray[key].id == rowNum) {
            delete NewAttributeRowArray[key];
        }
    });
    jQuery("#NewAttribute_" + rowNum).remove();
}

/*****************************************************/



function cleanuponSuccess() {
    //console.log("Camera cleanup success.")
}

function cleanuponFail(message) {
    // alert('cleanup Failed because: ' + message);
}