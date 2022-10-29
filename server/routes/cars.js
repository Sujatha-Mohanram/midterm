/*
Student Number : 301152761
Student Name: Sujatha Mohanram
Midterm : 1

*/
// modules required for routing
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
const cars = require("../models/cars");

// define the car model
let car = require("../models/cars");

/* GET cars List page. READ */
router.get("/", (req, res, next) => {
  // find all cars in the cars collection
  car.find((err, cars) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("cars/index", {
        title: "Cars",
        cars: cars,
      });
    }
  });
});

//  GET the Car Details page in order to add a new Car
router.get("/add", (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
   res.render('cars/add', { title: 'New Car' });
});

// POST process the Car  Details page and create a new Car  - CREATE
router.post("/add", (req, res, next) => {
  let {Carname,Category,Carmodel,Price} = req.body;
  let errors = [];
  if(!Carname || !Category || !Carmodel || !Price)
  {
   errors.push({ msg:"Please fill in all fields"});
  }
  if(errors.length>0)
     {
         res.render('register',{
             errors,
             Carname,
             Category,
             Carmodel,
             Price,
             title: 'Add New Car'
         });
     }
     else
     {
      let newcar = new car({Carname,Category,Carmodel,Price});
       newcar.save()
              .then(car =>{
                  //req.flash('success_msg','You have added a new car to your favourites');
                  res.redirect('/cars');
              })
                  .catch(err=> console.log(err));
      
  }
  });

// GET the Car Details page in order to edit an existing Car
router.get("/details/:id", (req, res, next) => {
  let id = req.params.id;
    
  car.findById(id, (err,cartoEdit) =>{
      if(err)
      {
          console.log(err);
          res.end(err);
      }
      else
      {
          res.render('cars/details', {title: 'Edit Car', car: cartoEdit, title: 'Edit Car'});

      }
  });
});

// POST - process the information passed from the details form and update the document
router.post("/details/:id", (req, res, next) => {
  let id = req.params.id;
 
  let updateCar = {};
  updateCar.Carname = req.body.Carname;
  updateCar.Category = req.body.Category;
  updateCar.Carmodel = req.body.Carmodel;
  updateCar.Price = req.body.Price;
  let filter = {"_id": id};
  console.log(id);
  car.updateOne(filter, updateCar, (err) =>{

     if(err)
      {
          
          console.log(err);
          res.end(err);
      }
      else
      {
          
          res.redirect('/cars');
      }
  });
});

// GET - process the delete
/*router.get("/delete/:id", (req, res, next) => {
  let id = req.params.id;
          
    car.findByIdAndDelete(id,(err)=>{
     
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
           
            res.redirect('/cars');
        }
   
    });
});*/

// GET - process the delete
router.get("/delete", (req, res, next) => {
  let updateCar = {};
  updateCar.Carname = req.query.Carname;
  updateCar.Price =req.query.Price;
    
  let filter={};
  if(!updateCar.Carname )
  {
     filter = {"Carname": { "$regex": updateCar.Carname,"$options":"$i" }};
  }
  else
  {
    if(!updateCar.Price)
    {
      filter = {"Price": { "$gte": updateCar.Price } };
    }
  }
  
console.log('to delete::'+updateCar.Carname+"::::"+"Price:::"+updateCar.Price)
        
    car.deleteMany(filter,(err)=>{
     
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
           
            res.redirect('/cars');
        }
   
    });
});

module.exports = router;
