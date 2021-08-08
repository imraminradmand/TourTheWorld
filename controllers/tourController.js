const Tour = require('../models/tourModel')

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
    //Build the query here
    const queryObject = {...req.query}
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach(el => delete queryObject[el])

    let queryString = JSON.stringify(queryObject)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    //console.log(JSON.parse(queryString))

    let query = Tour.find(JSON.parse(queryString))

    //Adding sorting feature to API
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      //console.log(sortBy)
      query = query.sort(sortBy)
    }  else {
      query = query.sort('ratingsAverage')
    }

    //Field limiting
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    //Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 10
    const skipValue = (page - 1) * limit

    query = query.skip(skipValue).limit(limit)

    if(req.query.page) {
      const totalTours = await Tour.countDocuments()
      if(skip >= totalTours) throw new Error ('Page does not exist')
    }

    //Execute the query built above here
    const allTours = await query

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
};

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
};

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
  
};

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
};

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
};