process.env.UV_THREAD_POOL_SIZE = 10;
const cluster = require('cluster');

if(cluster.isMaster){
    cluster.fork();
    // cluster.fork();
    // cluster.fork();
} else {
    const express = require('express');
const app = express();
const { createPDF } = require("./pdfCreator.js");

function doWork(duration) {

    const start = Date.now();

    while(Date.now() - start < duration) {}


}
app.get('/', (req, res) => {
    //doWork(5000);
    res.send("new Request");
})

app.get('/new', (req, res) => {

    const invoice = {
      shipping: {
        name: "John Doe",
        address: "1234 Main Street",
        city: "San Francisco",
        state: "CA",
        country: "US",
        postal_code: 94111
      },
      items: [
        {
          item: "TC 100",
          description: "Toner Cartridge",
          quantity: 2,
          amount: 6000
        },
        {
          item: "USB_EXT",
          description: "USB Cable Extender",
          quantity: 1,
          amount: 2000
        }
      ],
      subtotal: 8000,
      paid: 0,
      invoice_nr: 1234
    };
    
    createPDF(invoice, "invoice.pdf");
    console.log("invoice done");
    res.send("new Request");
})

app.listen(3000);
}
