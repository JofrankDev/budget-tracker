const xlsx = require('xlsx');
const Expense = require ("../models/Expense");
//controladores de rutas
exports.addExpense = async (req,res) => {
    const  userId = req.user.id;
    try {
        const {icon, category, amount, date} = req.body;

        //validacion de campos vacios
        if(!category || !amount || !date) {
            return res.status(400).json({message: "Todos los campos son requeridos"});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({message: "Error de Servidor"})
    }
} 
exports.getAllExpense = async (req,res) => {
const userId = req.user.id; 
try {
    const expense = await Expense.find({userId}).sort({date: -1});
    res.json(expense);
} catch (error){
    res.status(500).json({message: "Server error"});
}

}
exports.deleteExpense = async (req,res) => {
try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({message: "Gasto borrado exitosamente"});
} catch (error){
    res.status(500).json({message: "Server error"});
}
} 
exports.downloadExpenseExcel = async (req,res) => {
const userId = req.user.id;
try {
    const expense = await Expense.find({userId}).sort({date:-1});

    //para el exscel
    const data = expense.map((item)=>({
        Categoria: item.category,
        Monto: item.amount,
        Fecha: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"Gastos");
    xlsx.writeFile(wb,'Gastos_detalles.xlsx');
    res.download('Gastos_detalles.xlsx');
} catch (error) {
    res.status(500).json({message: "Server Error"});
}
} 