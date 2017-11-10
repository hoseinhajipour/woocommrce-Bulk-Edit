function loadAppSetting() {
    
    jQuery.get("page/setting.html", function (data) {
        jQuery(".settingContent").html(data);
        jQuery(".settingContent").fadeOut(10);
        FaetchAppSetting();
        translateReload(appLang);
    }, 'html');


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

function FaetchAppSetting() {
    $(".mat-input").focus(function () {
        $(this).parent().addClass("is-active is-completed");
    });

    $(".mat-input").focusout(function () {
        if ($(this).val() === "")
            $(this).parent().removeClass("is-completed");
        $(this).parent().removeClass("is-active");
    });

    var StoreURL = localStorage.getItem("StoreURL");
    var Username = localStorage.getItem("Username");
    var Password = localStorage.getItem("Password");
    appLang = localStorage.getItem("lang");


    jQuery("#Store-URL").val(StoreURL);
    jQuery("#Store-URL").focus();
    jQuery("#Username").val(Username);
    jQuery("#Username").focus();
    jQuery("#Password").val(Password);
    jQuery("#Password").focus();
    jQuery("#Password").blur();
    jQuery("#app_lang").val(appLang);
    
    
     jQuery(".settingContent").fadeIn(100);
    
}

function removeSetting() {
    localStorage.removeItem("seenTut");
    localStorage.removeItem("StoreURL");
    localStorage.removeItem("Username");
    localStorage.removeItem("Password");
    localStorage.removeItem("lang");
    window.location = "index.html";
}

function saveSetting() {
    var StoreURL = jQuery("#Store-URL").val();
    var Username = jQuery("#Username").val();
    var Password = jQuery("#Password").val();
    var langSelect = jQuery("#app_lang").val();

    localStorage.setItem("StoreURL", StoreURL);
    localStorage.setItem("Username", Username);
    localStorage.setItem("Password", Password);
    localStorage.setItem("lang", langSelect);
    appLang = langSelect;

    myApp.addNotification({
        title: 'system Message',
        message: 'Setting Saved',
        closeIcon: true,
        closeOnClick: true,
        hold: 2000,
    });
    translateReload(appLang);
}