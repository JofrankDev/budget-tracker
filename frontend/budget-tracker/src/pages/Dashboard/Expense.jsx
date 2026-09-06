import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Charts/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/layouts/DeleteAlert ';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([])
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [loading,setLoading]= useState(false);
  const [openDeleteAlert,setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  })
  
  //funciones que llamman al api para los expense
  const fetchExpenseDetails = async() =>{
    if (loading) return;

    setLoading(true);

    try {
  const response = await axiosInstance.get(
    `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
  );

  if (response.data) {
    setExpenseData(response.data);
    }
  } catch (error) {
  console.log("Something went wrong. Intentelo de nuevo mas adelante.", error);
  } finally {
  setLoading(false);
  }

  }

  const handleAddExpense = async(expense) => {
    const {category,amount, date, icon} = expense;
    console.log(date);
    if(!category.trim()){
      toast.error("Porfavor eliga introduzca una tipo de gasto o algun alias");
      return;
    }

    if(!amount ||  isNaN(amount) || Number(amount) <= 0) {
      toast.error("Debe existir un monto y debe ser un numero mayor a 0");
    }

    if(!date) {
      toast.error("Se requiere la fecha");
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModal(false);
      toast.success("Gasto agregado existosamente");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error al intentar agregar el ingreso, intentelo de nuevo",
        error.response?.data?.message || error.message
      );
    }
  }

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Gasto borrado correctamente");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error al borrar el gsto, intentelo nuevamente",
        error.response?.data?.message || error.message
      );
    }
};
const handleDownloadExpenseDetails = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.EXPENSE.DONWLOAD_EXPENSE,
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "detalles_gastos.xlsx");

    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar los datos de los gastos:", error);
    toast.error(
      "No se pudo descargar el archivo. Please try again."
    );
  }
};
  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, [])
  return (
     <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id});
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Agregar gasto"
        >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title= "Borrar Gasto"
          >
            <DeleteAlert
            content="Estas seguro de querer borrar este gasto?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
        </Modal>
      </div>
      </DashboardLayout>
  )
}

export default Expense