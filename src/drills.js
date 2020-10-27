require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

//Drill 1: get all items that contain text
function searchByTerm(searchTerm){
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log('Drill 1:', result)
        })
}
searchByTerm('ea')

//Drill 2: get all items paginated
function searchPageNum(pageNumber){
    const itemsPerPage = 6
    const offset = itemsPerPage * (pageNumber - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(pageNumber)
        .offset(offset)
        .then(result => {
            console.log('Drill 2:', result)
        })
}

searchPageNum(5)

//Drill 3: get all items added after date
function addAfterDate(daysAgo){
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('date_added', '>', 
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
        .then(result => {
            console.log('Drill 3:', result)
        })
}

addAfterDate(5)

//Drill 4: get the total cost for each category
function totalCost(){
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log('Drill 4:', result)
        })
}
totalCost()