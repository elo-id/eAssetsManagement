import de from '@elo/eloixclient';
import { RestUtils, Session } from '@elo/session';

export const newsData = {
    findCompany: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Company"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findDepartment: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Department"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findLocation: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset Location"; // Sets the mask ID for the search
        fi.findByIndex = fx; // Sets the find by index criteria
        fi.findOptions = new de.elo.ix.client.FindOptions(); // Initializes find options
        fi.findOptions.totalCount = 2147483645; // Sets the total count for the search
        fi.findOptions.timeoutSeconds = 20; // Sets the timeout for the search
        return fi;
    },

    findPeople: function () {
        let fi = new de.elo.ix.client.FindInfo(); // Initializes a FindInfo object
        let fx = new de.elo.ix.client.FindByIndex(); // Initializes a FindByIndex object
        fx.maskId = "Asset People"; // Sets the mask ID for the search
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
    
    tableLocation: async function () {
        let ixConnect = Session.IX;
        let fi = this.findLocation();
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
                    CompanyName: this.getIndexValueByName(sord, "ASSET_COMPANY_NAME"),
                    ManagerName: this.getIndexValueByName(sord, "ASSET_MANAGER_NAME"),
                    LocationName: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    Address: this.getIndexValueByName(sord, "ASSET_ADDRESS"),
                    City: this.getIndexValueByName(sord, "CITY"),
                    Country: this.getIndexValueByName(sord, "COUNTRY"),
                    Notes: sord.desc,
                    Latitude: this.getIndexValueByName(sord, "LATITUDE"),
                    Longitude: this.getIndexValueByName(sord, "LONGITUDE"),
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

    tableCompany: async function () {
        let ixConnect = Session.IX;
        let fi = this.findCompany();
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
                    CompanyName: this.getIndexValueByName(sord, "ASSET_COMPANY_NAME"),
                    Phone: this.getIndexValueByName(sord, "PHONE"),
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

    tableDepartment: async function () {
        let ixConnect = Session.IX;
        let fi = this.findDepartment();
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
                    DepartmentName: this.getIndexValueByName(sord, "ASSET_DEPARTMENT_NAME"),
                    CompanyName: this.getIndexValueByName(sord, "ASSET_COMPANY_NAME"),
                    AssetName: this.getIndexValueByName(sord, "ASSET_MANAGER_NAME"),
                    LocationName: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    Notes: sord.desc
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

    tablePeople: async function () {
        let ixConnect = Session.IX;
        let fi = this.findPeople();
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
                    PeopleName: this.getIndexValueByName(sord, "ASSET_MANAGER_NAME"),
                    CompanyName: this.getIndexValueByName(sord, "ASSET_COMPANY_NAME"),
                    DepartmentName: this.getIndexValueByName(sord, "ASSET_DEPARTMENT_NAME"),
                    LocationName: this.getIndexValueByName(sord, "ASSET_LOCATION_NAME"),
                    VipUser: this.getIndexValueByName(sord, "ASSET_VIP_USER"),
                    AutoAssignLicense: this.getIndexValueByName(sord, "AUTO_ASSIGN_LICENSE"),
                    Notes: sord.desc,
                    TotalAssetsCost: this.getIndexValueByName(sord, "TOTAL_ASSETS_COST"),
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

    inputLocation: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Location", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(data, "ASSET_MANAGER_NAME", form.ManagerName);
        data.desc = form.Notes;
        this.setIndexValueByName(data, "ASSET_ADDRESS", form.Address);
        this.setIndexValueByName(data, "CITY", form.City);
        this.setIndexValueByName(data, "COUNTRY", form.Country);
        this.setIndexValueByName(data, "LATITUDE", form.Latitude);
        this.setIndexValueByName(data, "LONGITUDE", form.Longitude);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputDepartment: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Department", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(data, "ASSET_MANAGER_NAME", form.ManagerName);
        data.desc = form.Notes;
        this.setIndexValueByName(data, "ASSET_DEPARTMENT_NAME", form.DepartmentName);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputPeople: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset People", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_DEPARTMENT_NAME", form.DepartmentName);
        this.setIndexValueByName(data, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(data, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(data, "ASSET_MANAGER_NAME", form.ManagerName);
        data.desc = form.Notes;
        this.setIndexValueByName(data, "ASSET_VIP_USER", form.VipUser);
        this.setIndexValueByName(data, "AUTO_ASSIGN_LICENSE", form.AutoAssignLicense);
        this.setIndexValueByName(data, "TOTAL_ASSETS_COST", form.TotalAssetsCost);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    inputCompany: async function (form) {
        let date = new Date();

        let ixConnect = Session.IX;

        let data = await ixConnect.ix().createSord(52066, "Asset Company", Session.CONST.SORD.mbAll);
        
        data.name = form.name;
        console.log("data name: ", data.name)

        this.setIndexValueByName(data, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(data, "PHONE", form.Phone);

        let objID = await ixConnect.ix().checkinSord(data, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
        console.log("objid: ", objID)
        // this.uploadDoc(data.name, image, objID);
    },

    updateDepartment: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(curSord, "ASSET_MANAGER_NAME", form.ManagerName);
        curSord.desc = form.Notes;
        this.setIndexValueByName(curSord, "ASSET_DEPARTMENT_NAME", form.DepartmentName);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateLocation: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(curSord, "ASSET_MANAGER_NAME", form.ManagerName);
        curSord.desc = form.Notes;
        this.setIndexValueByName(curSord, "ASSET_ADDRESS", form.Address);
        this.setIndexValueByName(curSord, "CITY", form.City);
        this.setIndexValueByName(curSord, "COUNTRY", form.Country);
        this.setIndexValueByName(curSord, "LATITUDE", form.Latitude);
        this.setIndexValueByName(curSord, "LONGITUDE", form.Longitude);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updatePeople: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_DEPARTMENT_NAME", form.DepartmentName);
        this.setIndexValueByName(curSord, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(curSord, "ASSET_LOCATION_NAME", form.LocationName);
        this.setIndexValueByName(curSord, "ASSET_MANAGER_NAME", form.ManagerName);
        curSord.desc = form.Notes;
        this.setIndexValueByName(curSord, "ASSET_VIP_USER", form.VipUser);
        this.setIndexValueByName(curSord, "AUTO_ASSIGN_LICENSE", form.AutoAssignLicense);
        this.setIndexValueByName(curSord, "TOTAL_ASSETS_COST", form.TotalAssetsCost);
        // this.setIndexValueByName(curSord, "PROJECT_SCOPE", scope)
        await ixConnect.ix().checkinSord(curSord, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);
    },

    updateCompany: async function (objID, form) {
        let ixConnect = Session.IX;
        let curSord = await ixConnect.ix().checkoutSord(objID, Session.CONST.SORD.mbAll, Session.CONST.LOCK.NO);

        curSord.name = form.name;
        console.log("data name: ", curSord.name)

        this.setIndexValueByName(curSord, "ASSET_COMPANY_NAME", form.CompanyName);
        this.setIndexValueByName(curSord, "PHONE", form.Phone);
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
