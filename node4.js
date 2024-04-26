const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

mongoose.connect('mongodb+srv://dattalade:dattalade@cluster0.fade8bn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: String,
  phonenumber: Number,
  password: String,
  city: String
});

const OrderSchema = new mongoose.Schema({ 
  customerName: String,
  books: String,
  quantity: Number,
  address: String,
  totalPrice: String,
  
});

const registerSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username:String,
  id: Number,
  phonenumber: Number,
  password: String 
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', OrderSchema); 
const regi = mongoose.model('regi', registerSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

app.post('/register', (req, res) => {
  const userData = {
    username: req.body.username,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
    city: req.body.city,
  };

  User.create(userData, (err, User) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during registration');
    } else {
      // Redirect to login.html after successful registration
      res.redirect('/login');
    }
  });
});
app.post('/adregi', (req, res) => {
  const adminData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    id: req.body.id,
    phonenumber: req.body.phonenumber,
    password: req.body.password, 
    };

  User.create(adminData, (err, regi) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during registration');
    } else {
      // Redirect to login.html after successful registration
      res.redirect('/adlog.html');
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password} = req.body;

  User.findOne({ username, password}, (err, User) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during login.');
    } else if (!User) {
      console.log('User not found in the database');
      res.send('Login failed.');
    } else {
      console.log('Login successful');
      // Redirect to dashboard.html after successful login
      res.redirect('/Books.html');
    }
  });
});
app.post('/adlog', (req, res) => {
  const { username, password} = req.body;

  User.findOne({ username, password}, (err, regi) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during login.');
    } else if (!regi) {
      console.log('User not found in the database');
      res.redirect('/adregi.html');
    } else {
      console.log('Login successful');
      // Redirect to dashboard.html after successful login
      res.redirect('/admin.html');
    }
  });
});
app.post('/order', (req, res) => {
  const orderData = {
    customerName: req.body.customerName,
    books: req.body.books,
    quantity: req.body.quantity,
    address: req.body.address,
    totalPrice: req.body.totalPrice,

  };

  Order.create(orderData, (err, order) => {
    if (err) {
      console.error(err);
      res.send('An error occurred during order');
    } else {
      res.redirect('/home.html');
    }
  });
});

app.post('/delete', (req, res) => {
        const recordId = req.body.username;
        // Use Mongoose to delete the record by its ID using deleteOne
        User.deleteOne({username: recordId}, (err) => {
          if (err) {
            res.send('Error deleting record');
          } else {
            res.send(`<html>
      <head>
      <h1>Record Deleted Successfully.</h1><br>
      <button><a href="/home.html">Go Back</a></button>
      </head>
      </html>`);
          }
        });
      });
app.post('/display', (req, res) => {
        const userid = req.body.username;
        // Use Mongoose to find the specific record by its ID
        User.findOne({ username: userid }, (err, user) => {
          if (err) {
            res.send('Error finding user');
          } else if (!user) {
            res.send('User not found');
          } else {
            res.send(`
            <html>
            <head>
            <title>Display Record</title>
            </head>
            <body align="center">
              <h1>Record Details</h1>
              <table border="2" align="center" cellspacing="6" cellpaddin="6">
                <tr>
                  <td>User name</td>
                  <td>${user.username}</td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td>${user.phonenumber}</td>
                </tr>
                <tr>
                  <td>City</td>
                  <td>${user.city}</td>
                </tr>
                <tr>
                  <td>password</td>
                  <td>${user.password}</td>
                </tr>
                </table><br>
              <button><a href="/home.html">Go Back</a></button><br><br>
            </body>
          </html>
            `);
          }
        });
      });
    app.post('/display1', (req, res) => {
        User.find({}, (err, records) => {
          if (err) {
            res.send('Error fetching records');
          } else {
            res.send(`
            <html>
            <head>
              <title>All Records</title>
            </head>
            <body align="center">
              <h1>All Records</h1>
              <table align="center" border="2" cellpadding="3" cellspacing="6">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>City</th>
                        <th>Phone Number</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                ${records.map(record => `
                  <tr> 
                    <td>${record.username}</td>  
                    <td>${record.city}</td> 
                    <td>${record.phonenumber}</td>
                    <td>${record.password}</td>
                    </tr>
                `).join('')}
                </tbody>
              </table>
              <br><br>
              <br>
              <button><a href="/home.html">Go Back</a></button>
            </body>
          </html>
            `);
          }
        });
      });
      app.post('/display2', (req, res) => {
        Order.find({}, (err, records) => {
          if (err) {
            res.send('Error fetching records');
          } else {
            res.send(`
              <html>
                <head>
                  <title>All Records</title>
                </head>
                <body align="center">
                  <h1>All Records</h1>
                  <table align="center" border="2" cellpadding="3" cellspacing="6">
                    <thead>
                      <tr>
                        <th>customer name</th>
                        <th>books</th>
                        <th>quantity</th>
                        <th>address</th>
                        <th>TotalPrice</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${records.map(record => `
                        <tr> 
                          <td>${record.customerName}</td>  
                          <td>${record.books}</td> 
                          <td>${record.quantity}</td>
                          <td>${record.address}</td>
                          <td>${record.totalPrice}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  <br><br>
                  <br>
                  <button><a href="/home.html">Go Back</a></button>
                </body>
              </html>
            `);
          }
        });
      });
      

   
   app.post('/update', (req, res) => {
        const username = req.body.username;
        const city = req.body.city;
        const phonenumber = req.body.phonenumber;
        const password = req.body.password;
        // Use Mongoose to update the record by its ID using updateOne
        User.updateOne({username: username,city:city }, {phonenumber:phonenumber,password:password}, (err) => {
          if (err) {
            res.send('Error updating record');
          } else {
            res.send(`<html>
      <body align="center">
      <h1>Record Updated Successfully.</h1><br><br>
      <center><button><a href="/home.html">Go Back</a></button></center>
      </body>
      </html>`);
          }
        });
      });
             
// Serve login.html
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Serve home.html
app.get('/stone1.html', (req, res) => {
  res.sendFile(__dirname + '/home.html');
});

// Serve dashboard.html
app.get('/order.html', (req, res) => {
  res.sendFile(__dirname + '/order.html');
});
// Serve home.html
app.get('/delete.html', (req, res) => {
  res.sendFile(__dirname + '/delete.html');
});
app.get('/update.html', (req, res) => {
  res.sendFile(__dirname + '/update.html');
});
app.get('/adlog', (req, res) => {
  res.sendFile(__dirname + '/adlog.html');
});
app.get('/adregi', (req, res) => {
  res.sendFile(__dirname + '/adregi.html');
});
// Serve home.html
app.get('/display.html', (req, res) => {
  res.sendFile(__dirname + '/display.html');
});
app.get('/display1.html', (req, res) => {
  res.sendFile(__dirname + '/display1.html');
});
app.get('/display2.html', (req, res) => {
  res.sendFile(__dirname + '/display2.html');
});

app.listen(port, () => {
  console.log('Server is running on port ${port}');
});