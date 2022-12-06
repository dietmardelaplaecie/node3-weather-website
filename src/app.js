//geocode en forecast paginas
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')
//standaard libs
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { query } = require('express')
const { request } = require('http')

const app = express()

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Handlebars setup engine and views location
app.set('views', viewsPath)
app.set('view engine','hbs')
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Dietmar Delaplaecie',
        message: 'On this site, you can view the weather'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Dietmar Delaplaecie'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helptext: 'This is the message of the help page',
        title: 'Help',
        name: 'Dietmar Delaplaecie'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'please provide an address!'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) =>{
        if (error) {
            return res.send(error)
        } 
    
        forecast(latitude,longitude, (error, forecastData) => {
            if (error) {
                return res.send(error)
            }
            res.send(
                {
                forecast: forecastData,
                location,
                address: req.query.address
                }
            )
    
        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        message: 'Help article not found',
        title: '404 ERROR',
        name:'Dietmar Delaplaecie'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        message: 'Page not found',
        title: '404 ERROR',
        name:'Dietmar Delaplaecie'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
