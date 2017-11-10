/*jshint browser:true */
/*global $ */

var myApp;

function escapeTut() {
    localStorage.setItem("seenTut", true);
    activate_page("#setting_page");
}

function OpenQRcodeReader() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            var resultArr = [];
            resultArr = result.text.split('|');

            jQuery("#Username").val(resultArr[0]);
            jQuery("#Username").focus();
            jQuery("#Password").val(resultArr[1]);
            jQuery("#Password").focus();
            //alert(result.text);
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
            formats: "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED 
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device 
            disableAnimations: false, // iOS 
            disableSuccessBeep: false // iOS 
        }
    );
}

function UrlCheck(url) {
    var reuslt = false;
    if ((url.search("http://") >= 0) || (url.search("https://") >= 0)) {

        if (url[url.length - 1] != "/") {
            url += "/";
            jQuery("#Store-URL").val(url);
        }

        reuslt = true;
    } else {
        reuslt = false;
        myApp.alert("bad Url", "Alert !!!");
    }

    return reuslt;

}

function rand(digits) {
    return Math.floor(Math.random() * parseInt('8' + '9'.repeat(digits - 1)) + parseInt('1' + '0'.repeat(digits - 1)));
}

function authentication(HostURL, consumerKey, consumerSecret) {
    var wooKey = consumerKey + ":" + consumerSecret;
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


    oauth_data.oauth_signature = oauthSignature.generate(request.method, request.url, oauth_data, oauth.consumer.secret);
    $.ajax({
        type: "GET",
        url: request.url + '?' + oauth.getParameterString(request, oauth_data),
        dataType: 'json',
        cache: true,
        headers: {
            "Authorization": "Basic " + btoa(wooKey)
        },
        success: function (Reuslt) {
            //  console.log(Reuslt);
            localStorage.setItem("StoreURL", HostURL);
            localStorage.setItem("Username", consumerKey);
            localStorage.setItem("Password", consumerSecret);

            window.location = "mainPage.html";
        },
        error: function (Reuslt) {
            myApp.alert("consumerKey or consumerSecret is worng \n\n try another ", "Error");
            // console.log(Reuslt);
        }
    });

}

function ConnectToWebSite() {
    var StoreURL = jQuery("#Store-URL").val();
    var Username = jQuery("#Username").val();
    var Password = jQuery("#Password").val();

    /*
        if (UrlCheck(StoreURL)) {
            authentication(StoreURL, Username, Password);
        }
    */

    /*
        StoreTitle = "gameotech";
        StoreURL = "http://localhost:8080/";
        Username = "ck_df8e1e22b30d595ce4a9df47c0ca025de57ae860";
        Password = "cs_341c68cfc854641892183b608593eae9eaf414d3";


        localStorage.setItem("StoreTitle", StoreTitle);
        localStorage.setItem("StoreURL", StoreURL);
        localStorage.setItem("Username", Username);
        localStorage.setItem("Password", Password);

        window.location = "mainPage.html";
    */

    StoreTitle = "gameotech";
    StoreURL = "http://gameotech.ir/";
    Username = "ck_63bf879a628130a11837483bfeb43a772dfe98e5";
    Password = "cs_f5549d6836fa44d880e0410d464835402c078741";
    localStorage.setItem("StoreTitle", StoreTitle);
    localStorage.setItem("StoreURL", StoreURL);
    localStorage.setItem("Username", Username);
    localStorage.setItem("Password", Password);
    window.location = "mainPage.html";

}

function changeLange() {
    var langSelect = jQuery("#app_lang").val();
    localStorage.setItem("lang", langSelect);
    translateReload(langSelect);
}

(function () {
    "use strict";
    /*
      hook up event handlers 
    */
    function register_event_handlers() {
        myApp = new Framework7({
            material: false,
            materialPageLoadDelay: 500,
            //  swipePanel: 'left',
            // swipeout: true,
            pushState: true,
            cacheDuration: 1000 * 60 * 10,
            fastClicks: true,
            cache: true,
            materialRipple: true,
            imagesLazyLoadSequential: true,
        });
        var $$ = Dom7;


        var seenTut = localStorage.getItem("seenTut");
        var StoreURL = localStorage.getItem("StoreURL");

        if (seenTut === null) {
            localStorage.setItem("seenTut", true);
            jQuery(".swiper-container").show();
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: 30
            });
        } else {
            if (StoreURL === null) {
                activate_page("#setting_page");
            } else {
                window.location = "mainPage.html";
            }

        }



        $(".mat-input").focus(function () {
            $(this).parent().addClass("is-active is-completed");
        });

        $(".mat-input").focusout(function () {
            if ($(this).val() === "")
                $(this).parent().removeClass("is-completed");
            $(this).parent().removeClass("is-active");
        })

    }
    document.addEventListener("app.Ready", register_event_handlers, false);
})();