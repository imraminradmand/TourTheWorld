const Tour = require('../models/tourModel')
const APIFeatures = require('../utilities/apiFeatures')

//Aliasing
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = 'price,-ratingsAverage'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}
// CRUD OPERATIONS
exports.getAllTours = async (req, res) => {

  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }
}

exports.getSingleTour = async (req, res) => {
  
  try {
    const singleTour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      data: {
        singleTour
      }
  });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }
}

exports.createTour = async (req, res) => {

  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
  
}

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndRemove(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
}

exports.getTourStats = async (req, res) => {
  //aggregation pipeline
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
}