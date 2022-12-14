import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Mint.css'
import { getWallet, NftData } from '../../../redux/redux/actions/actions'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from "react-toastify";
import { loadWeb3 } from '../../../apis/api';
import { busdNftTokenAbi, busdNftTokenAddress, wireNftContractAbi, wireNftContractAddress, wireTokenAbi, wireTokenAddress } from '../../../utilies/constant';
import Spinner from '../../Loading_Spinner/Spinner';
import axios from 'axios';
import { useMoralis, useMoralisFile } from 'react-moralis'
import { CreateNFT, CreateNFT_ABI, MintingContractAddress, MintingContract_ABI } from '../../../utilies/Contract';
import { Moralis } from 'moralis'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import zan from '../../../Assest/gameplay-thumbnail2.png'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
export default function Mint({ setModalShow, btnTxt }) {
    let dispatch = useDispatch();
    let { acc } = useSelector(state => state.connectWallet);

    console.log("check", acc);
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '0', name: 'NFT Name', description: '' })
    const [nftImage, setNftImage] = useState("")
    let [getInpiut, setGetInput] = useState({ first: "", second: "", third: "", image: "" })
    const [copyTest, setcopyTest] = useState(false)
    const [RefID, setRefID] = useState()
    const [userid, setuserid] = useState()


    let [addressacc, setaddressacc] = useState();
    let [isSpinner, setIsSpinner] = useState(false)
    let [myUrl, setMyUrl] = useState()
    const { saveFile, moralisFile } = useMoralisFile()
    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout, initialize } = useMoralis();

    let [value, setValue] = useState(1)
    let [point, setPoint] = useState(0);
    let [mintPriceBnb, setMintPriceBnb] = useState(0);
    let [mintPriceBUSD, setMintPriceBUSD] = useState(0);
    let [mintPriceWire, setmintPriceWire] = useState(0);
    let [btnOne, setButtonOne] = useState("Mint With BNB");
    let [btnTwo, setButtonTwo] = useState("Mint With Wire");
    let [btnThree, setButtonThree] = useState("Mint With Busd")

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const increaseValue = () => {
        if (value < 5) {
            setValue(++value)
            console.log("setValue", value)
        }

    }
    const decreaseValue = () => {
        if (value > 1) {
            setValue(--value)
            console.log("setValue", value)
        }

    }
    const myMintBNB = async () => {
        let acc = await loadWeb3();
        // console.log("ACC=",acc)
        if (acc == "No Wallet") {
            toast.error("No Wallet Connected")
        }
        else if (acc == "Wrong Network") {
            toast.error("Wrong Newtwork please connect to test net")
        } else {
            try {
                setButtonOne("Please Wait While Processing")
                console.log("mintFor BNB");
                const web3 = window.web3;
                let nftContractOf = new web3.eth.Contract(MintingContract_ABI, MintingContractAddress);
                let maxSupply = await nftContractOf.methods.maxsupply().call();
                let ttlSupply = await nftContractOf.methods.totalSupply().call();
                let paused = await nftContractOf.methods.paused().call();
                let maxLimitprTransaction = await nftContractOf.methods.MaxLimitPerTransaction().call();
                let mintingbnbPrice = await nftContractOf.methods.MinitngPricein_BNB().call()
                console.log("jjjjj", mintingbnbPrice);
                mintingbnbPrice = web3.utils.fromWei(mintingbnbPrice);
                mintingbnbPrice = parseFloat(mintingbnbPrice)
                setMintPriceBnb(mintingbnbPrice)
                let totalMintingPriceBNB = value * mintingbnbPrice
                console.log("maxSupply", maxSupply);
                console.log("ttlSupply", maxLimitprTransaction);

                console.log("mintingbnbPrice", mintingbnbPrice);

                // let llisted_check = await nftContractOf.methods.iswhitelist(acc).call()
                // console.log("iswhitelist", llisted_check);



                // if (llisted_check == 'true') {
                if (parseInt(ttlSupply) < parseInt(maxSupply)) {
                    if (paused == true) {
                        if (value < parseInt(maxLimitprTransaction)) {
                            console.log("Minting Value= ", value);
                            console.log("Minting totalMintingPriceBNB= ", totalMintingPriceBNB);

                            totalMintingPriceBNB = web3.utils.toWei(totalMintingPriceBNB.toString())
                            await nftContractOf.methods.mint_with_bnb(value).send({
                                from: acc,
                                value: totalMintingPriceBNB.toString()

                            })
                            toast.success("Transaction Confirmed")
                            setButtonOne("Mint With BNB")

                        } else {
                            toast.error("No of Minting is Greater than maximum limit Per Transaction")
                            setButtonOne("Mint With BNB")

                        }
                    } else {
                        toast.error("Paused is False")
                        setButtonOne("Mint With BNB")

                    }

                } else {
                    toast.error("Max Supply is Greater than total Supply")
                    setButtonOne("Mint With BNB")

                }
                // }
                // else {
                //     let BusdPrice = await nftContractOf.methods.WhitelistMintingPricein_MATIC().call();

                //     await nftContractOf.methods.mint_with_MATIC(value).send({
                //         from: acc,
                //         value: value * BusdPrice.toString()
                //     })


                //     toast.success("Transaction Confirmed")
                //     setButtonOne("Mint With BNB")


                // }




            } catch (e) {
                console.log("Error while minting ", e)
                toast.error("Transaction failed")
                setButtonOne("Mint With BNB")

            }

        }
    }
    const myMintWire = async () => {
        let acc = await loadWeb3();
        // console.log("ACC=",acc)
        if (acc == "No Wallet") {
            toast.error("No Wallet Connected")
        }
        else if (acc == "Wrong Network") {
            toast.error("Wrong Newtwork please connect to test net")
        } else {
            try {
                setButtonTwo("Please Wait While Processing")
                console.log("mintFor Wire");
                const web3 = window.web3;
                let nftContractOf = new web3.eth.Contract(wireNftContractAbi, wireNftContractAddress);
                let wireContractOf = new web3.eth.Contract(wireTokenAbi, wireTokenAddress);
                let userBusdBalance = await wireContractOf.methods.balanceOf(acc).call();
                userBusdBalance = web3.utils.fromWei(userBusdBalance)
                let maxSupply = await nftContractOf.methods.maxsupply().call();
                let ttlSupply = await nftContractOf.methods.totalSupply().call();
                let paused = await nftContractOf.methods.paused().call();
                let maxLimitprTransaction = await nftContractOf.methods.MaxLimitPerTransaction().call();
                let mintingWirePrice = await nftContractOf.methods.MinitngPricein_wire().call()
                mintingWirePrice = web3.utils.fromWei(mintingWirePrice);
                mintingWirePrice = parseFloat(mintingWirePrice)
                setmintPriceWire(mintingWirePrice);
                let totalMintingPriceWire = value * mintingWirePrice
                console.log("maxSupply", maxSupply);


                // let llisted_check = await nftContractOf.methods.iswhitelist(acc).call()
                // console.log("iswhitelist", llisted_check);


                // if (llisted_check == 'true') {

                if (parseInt(ttlSupply) < parseInt(maxSupply)) {
                    console.log("mintingWirePrice", paused);
                    if (paused !== false) {
                        if (value < parseInt(maxLimitprTransaction)) {
                            if (parseFloat(userBusdBalance) >= totalMintingPriceWire) {


                                totalMintingPriceWire = web3.utils.toWei(totalMintingPriceWire.toString())
                                console.log("totalMintingPriceWire", totalMintingPriceWire);

                                await wireContractOf.methods.approve(wireNftContractAddress, totalMintingPriceWire).send({
                                    from: acc
                                })
                                toast.success("Transaction Approved")
                                setButtonTwo("Please Wait for Second Confirmation")
                                let totalMintingPriceWirereponce = await nftContractOf.methods.mint_with_wire(value, totalMintingPriceWire.toString(), RefID).send({
                                    from: acc,
                                })
                                // console.log('what is hash', totalMintingPriceWirereponce.transactionHash)

                                let ress = await axios.post('https://metahorse.herokuapp.com/buynfttoken', {
                                    sid: userid,
                                    address: acc,
                                    nft: value,
                                    token: '100',
                                    txn: totalMintingPriceWirereponce.transactionHash

                                })
                                console.log("REsponse", ress);
                                toast.success("Transaction Successful")
                                setButtonTwo("Mint With Wire")

                            } else {
                                toast.error("Out Of Balance")
                                setButtonTwo("Mint With Wire")

                            }

                        } else {
                            toast.error("No of Minting is Greater than maximum limit Per Transaction")
                            setButtonTwo("Mint With Wire")

                        }
                    } else {
                        toast.error("Paused is False")
                        setButtonTwo("Mint With Wire")

                    }

                } else {
                    toast.error("Max Supply is Greater than total Supply")
                    setButtonTwo("Mint With Wire")

                }

                // }
                // else {

                //     let BusdPrice = await nftContractOf.methods.WhitelistMinitngPricein_MMX().call();
                //     totalMintingPriceWire = web3.utils.toWei(totalMintingPriceWire.toString())
                //     await wireContractOf.methods.approve(wireNftContractAddress, totalMintingPriceWire).send({
                //         from: acc
                //     })

                //     let a = web3.utils.fromWei(BusdPrice);
                //     a = parseFloat(a)
                //     let b = a * value;
                //     let c = web3.utils.toWei(b.toString());

                //     await nftContractOf.methods.mint_with_MMX(value, c).send({
                //         from: acc,
                //     })


                //     setButtonTwo("Mint With Wire")


                // }


            } catch (e) {
                console.log("Error while minting ", e)
                toast.error("Transaction failed")
                setButtonTwo("Mint With Wire")

            }

        }
    }
    const myMintBUSD = async () => {
        let acc = await loadWeb3();
        // console.log("ACC=",acc)
        if (acc == "No Wallet") {
            toast.error("No Wallet Connected")
        }
        else if (acc == "Wrong Network") {
            toast.error("Wrong Newtwork please connect to test net")
        } else {
            try {
                setButtonThree("Please Wait While Processing")
                console.log("mintFor BUSD");
                const web3 = window.web3;
                let nftContractOf = new web3.eth.Contract(wireNftContractAbi, wireNftContractAddress);
                let busdContractOf = new web3.eth.Contract(busdNftTokenAbi, busdNftTokenAddress);
                // let userBusdBalance = await busdContractOf.methods.balanceOf(acc).call();
                // console.log("maxSupply",busdContractOf);

                // userBusdBalance = web3.utils.fromWei(userBusdBalance)
                let maxSupply = await nftContractOf.methods.maxsupply().call();
                let ttlSupply = await nftContractOf.methods.totalSupply().call();
                let paused = await nftContractOf.methods.paused().call();
                let maxLimitprTransaction = await nftContractOf.methods.MaxLimitPerTransaction().call();
                let mintingBusdPrice = await nftContractOf.methods.MinitngPricein_BUSD().call()
                mintingBusdPrice = web3.utils.fromWei(mintingBusdPrice);
                mintingBusdPrice = parseFloat(mintingBusdPrice)
                setMintPriceBUSD(mintingBusdPrice)
                let totalMintingPriceBusd = value * mintingBusdPrice
                console.log("maxSupply", maxSupply);
                console.log("ttlSupply", maxLimitprTransaction);

                console.log("mintingBusdPrice", mintingBusdPrice);

                let llisted_check = await nftContractOf.methods.iswhitelist(acc).call()
                console.log("iswhitelist", llisted_check);


                if (llisted_check == 'true') {


                    if (parseInt(ttlSupply) < parseInt(maxSupply)) {
                        if (paused == false) {
                            if (value < parseInt(maxLimitprTransaction)) {
                                // if (parseFloat(userBusdBalance) >= totalMintingPriceBusd) {
                                console.log("Minting Value= ", value);
                                console.log("Minting totalMintingPriceWire= ", totalMintingPriceBusd);

                                totalMintingPriceBusd = web3.utils.toWei(totalMintingPriceBusd.toString())
                                await busdContractOf.methods.approve(wireNftContractAddress, totalMintingPriceBusd).send({
                                    from: acc
                                })
                                setButtonThree("Please Wait For Second Confirmation")
                                toast.success("Transaction Confirmed")
                                await nftContractOf.methods.mint_with_BUSD(value, totalMintingPriceBusd.toString()).send({
                                    from: acc,
                                })
                                setButtonThree("Mint With Busd")
                                toast.success("Transaction Succefful")

                                // } else {
                                //     toast.error("Out Of Balance")
                                //     setButtonThree("Mint With Busd")

                                // }

                            } else {
                                toast.error("No of Minting is Greater than maximum limit Per Transaction")
                                setButtonThree("Mint With Busd")

                            }
                        } else {
                            toast.error("Paused is False")
                            setButtonThree("Mint With Busd")

                        }

                    } else {
                        toast.error("Max Supply is Greater than total Supply")
                        setButtonThree("Mint With Busd")

                    }
                }
                else {
                    let BusdPrice = await nftContractOf.methods.WhitelistMinitngPricein_BUSD().call();
                    totalMintingPriceBusd = web3.utils.toWei(totalMintingPriceBusd.toString())
                    await busdContractOf.methods.approve(wireNftContractAddress, totalMintingPriceBusd).send({
                        from: acc
                    })
                    let a = web3.utils.fromWei(BusdPrice);
                    a = parseFloat(a)
                    let b = a * value;
                    let c = web3.utils.toWei(b.toString());
                    await nftContractOf.methods.mint_with_BUSD(value, c).send({
                        from: acc,
                    })

                    setButtonThree("Mint With Busd")


                }


            } catch (e) {
                console.log("Error while minting ", e)
                toast.error("Transaction failed BUSD")
                setButtonThree("Mint With Busd")

            }

        }
    }

    const getMydata = async () => {
        let acc = await loadWeb3();
        // console.log("ACC=",acc)
        if (acc == "No Wallet") {
            toast.error("No Wallet Connected")
        }
        else if (acc == "Wrong Network") {
            toast.error("Wrong Newtwork please connect to test net")
        } else {

            try {

                const web3 = window.web3;
                let nftContractOf = new web3.eth.Contract(wireNftContractAbi, wireNftContractAddress);
                // let mintingBusdPrice = await nftContractOf.methods.MinitngPricein_BUSD().call()
                // mintingBusdPrice = web3.utils.fromWei(mintingBusdPrice);
                // mintingBusdPrice = parseFloat(mintingBusdPrice)
                // setMintPriceBUSD(mintingBusdPrice)

                let mintingWirePrice = await nftContractOf.methods.MinitngPricein_wire().call()
                mintingWirePrice = web3.utils.fromWei(mintingWirePrice);
                mintingWirePrice = parseFloat(mintingWirePrice)
                setmintPriceWire(mintingWirePrice);

                // let mintingbnbPrice = await nftContractOf.methods.MinitngPricein_BNB().call()
                // mintingbnbPrice = web3.utils.fromWei(mintingbnbPrice);
                // mintingbnbPrice = parseFloat(mintingbnbPrice)
                // setMintPriceBnb(mintingbnbPrice)
            } catch (e) {
                console.log("Error while getting minting Price");
            }
        }
    }



    const ReferralAddress = async () => {
        let acc = await loadWeb3();

        const web3 = window.web3;

        try {

            let nftContractOf = new web3.eth.Contract(wireNftContractAbi, wireNftContractAddress);

            let userBusdBalance = await nftContractOf.methods.users(acc).call();
            userBusdBalance = userBusdBalance.deposit_time
            console.log("userBusdBalance", userBusdBalance);
            let URL = window.location.href;
            if (URL.includes("referrallink")) {
                let pathArray = URL.split('=');
                console.log("pathArray");
                setRefID(pathArray[pathArray.length - 1])



            } else {
                if (userBusdBalance == 0) {

                    setRefID("0x8c1c6a683e57d5927B6DEf7B951f58c92fC5e146")
                } else {
                    setRefID(acc)

                }

            }



        } catch (e) {
            console.log("Erroe Whille Referral Fuction Call", e);
        }
    }

    useEffect(() => {
        setInterval(() => {
            getMydata();

        }, 10000);
        getMydata();
        ReferralAddress()
    }, [])



    const IpfsStorage = async (e) => {
        e.preventDefault()
        console.log("nftImage", nftImage.name)
        console.log("formInput", formInput);

        if (nftImage == undefined) {
            toast.error("Please Upload Image")
        } else {
            let nftImageName = nftImage.name;
            if (nftImageName.endsWith(".jpg") || nftImageName.endsWith(".png") || nftImageName.endsWith(".gif") || nftImageName.endsWith(".mp4") || nftImageName.endsWith(".webp") || nftImageName.endsWith(".jpeg") || nftImageName.endsWith(".PNG") || nftImageName.endsWith(".JPG") || nftImageName.endsWith(".JPEG") || nftImageName.endsWith(".jpeg") || nftImageName.endsWith(".GIF") || nftImageName.endsWith(".WEBP") || nftImageName.endsWith(".MP4") || nftImageName.endsWith(".pjpeg") || nftImageName.endsWith(".jfif") || nftImageName.endsWith(".avif")
                || nftImageName.endsWith(".SVG") || nftImageName.endsWith(".svg") || nftImageName.endsWith(".apng") || nftImageName.endsWith(".APNG") || nftImageName.endsWith(".AVIF")
            ) {
                if (formInput.name == '' || formInput.price == '' || formInput.description == '') {
                    toast.error("Please Enter Data In Input Field")

                } else {
                    await authenticate({ signingMessage: "Log in using Moralis" }
                    ).then(async function (user) {
                        console.log("logged in user:", user);
                        const fileIpfs = new Moralis.File(formInput.name, nftImage)
                        await fileIpfs.saveIPFS(null, { useMasterKey: true })
                        console.log("Iamge", fileIpfs._ipfs);
                        let urlimage = fileIpfs._ipfs
                        setMyUrl(fileIpfs._ipfs)
                        let metaData = {
                            image: fileIpfs._ipfs,
                            description: formInput.description,
                            title: formInput.name,
                            name: formInput.price
                        }
                        const fileIpf = new Moralis.File("metadata.json", {
                            base64: btoa(JSON.stringify(metaData))
                        })
                        await fileIpf.saveIPFS(null, { useMasterKey: true })
                        console.log("files", fileIpf._ipfs);
                        let response = await axios.get(fileIpf._ipfs)
                        console.log("what is ipfs data", response.data)
                        let postapiPushdata = await axios.post('https://pegaxy-openmarket.herokuapp.com/nft_market', {
                            "imageurl": response.data.image,
                            "description": response.data.description,
                            "title": response.data.title,
                            "price": response.data.name,

                        })

                        console.log("what is post request response", postapiPushdata)

                        setGetInput(fileIpf._ipfs)

                        CreateNftUR(fileIpf._ipfs)

                    })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            } else {
                toast.error("Please Upload PNG, JPG, GIF, WEBP or MP4 Data")

            }

        }


        // let res = await axios.get("https://ipfs.moralis.io:2053/ipfs/QmdxwzpRRkfJfwLdqxbm2YsgaMXCopSJhJURLYuYw13S2h");
        // console.log("res", res.data);


    }

    const CreateNftUR = async (url) => {
        setIsSpinner(true)
        let acc = await loadWeb3();
        const web3 = window.web3;
        console.log("myUrl", url);
        try {
            let nftContractOf = new web3.eth.Contract(CreateNFT_ABI, CreateNFT);
            await nftContractOf.methods.createToken(url).send({
                from: acc,

            });
            setIsSpinner(false)


        } catch (e) {
            console.log("Error While Call Create Nft Function", e);
            setIsSpinner(false)

        }
    }

    const callfunctionhere = async () => {
        let acc = await loadWeb3()
        acc = acc.substring(0, 4) + '...' + acc.substring(acc.length - 4)
        setaddressacc(acc)

    }


    useEffect(() => {

        callfunctionhere()

    }, [])
    const CheckSponserid = async () => {
        console.log('what is user id inside function', userid)

        let res = await axios.get(`https://metahorse.herokuapp.com/checkuser?id=${userid}`);
        console.log("res", res.data.data);
        if (res.data.data == 1) {
            myMintWire()
        }
        else {
            toast.error("user is not exsist")
        }
    }
    console.log('what is user id', userid)
    return (
        <div>

            <div className='main_div_app'>
                <div class="container">
                    <div class="bx-view">
                        <div class="bx-full">
                            <div class="bx-header">
                                <div class="header-inner">
                                    <div class="header-tab center">
                                        <ul>
                                            <li class="active">
                                                <div class="item-tab">
                                                    <div class="item-tab-icon">
                                                        <div className='items_tab_inneree'>
                                                            <img alt="" src="https://cdn.pegaxy.io/statics/play/v9/images/icon/ic_item.png" decoding="async" data-nimg="fixed" className='items_img_here' />
                                                            <noscript></noscript>
                                                        </div>
                                                    </div>
                                                    <Link to="/Items/Mint" className='text_de'>

                                                        <span class="item-tab-title active">MINT</span>
                                                    </Link>
                                                </div>
                                            </li>
                                            <li class="">
                                                <div class="item-tab ">
                                                    <div class="item-tab-icon">
                                                        <div className='items_tab_inneree'>
                                                            <img alt="" src="https://cdn.pegaxy.io/statics/play/v9/images/icon/ic_item.png" decoding="async" data-nimg="fixed" className='items_img_here' />
                                                            <noscript></noscript>
                                                        </div>
                                                    </div>
                                                    <Link to="/Items/My_Items" className='text_de'>

                                                        <span class="item-tab-title ">COLLECTION</span>
                                                    </Link>
                                                </div>
                                            </li>
                                            {/* <li class="">
                                                <div class="item-tab">
                                                    <div class="item-tab-icon">
                                                        <div className='items_tab_inneree'>
                                                            <img alt="" src="https://cdn.pegaxy.io/statics/play/v9/images/icon/ic_tickets.png" decoding="async" data-nimg="fixed" className='items_img_here' />
                                                            <noscript></noscript>
                                                        </div>
                                                    </div>
                                                    <Link to="/My_Bids" className='text_de'>
                                                        <span class="item-tab-title ">My Bids</span>

                                                    </Link>
                                                </div>
                                            </li> */}
                                            {/* <li class="">
                                                <div class="item-tab">
                                                    <div class="item-tab-icon">
                                                        <div className='items_tab_inneree'>
                                                            <img alt="" src="https://cdn.pegaxy.io/statics/play/v9/images/icon/ic_tickets.png" decoding="async" data-nimg="fixed" className='items_img_here' />
                                                            <noscript></noscript>
                                                        </div>
                                                    </div>
                                                    <Link to="/Items/My_Profile" className='text_de'>

                                                        <span class="item-tab-title">My Profit</span>
                                                    </Link>
                                                </div>
                                            </li> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="bx-content default  minting_hereeeee">
                                <div class="inner-content minting_page">
                                    {
                                        isSpinner ? (
                                            <>

                                                <Spinner />

                                            </>
                                        ) : (
                                            <div class="viewPega">
                                                <div className="innerdiv_mint">
                                                    <div className="row">
                                                        <div className="col-lg-5 mt-4">
                                                            <div className="inner_first_div_img">
                                                                <img src={zan} alt="" width="100%" className='minting_img' />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-lg-6 mt-4">
                                                            <div className="mint_div_main"> */}
                                                        <div class=" col-lg-7 col-md-12 d-flex flex-column justify-content-start align-items-flex-start">



                                                            <div className='d-flex flex-row justify-content-center pt-lg-5 pt-3'>
                                                                <a style={{ cursor: "pointer" }}><img onClick={() => decreaseValue()} src="https://i.ibb.co/FswxxGJ/Group-187.png" width="60px" /></a>
                                                                <div className='mintboxsss mt-1 ms-4'>{value}</div>
                                                                <a className='ms-4' style={{ cursor: "pointer" }}><img onClick={() => increaseValue()} src="https://i.ibb.co/ZGpn9P7/Group-188.png" width="60px" /></a>
                                                            </div>
                                                            <div class="btnallhere">

                                                                {/* <div className='d-flex justify-content-center align-items-center mt-lg-5 mt-3'>
                                                                    <button
                                                                        onClick={() => myMintBNB()} 
                                                                        className='btn mintbtn firstbtn ms-4 '>{btnOne}</button>
                                                                    <p className='stakepageP text-white ms-4 mt-2 fs-5 fw-3'>Price : {mintPriceBnb} BNB</p>
                                                                </div> */}
                                                                <div className='d-flex justify-content-center align-items-center mt-lg-5 mt-3'>
                                                                    <button
                                                                        onClick={() => {
                                                                            // myMintWire()
                                                                            handleShow()
                                                                        }}
                                                                        className='btn mintbtn firstbtn ms-4 '>{btnTwo}</button>
                                                                    <p className='stakepageP text-white ms-4 mt-2 fs-5 fw-3'>Price : {mintPriceWire} Wire</p>
                                                                </div>
                                                                {/* <div className='d-flex justify-content-center align-items-center mt-lg-5 mt-3'>
                                                                            <button onClick={() => myMintWire()} className='btn mintbtn '>{btnTwo}</button>
                                                                            <p className='stakepageP text-white ms-4 mt-2 fs-5 fw-3'>Price :{mintPriceWire} JTO</p>

                                                                        </div>
                                                                        <div className='d-flex justify-content-center align-items-center mt-lg-5 mt-3'>
                                                                            <button onClick={() => myMintBUSD()} className='btn mintbtn firstbtn ms-4'>{btnThree}</button>
                                                                            <p className='stakepageP text-white ms-4 mt-2 fs-5 fw-3'>Price : {mintPriceBUSD} BUSD</p>

                                                                        </div> */}

                                                            </div>

                                                            {/* <div className="main_div_reflink">
                                                                {copyTest ? <span style={{ color: 'red', marginLeft: '1rem' }}>Copied.</span> : null}

                                                                <input type="text" className='refdata' value={`http://localhost:3001/Items/Mint?referrallink=${RefID}`} />
                                                                <CopyToClipboard text={`http://localhost:3001/Items/Mint?referrallink=${RefID}`}
                                                                    onCopy={() => setcopyTest(true)}  >
                                                                    <div className='main_class_copy'>

                                                                        <button

                                                                            className='btn mintbtn copybtn ms-4 '>Copy</button>
                                                                    </div>
                                                                </CopyToClipboard>

                                                            </div> */}


                                                        </div>
                                                        {/* </div> */}





                                                    </div>
                                                </div>

                                                <Modal show={show} onHide={handleClose}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title className='text-white'>Sponser ID</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Enter Id</Form.Label>
                                                            <Form.Control type="number" value={userid} onChange={(e) => setuserid(e.target.value)} className='text-white' placeholder="Enter here" />

                                                        </Form.Group>

                                                        {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control type="text" className='text-white' placeholder="enter here" />
                                                        </Form.Group> */}
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        {/* <Button variant="secondary" onClick={handleClose}>
                                                            Close
                                                        </Button> */}
                                                        <button className='btn' onClick={handleClose}>
                                                            <div class="button-game primary" style={{ height: "32px" }}
                                                            // onClick={() => nivigating("/Items/horse_racing")}



                                                            >
                                                                <div class="btn-position button-game-left" style={{ width: "16px", height: "32px" }}></div>
                                                                <div class="btn-position button-game-content" style={{ height: "32px", paddingRight: "16px", paddingLeft: "16px" }}>
                                                                    <div class="content-name"><span class="content-name-sub"></span><span class="content-name-title" style={{ fontSize: "20px" }} onClick={CheckSponserid}>Submit</span></div>
                                                                    <div class="button-game-icon i-right">

                                                                    </div>
                                                                </div>
                                                                <div class="btn-position button-game-right" style={{ width: "16px", height: "32px" }}></div>
                                                            </div>
                                                        </button>
                                                    </Modal.Footer>
                                                </Modal>

                                                <div class="list-pick"></div>
                                            </div>
                                        )

                                    }

                                </div>
                            </div>


                        </div>
                    </div>
                </div>





            </div>



        </div>
    )
}
