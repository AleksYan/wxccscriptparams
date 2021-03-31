// ==UserScript==
// @name         WxCC_Script_Params
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  helper script for copy paste wxcc call constrol script params
// @author       Aleksey Yankovskyy (ayankovs@cisco.com)
// @match        https://portal.wxcc-eu1.cisco.com/cdsui/rs/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var copyPastButtonDiv = document.createElement("div");
    copyPastButtonDiv.setAttribute("id","copy-btn-div");
    copyPastButtonDiv.setAttribute("class","col-sm-2");
    copyPastButtonDiv.setAttribute("onclick","event.stopPropagation()");
    var copyButton = document.createElement("Button");
    var pastButton = document.createElement("Button");
    var checkButton = document.createElement("Button");
    copyButton.innerHTML = "Copy Script Params";
    pastButton.innerHTML = "Paste Script Params";
    checkButton.innerHTML = "Check Buffer";

    copyPastButtonDiv.appendChild(copyButton);
    copyPastButtonDiv.appendChild(pastButton);
    copyPastButtonDiv.appendChild(checkButton);

    const callControlDiv = document.getElementById('callControlPanel').firstElementChild;
    callControlDiv.appendChild(copyPastButtonDiv);


    let scriptParamsObj = {};

    // fetch existing script parameters
    function getScriptParams (){
        var scriptParams = document.getElementById("controlScriptParamsDiv").getElementsByClassName("form-group");
        console.log(scriptParams);

        for (var i = 0; i<scriptParams.length; i++){
            console.log(`Key${i} ${scriptParams[i].childNodes[0].innerHTML}`);
            if (scriptParams[i].childNodes[1].childNodes[2] != undefined) {

                if (scriptParams[i].childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1]){
                    console.log(`Value${i} ${scriptParams[i].childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1].nodeValue}`)
                    scriptParamsObj[scriptParams[i].childNodes[0].innerHTML] = scriptParams[i].childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1].nodeValue;
                }
            }
            else {
                console.log(`Value${i} ${scriptParams[i].children[1].children[0].defaultValue}`);
                scriptParamsObj[scriptParams[i].childNodes[0].innerHTML] = scriptParams[i].children[1].children[0].defaultValue;
            }
            //console.log(scriptParams[i].childNodes[1].childNodes[2].innerText);
            //console.log(scriptParams[i].childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1].nodeValue);

        }
        console.log('----AY----: Successfully fetched script parameters!');
        console.log(scriptParamsObj);
    }


    function pastScriptParams (){
        if (Object.keys(scriptParamsObj).length === 0){
            console.log("----AY----: No params were copied");
            alert("No script parameters were copied.");
        }else{
            console.log(scriptParamsObj);
            console.log("----AY----: Fetching script params names")
            var scriptParams = document.getElementById("controlScriptParamsDiv").getElementsByClassName("form-group");

            for (var i = 0; i<scriptParams.length; i++){
                console.log(`Key${i} ${scriptParams[i].childNodes[0].innerHTML}`);
                if (scriptParamsObj[scriptParams[i].childNodes[0].innerHTML]){
                    console.log(`----AY----: found existing param ${scriptParams[i].childNodes[0].innerHTML} in buffer`);
                    var paramValue = scriptParamsObj[scriptParams[i].childNodes[0].innerHTML];
                    //console.log(`----AY----:  inner HTML ${scriptParams[i].childNodes[1].innerHTML}`);

                    if (scriptParams[i].childNodes[1].childNodes[1].type == "select-one"){
                        //console.log(`----AY----:  I AM SELECT FIELD !`)
                        replaceSelectValue(i, paramValue);
                    }else{
                        replaceTextValue(i,paramValue);
                    }

                }
            }

        }
    }
    function replaceTextValue(i,paramValue){

        console.log("---AY---: i am replaceTextValue function");

        var newTextFieldOuterHtml = `<div class="col-sm-4"><input id="controlScriptParam_${i}" type="text" value="${paramValue}" class="form-control"></div>`;

        var scriptParams = document.getElementById("controlScriptParamsDiv").getElementsByClassName("form-group");
        scriptParams[i].childNodes[1].outerHTML = newTextFieldOuterHtml;
    }

    function replaceSelectValue(i, paramValue){
        console.log("---AY---: i am replaceSelectValue function");

        var newSelectFieldOuterHtml =`<div class="col-sm-4"><select id="controlScriptParam_${i}" class="form-control select2-hidden-accessible" tabindex="-1" aria-hidden="true">
		<option/>
		<option value="${paramValue}" select="selected">${paramValue}</option>
	</select>
	<span class="select2 select2-container select2-container--default select2-container--below" dir="ltr" style="width: 100px;">
		<span class="selection">
			<span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-labelledby="select2-controlScriptParam_${i}-container">
				<span class="select2-selection__rendered" id="select2-controlScriptParam_${i}-container" data-original-title="" title="${paramValue}">
					<span class="select2-selection__clear">×</span>
					${paramValue}</span>
				<span class="select2-selection__arrow" role="presentation">
					<b role="presentation"/>
				</span>
			</span>
		</span>
		<span class="dropdown-wrapper" aria-hidden="true"/>
	</span>
	<label id="controlScriptParam_${i}-error" class="error hide">This field is required</label>
</div>`


		var scriptParams = document.getElementById("controlScriptParamsDiv").getElementsByClassName("form-group");

        //console.log(`Original outerHTML ${scriptParams[i].childNodes[1].outerHTML}`);
        //console.log("---");
        //console.log(`Replaced outerHTML ${newSelectFieldOuterHtml}`);

        scriptParams[i].childNodes[1].outerHTML = newSelectFieldOuterHtml

    }

    function popUpParams(){
        var allParamString = "";

        for (const [key, value] of Object.entries(scriptParamsObj)) {
            allParamString +=`${key}: ${value} \r\n`;
            console.log(`${key}: ${value} \r\n`);
        }
console.log(allParamString);
        alert(allParamString);
    }

    copyButton.addEventListener('click', (e)=>{
        getScriptParams();
        e.stopPropagation();
        e.preventDefault();
    });

    pastButton.addEventListener('click', (e)=>{
        pastScriptParams();
        e.stopPropagation();
        e.preventDefault();
    });

    checkButton.addEventListener('click', (e)=>{
        popUpParams();
        e.stopPropagation();
        e.preventDefault();
    });

})();








