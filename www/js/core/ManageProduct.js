var LockLoadProduct = false;
var CountLastLoadProduct = 0;

function fecthProductList() {
    CurrentPageState = "ProductList";
    abortAJAX();
    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
    myApp.showProgressbar(container, 'multi');

    var dataListGenrate = "";
    //jQuery(".productList").html("");

    var request = {
        url: HostURL + "wc-api/v3/products/",
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
    oauth_data["filter[limit]"] = ProductPagePerLimit;
    oauth_data["page"] = ProductListPage;
    if (categoryName) {
        oauth_data["filter[category]"] = categoryName;
    }
    if (searchKey) {
        oauth_data["filter[q]"] = searchKey;
    }

    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);

    //console.log(oauth.getParameterString(request, oauth_data));

    fecthProductListAJAX = $.ajax({
        type: "GET",
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        dataType: 'json',
        cache: true,
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (dataList) {
            //console.log(dataList);
            CountLastLoadProduct = dataList.products.length;
            for (var i = 0; i < dataList.products.length; i++) {
                dataListGenrate += generateProductRow(dataList.products[i]);
            }
            jQuery(".productList").html(dataListGenrate);
            myApp.hideProgressbar();
            fade($('#productList .card').eq(0));
            myApp.initImagesLazyLoad('.page');
            $$('div.lazy').trigger('lazy');
            LockLoadProduct = false;

            translateReload(appLang);
        }
    });

}

function generateProductRow(products) {
    var dataListGenrate = "";
    dataListGenrate += '<div class="card demo-card-header-pic">';
    dataListGenrate += '<div data-background="' + products.images[0].src + '" valign="bottom" class="card-header product-Title no-border product-img lazy lazy-fadein" onclick="fetchProductInfo(' + products.id + ')">';
    dataListGenrate += products.title + '</div>';
    dataListGenrate += '<div class="card-content">'
    dataListGenrate += '<div class="card-content-inner">';
    dataListGenrate += '<p  dir="auto">' + products.short_description + '</p>';
    dataListGenrate += "<hr/>";
    dataListGenrate += '<div class="row no-gutter">';
    dataListGenrate += '<div class="col-50" dir="auto" align="left"> ' + products.price_html + '</div>';
    if (products.stock_quantity) {
        dataListGenrate += '<div class="col-50" align="right"><b tkey="Quantity"></b> : ' + products.stock_quantity + '</div>';
    }

    dataListGenrate += '</div>';
    dataListGenrate += '</div></div>';

    dataListGenrate += '<div class="card-footer">';
    dataListGenrate += '<a href="#" class="link"><span tkey="Edit" onclick="loadEditProduct(' + products.id + ')"></span></a>';
    dataListGenrate += '<a href="#" class="link" onclick="deleteThisProduct(' + products.id + ')" ><span class="fa-remove fa" ></span> <span tkey="Trash"></span></a>';
    dataListGenrate += '</div></div>';

    return dataListGenrate;
}

function deleteThisProduct(productId) {

    myApp.confirm('', 'Are you sure?',
        function () {
            var request = {
                url: HostURL + "wp-json/wc/v2/products/" + productId,
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
                success: function (ProductJson) {
                    myApp.closemodal();
                    fecthProductList();
                }
            });

        },
        function () {

        }
    );
}

function deleteLastedProduct() {

    myApp.confirm('', 'Are you sure?',
        function () {

            var request = {
                url: HostURL + "wp-json/wc/v2/products/" + LastProductIds,
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
                type: request.method,
                url: request.url + '?' + oauth.getParameterString(request, oauth_data),
                dataType: 'json',
                cache: true,
                headers: {
                    "Authorization": "Basic " + btoa(wooKey)
                },
                success: function (ProductJson) {
                    myApp.closemodal();
                    window.history.back();
                    fecthProductList();
                }
            });


        },
        function () {

        }
    );
}


function fetchProductInfo(ProductID) {
    LastProductIds = ProductID;
    activate_page("#singleProductPage");

    jQuery.get("page/singleProduct.html", function (data) {
        jQuery("#singleProductPageContent").html(data);
        fillProductInfo(ProductID);
    }, 'html');

}

