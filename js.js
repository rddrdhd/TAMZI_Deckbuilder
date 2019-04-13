document.addEventListener('init', function(event) {

    var page = event.target;
    if (page.id === 'page1') {
        f_refresh_gest();

        page.querySelector('#butt_show_ds').onclick = function() {
            document.querySelector('#myNavigator').pushPage('page2.html');
        };
        page.querySelector('#butt_search_cs').onclick = function() {
            document.querySelector('#myNavigator').pushPage('page3.html');
        };
    }
    else if (page.id === 'page2') {
        f_show_ds();
        console.log("decks page!!!");
    }
    else if (page.id === 'page3') {
        f_search_cs();
        console.log("cards page!!!");
    }

});
function f_refresh_gest(){
    var pullHook = document.getElementById('pull-hook');



    pullHook.onAction = function(done) {
        location.reload();
    };
}

function f_create_d() {
    document.getElementById("dialog_create_d").show();
}

function f_create_d_cancel() {
    document.getElementById("dialog_create_d").hide();
}

function f_create_d_submit() {
    var myKey = new Date().getTime();
    var d_name = $('#text_name_d').val();
    var d_note = $('#text_note_d').val();
    var cards = [];
    if(d_name.length) {
        myObj = {
            name: d_name,
            note: d_note,
            cards: cards
        };
        myJSON=JSON.stringify(myObj);
        localStorage.setItem(myKey, myJSON);
    }
    console.log("DECK CREATED");
    document.getElementById("dialog_create_d").hide();
}

function f_show_ds(){
    $("#list_d").empty();
    for(var i = 0; i< localStorage.length; i++){
        var onsItem = document.createElement("ons-list-item");
        var myKey = localStorage.key(i);
        var json = localStorage.getItem(myKey);
        var parsed = JSON.parse(json);

        onsItem.setAttribute('modifier', 'tappable');
        onsItem.setAttribute('expandable', '');
        onsItem.innerHTML = "<b>"+parsed.name+"</b>";
        onsItem.innerHTML+="<div class=expandable-content>" +
            parsed.note + "<br>" + "</div>";
        //TODO nezobrazují se decky?!
        /*for(var c in parsed.cards){
            card= f_gimme_card(c);
            onsItem.innerHTML+="<img src='" +
                card.imageUrl+"' alt='Image is not avaible.'>";
        }*/
        document.getElementById('list_d').appendChild(onsItem)

    }
}

function f_search_cs(){
    var search_str = $('#text_search_cs').val();
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards?name=' + search_str,
        success: function(result){
            for(var i = 0; i< 10; i++){
                card = result["cards"][i];
                if(card.imageUrl !== undefined){
                    var onsItem = document.createElement("ons-list-item");

                    onsItem.setAttribute('modifier','tappable');
                    onsItem.setAttribute('expandable','');
onsItem.innerHTML="<b>"+card.name+"</b>&nbsp;("+card.set+")";
// onsItem.innerHTML+="<div class=expandable-content><i>"+card.text + "</i><br>Main color:" + card.colors[0];

                        onsItem.innerHTML+="<div class=expandable-content>" +
                            "<img src='" + card.imageUrl+"' alt='Image is not avaible.'>";
                            //+  f_gimme_html_pic(card.multiverseid);

                    onsItem.innerHTML+="<a id=\"myLink\" title=\"Click to do something\"\n" +
                        " href=\"#\" onclick=\"f_add_c("+card.multiverseid+");return false;\"><h2  class='add'>⊕</h2></a>"+
                        "</div>";
                    document.getElementById('list_c').appendChild(onsItem);
                    //if(card.name in (document.getElementsByTagName('ons-list-item'))){ }

                }
                }
        }
    })
}
function f_gimme_card(multiverseid){
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards/' + multiverseid,
        success: function(result){
            return result["card"];
        }
    });
}
function f_gimme_html_pic(multiverseid){ //TODO nefunguje v innerHTML^^^
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards/' + multiverseid,
        success: function(result){
            var card = result["card"];
            console.log("<img src='" +
                card.imageUrl + "' alt='Image is not avaible.'>");
            return "<img src='" +
                card.imageUrl + "' alt='Image is not avaible.'>";
        }
    });
}
function  f_add_c(multiverseid){

    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards/' + multiverseid,
        success: function(result){
                var card = result["card"];
    //deck selector
            for(var i = 0; i< localStorage.length; i++) {
                var myKey = localStorage.key(i);
                var json = localStorage.getItem(myKey);
                var parsed = JSON.parse(json);
                $('#select_d').append('<option value="'+myKey+'">'+parsed.name+'</option>');
            }
        }
    });
    document.getElementById("butt_add_c_submit").setAttribute('onclick', 'f_add_c_submit('+multiverseid+')');
    document.getElementById("dialog_add_c").show();
    }

function f_add_c_submit(multiverseid){
    var deck_key = $('#select_d').children("option:selected").val();
    console.log("Here we go addin da card "+multiverseid + " into " + deck_key);
    var deck = JSON.parse(localStorage.getItem(deck_key));
    deck.cards.push(multiverseid);
    localStorage[deck_key] = deck;
    var deck_JSON = JSON.stringify(deck);
    localStorage.setItem(deck_key, deck_JSON);

    console.log(deck);
    console.log(deck_JSON);
    document.getElementById("dialog_add_c").hide();
//TODO karty v localstorage az po aktualizaci???


}
function f_add_c_cancel(){
    console.log("Here we go closin da add_c dialog");
    document.getElementById("dialog_add_c").hide();
}