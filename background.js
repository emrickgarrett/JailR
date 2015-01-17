/**
 * Created by Garrett on 1/17/2015.
 */
var seltext = null;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
    switch(request.message)
    {
        case 'setText':
            window.seltext = request.data;
            break;

        default:
            sendResponse({data: 'Invalid arguments'});
            break;
    }
});


function savetext(info,tab) {
    if (seltext) {
        alert("text=" + seltext);

        var firstName = seltext.substring(0, seltext.indexOf(" "));
        var lastName = seltext.substring(seltext.indexOf(" ") + 1, seltext.length);

        var searchQuery = confirmResults(firstName, lastName);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", searchQuery, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                alert(xhr.responseText);
                processResults(resp);
            }
        };
        xhr.send();
    }
}

function processResults(result){

    //Display it somewhere in the browser...

}

function confirmResults(firstName, lastName){


    return "http://www.jailbase.com/api/1/search/?first_name=" + firstName + "&last_name=" + lastName;
}

var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++)
{
    var context = contexts[i];
    chrome.contextMenus.create({"title": "Search For Criminal Records", "contexts":[context], "onclick": savetext});
}