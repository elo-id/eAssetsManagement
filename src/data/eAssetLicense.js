import de from '@elo/eloixclient';
import { RestUtils, Session } from '@elo/session';

export const newsData = {
    findLicense: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset License"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findCheckoutLicense: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Checkout License"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findCheckinLicense: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Checkin License"; // Sets the mask ID for the search
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

    tableLicense: async function () {
        let ixConnect = Session.IX;
        let fi = this.findLicense();
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
                    AssetTag: this.getIndexValueByName(sord, "ASSET_TAG"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                    SoftwareName: this.getIndexValueByName(sord, "SOFTWARE_NAME"),
                    CategoryName: this.getIndexValueByName(sord, "CATEGORY_NAME"),
                    Seat: this.getIndexValueByName(sord, "ASSET_SEAT"),
                    MinimumQty: this.getIndexValueByName(sord, "MINIMUM_QTY"),
                    ProductKey: this.getIndexValueByName(sord, "ASSET_PRODUCT_KEY"),
                    CompanyName: this.getIndexValueByName(sord, "ASSET_COMPANY_NAME"),
                    ManufactureName: this.getIndexValueByName(sord, "ASSET_MANUFACTURE_NAME"),
                    LicenseToName: this.getIndexValueByName(sord, "LICENSE_TO_NAME"),
                    LicenseToEmail: this.getIndexValueByName(sord, "LICENSE_TO_EMAIL"),
                    Reassignable: this.getIndexValueByName(sord, "REASSIGNABLE"),
                    SupplierName: this.getIndexValueByName(sord, "ASSET_SUPPLIER_NAME"),
                    OrderNo: this.getIndexValueByName(sord, "ASSET_ORDER_NO"),
                    PurchaseCurrency: this.getIndexValueByName(sord, "ASSET_PURCHASE_CURRENCY"),
                    PurchaseCost: this.getIndexValueByName(sord, "ASSET_PURCHASE_COST"),

                    PurchaseDate: this.convertToDate(this.getIndexValueByName(sord, "PURCHASE_DATE")),
                    ExpiredDate: this.convertToDate(this.getIndexValueByName(sord, "EXPIRED_DATE")),
                    TerminationDate: this.convertToDate(this.getIndexValueByName(sord, "TERMINATION_DATE")),
                    PurchaseOrderNo: this.getIndexValueByName(sord, "PURCHASE_ORDER_NO"),
                    DepreciationName: this.getIndexValueByName(sord, "DEPRECIATION_NAME"),
                    Maintained: this.getIndexValueByName(sord, "MAINTAINED"),
                    Notes: sord.desc,

                    DateCreated: this.convertToDate(this.getIndexValueByName(sord, "DATE_CREATED")),
                    DateUpdated: this.convertToDate(this.getIndexValueByName(sord, "DATE_UPDATED")),
                    CheckoutCount: this.getIndexValueByName(sord, "CHECKOUTS_COUNT"),
                    CheckinCount: this.getIndexValueByName(sord, "CHECKINS_COUNT"),
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset License Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableCheckoutLicense: async function () {
        let ixConnect = Session.IX;
        let fi = this.findCheckoutLicense();
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
                    CheckoutLicenseName: this.getIndexValueByName(sord, "CHECKOUT_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                    CategoryName: this.getIndexValueByName(sord, "ASSET_CATEGORY_NAME"),
                    CheckoutTo: this.getIndexValueByName(sord, "CHECKOUT_TO"),
                    UserAsset: this.getIndexValueByName(sord, "USER_ASSET"),
                    DateCheckoutLicense: this.convertToDate(this.getIndexValueByName(sord, "DATE_CHECKOUT")),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset CheckoutLicense Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    tableCheckinLicense: async function () {
        let ixConnect = Session.IX;
        let fi = this.findCheckinLicense();
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
                    CheckinLicenseName: this.getIndexValueByName(sord, "CHECKIN_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_NAME"),
                    CategoryName: this.getIndexValueByName(sord, "ASSET_CATEGORY_NAME"),
                    ProductKey: this.getIndexValueByName(sord, "ASSET_PRODUCT_KEY"),
                    LocationName: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    UpdateLocation: this.getIndexValueByName(sord, "UPDATE_LOCATION"),
                    UpdateLocationDefault: this.getIndexValueByName(sord, "UPDATE_LOCATION_DEFAULT"),
                    DateCheckinLicense: this.convertToDate(this.getIndexValueByName(sord, "DATE_CHECKIN")),
                    Notes: sord.desc,
                };
                if(sord.name !== ""){tableData.push(row);} // Add the row to the table}
                subData = [];
            });
            if (!fr.moreResults) break;
            // Fetch next set of results
            fr = await ixConnect.ix().findNextSords(fr.searchId, fr.sords.length, 1000, Session.CONST.SORD.mbAllIndex);
        }
        console.log("Asset CheckinLicense Results: ", tableData)
        
        await ixConnect.ix().findClose(fr.searchId);
        return tableData; // Return the complete table data
    },

    inputLicense: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset License", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_TAG", form.AssetTag);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "SOFTWARE_NAME", form.SoftwareName);
        this.setIndexValueByName(data, "CATEGORY_NAME", form.CategoryNamet);
        this.setIndexValueByName(data, "ASSET_SEAT", form.Seat);
        this.setIndexValueByName(data, "MINIMUM_QTY", form.MinimumQty);
        this.setIndexValueByName(data, "ASSET_PRODUCT_KEY", form.ProductKey);
        this.setIndexValueByName(data, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(data, "ASSET_MANUFACTURE_NAME", form.ManufactureName);
        this.setIndexValueByName(data, "LICENSE_TO_NAME", form.LicenseToName);
        this.setIndexValueByName(data, "LICENSE_TO_EMAIL", form.LicenseToEmail);
        this.setIndexValueByName(data, "REASSIGNABLE", form.Reassignable);
        this.setIndexValueByName(data, "ASSET_SUPPLIER_NAME", form.SupplierName);
        this.setIndexValueByName(data, "ASSET_ORDER_NO", form.OrderNo);
        this.setIndexValueByName(data, "ASSET_PURCHASE_CURRENCY", form.PurchaseCurrency);
        this.setIndexValueByName(data, "ASSET_PURCHASE_COST", form.PurchaseCost);

        this.setIndexValueByName(data, "PURCHASE_DATE", this.formatYYYYMMDD(form.PurchaseDate));
        this.setIndexValueByName(data, "EXPIRED_DATE", this.formatYYYYMMDD(form.ExpiredDate));
        this.setIndexValueByName(data, "TERMINATION_DATE", this.formatYYYYMMDD(form.TerminationDate));
        this.setIndexValueByName(data, "PURCHASE_ORDER_NO", form.PurchaseOrderNo);
        this.setIndexValueByName(data, "DEPRECIATION_NAME", form.DepreciationName);
        this.setIndexValueByName(data, "MAINTAINED", form.Maintained);
        data.desc = form.Notes;

        this.setIndexValueByName(data, "DATE_CREATED", this.formatYYYYMMDD(form.DateCreated));
        this.setIndexValueByName(data, "DATE_UPDATED", this.formatYYYYMMDD(form.DateUpdated));
        this.setIndexValueByName(data, "CHECKOUTS_COUNT", form.CheckoutCount);
        this.setIndexValueByName(data, "CHECKINS_COUNT", form.CheckinCount);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputCheckoutLicense: async function (form) {
        let date = new Date();
        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset CheckoutLicense", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "CHECKOUT_NAME", form.CheckoutLicenseName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(data, "CHECKOUT_TO", form.CheckoutTo);
        this.setIndexValueByName(data, "USER_ASSET", form.UserAsset);
        this.setIndexValueByName(data, "DATE_CHECKOUT", this.formatYYYYMMDD(form.DateCheckoutLicense));
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputCheckinLicense: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;
        let data = await ixConnect.ix().createSord(52066, "Asset CheckinLicense", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "CHECKIN_NAME", form.CheckinLicenseName);
        this.setIndexValueByName(data, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(data, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(data, "ASSET_PRODUCT_KEY", form.ProductKey);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(data, "UPDATE_LOCATION", form.UpdateLocation);
        this.setIndexValueByName(data, "UPDATE_LOCATION_DEFAULT", form.UpdateLocationDefault);
        this.setIndexValueByName(data, "DATE_CHECKIN", this.formatYYYYMMDD(form.DateCheckinLicense));
        data.desc = form.Notes;

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    updateLicense: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_TAG", form.AssetTag);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "SOFTWARE_NAME", form.SoftwareName);
        this.setIndexValueByName(curSord, "CATEGORY_NAME", form.CategoryNamet);
        this.setIndexValueByName(curSord, "ASSET_SEAT", form.Seat);
        this.setIndexValueByName(curSord, "MINIMUM_QTY", form.MinimumQty);
        this.setIndexValueByName(curSord, "ASSET_PRODUCT_KEY", form.ProductKey);
        this.setIndexValueByName(curSord, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(curSord, "ASSET_MANUFACTURE_NAME", form.ManufactureName);
        this.setIndexValueByName(curSord, "LICENSE_TO_NAME", form.LicenseToName);
        this.setIndexValueByName(curSord, "LICENSE_TO_EMAIL", form.LicenseToEmail);
        this.setIndexValueByName(curSord, "REASSIGNABLE", form.Reassignable);
        this.setIndexValueByName(curSord, "ASSET_SUPPLIER_NAME", form.SupplierName);
        this.setIndexValueByName(curSord, "ASSET_ORDER_NO", form.OrderNo);
        this.setIndexValueByName(curSord, "ASSET_PURCHASE_CURRENCY", form.PurchaseCurrency);
        this.setIndexValueByName(curSord, "ASSET_PURCHASE_COST", form.PurchaseCost);

        this.setIndexValueByName(curSord, "PURCHASE_DATE", this.formatYYYYMMDD(form.PurchaseDate));
        this.setIndexValueByName(curSord, "EXPIRED_DATE", this.formatYYYYMMDD(form.ExpiredDate));
        this.setIndexValueByName(curSord, "TERMINATION_DATE", this.formatYYYYMMDD(form.TerminationDate));
        this.setIndexValueByName(curSord, "PURCHASE_ORDER_NO", form.PurchaseOrderNo);
        this.setIndexValueByName(curSord, "DEPRECIATION_NAME", form.DepreciationName);
        this.setIndexValueByName(curSord, "MAINTAINED", form.Maintained);
        curSord.desc = form.Notes;

        this.setIndexValueByName(curSord, "DATE_CREATED", this.formatYYYYMMDD(form.DateCreated));
        this.setIndexValueByName(curSord, "DATE_UPDATED", this.formatYYYYMMDD(form.DateUpdated));
        this.setIndexValueByName(curSord, "CHECKOUTS_COUNT", form.CheckoutCount);
        this.setIndexValueByName(curSord, "CHECKINS_COUNT", form.CheckinCount);
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateCheckoutLicense: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "CHECKOUT_NAME", form.CheckoutLicenseName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(curSord, "CHECKOUT_TO", form.CheckoutTo);
        this.setIndexValueByName(curSord, "USER_ASSET", form.UserAsset);
        this.setIndexValueByName(curSord, "DATE_CHECKOUT", this.formatYYYYMMDD(form.DateCheckoutLicense));
        curSord.desc = form.Notes;
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateCheckinLicense: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "CHECKIN_NAME", form.CheckinLicenseName);
        this.setIndexValueByName(curSord, "ASSET_NAME", form.AssetName);
        this.setIndexValueByName(curSord, "ASSET_CATEGORY_NAME", form.CategoryName);
        this.setIndexValueByName(curSord, "ASSET_PRODUCT_KEY", form.ProductKey);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(curSord, "UPDATE_LOCATION", form.UpdateLocation);
        this.setIndexValueByName(curSord, "UPDATE_LOCATION_DEFAULT", form.UpdateLocationDefault);
        this.setIndexValueByName(curSord, "DATE_CHECKIN", this.formatYYYYMMDD(form.DateCheckinLicense));
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
