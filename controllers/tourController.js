const Tour = require('../models/tourModel')
const APIFeatures = require('../utilities/apiFeatures')
const AppError = require('../utilities/appError')
const catchAsyncAwait = require('../utilities/catchAsyncAwait')

//Aliasing
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = 'price,-ratingsAverage'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

// CRUD OPERATIONS
exports.getAllTours = catchAsyncAwait(async (req, res, next) => {
  //Execute the query built above here
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const allTours = await features.query

  res.status(200).json({
    status: 'success',
    results: allTours.length,
    data: {
      allTours
    }
  });
})

exports.getSingleTour = catchAsyncAwait(async (req, res, next) => {
  
  const singleTour = await Tour.findById(req.params.id)
  console.log(singleTour)
  if(!singleTour) {
    return next(new AppError('No tour found with the given ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      singleTour
    }
});
})


exports.createTour = catchAsyncAwait(async (req, res, next) => {

  const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
})

exports.updateTour = catchAsyncAwait(async (req, res, next) => {

  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if(!updatedTour) {
    return next(new AppError('No tour found with the given ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour
    }
  });
})

exports.deleteTour = catchAsyncAwait(async (req, res, next) => {

  const tour = await Tour.findByIdAndRemove(req.params.id)
  if(!tour) {
    return next(new AppError('No tour found with the given ID', 404))
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
})

exports.getTourStats = catchAsyncAwait(async (req, res, next) => {
  //aggregation pipeline

  const stats = await Tour.aggregate([
    {
      $match : { ratingsAverage: { $gte: 4.5}}
    },
    {
      $group: {
        _id: '$difficulty',
        numberOfTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage'},
        numberOfRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      },
    },
    {
      $sort: {
        avgPrice: 1 
      }
    },
  ])

  res.status(200).json({
    status: 'success',
    data: stats
  });
})

exports.getMonthlyPlan = catchAsyncAwait(async (req, res, next) => {
  //unwinding 

  const year = req.params.year * 1
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        }, 
        tourStartCount: { $sum: 1},//grouping tours and counting how many there are for the given range
        tourNames: { $push: '$name'}
      }
    },
    {
      $addFields: { month: '$_id'}
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {tourStartCount: -1}
    },
    {
      $limit: 12
    }
  ])

  res.status(200).json({
    status: 'success',
    size: plan.length,
    data: plan
  });
})