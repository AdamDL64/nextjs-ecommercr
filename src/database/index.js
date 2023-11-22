import mongoose from "mongoose";


const configOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectToDB = async () => {
    const connectionUrl = 'mongodb+srv://adamcoe128:1234567890@cluster0.hcxqnlg.mongodb.net/'

    mongoose.connect(connectionUrl, configOptions)
        .then(() => console.log('Ecommerce database successfully !'))
        .catch((err) => console.log(`Getting Error form DB connnection ${err.message}`))
}
export default connectToDB