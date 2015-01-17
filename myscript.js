/**
 * Created by Garrett on 1/17/2015.
 */
document.addEventListener('mouseup',function(event) {
    var sel = window.getSelection().toString();

    if (sel.length)
        chrome.extension.sendRequest({'message': 'setText', 'data': sel}, function (response) {
        });
    else if (event.which == 3) {
        if (event.target.innerHTML.length) {
            chrome.extension.sendRequest({'message': 'setText', 'data': event.target.innerHTML}, function (response) {
            });
        }
    }
});

$(function() {
    $( document ).tooltip();
});