function fillProductInfo(ProductID) {
    abortAJAX();
    jQuery("#productLoadig").show();
    jQuery("#productImages").hide();
    jQuery("#productnavbar").hide();
    jQuery("#productnavbarpages").hide();

    var request = {
        url: HostURL + "wc-api/v3/products/" + ProductID,
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
    fillProductInfoAJAX = $.ajax({
        type: "GET",
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        dataType: 'json',
        cache: true,
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (ProductJson) {
            //console.log(ProductJson);
            var images = ProductJson.product.images;
            var imageRow = "";
            for (var i = 0; i < images.length; i++) {
                imageRow += '<div class="swiper-slide"><div class="swiper-zoom-container">';
                imageRow += "<img src='" + images[i].src + "' width='100%' >";
                imageRow += '</div></div>';

            }
            jQuery("#productImageGallery").html(imageRow);


            jQuery("#SingleProductHeader").html(ProductJson.product.title);

            jQuery("#Product_sku").html(ProductJson.product.sku);
            jQuery("#Product_price").html(ProductJson.product.price_html);
            jQuery("#Product_quantity").html(ProductJson.product.stock_quantity);
            jQuery("#Product_type").html(ProductJson.product.type);
            jQuery("#Product_status").html(ProductJson.product.status);
            jQuery("#Product_total_ordered").html(ProductJson.product.total_sales);

            var attributesList = "";
            for (var i = 0; i < ProductJson.product.attributes.length; i++) {
                //console.log(ProductJson.product.attributes);
                attributesList += '<li><div class="item-content"><div class="item-inner">';
                attributesList += '<div class="item-title label">' + ProductJson.product.attributes[i].name + '</div>';
                attributesList += '<div class="item-title">';

                for (var j = 0; j < ProductJson.product.attributes[i].options.length; j++) {
                    attributesList += '<b> ' + ProductJson.product.attributes[i].options[j] + '</b><br/>';
                }

                attributesList += '</div>';
                attributesList += '</div></div></li>';
            }
            jQuery("#product_attributes").html(attributesList);

            jQuery("#Product_weight").html(ProductJson.product.weight + " kg");
            jQuery("#Product_length").html(ProductJson.product.dimensions.length + " " + ProductJson.product.dimensions.unit);
            jQuery("#Product_width").html(ProductJson.product.dimensions.width + " " + ProductJson.product.dimensions.unit);
            jQuery("#Product_height").html(ProductJson.product.dimensions.height + " " + ProductJson.product.dimensions.unit);

            var CategoryList = "";
            for (var i = 0; i < ProductJson.product.categories.length; i++) {
                CategoryList += "<b>" + ProductJson.product.categories[i] + "</b>";

                if (ProductJson.product.categories.length > 1) {
                    if (i < ProductJson.product.categories.length - 1) {
                        CategoryList += ' <i class="fa fa-chevron-right" aria-hidden="true"></i> ';
                    }
                }
            }
            jQuery("#product_Category").html(CategoryList);

            jQuery("#product_description").html(ProductJson.product.description);
            jQuery("#product_short_description").html(ProductJson.product.short_description);

            var tags = "";
            for (var i = 0; i < ProductJson.product.tags.length; i++) {
                tags += '<div class="chip"><div class="chip-label">';
                tags += ProductJson.product.tags[i];
                tags += '</div></div>';
            }
            jQuery("#product_tags").html(tags);

            jQuery("#productLoadig").hide();
            jQuery("#productImages").show();
            jQuery("#productnavbar").show();
            jQuery("#productnavbarpages").show();


            var mySwiper = new Swiper('.swiper-container', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                // Disable preloading of all images
                preloadImages: true,
                // Enable lazy loading
                lazyLoading: true,
                zoom: true,
                height: 400,
                // If we need pagination
                pagination: '.swiper-pagination',

                // Navigation arrows
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',

                // And if we need scrollbar
                scrollbar: '.swiper-scrollbar',
            });


            translateReload(appLang);
        }
    });

}


