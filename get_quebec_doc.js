// Finding all the superclinique addresses:
// Array.from(document.querySelector("#c36186 > div > div > ul:nth-child(8)").children).map(li => li.children[0].href)

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const list_url = 'https://www.quebec.ca/en/health/health-system-and-services/service-organization/family-medicine-group-fmg-u-fmg-and-super-clinic'

const getClinicPages = async () => {
    const clinic_list_selector = '#c36186 > div > div'
    const { data } = await axios.get(list_url);
    const $ = cheerio.load(data);
    return Promise.all($(clinic_list_selector).find('a').map((idx, el) => {
        return $(el).attr('href')
    }))
}


const strip_white = (s) => {
    return s.replace(/\s+/g, ' ').replace(/(^\s+)|(\s+$)/g, '')
}

const getClinics = async (pages) => {
    const address_selector = '#info-generale > div > p:nth-child(3)'
    const name_selector = '#zone-titre-ressource > h1'
    console.log("Found links to " + pages.length + " clinics")
    return pages.map(async (page, idx) => {
        try{
            const { data } = await axios.get(
                page
            );
            const $ = cheerio.load(data);
            const address = strip_white($(address_selector).first().text());
            const name = strip_white($(name_selector).first().text());
            return {address, name}
        } catch(error) {
            console.log(page)
            console.log("error at idx " + idx.toString() + " " + page)
        }
        
    })
};

const main = async () => {
    getClinicPages()
    // .then(res => res.filter((page, i) => i < 1))  // Smaller subset to debug
    .then(getClinics)
    .then(res => {
        Promise.all(res).then(clinics => {
            let clinics_csv = clinics
                .filter(c => c !== undefined)
                .map(clinic => {
                return "\"" + clinic.name + "\",\"" + clinic.address + '\",\n' 
            }).join()
            clinics_csv = "Name,Address\n" + clinics_csv
            fs.writeFile('./clinics.csv', clinics_csv, err => {
                if(err)
                    console.log(err)
            })
        })
    })
}

main()