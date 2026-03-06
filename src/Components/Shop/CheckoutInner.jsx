import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function CheckoutInner() {
    const [showLogin, setShowLogin] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    return (
        <div className="th-checkout-wrapper space-top space-extra-bottom">
            <div className="container">
                <div>
                    {/* Login Toggle */}
                    <div className="woocommerce-form-login-toggle">
                        <div className="woocommerce-info">
                            Returning customer?{" "}
                            <Link to="#" className="showlogin" onClick={() => setShowLogin(!showLogin)}>
                                Click here to login
                            </Link>
                        </div>
                    </div>
                    {showLogin && (
                        <div className="row">
                            <div className="col-12">
                                <form action="#" className="woocommerce-form-login">
                                    <div className="form-group">
                                        <label>Username or email *</label>
                                        <input type="text" className="form-control" placeholder="Username or email" />
                                    </div>
                                    <div className="form-group">
                                        <label>Password *</label>
                                        <input type="password" className="form-control" placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <div className="custom-checkbox">
                                            <input type="checkbox" id="remembermylogin" />
                                            <label htmlFor="remembermylogin">Remember Me</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Link to="#" className="th-btn">Login</Link>
                                        <p className="mt-3 mb-0">
                                            <Link className="text-reset" to="#">Lost your password?</Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Coupon Toggle */}
                    <div className="woocommerce-form-coupon-toggle">
                        <div className="woocommerce-info">
                            Have a coupon?{" "}
                            <Link to="#" className="showcoupon" onClick={() => setShowCoupon(!showCoupon)}>
                                Click here to enter your code
                            </Link>{" "}
                        </div>
                    </div>
                    {showCoupon && (
                        <div className="row">
                            <div className="col-12">
                                <form action="#" className="woocommerce-form-coupon">
                                    <div className="form-group">
                                        <label>Coupon code</label>
                                        <input type="text" className="form-control" placeholder="Write your coupon code" />
                                    </div>
                                    <div className="form-group">
                                        <Link to="#" className="th-btn">Apply coupon</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <form action="#" className="woocommerce-checkout mt-40">
                    <div className="row ">
                        <div className="col-lg-6">
                            <h2 className="h4">Billing Details</h2>
                            <div className="row">
                                <div className="col-12 form-group">
                                    <select className="form-select">
                                        <option>United Kingdom (UK)</option>
                                        <option>United State (US)</option>
                                        <option>Equatorial Guinea (GQ)</option>
                                        <option>Australia (AU)</option>
                                        <option>Germany (DE)</option>
                                    </select>
                                </div>
                                <div className="col-md-6 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Last Name"
                                    />
                                </div>
                                <div className="col-12 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Your Company Name"
                                    />
                                </div>
                                <div className="col-12 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Street Address"
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Apartment, suite, unit etc. (optional)"
                                    />
                                </div>
                                <div className="col-12 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Town / City"
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Country"
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Postcode / Zip"
                                    />
                                </div>
                                <div className="col-12 form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Email Address"
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Phone number"
                                    />
                                </div>
                                <div className="col-12 form-group">
                                    <input type="checkbox" id="accountNewCreate" />
                                    <label htmlFor="accountNewCreate">Create An Account?</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <p id="ship-to-different-address">
                                <input
                                    id="ship-to-different-address-checkbox"
                                    type="checkbox"
                                    name="ship_to_different_address"
                                    defaultValue={1}
                                    defaultChecked=""
                                />
                                <label htmlFor="ship-to-different-address-checkbox">
                                    Ship to a different address?
                                    <span className="checkmark" />
                                </label>
                            </p>
                            <div className="shipping_address">
                                <div className="row">
                                    <div className="col-12 form-group">
                                        <select className="form-select">
                                            <option>United Kingdom (UK)</option>
                                            <option>United State (US)</option>
                                            <option>Equatorial Guinea (GQ)</option>
                                            <option>Australia (AU)</option>
                                            <option>Germany (DE)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Your Company Name"
                                        />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Street Address"
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Apartment, suite, unit etc. (optional)"
                                        />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Town / City"
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Country"
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Postcode / Zip"
                                        />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Email Address"
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 form-group">
                                <textarea
                                    cols={20}
                                    rows={5}
                                    className="form-control"
                                    placeholder="Notes about your order, e.g. special notes for delivery."
                                    defaultValue={""}
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <h4 className="mt-4 pt-lg-2">Your Order</h4>
                <form action="#" className="woocommerce-cart-form">
                    <table className="cart_table mb-20">
                        <thead>
                            <tr>
                                <th className="cart-col-image">Image</th>
                                <th className="cart-col-productname">Product Name</th>
                                <th className="cart-col-price">Price</th>
                                <th className="cart-col-quantity">Quantity</th>
                                <th className="cart-col-total">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="cart_item">
                                <td data-title="Product">
                                    <Link className="cart-productimage" to="/shop/1">
                                        <img
                                            width={91}
                                            height={91}
                                            src="assets/img/product/product_1_1.png"
                                            alt="Image"
                                        />
                                    </Link>
                                </td>
                                <td data-title="Name">
                                    <Link className="cart-productname" to="/shop/1">
                                        beach casual-shoe
                                    </Link>
                                </td>
                                <td data-title="Price">
                                    <span className="amount">
                                        <bdi>
                                            <span>$</span>18
                                        </bdi>
                                    </span>
                                </td>
                                <td data-title="Quantity">
                                    <strong className="product-quantity">01</strong>
                                </td>
                                <td data-title="Total">
                                    <span className="amount">
                                        <bdi>
                                            <span>$</span>18
                                        </bdi>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot className="checkout-ordertable">
                            <tr className="cart-subtotal">
                                <th>Subtotal</th>
                                <td data-title="Subtotal" colSpan={4}>
                                    <span className="woocommerce-Price-amount amount">
                                        <bdi>
                                            <span className="woocommerce-Price-currencySymbol">$</span>
                                            281.05
                                        </bdi>
                                    </span>
                                </td>
                            </tr>
                            <tr className="woocommerce-shipping-totals shipping">
                                <th>Shipping</th>
                                <td data-title="Shipping" colSpan={4}>
                                    {" "}
                                    Enter your address to view shipping options.
                                </td>
                            </tr>
                            <tr className="order-total">
                                <th>Total</th>
                                <td data-title="Total" colSpan={4}>
                                    <strong>
                                        <span className="woocommerce-Price-amount amount">
                                            <bdi>
                                                <span className="woocommerce-Price-currencySymbol">$</span>
                                                281.05
                                            </bdi>
                                        </span>
                                    </strong>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </form>
                <div className="mt-lg-3 mb-30">
                    <div className="woocommerce-checkout-payment">
                        <ul className="wc_payment_methods payment_methods methods">
                            <li className="wc_payment_method payment_method_bacs">
                                <input
                                    id="payment_method_bacs"
                                    type="radio"
                                    className="input-radio"
                                    name="payment_method"
                                    defaultValue="bacs"
                                    defaultChecked="checked"
                                />
                                <label htmlFor="payment_method_bacs">Direct bank transfer</label>
                                <div className="payment_box payment_method_bacs">
                                    <p>
                                        Make your payment directly into our bank account. Please use
                                        your Order ID as the payment reference. Your order will not be
                                        shipped until the funds have cleared in our account.
                                    </p>
                                </div>
                            </li>
                            <li className="wc_payment_method payment_method_cheque">
                                <input
                                    id="payment_method_cheque"
                                    type="radio"
                                    className="input-radio"
                                    name="payment_method"
                                    defaultValue="cheque"
                                />
                                <label htmlFor="payment_method_cheque">Cheque Payment</label>
                                <div className="payment_box payment_method_cheque">
                                    <p>
                                        Please send a check to Store Name, Store Street, Store Town,
                                        Store State / County, Store Postcode.
                                    </p>
                                </div>
                            </li>
                            <li className="wc_payment_method payment_method_cod">
                                <input
                                    id="payment_method_cod"
                                    type="radio"
                                    className="input-radio"
                                    name="payment_method"
                                />
                                <label htmlFor="payment_method_cod">Credit Cart</label>
                                <div className="payment_box payment_method_cod">
                                    <p>Pay with cash upon delivery.</p>
                                </div>
                            </li>
                            <li className="wc_payment_method payment_method_paypal">
                                <input
                                    id="payment_method_paypal"
                                    type="radio"
                                    className="input-radio"
                                    name="payment_method"
                                    defaultValue="paypal"
                                />
                                <label htmlFor="payment_method_paypal">Paypal</label>
                                <div className="payment_box payment_method_paypal">
                                    <p>
                                        Pay via PayPal; you can pay with your credit card if you don’t
                                        have a PayPal account.
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <div className="form-row place-order">
                            <button type="submit" className="th-btn">
                                Place order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CheckoutInner
