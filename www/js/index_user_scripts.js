/*jshint browser:true */
/*global $ */
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
        loadHostInfo();

        /* button  Button */
        $(document).on("click", ".uib_w_2", function (evt) {
            uib_sb.toggle_sidebar($("#MenuSideBar"));
            // myApp.openPanel('left');
            return false;
        });


        /* button  Create Product */
        $(document).on("click", ".CreateProduct", function (evt) {
            CreateNewProduct();
            return false;
        });

        /* button  Product List */
        $(document).on("click", ".goProductListPage", function (evt) {
            /*global activate_page */
            activate_page("#productListPage");
            categoryName = null;
            searchKey = "";
            fecthProductList();
            return false;
        });

        /* button  add new Product */
        $(document).on("click", ".GOCreateProductPage", function (evt) {
            /*global activate_page */
            activate_page("#newProductPage");
            loadNewProductContentField();
            return false;
        });

        /* button  back new order */
        $(document).on("click", ".uib_w_23", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });

        /* button  .uib_w_24 */
        $(document).on("click", ".uib_w_24", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            fetchDashboardReport();
            return false;
        });

        /* button  new */
        $(document).on("click", ".uib_w_18", function (evt) {
            /*global activate_page */
            activate_page("#NewOrderPage");
            return false;
        });

        /* button  Order List */
        $(document).on("click", ".uib_w_9", function (evt) {
            /*global activate_page */
            fetchOrderList();
            return false;
        });

        /* button  Sales */
        $(document).on("click", ".uib_w_15", function (evt) {
            /*global activate_page */
            activate_page("#SalePage");
            goSaleReportPage();
            return false;
        });

        /* button  Top Sellers */
        $(document).on("click", ".uib_w_16", function (evt) {
            /*global activate_page */
            activate_page("#TopSalePage");
            goTopSaleReportPage();
            return false;
        });

        /* button  back sale */
        $(document).on("click", ".uib_w_30", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });

        /* button  back top sale */
        $(document).on("click", ".uib_w_32", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });

        /* button  back from new product */
        $(document).on("click", ".uib_w_11", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });

        /* button  back from product list */
        $(document).on("click", ".BackFromProductListPage", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });

        /* button  #pimageAdd */
        $(document).on("click", "#pimageAdd", function (evt) {
            /* your code goes here */
            appendImageProduct();

            return false;
        });

        /* button  #backfromsingleorder */
        $(document).on("click", "#backfromsingleorder", function (evt) {
            /*global activate_page */
            //activate_page("#OrderListPage");
            window.history.back();
            return false;
        });

        /* button  #backfromcatgory */
        $(document).on("click", "#backfromcatgory", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });


        $(document).on("click", ".GoCustomerPage", function (evt) {
            fetchMyCustomer();
            activate_page("#CustomerPage");
            return false;
        });

        $(document).on("click", ".GoCategoryPage", function (evt) {
            fetchCaegory();
            activate_page("#CategoryPage");
            return false;
        });

        $(document).on("click", ".productListorder", function (evt) {
            jQuery("#productListOrder").show();
            jQuery("#orderDtialPage").hide();
            jQuery("#orderNotePage").hide();

            jQuery(".productListorder").removeClass("active");
            jQuery(".orderDtial").removeClass("active");
            jQuery(".orderNote").removeClass("active");

            jQuery(".productListorder").addClass("active");
            jQuery("#orderFoooterInfo").show();
            jQuery("#orderChat").hide();
            return false;
        });
        $(document).on("click", ".orderDtial", function (evt) {
            jQuery("#orderDtialPage").show();
            jQuery("#productListOrder").hide();
            jQuery("#orderNotePage").hide();

            jQuery(".productListorder").removeClass("active");
            jQuery(".orderDtial").removeClass("active");
            jQuery(".orderNote").removeClass("active");

            jQuery(".orderDtial").addClass("active");

            jQuery("#orderFoooterInfo").show();
            jQuery("#orderChat").hide();

            return false;
        });
        $(document).on("click", ".orderNote", function (evt) {
            jQuery("#orderNotePage").show();
            jQuery("#orderDtialPage").hide();
            jQuery("#productListOrder").hide();

            jQuery(".productListorder").removeClass("active");
            jQuery(".orderDtial").removeClass("active");
            jQuery(".orderNote").removeClass("active");

            jQuery(".orderNote").addClass("active");

            jQuery("#orderFoooterInfo").hide();
            jQuery("#orderChat").show();
            fetchOrderNote();
            return false;
        });


        /* button  back from customer page */
        $(document).on("click", ".uib_w_49", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });

        /* button  back from profile */
        $(document).on("click", ".uib_w_51", function (evt) {
            /*global activate_page */
            //activate_page("#CustomerPage");
            window.history.back();
            return false;
        });

        $(document).on("click", ".backFromSingleProudct", function (evt) {
            // Initialize App  
            //activate_page("#productListPage");
            window.history.back();
            return false;
        });

        /* button  backfromsetting */
        $(document).on("click", ".uib_w_53", function (evt) {
            /*global activate_page */
            activate_page("#mainpage");
            return false;
        });

        $(document).on("click", "#goAppSettingPage", function (evt) {
            /*global activate_page */
            activate_page("#setting_page");
            loadAppSetting();
            return false;
        });



        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].onclick = function () {
                /* Toggle between adding and removing the "active" class,
                to highlight the button that controls the panel */
                this.classList.toggle("active");

                /* Toggle between hiding and showing the active panel */
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            }
        }
        $$('.panel-close').on('click', function (e) {
            uib_sb.toggle_sidebar($("#MenuSideBar"))
        });



    }
    document.addEventListener("app.Ready", register_event_handlers, false);
})();