'use client';

import Modal from "@/components/modal";
import axiosInstance from "@/helpers/axios_interceptor";
import withManager from "@/hoc/with_manager";
import withAuth from "@/hoc/with_auth";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from "@/context/auth_context";


interface Supermarket {
    id: number;
    name: string;
    managers: string[];
    products: Product[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    supermarketId: number;
}

interface TransactionCoupon {
    couponId: string;
    supermarketId: number;
    couponName: string;
    couponNominal: number;
    minimumBuy: number;
}

interface ProductCoupon {
    couponId: string;
    supermarketId: number;
    couponName: string;
    couponNominal: number;
    productId: string;
}

function ProductPage( { params }: {
    params: {id: String}
}) {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product>({ id: "", name: "", price:0, stock:0, supermarketId: 0});
    
    const { user, isLoggedIn } = useAuth();

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openTransactionCouponModal, setOpenTransactionCouponModal] = useState(false);
    const [openProductCouponModal, setOpenProductCouponModal] = useState(false);


    const [coupons, setCoupons] = useState<TransactionCoupon[]>([]);
    const [productCoupons, setProductCoupons] = useState<ProductCoupon[]>([]);




    const handleEditProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { name: "", stock: "", price: "" };
        let formIsValid = true;

        if (!selectedProduct.name) {
            formIsValid = false;
            newError.name = "Name is required";
        }

        else if (selectedProduct.price < 0) {
            formIsValid = false;
            newError.price = "Price is not valid"
        }

        else if (selectedProduct.stock < 0) {
            formIsValid = false;
            newError.stock = "Stock is not valid";
        }
        
        setErrorProduct(newError);
        if (!formIsValid) return;
        
        const res = await axiosInstance.put(`/api/store/product/edit`);
        setOpenEditModal(false);
    }

    const handleFetchTransactionCoupons = async () => {
        console.log("Fetching coupons...");
        try {
            const res = await axiosInstance.get(`/api/order/transaction-coupon/supermarket-transaction-coupon/${params.id}`);
            console.log("Coupons:", res.data); 
            setCoupons(res.data);
            setOpenTransactionCouponModal(true); 
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    const handleFetchProductCoupons = async () => {
        console.log("Fetching coupons...");
        try {
            const res = await axiosInstance.get(`/api/order/product-coupon/supermarket-product-coupon/${params.id}`);
            console.log("Coupons:", res.data); 
            setProductCoupons(res.data);
            setOpenProductCouponModal(true); 
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };
    
    useEffect(() => {
        axiosInstance.get(`/api/store/product/all-product/${params.id}`)
            .then(res => {
                setProducts(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log(err);
            });
    }, [openEditModal]);

    const displayedItems = products
        .map((item) => (
            <div key={`product-${item.id}`} id={`product-${item.id}`} onClick={() => { setOpenEditModal(true); setSelectedProduct(item); }} className="flex flex-col rounded-lg w-[200px] h-[200px] bg-white items-center justify-center hover:cursor-pointer hover:drop-shadow-lg space-y-4">
                <Image src={`https://ui-avatars.com/api/?rounded=true&name=${item.name}`} width={50} height={50} alt={item.name}/>
                <h1 className="font-bold text-black text-sm">{item.name}</h1>
                <h1 className="font-bold text-black text-sm">Stock: {item.stock}</h1>
                <h1 className="font-bold text-black text-sm">Price: {item.price}</h1>
            </div>
        ));

    return (
        <>
            <title>Supermarket</title>
            <section className="flex flex-col bg-light-green min-h-screen items-start justify-start pt-[100px] min-w-svw max-w-svw">
                <div className="flex w-svw px-[100px] space-x-10 justify-center">
                    <div className="flex flex-col bg-dark-green-2 w-[300px] h-[150px] justify-start items-center p-4 rounded-lg">
                        <h1 className="font-bold text-lg">
                            Number of Products:
                        </h1>
                        <h1 className="font-bold text-6xl m-auto">
                            {products.length}
                        </h1>
                    </div>
                </div>
                <div className="px-8 w-full my-8">
                    <div className="w-full h-[600px] bg-white/30 backdrop-blur-lg z-1 rounded-lg">
                        <article className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-content-center justify-items-center p-2">
                            {displayedItems}
                        </article>
                    </div>
                </div>
                <Modal title="Product" open={openEditModal} onClose={() => setOpenEditModal(!openEditModal)} className="w-[700px]">
                    <form onSubmit={handleEditProduct} className="space-y-6 flex flex-col">
                        <div className="flex flex-col text-black space-y-2">
                            

                        </div>
                        <div className="space-y-2 my-2">
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add to Cart</button>
                        </div>
                    </form>
                </Modal>
                <Modal title="Coupons" open={openTransactionCouponModal} onClose={() => setOpenTransactionCouponModal(false)} className="w-[700px]">
                    <div className="space-y-4">
                        {coupons.map(coupon => (
                            <div key={coupon.couponId}>
                                <h1 className="font-bold text-black text-sm">{coupon.couponName}</h1>
                                <h1 className="font-bold text-black text-sm">{coupon.couponNominal}</h1>
                            </div>
                        ))}
                    </div>
                </Modal>
                <button onClick={handleFetchTransactionCoupons} className="absolute top-[130px] left-[100px] mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    See Transaction Coupons
                </button>
                <button onClick={handleFetchProductCoupons} className="absolute top-[130px] right-[100px] mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    See Product Coupons
                </button>
                <Modal title="Product Coupons" open={openProductCouponModal} onClose={() => setOpenProductCouponModal(false)} className="w-[700px]">
                    <div className="space-y-4">
                        {productCoupons.map(coupon => (
                            <div key={coupon.couponId}>
                                <h1 className="font-bold text-black text-sm">{coupon.couponName}</h1>
                                <h1 className="font-bold text-black text-sm">{coupon.couponNominal}</h1>
                            </div>
                        ))}
                    </div> 
                </Modal> 
                
            </section>
        </>
    );
    
};

export default ProductPage;