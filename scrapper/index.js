const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const chrono = require('chrono-node')
const he = require('he') // he for decoding html entities
const where = require('node-where')
console.clear()

const decodeLinbreaks = element => {
  const html = element.html().replace(/<(?:.|\n)*?>/gm, '\n') // remove all html tags
  return he.decode(html).split('\n')
}

const sessionToArray = el => {
  return el.map((index, element) => {
    return [decodeLinbreaks(jQuery(element))]
  }).get()
}

const filtersMap = {
  'Sessions actives': el => {
    const elements = sessionToArray(el.find('.meta'))
    return elements.map(array => {
      return {
        createdAt: chrono.parseDate(array[0].replace('Créé : ', '')),
        ip: array[2].replace('Adresse IP : ', ''),
        navigator: array[3].replace('Navigateur : ', '')
      }
    })
  },
  'Activité du compte': el => {
    const elements = sessionToArray(el.find('.meta'))
    return elements.map(array => ({
      createdAt: chrono.parseDate(array[0]),
      ip: array[1].replace('Adresse IP : ', ''),
      navigator: array[2].replace('Navigateur : ', '')
    }))
  },
  'Machines reconnues': el => {
    const elements = sessionToArray(el.find('li'))
    return elements.map(array => ({
      app: array[0],
      createdAt: chrono.parseDate(array[2].replace('Mis à jour : ', '')),
      ip: array[3].replace('Adresse IP : ', ''),
      navigator: array[4].replace('Navigateur : ', '')
    }))
  },
  'Données de protection des connexions': el => {
    const elements = sessionToArray(el.find('li'))
    return elements.map(array => {
      const ipRegexp = new RegExp('^Adresse IP', 'i')
      array = array.filter(e => e)
      if (ipRegexp.test(array[0])) {
        return {
          createdAt: chrono.parseDate(array[1]),
          ip: array[array.length - 1].replace('Adresse IP : ', '')
        }
      }
      const geoRegexp = new RegExp('^Emplacement estimé déduit à partir de l’adresse IP', 'i')
      if (geoRegexp.test(array[0])) {
        const createdRegex = new RegExp('^Créé : ')
        return {
          latLng: array[0].replace('Emplacement estimé déduit à partir de l’adresse IP ', '').split(',').map(e => +e),
          createdAt: chrono.parseDate(array[1])
        }
      }
    }).filter(e => e)
  }
}

const geoByIp = async d =>
  new Promise((resolve, reject) =>
    where.is(d.ip, (err, result) => {
      if (err) {
        console.log(err)
      }
      return err ? reject(err) : resolve(result)
    })
  )

const geoByLngLat = async d =>
  new Promise((resolve, reject) => {
    request(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${d.latLng.toString()}&sensor=true`,
      (err, res, html) => {
        console.log(res.toJSON())
      }
    )
  })

const scrap = async () => {
  request('http://localhost:8080/public/fb-data/html/security.htm', async (err, response, html) => {
    if (!err) {
      jQuery = cheerio.load(html)
      const res = jQuery('.contents ul').map((index, element) => {
        const el = jQuery(element)
        const title = el.prev().text()
        if (filtersMap[title]) {
          return {
            title: title,
            content: filtersMap[title](el)
          }
        }
      }).get()

      let finalRes = await Promise.all(res.reduce((previous, {content}) => {
        return previous.concat(content.map(async e => {
          if (e.ip) {
            try {
              const whereIs = await geoByIp(e)
              const latLng = [whereIs.get('lat'), whereIs.get('lng')]
              console.log(latLng)
              return {
                ...e,
                latLng,
                city: whereIs.get('city')
              }
            } catch (e) {
              throw e
            }
          }
          return e
        }))
      }, []))

      const json2geo = data => ({
        type: 'FeatureCollection',
        features: data.map(e => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [...e.latLng].reverse()
          },
          properties: e
        }))
      })

      finalRes = json2geo(finalRes)

      console.log(finalRes)

      fs.writeFile(
        'public/geolocs.json',
        JSON.stringify(
          finalRes,
          null,
          4
        ), (err, res) => {
          if (err) {
            throw err
          }
          console.log('success!')
        })
    }
  })
}

scrap()
