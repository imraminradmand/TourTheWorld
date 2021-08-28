//creating function to handle async await try/catch cleaner
module.exports = fn => {
    return (req, res, next) => {
    fn(req, res, next).catch(next)
    }
}