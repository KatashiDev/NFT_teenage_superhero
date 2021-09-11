import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DefaultAvatar } from '../../constants';
import { nFormatter } from '../../utils/helper';
import LikeIcon from './LikeIcon';
import moonstartoken from '../../assets/img/icons/moonstar-icon.svg';
import bnbIcon from '../../assets/img/icons/bnb-icon.svg';
import logoImage from '../../assets/img/logo.jpg';
import { useMediaQuery } from 'react-responsive';

export const TokenIcon = styled.img`
    display: flex;
    width: 35px;
    height: 35px;
    border-radius: 50%;
`;

const ItemCard = ({nft, viewButton=false}) => {
    const web3 = useSelector((state) => state.web3);
    const price = useSelector((state) => state.price);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    const [tokenPrice, setTokenPrice] = useState({
        bnb: price.bnb,
        moonstar: price.moonstar,
    });

    useEffect(() => {
        setTokenPrice(price);
    }, [price]);

    const [isMyItem, setIsMyItem] = useState(false);

    useEffect(() => {
        if(web3 && nft && web3.userAccount) {
            const myAddress = web3.userAccount.toLowerCase();
            setIsMyItem((nft.owner || "").toLowerCase() === myAddress || (nft.pairOwner || "").toLowerCase() === myAddress);
        }
    }, [nft, web3])
    
    const onClickItem = (e, collectionId, nftId) => {
        e.preventDefault();
        viewItem(collectionId, nftId);
    }

    const viewItem = (collectionId, nftId) => {
        window.location = `view/${collectionId}/${nftId}`;
    };

    const linkToUser = (e, address) => {
        e.preventDefault();

        if(isMyItem) {
            window.location = `/profile`;
        }else {
            window.location = `/profile/${address}`
        }
    }

    return ( nft &&
        <div
            className="nft-card"
        >
            {nft.auction && (
                <div className="ribbon base">
                    <span>AUCTION</span>
                </div>
            )}
            <div className="nft-card__img" onClick={(e) => onClickItem(e, nft.collectionId, nft.tokenId)}>
                <div className="d-flex justify-content-center align-items-center image-wrapper">
                    <>
                    <img src={logoImage} alt="nft1" />
                    </>
                </div>
            </div>
            <div className="nft-card__body">
                <div className="nft-card__meta">
                    <h2 className="nft-card__title">{nft.name}</h2>
                </div>
                <div className="nft-card-user">
                    <div className="d-flex align-items-center justify-content-start">
                        <div className="nft-card__avatar" onClick={(e) => linkToUser(e, nft.user.address)}>
                            <img src={nft.user && nft.user.avatar ? nft.user.avatar : DefaultAvatar} alt="avatar" />
                        </div>
                        <div className="nft-card__username" onClick={(e) => linkToUser(e, nft.user.address)}>
                            <p>{nft.user && nft.user.name ? `@${nft.user.name}` : '@Artist'}</p>
                        </div>
                    </div>
                    {isMobile && viewButton && (
                        <div className="d-flex align-items-center text-white">
                            <LikeIcon likes={nft.likes} enabled collectionId={nft.collectionId} tokenId={nft.tokenId}/>
                        </div>
                    )}
                </div>    
                
            </div>
        </div>
    );
}

export default ItemCard;