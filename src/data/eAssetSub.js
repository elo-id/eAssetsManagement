import de from '@elo/eloixclient';
import { RestUtils, Session } from '@elo/session';

export const newsData = {
    findRequests: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Request"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findBulkIn: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Bulk Checkin"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findBulkOut: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Bulk Checkout"; // Sets the mask ID for the search
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
    
    tableRequests: async function () {
        let ixConnect = Session.IX;
        let fi = this.findRequests();
        let fr = await ixConnect.ix().findFirstSords(fi, 1000, Session.CONST.SORD.mbAllIndex);
        const tableData = []; // Initialize table data array
        let subData = [];
        console.log(Array.isArray(fr))

        while (true) {
            fr.sords.forEach(async (sord) => {
                const row = {
                    No: tableData.length + 1, // Ensures numbering continues across iterations
                    Name: sord.name,
                    ObjID: sord.id,
                    RequestName: this.getIndexValueByName(sord, "ASSET_REQUEST_NAME"),
                    CompanyName: this.getIndexValueByName(sord, "ASSET_COMPANY_NAME"),
                    LocationName: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    PeopleName: this.getIndexValueByName(sord, "ASSET_PEOPLE_NAME"),
                    RequestDate: this.convertToDate(this.getIndexValueByName(sord, "ASSET_REQUESTED_DATE")),
                    Reason: sord.desc,
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                    Quantity: this.getIndexValueByName(sord, "QTY"),
                    CheckinDate: this.convertToDate(this.getIndexValueByName(sord, "DATE_CHECKIN")),
                    Action: this.getIndexValueByName(sord, "ACTION"),
                    Remarks: this.getIndexValueByName(sord, "REMARKS"),
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;

            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Request Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableBulkIn: async function () {
        let ixConnect = Session.IX;
        let fi = this.findBulkIn();
        let fr = await ixConnect.ix().findFirstSords(fi, 1000, Session.CONST.SORD.mbAllIndex);
        const tableData = []; // Initialize table data array
        let subData = [];
        console.log(Array.isArray(fr))

        while (true) {
            fr.sords.forEach(async (sord) => {
                const row = {
                    No: tableData.length + 1, // Ensures numbering continues across iterations
                    Name: sord.name,
                    ObjID: sord.id,
                    CheckinName: this.getIndexValueByName(sord, "CHECKIN_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Bulk Checkin Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableBulkOut: async function () {
        let ixConnect = Session.IX;
        let fi = this.findBulkOut();
        let fr = await ixConnect.ix().findFirstSords(fi, 1000, Session.CONST.SORD.mbAllIndex);
        const tableData = []; // Initialize table data array
        let subData = [];
        console.log(Array.isArray(fr))

        while (true) {
            fr.sords.forEach(async (sord) => {
                const row = {
                    No: tableData.length + 1, // Ensures numbering continues across iterations
                    Name: sord.name,
                    ObjID: sord.id,
                    CheckoutName: this.getIndexValueByName(sord, "CHECKOUT_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Bulk Checkout Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    inputRequests: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Request", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_REQUEST_NAME", form.RequestName);
        this.setIndexValueByName(data, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(data, "ASSET_PEOPLE_NAME", form.PeopleName);
        this.setIndexValueByName(data, "ASSET_REQUESTED_DATE", this.formatYYYYMMDD(form.RequestDate));
        data.desc = form.Reason;
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "QTY", form.Quantity);
        this.setIndexValueByName(data, "DATE_CHECKIN", this.formatYYYYMMDD(form.dateCheckin));
        this.setIndexValueByName(data, "ACTION", form.Action);
        this.setIndexValueByName(data, "REMARKS", form.Remarks);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputBulkIn: async function (form) {
        let date = new Date();
        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset Bulk Checkin", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "CHECKIN_NAME", form.CheckinName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputBulkOut: async function (form) {
        let date = new Date();
        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset Bulk Checkout", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "CHECKOUT_NAME", form.CheckoutName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    updateRequests: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_REQUEST_NAME", form.RequestName);
        this.setIndexValueByName(curSord, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(curSord, "ASSET_PEOPLE_NAME", form.PeopleName);
        this.setIndexValueByName(curSord, "ASSET_REQUESTED_DATE", this.formatYYYYMMDD(form.RequestDate));
        curSord.desc = form.Reason;
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "QTY", form.Quantity);
        this.setIndexValueByName(curSord, "DATE_CHECKIN", this.formatYYYYMMDD(form.dateCheckin));
        this.setIndexValueByName(curSord, "ACTION", form.Action);
        this.setIndexValueByName(curSord, "REMARKS", form.Remarks);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateBulkIn: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "CHECKIN_NAME", form.CheckinName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateBulkOut: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "CHECKOUT_NAME", form.CheckoutName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    deleteData: async function (objectID) {
        let ObjID = objectID
        let ixConnect = Session.IX;
        let deleteOptions = de.elo.ix.client.DeleteOptions
        await ixConnect.ix().deleteSord(null, ObjID, Session.CONST.LOCK.NO, deleteOptions);
    },
};
