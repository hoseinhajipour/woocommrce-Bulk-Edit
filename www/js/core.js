//var HostURL="http://5.73.56.6:8080/";
//var HostURL="http://localhost:8080/";
//var wooKey="ck_bba1b1d7c10098855ecc85fd8aac59e32e13e1cb:cs_b12cc852fd87c482ba93034efd12f302e0e5d177";

//var HostURL = "http://gameotech.ir/";
//var wooKey = "ck_1cd9e43b5d8b45adc5f8101dcdc0a01a001a51dd:cs_b0ee96d3bdc5608316fc15f04929605cd4ce7a37";

var HostURL;
var wooKey;
var consumerKey;
var consumerSecret;
var LastOrderID;
var LastCustomerInfo;
var LastCustomerId;


var ProductPagePerLimit = 10;
var ProductListPage = 1;
var LastProductIds;
/********************* search ****************************************/
var categoryName;
var searchKey;
/*********************************************************************/
var fecthProductListAJAX;
var fillProductInfoAJAX;
var fetchProductReviewAJAX;
var fetchProductOrderAJAX;
/*********************************************************************/
var CurrentPageState = "dashboard";

/**************************** categories *****************************************/
var categories;
var selectedCategory = [];
var selectedCategoryName = [];
var NewCetgoryArray = [];
/*********************************************************************/
var appLang = "en";
var NotificationActive=false;

$.ajaxQ = (function () {
    var id = 0,
        Q = {};

    $(document).ajaxSend(function (e, jqx) {
        jqx._id = ++id;
        Q[jqx._id] = jqx;
    });
    $(document).ajaxComplete(function (e, jqx) {
        delete Q[jqx._id];
    });

    return {
        abortAll: function () {
            var r = [];
            $.each(Q, function (i, jqx) {
                r.push(jqx._id);
                jqx.abort();
            });
            return r;
        }
    };

})();

function abortAJAX() {
    /*
        if (fecthProductListAJAX) {
            fecthProductListAJAX.abort();
        }
        if (fillProductInfoAJAX) {
            fillProductInfoAJAX.abort();
        }
        if (fetchProductReviewAJAX) {
            fetchProductReviewAJAX.abort();
        }
        if (fetchProductOrderAJAX) {
            fetchProductOrderAJAX.abort();
        }
        */
    $.ajaxQ.abortAll();
}

/*********************************************************************/
function fade(ele) {
    ele.fadeIn(100, function () {
        var nxt = ele.next();
        if (nxt.length)
            fade(nxt);
    });
}

function echoCurrency(currency) {
    var currencyName = "";
    if (currency == "IRT") {
        currencyName = "تومان";
    }
    if (currency == "IRR") {
        currencyName = "ریال";
    }

    return (currencyName);
}

function StarRate(rate) {
    var starRow = "";
    for (var i = 0; i < rate; i++) {
        starRow += '<img src="img/star-icon-tiny.png">';
    }
    return starRow;
}

/**************************************************************/
function getRandomId(length) {
    if (!length) {
        return '';
    }

    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let array;

    if ('Uint8Array' in self && 'crypto' in self && length <= 65536) {
        array = new Uint8Array(length);
        self.crypto.getRandomValues(array);
    } else {
        array = new Array(length);

        for (let i = 0; i < length; i++) {
            array[i] = Math.floor(Math.random() * 62);
        }
    }

    for (let i = 0; i < length; i++) {
        result += possible.charAt(array[i] % 62);
    }

    return result;
}

function rand(digits) {
    return Math.floor(Math.random() * parseInt('8' + '9'.repeat(digits - 1)) + parseInt('1' + '0'.repeat(digits - 1)));
}

function loadHostInfo() {



    HostURL = localStorage.getItem("StoreURL");
    consumerKey = localStorage.getItem("Username");
    consumerSecret = localStorage.getItem("Password");
    wooKey = localStorage.getItem("Username") + ":" + localStorage.getItem("Password");
    appLang = localStorage.getItem("lang")
/*

    HostURL = "http://localhost:8080/";
    consumerKey = "ck_df8e1e22b30d595ce4a9df47c0ca025de57ae860";
    consumerSecret = "cs_341c68cfc854641892183b608593eae9eaf414d3";
    wooKey = consumerKey + ":" + consumerSecret;
*/


    jQuery(".dashboardContent").fadeOut(0);
    fetchDashboardReport();
}