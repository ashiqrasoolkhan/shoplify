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
    $("#totalAmount").val(totalAmount.toFixed(2));
}

function calculateAmountPayable() {
    let totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
    let discount = parseFloat(document.getElementById('discount').value) || 0;
    let amountPayable = totalAmount - discount;
    document.getElementById('amountPayable').value = amountPayable.toFixed(2);
}

$(document).ready(function () {
    // Set the current date
    const currentDate = new Date().toISOString().slice(0, 10);
    $("#date").val(currentDate);

    // Event listeners for live updates
    $('#totalAmount').on('input', calculateAmountPayable);
    $('#discount').on('input', calculateAmountPayable);

    // Handle form submission
    $("#invoiceform").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission
        updateTotalAmount(); // Update the total amount on form submission
    });
});

function printInvoice() {
    const invoiceNumber = $("#invoiceNumber").val();
    const date = $("#date").val();
    const companyName = $("#companyName").val();
    const customerName = $("#customerName").val();
    const customerAddress = $("#customerAddress").val();
    const phoneNumber = $("#phoneNumber").val();
    const items = [];

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
    const warranty = $("#Warranty").val(); // Fixed: Get the value of Warranty input

    const invoiceContent = `
    <html>
        <head>
            <title>Invoice Slip</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
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
                .copyright {
                    margin-bottom: 50px;
                }
            </style>
        </head>
        <body>
            <h1>Invoice</h1>
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Company Name:</strong> ${companyName}</p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Customer Address:</strong> ${customerAddress}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${item.totalItemPrice}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="total">
                        <td colspan="3">Total Amount</td>
                        <td>${totalAmount}</td>
                    </tr>
                    <tr class="discount">
                        <td colspan="3">Discount</td>
                        <td>${$("#discount").val()}</td>
                    </tr>
                    <tr class="total">
                        <td colspan="3">Amount Payable</td>
                        <td>${$("#amountPayable").val()}</td>
                    </tr>
                    <tr>
                        <td colspan="4">Warranty: ${warranty}</td>
                    </tr>
                </tfoot>
            </table>
            <div class="copyright">
                <p>Thank you for your business!</p>
                <p>&copy; ${new Date().getFullYear()} Your Company</p>
            </div>
        </body>
    </html>
    `;

    const printWindow = window.open("","_blank");
printWindow.document.write(invoiceContent);
printWindow.document.close();
printWindow.print();
}
