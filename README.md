# bus-ticket-booking  

# 🚌 Bus Ticket Booking System

The **Bus Ticket Booking System** is a web-based application designed to simplify the process of searching, booking, and managing bus tickets online.  
It provides a seamless experience for both passengers and administrators through a user-friendly interface and efficient backend management.
---
##

### 👤 User Features
-  Search available buses by source, destination, and travel date  
-  Book tickets and choose seats in real time  
-  Secure online payment integration  
-  View and cancel bookings easily
-  send to  mail ticket copy with when journydate and pickuplocation,time
-  Access booking history and ticket details  

###  Admin Features
- Manage buses, routes, and schedules  
- View and manage user bookings  
- cancel booking and delete bus sechedules
- 🔐 Secure login for admin access  
---
## Tech Stack
| Category | Technology |
| **Backend** | Node.js / Express 
| **Database**  MongoDB |
| **Version Control** | Git & GitHub |
| **Tools** | VS Code, Postman, npm / pip |
---
## ⚙️ Installation & Setup
Navigate to the Project Directory
cd bus-ticket-booking-backend

PORT=5000
MONGO_URL=mongodb+srv://teaserboss937_db_user:22bcc068@busbooking.vvhopxg.mongodb.net/booking?appName=busbooking
JWT_SECRET=7fh3k9@dfg92!x9lp4Wpuio!5yxcvyupo
EMAIL_USER=teaserboss937@gmail.com
EMAIL_PASS=pkay bsdn aisd ptgr
NODE_ENV=production
npm install

APIS ENDPOINT
npm start or npm run dev
signup
http://localhost:5000/api/auth/signup
"username":"kr rajesh",
    "email":"krrajesh@gmail.com",
    "password":"22bcc068"
login
http://localhost:5000/api/auth/login
    "username":"kenguraj",
    "password":"22bcc068"
logout
http://localhost:5000/api/auth/logout

search bus post method 
http://localhost:5000/api/bus/search-by-date
"from": "coimbatore",
  "to": "chennai",
  "date": "enter your current date",
  "bustype": "Non-AC sleeper",
  "minPrice": 500,
  "maxPrice": 1200
  booking ticketpost method 
  http://localhost:5000/api/bus/ticket
  "busId": "6900c939123ec7480ea05b85",
  "seatNumber": "L2",
  "passengerName": "kr rajesh",
  "passengerAge": 30,
  "phoneNumber": "+91-9876543211",
  "email": "enter your email for instant mail ticket copy",
  "pickupLocation": "Gandhipuram, Coimbatore",
  "pickupTime": "7:20 PM",
  "dropLocation": "Koyambedu, Chennai",
  "dropTime": "7:22 PM",
  "date":""
get ticket copy                          
http://localhost:5000/api/bus/getticket/enter booking id form database
put method
user can cancel the ticket  start journey time before 3 hours
http://localhost:5000/api/bus/cancel/6901d114ca9714f0e5381dc4
add review Post method after drop time completed
http://localhost:5000/api/bus/:busId/booking/booking Id/review
  "rating": 4,
  "comment": "Very comfortable ride. Pickup was timely and drop was smooth."
ADMIN signup
http://localhost:5000/api/admin/adminsignup
    "username":"admin1",
    "password":"22bcc068"
http://localhost:5000/api/admin/adminlogin |AMIN LOGIN WITH USERNAME AND PASSWORD |LOGOUT http://localhost:5000/api/admin/adminlogout|
AMIN CREATE BUS Post Method http://localhost:5000/api/admin/createbus
"busName": "SRM TRAVELS",
  "busNumber": "TN06AA1077",
  "totalSeats": 8,
  "from": "Coimbatore",
  "to": "Chennai",
  "bustype": "Non AC Seater + Sleeper",
  "image": "https://example.com/srm.jpg",
  "rating": 4.5,
  "pickupLocation": "Gandhipuram, Coimbatore",
  "dropLocation": "Koyambedu, Chennai",
  "pickupTime": "8:20 PM",
  "dropTime": "7:20 AM",
  "startDate": "2025-10-29",
  "endDate": "2025-11-30",
  "seats": [
    { "seatNumber": "U1", "seatType": "Non-AC sleeper", "price": 700 },
    { "seatNumber": "U2", "seatType": "Non-AC seater", "price": 700 },
    { "seatNumber": "L1", "seatType": "Non-AC seater", "price": 600},
    { "seatNumber": "L2", "seatType": "Non-AC seater", "price": 600},
    { "seatNumber": "U3", "seatType": "Non-AC sleeper", "price": 700 },
    { "seatNumber": "U4", "seatType": "Non-AC sleeper", "price": 750 },
    { "seatNumber": "L3", "seatType": "Non-AC seater", "price": 600},
    { "seatNumber": "L4", "seatType": "Non-AC seater", "price": 600}
  ]
UPDATE BUS http://localhost:5000/api/admin/updatebus/enter:BUSID
droplocation:"madurai" change what you want

delete bus ticket http://localhost:5000/api/admin/deleteticket/:BOOKINGID 
delete bus route http://localhost:5000/api/admin/deletebus/:BUSID
get cancel ticket http://localhost:5000/api/admin/cancelled
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kenguraj/bus-ticket-booking.git





