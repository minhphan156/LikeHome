const express = require("express");
const router = express.Router();

const checkAvalibity = require("../../validation/checkAvailableHotels");
var checkAvailability = require('../../validation/checkAvailibility.js')

const Hotel = require("../../models/Hotel");
const Booking = require("../../models/booking");

// @route GET api/hotel/search
// @desc Search Overview with Sorting and Filtering
router.get('/search',(req,res)=>{
    //Sorting
    var sortByObject = req.query.sortObject;
    if (typeof sortByOject !== 'undefined'){
        switch (sortByObject){
            case "price":
                sortByObject = {price: 1};
                break;
            case "-price":
                sortByObject = {price: -1};
                break;
            case "name":
                sortByObject = {name: 1};
                break;
            case "-name":
                sortByObject = {name: -1};
                break;
            case "star_rating":
                sortByObject = {star_rating: 1};
                break;
            case "-star_rating":
                sortByObject = {star_rating: -1};
                break;
            case "guest_rating":
                sortByObject = {guest_rating: 1};
                break;
            case "-guest_rating":
                sortByObject = {guest_rating: -1};
                break;
            }
    }
    //End Sorting

    //Filter
    var free_wifi;
    var pool;
    var free_parking;
    var pet_friendly;
    var free_breakfast;
    var star_rating = req.query.star_rating;
    var review_score = req.query.review_score;
    var price_low = req.query.price_low;
    var price_high = req.query.price_high;
    if (typeof star_rating == 'undefined' || star_rating == '')
        star_rating = 0
    if (typeof review_score == 'undefined' || review_score == '')
        review_score = 0
    if (typeof price_low == 'undefined' || price_low == '')
        price_low = 0
    if (typeof price_high == 'undefined' || price_high == '')
        price_high = Number.POSITIVE_INFINITY
    if (req.query.free_wifi == 1){
        free_wifi = new RegExp('free wifi',"ig");}
    else
        free_wifi = new RegExp(' ',"ig");
    if (req.query.pool == 1) 
        pool = new RegExp('pool',"ig");
    else
        pool = new RegExp(' ',"ig");
    if (req.query.free_parking == 1)
        free_parking = new RegExp('free parking',"ig");
    else
        free_parking = new RegExp(' ', "ig");
    if (req.query.pet_friendly == 1)
        pet_friendly = new RegExp('pet friendly',"ig");
    else
        pet_friendly = new RegExp(' ', "ig");
    if (req.query.free_breakfast == 1)
        free_breakfast = new RegExp('free breakfast',"ig");
    else
        free_breakfast = new RegExp(' ', "ig");
    //End Filter
    var searchKey = req.query.destinationName;
    var date = {
        checkin:req.query.checkIn.replace('"','').replace('"',''),
        checkout:req.query.checkOut.replace('"','').replace('"',''),
    };
    var numberRooms = parseInt(req.query.numberRooms);
    var startIndex = req.query.lastIndex;
    const NUM_RESULTS = req.query.numResults;
    const regex = new RegExp(searchKey,"ig");
    //.split("").join('*')
    //console.log(regex)
    Hotel.find({
        amenities: free_wifi,
        amenities: pool,
        amenities: free_parking,
        amenities: pet_friendly,
        amenities: free_breakfast,
        $and:[{'price.singlePrice': {$gt: price_low}}, {'price.singlePrice': {$lt: price_high}}],
        star_rating: {$gt: star_rating},
        guest_rating: {$gt: review_score},
        $or:[{name:regex}, {city:regex},{airports:regex}]
    }).sort(sortByObject).then((doc,err)=>{
        if(err) res.status(400).json(err);
        // var startIndex = 5 * pageNumber - 5;
        var result = [];
        let bookingID = "bookid"
        while(result.length < NUM_RESULTS && doc[startIndex] !== undefined){
            var arr = doc[startIndex]
            let singleAvaliable = checkAvalibity(doc[startIndex].roomTypeAndNumber.single, date, numberRooms, bookingID);
            let doubleAvaliable = checkAvalibity(doc[startIndex].roomTypeAndNumber.double, date, numberRooms, bookingID);
            let kingAvaliable = checkAvalibity(doc[startIndex].roomTypeAndNumber.king, date, numberRooms, bookingID);
            let studioAvaliable = checkAvalibity(doc[startIndex].roomTypeAndNumber.studio, date, numberRooms, bookingID);
            if (singleAvaliable || doubleAvaliable || kingAvaliable || studioAvaliable){
                item = {
                    name:arr.name,
                    hotelID:arr._id,
                    street:arr.street,
                    city:arr.city,
                    price:arr.price.singlePrice,
                    star_rates:arr.star_rating,
                    guest_rate:arr.guest_rating,
                    img:arr.img[0]
                }
                result.push(item);
            }
            startIndex++;
        }
        console.log(result);
        resultPack = {
            "lastIndex": startIndex,
            "nextExists": (doc[startIndex] !== undefined) ? true : false,
            "results": result
        }
        res.status(200).json(resultPack);
    })
})


// @route GET api/hotel/individual
// @desc individual page
router.get('/individual', (req,res) =>{
    var date = {
        checkin: req.query.checkIn.replace('"','').replace('"',''),
        checkout: req.query.checkOut.replace('"','').replace('"','')
    };
    var numberOfRooms = parseInt(req.query.numberRooms);
    let singleRoomAvailability = true;
    let doubleRoomAvailability = true;
    let kingRoomAvailablity = true;
    let studioRoomAvailability = true;
    Hotel.findById(req.query.id)
    .then(hotel => {
        if ((typeof date.checkin !== 'undefined') && (typeof date.checkout !== 'undefined')){
            if(checkAvailability(hotel.roomTypeAndNumber.single, date, numberOfRooms, "PlaceHolder").length == 0)
                singleRoomAvailability = false;
            if(checkAvailability(hotel.roomTypeAndNumber.double, date, numberOfRooms, "PlaceHolder").length == 0)
                doubleRoomAvailability = false;
            if(checkAvailability(hotel.roomTypeAndNumber.king, date, numberOfRooms, "PlaceHolder").length == 0)
                kingRoomAvailablity = false;
            if(checkAvailability(hotel.roomTypeAndNumber.studio, date, numberOfRooms, "PlaceHolder").length == 0)
                studioRoomAvailability = false;
        }
        res.json({singleAvailability: singleRoomAvailability, doubleAvailability: doubleRoomAvailability, kingAvailability: kingRoomAvailablity, studioAvailability: studioRoomAvailability, name: hotel.name, hotelID: hotel._id, street: hotel.street, city: hotel.city, img: hotel.img, price: hotel.price, star_rating: hotel.star_rating, guest_rating: hotel.guest_rating,
            guest_review: hotel.guest_review, amenities: hotel.amenities, airports: hotel.airports, })
    })
    .catch(err => res.status(404));

    })

module.exports = router;