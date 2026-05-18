import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Terms() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb title="Terms & Policies" />
            <div className="space">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="terms-content-area">
                                <h2 className="sec-title mb-30">FREMOR GLOBAL – Terms & Policies</h2>

                                <h3 className="h4 mt-40 mb-20">To Our Valued Guest(s),</h3>
                                <p>We extend our sincere appreciation for selecting FREMOR GLOBAL as your trusted travel partner. Our objective is to deliver high-quality, reliable, and enjoyable travel experiences in a secure and respectful environment. We are committed to providing services in a professional, courteous, and guest-focused manner, with emphasis on safety, integrity, transparency, and guest satisfaction.</p>
                                <p>At all times, we aim to facilitate your travel experience with care, empathy, and efficiency. Our company culture is grounded in values of respect, accountability, innovation, and gratitude. When necessary, we may even take measures beyond standard legal obligations to amicably and swiftly resolve any concerns that may arise during your journey.</p>
                                <p>This document, titled Terms and Conditions, together with the contents available on our website, tour registration forms, brochures, promotional materials, and any supplementary documents, constitutes a binding agreement between FREMOR GLOBAL (hereinafter referred to as “the Company”) and you, the traveler (hereinafter referred to as “the Guest”).</p>
                                <h4 className="h5 mt-30 mb-15">Please note:</h4>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">FREMOR GLOBAL acts solely as a travel service facilitator, coordinating tours and travel-related services through third-party suppliers, including airlines, hotels, transport companies, guides, and others.</li>
                                    <li className="mb-2">All Guests are required to adhere to the local laws, administrative regulations, public health directives, visa requirements, and any official orders of the country or destination they are visiting.</li>
                                    <li className="mb-2">The Company shall not be held responsible for consequences arising from non-compliance with such legal or governmental requirements by the Guest.</li>
                                </ul>
                                <p>By registering yourself, your family, or any accompanying persons for a tour operated or arranged by FREMOR GLOBAL, you acknowledge that you have read, understood, and agreed to abide by these Terms and Conditions in their entirety. This consent is a prerequisite for using any of the Company’s services and participating in its tours.</p>
                                <p className="mb-4">We thank you once again for your trust in FREMOR GLOBAL, and we look forward to being a part of your unforgettable travel experience.</p>

                                <h3 className="h4 mt-40 mb-20">1. Short Title, Extent and Commencement</h3>
                                <ul className="mb-4" style={{ listStyleType: "lower-roman", paddingLeft: "20px" }}>
                                    <li className="mb-2">These Terms and Conditions shall be cited as the “FREMOR GLOBAL (India & International Guests) Terms and Conditions.”</li>
                                    <li className="mb-2">These Terms and Conditions shall extend and apply to all tours—domestic and international—organized, facilitated, or promoted by FREMOR GLOBAL Tours Pvt. Ltd., hereinafter referred to as “FREMOR GLOBAL”.</li>
                                    <li className="mb-2">These Terms and Conditions shall come into force on 1st May, 2024, and shall remain applicable until amended, modified, or revoked by the Company.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">A. Definitions</h4>
                                <p>Unless otherwise specified or unless the context requires otherwise, the following expressions shall bear the meanings assigned to them:</p>
                                <ul className="mb-4" style={{ listStyleType: "lower-roman", paddingLeft: "20px" }}>
                                    <li className="mb-2"><strong>"Brochure"</strong> refers to any leaflet, folder, or promotional publication, including digital and printed materials, issued by FREMOR GLOBAL.</li>
                                    <li className="mb-2"><strong>"Company"</strong> means FREMOR GLOBAL Tours Pvt. Ltd. and includes its affiliated brands/divisions such as Chota Break, My Fair Lady, Honeymoon Special, Second Innings, Marigold, Prince Charming, Students Special, Adventure Special, Veg Tours, and any future divisions under its umbrella.</li>
                                    <li className="mb-2"><strong>"Itinerary"</strong> denotes a comprehensive schedule of a journey, detailing places to be visited, travel routes, and related information, and is subject to modifications in case of a Force Majeure situation.</li>
                                    <li className="mb-2"><strong>"First Day of the Tour"</strong> shall mean the commencement of services at the first destination—morning, afternoon, or evening—as per the transportation mode. The same applies to the concluding day. "Day" may refer to any part of a 24-hour cycle.</li>
                                    <li className="mb-2"><strong>"Force Majeure"</strong> shall mean events beyond the reasonable control of FREMOR GLOBAL that prevent the performance of its contractual obligations, including but not limited to:
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>War, invasion, civil unrest</li>
                                            <li>Natural disasters, epidemics/pandemics, fires, floods</li>
                                            <li>Acts of government or regulatory changes</li>
                                            <li>Strikes, lockouts, transportation suspension</li>
                                            <li>Nuclear incidents, riots, or any other unforeseen disruptions.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>"Group Tour"</strong> refers to a packaged tour involving multiple individual or family travelers receiving uniform services throughout the journey.</li>
                                    <li className="mb-2"><strong>"Guest/s"</strong> means any individual on whose behalf booking and/or registration is made for any tour operated by FREMOR GLOBAL.</li>
                                    <li className="mb-2"><strong>"Independent Contractor"</strong> means any third-party entity or individual—such as airlines, hotels, transport companies, guides, etc.—contracted by FREMOR GLOBAL to render services. Such contractors are not employees or agents of the Company.</li>
                                    <li className="mb-2"><strong>"Jain Food"</strong> refers to vegetarian meals prepared without onion, garlic, or root vegetables, served as per tour schedules and, in some cases, not individually plated or table-served.</li>
                                    <li className="mb-2"><strong>"Meal"</strong> includes breakfast, lunch, dinner, and/or packed or dry snacks provided as part of the tour.</li>
                                    <li className="mb-2"><strong>"Tour"</strong> means any travel program organized within India (Domestic Tour) or outside India (International Tour).</li>
                                    <li className="mb-2"><strong>"Tour Leader/Assistant"</strong> includes individuals appointed by the Company such as Tour Managers, Escorts, or Guides responsible for managing or supporting the tour.</li>
                                    <li className="mb-2"><strong>"Panoramic View"</strong> implies a wide, uninterrupted visual presentation of a landscape, sometimes experienced sequentially.</li>
                                    <li className="mb-2"><strong>"Orientation Tour"</strong> is a brief, guided sightseeing tour subject to local permissions and seasonal variations.</li>
                                    <li className="mb-2"><strong>"Working Days"</strong> refers to Monday through Friday, excluding public holidays and weekends.</li>
                                    <li className="mb-2"><strong>"Credit Shell"</strong> is a non-cash, non-refundable credit note that may be used for future tour bookings under specified terms.</li>
                                    <li className="mb-2"><strong>"Rescheduling Charges"</strong> are administrative and operational costs incurred for amending an already-booked tour due to period changes, destinations, or itinerary adjustments.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">B. General Interpretations</h4>
                                <ul className="mb-4" style={{ listStyleType: "lower-roman", paddingLeft: "20px" }}>
                                    <li className="mb-2">Each clause within these Terms and Conditions is severable. If any provision is deemed invalid, unlawful, or unenforceable, the remaining clauses shall continue to be valid and enforceable to the fullest extent permitted by law.</li>
                                    <li className="mb-2">Unless the context indicates otherwise, words in the masculine include the feminine and vice versa, and singular includes the plural and vice versa.</li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">2. Scope of Activity</h3>
                                <p>FREMOR GLOBAL is a travel management entity that facilitates, organizes, and coordinates various components of the tour on behalf of the guest. While utmost diligence is exercised in selecting reputable Independent Contractors (e.g., hotels, airlines, guides, restaurants, transport providers), FREMOR GLOBAL does not own, operate, or control these services, and therefore shall not be liable for any loss, damage, injury, delay, or mishap arising from their acts, omissions, or defaults.</p>
                                <p>By booking or registering for any tour, all guests confirm their acknowledgment, understanding, and agreement to abide by the terms contained in this document as well as any amendments published on the official website or issued via email, SMS, or other communication platforms.</p>
                                <p className="mb-2">The Company periodically issues updates or notifications to assist guests in preparation and coordination, including but not limited to:</p>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Itinerary changes</li>
                                    <li className="mb-2">Travel advisories</li>
                                    <li className="mb-2">Documentation or health requirements</li>
                                </ul>
                                <p>Guests are responsible for regularly checking their registered email and SMS updates, including messages sent from the Company’s official communication addresses such as connect@fremorglobal.com or the booking executive’s email.</p>
                                <p className="mb-4">FREMOR GLOBAL reserves the right to amend, modify, or update these Terms and Conditions at any time without prior notice. Guests are advised to consult the Company’s official website at www.fremorglobal.com for the most recent version.</p>

                                <h3 className="h4 mt-40 mb-20">3. Brochure / World Showcase</h3>
                                <p>All previously issued brochures, advertisements, letters, promotional content, and tour tariffs (whether printed or circulated digitally) issued by FREMOR GLOBAL shall be deemed null and void upon the publication of a new edition of the brochure, website updates, or information on the official mobile application.</p>
                                <p>While every reasonable effort is made to ensure the accuracy and reliability of the information presented at the time of publishing, such materials—including maps and illustrations—are intended for the convenience of the Guests only and may not be to scale or represent official data.</p>
                                <p>FREMOR GLOBAL reserves the unconditional right to modify or withdraw any part of the brochure content—including itinerary, pricing, departure dates, hotel details, and duration—either before or after any booking is confirmed or a tour has commenced. Such modifications may be required due to operational circumstances, safety considerations, supplier limitations, or force majeure events. The Company will endeavor to notify affected Guests as promptly as possible via email, SMS, telephone, or any other reliable mode of communication.</p>
                                <p className="mb-4">Unless otherwise stated explicitly, city tours include panoramic views or photo stops of mentioned attractions, and not necessarily entry into each location. The last day of the tour is defined as the last day of services in the final country or city according to the finalized itinerary.</p>

                                <h3 className="h4 mt-40 mb-20">4. Tour Booking and Participation</h3>
                                <h4 className="h5 mt-30 mb-15">i. Guest Acceptance and Signature on Registration Form</h4>
                                <p>The act of signing the tour registration form and/or making a partial or full payment shall constitute the Guest’s unconditional acceptance of these Terms and Conditions. Where one individual signs the registration form on behalf of multiple Guests, it shall be deemed that all such Guests have authorized the signing party and collectively agree to the terms herein.</p>
                                <p className="mb-4">Each Guest must provide valid identity and address proof at the time of booking and shall carry such documentation throughout the tour, especially during sightseeing and travel.</p>

                                <h4 className="h5 mt-30 mb-15">ii. Online Registration and Payment</h4>
                                <p>Guests may register and make payments through the Company’s official website (www.fremorglobal.com) or via secure payment links sent by authorized representatives of FREMOR GLOBAL. The date of payment shall be deemed the booking date, subject to seat availability.</p>
                                <p>The prevailing tour tariff and discounts applicable on the date of payment will apply. Online bookings and payments imply full agreement with these Terms and Conditions. Applicable service and logistics charges for online payments shall be borne by the Guest.</p>
                                <p>For International Tours, Guests are required to submit a scanned copy of the first two and last two pages of their valid passport.</p>
                                <p>While the Company takes industry-standard measures to ensure the protection and confidentiality of Guest data, FREMOR GLOBAL shall not be liable for any technical issues, network errors, software malfunctions, or failures related to third-party payment gateways.</p>
                                <p className="mb-4">All disputes arising out of online bookings shall fall under the exclusive jurisdiction of the courts in Mumbai, India, where the registered booking office is located.</p>

                                <h4 className="h5 mt-30 mb-15">iii. Payment Does Not Guarantee Entitlement</h4>
                                <p className="mb-4">Payment of the registration amount indicates the Guest’s intention to join the tour but does not entitle the Guest to receive any travel-related services (including tickets, visas, hotel stays) until the full tour amount is received by FREMOR GLOBAL.</p>

                                <h4 className="h5 mt-30 mb-15">iv. Guests Requiring Special Assistance</h4>
                                <p>FREMOR GLOBAL does not guarantee special services or accommodations for any individual Guest on Group Tours. Upon advance written request and submission of appropriate medical or disability documentation, the Company may, at its discretion and subject to availability, attempt to assist Guests with special needs. All associated costs shall be borne by the Guest.</p>
                                <p className="mb-4"><strong>Note:</strong> Most international transportation and hotels may not be wheelchair-accessible. A qualified, able-bodied companion shall accompany any Guest requiring assistance, and such expenses are solely the responsibility of the Guest.</p>

                                <h4 className="h5 mt-30 mb-15">v. Minimum Guest Requirement</h4>
                                <p>The Company reserves the right to operate, merge, modify, or cancel any tour based on the total number of confirmed bookings.</p>
                                <p>Each tour requires a minimum of 20 confirmed Guests at least 30 calendar days prior to the scheduled departure. If this threshold is not met, the Company may:</p>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Operate the tour on a smaller scale (e.g., using a mini-coach),</li>
                                    <li className="mb-2">Merge it with another group tour,</li>
                                    <li className="mb-2">Modify meal plans (e.g., MAP – breakfast and dinner),</li>
                                    <li className="mb-2">Or cancel the tour entirely.</li>
                                </ul>
                                <p>In case of cancellation by the Company, Guests shall be entitled to a refund of the paid amount minus applicable non-refundable charges, such as visa processing fees already incurred.</p>
                                <p className="mb-4">Guests are encouraged to apply for their visas well in advance. If FREMOR GLOBAL cancels a tour, Guests shall be informed at least 15 calendar days prior to departure through SMS, phone call, or email using the contact details provided at the time of booking.</p>

                                <h4 className="h5 mt-30 mb-15">vi. Tour Mergers</h4>
                                <p>Tours may be merged if the minimum Guest requirement is unmet or for other logistical reasons. Mergers may be:</p>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Full or partial,</li>
                                    <li className="mb-2">Between tours of similar or different types (e.g., Family Tour with a Special Interest Tour),</li>
                                    <li className="mb-2">From different departure locations.</li>
                                </ul>
                                <p className="mb-4">Seat allocation on shared coaches will be based strictly on the original tour booking date.</p>

                                <h4 className="h5 mt-30 mb-15">vii. Medical Fitness and Health Responsibility</h4>
                                <p>By registering for the tour, Guests confirm that they are medically fit and capable of completing the itinerary. The Company reserves the right to request a medical fitness certificate at any time before departure.</p>
                                <p>Guests with pre-existing medical conditions participate at their own risk. In the event of any medical emergency during the tour, the Guest and/or accompanying party shall be solely responsible for seeking medical assistance and bearing related costs.</p>
                                <p>FREMOR GLOBAL and its Tour Leaders are not responsible for providing medical aid or supervising the Guest’s health during the tour.</p>
                                <p className="mb-2">In the unfortunate event of a Guest’s death during the tour, the accompanying relatives or representatives shall be responsible for all required formalities, including but not limited to:</p>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Obtaining a death certificate and postmortem report,</li>
                                    <li className="mb-2">Repatriation of the body,</li>
                                    <li className="mb-2">Claiming travel insurance (if applicable),</li>
                                    <li className="mb-2">Arranging travel for any relatives to the place of demise.</li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">5. Insurance</h3>
                                <p>FREMOR GLOBAL strongly advises all Guests to obtain a comprehensive Overseas Travel Insurance Policy that covers risks including but not limited to medical emergencies, hospitalization, accidental injuries, trip cancellations, and loss of personal belongings.</p>
                                <p>Where required by destination country laws or regulations, FREMOR GLOBAL may facilitate travel insurance coverage for Guests up to the age of 70 years, subject to the Guest paying the applicable insurance premium. Guests above the age of 70 years will be required to pay any additional premium charges applicable for their age bracket.</p>
                                <p>Guests must fully disclose any pre-existing medical conditions to the insurance provider at the time of policy issuance. Insurance providers and/or FREMOR GLOBAL may request a certified medical fitness declaration before departure.</p>
                                <p>FREMOR GLOBAL acts solely as a facilitator and is not responsible for the acceptance, rejection, or settlement of any insurance claim. All claims, correspondence, and reimbursements are the sole responsibility of the Guest and must be pursued directly with the respective insurance company.</p>
                                <p className="mb-4">Guests are strongly discouraged from carrying valuables during the tour. In the unfortunate event of hospitalization or death during the tour, it is the responsibility of the Guest or their relatives to coordinate directly with the insurance company for claims processing.</p>

                                <h3 className="h4 mt-40 mb-20">6. Payments and Financial Terms</h3>
                                
                                <h4 className="h5 mt-30 mb-15">i. Payment Terms</h4>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">The registration amount paid at the time of booking is non-refundable and non-interest bearing.</li>
                                    <li className="mb-2">The portion of the Tour Cost denominated in foreign currency must be paid prior to VISA processing.</li>
                                    <li className="mb-2">The balance tour payment must be made at least 45 days prior to the tour departure date.</li>
                                    <li className="mb-2">FREMOR GLOBAL will process the booking only upon receipt of the registration amount or full payment, as applicable.</li>
                                    <li className="mb-2">In case of billing discrepancies, FREMOR GLOBAL reserves the right to correct and re-invoice accordingly.</li>
                                    <li className="mb-2">A charge of INR 500/- will be levied for each dishonored cheque. Legal action may be initiated where necessary.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">ii. Travel Loans</h4>
                                <p className="mb-4">FREMOR GLOBAL supports financing options extended by banks or financial institutions to Guests for tour payments, provided they meet the payment deadlines. However, the Company is not liable or responsible for loan processing, approvals, disbursals, or any refund/recovery disputes arising between the Guest and the financing party.</p>

                                <h4 className="h5 mt-30 mb-15">iii. Tour Tariff</h4>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Tour tariffs are calculated based on prevailing rates at the time of quotation.</li>
                                    <li className="mb-2">Full payment must be made 45 days prior to the tour departure or as per the invoice due date, whichever is earlier.</li>
                                    <li className="mb-2">Interest @ 18% per annum shall be charged on delayed payments.</li>
                                    <li className="mb-2">Any increase in costs due to currency fluctuation, government taxes, fuel surcharges, or other unforeseen events must be borne by the Guest, even after booking or during the tour.</li>
                                    <li className="mb-2">Tour tariffs are exclusive of all applicable taxes unless explicitly stated.</li>
                                    <li className="mb-2">Guests agree and accept that service offerings and pricing may vary by season, product, or destination, and no uniform comparison shall apply across packages.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">iv. Discounts and Benefits</h4>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Early booking discounts and benefits are subject to availability, limited seats, and specific departure dates.</li>
                                    <li className="mb-2">Discounts are only applicable if full registration payment is made at the time of booking and remaining payments are made timely (i.e. 45 days prior to departure).</li>
                                    <li className="mb-2">FREMOR GLOBAL reserves the right to amend or withdraw any promotional offer at any time, without prior notice.</li>
                                    <li className="mb-2">Discounts are valid for Guests aged 2 years and above for international tours and 5 years and above for domestic tours.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">v. Foreign Exchange</h4>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">FREMOR GLOBAL, being an RBI-authorized money changer, facilitates foreign exchange services.</li>
                                    <li className="mb-2">Guests must submit all required documents (A2 form, passport copy, PAN, etc.) and make payments in INR as per the prevailing exchange rate, minimum 45 days before departure.</li>
                                    <li className="mb-2">Payments for foreign exchange must be made via cheque, demand draft, or net banking to "FREMOR GLOBAL Tours Private Limited - Forex".</li>
                                    <li className="mb-2">Additional service charges will apply to payments made through credit/debit cards or foreign currency deposits, as per Company policy.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">vi. Airlines</h4>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Airlines are solely responsible for seat overbookings, baggage loss, flight delays, or cancellation. FREMOR GLOBAL shall not be held liable in such cases.</li>
                                    <li className="mb-2">In group bookings, seat assignments are at the discretion of the airline.</li>
                                    <li className="mb-2">Any additional costs arising from missed connections, rescheduled flights, or delays must be borne by the Guest.</li>
                                    <li className="mb-2">Guests may choose to book their own tickets; however, FREMOR GLOBAL is not responsible for any rebooking issues once air tickets are released.</li>
                                    <li className="mb-2">All airline policies regarding baggage, meals, ticket amendments, cancellations, etc., shall apply.</li>
                                    <li className="mb-2">Guests must bear any airfare or surcharge increases post-booking.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">vii. Tours Originating Outside Mumbai</h4>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Unless specifically stated, tour tariffs are based on departures from Mumbai, India.</li>
                                    <li className="mb-2">Guests boarding from other cities must bear the cost of travel to and from Mumbai and any additional services (transfers, hotel stays, meals, etc.).</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">viii. Reimbursement of Additional Costs</h4>
                                <p className="mb-4">If FREMOR GLOBAL makes any payment on behalf of the Guest (e.g., due to law, force majeure, or emergency), the Guest shall reimburse the Company in full, upon demand.</p>

                                <h4 className="h5 mt-30 mb-15">ix. Direct Bank Transfers</h4>
                                <p className="mb-2">For payments made via bank transfer, UPI, cheque deposit, or other digital modes, Guests must inform the Company within 24 hours, along with valid documentary proof.</p>
                                <p className="mb-4">Payment receipts will be issued only upon such confirmation.</p>

                                <h3 className="h4 mt-40 mb-20">7. Mandatory Documents for Visa Processing</h3>
                                <p>It is the sole responsibility of each guest to ensure the timely procurement and submission of all required documents for visa processing. The following mandatory documents must be submitted by each guest:</p>
                                <ul className="mb-4" style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
                                    <li className="mb-2"><strong>Valid Passport</strong>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Passport must be valid for a minimum period of 180 to 365 days from the date of entry into India.</li>
                                            <li>A minimum of two blank pages must be available in the passport for visa stamping.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Visa Application Forms</strong>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Each guest must submit a duly filled and signed visa application form.</li>
                                            <li>All entries must be consistent with the details provided in the passport.</li>
                                            <li>Specific consulates may require additional procedures or documentation for minors and children, which guests must comply with accordingly.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Covering Letter</strong>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Each guest must provide a covering letter addressed to the relevant consulate outlining the purpose of travel (e.g., tourism, personal, employment, etc.).</li>
                                            <li>The letter should clearly state financial and/or sponsorship details, if applicable.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Delays and Rejections</strong>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Due to varying processing times at different embassies/consulates, visa issuance may be delayed or denied.</li>
                                            <li>FREMOR GLOBAL shall not be held liable for non-issuance or delayed issuance of a visa, nor shall it entertain any claims for tour cancellation/refunds arising therefrom.</li>
                                            <li>Any incomplete or incorrect documentation submitted will be at the sole risk and responsibility of the guest.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Verification of Visa Details</strong>
                                        <p className="mt-2 mb-2">Guests are required to verify all visa particulars upon receipt, including but not limited to:</p>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "square", paddingLeft: "20px" }}>
                                            <li>Name (as per passport)</li>
                                            <li>Passport number</li>
                                            <li>Validity period</li>
                                            <li>Photograph</li>
                                            <li>Type of visa and relevant authorizations</li>
                                            <li>Signature of the consular officer</li>
                                        </ul>
                                    </li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">8. Guest Responsibility</h3>
                                <p>It is the sole and absolute responsibility of the guest to possess all valid and required travel documents, clearances, and approvals prior to departure, including but not limited to:</p>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Valid passport(s), visa(s), and other immigration approvals</li>
                                    <li className="mb-2">Confirmed air/rail/bus tickets</li>
                                    <li className="mb-2">Valid travel and medical insurance</li>
                                    <li className="mb-2">Medical fitness certificates (where required)</li>
                                    <li className="mb-2">Court permissions (if applicable)</li>
                                    <li className="mb-2">Documentation evidencing confirmed services booked independently of FREMOR GLOBAL</li>
                                </ul>
                                <p>All travel documents are non-transferable and must be issued in the guest's legal name as it appears on their photo identification and passport. The failure to present valid documents at any stage may result in denial of boarding, immigration issues, or tour termination—without any liability to FREMOR GLOBAL.</p>
                                <p className="mb-4">Guests are strongly advised to keep certified true copies and digital backups of all relevant documents. Furthermore, guests are required to report to the airport at least 3 to 4 hours prior to scheduled departure, in accordance with airline guidelines.</p>

                                <h3 className="h4 mt-40 mb-20">9. Photo Identification Requirements</h3>
                                <p>All guests, including minors, are required to carry original photo identification such as:</p>
                                <ul className="mb-4" style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                                    <li className="mb-2">Passport</li>
                                    <li className="mb-2">Aadhar Card</li>
                                    <li className="mb-2">Election ID card</li>
                                    <li className="mb-2">Driving License</li>
                                    <li className="mb-2">OCI Card</li>
                                </ul>
                                <p className="mb-4">The type of acceptable identification may vary based on the laws and regulations of the host country. It is the responsibility of each guest to stay informed about such requirements through the official consulate websites of the respective destination(s).</p>

                                <h3 className="h4 mt-40 mb-20">10. Changes to Itinerary</h3>
                                <ul className="mb-4" style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
                                    <li className="mb-2"><strong>Force Majeure Clause</strong>
                                        <p className="mt-2 mb-2">In the event of unforeseen circumstances beyond the reasonable control of FREMOR GLOBAL (such as natural disasters, political unrest, pandemics, strikes, etc.), the company reserves the right to modify, vary, alter, or cancel any aspect of the tour itinerary, departure date, or tour tariff.</p>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Any additional cost incurred due to such changes shall be borne solely by the guest.</li>
                                            <li>No claims, refunds, or compensations shall be entertained for non-performance or limitation of services due to such events.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Company-Driven Modifications</strong>
                                        <p className="mt-2 mb-2">If any part of the tour is curtailed or a service is not rendered due to reasons attributable solely to the company (excluding force majeure), FREMOR GLOBAL shall refund the proportionate amount corresponding to the missed component. No additional compensation shall be payable.</p>
                                    </li>
                                    <li className="mb-2"><strong>Guest-Initiated Deviations</strong>
                                        <p className="mt-2 mb-2">Requests for deviations from the published itinerary are subject to prior approval at the discretion of FREMOR GLOBAL.</p>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Guests must bear the full cost of the deviation in addition to the original tour tariff.</li>
                                            <li>Such costs must be settled prior to departure.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Guests Joining or Leaving the Tour Midway</strong>
                                        <p className="mt-2 mb-2">Guests who join or leave the tour at a location other than the officially designated point shall ensure the following:</p>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Must inform FREMOR GLOBAL at least 20 days in advance.</li>
                                            <li>Must possess valid travel documents, including internal flight tickets and insurance.</li>
                                            <li>Shall be responsible for making their own arrangements to meet the group at the agreed-upon location at their own risk and expense.</li>
                                            <li>No refund shall be provided for services not availed due to early departure or late joining.</li>
                                        </ul>
                                    </li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">11. Transport and Coach Seating</h3>
                                <ul className="mb-4" style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
                                    <li className="mb-2"><strong>Coach Seating Allocation</strong>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Seats are allotted based on the date of booking.</li>
                                            <li>Seats 1 to 4 are reserved for the Tour Leader and may be available for premium booking, subject to availability and an additional charge.</li>
                                            <li>No smoking, alcohol consumption, or eating is permitted in the coach.</li>
                                            <li>Guests are responsible for their belongings. FREMOR GLOBAL shall not be liable for any loss, theft, or damage to personal effects.</li>
                                            <li>Any damage to the coach caused by the guest shall be reimbursed directly to the transport provider.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Coach Type – World Tours</strong>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Luxury air-conditioned or air-cooled coaches are arranged, subject to availability.</li>
                                            <li>Coach type may vary based on itinerary, country, and guest count.</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2"><strong>Coach Type – Domestic Tours (India)</strong>
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Coaches may include Non-AC/Air-Cooled buses, mini-coaches, jeeps, or taxis depending on the terrain, itinerary, and group size.</li>
                                        </ul>
                                    </li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">12. Hotel Accommodation</h3>
                                <h4 className="h5 mt-30 mb-15">i. Hotel Selection and Standards:</h4>
                                <p>FREMOR GLOBAL undertakes the responsibility to select and reserve hotel accommodations on behalf of guests at strategically convenient locations, subject to availability. Unless otherwise specified, hotel accommodations are arranged on a twin-sharing basis in standard category rooms. The third occupant in a room will typically be accommodated on a rollaway bed or mattress. Triple-sharing facilities are limited and subject to hotel policies. In cases involving families of four (4), two (2) separate rooms may be allocated, in which event, the child guest shall be charged at the applicable adult tour tariff.</p>
                                <p className="mb-4">Hotel rooms generally include private bath or shower. Air-conditioning, heating, and other facilities are provided in accordance with the hotel’s policy, local weather conditions, and tour type. Heating or air-conditioning, where chargeable, shall be paid by the guest directly. Any complaints relating to hotel services must be addressed by the guest directly with hotel management.</p>
                                
                                <h4 className="h5 mt-30 mb-15">ii. Liability and Damages:</h4>
                                <p className="mb-4">All baggage and personal effects are the sole responsibility of the guest at all times. Any damage caused to the hotel premises, furniture, fixtures, or property during the stay shall be the exclusive liability of the guest, who shall bear all related costs. Hotel staff services and grievances fall under the jurisdiction of the hotel’s own administration. FREMOR GLOBAL reserves the right to change the hotel at any time and guests must adhere to the hotel's internal policies and rules.</p>

                                <h4 className="h5 mt-30 mb-15">iii. Single Occupancy:</h4>
                                <p className="mb-4">Single travelers opting not to share accommodation shall be required to pay the full single occupancy supplement for the entire tour. Single occupancy rooms are typically smaller in size and may be located on different floors from group rooms. In the event a sharing partner cancels at the last minute, the remaining guest shall bear the cost of single occupancy.</p>

                                <h4 className="h5 mt-30 mb-15">iv. Check-In and Check-Out:</h4>
                                <p className="mb-4">Guests are required to comply with the check-in and check-out policies of respective hotels. For tours within India, the standard check-in time is 12:00 noon and check-out is 10:00 a.m., while for international tours, check-in is typically at 3:00 p.m. and check-out at 12:00 noon. Any deviation from these timings is subject to the hotel’s policies and may incur additional charges payable by the guest.</p>

                                <h4 className="h5 mt-30 mb-15">v. Additional Charges:</h4>
                                <p className="mb-4">Any optional or additional services availed at the hotel, including but not limited to mini-bar, laundry, telephone, alcoholic beverages, room service, excursions, or personal expenses, must be settled directly by the guest prior to check-out.</p>

                                <h4 className="h5 mt-30 mb-15">vi. Room Sharing Policy:</h4>
                                <p className="mb-4">Two single travelers may mutually agree in writing to share a room. Any refunds due in this regard (e.g., refund of single supplement) shall be processed within ten (10) working days post-tour. FREMOR GLOBAL assumes no responsibility for disputes, losses, or disagreements arising between sharing guests. Smoking is strictly prohibited in shared rooms. Room allocations for specialty tours remain at the sole discretion of FREMOR GLOBAL.</p>

                                <h3 className="h4 mt-40 mb-20">13. Restaurants</h3>
                                <p>FREMOR GLOBAL shall endeavor to arrange stops at restaurants offering hygienic food and basic sanitation during the course of the journey. However, restaurant selection, quality, cleanliness, service, and seating arrangements remain outside the control of the Company. Group seating is managed by restaurant staff and depends on factors such as group size, time slot, and restaurant infrastructure.</p>
                                <p className="mb-4">Non-vegetarian meals are generally not served during transit unless explicitly mentioned. The Company endeavors to select high-quality, hygienic restaurants with appropriate sanitation facilities for meal halts, but cannot guarantee or be held liable for third-party restaurant services. Table allotments are managed by the restaurant based on the size and schedule of the travel group.</p>

                                <h3 className="h4 mt-40 mb-20">14. Meals</h3>
                                <p>Meals provided on tour are generally fixed-menu and predetermined based on the tour program. Packed meals may be served where required. While the Company primarily serves vegetarian food, limited non-vegetarian items may be included.</p>
                                <p>FREMOR GLOBAL does not provide customized diets or differentiate between Guests. In exceptional cases, only vegetarian meals may be available. For infants or children, the Company usually provides items such as plain rice, dal, and milk; for any additional dietary needs, Guests must make independent arrangements at their own cost.</p>
                                <p className="mb-4">Meals are not served at airports or on flights. Complaints or refund requests regarding meals shall not be entertained. The Company reserves the right to amend meal arrangements or menus without prior notice.</p>

                                <h3 className="h4 mt-40 mb-20">15. Tour Leaders</h3>
                                <p>Tour Leaders/Assistants appointed by FREMOR GLOBAL are responsible for facilitating group movement and providing basic tour-related guidance from the first destination as per the itinerary. Their authority includes the right to modify, rearrange, or adjust the itinerary in the best interest of the group.</p>
                                <p className="mb-4">Guests are required to comply with Tour Leader instructions. FREMOR GLOBAL shall not be liable for consequences arising from Guests ignoring or disobeying such instructions. Communications will be primarily conducted in English, Hindi, or Marathi.</p>

                                <h3 className="h4 mt-40 mb-20">16. Baggage</h3>
                                <p>Each Guest is responsible for their own luggage at all times. Baggage must comply with the rules of airlines, customs, immigration, and local transport services.</p>
                                <p className="mb-4">Guests are responsible for porter services, including associated tips or charges, and for the conduct of any porter or helper arranged independently. FREMOR GLOBAL shall not be responsible for loss, damage, or theft of any baggage or personal items.</p>

                                <h3 className="h4 mt-40 mb-20">17. Cancellation Charges</h3>
                                <p>Guests acknowledge that group tours involve advance bookings of services such as hotels, flights, and local transportation. To ensure smooth operations, such arrangements require advance payments. Cancellations lead to loss of paid amounts; thus, the Company applies a structured cancellation policy as detailed below.</p>
                                
                                <div className="table-responsive mb-4">
                                    <table className="table table-bordered">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Days before Departure</th>
                                                <th>World Tours</th>
                                                <th>Indian Tours</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>More than 90 days</td>
                                                <td>Registration Amount or 20% + GST (whichever is higher)</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>90 – 61 days</td>
                                                <td>30% + GST</td>
                                                <td>30% + GST</td>
                                            </tr>
                                            <tr>
                                                <td>60 – 46 days</td>
                                                <td>50% + GST</td>
                                                <td>50% + GST</td>
                                            </tr>
                                            <tr>
                                                <td>45 – 31 days</td>
                                                <td>75% + GST</td>
                                                <td>75% + GST</td>
                                            </tr>
                                            <tr>
                                                <td>30 – 16 days</td>
                                                <td>90% + GST</td>
                                                <td>90% + GST</td>
                                            </tr>
                                            <tr>
                                                <td>15 – 1 day</td>
                                                <td>100% + GST</td>
                                                <td>100% + GST</td>
                                            </tr>
                                            <tr>
                                                <td>On the day of departure / On Tour</td>
                                                <td>100% + GST</td>
                                                <td>100% + GST</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mb-4"><strong>Note:</strong> Cancellation of any Additional Services or Deviations will incur extra charges. GST is applicable on cancellation fees.</p>

                                <h4 className="h5 mt-30 mb-15">A. General Cancellation Conditions:</h4>
                                <ul className="mb-4" style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
                                    <li className="mb-2">Refunds, if any, as per above policy, will be processed in INR only within 10 working days from the cancellation date.</li>
                                    <li className="mb-2">No interest is payable on refunds.</li>
                                    <li className="mb-2">Cancellation charges apply on the Published Tour Price.</li>
                                    <li className="mb-2">Cancellation of add-on services booked beyond the group tour may incur additional charges.</li>
                                    <li className="mb-2">FREMOR GLOBAL bears no responsibility for any self-arranged travel services.</li>
                                    <li className="mb-2">All cancellation requests must be submitted from the Guest’s registered email address to: connect@fremorglobal.com.</li>
                                </ul>

                                <h4 className="h5 mt-30 mb-15">B. Cancellation by Guest Due to Personal Reasons:</h4>
                                <ul className="mb-4" style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
                                    <li className="mb-2">Guests must submit a written cancellation request via registered email with FREMOR GLOBAL, copy to the booking staff. Verbal or telephonic cancellation is not accepted.</li>
                                    <li className="mb-2">The request must include:
                                        <ul className="mt-2 mb-2" style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                                            <li>Full names of travelers</li>
                                            <li>Tour code/form number</li>
                                            <li>Registered mobile number</li>
                                            <li>Reason for cancellation</li>
                                            <li>Booking receipts</li>
                                        </ul>
                                    </li>
                                    <li className="mb-2">If a single Guest cancels a shared room booking, they shall bear the cost of single occupancy charges.</li>
                                    <li className="mb-2">Re-booking after cancellation will be treated as a fresh booking.</li>
                                    <li className="mb-2">Any Guest canceling in a room-sharing arrangement is liable to pay cancellation based on single occupancy cost.</li>
                                    <li className="mb-2">Any cancellation fees charged by airlines or visa authorities will be the sole responsibility of the Guest, payable immediately.</li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">18. Miscellaneous Provisions</h3>
                                
                                <h4 className="h5 mt-30 mb-15">i. Complaints and Grievances</h4>
                                <p className="mb-4">Any claims, complaints, or grievances by a guest concerning the services provided by an independent contractor (including but not limited to hoteliers, transporters, guides, and other service providers) must be reported directly in writing to the concerned contractor, with a copy handed over to the Tour Leader / Tour Assistant and/or to FREMOR GLOBAL within seven (7) days from the date of the event giving rise to such grievance. Failure to lodge such complaint within the specified period shall be deemed a waiver of the guest's rights to claim or seek redressal.</p>

                                <h4 className="h5 mt-30 mb-15">ii. Data Privacy and Confidentiality</h4>
                                <p className="mb-4">Any personal or sensitive information disclosed by the guest to FREMOR GLOBAL or its representatives shall be maintained in strict confidence. However, the Company shall not be liable for any disclosure made pursuant to legal obligations, judicial orders, governmental regulations, or inquiries by statutory authorities. The Company may use a dedicated WhatsApp group per tour to communicate essential information among group members; no other disclosure shall be made without consent.</p>

                                <h4 className="h5 mt-30 mb-15">iii. NRI and Foreign Guest Compliance</h4>
                                <p className="mb-4">All guests who are Non-Resident Indians (NRIs) or foreign nationals must ensure compliance with the applicable laws, immigration rules, visa conditions, and local regulations of both India and the destination country. Any violation shall be the sole responsibility of the concerned guest, and FREMOR GLOBAL shall not be held liable for the consequences thereof.</p>

                                <h4 className="h5 mt-30 mb-15">iv. Use of Photographs and Video Footage</h4>
                                <p className="mb-4">The Company reserves the unrestricted right to use photographs, video clips, or other media captured during the tour — either by its own personnel or submitted voluntarily by the guest — for promotional, advertising, or marketing purposes, in any format or media. The guest consents to such use without requiring prior approval, provided that the content is used in a manner respectful of the guest’s dignity and personal sentiments.</p>

                                <h4 className="h5 mt-30 mb-15">v. Reference and Promotional Communications</h4>
                                <p className="mb-4">By accepting these terms, the guest authorizes FREMOR GLOBAL to refer their experience or feedback to potential clients or prospects and to contact them via telephone, SMS, email, or other channels for promotional or transactional purposes, subject to applicable data protection laws.</p>

                                <h4 className="h5 mt-30 mb-15">vi. Valuables and Personal Belongings</h4>
                                <p className="mb-4">Guests are strongly advised not to carry valuables such as expensive jewelry, electronics, or large amounts of cash during the tour. In the event of loss, theft, or damage of any personal property, FREMOR GLOBAL shall bear no liability whatsoever, whether arising from negligence, accident, or otherwise.</p>

                                <h4 className="h5 mt-30 mb-15">vii. Shopping</h4>
                                <p className="mb-4">Shopping during the tour is at the sole discretion and judgment of the guest. FREMOR GLOBAL neither recommends nor guarantees the quality, price, or authenticity of any goods or services purchased from local vendors or shops. The Company disclaims all liability in cases of misrepresentation, overpricing, substandard products, or dissatisfaction arising from purchases made during the tour.</p>

                                <h4 className="h5 mt-30 mb-15">viii. Restriction on External Guests</h4>
                                <p className="mb-4">Guests are strictly prohibited from inviting external individuals (non-registered travelers) to join any part of the tour or to use any services arranged by the Company. Violation of this clause may result in immediate removal from the tour without any refund.</p>

                                <h4 className="h5 mt-30 mb-15">ix. Paid Public Toilets</h4>
                                <p className="mb-4">Guests are advised that in certain destinations or transit locations, access to toilet facilities may be chargeable. The cost of such facilities shall be borne solely by the guests and does not form part of the tour package.</p>

                                <h4 className="h5 mt-30 mb-15">x. Governing Law and Jurisdiction</h4>
                                <p className="mb-4">All disputes, claims, or legal proceedings arising out of or in connection with the services provided by FREMOR GLOBAL, including interpretation of these Terms & Conditions, shall be governed by the laws of India. Exclusive jurisdiction shall lie with the competent courts in Mumbai, Maharashtra, to the exclusion of all other forums.</p>

                                <h3 className="h4 mt-40 mb-20">19. Refund Conditions</h3>
                                <h4 className="h5 mt-30 mb-15">i. Mode and Currency of Refund</h4>
                                <p className="mb-4">Refunds, if applicable due to cancellation, modification, or amendment of any tour or service, shall be made by Account Payee Cheque or Bank Transfer in Indian Rupees (INR), at the prevailing exchange rate on the refund date, in accordance with Reserve Bank of India (RBI) regulations, regardless of whether payment was originally made in foreign currency.</p>

                                <h4 className="h5 mt-30 mb-15">ii. No Refund Shall Be Payable In the Following Circumstances:</h4>
                                <ul className="mb-4" style={{ listStyleType: "lower-alpha", paddingLeft: "20px" }}>
                                    <li className="mb-2">For any missed, unutilized, or partially utilized services, meals, activities, or hotel stays, regardless of the reason.</li>
                                    <li className="mb-2">Where advance deposits have been made to secure hotel reservations, airline bookings, visa processing, or other services that are non-refundable.</li>
                                    <li className="mb-2">Where services are curtailed, modified, or unused due to force majeure including, but not limited to, natural disasters, strikes, pandemics, war, or political instability.</li>
                                    <li className="mb-2">If the guest is unable to join the tour or cancels due to a change in government laws or entry regulations of the destination country.</li>
                                    <li className="mb-2">In the case of bulk-contracted airfare bookings where airline terms prevent cancellation or refund.</li>
                                    <li className="mb-2">Where the tour is postponed indefinitely or cancelled due to external events beyond the Company’s control.</li>
                                    <li className="mb-2">For international or domestic air tickets with non-refundable and non-changeable conditions as per airline policies.</li>
                                    <li className="mb-2">Where a visa is not granted in time due to reasons beyond the Company’s control or due to delay or inefficiencies on part of visa processing agents or embassies.</li>
                                    <li className="mb-2">If a guest misses the tour or any segment due to visa denial, passport issues, or documentation deficiencies. In such cases, no refund or compensation shall be claimed against FREMOR GLOBAL.</li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">20. Reservations and Rights of FREMOR GLOBAL</h3>
                                <p>FREMOR GLOBAL reserves the absolute right to:</p>
                                <ul className="mb-4" style={{ listStyleType: "lower-roman", paddingLeft: "20px" }}>
                                    <li className="mb-2">Refuse or grant participation in any group tour, individual (FIT) package, or foreign exchange services, without assigning any reason.</li>
                                    <li className="mb-2">Amend, alter, vary, or withdraw any tour package, itinerary, services, or flight arrangements, whether advertised or otherwise published, without prior notice and without obligation to assign any reason.</li>
                                    <li className="mb-2">Modify or withdraw any discount, benefit, priority seat allocation, or other promotional offers in case of non-payment of the minimum booking deposit or dishonor of cheques issued in favor of FREMOR GLOBAL, without notice and without assigning any reason.</li>
                                    <li className="mb-2">Modify, add, waive, or revise any clause, term, or representation in the brochure, tour documents, or any related materials at any time, with or without prior notice.</li>
                                </ul>

                                <h3 className="h4 mt-40 mb-20">21. Limitation of Liability and Disclaimer</h3>
                                <p>FREMOR GLOBAL acts only as a facilitator of travel services and shall be responsible solely for confirming bookings as per the requirements of the guest. The Company’s liability is limited, and it shall not be held responsible for:</p>
                                <ul className="mb-4" style={{ listStyleType: "lower-roman", paddingLeft: "20px" }}>
                                    <li className="mb-2"><strong>Independent Contractor Services:</strong> FREMOR GLOBAL is not the service provider and merely acts as an intermediary. The Company shall not be liable for deficiencies, delays, cancellations, price increases, or changes by independent contractors including airlines, railways, bus operators, cruise lines, hotels, or other service providers.</li>
                                    <li className="mb-2"><strong>Loss or Damage to Person or Property:</strong> FREMOR GLOBAL shall not be responsible for any loss, injury, accident, theft, damage, or delay suffered by the guest/s, or any third party, whether due to negligence, mishandling, technical failure, or any act or omission of independent contractors or otherwise. Any assistance offered by FREMOR GLOBAL in mitigating such issues shall be considered a courtesy and not an admission of liability.</li>
                                    <li className="mb-2"><strong>Force Majeure Events:</strong> FREMOR GLOBAL shall not be liable for any disruption, curtailment, delay, or cancellation of tour services due to reasons beyond its control, including but not limited to acts of God, natural disasters, pandemics, political unrest, civil disturbances, weather conditions, quarantine, strikes, war, or other unforeseen circumstances.</li>
                                    <li className="mb-2"><strong>Missed Services and Overstay Expenses:</strong> FREMOR GLOBAL shall not be liable for missed flights/trains, sightseeing tours, or additional accommodation/meals/transportation expenses arising due to rescheduling, cancellation, or delays by third-party providers or due to Force Majeure.</li>
                                    <li className="mb-2"><strong>Airline/Rail Services:</strong> The Company shall not be held accountable for flight/train schedule changes, in-flight meals, seating arrangements, baggage handling, or services provided by the carrier.</li>
                                    <li className="mb-2"><strong>Safety of Personal Belongings:</strong> Guests are solely responsible for safeguarding their personal belongings throughout the journey. The Company assumes no liability for any loss, theft, or damage to personal items.</li>
                                    <li className="mb-2"><strong>Personal Health and Medical Incidents:</strong> FREMOR GLOBAL shall not be held responsible for any injury, sickness, disability, or death occurring during the tour. All medical expenses, legal formalities, and repatriation in such instances shall be borne by the guest/s or their legal representatives.</li>
                                    <li className="mb-2"><strong>Involvement of Entertainers or Celebrity Guests:</strong> The participation of any announced celebrity or entertainer in a tour is subject to availability and external conditions. The Company shall not be responsible for any cancellation or non-appearance by such individuals.</li>
                                    <li className="mb-2"><strong>Legal Consequences:</strong> In the event of death, accident, or legal incidents involving the guest during the tour, the guest and/or their legal representatives shall be solely responsible for complying with all applicable legal procedures, and all costs arising therefrom shall be borne by them exclusively.</li>
                                    <li className="mb-2"><strong>Amendments Post-Booking:</strong> FREMOR GLOBAL shall not be held responsible for any consequential loss or costs arising from amendments, variations, or cancellations of the tour services or components after guest registration. Any such changes are subject to availability and may incur additional costs.</li>
                                    <li className="mb-2"><strong>Right to Amend Published Information:</strong> All information included in the tour brochure, website, or communication materials is correct at the time of publication. However, FREMOR GLOBAL reserves the right to amend or update any content, terms, or services before or after booking due to operational exigencies or external factors. The guest shall be informed via SMS and/or email where feasible.</li>
                                    <li className="mb-2"><strong>Guest Relations:</strong> FREMOR GLOBAL considers its guests as part of its extended family. The Company welcomes constructive feedback and is open to dialogue regarding improvement of services. Guests are encouraged to directly contact senior management for any concerns or suggestions.</li>
                                </ul>

                                <div className="mt-5 mb-4 p-4 border rounded bg-light">
                                    <h4 className="h5 mb-3 text-center">Acknowledgement and Consent</h4>
                                    <p className="mb-4">I, ______________________________________, hereby acknowledge that I have carefully read, understood, and agree to abide by the Terms and Conditions (Serial Nos. 1 to 21) as detailed above. I provide my consent freely and unconditionally, without modification, to all clauses contained herein.</p>
                                    <div className="row mt-4">
                                        <div className="col-md-6 mb-3">
                                            <p className="mb-1"><strong>Signature of Guest:</strong> ______________________</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className="mb-1"><strong>Name:</strong> __________________________________</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className="mb-1"><strong>Date:</strong> ___________________________________</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <p className="mb-1"><strong>Place:</strong> __________________________________</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 mb-4 text-center">
                                    <h4 className="h5 mb-3">Acknowledgement Form</h4>
                                    <p className="mb-3">Please download the acknowledgement form, fill in the required details, and send it to our customer support.</p>
                                    <a href="/assets/acknowledgement_form.docx" download className="th-btn style3">
                                        <i className="fa-solid fa-download me-2"></i> Download Form
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Terms
