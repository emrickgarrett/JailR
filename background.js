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
        //alert("text=" + seltext);

        //TODO
        //replace with Black Book api thing (check commit message)

        var firstName = seltext.substring(0, seltext.indexOf(" "));
        var lastName = seltext.substring(seltext.lastIndexOf(" ") + 1, seltext.length);

        var searchQuery = confirmResults(firstName, lastName);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", searchQuery, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {

                var resp = JSON.parse(xhr.responseText);
               //alert(xhr.responseText);
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
    var generator=window.open('','name','height=600,width=800');

    generator.document.write('<html><head><title>Popup</title>');
    generator.document.write("<link rel='stylesheet' href='mystyle.css'></head><body>");

    //generator.document.write("<div style='text-align:center;'><span class='header'>Results:</span></div>");
    generator.document.write("<div class='result-content'> <table class='result-table'");
    for(var i = 0; i < result.records.length; i++){
        if((i % 4 == 0 && i != 0) || i == result.records.length - 1)
            generator.document.write("</tr>");
        if(i % 4 == 0)
            generator.document.write("<tr>");

        var tooltip = "";
        tooltip += "Name: " + result.records[i].name;
        tooltip += "\nCounty/State: " + result.records[i].county_state;
        tooltip += "\nBooking Date: " + result.records[i].book_date;
        tooltip += "\nCharges: " + result.records[i].charges;

        generator.document.write("<td><a href='" + result.records[i].mugshot + "'><img title='" + tooltip + "' class='mugshot opacity'  src='" + result.records[i].mugshot + "'/></a></td>");


    }
    generator.document.write("</table></div>");

    if(result.records.length >= 12){
        generator.document.write("<div class='arrows'><a><span class='arrow-text-left'> < Previous </span></a><a><span class='arrow-text-right'> Next > </span></a></div>")

    }

    generator.document.write('</body></html>');
    generator.document.close();
}

function confirmResults(firstName, lastName){

    //TODO
    //replace with Black Book API (See commit Message)

    var result = prompt("Enter in their First Name, Then Second Name separated by a space.", firstName + " " + lastName);

    firstName = result.substring(0, result.indexOf(" "));
    lastName = result.substring(result.lastIndexOf(" ")+1, result.length);

    return "http://www.jailbase.com/api/1/search/?first_name=" + firstName + "&last_name=" + lastName;
}

var contexts = ["selection", "page", "link"];
for (var i = 0; i < contexts.length; i++)
{
    var context = contexts[i];
    chrome.contextMenus.create({"title": "Search For Criminal Records", "contexts":[context], "onclick": savetext});
}