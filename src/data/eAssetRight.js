import de from '@elo/eloixclient';
import { RestUtils, Session } from '@elo/session';

export const newsData = {
    findMaintenance: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Maintenance"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findCheckout: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Checkout"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findCheckin: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Checkin"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findCost: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Cost"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findAudit: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Audit"; // Sets the mask ID for the search
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
    
    tableAudit: async function () {
        let ixConnect = Session.IX;
        let fi = this.findAudit();
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
                    AuditName: this.getIndexValueByName(sord, "ASSET_AUDIT_NAME"),
                    LocationName: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                    LastAudit: this.convertToDate(this.getIndexValueByName(sord, "ASSET_LAST_AUDIT")),
                    NextAudit: this.convertToDate(this.getIndexValueByName(sord, "ASSET_NEXT_AUDIT")),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;

            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Audit Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableCost: async function () {
        let ixConnect = Session.IX;
        let fi = this.findCost();
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
                    ItemName: this.getIndexValueByName(sord, "ITEM_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                    CostAmount: this.getIndexValueByName(sord, "COST_AMOUNT"),
                    PurchaseDate: this.convertToDate(this.getIndexValueByName(sord, "PURCHASE_DATE")),
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Cost Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableMaintenance: async function () {
        let ixConnect = Session.IX;
        let fi = this.findMaintenance();
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
                    MaintenanceName: this.getIndexValueByName(sord, "MAINTENANCE_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                    MaintenanceType: this.getIndexValueByName(sord, "MAINTENANCE_TYPE"),
                    SupplierName: this.getIndexValueByName(sord, "ASSET_SUPPLIER_NAME"),
                    DateStart: this.convertToDate(this.getIndexValueByName(sord, "DATE_START")),
                    DateCompletion: this.convertToDate(this.getIndexValueByName(sord, "DATE_COMPLETION")),
                    WarrantyImprovement: this.getIndexValueByName(sord, "WARRANTY_IMPROVEMENT"),
                    Currency: this.getIndexValueByName(sord, "COST_CURRENCY"),
                    CostAmount: this.getIndexValueByName(sord, "COST_AMOUNT"),
                    Notes: sord.desc
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Maintenance Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableCheckout: async function () {
        let ixConnect = Session.IX;
        let fi = this.findCheckout();
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
                    ModelName: this.getIndexValueByName(sord, "ASSET_MODEL_NAME"),
                    Status: this.getIndexValueByName(sord, "ASSET_STATUS"),
                    CheckoutTo: this.getIndexValueByName(sord, "CHECKOUT_TO"),
                    UserLocationCompany: this.getIndexValueByName(sord, "USER_LOCATION_COMPANY"),
                    DateCheckout: this.convertToDate(this.getIndexValueByName(sord, "DATE_CHECKOUT")),
                    DateCheckin: this.convertToDate(this.getIndexValueByName(sord, "DATE_CHECKIN")),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Checkout Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableCheckin: async function () {
        let ixConnect = Session.IX;
        let fi = this.findCheckin();
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
                    ModelName: this.getIndexValueByName(sord, "ASSET_MODEL_NAME"),
                    Status: this.getIndexValueByName(sord, "ASSET_STATUS"),
                    LocationName: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    UpdateLocation: this.getIndexValueByName(sord, "UPDATE_LOCATION"),
                    UpdateLocationDefault: this.getIndexValueByName(sord, "UPDATE_LOCATION_DEFAULT"),
                    DateCheckin: this.convertToDate(this.getIndexValueByName(sord, "DATE_CHECKIN")),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Checkin Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    inputAudit: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Audit", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_AUDIT_NAME", form.AuditName);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.ContactName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "ASSET_LAST_AUDIT", this.formatYYYYMMDD(form.LastAudit));
        this.setIndexValueByName(data, "ASSET_NEXT_AUDIT", this.formatYYYYMMDD(form.NextAudit));
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputCost: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Cost", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ITEM_NAME", form.ItemName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "COST_AMOUNT", form.CostAmount);
        this.setIndexValueByName(data, "PURCHASE_DATE", this.formatYYYYMMDD(form.PurchaseDate));

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputMaintenance: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Maintenance", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "MAINTENANCE_NAME", form.MaintenanceName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "MAINTENANCE_NAME", form.MaintenanceType);
        this.setIndexValueByName(data, "ASSET_SUPPLIER_NAME", form.SupplierName);
        this.setIndexValueByName(data, "DATE_START", this.formatYYYYMMDD(form.DateStart));
        this.setIndexValueByName(data, "DATE_COMPLETION", this.formatYYYYMMDD(form.DateCompletion));
        this.setIndexValueByName(data, "WARRANTY_IMPROVEMENT", form.WarrantyImprovement);
        this.setIndexValueByName(data, "COST_CURRENCY", form.Currency);
        this.setIndexValueByName(data, "COST_AMOUNT", form.CostAmount);
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputCheckout: async function (form) {
        let date = new Date();
        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset Checkout", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "CHECKOUT_NAME", form.CheckoutName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "ASSET_MODEL_NAME", form.ModelName);
        this.setIndexValueByName(data, "ASSET_STATUS", form.Status);
        this.setIndexValueByName(data, "CHECKOUT_TO", form.CheckoutTo);
        this.setIndexValueByName(data, "USER_LOCATION_COMPANY", form.UserLocationCompany);
        this.setIndexValueByName(data, "DATE_CHECKOUT", this.formatYYYYMMDD(form.DateCheckout));
        this.setIndexValueByName(data, "DATE_CHECKIN", this.formatYYYYMMDD(form.DateCheckin));
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputCheckin: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset Checkin", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "CHECKIN_NAME", form.CheckinName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "ASSET_MODEL_NAME", form.ModelName);
        this.setIndexValueByName(data, "ASSET_STATUS", form.Status);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(data, "UPDATE_LOCATION", form.UpdateLocation);
        this.setIndexValueByName(data, "UPDATE_LOCATION_DEFAULT", form.UpdateLocationDefault);
        this.setIndexValueByName(data, "DATE_CHECKIN", this.formatYYYYMMDD(form.DateCheckin));
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    updateAudit: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_AUDIT_NAME", form.AuditName);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.ContactName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "ASSET_LAST_AUDIT", this.formatYYYYMMDD(form.LastAudit));
        this.setIndexValueByName(curSord, "ASSET_NEXT_AUDIT", this.formatYYYYMMDD(form.NextAudit));
        curSord.desc = form.Notes;
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateCost: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ITEM_NAME", form.ItemName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "COST_AMOUNT", form.CostAmount);
        this.setIndexValueByName(curSord, "PURCHASE_DATE", this.formatYYYYMMDD(form.PurchaseDate));
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateMaintenance: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "MAINTENANCE_NAME", form.MaintenanceName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "MAINTENANCE_NAME", form.MaintenanceType);
        this.setIndexValueByName(curSord, "ASSET_SUPPLIER_NAME", form.SupplierName);
        this.setIndexValueByName(curSord, "DATE_START", this.formatYYYYMMDD(form.DateStart));
        this.setIndexValueByName(curSord, "DATE_COMPLETION", this.formatYYYYMMDD(form.DateCompletion));
        this.setIndexValueByName(curSord, "WARRANTY_IMPROVEMENT", form.WarrantyImprovement);
        this.setIndexValueByName(curSord, "COST_CURRENCY", form.Currency);
        this.setIndexValueByName(curSord, "COST_AMOUNT", form.CostAmount);
        curSord.desc = form.Notes;
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateCheckout: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "CHECKOUT_NAME", form.CheckoutName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "ASSET_MODEL_NAME", form.ModelName);
        this.setIndexValueByName(curSord, "ASSET_STATUS", form.Status);
        this.setIndexValueByName(curSord, "CHECKOUT_TO", form.CheckoutTo);
        this.setIndexValueByName(curSord, "USER_LOCATION_COMPANY", form.UserLocationCompany);
        this.setIndexValueByName(curSord, "DATE_CHECKOUT", this.formatYYYYMMDD(form.DateCheckout));
        this.setIndexValueByName(curSord, "DATE_CHECKIN", this.formatYYYYMMDD(form.DateCheckin));
        curSord.desc = form.Notes;
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateCheckin: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "CHECKIN_NAME", form.CheckinName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "ASSET_MODEL_NAME", form.ModelName);
        this.setIndexValueByName(curSord, "ASSET_STATUS", form.Status);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(curSord, "UPDATE_LOCATION", form.UpdateLocation);
        this.setIndexValueByName(curSord, "UPDATE_LOCATION_DEFAULT", form.UpdateLocationDefault);
        this.setIndexValueByName(curSord, "DATE_CHECKIN", this.formatYYYYMMDD(form.DateCheckin));
        curSord.desc = form.Notes;

        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    deleteData: async function (objectID) {
        let ObjID = objectID
        let ixConnect = Session.IX;
        let deleteOptions = de.elo.ix.client.DeleteOptions
        await ixConnect.ix().deleteSord(null, ObjID, Session.CONST.LOCK.NO, deleteOptions);
    },
};
