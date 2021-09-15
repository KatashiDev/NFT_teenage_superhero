const itemModel = require("../models/itemModel");
const User = require("../models/usersModel");
const IPFS = require('ipfs-api');
const fs = require("fs")
const Item = require("../models/itemModel");
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const items = async (req, res) => {
    let query = {
        owner: req.body.owner
    };
    
    itemModel.find(query)
    .then(result => {
        res.json({items: result});
    })
    .catch(err => {
        console.log(err);
    })
}

const saveItem = (req, res) => {
    let item = new itemModel({
        ...req.body
    });
    try {
        item.save()
        res.json("success");
    } catch( err ) {
        console.log(err)
        res.json("fail");
    }
}

const viewItem = (req, res) => {
    itemModel.findOne({collectionId: req.query.collection_id, tokenId: req.query.id})
    .then(async result => {
        let creatorObj = await User.findOne({ address: result.creator.toLowerCase() });
        let ownerObj = await User.findOne({ address: result.owner.toLowerCase() });
        console.log(creatorObj)
        let data = {
            _id: result._id,
            tokenId: result.tokenId,
            pairKey: result.pairKey,
            collectionId: result.collectionId,
            name: result.name,
            price: result.price,
            assetType: result.assetType,
            auction: result.auction,
            metadata: result.metadata,
            image: result.image,
            creator: result.creator,
            owner: result.owner,
            currency: result.currency,
            royalties: result.royalties,
            description: result.description,
            txHash: result.txHash,
            status: result.status,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            creatorObj: creatorObj,
            ownerObj: ownerObj,
            sellingStatus: result.sellingStatus,
        };
        console.log(data)
        res.json({item: data});
    })
    .catch(err => {
        console.log(err)
    })
}

const updateItem = async ( req, res ) => {
    let item = await itemModel.findOne({tokenId: req.body.tokenId});
    item.metadata = req.body.metadata;
    item.image = req.body.image;
    await item.save();
    res.json("success");
}

const getFileBuffer = async ( req, res ) => {
    const file_path = appRoot + '/assets/1.png';
    fs.readFile(file_path, async (err, buffer) => {
        try {
            const result = await ipfs.files.add(Buffer.from(buffer));
            res.json({status: "success", result: result})
        } catch (err) {
            console.log(err)
        }
    })
}

const getSampleImageResult = async ( req, res ) => {
    const file_path = appRoot + '/assets/sample.jpg';
    fs.readFile(file_path, async (err, buffer) => {
        try {
            const result = await ipfs.files.add(Buffer.from(buffer));
            res.json({status: "success", result: result})
        } catch (err) {
            console.log(err)
        }
    })
}

const getTotalCount = async ( req, res ) => {
    let totalCount = 0;
    const count = await itemModel.aggregate([
        {$count: "totalCount"}
    ])
    console.log(count);
    if (count.length > 0) {
        totalCount = count[0].totalCount
    }
    return res.json(totalCount)
}

const getMultiTokenURIs = async (req, res) => {
    let tokenURIs = [];
    let tokenIds = req.body.tokenIds;
    for(let i = 0; i < tokenIds.length; i++) {
        const file_path = appRoot + '/assets/main_images/' + tokenIds[i] + ".png";
        await new Promise(fs.readFile(file_path, async (err, buffer) => {
            try {
                const result = await ipfs.files.add(Buffer.from(buffer));
                console.log(result)
                tokenURIs.push(result[0].hash)
            } catch (err) {
                console.log(err)
            }
        }))
    }
    console.log(tokenURIs);
    res.json({data: tokenURIs});
}

module.exports = {
    saveItem,
    viewItem,
    items,
    updateItem,
    getFileBuffer,
    getTotalCount,
    getSampleImageResult,
    getMultiTokenURIs
};