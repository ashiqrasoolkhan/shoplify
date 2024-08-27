let itemCounter = 0;

function addInvoiceItem() {
    itemCounter++;

    const newItemRow = `
    <tr id="itemRow${itemCounter}">
        <td><input type="text" class="form-control" placeholder="Enter Your Item Or Service" required></td>
        <td><input type="number" class="form-control quantity" placeholder="Quantity" required></td>
        <td><input type="number" class="form-control price" placeholder="Price" required></td>
        <td><input type="number" class="form-control totalItemPrice" disabled readonly></td>
        <td><button type="button" class="btn btn-danger" onClick="removeInvoiceItem(${itemCounter})">Remove</button></td>
    </tr>
    `;

    $("#invoiceItems").append(newItemRow);
    updateTotalAmount();
}

function removeInvoiceItem(itemId) {
    $(`#itemRow${itemId}`).remove();
    updateTotalAmount();
}

function updateTotalAmount() {
    let totalAmount = 0;
    $("tr[id^='itemRow']").each(function () {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const price = parseFloat($(this).find(".price").val()) || 0;
        const totalItemPrice = quantity * price;
        $(this).find(".totalItemPrice").val(totalItemPrice.toFixed(2));
        totalAmount += totalItemPrice;
    });
    console.log("Total Amount: ", totalAmount); // Debugging line
    $("#totalAmount").val(totalAmount.toFixed(2));
}

$(document).ready(function () {
    // Set the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    $("#date").val(formattedDate);

    // Handle form submission
    $("#invoiceform").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission
        console.log("Form submitted"); // Debugging line
        updateTotalAmount(); // Update the total amount on form submission
    });
})

function printInvoice(){
    const invoiceNumber = $("#invoiceNumber").val();
    const date = $("#date").val();
    const companyName = $("#companyName").val();
    const customerName = $("#customerName").val();
    const customerAddress = $("#customerAddress").val();
    const phoneNumber = $("#phoneNumber").val();
    const items = [];

    // Extract table row data
    $("tr[id^='itemRow']").each(function() {
        const description = $(this).find("td:eq(0) input").val() || '';
        const quantity = $(this).find("td:eq(1) input").val() || '';
        const price = $(this).find("td:eq(2) input").val() || '';
        const totalItemPrice = $(this).find("td:eq(3) input").val() || '';

        items.push({
            description: description,
            quantity: quantity,
            price: price,
            totalItemPrice: totalItemPrice
        });
    });
    
const totalAmount = $("#totalAmount").val();

const invoiceContent = `
<html>
        <head>
            <title>Invoice Slip</title>
             
            <style>

                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                     .invoice-header {
            display: flex;
            align-items: center;
        }
        .invoice-header h1 {
            margin-right: 20px;
        }
        .barcode {
            margin-left: 20px;
        }
                h1 {
                    color: #007bff;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid black;
                    text-align: left;
                    padding: 8px;
                }
                .total {
                    font-weight: bold;
                }
                    .copyright{
                    margin-bottom:50px;}
            </style>
        </head>
        <body>
       
        <h2>Invoice Slip</h2>
        
    </div>
    <hr>
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Invoice Date:</strong> ${date}</p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>From:</strong> ${companyName}</p>
            <p><strong>Customer Address:</strong> ${customerAddress}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <hr>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item) => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${item.totalItemPrice}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
            <hr>
            <p class="total">Total Amount: ${totalAmount}</p>
            <p class="">Warranty: ${Warranty}</p>
            <p  class="copyright" class="total">This Invoice is generated by Shoplify 2024-25 </p>
            
        </body>`;

const printWindow = window.open("","_blank");
printWindow.document.write(invoiceContent);
printWindow.document.close();
printWindow.print();
    
}

document.getElementById('generateButton').addEventListener('click', function() {
    // Get the input values
    const totalAmount = parseFloat(document.getElementById('totalAmount').value);
    const discountAmount = parseFloat(document.getElementById('discountAmount').value);

    // Check if inputs are valid numbers
    if (isNaN(totalAmount) || isNaN(discountAmount)) {
        alert("Please enter valid numbers for both fields.");
        return;
    }

    // Calculate the amount payable
    const amountPayable = totalAmount - discountAmount;

    // Display the result
    document.getElementById('result').textContent = `Amount Payable: $${amountPayable.toFixed(2)}`;
});

