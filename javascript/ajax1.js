//script by http://www.yvoschaap.com

//XMLHttpRequest class function
function datosServidor() {
};
datosServidor.prototype.iniciar = function() {
    try {
        // Mozilla / Safari
        this._xh = new XMLHttpRequest();
    } catch (e) {
        // Explorer
        var _ieModelos = new Array(
        'MSXML2.XMLHTTP.5.0',
        'MSXML2.XMLHTTP.4.0',
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP',
        'Microsoft.XMLHTTP'
        );
        var success = false;
        for (var i=0;i < _ieModelos.length && !success; i++) {
            try {
                this._xh = new ActiveXObject(_ieModelos[i]);
                success = true;
            } catch (e) {
            }
        }
        if ( !success ) {
            return false;
        }
        return true;
    }
}

datosServidor.prototype.ocupado = function() {
    estadoActual = this._xh.readyState;
    return (estadoActual && (estadoActual < 4));
}

datosServidor.prototype.procesa = function() {
    if (this._xh.readyState == 4 && this._xh.status == 200) {
        this.procesado = true;
    }
}

datosServidor.prototype.enviar = function(urlget,datos) {
    if (!this._xh) {
        this.iniciar();
    }
    if (!this.ocupado()) {
        this._xh.open("GET",urlget,false);
        this._xh.send(datos);
        if (this._xh.readyState == 4 && this._xh.status == 200) {
            return this._xh.responseText;
        }
        
    }
    return false;
}


var urlBase = "update.php";
var formVars = "";
var changing = false;


function fieldEnter(campo,evt,idfld) {
    evt = (evt) ? evt : window.event;
    if (evt.keyCode == 13 && campo.value!="") {
        elem = document.getElementById( idfld );
        remotos = new datosServidor;
        nt = remotos.enviar(urlBase + "?fieldname=" +encodeURI(elem.id)+ "&content="+encodeURI(campo.value)+"&"+formVars,"");
        //remove glow
        noLight(elem);
        elem.innerHTML = nt;
        changing = false;
        return false;
    } else {
        return true;
    }


}

function fieldBlur(campo,idfld) {
    if (campo.value!="") {
        elem = document.getElementById( idfld );
        remotos = new datosServidor;
        nt = remotos.enviar(urlBase + "?fieldname=" +escape(elem.id)+ "&content="+escape(campo.value)+"&"+formVars,"");        
        elem.innerHTML = nt;
        changing = false;
        return false;
    }
}

function selectUpdate(actual){
        elem = document.getElementById(actual.id);
        remotos = new datosServidor;
       nt = remotos.enviar(urlBase + "?fieldname=" +escape(elem.id)+ "&content="+escape(elem.value)+"&"+formVars,"");        
        changing = false;
        return false;
    /*
        alert(urlBase + "?fieldname=" +escape(elem.id)+ "&content="+escape(elem.value));
    */
}

function explode(item,delimiter) {
tempArray=new Array(1);
var Count=0;
var tempString=new String(item);

    while (tempString.indexOf(delimiter)>0) {
        tempArray[Count]=tempString.substr(0,tempString.indexOf(delimiter));
        tempString=tempString.substr(tempString.indexOf(delimiter)+1,tempString.length-tempString.indexOf(delimiter)+1);
        Count=Count+1
    } 
}

function buttonDestroy(actual){
        if ( confirm("Are you sure you want to permanently delete this item?")){
            elem = document.getElementById(actual.id);
            remotos = new datosServidor;
            nt = remotos.enviar(urlBase + "?fieldname=" +escape(elem.id)+ "&content="+escape(elem.value)+"&"+formVars,""); 
            document.location = "./products.php?callback=1";       
            changing = false;
            return false;
        } else {
            return false;
        }     
}

//edit field created
function editBox(actual) {
    //alert(actual.nodeName+' '+changing);
    if(!changing){
        width = widthEl(actual.id) + 20;
        height =heightEl(actual.id) + 2;

        if(height < 40){
            if(width < 100)    width = 150;
            actual.innerHTML = "<input id=\""+ actual.id +"_field\" style=\"width: "+width+"px; height: "+height+"px;\" maxlength=\"254\" type=\"text\" value=\"" + actual.innerHTML + "\" onkeypress=\"return fieldEnter(this,event,'" + actual.id + "')\" onfocus=\"highLight(this);\" onblur=\"noLight(this); return fieldBlur(this,'" + actual.id + "');\" />";
        }else{
            if(width < 70) width = 90;
            if(height < 50) height = 50;
            actual.innerHTML = "<textarea name=\"textarea\" id=\""+ actual.id +"_field\" style=\"width: "+width+"px; height: "+height+"px;\" onfocus=\"highLight(this);\" onblur=\"noLight(this); return fieldBlur(this,'" + actual.id + "');\">" + actual.innerHTML + "</textarea>";
        }
        changing = true;
    }

        actual.firstChild.focus();
}

//Jim, I think this could work: text.replace(/<br>/g,"<br />") - within a loop, the "g" is a modifier so it would always check for the next place the <br> is included

//find all span tags with class editText and id as fieldname parsed to update script. add onclick function
function editbox_init(){
    if (!document.getElementsByTagName){ return; }
    var spans = document.getElementsByTagName("span");
    var selects = document.getElementsByTagName("select");
    var buttons = document.getElementsByTagName("input");
    // loop through all span tags
    for (var i=0; i<spans.length; i++){
        var spn = spans[i];

            if (((' '+spn.className+' ').indexOf("editText") != -1) && (spn.id)) {
            spn.onclick = function () { editBox(this); }
            spn.style.cursor = "pointer";
            spn.title = "Click to edit!";    
               }

    }
    for (var i=0; i<selects.length; i++){
        var slt = selects[i];

            if (((' '+spn.className+' ').indexOf("editText") != -1) && (slt.id)) {
            slt.onchange = function () { selectUpdate(this); }
            slt.style.cursor = "pointer";
            slt.title = "Click to edit!";    
               }

    }
    for (var i=0; i<buttons.length; i++){
        var but = buttons[i];

            if (((' '+but.className+' ').indexOf("editText") != -1) && (but.id)) {
            but.onclick = function () { buttonDestroy(this); }
            slt.style.cursor = "pointer";
            slt.title = "Click to edit!";    
               }

    }

}

//crossbrowser load function
function addEvent(elm, evType, fn, useCapture)
{
  if (elm.addEventListener){
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent){
    var r = elm.attachEvent("on"+evType, fn);
    return r;
  } else {
    alert("Please upgrade your browser to use full functionality on this page");
  }
}

//get width of text element
function widthEl(span){

    if (document.layers){
      w=document.layers[span].clip.width;
    } else if (document.all && !document.getElementById){
      w=document.all[span].offsetWidth;
    } else if(document.getElementById){
      w=document.getElementById(span).offsetWidth;
    }
return w;
}

//get height of text element
function heightEl(span){

    if (document.layers){
      h=document.layers[span].clip.height;
    } else if (document.all && !document.getElementById){
      h=document.all[span].offsetHeight;
    } else if(document.getElementById){
      h=document.getElementById(span).offsetHeight;
    }
return h;
}

function highLight(span){
            //span.parentNode.style.border = "2px solid #D1FDCD";
            //span.parentNode.style.padding = "0";
            span.style.border = "1px solid #54CE43";          
}

function noLight(span){
        //span.parentNode.style.border = "0px";
        //span.parentNode.style.padding = "2px";
        span.style.border = "0px";   


}

//sets post/get vars for update
function setVarsForm(vars){
    formVars  = vars;
}


addEvent(window, "load", editbox_init);


