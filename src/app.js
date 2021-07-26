const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Dip Raj'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address',
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                location: location,
                forecastData: forecastData,
                address: req.query.address
            })
        })
    })

})

// app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         return res.send({
//             error: 'You must provide a search term'
//         })
//     }
//     res.send({
//         products: []
//     })
// })

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Dip Raj'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'Contact me through my gmail',
        name: 'Dip Raj'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 page',
        message: 'Help article not found',
        name: 'Dip Raj'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 page',
        message: 'Page not found',
        name: 'Dip Raj'
    })
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})