const xlsx = require('xlsx');
const Income = require ("../models/Income");
//controladores de rutas
exports.addIncome = async (req,res) => {
    const  userId = req.user.id;
    try {
        const {icon, source, amount, date} = req.body;

        //validacion de campos vacios
        if(!source || !amount || !date) {
            return res.status(400).json({message: "Todos los campos son requeridos"});
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({message: "Error de Servidor"})
    }
} 
exports.getAllIncome = async (req,res) => {
const userId = req.user.id; 
try {
    const income = await Income.find({userId}).sort({date: -1});
    res.json(income);
} catch (error){
    res.status(500).json({message: "Server error"});
}

}
exports.deleteIncome = async (req,res) => {
try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({message: "Ingreso borrado exitosamente"});
} catch (error){
    res.status(500).json({message: "Server error"});
}
} 
exports.downloadIncomeExcel = async (req,res) => {
const userId = req.user.id;
try {
    const income = await Income.find({userId}).sort({date:-1});

    //para el exscel
    const data = income.map((item)=>({
        Procedencia: item.source,
        Monto: item.amount,
        Fecha: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"Ingresos");
    xlsx.writeFile(wb,'Ingresos_detalles.xlsx');
    res.download('Ingresos_detalles.xlsx');
} catch (error) {
    res.status(500).json({message: "Server Error"});
}
} 