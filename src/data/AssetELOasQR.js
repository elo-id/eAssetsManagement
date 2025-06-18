if (EM_WF_NODE.nodeName == "QR_GENERATED") {
    log.info("Proses generate QR started on " + EM_ACT_SORD.name);

    let template = fu.getTempFile(70477);
    let document = new Packages.com.aspose.words.Document(template);
    var bookmarkqr = document.getRange().getBookmarks().get("QR");
    var bookmarks = document.getRange().getBookmarks();

    bookmarks.get("Asset_Tag").setText(ix.getIndexValueByName(EM_ACT_SORD, "ASSET_TAG"));
    bookmarks.get("Serial").setText(ix.getIndexValueByName(EM_ACT_SORD, "SERIAL"));
    bookmarks.get("Model").setText(ix.getIndexValueByName(EM_ACT_SORD, "ASSET_MODEL_NAME"));
    bookmarks.get("Company").setText(ix.getIndexValueByName(EM_ACT_SORD, "ASSET_COMPANY_NAME"));
    bookmarks.get("Location").setText(ix.getIndexValueByName(EM_ACT_SORD, "ASSET_LOCATION_NAME"));
    insertImage(document, bookmarkqr, "Https://ecm.mallyoza.com/asset/" + EM_ACT_SORD.id);
    document.save(template, Packages.com.aspose.words.SaveFormat.PDF);
    uploadDoc("Testqr", template);

    log.info("Proses generate QR ended");
}

function uploadDoc(shortName, template) {
    let sord = ixConnect.ix().createDoc(String(EM_ACT_SORD.id), "Basic Entry", null, ixConnect.getCONST().EDIT_INFO.mbSordDocAtt).getSord();
    sord.setName(shortName);
    let doc = new Packages.de.elo.ix.client.Document();
    let dv = new DocVersion();
    dv.setPathId(sord.getPath());
    dv.setEncryptionSet(sord.getDetails().getEncryptionSet());
    dv.setExt("pdf");
    let dvs = java.lang.reflect.Array.newInstance(DocVersion, 1);
    dvs[0] = dv;
    doc.setDocs(dvs);
    doc = ixConnect.ix().checkinDocBegin(doc);
    dv = doc.getDocs()[0];
    let url = dv.getUrl();
    dv.setUploadResult(ixConnect.upload(url, template));
    doc = ixConnect.ix().checkinDocEnd(sord, SordC.mbAll, doc, LockC.NO);
    log.info("ObjID: " + doc.getObjId());
    fu.deleteFile(template);
}

function encodeQR(url) {
    var qrCodeWriter = new Packages.com.google.zxing.qrcode.QRCodeWriter();
    var bitMatrix = qrCodeWriter.encode(url, Packages.com.google.zxing.BarcodeFormat.QR_CODE, 512, 512);
    return Packages.com.google.zxing.client.j2se.MatrixToImageWriter.toBufferedImage(bitMatrix);
}
function insertImage(doc, bookmark, url) {
    var buffImg = encodeQR(url);
    var docbuild = new com.aspose.words.DocumentBuilder(doc);
    docbuild.moveTo(bookmark.getBookmarkStart());
    var shape = docbuild.insertImage(buffImg);
    shape.setHeight(20);
    shape.setWidth(120);
}