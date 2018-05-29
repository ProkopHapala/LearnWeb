* https://stackoverflow.com/questions/2048026/open-file-dialog-box-in-javascript﻿
* https://stackoverflow.com/questions/11336663/how-to-make-a-browser-display-a-save-as-dialog-so-the-user-can-save-the-conten
* https://github.com/koffsyrup/FileSaver.js
* https://stackoverflow.com/questions/25547475/save-to-local-file-from-blob
* https://stackoverflow.com/questions/2048026/open-file-dialog-box-in-javascript
* https://stackoverflow.com/questions/6463439/how-to-open-a-file-browse-dialog-using-javascript
* https://w3c.github.io/FileAPI/

* /home/prokop/Dropbox/MyDevSW/javascript/load_text/fileIO


* try to load package from cdn; if failed load it from local
   https://stackoverflow.com/questions/1014203/best-way-to-use-googles-hosted-jquery-but-fall-back-to-my-hosted-library-on-go
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
<script>
   window.jQuery || document.write('<script src="/path/to/your/jquery"><\/script>');
</script>
```

```
function makeDownloadableFile( text, id, fname ){
    type  = 'text/plain';
    var a = document.getElementById( id );
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = fname;
}
```
