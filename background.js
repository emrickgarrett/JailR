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

    if(result.status == 1){


        if(result.records.length == 0){
            alert("No Record");
            return;
        }

        popup(result);



    }else{
        alert(result.msg);
    }
    //Display it somewhere in the browser...

}

function popup(result)
{
    var generator=window.open('','name','height=800,width=1000');

    generator.document.write('<html><head><title>Popup</title>');
    generator.document.write("<link rel='stylesheet' href='mystyle.css'></head><body>");

    generator.document.write("<table class='result-table'");
    for(var i = 0; i < result.records.length; i++){
        //alert(result.records[i].name);
        generator.document.write("<tr>");
        generator.document.write("<td><img class='mugshot'  src='" + result.records[i].mugshot + "'/></td>");
        generator.document.write("<td><span class='name'>" + result.records[i].name + "</span></td>");
        generator.document.write("<td><span class='county-state'>" + result.records[i].county_state +"</span></td>");
        generator.document.write("<td><span class='book-date'>" + result.records[i].book_date +"</span></td>");
        generator.document.write("<td><span class='charges'>" + result.records[i].charges + "</span></td>");
        generator.document.write("</tr>");
    }
    generator.document.write("</table>");
    generator.document.write('</body></html>');
    generator.document.close();
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