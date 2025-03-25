import React from 'react';
import './Footer.css'

export default function ReturnPolicy() {
  return (
    <div className="return-policy">
      <h1>Return Policy</h1>
      <p>At MyStore, we want you to be satisfied with your purchase. If you're not, here's how you can return or exchange your items:</p>

      <h3>Returns</h3>
      <p>Items can be returned within 30 days in their original condition. Contact us at <a href="mailto:mutambukijoshua2@gmail.com">support@mystore.com</a> to start the process. Return shipping is the customer’s responsibility unless the item is defective.</p>

      <h3>Refunds</h3>
      <p>Refunds will be issued to your original payment method after we receive and inspect the returned item. This may take 7-10 business days.</p>

      <h3>Exchanges</h3>
      <p>If you want a different size or color, you can exchange your item by following the return process and specifying your preference.</p>

      <h3>Non-Returnable Items</h3>
      <p>Items that are opened, used, or marked as final sale cannot be returned.</p>

      <p className='more-details'>For more details, contact us at <a href="mailto:mutambukijoshua2@gmail.com">support@mystore.com</a>.</p>
    </div>
  );
}
