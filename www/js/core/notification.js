var notificationOpenedCallback = function (notify) {

 //   alert(JSON.stringify(notify));

    var addditionalData_ = notify.notification.payload.additionalData;
    if (addditionalData_.gopage == "CustomerPage") {
        fetchMyCustomer();
        activate_page("#CustomerPage");
        return false;
    }
    if (addditionalData_.gopage == "SingleOrder") {
        activate_page("#SingleOrder");
    //    alert(addditionalData_.orderId);
        getAOrder(addditionalData_.orderId);
        return false;
    }

    //  myApp.alert(JSON.stringify(notify));
    console.log('notificationOpenedCallback: ' + JSON.stringify(notify));
};

function initNotification() {
    if (NotificationActive == false) {

        window.plugins.OneSignal
            .startInit("efc93a62-8bd3-4549-8cb8-88cc8eb5d61a")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();

        window.plugins.OneSignal.getIds(function (ids) {
            NotificationActive = true;
            //  document.getElementById("OneSignalUserID").innerHTML = "UserID: " + ids.userId;
            //  document.getElementById("OneSignalPushToken").innerHTML = "PushToken: " + ids.pushToken;
            var urlAdd = HostURL + "wp-json/wooadmin/usersetting?userid=" + ids.userId+"&consumer_secret="+consumerSecret;
            $.ajax({
                type: "POST",
                url: urlAdd,
                dataType: 'json',
                async: true,
                cache: true,
                headers: {
                    "Authorization": "Basic " + btoa(wooKey)
                },
                success: function (dataList) {
                    //   myApp.alert(JSON.stringify(dataList));
                }
            });


            // myApp.alert('getIds: ' + JSON.stringify(ids));
        });
    }
}