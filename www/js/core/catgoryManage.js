function fetchCaegory() {
    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return;
    myApp.showProgressbar(container, 'multi');

    var request = {
        url: HostURL + "wc-api/v3/products/categories",
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
        success: function (res) {
            ////console.log(res);
            categories = res.product_categories;
            var MainCatgoryList = "";
            categories.forEach(function (item) {
                if (item.parent == 0) {
                    MainCatgoryList += "<li style='display: none;'>";
                    MainCatgoryList += "<b>" + item.name + " (" + item.count + ") " + "</b>";
                    MainCatgoryList += '<i class="fa fa-pencil" aria-hidden="true"></i>';
                    MainCatgoryList += '<i class="fa fa-trash" aria-hidden="true"></i>';
                    MainCatgoryList += '<i class="fa fa-plus" aria-hidden="true"></i>';
                    MainCatgoryList += "</li>";
                }
            })

            jQuery("#MainCatgoryList").html(MainCatgoryList);

            fade($('#MainCatgoryList li').eq(0));
            myApp.hideProgressbar();
        }
    });




}

function loadCategory() {

    var container = $$('body');
    if (container.children('.progressbar, .progressbar-infinite').length) return;
    myApp.showProgressbar(container, 'multi');

    var request = {
        url: HostURL + "wc-api/v3/products/categories",
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
        success: function (res) {
            ////console.log(res);
            categories = res.product_categories;
            var MainCatgoryList = "";
            selectedCategory = [];
            selectedCategoryName = [];
            categories.forEach(function (item) {
                if (item.parent == 0) {
                    MainCatgoryList += '<div class="row no-gutter">';
                    MainCatgoryList += '<div class="col-80"  onclick="GenerateSubCategory(' + item.id + ')">';
                    MainCatgoryList += item.name + " (" + item.count + ") ";
                    MainCatgoryList += '</div>';
                    MainCatgoryList += '<div class="col-20" align="right"><i class="fa fa-check bluebtn" aria-hidden="true" onclick="selectThisCategory(' + item.id + ')"></i></div>';
                    MainCatgoryList += '</div><hr/>';
                }
            })

            jQuery("#CategoryListPopUp").html(MainCatgoryList);
            myApp.hideProgressbar();
        }
    });
}

function GenerateSubCategory(parentID) {
    selectedCategory.push(parentID);
    selectedCategoryName.push(getCategoryName(parentID));
    var MainCatgoryList = "";
    categories.forEach(function (item) {
        if (item.parent == parentID) {
            MainCatgoryList += '<div class="row no-gutter">';
            MainCatgoryList += '<div class="col-80"  onclick="GenerateSubCategory(' + item.id + ')">';
            MainCatgoryList += item.name + " (" + item.count + ") ";
            MainCatgoryList += '</div>';
            MainCatgoryList += '<div class="col-20" align="right"><i class="fa fa-check bluebtn" aria-hidden="true" onclick="selectThisCategory(' + item.id + ')"></i></div>';
            MainCatgoryList += '</div><hr/>';
        }
    })
    if (MainCatgoryList != "") {
        jQuery("#CategoryListPopUp").html(MainCatgoryList);
    }

}

function restCatgory() {
    var MainCatgoryList = "";
    selectedCategory = [];
    selectedCategoryName = [];
    categories.forEach(function (item) {
        if (item.parent == 0) {
            MainCatgoryList += '<div class="row no-gutter">';
            MainCatgoryList += '<div class="col-80"  onclick="GenerateSubCategory(' + item.id + ')">';
            MainCatgoryList += item.name + " (" + item.count + ") ";
            MainCatgoryList += '</div>';
            MainCatgoryList += '<div class="col-20" align="right"><i class="fa fa-check bluebtn" aria-hidden="true" onclick="selectThisCategory(' + item.id + ')"></i></div>';
            MainCatgoryList += '</div><hr/>';
        }
    })

    jQuery("#CategoryListPopUp").html(MainCatgoryList);
}

function getCategoryName(id) {
    var catName = "";
    categories.forEach(function (item) {
        if (item.id == id) {
            catName = item.name;
        }
    });
    return catName;
}

function selectThisCategory(ID) {
    myApp.closeModal(".popup-Category");

    if (CurrentPageState == "ProductList") {
        categoryName = getCategoryName(ID);
        fecthProductList();
    } else if (CurrentPageState == "newProduct") {
        selectedCategory.push(ID);
        selectedCategoryName.push(getCategoryName(ID));
        NewCetgoryArray = selectedCategory;
        var catRow = "";
        for (var i = 0; i < selectedCategoryName.length; i++) {
            catRow += selectedCategoryName[i];
            if (i < selectedCategoryName.length - 1) {
                catRow += ' <i class="fa fa-chevron-right" aria-hidden="true"></i> ';
            }
        }
        jQuery("#newProductSelectedCategory").html(catRow);
    }else if (CurrentPageState == "EditProduct") {
        jQuery("#EditProductSelectedCategory").html("");
        selectedCategory.push(ID);
        selectedCategoryName.push(getCategoryName(ID));
        NewCetgoryArray = selectedCategory;
        var catRow = "";
        for (var i = 0; i < selectedCategoryName.length; i++) {
            catRow += selectedCategoryName[i];
            if (i < selectedCategoryName.length - 1) {
                catRow += ' <i class="fa fa-chevron-right" aria-hidden="true"></i> ';
            }
        }
        jQuery("#EditProductSelectedCategory").html(catRow);
    }

}