function newReview() {

}

function ReplayReview(commentID) {
    myApp.prompt('','ReplayTo?', function (Content) {
        Content=encodeURIComponent(Content);
        $.ajax({
                type: "POST",
                url: HostURL + "wp-json/wooadmin/newcomment?pid=" + LastProductIds+ "&consumer_secret=" + consumerSecret+"&content="+Content+"&parent="+commentID,
                dataType: 'json',
                success: function (reviews) {
                    console.log(reviews);
                    fetchProductReview();
                }
            });
    });
}

function DeleteReview(commentID) {
    myApp.confirm('Are you sure?', "ALert",
        function () {
            $.ajax({
                type: "POST",
                url: HostURL + "wp-json/wooadmin/removecomment?id=" + commentID + "&consumer_secret=" + consumerSecret,
                dataType: 'json',
                success: function (reviews) {
                    console.log(reviews);
                    fetchProductReview();
                }
            });
        },
        function () {}
    );
}