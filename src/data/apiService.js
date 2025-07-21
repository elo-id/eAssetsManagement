import de from '@elo/eloixclient';
import { RestUtils, Session } from '@elo/session';

function fetchAsset({
    maskId = "Assets",
    maxResults = 1000, // Default max results, use 0 for no limit but avoid large datasets
    selector = Session.CONST.SORD.mbAllIndex,
    pageSize = 500 // Allow custom page size
} = {}) {
    const ixConnect = Session.IX;
    return new Promise((resolve, reject) => {
        const findInfo = prepareFI();
        findInfo.findByIndex.maskId = maskId;
        const callback = new de.elo.ix.client.AsyncCallback(
            result => {
                // Use push for efficiency
                callback.results.push(...result.sords);
                if (result.moreResults && callback.paginate && callback.results.length < callback.maxResults) {
                    ixConnect.ix().findNextSords(result.searchId, callback.results.length, pageSize, callback.sordOptions, callback);
                } else {
                    ixConnect.ix().findClose(result.searchId, new de.elo.ix.client.AsyncCallback(() => {}, () => {}));
                    resolve(callback.results);
                }
            },
            error => reject(error)
        );
        callback.maxResults = maxResults;
        callback.sordOptions = selector;
        callback.paginate = maxResults > pageSize;
        callback.results = [];
        ixConnect.ix().findFirstSords(findInfo, callback.paginate ? pageSize : maxResults, callback.sordOptions, callback);
    });
}

function prepareFI(){
    let fi = new de.elo.ix.client.FindInfo();
    let fx = new de.elo.ix.client.FindByIndex();
    fi.findByIndex = fx;
    fi.findOptions = new de.elo.ix.client.FindOptions();
    fi.findOptions.totalCount = 2147483645;
    fi.findOptions.timeoutSeconds = 20;
    return fi;
}

function formatDateYYYYMMDD(str) {
    // Expects str like "20250715", returns "2025-07-15"
    if (!str || str.length !== 8) return "";
    return `${str.slice(0,4)}-${str.slice(4,6)}-${str.slice(6,8)}`;
  }
  

export async function mapAssetsData() {
    // Fetch all datasets at once (parallel)
    const [rawAssets, rawLocations, rawCategories] = await Promise.all([
      fetchAsset({ maxResults: 2000, selector: Session.CONST.SORD.mbLean, maskId: "Assets" }),
      fetchAsset({ maxResults: 2000, selector: Session.CONST.SORD.mbLean, maskId: "Asset Location" }),
      fetchAsset({ maxResults: 2000, selector: Session.CONST.SORD.mbLean, maskId: "Asset Category" })
    ]);
  
    // Helper: get value from objKeys by key name
    const getObjKey = (objKeys, key) => {
      const found = objKeys.find(k => k.name === key);
      return found && found.data.length ? found.data[0] : "";
    };
  
    // --- 1. Map Assets ---
    const assets = rawAssets.map(item => {
      const objKeys = item.objKeys || [];
      return {
        assetTag: getObjKey(objKeys, "ASSET_TAG"),
        assetName: getObjKey(objKeys, "ASSET_NAME"),
        modelName: getObjKey(objKeys, "ASSET_MODEL_NAME"),
        locationName: getObjKey(objKeys, "ASSET_LOCATION_NAME"),
        warranty: getObjKey(objKeys, "ASSET_WARRANTY"),
        purchaseDate: formatDateYYYYMMDD(getObjKey(objKeys, "PURCHASE_DATE")),
        supplierName: getObjKey(objKeys, "ASSET_SUPPLIER_NAME"),
        purchaseCost: getObjKey(objKeys, "ASSET_PURCHASE_COST"),
        status: getObjKey(objKeys, "ASSET_STATUS"),
        categoryName: getObjKey(objKeys, "ASSET_CATEGORY_NAME"),
        categoryType: getObjKey(objKeys, "ASSET_CAT_TYPE"),
        coordinate: [
          Number(getObjKey(objKeys, "LATITUDE") || 0),
          Number(getObjKey(objKeys, "LONGITUDE") || 0)
        ],
      };
    });
  
    // --- 2. Map Locations ---
    const location = rawLocations.map(item => {
      const objKeys = item.objKeys || [];
      return {
        name: getObjKey(objKeys, "ASSET_COMPANY_NAME"),
        item: getObjKey(objKeys, "ASSET_MANAGER_NAME"),
        assigned: getObjKey(objKeys, "ASSET_ADDRESS"),
        user: getObjKey(objKeys, "CITY"),
        country: getObjKey(objKeys, "COUNTRY"),
        coordinates: [
          Number(getObjKey(objKeys, "LATITUDE") || 0),
          Number(getObjKey(objKeys, "LONGITUDE") || 0)
        ],
      };
    });
  
    // --- 3. Map Categories ---
    const category = rawCategories.map(item => {
      const objKeys = item.objKeys || [];
      return {
        name: getObjKey(objKeys, "ASSET_CATEGORY_NAME"),
        type: getObjKey(objKeys, "ASSET_CAT_TYPE"),
        eula: getObjKey(objKeys, "CATEGORY_EULA")
      };
    });
  
    // --- 4. Map Status (Pie Chart Data) ---
    const status = {};
    assets.forEach(asset => {
      const stat = asset.status || "Unknown";
      status[stat] = (status[stat] || 0) + 1;
    });
  
    // --- 5. Map Summary ---
    const summary = {
      assets: assets.length,
      people: location.length,
      categories: category.length,
    };
  
    // --- 6. Done! Return shaped data ---
    return {
      summary,
      status,
      assets,
      location,
      category
    };
  }
  