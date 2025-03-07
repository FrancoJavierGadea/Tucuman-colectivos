import { DATA_TYPES } from "./constants.js";
import { eachFile, readJSON, writeJSON } from "./update-data.js";


const DATA = [
    {
        data: {
            provider: {
                name: 'T.A. Cruz Alta S.R.L.',
                contact: {
                    phone: '381 421-0649',
                    email: '',
                    address: 'Terminal Tucumán: Av. Brígido Terán 250 - Local 74, San Miguel de Tucumán, Tucumán, Argentina',
                    website: ''
                }
            }
        },
        targets: ['/data/interurbano/124/']
    },
]

export function addMetadata(folderPath, data = {}){

    eachFile(folderPath, ({dataType, file, folder}) => {

        if(dataType === DATA_TYPES.METADATA){

            DATA.forEach(({data, targets}) => {

                if(targets.some(target => file.replaceAll('\\', '/').includes(target))){

                    console.log('Update: ', file.replace(folderPath, ''));
                    console.log(data.provider.name);

                    const metadata = readJSON(file);

                    writeJSON(file, {...metadata, ...data});
                }

            })
        }
    })
}


