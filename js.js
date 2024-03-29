
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
    }
    else if (page.id === 'page3') {
        f_search_cs();
    }

});

function f_delete_deck(deckkey){
    ons.notification.confirm({
        message: 'Do you want to delete deck \"'+deckkey+'\"?',
        callback: function(answer) {

            //console.log(deckkey.toString());
            localStorage.removeItem(deckkey);
            location.reload();
           /* for(var key in localStorage){
                var i = localStorage.getItem(key);
                var item = JSON.parse(i);

                if(item.name === thisaf.toString()){
                    console.log("DING DING DING");
                    localStorage.removeItem(key);
                    location.reload();
                }
                else{ console.log("nope") }
            }*/
        }
    });
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
    //console.log("DECK CREATED");
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
        onsItem.setAttribute('data-key', myKey.toString());
        deck_expand(onsItem,parsed, myKey);
        document.getElementById('list_d').appendChild(onsItem)
    }
}

function deck_expand(onsItem, deck, deckkey){
    var imgstring = "";
    for(var c in deck.cards){
//card image with a href
        imgstring= (imgstring+
            "<img onclick='f_show_c("+deck.cards[c]+","+deckkey+")' src='" +
            "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid="+
            deck.cards[c]+"&type=card"+
            "' alt='Image is not avaible.'"+
            " class='responsive'></a>");
    }

    onsItem.innerHTML = "<b>"+deck.name+"</b>";
    onsItem.innerHTML+="<div class=expandable-content>" +
        deck.note + "<br>" +
       // "<ons-button modifier='quiet' onclick='f_gimme_deck_stats("+deck+")'>Deck status \""+deck.name+"\"</ons-button><br>"+
        imgstring + "<br>"+
        "<ons-button modifier='quiet' onclick='f_delete_deck("+deckkey+")'>Delete deck \""+deck.name+"\"</ons-button><br>"+


       "</div>";
}

function f_search_cs(){
    var search_str = $('#text_search_cs').val();
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards?name=' + search_str,
        success: function(result){
            for(var i = 0; i< 20; i++){
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
        "<img src='" + card.imageUrl+"' alt='"+card.name+"("+card.type+")'><br>"+
//add card
       /* "<a id=\"myLink\" title=\"Click to add card\"\n" +
        " href=\"#\" onclick=\"f_add_c("+card.multiverseid+");return false;\">"+
        "<h2  class='add'>⊕ Add card</h2></a>"+*/
       "<ons-button modifier='quiet' onclick='f_add_c("+card.multiverseid+")'>ADD CARD TO DECK</ons-button>"
        //
//end div
        +"</div>" ;
}

function f_gimme_card(multiverseid) {
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards/' + multiverseid,
        success: function (result) {
            return result["card"];
        }
    });
}

function f_gimme_html_pic(multiverseid){ //funguje hodne pomalu
    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards/' + multiverseid,
        success: function(result){
            var card = result["card"];
            //console.log("<img src='" + card.imageUrl + "' alt='Image is not avaible.'>");
            return "<img src='" +
                card.imageUrl + "' alt='Image is not avaible.'>";
        }
    });
}

function f_add_c(multiverseid){

    var jqxhr = $.ajax({
        dataType: "json",
        url: 'https://api.magicthegathering.io/v1/cards/' + multiverseid,
        success: function(result){
                var card = result["card"];
    //deck selector
            deck_selector('#select_d');
        }
    });
    document.getElementById("butt_add_c_submit").setAttribute('onclick', 'f_add_c_submit('+multiverseid+')');
    document.getElementById("dialog_add_c").show();

    }

function deck_selector(element_id){
        for(var i = 0; i< localStorage.length; i++) {
            var myKey = localStorage.key(i);
            var json = localStorage.getItem(myKey);
            var parsed = JSON.parse(json);
            $(element_id).append('<option value="'+myKey+'">'+parsed.name+'</option>');
        }
    }

