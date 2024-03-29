'use strict';
var ita_ribbonhelpers = window.ita_ribbonhelpers || {};

(function(){

   
    this.getFile = function(url, fileName, id) {
		fetch(url, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			},
			body: null,
			}).then(response => {
				response.blob().then(blob => {
					this.downloadFile(blob, fileName);
				})
			}).then(data => console.log(data));
	},

    this.downloadFile = function(blob, fileName) {
		var link = document.createElement("a");
        if (link.download !== undefined) { 
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
	},


    this.openTemplateDialog = function(primaryControl)
    {
        var actionId = (new Date()).toISOString();
        var pageInput = {
            pageType: "custom",
            name: "ita_templateselector_0da6a",
            entityName: JSON.stringify({
                entityType: primaryControl.entityReference.entityType,
                nextButtonTitle: Xrm.Utility.getResourceString("ita_/script/resx/messages", "templateDialogNextButton"),
                cancelButtonTitle: Xrm.Utility.getResourceString("ita_/script/resx/messages", "templateDialogCancelButton"),
                templateLabel: Xrm.Utility.getResourceString("ita_/script/resx/messages", "templateDialogTemplateLabel"),
                actionId: actionId
            }),
            recordId: primaryControl.entityReference.id.replace("{", "").replace("}", ""),
            
        };
        
        var navigationOptions = {
            target: 2, 
            position: 1,
            width: {value: 550, unit:"px"},
            height: {value: 220, unit:"px"},
            title: Xrm.Utility.getResourceString("ita_/script/resx/messages", "templateDialogTitle")
        };
        var _self = this;
        Xrm.Navigation.navigateTo(pageInput, navigationOptions)
            .then(
                function (result) {
                    Xrm.WebApi.retrieveMultipleRecords("ita_templatedownload", `?$filter=ita_actionid eq '${actionId}'&$select=ita_fileurl,ita_filename&$orderby=createdon desc&$top=1`)
                    .then(
                        function(result){
                            if(result.entities.length > 0)
                            {
                                var url = result.entities[0].ita_fileurl;
                                var fileName = result.entities[0].ita_filename;
                                _self.getFile(url, fileName);

                            }
                            
                        }
                    ).catch(function(error){
                        console.log(error);
                    }) 
                }
            ).catch(
                function (error) {
                    console.log(error);
                }
            );
    }
}).call(ita_ribbonhelpers);