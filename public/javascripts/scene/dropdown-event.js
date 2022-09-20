window.closeDropdown = function() {
    console.log("closedropdown");
    var mydropdown = document.getElementById("mydropdown");
    mydropdown.emit('closedropdown');
    var myoptions = document.getElementById("myoptions");
    myoptions.emit('closedropdown');

}
window.openDropdown = function() {
    console.log("opendropdown");
    var mydropdown = document.getElementById("mydropdown");
    mydropdown.emit('opendropdown');
    var myoptions = document.getElementById("myoptions");
    myoptions.emit('opendropdown');

}