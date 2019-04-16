//caiuse.com - hledá co můžu na jaké prohlížeči použít
//INFINITESCROLL na výsledky hledání karet

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
        deck_expand(onsItem,parsed);
        document.getElementById('list_d').appendChild(onsItem)

    }
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function deck_expand(onsItem, deck){
    var imgstring = "";
    for(var c in deck.cards){
        var card= f_gimme_card(deck.cards[c]);
        imgstring= (imgstring+"<a href='" +
            "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid="+
            deck.cards[c]+"&type=card"+"'>"+
            "<img src='" +
            "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid="+
            deck.cards[c]+"&type=card"+
            "' alt='Image is not avaible.'"+
            " class='responsive'></a>");
    }
    onsItem.innerHTML = "<b>"+deck.name+"</b>";
    onsItem.innerHTML+="<div class=expandable-content>" +
        deck.note + "<br>"
+imgstring

        + "</div>";

}

function f_search_cs(){
    var search_str = $('#text_search_cs').val();
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards?name=' + search_str,
        success: function(result){
            for(var i = 0; i< 10; i++){
                var card = result["cards"][i];
                if(card.imageUrl !== undefined){
                    var onsItem = document.createElement("ons-list-item");

                    onsItem.setAttribute('modifier','tappable');
                    onsItem.setAttribute('expandable','');
card_expand(onsItem, card);
                    document.getElementById('list_c').appendChild(onsItem);

                }
                }
        }
    })
}
function card_expand(onsItem, card){
//card_name
    onsItem.innerHTML="<b>"+card.name+"</b>&nbsp;("+card.set+")";
//image
    onsItem.innerHTML+="<div class=expandable-content>" +
        "<img src='" + card.imageUrl+"' alt='Image is not avaible.'>"+
//add card
        "<a id=\"myLink\" title=\"Click to add card\"\n" +
        " href=\"#\" onclick=\"f_add_c("+card.multiverseid+");return false;\"><h2  class='add'>⊕ Add card</h2></a>"

//end div
        +"</div>" ;
}
//TODO nefunguje
function f_gimme_card(multiverseid) {
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards/' + multiverseid,
        success: function (result) {
            return result["card"];
        }
    });
}
function f_gimme_html_pic(multiverseid){ //TODO funguje pomalu jak cyp
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
// karty v localstorage az po aktualizaci???
    location.reload();


}
function f_add_c_cancel(){
    console.log("Here we go closin da add_c dialog");
    document.getElementById("dialog_add_c").hide();
}


function f_refresh_gest(){
    console.log("Here we go refreshing da page");
    var pullHook = document.getElementById('pull-hook');
    pullHook.onAction = function(done) {
        location.reload();
    };
}