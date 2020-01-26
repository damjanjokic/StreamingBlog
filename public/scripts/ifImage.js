
var isUriImage = function(uri) {
    //make sure we remove any nasty GET params 
    uri = uri.split('?')[0];
    //moving on, split the uri into parts that had dots before them
    var parts = uri.split('.');
    //get the last part ( should be the extension )
    var extension = parts[parts.length-1];
    //define some image types to test against
    var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp'];
    //check if the extension matches anything in the list.
    if(imageTypes.indexOf(extension) !== -1) {
        return true;   
    }
}

module.exports = isUriImage;