

let customerList = [];
let cId;
let cName;
let screen;
const button = document.querySelector('.button');
mdc.ripple.MDCRipple.attachTo(button);
let orderBtn = document.getElementById("showOrders");
let detailsBtn = document.getElementById("showDets");
orderBtn.addEventListener("click", () => getOrders(cId));
detailsBtn.addEventListener("click", () => getDets(cId));

fetch('http://localhost:3030/api/customers')
    .then(res => res.json())
    .then(res => {
        customerList = res.res;
        populateList(res.res)
    }).catch((err) => console.log(err));
    
function populateList(customers) {
         let html = '<ul>';
         for (let i = 0; i < customers.length; i++) {
            html += `<li id="${customers[i].CustomerID}"
            onclick="selectCustomer('${customers[i].CustomerID}','${customers[i].ContactName}')">
            <span class="item">[${customers[i].CustomerID}] ${customers[i].ContactName}</span>
            </li>`;
         }
         html += '</ul>';
         document.getElementsByClassName('customers')[0].innerHTML = html;

}

function selectCustomer(id, name) {
    cId = id;
    cName = name;
    orderBtn.removeAttribute("disabled");
    detailsBtn.removeAttribute("disabled");
    screen === 'orders' ? 
    orderBtn.click(id)
    :
    detailsBtn.click(id);
}

function getDets(id) {
    screen = 'dets';
    fetch('http://localhost:3030/api/details/' + id)
        .then(res => res.json())
        .then(res => {
            let vals = res.res;
            let keys = Object.keys(vals[0])
            let html;
            for (let i = 0; i < keys.length; i++) {
                html += `<tr>
                            <th>${keys[i]}</th>
                            <td>${vals[0][keys[i]]}</td>
                        </tr>`;
            }
            document.getElementsByClassName('content')[0].innerHTML =
                '<table>' + html + '</table>';
        }
        ).catch(
            (err) => console.log(err)
        )
        document.getElementsByClassName('details')[0].innerHTML = '';
}

function getOrders(id) {
    screen = 'orders';
    fetch('http://localhost:3030/api/orders/' + id)
        .then(res => res.json()
            .then(res => {
                if (res.msg === "empty") {
                    document.getElementsByClassName('content')[0].innerHTML = `<span>${res.res}</span>`;
                    return;
                }
                let vals = res.res;
                let keys = Object.keys(vals[0]);
                let html = "<tr>"
                for (let i = 0; i < keys.length; i++) {
                    html += `<th>${keys[i]}</th>`
                }
                html += "</tr>"
                for (let i = 0; i < vals.length; i++) {
                    html += `<tr onclick="getOrderDets(${vals[i]['OrderID']})">`
                    for (let j = 0; j < keys.length; j++) {
                        html += `<td>${vals[i][keys[j]]}</td>`
                    }
                    html += "</tr>"
                }
                document.getElementsByClassName('content')[0].innerHTML = `<table>${html}</table>`;
            })
            .catch(
                (err) => console.log(err)
            )
        )
        document.getElementsByClassName('details')[0].innerHTML = '';

}

function getOrderDets(id) {
    fetch('http://localhost:3030/api/orderDetails/' + id)
        .then(res => res.json())
        .then(res => {
            let vals = res.res;
            let keys = Object.keys(vals[0]);
            let sum = 0;
            let html = "<tr>"
            for (let i = 0; i < keys.length; i++) {
                html += `<th>${keys[i]}</th>`
            }
            html += "</tr>"
            for (i = 0; i < vals.length; i++) {
                sum += (vals[i].UnitPrice * vals[i].Quantity)
                html += `<tr>`
                for (let j = 0; j < keys.length; j++) {
                    html += `<td>${vals[i][keys[j]]}</td>`
                }
                html += "</tr>"
            }
            document.getElementsByClassName('details')[0].innerHTML = `
            <p><h3> Order #: ${vals[0].OrderID}. Total: ${sum}.</h3></p>
            <table>${html}</table>
            `;
        }
        ).catch(
            (err) => console.log(err)
        )
}