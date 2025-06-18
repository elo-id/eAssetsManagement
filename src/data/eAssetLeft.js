import de from '@elo/eloixclient';
import { RestUtils, Session } from '@elo/session';

export const newsData = {
    findCategory: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Category"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findManufacture: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Manufacture"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findModel: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Model"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findDepreciation: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Depreciation"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findSupplier: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Supplier"; // Sets the mask ID for the search
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
    
    tableSupplier: async function () {
        let ixConnect = Session.IX;
        let fi = this.findSupplier();
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
                    SupplierName: this.getIndexValueByName(sord, "ASSET_SUPPLIER_NAME"),
                    Address: this.getIndexValueByName(sord, "ASSET_ADDRESS"),
                    City: this.getIndexValueByName(sord, "CITY"),
                    Country: this.getIndexValueByName(sord, "COUNTRY"),
                    ContactName: this.getIndexValueByName(sord, "ASSET_CONTACT_NAME"),
                    Phone: this.getIndexValueByName(sord, "PHONE"),
                    SupplierEmail: this.getIndexValueByName(sord, "SUPPLIER_EMAIL"),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;

            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Supplier Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableDepreciation: async function () {
        let ixConnect = Session.IX;
        let fi = this.findDepreciation();
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
                    DepreciationName: this.getIndexValueByName(sord, "DEPRECIATION_NAME"),
                    NumberMonth: this.getIndexValueByName(sord, "NUMBERS_MONTH"),
                    MinimumValue: this.getIndexValueByName(sord, "MINIMUM_VALUE_AFTER"),
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Depreciation Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableCategory: async function () {
        let ixConnect = Session.IX;
        let fi = this.findCategory();
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
                    CategoryName: this.getIndexValueByName(sord, "ASSET_CATEGORY_NAME"),
                    CategoryEula: this.getIndexValueByName(sord, "CATEGORY_EULA"),
                    RequireUserConfirm: this.getIndexValueByName(sord, "REQUIRE_USER_CONFIRM"),
                    SendEmail: this.getIndexValueByName(sord, "SEND_EMAIL"),
                    Notes: sord.desc
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Category Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableManufacture: async function () {
        let ixConnect = Session.IX;
        let fi = this.findManufacture();
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
                    ManufactureName: this.getIndexValueByName(sord, "ASSET_MANUFACTURE_NAME"),
                    Url: this.getIndexValueByName(sord, "URL"),
                    UrlSupport: this.getIndexValueByName(sord, "URL_SUPPORT"),
                    SupportPhone: this.getIndexValueByName(sord, "SUPPORT_PHONE"),
                    SupportEmail: this.getIndexValueByName(sord, "SUPPORT_EMAIL"),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Manufacture Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableModel: async function () {
        let ixConnect = Session.IX;
        let fi = this.findModel();
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
                    CategoryName: this.getIndexValueByName(sord, "ASSET_CATEGORY_NAME"),
                    ManufactureName: this.getIndexValueByName(sord, "ASSET_MANUFACTURE_NAME"),
                    ModelNo: this.getIndexValueByName(sord, "ASSET_MODEL_NO"),
                    DepreciationName: this.getIndexValueByName(sord, "DEPRECIATION_NAME"),
                    EolDate: this.convertToDate(this.getIndexValueByName(sord, "DATE_EOL")),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset Model Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    inputSupplier: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Supplier", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_SUPPLIER_NAME", form.SupplierName);
        this.setIndexValueByName(data, "ASSET_ADDRESS", form.Address);
        this.setIndexValueByName(data, "ASSET_CONTACT_NAME", form.ContactName);
        data.desc = form.Notes;
        this.setIndexValueByName(data, "CITY", form.City);
        this.setIndexValueByName(data, "COUNTRY", form.Country);
        this.setIndexValueByName(data, "PHONE", form.Phone);
        this.setIndexValueByName(data, "SUPPLIER_EMAIL", form.SupplierEmail);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputDepreciation: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Depreciation", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "DEPRECIATION_NAME", form.DepreciationName);
        this.setIndexValueByName(data, "NUMBERS_MONTH", form.NumberMonth);
        this.setIndexValueByName(data, "MINIMUM_VALUE_AFTER", form.MinimumValue);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputCategory: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Category", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(data, "CATEGORY_EULA", form.CategoryEula);
        this.setIndexValueByName(data, "REQUIRE_USER_CONFIRM", form.RequireUserConfirm);
        this.setIndexValueByName(data, "SEND_EMAIL", form.SendEmail);
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputManufacture: async function (form) {
        let date = new Date();
        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset Manufacture", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_MANUFACTURE_NAME", form.ManufactureName);
        this.setIndexValueByName(data, "URL", form.Url);
        this.setIndexValueByName(data, "URL_SUPPORT", form.UrlSupport);
        this.setIndexValueByName(data, "SUPPORT_PHONE", form.SupportPhone);
        this.setIndexValueByName(data, "SUPPORT_EMAIL", form.SupportEmail);
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputModel: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset Model", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(data, "ASSET_MANUFACTURE_NAME", form.ManufactureName);
        this.setIndexValueByName(data, "ASSET_MODEL_NO", form.ModelNo);
        this.setIndexValueByName(data, "DEPRECIATION_NAME", form.DepreciationName);
        this.setIndexValueByName(data, "DATE_EOL", this.formatYYYYMMDD(form.EolDate));
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    updateSupplier: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_SUPPLIER_NAME", form.SupplierName);
        this.setIndexValueByName(curSord, "ASSET_ADDRESS", form.Address);
        this.setIndexValueByName(curSord, "ASSET_CONTACT_NAME", form.ContactName);
        curSord.desc = form.Notes;
        this.setIndexValueByName(curSord, "CITY", form.City);
        this.setIndexValueByName(curSord, "COUNTRY", form.Country);
        this.setIndexValueByName(curSord, "PHONE", form.Phone);
        this.setIndexValueByName(curSord, "SUPPLIER_EMAIL", form.SupplierEmail);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateDepreciation: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "DEPRECIATION_NAME", form.DepreciationName);
        this.setIndexValueByName(curSord, "NUMBERS_MONTH", form.NumberMonth);
        this.setIndexValueByName(curSord, "MINIMUM_VALUE_AFTER", form.MinimumValue);
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateCategory: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(curSord, "CATEGORY_EULA", form.CategoryEula);
        this.setIndexValueByName(curSord, "REQUIRE_USER_CONFIRM", form.RequireUserConfirm);
        this.setIndexValueByName(curSord, "SEND_EMAIL", form.SendEmail);
        curSord.desc = form.Notes;
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateManufacture: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_MANUFACTURE_NAME", form.ManufactureName);
        this.setIndexValueByName(curSord, "URL", form.Url);
        this.setIndexValueByName(curSord, "URL_SUPPORT", form.UrlSupport);
        this.setIndexValueByName(curSord, "SUPPORT_PHONE", form.SupportPhone);
        this.setIndexValueByName(curSord, "SUPPORT_EMAIL", form.SupportEmail);
        curSord.desc = form.Notes;
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateModel: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(curSord, "ASSET_MANUFACTURE_NAME", form.ManufactureName);
        this.setIndexValueByName(curSord, "ASSET_MODEL_NO", form.ModelNo);
        this.setIndexValueByName(curSord, "DEPRECIATION_NAME", form.DepreciationName);
        this.setIndexValueByName(curSord, "DATE_EOL", this.formatYYYYMMDD(form.EolDate));
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
