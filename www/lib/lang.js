var langs = ['en', 'fa'];
var langCode = '';
var langJS = null;


var translate = function (jsdata) {
    $("[tkey]").each(function (index) {
        var strTr = jsdata[$(this).attr('tkey')];
        $(this).html(strTr);
    });
}

function translateReload(getLang) {
    if (getLang == null) {
         $.getJSON('/lib/lang/en.json', translate);
    } else {
        langCode = getLang;
         $.getJSON('lib/lang/' + langCode + '.json', translate);
    }
}

translateReload();
