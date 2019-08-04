const express = require("express");
const app = express();
const path = require("path");
const db = require('./sqlconn');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
db.connect(app).then((res) => {
    if (res) {
        console.log('connection success')
    }
}).catch((err) => {
    console.log(err)
})

app.get('/api/customers', (req, res) => {
    const con = app.get('con')
    sql = `SELECT ContactName, CustomerID FROM customers ORDER BY ContactName`
    con.query(sql, (err, ress) => {
        if (err) {
            res.json({ msg: 'error', res: err.message })
        } else {
            if (ress.length > 0) {
                res.json({ msg: 'success.', res: ress })
            }
        }
    })
})

app.get('/api/details/:ID', (req, res) => {
    const con = app.get('con')
    let id = req.params.ID;
    sql = `SELECT * FROM customers where CustomerID = '${id}'`
    con.query(sql, (err, ress) => {
        if (err) {
            res.json({ msg: 'error', res: err.message })
        } else {
            if (ress.length > 0) {
                res.json({ msg: 'success', res: ress })
            } 
        }
    })
})

app.get('/api/orders/:ID', (req, res) => {
    const con = app.get('con')
    let id = req.params.ID;
    sql = `SELECT orders.OrderID, orders.CustomerID,
    employees.LastName AS \'Employee LN\', employees.FirstName AS \'Employee FN\', orders.OrderDate, orders.RequiredDate ,orders.ShippedDate,
    orders.ShipVia, orders.Freight, orders.ShipName, orders.ShipAddress, orders.ShipCity,
    orders.ShipRegion, orders.ShipPostalCode, orders.ShipCountry 
    FROM orders INNER JOIN employees ON employees.EmployeeID = orders.EmployeeID HAVING orders.CustomerID = '${id}'`;
    con.query(sql, (err, ress) => {
        if (err) {
            res.json({ msg: 'error', res: err.message })
        } else {
            if (ress.length > 0) {
                res.json({ msg: 'success', res: ress })
            } else {
                res.json({ msg: 'empty', res: 'There are no orders for this customer' })
            }
        }
    })
})

app.get('/api/orderDetails/:ID', (req, res) => {
    const con = app.get('con')
    let id = req.params.ID;
    sql = `SELECT od.OrderID, od.ProductID, 
    products.ProductName, od.UnitPrice, od.Quantity ,od.Discount 
    FROM \`order details\` AS od INNER JOIN products ON products.ProductID = od.ProductID HAVING od.OrderId = '${id}'`
    con.query(sql, (err, ress) => {
        if (err) {
            res.json({ msg: 'error', res: err.message })
        } else {
            if (ress.length > 0) {
                res.json({ msg: 'success', res: ress })
            } 
        }
    })
})

app.listen(3030, () => { console.log("server listning on port 3030...") });