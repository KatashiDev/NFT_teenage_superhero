const express = require('express');
const apiCtrl = require('../controller/apiCtrl.js');
const userCtrl = require('../controller/userCtrl.js');
const router = express.Router();

router.post("/login", userCtrl.login);
router.get("/user/:id", userCtrl.user);
router.post("/user/update", userCtrl.update);

router.post("/save_item", apiCtrl.saveItem);
router.post("/save_multi_item", apiCtrl.saveMultiItem);
router.post("/update_item", apiCtrl.updateItem);
router.post("/updateMultiItem", apiCtrl.updateMultiItem);
router.get("/item", apiCtrl.items);
router.get("/view_item", apiCtrl.viewItem);
router.get("/getTotalCount", apiCtrl.getTotalCount);
router.post("/getMintedCount", apiCtrl.getMintedCount);
router.post("/makeMetaFiles", apiCtrl.makeMetaFiles);

router.post("/getFileBuffer", apiCtrl.getFileBuffer);
router.post("/getMultiTokenURIs", apiCtrl.getMultiTokenURIs);
router.post("/getSampleImageResult", apiCtrl.getSampleImageResult);

router.post("/changeEnableMinting", apiCtrl.changeEnableMinting);
router.get("/getEnabled", apiCtrl.getEnabled);

module.exports = router;