import de from '@elo/eloixclient';
import { RestUtils, Session } from '@elo/session';

export const newsData = {
    findAssets: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Assets"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findChildren: function (parentId) {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fc = new de.elo.ix.client.FindChildren();
        fc.parentId = parentId;
        fi.findChildren = fc;
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    convertToDate: function (dateString) {
        if (!dateString) return "";
        let year = dateString.substring(0, 4);
        let month = dateString.substring(4, 6);
        let day = dateString.substring(6, 8);
        let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${day}-${monthNames[Number(month - 1)]}-${year}`;
    },

    formatYYYYMMDD: function(dateObj) {
        if (!(dateObj instanceof Date)) return "";

        let year = dateObj.getFullYear();
        let month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // JS months are 0-based
        let day = dateObj.getDate().toString().padStart(2, '0');

        return `${year}${month}${day}`;
    },


    getIndexValueByName: function(sord, name) {
        var objKeys = sord.objKeys;
        for (var i = 0; i < objKeys.length; i++) {
            var key = objKeys[i];
            if (key.name == name) {
                if (key.data.length > 0) {
                return String(key.data[0]);
                } else {
                return "";
                }
            }
        }
        return "";
    },

    setIndexValueByName: function(sord, name, value) {
        var objKeys = sord.objKeys;
        for (var i = 0; i < objKeys.length; i++) {
            var key = objKeys[i];
            if (key.name == name) {
                key.data = [value]
            }
        }
        return "";
    },

    onSuccess: function(){
        console.log("Success!")
    },

    onFailure: function(){
        console.log("Failure!")
    },

    // Convert Blob to Base64
    blobToBase64: async function(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // remove data:mime;base64,
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },
    
    // Get file extension from MIME type
    getFileExtensionFromType: async function(type) {
        const map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
            "application/pdf": ".pdf",
            "text/plain": ".txt",
            "text/csv": ".csv",
            "application/msword": ".doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
            "application/vnd.ms-excel": ".xls",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
            "application/vnd.ms-powerpoint": ".ppt",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
            "application/zip": ".zip",
            "application/json": ".json",
            "application/xml": ".xml",
        };
        return map[type] || ".bin"; // fallback to .bin if unknown
    },

    uploadDoc: async function(shortName, imageUrl, objID) {
        try {
            // Fetch the file
            const response = await fetch(imageUrl);
            const blob = await response.blob();
    
            // Convert Blob to Base64
            const base64 = await this.blobToBase64(blob);
    
            // Infer content type and file extension
            const contentType = blob.type || "application/octet-stream";
            const ext = this.getFileExtensionFromType(contentType);
    
            // Upload
            await RestUtils.uploadFile({
                data: base64,
                parent: objID,
                mask: "Basic Entry",
                name: shortName + ext,
                version: "1.0",
                comment: "Uploaded via Base64",
                contentType: contentType
            },
            this.onSuccess,
            this.onFailure);
    
        } catch (err) {
            console.error("Upload failed:", err);
            this.onFailure(err);
        }
    },
    
    tableAssets: async function () {
        let ixConnect = Session.IX;
        let fi = this.findAssets();
        let fr = await ixConnect.ix().findFirstSords(fi, 1000, Session.CONST.SORD.mbAllIndex);
        const tableData = []; // Initialize table data array
        let subData = [];
        console.log(Array.isArray(fr))

        while (true) {
            fr.sords.forEach(async (sord) => {
                // if (!sord.name || sord.name.trim() === "" || sord.name == "Bidding News") return;
                let fic = this.findChildren(sord.id)
                let frc = await ixConnect.ix().findFirstSords(fic, 1000, Session.CONST.SORD.mbAllIndex);

                while(true){
                    for (const docs of frc.sords) {
                        try {
                            const rowsub = {
                                id: docs.id,
                                link: "https://demo.elo.co.id:9493/ix-ELOID/plugin/de.elo.ix.plugin.proxy/web/#/archive/" + docs.guid + "/",
                            };
                            subData.push(rowsub);
                        } catch (error) {
                            console.warn("Error processing documents:", error);
                            continue;
                        }
                    }
                    if (!frc.moreResults) break;
                    frc = await ixConnect.ix().findNextSords(frc.searchId, frc.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
                }
                
                const row = {
                    No: tableData.length + 1, // Ensures numbering continues across iterations
                    Name: sord.name,
                    ObjID: sord.id,
                    Asset_tag: this.getIndexValueByName(sord, "ASSET_TAG"),
                    Asset_name: this.getIndexValueByName(sord, "ASSET_NAME"),
                    Serial: this.getIndexValueByName(sord, "SERIAL"),
                    Model_name: this.getIndexValueByName(sord, "ASSET_MODEL_NAME"),
                    Model_no: this.getIndexValueByName(sord, "ASSET_MODEL_NO"),
                    Status: this.getIndexValueByName(sord, "ASSET_STATUS"),
                    Notes: sord.desc,
                    Company_name: this.getIndexValueByName(sord, "ASSET_COMPANY_NAME"),
                    Location_name: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    Requestable: this.getIndexValueByName(sord, "REQUESTABLE"),
                    Warranty: this.getIndexValueByName(sord, "ASSET_WARRANTY"),
                    Checkin_date: this.convertToDate(this.getIndexValueByName(sord, "DATE_CHECKIN")),
                    Next_audit: this.convertToDate(this.getIndexValueByName(sord, "ASSET_NEXT_AUDIT")),
                    Model_type: this.getIndexValueByName(sord, "ASSET_MODEL_TYPE"),
                    Order_no: this.getIndexValueByName(sord, "ASSET_ORDER_NO"),
                    Purchase_date: this.convertToDate(this.getIndexValueByName(sord, "PURCHASE_DATE")),
                    Supplier_name: this.getIndexValueByName(sord, "ASSET_SUPPLIER_NAME"),
                    Purchase_currency: this.getIndexValueByName(sord, "ASSET_PURCHASE_CURRENCY"),
                    Purchase_amount: this.getIndexValueByName(sord, "ASSET_PURCHASE_COST"),
                    Current_currency: this.getIndexValueByName(sord, "CURRENT_VALUE_CURRENCY"),
                    Current_value: this.getIndexValueByName(sord, "CURRENT_VALUE_COST"),
                    Depreciation_name: this.getIndexValueByName(sord, "DEPRECIATION_NAME"),
                    Rate_eol: this.getIndexValueByName(sord, "EOL_RATE"),
                    Date_eol: this.convertToDate(this.getIndexValueByName(sord, "DATE_EOL")),
                    Date_created: this.convertToDate(this.getIndexValueByName(sord, "DATE_CREATED")),
                    Date_updated: this.convertToDate(this.getIndexValueByName(sord, "DATE_UPDATED")),
                    Checkouts_count: this.getIndexValueByName(sord, "CHECKOUTS_COUNT"),
                    Checkins_count: this.getIndexValueByName(sord, "CHECKINS_COUNT"),
                    Requests_count: this.getIndexValueByName(sord, "REQUESTS_COUNT"),
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;

            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    inputAssets: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Assets", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_TAG", form.assetTag);
        this.setIndexValueByName(data, "ASSET_NAME", form.assetName);
        this.setIndexValueByName(data, "SERIAL", form.serial);
        this.setIndexValueByName(data, "ASSET_MODEL_NAME", form.modelName);
        this.setIndexValueByName(data, "ASSET_MODEL_NO", form.modelNo);
        this.setIndexValueByName(data, "ASSET_STATUS", form.assetStatus);
        data.desc = form.notes;
        this.setIndexValueByName(data, "ASSET_COMPANY_NAME", form.companyName);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.locationName);
        this.setIndexValueByName(data, "REQUESTABLE", form.requestable);
        this.setIndexValueByName(data, "ASSET_WARRANTY", form.Warranty);
        this.setIndexValueByName(data, "DATE_CHECKIN", this.formatYYYYMMDD(form.dateCheckin));
        this.setIndexValueByName(data, "ASSET_NEXT_AUDIT", this.formatYYYYMMDD(form.nextAudit));
        this.setIndexValueByName(data, "ASSET_MODEL_TYPE", form.modelType);
        this.setIndexValueByName(data, "ASSET_ORDER_NO", form.orderNo);
        this.setIndexValueByName(data, "PURCHASE_DATE", this.formatYYYYMMDD(form.purchaseDate));
        this.setIndexValueByName(data, "ASSET_SUPPLIER_NAME", form.supplierName);
        this.setIndexValueByName(data, "ASSET_PURCHASE_CURRENCY", form.purchaseCurrency);
        this.setIndexValueByName(data, "ASSET_PURCHASE_COST", form.purchaseCost);
        this.setIndexValueByName(data, "CURRENT_VALUE_CURRENCY", form.currentCurrency);
        this.setIndexValueByName(data, "CURRENT_VALUE_COST", form.currentValue);
        this.setIndexValueByName(data, "DEPRECIATION_NAME", form.depreciationName);
        this.setIndexValueByName(data, "EOL_RATE", form.rate);
        this.setIndexValueByName(data, "DATE_EOL", this.formatYYYYMMDD(form.dateEol));
        this.setIndexValueByName(data, "DATE_CREATED", this.formatYYYYMMDD(form.dateCreated));
        this.setIndexValueByName(data, "DATE_UPDATED", this.formatYYYYMMDD(form.dateUpdated));
        this.setIndexValueByName(data, "CHECKOUTS_COUNT", form.checkinCount);
        this.setIndexValueByName(data, "CHECKINS_COUNT", form.checkoutCount);
        this.setIndexValueByName(data, "REQUESTS_COUNT", form.requestCount);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    updateAssets: async function (objID, form) {
        console.log("Data: ", form)

        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_TAG", form.assetTag);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.assetName);
        this.setIndexValueByName(curSord, "SERIAL", form.serial);
        this.setIndexValueByName(curSord, "ASSET_MODEL_NAME", form.modelName);
        this.setIndexValueByName(curSord, "ASSET_MODEL_NO", form.modelNo);
        this.setIndexValueByName(curSord, "ASSET_STATUS", form.assetStatus);
        curSord.desc = form.notes;
        this.setIndexValueByName(curSord, "ASSET_COMPANY_NAME", form.companyName);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.locationName);
        this.setIndexValueByName(curSord, "REQUESTABLE", form.requestable);
        this.setIndexValueByName(curSord, "ASSET_WARRANTY", form.Warranty);
        this.setIndexValueByName(curSord, "DATE_CHECKIN", this.formatYYYYMMDD(form.dateCheckin));
        this.setIndexValueByName(curSord, "ASSET_NEXT_AUDIT", this.formatYYYYMMDD(form.nextAudit));
        this.setIndexValueByName(curSord, "ASSET_MODEL_TYPE", form.modelType);
        this.setIndexValueByName(curSord, "ASSET_ORDER_NO", form.orderNo);
        this.setIndexValueByName(curSord, "PURCHASE_DATE", this.formatYYYYMMDD(form.purchaseDate));
        this.setIndexValueByName(curSord, "ASSET_SUPPLIER_NAME", form.supplierName);
        this.setIndexValueByName(curSord, "ASSET_PURCHASE_CURRENCY", form.purchaseCurrency);
        this.setIndexValueByName(curSord, "ASSET_PURCHASE_COST", form.purchaseCost);
        this.setIndexValueByName(curSord, "CURRENT_VALUE_CURRENCY", form.currentCurrency);
        this.setIndexValueByName(curSord, "CURRENT_VALUE_COST", form.currentValue);
        this.setIndexValueByName(curSord, "DEPRECIATION_NAME", form.depreciationName);
        this.setIndexValueByName(curSord, "EOL_RATE", form.rate);
        this.setIndexValueByName(curSord, "DATE_EOL", this.formatYYYYMMDD(form.dateEol));
        this.setIndexValueByName(curSord, "DATE_CREATED", this.formatYYYYMMDD(form.dateCreated));
        this.setIndexValueByName(curSord, "DATE_UPDATED", this.formatYYYYMMDD(form.dateUpdated));
        this.setIndexValueByName(curSord, "CHECKOUTS_COUNT", form.checkinCount);
        this.setIndexValueByName(curSord, "CHECKINS_COUNT", form.checkoutCount);
        this.setIndexValueByName(curSord, "REQUESTS_COUNT", form.requestCount);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    deleteAssets: async function (objectID) {
        let ObjID = objectID
        let ixConnect = Session.IX;
        let deleteOptions = de.elo.ix.client.DeleteOptions
        await ixConnect.ix().deleteSord(null, ObjID, Session.CONST.LOCK.NO, deleteOptions);
    },
};