function fetchProductReview() {
    abortAJAX();

    var request = {
        url: HostURL + "wc-api/v3/products/" + LastProductIds + "/reviews",
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
    fetchProductReviewAJAX = $.ajax({
        type: "GET",
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        dataType: 'json',
        cache: true,
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (reviewsList) {
            //console.log(reviewsList);
            jQuery("time.timeago").timeago();

            var reviewsRow = "";
            for (var i = 0; i < reviewsList.product_reviews.length; i++) {
                reviewsRow += '<div class="card"><div class="card-header">';
                reviewsRow += "<b>" + reviewsList.product_reviews[i].reviewer_name + "</b>";
                reviewsRow += "<span class='timeGray' >" + jQuery.timeago(reviewsList.product_reviews[i].created_at) + "</span><br/><hr/>";
                reviewsRow += StarRate(reviewsList.product_reviews[i].rating);
                reviewsRow += '</div>';
                reviewsRow += '<div class="card-content"><div class="card-content-inner" dir="auto">';
                reviewsRow += decodeURIComponent(reviewsList.product_reviews[i].review);
                reviewsRow += '</div></div>';
                reviewsRow += '<div class="card-footer">';
                reviewsRow += '<a href="#" class="link" onclick="ReplayReview('+reviewsList.product_reviews[i].id+')"><i class="fa fa-reply" aria-hidden="true"></i></a>';
                reviewsRow += '<a href="#" class="link" onclick="DeleteReview('+reviewsList.product_reviews[i].id+')"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                reviewsRow += '</div></div>';
            }
            jQuery("#reviewTabContent").html(reviewsRow);
        }
    });

}





function fetchProductOrder() {
    abortAJAX();
    jQuery("#ProductOrder").html("");


    var request = {
        url: HostURL + "wc-api/v3/products/" + LastProductIds + "/orders",
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
    fetchProductOrderAJAX = $.ajax({
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
            for (var i = 0; i < dataList.orders.length; i++) {
                dataListGenrate += '<div class="card" onclick="GoSingleOrder(' + dataList.orders[i].id + ')">';
                dataListGenrate += '<div class="card-header"><div>';
                dataListGenrate += '<b>' + dataList.orders[i].customer.first_name + ' ' + dataList.orders[i].customer.last_name + '<b><br/>';
                dataListGenrate += '<b>' + dataList.orders[i].status + '<b><br/>';
                dataListGenrate += '<div></div>';
                dataListGenrate += '<div class = "card-content" ><div class = "card-content-inner" >';
                dataListGenrate += '<b>Order ID :' + dataList.orders[i].id + '<b><br/>';
                dataListGenrate += '<b>' + dataList.orders[i].total + " " + echoCurrency(dataList.orders[i].currency) + '<b><br/>';
                dataListGenrate += '<b> Product : ' + dataList.orders[i].total_line_items_quantity + '<b><br/>';
                dataListGenrate += '</div></div><div class = "card-footer" >';
                dataListGenrate += dataList.orders[i].completed_at;
                dataListGenrate += '</div></div></div></div>';

            }
            jQuery("#ProductOrder").html(dataListGenrate);
        }
    });
}

function searhItProduct() {
    // event.preventDefault();
    if (event.keyCode == 13) {
        searchKey = jQuery("#productsearchInput").val();
        fecthProductList();
    }

}

function loadOhterProduct() {
    jQuery(".productList").scroll(function () {
        var divHeight = (jQuery(this).prop('scrollHeight') - jQuery(document).height()) - 200;
        var scrollPost = jQuery(this).scrollTop();
        if (scrollPost >= divHeight) {
            if (LockLoadProduct === false) {
                if (CountLastLoadProduct >= (10 * ProductListPage)) {
                    LockLoadProduct = true;
                    ProductListPage++;
                    fecthProductList();
                    ////console.log("load");
                }
            }

        }
    });
}


function showSearchProduct() {
    jQuery("#productListHeader").hide();
    jQuery("#productsearchHeader").show();
}

function hideSearchProduct() {
    jQuery("#productListHeader").show();
    jQuery("#productsearchHeader").hide();
}