function f_add_c_submit(multiverseid){
    var deck_key = $('#select_d').children("option:selected").val();
    //console.log("Here we go addin da card "+multiverseid + " into " + deck_key);
    var deck = JSON.parse(localStorage.getItem(deck_key));
    deck.cards.push(multiverseid);
    localStorage[deck_key] = deck;
    var deck_JSON = JSON.stringify(deck);
    localStorage.setItem(deck_key, deck_JSON);

    //console.log(deck);
    //console.log(deck_JSON);
    document.getElementById("dialog_add_c").hide();

    location.reload();


}

function f_add_c_cancel(){
    //console.log("Here we go closin da add_c dialog");
    document.getElementById("dialog_add_c").hide();
}

function f_refresh_gest(){
   // console.log("Here we go refreshing da page");
    var pullHook = document.getElementById('pull-hook');
    pullHook.onAction = function(done) {
        location.reload();
    };
}

function f_show_c(multiverseid, deckkey){

    //console.log(multiverseid+","+deckkey+" f_show_c");
    var imageurl = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid="+ multiverseid+"&type=card";
    var modal = document.querySelector('ons-modal');
    modal.innerHTML = "<br><br><br><div class='center'><img src='" + imageurl+"' alt='Somenthing gone wrong' width='90%'><!--font color='#f0f8ff'> Loading...</font--> </div>";

    modal.innerHTML += "<ons-button onclick='f_delete_card("+multiverseid+","+deckkey+")' modifier='quiet'>Delete card from this deck</ons-button>";
    modal.innerHTML += "<br><br><br><ons-back-button modifier='material' onclick='f_hide_c()'>Back</ons-back-button>";
    modal.show();
    //location.reload();
}

function f_delete_card(multiverseid, deckkey){
   // console.log(multiverseid+","+deckkey+"delet card");
    var deck = JSON.parse(localStorage.getItem(deckkey));
    deck.cards.pop(multiverseid);
    //localStorage[deckkey]=deck;
    var deck_JSON = JSON.stringify(deck);
    localStorage.setItem(deckkey,deck_JSON);
    location.reload();


}

function f_hide_c(){
    document.getElementById('ons-modal').hide();
}

function f_show_ie(){
    deck_selector('#select_d_export');
document.getElementById('generated_deck').style.visibility='hidden';
document.getElementById('butt_copy').style.visibility='hidden';
    document.getElementById('dialog_ie').show();
}

function f_import_d(){
    console.log("importing deck");
    var myKey = new Date().getTime();
    var deck_string = $('#text_import').val();
    var deck=deck_string.split(';');
    var c=deck[2].split(',');
        myObj = {
            name: deck[0],
            note: deck[1],
            cards: c
        };
        myJSON=JSON.stringify(myObj);
        localStorage.setItem(myKey, myJSON);
        location.reload();
}

function f_export_d(){
    console.log("exporting deck");
    var deck_key = $('#select_d_export').children("option:selected").val();
    var generated = document.getElementById('generated_deck');
    var deck =JSON.parse(localStorage.getItem(deck_key));
    generated.value= deck.name+";"+deck.note+";"+deck.cards;

    document.getElementById('generated_deck').style.visibility='visible';
    document.getElementById('butt_copy').style.visibility='visible';
}

function f_hide_ie(){

    document.getElementById('dialog_ie').hide();
}

function f_copy(){
    const copyInput = document.querySelector('#generated_deck');
    const copyButton = document.querySelector('#butt_copy');
    copyButton.addEventListener('click', () => {

        // Je podpora pro execCommand('copy') ?
        if (document.queryCommandSupported('copy')) {

            // Vybere text uvnitř inputu
            copyInput.select();
            // Zkopíruje vybraný text
            const isCopied = document.execCommand('copy');
            console.log('Copying was ' + (isCopied ? '' : 'not ') + 'succesful.')

        }

    })
}

function f_download(){
    //všechno?
}