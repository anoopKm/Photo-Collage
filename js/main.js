function addToWorkSpace(e){
    e.stopPropagation();
    var targetele = e.target.parentElement.parentElement;
    $(e.target.parentElement).append('<div class=" rotable ui-rotatable-handle ui-draggable"></div>');
    $('#workspace').append(targetele);
    $(".resizable","#workspace").resizable({
        aspectRatio: true,
        handles: 'ne, se, sw, nw'
    });
    $(".draggable","#workspace").draggable();
    $(targetele).on('click',function(e) {
        $(targetele).focus();
        $(this).off(e);
    });

    var RAD2DEG = 180 / Math.PI;
    var offset, draggingFlag=false;
   
    
    $('.rotable',targetele).mousedown(function(e) {
        e.stopPropagation();
        targetele.centerX = $(targetele).offset().left + $(targetele).width()/2;
        targetele.centerY =  $(targetele).offset().top + $(targetele).height()/2;
        draggingFlag = true;
        offset = Math.atan2(targetele.centerY - e.pageY, e.pageX - targetele.centerX);
    })
    $(document).mouseup(function() {
        draggingFlag = false
    })
    $(document).mousemove(function(e) {
        if (draggingFlag) { 
            var newOffset = Math.atan2(targetele.centerY - e.pageY, e.pageX - targetele.centerX);
            var r = (offset - newOffset) * RAD2DEG;
            $(targetele).css('-webkit-transform', 'rotate(' + r + 'deg)');
        }
    })
}

function deleteImg(e){
    if(e.which == 127){
        var targetele = e.target.parentElement.parentElement;
        $('#workspace').append(targetele);
    }
}

if(window.FileReader) { 
  window.addEventListener('load', function() {
    function cancel(e) {
        if (e.preventDefault) { e.preventDefault(); }
        return false;
    }
    document.body.addEventListener('dragover', cancel, false);
    document.body.addEventListener('dragenter', cancel, false);
    document.body.addEventListener('drop', droppedImage, false);
    }, false);
} 
else { 
    document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
}

function droppedImage(e)
{
    e.preventDefault();
    var dt    = e.dataTransfer;
    var files = dt.files;
    for (var i=0; i<files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('loadend', function(e, file) {
            var bin = this.result; 
            var divWrapper =document.createElement("div");
            $(divWrapper).attr("class", "resizable");
            var divPWrapper =document.createElement("div");
            $(divPWrapper).attr("class", "draggable");
            
            var img = document.createElement("img"); 
            img.file = file;   
            img.src = bin;
            $(divWrapper).append(img);
            $(divPWrapper).append(divWrapper);
            $('#uploadedImg').append(divPWrapper);
                
            $(img).attr("draggable", "false");
            $(divPWrapper).attr("tabindex", "0");
            $(img).one('click',addToWorkSpace);
            $(divPWrapper).keydown(function(e) {
                if(e.which == 46){
                    $(e.target).remove();
                }
            });    
        }.bindToEventHandler(file), false);
    }
    return false;
}

Function.prototype.bindToEventHandler = function bindToEventHandler() {
    var handler = this;
    var boundParameters = Array.prototype.slice.call(arguments);
    return function(e) {
        e = e || window.event;
        boundParameters.unshift(e);
        handler.apply(this, boundParameters);
    }
};