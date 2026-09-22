/*
 * VoLTE Mobile native legal policy data.
 *
 * Generated from the approved website policy source.
 * Do not edit policy wording independently in the app.
 * Re-audit the website policy source before updating.
 */

export type LegalPolicyBlock = {
  type:
    | 'paragraph'
    | 'bullet';

  text: string;
};

export type LegalPolicySection = {
  sourceId:
    | string
    | null;

  title: string;

  blocks:
    LegalPolicyBlock[];
};

export type LegalPolicy = {
  id: string;

  title: string;

  intro: string;

  lastUpdated:
    | string
    | null;

  sourceHash: string;

  sections:
    LegalPolicySection[];
};

export const LEGAL_POLICIES = {
  "privacy": {
    "id": "privacy",
    "title": "Privacy Policy",
    "intro": "How VoLTE Mobile collects, uses and protects personal information when you use our website, purchase products, apply for financing or use our connected services.",
    "lastUpdated": "August 2026",
    "sourceHash": "0a3aa9b2f2791709c638982700eaa42d007ae78b81a419c688de472a451c9d84",
    "sections": [
      {
        "sourceId": null,
        "title": "1. About this Privacy Policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "This Privacy Policy explains how VoLTE Mobile collects, uses, stores, shares and protects personal information in connection with our website, customer accounts, sales, financing, delivery, support and connected services."
          },
          {
            "type": "paragraph",
            "text": "We process personal information in accordance with applicable Jamaican law, including the Data Protection Act, and seek to handle personal information fairly, lawfully and securely."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "2. Information we may collect",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Depending on how you interact with VoLTE Mobile, we may collect information including:"
          },
          {
            "type": "bullet",
            "text": "Your name, email address and telephone number."
          },
          {
            "type": "bullet",
            "text": "Billing, delivery, pickup and other contact information."
          },
          {
            "type": "bullet",
            "text": "Customer account and authentication information."
          },
          {
            "type": "bullet",
            "text": "Products, orders, payments, transaction history and account activity."
          },
          {
            "type": "bullet",
            "text": "Delivery preferences, delivery address, parish, landmarks or delivery instructions."
          },
          {
            "type": "bullet",
            "text": "Device information such as serial numbers or IMEI information where relevant to a purchase, financing arrangement, warranty, support or device service."
          },
          {
            "type": "bullet",
            "text": "Financing enquiries and information required to assess, administer or service a financing arrangement."
          },
          {
            "type": "bullet",
            "text": "Identification, supporting documentation and other information where required during a financing, verification or customer-service process."
          },
          {
            "type": "bullet",
            "text": "VoLTE IPTV, subscription, SIM, airtime, data or other service and account activity where applicable."
          },
          {
            "type": "bullet",
            "text": "Communications you send to us through support, enquiries or other customer-service channels."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "3. How we use your information",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We may use personal information to:"
          },
          {
            "type": "bullet",
            "text": "Create and manage customer accounts."
          },
          {
            "type": "bullet",
            "text": "Process and fulfil purchases and service requests."
          },
          {
            "type": "bullet",
            "text": "Process payments and confirm transactions."
          },
          {
            "type": "bullet",
            "text": "Arrange delivery, pickup and order-status communications."
          },
          {
            "type": "bullet",
            "text": "Review and administer financing enquiries and applications."
          },
          {
            "type": "bullet",
            "text": "Provision, maintain and support products and connected services."
          },
          {
            "type": "bullet",
            "text": "Provide customer service, technical assistance and account support."
          },
          {
            "type": "bullet",
            "text": "Prevent fraud, misuse, unauthorized transactions and other security threats."
          },
          {
            "type": "bullet",
            "text": "Maintain business, financial and regulatory records."
          },
          {
            "type": "bullet",
            "text": "Meet legal, regulatory and contractual obligations."
          },
          {
            "type": "bullet",
            "text": "Improve our website, products, services and customer experience."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "4. Payments",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Online payments may be processed through third-party payment providers such as Stripe. Payment-card information submitted directly to a payment processor is handled in accordance with that provider's security and privacy practices."
          },
          {
            "type": "paragraph",
            "text": "VoLTE Mobile may receive transaction information required to confirm, record, reconcile and support your purchase without receiving all of the payment-card information handled by the payment processor."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "5. Service providers and sharing",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We may share information with trusted service providers where reasonably necessary to operate our business and provide the service you requested. These may include payment processors, technology and hosting providers, authentication and database providers, delivery partners, communications providers and service-platform partners."
          },
          {
            "type": "paragraph",
            "text": "We may also disclose information where required by law, regulation, court order or a lawful request from a competent authority, or where reasonably necessary to protect our customers, business or legal rights."
          },
          {
            "type": "paragraph",
            "text": "We do not sell your personal information."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "6. Financing information",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A financing enquiry submitted through the website may begin with basic contact and device information. If the enquiry progresses, additional information or supporting documentation may be requested through our financing or customer-verification process."
          },
          {
            "type": "paragraph",
            "text": "Financing information is used only for legitimate purposes connected with evaluating, establishing, administering and servicing the financing relationship, meeting legal requirements and managing associated risk."
          }
        ]
      },
      {
        "sourceId": "data-protection",
        "title": "7. Data protection and security",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE Mobile uses reasonable administrative, technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration or disclosure."
          },
          {
            "type": "paragraph",
            "text": "No electronic system can be guaranteed to be completely secure. Customers should also protect their passwords, email accounts, devices and other credentials used to access VoLTE Mobile services."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "8. Data retention",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We retain personal information for as long as reasonably necessary for the purposes for which it was collected, including providing services, maintaining transaction and account records, resolving disputes, enforcing agreements and meeting legal, accounting or regulatory requirements."
          },
          {
            "type": "paragraph",
            "text": "Information that is no longer reasonably required will be deleted, anonymized or otherwise handled in accordance with applicable data-protection requirements."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "9. International service providers",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Some technology, payment or service providers used by VoLTE Mobile may process or store information outside Jamaica. Where personal information is transferred or processed internationally, we seek to use appropriate safeguards consistent with applicable data-protection requirements."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "10. Your privacy rights",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Subject to applicable Jamaican law, you may have rights concerning your personal information, including rights to request access to information held about you, request correction of inaccurate information, object to or restrict certain processing, and exercise other rights provided by law."
          },
          {
            "type": "paragraph",
            "text": "We may need to verify your identity before fulfilling a privacy request."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "11. Children's information",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Our online purchasing and financing services are not intended to allow children to independently enter contracts or financing arrangements. Where information relating to a minor must legitimately be processed, we will handle it in accordance with applicable legal requirements."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "12. Changes to this policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We may update this Privacy Policy when our services, technology, business practices or legal obligations change. The latest version will be published on this page with its effective or updated date."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "13. Contact us",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Questions, privacy enquiries or requests concerning personal information may be submitted through the VoLTE Mobile Support page or through our published customer contact channels."
          }
        ]
      }
    ]
  },
  "terms": {
    "id": "terms",
    "title": "Terms of Use",
    "intro": "These Terms govern your access to and use of the VoLTE Mobile website, customer accounts, online services and digital features.",
    "lastUpdated": "August 2026",
    "sourceHash": "7f54ee5ade78b60bbb35881dc5456a93d7d810be34c7c6b1bc652096e8a325ec",
    "sections": [
      {
        "sourceId": null,
        "title": "1. About these Terms",
        "blocks": [
          {
            "type": "paragraph",
            "text": "These Terms of Use apply when you access or use the VoLTE Mobile website, create or access a customer account, submit information, make an enquiry, apply for financing, purchase products or use services made available through our website."
          },
          {
            "type": "paragraph",
            "text": "By using the website, you agree to comply with these Terms and applicable Jamaican law. If you do not agree with these Terms, you should not use the website or its online services."
          },
          {
            "type": "paragraph",
            "text": "Additional terms may apply to particular products, financing arrangements, subscriptions, promotions or services. Where applicable, those additional terms form part of the agreement relating to that product or service."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "2. VoLTE Mobile services",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE Mobile provides and facilitates access to smartphones, accessories, SIM products, airtime and data services, device financing, VoLTE IPTV and other connected products and services."
          },
          {
            "type": "paragraph",
            "text": "Products, services, features and purchasing options may change from time to time and may be subject to availability, eligibility, geographic coverage, technical requirements or separate service terms."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "3. Customer accounts",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Certain features may require a customer account. You are responsible for providing accurate information and for keeping your account information reasonably current."
          },
          {
            "type": "paragraph",
            "text": "You are responsible for maintaining the confidentiality of your password, authentication credentials and access to the email address or device associated with your account."
          },
          {
            "type": "paragraph",
            "text": "You should notify VoLTE Mobile promptly if you believe your account or credentials have been accessed or used without authorization."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "4. Orders and purchases",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Placing an order through the website constitutes a request to purchase the selected product or service. Receipt of an order does not necessarily mean that the order has been accepted."
          },
          {
            "type": "paragraph",
            "text": "Orders may be subject to payment authorization, inventory availability, customer verification, service eligibility, delivery availability and any other requirements applicable to the particular transaction."
          },
          {
            "type": "paragraph",
            "text": "VoLTE Mobile may decline or cancel an order where reasonably necessary, including where a product is unavailable, payment cannot be authorized, information supplied is materially inaccurate, an apparent pricing or listing error has occurred, fraud or misuse is suspected, or the transaction cannot lawfully or reasonably be completed."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "5. Pricing, availability and product information",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We seek to ensure that product descriptions, prices, images and availability information displayed on the website are accurate. However, errors, delays or changes may occasionally occur."
          },
          {
            "type": "paragraph",
            "text": "Prices and promotional offers may change without prior notice before an order is accepted. Product availability is not guaranteed until the applicable transaction is confirmed."
          },
          {
            "type": "paragraph",
            "text": "Product images are provided for identification and presentation. Actual appearance, packaging, colour or included items may vary where permitted by the manufacturer or disclosed during the purchasing process."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "6. Payments",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Where online payment is available, payments may be processed through third-party payment providers. You authorize the applicable payment provider to process the transaction information necessary to complete your purchase."
          },
          {
            "type": "paragraph",
            "text": "You must use a payment method that you are authorized to use. Transactions may be subject to verification, fraud-prevention measures and authorization by the relevant financial institution or payment provider."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "7. Device financing",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Submission of a financing enquiry or application does not guarantee approval, a particular credit limit, a particular device or any specific financing terms."
          },
          {
            "type": "paragraph",
            "text": "Financing may be subject to eligibility requirements, verification, supporting documentation, approval, deposit requirements and separate financing terms or agreements."
          },
          {
            "type": "paragraph",
            "text": "Where a separate financing agreement is entered into, that agreement governs the financing relationship in addition to applicable law and any relevant provisions of these Terms."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "8. Digital and connected services",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE IPTV, SIM services, airtime, data, subscriptions and other digital or connected services may require activation, compatible equipment, internet or mobile connectivity, third-party networks or service platforms."
          },
          {
            "type": "paragraph",
            "text": "Availability and performance may be affected by network conditions, geographic location, maintenance, third-party infrastructure, device compatibility and circumstances outside VoLTE Mobile's reasonable control."
          },
          {
            "type": "paragraph",
            "text": "Additional service-specific terms may apply and will govern the relevant service together with applicable law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "9. Delivery and pickup",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Delivery and pickup options are subject to availability, verification and any geographic or operational restrictions applicable to the order."
          },
          {
            "type": "paragraph",
            "text": "Delivery dates or time estimates are estimates unless expressly confirmed otherwise. Delays may occur because of traffic, weather, courier operations, customer availability or other circumstances outside our reasonable control."
          },
          {
            "type": "paragraph",
            "text": "Identification, order confirmation or other reasonable verification may be required before products are released or delivered."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "10. Electronic communications",
        "blocks": [
          {
            "type": "paragraph",
            "text": "When you use our website, submit an enquiry, create an account or complete a transaction, you may receive communications electronically concerning your account, order, payment, financing request, delivery, service or support request."
          },
          {
            "type": "paragraph",
            "text": "Transactional and service communications may be delivered using the contact information you provide, including email, telephone or other supported communication channels."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "11. Acceptable use",
        "blocks": [
          {
            "type": "paragraph",
            "text": "You must not use the website or our online services to:"
          },
          {
            "type": "bullet",
            "text": "Engage in unlawful, fraudulent or deceptive activity."
          },
          {
            "type": "bullet",
            "text": "Attempt to gain unauthorized access to accounts, systems, databases or restricted areas."
          },
          {
            "type": "bullet",
            "text": "Interfere with the security, availability or operation of the website or related systems."
          },
          {
            "type": "bullet",
            "text": "Submit false, misleading or unauthorized information in connection with an order, payment or financing application."
          },
          {
            "type": "bullet",
            "text": "Introduce malicious code or use automated methods in a manner that disrupts or unreasonably burdens the website."
          },
          {
            "type": "bullet",
            "text": "Use the website or its content in a manner that infringes the rights of VoLTE Mobile or another person."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "12. Intellectual property",
        "blocks": [
          {
            "type": "paragraph",
            "text": "The VoLTE Mobile name, branding, website design, original graphics, written content and other materials owned by VoLTE Mobile are protected by applicable intellectual-property laws."
          },
          {
            "type": "paragraph",
            "text": "Third-party trademarks, product names, images and other intellectual property remain the property of their respective owners."
          },
          {
            "type": "paragraph",
            "text": "You may use the website for lawful personal and transactional purposes. You may not reproduce, distribute, modify, exploit or commercially use protected website content without the appropriate permission or legal right."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "13. Third-party services",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Some website functions or VoLTE Mobile services rely on third-party providers, including payment processors, technology platforms, communications providers, delivery services and other service partners."
          },
          {
            "type": "paragraph",
            "text": "Your use of a third-party service may also be subject to that provider's applicable terms and policies. VoLTE Mobile does not control third-party systems and is not responsible for failures caused solely by services or infrastructure outside our reasonable control, subject always to rights and remedies available under applicable law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "14. Website and service availability",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We seek to maintain reliable access to our website and online services but do not guarantee uninterrupted or error-free availability."
          },
          {
            "type": "paragraph",
            "text": "We may maintain, modify, suspend or discontinue website features where reasonably necessary for security, maintenance, technical, commercial or legal reasons."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "15. Liability and statutory rights",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Nothing in these Terms excludes, restricts or limits any right, remedy, guarantee, obligation or liability that cannot lawfully be excluded or limited under applicable Jamaican law."
          },
          {
            "type": "paragraph",
            "text": "To the extent permitted by law, VoLTE Mobile is not responsible for loss resulting solely from circumstances outside our reasonable control, unauthorized customer account access caused by a customer's failure to protect credentials, or misuse of products or services contrary to supplied instructions or applicable terms."
          },
          {
            "type": "paragraph",
            "text": "These Terms must be read together with applicable consumer protection laws and our Sales, Returns & Refund Policy."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "16. Privacy and data protection",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Personal information collected through the website and our connected services is handled in accordance with the VoLTE Mobile Privacy Policy and applicable data-protection requirements."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "17. Changes to these Terms",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We may update these Terms where our website, products, services, business practices or legal obligations change. The current version will be published on this page with its updated date."
          },
          {
            "type": "paragraph",
            "text": "Changes will apply prospectively from their effective date and will not retrospectively remove rights that have already arisen under applicable law or an existing agreement."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "18. Governing law",
        "blocks": [
          {
            "type": "paragraph",
            "text": "These Terms and your use of the VoLTE Mobile website are governed by the laws of Jamaica, subject to any mandatory rights or remedies provided by applicable law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "19. Contact us",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Questions concerning these Terms, an order, account or VoLTE Mobile service may be submitted through the VoLTE Mobile Support page or through our published customer contact channels."
          }
        ]
      }
    ]
  },
  "sales-returns": {
    "id": "sales-returns",
    "title": "Sales, Returns & Refund Policy",
    "intro": "This Policy explains the terms that apply to purchases, returns, exchanges, cancellations and refunds for products and services purchased from VoLTE Mobile.",
    "lastUpdated": "August 2026",
    "sourceHash": "c102f575eb996dd850926e09a27c811655e3e5e4c6f57d8a9712b4fe69b47a60",
    "sections": [
      {
        "sourceId": null,
        "title": "1. About this Policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "This Sales, Returns & Refund Policy applies to eligible products and services purchased directly from VoLTE Mobile, including through our website and other authorized VoLTE Mobile sales channels."
          },
          {
            "type": "paragraph",
            "text": "Different conditions may apply depending on whether your purchase is a physical product, an activated service, digital product, subscription or other connected service. Any product-specific or service-specific terms disclosed at the time of purchase also form part of the applicable transaction."
          },
          {
            "type": "paragraph",
            "text": "Nothing in this Policy is intended to exclude, restrict or reduce any right or remedy that cannot lawfully be excluded or restricted under applicable Jamaican law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "2. Physical products",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Physical products include smartphones, tablets, accessories, chargers, audio products, SIM products and other tangible goods sold by VoLTE Mobile."
          },
          {
            "type": "paragraph",
            "text": "If you believe a physical product supplied by VoLTE Mobile is defective, damaged, materially different from what was ordered, or otherwise does not conform to the applicable sale, please contact VoLTE Mobile as soon as reasonably possible after discovering the issue."
          },
          {
            "type": "paragraph",
            "text": "We may request reasonable information needed to verify the purchase and assess the product, including proof of purchase, order information, photographs, serial numbers, IMEI information or inspection of the product where appropriate."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "3. Change-of-mind returns",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A return requested solely because a customer has changed their mind is not automatically guaranteed. VoLTE Mobile may, at its discretion and subject to applicable law, approve a change-of-mind return for an eligible physical product."
          },
          {
            "type": "paragraph",
            "text": "Where such a return is approved, the product should normally be unused, undamaged and complete with its original packaging, accessories, manuals and other items supplied with it. Devices or products that have been materially used, damaged, altered or rendered unsuitable for resale may not qualify."
          },
          {
            "type": "paragraph",
            "text": "This section does not limit any separate rights a customer may have where goods are defective, misrepresented or otherwise subject to a remedy under applicable law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "4. Devices, IMEI and serialized products",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Smartphones and certain other products may be individually identified by an IMEI, serial number or other unique device identifier. Any product presented for return, exchange, warranty support or other remedy must correspond with the product supplied under the relevant VoLTE Mobile transaction."
          },
          {
            "type": "paragraph",
            "text": "VoLTE Mobile may verify the IMEI, serial number, condition and transaction record before processing a return, exchange or other remedy."
          },
          {
            "type": "paragraph",
            "text": "Customers should remove personal information and, where appropriate, disable personal account locks or device security features before surrendering a device for an approved return or exchange. Customers remain responsible for backing up information they wish to retain."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "5. Defective products and warranty matters",
        "blocks": [
          {
            "type": "paragraph",
            "text": "A product reported as defective may require reasonable assessment before the appropriate remedy can be determined. Depending on the circumstances, applicable law and any relevant manufacturer or supplier warranty, the available remedy may include repair, replacement, exchange, refund or another appropriate resolution."
          },
          {
            "type": "paragraph",
            "text": "Manufacturer warranties may be subject to their own terms, procedures and exclusions. A manufacturer's warranty does not remove any rights or remedies that may otherwise apply to the transaction under Jamaican law."
          },
          {
            "type": "paragraph",
            "text": "Damage resulting from accident, misuse, unauthorized modification, liquid exposure, improper installation or other circumstances unrelated to an original product defect may not qualify as a product defect or warranty matter."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "6. Incorrect or damaged orders",
        "blocks": [
          {
            "type": "paragraph",
            "text": "If you receive an incorrect product, an incomplete order or a product that appears to have been damaged before or during delivery, please contact VoLTE Mobile promptly so that the matter can be investigated and resolved."
          },
          {
            "type": "paragraph",
            "text": "We may request photographs, packaging information, delivery information or other reasonable evidence to help verify what occurred."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "7. Order cancellations",
        "blocks": [
          {
            "type": "paragraph",
            "text": "If you wish to cancel an order, contact VoLTE Mobile as soon as possible. We will make reasonable efforts to accommodate a cancellation request where the order has not already been processed, dispatched, activated or otherwise fulfilled."
          },
          {
            "type": "paragraph",
            "text": "Once a physical order has been dispatched or a service has been activated, different return, cancellation or service terms may apply."
          },
          {
            "type": "paragraph",
            "text": "VoLTE Mobile may also cancel an order where reasonably necessary, including where a product becomes unavailable, payment cannot be authorized, customer or transaction information cannot be verified, a material pricing or listing error has occurred, fraud or misuse is suspected, or the transaction cannot lawfully or reasonably be completed."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "8. SIM cards and activated mobile services",
        "blocks": [
          {
            "type": "paragraph",
            "text": "SIM cards and related mobile services may require activation, registration, network provisioning or assignment of service credentials."
          },
          {
            "type": "paragraph",
            "text": "Once a SIM or associated service has been activated, registered or provisioned for a customer, it may not be eligible for a change-of-mind return or refund because the service has already been supplied or allocated."
          },
          {
            "type": "paragraph",
            "text": "This does not affect any remedy that may be available where the SIM or service is defective, incorrectly supplied or otherwise subject to rights that apply under Jamaican law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "9. Airtime, data and digital credit",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Airtime, mobile data, digital credit and similar electronic products are generally fulfilled electronically and may be applied directly to a specified mobile number or account."
          },
          {
            "type": "paragraph",
            "text": "Once successfully delivered, credited, redeemed or otherwise fulfilled to the number or account supplied by the customer, these products are generally not eligible for cancellation, exchange or refund except where required by law or where VoLTE Mobile determines that the transaction was not correctly fulfilled."
          },
          {
            "type": "paragraph",
            "text": "Customers are responsible for checking the mobile number, account details and product selection before confirming a transaction."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "10. VoLTE IPTV and digital services",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE IPTV and certain other digital or connected services require account creation, subscription activation, service provisioning or the issue of customer credentials."
          },
          {
            "type": "paragraph",
            "text": "Once a VoLTE IPTV service has been activated or provisioned, payments relating to that activated service are non-refundable except where a refund or other remedy is required by applicable law or where VoLTE Mobile determines that the purchased service was not properly supplied."
          },
          {
            "type": "paragraph",
            "text": "Service availability may depend on compatible equipment, internet connectivity, third-party infrastructure, geographic location and other technical requirements. Customers are responsible for ensuring that they have suitable internet access and compatible equipment unless expressly stated otherwise."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "11. Subscriptions and recurring services",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Where a product or service is supplied on a subscription or recurring basis, cancellation of future service does not automatically create a right to a refund for a period of service that has already begun, been activated or been supplied."
          },
          {
            "type": "paragraph",
            "text": "Any applicable subscription-specific cancellation terms, billing cycle requirements or service conditions disclosed when the subscription is purchased will also apply."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "12. Device financing",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Devices obtained through a financing arrangement may be subject to separate financing terms, approval conditions, payment obligations and device-management requirements."
          },
          {
            "type": "paragraph",
            "text": "Returning a financed device does not, by itself, cancel or discharge a financing agreement or outstanding financial obligation. Any approved return involving a financed device must be handled together with the applicable financing agreement and any rights available under law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "13. Delivery and pickup",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Customers should reasonably inspect an order after receiving it and report any apparent delivery issue, incorrect item, missing item or visible damage promptly."
          },
          {
            "type": "paragraph",
            "text": "Delivery charges already incurred may not necessarily be refundable where the underlying goods were correctly supplied and the return is requested solely as a change-of-mind return."
          },
          {
            "type": "paragraph",
            "text": "Where VoLTE Mobile is responsible for supplying an incorrect or qualifying defective product, we will determine the appropriate return or collection arrangement having regard to the circumstances and applicable law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "14. Refund processing",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Where a refund is approved, VoLTE Mobile may require reasonable verification of the original transaction, customer and payment method before processing the refund."
          },
          {
            "type": "paragraph",
            "text": "Approved refunds will ordinarily be returned through an appropriate payment method. Processing times may vary depending on the payment provider, financial institution and method originally used."
          },
          {
            "type": "paragraph",
            "text": "A refund is considered processed by VoLTE Mobile when it has been submitted to the applicable payment provider or otherwise issued through the agreed refund method. Additional time taken by a bank, card issuer or payment provider to reflect the funds is outside VoLTE Mobile's direct control."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "15. Promotions, bundles and discounted purchases",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Products purchased as part of a bundle, promotion, discount or special offer may be subject to the conditions of that offer."
          },
          {
            "type": "paragraph",
            "text": "Where an approved return affects the conditions that qualified a transaction for a discount, bundle price or promotional benefit, the value of the refund or adjustment may reasonably take account of the remaining products and the terms of the original promotion, subject to applicable law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "16. How to request a return or refund",
        "blocks": [
          {
            "type": "paragraph",
            "text": "To request assistance with a return, exchange, cancellation or refund, contact VoLTE Mobile through our published customer-support channels and provide sufficient information for us to identify the transaction."
          },
          {
            "type": "paragraph",
            "text": "Depending on the request, we may ask for your order number, proof of purchase, customer details, product information, IMEI or serial number, photographs, payment information or other reasonable information necessary to investigate and process the request."
          },
          {
            "type": "paragraph",
            "text": "Visit our Support page to contact VoLTE Mobile."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "17. Consumer rights",
        "blocks": [
          {
            "type": "paragraph",
            "text": "This Policy should be read together with the applicable terms of your purchase and the laws of Jamaica."
          },
          {
            "type": "paragraph",
            "text": "Nothing in this Policy is intended to waive, exclude, restrict or limit any statutory consumer right, remedy, guarantee or obligation that cannot lawfully be waived, excluded, restricted or limited."
          },
          {
            "type": "paragraph",
            "text": "Where a provision of this Policy conflicts with a mandatory requirement of applicable law, the mandatory legal requirement will apply to the extent of that conflict."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "18. Changes to this Policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE Mobile may update this Policy where our products, services, fulfilment methods, business practices or legal obligations change."
          },
          {
            "type": "paragraph",
            "text": "The current version will be published on this page with its updated date. Changes will apply prospectively from their effective date and will not retrospectively remove rights that have already arisen under applicable law or an existing agreement."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "19. Contact us",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Questions concerning a sale, return, exchange, cancellation or refund may be submitted through the VoLTE Mobile Support page or through our published customer contact channels."
          }
        ]
      }
    ]
  },
  "delivery-policy": {
    "id": "delivery-policy",
    "title": "Delivery & Pickup Policy",
    "intro": "This Policy explains the delivery and pickup arrangements that may apply to eligible VoLTE Mobile orders in Jamaica.",
    "lastUpdated": null,
    "sourceHash": "e47ae82c97f23e97520a7df676168de24ce77339f2c22252f203762e96470b8c",
    "sections": [
      {
        "sourceId": null,
        "title": "1. About this Policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Delivery and pickup options are offered subject to availability, customer and order verification, geographic coverage, product or service eligibility and operational requirements applicable to the particular order."
          },
          {
            "type": "paragraph",
            "text": "The delivery or pickup options available to you will ordinarily be presented during checkout or otherwise confirmed by VoLTE Mobile."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "2. Delivery availability",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Delivery availability may vary by parish, community, address, product, order size, courier coverage and other operational factors."
          },
          {
            "type": "paragraph",
            "text": "Submission of an order does not guarantee that a particular delivery method, courier, service level or delivery timeframe will be available."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "3. Delivery charges",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Where a delivery charge applies, the applicable charge will be calculated or displayed as part of the order process before payment is completed, subject to the information available for the selected delivery service."
          },
          {
            "type": "paragraph",
            "text": "Delivery charges may vary according to destination, service type, weight, dimensions, courier requirements or other factors relevant to fulfilment."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "4. Delivery information",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Customers are responsible for providing reasonably complete and accurate delivery information, including the recipient name, telephone number, delivery address, parish and any information reasonably required to locate or contact the recipient."
          },
          {
            "type": "paragraph",
            "text": "Incorrect, incomplete or outdated information may delay delivery or require additional verification."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "5. Delivery estimates",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Delivery dates and time estimates are estimates unless VoLTE Mobile expressly confirms otherwise."
          },
          {
            "type": "paragraph",
            "text": "Delivery may be affected by traffic, weather, courier operations, customer availability, geographic conditions, public emergencies or other circumstances outside our reasonable control."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "6. Receipt and verification",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Identification, order confirmation, recipient verification or other reasonable evidence may be required before an order is released or delivered."
          },
          {
            "type": "paragraph",
            "text": "Customers should reasonably inspect physical orders after receipt and report any apparent incorrect item, missing item or visible delivery damage promptly."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "7. Pickup orders",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Where pickup is available, the selected location and any applicable collection instructions will be confirmed as part of the order process."
          },
          {
            "type": "paragraph",
            "text": "Pickup orders may require reasonable proof of identity, order confirmation or other verification before release."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "8. Failed or delayed delivery",
        "blocks": [
          {
            "type": "paragraph",
            "text": "If a delivery cannot be completed, VoLTE Mobile or the applicable delivery provider may contact the customer or recipient using the information supplied with the order."
          },
          {
            "type": "paragraph",
            "text": "A failed delivery may require rescheduling, collection, additional delivery arrangements or other reasonable steps depending on the circumstances."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "9. Incorrect or damaged orders",
        "blocks": [
          {
            "type": "paragraph",
            "text": "If you receive an incorrect product, an incomplete order or a product that appears to have been damaged before or during delivery, please contact VoLTE Mobile promptly so the matter can be investigated."
          },
          {
            "type": "paragraph",
            "text": "We may request photographs, packaging information, delivery information, serial or IMEI information or other reasonable evidence relevant to the issue."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "10. Returns and delivery charges",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Returns, exchanges, cancellations and refunds are governed by our Sales, Returns & Refund Policy ."
          },
          {
            "type": "paragraph",
            "text": "Delivery charges already incurred may not necessarily be refundable where the underlying goods were correctly supplied and a return is requested solely as a change-of-mind return, subject always to applicable law and the circumstances of the transaction."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "11. Third-party delivery providers",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE Mobile may use third-party delivery or transportation providers to fulfil eligible orders."
          },
          {
            "type": "paragraph",
            "text": "Third-party services may be subject to operational requirements outside VoLTE Mobile's direct control, without limiting rights or remedies available under applicable law."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "12. Contact and support",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Questions about delivery, pickup or an existing order may be submitted through our Support page ."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "13. Related policies",
        "blocks": [
          {
            "type": "paragraph",
            "text": "This Policy should be read together with our Terms of Use , Sales, Returns & Refund Policy and Privacy Policy ."
          }
        ]
      },
      {
        "sourceId": null,
        "title": "14. Changes to this Policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE Mobile may update this Policy when delivery arrangements, fulfilment services, operational requirements or applicable legal obligations change."
          }
        ]
      }
    ]
  },
  "data-protection": {
    "id": "data-protection",
    "title": "Data Protection",
    "intro": "Data protection and security information from the VoLTE Mobile Privacy Policy.",
    "lastUpdated": "August 2026",
    "sourceHash": "0a3aa9b2f2791709c638982700eaa42d007ae78b81a419c688de472a451c9d84",
    "sections": [
      {
        "sourceId": "data-protection",
        "title": "7. Data protection and security",
        "blocks": [
          {
            "type": "paragraph",
            "text": "VoLTE Mobile uses reasonable administrative, technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration or disclosure."
          },
          {
            "type": "paragraph",
            "text": "No electronic system can be guaranteed to be completely secure. Customers should also protect their passwords, email accounts, devices and other credentials used to access VoLTE Mobile services."
          }
        ]
      }
    ]
  }
} as const satisfies Record<string, LegalPolicy>;

export type LegalPolicyId =
  keyof typeof LEGAL_POLICIES;
