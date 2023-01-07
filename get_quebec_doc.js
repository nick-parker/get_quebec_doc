// Finding all the superclinique addresses:
// Array.from(document.querySelector("#c36186 > div > div > ul:nth-child(8)").children).map(li => li.children[0].href)

// Result:
const pages = ['http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=29414',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=365598',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=32208',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=534529',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=55434',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=42515',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=30262',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=42021',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/recherche/ressource/?nofiche=113767',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=40842',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=47611',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=32374',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=41133',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=50153',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=37965',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=34486',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=462325',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=37207',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=35464',
"https://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=56984&ch_nom=clinique+medicale+maisonneuve&bt_rechNom=&ch_choixReg=&ch_rayon=0&ch_code=",
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=38893',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=175699',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=628677',
 'http://www.sante.gouv.qc.ca/en/repertoire-ressources/recherche/ressource/?nofiche=37323',
 'https://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=837708',
 'https://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=988498',
 'https://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=607307',
 'https://sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=856635',
 'https://www.sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=34589',
 'https://sante.gouv.qc.ca/en/repertoire-ressources/ressource/?nofiche=1056523'
]

// Get address from each page
const address_selector = '#info-generale > div > p:nth-child(3)'
const name_selector = '#zone-titre-ressource > h1'

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const getPostTitles = async () => {
        const addresses = [];
        return pages.map(async (page, idx) => {
            try{
                const { data } = await axios.get(
                    page
                );
                const $ = cheerio.load(data);
                const raw_address = $(address_selector).first().text();
                const address = raw_address.replace(/\s+/g, ' ')
                const name = $(name_selector).first().text().replace(/\s+/g, ' ');
                return {address, name}
            } catch(error) {
                console.log("error at idx " + idx.toString() + " " + page)
            }
            
        })
};

getPostTitles().then(res => {
    Promise.all(res).then(clinics => {
        const clinics_csv = clinics
            .filter(c => c !== undefined)
            .map(clinic => {
            return "\"" + clinic.name + "\",\"" + clinic.address + '\",\n' 
        }).join()
        fs.writeFile('./clinics.csv', clinics_csv, err => {
            if(err)
                console.log(err)
        })
    })
})

// Addresses
const addresses = [
    '955, boulevard Saint-Jean, bureau 308 Pointe-Claire (Québec)  H9R 5K3',
    '2111, avenue Northcliffe Montréal (Québec)  H4A 3K6',
    '1538, rue Sherbrooke Ouest, bureau 100 Montréal (Québec)  H3G 1L5',
    '5858, chemin de la Côte-des-Neiges, unité 5ème étage, 5e étage Montréal (Québec)  H3S 1Z1',
    '5885, chemin de la Côte-des-Neiges, bureau 401 Montréal (Québec)  H3S 2T2',
    '1851, rue Sherbrooke Est, bureau 101 Montréal (Québec)  H2K 4L5',
    '2529, rue Allard Montréal (Québec)  H4E 2L5',
    '4475, rue Bannantyne, bureau 103 Montréal (Québec)  H4G 1E2',
    '1021, rue Jean-Talon Est, bureau 200 Montréal (Québec)  H2R 1V6',
    '475, boulevard de la Côte-Vertu Montréal (Québec)  H4L 1X7',
    '529, rue Jarry Est, bureau 201 Montréal (Québec)  H2P 1V4',
    '8560, rue Saint-Hubert, bureau 200 Montréal (Québec)  H2P 1Z7',
    '1605, boulevard Marcel-Laurin, bureau 200 Montréal (Québec)  H4R 0B7',
    '12905, rue Sherbrooke Est, bureau 103 Montréal (Québec)  H1A 1B9',
    '3000, rue Bélanger, est Montréal (Québec)  H1Y 1A9',
    '5700, rue Saint-Zotique Est, bureau 102-104 Montréal (Québec)  H1T 3Y7',
    '2601, william-Tremblay, bureau 200 Montréal (Québec)  H1Y 0E2',
    '8000, boulevard Langelier, bureau 601 Montréal (Québec)  H1P 3K2',
    '4750, rue Jarry Est, bureau 204 Montréal (Québec)  H1R 1X8',
    "5345, boulevard de l'Assomption, bureau RC-60 et 360, rez-de-chaussée  Montréal (Québec)  H1T 4B3",
    '9080, rue Hochelaga, 2e étage Montréal (Québec)  H1L 2N9',
    '175, avenue Stillview, bureau 155 Pointe-Claire (Québec)  H9R 4S3',
    '1, avenue Westminster Nord, 2e étage Montréal-Ouest (Québec)  H4X 1Y8',
    '5636, boulevard Henri-Bourassa Est Montréal (Québec)  H1G 2T2',
    '150, rue Sainte-Catherine Ouest, niveau 4 Tour Hyatt, C.P. 65  Montréal (Québec)  H2X 3Y2',
    '9735, boulevard Saint-Laurent Montréal (Québec)  H3L 2N4',
    '4480, chemin de la Côte-de-Liesse, bureau 110, entrée située au 2445, rue Manella Mont-Royal (Québec)  H4N 2R1',
    '8651, rue de Grosbois Montréal (Québec)  H1K 2G4',
    '7600, boulevard Viau, bureau RP 336 Montréal (Québec)  H1S 2P3',
    '400, avenue Sainte-Croix, bureau 1360 Montréal (Québec)  H4N 3L4'
  ]