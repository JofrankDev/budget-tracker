import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../../components/Charts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/layouts/DeleteAlert ';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([])
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [loading,setLoading]= useState(false);
  const [openDeleteAlert,setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  })

  //----funciones que llaman a la  api
  const fetchIncomeDetails = async() =>{
    if (loading) return;

    setLoading(true);

    try {
  const response = await axiosInstance.get(
    `${API_PATHS.INCOME.GET_ALL_INCOME}`
  );

  if (response.data) {
    setIncomeData(response.data);
    }
  } catch (error) {
  console.log("Something went wrong. Intentelo de nuevo mas adelante.", error);
  } finally {
  setLoading(false);
  }

  }

  const handleAddIncome = async(income) => {
    const {source,amount, date, icon} = income;
    console.log(date);
    if(!source.trim()){
      toast.error("Porfavor eliga introduzca una tipo de ingreso o procedencia");
      return;
    }

    if(!amount ||  isNaN(amount) || Number(amount) <= 0) {
      toast.error("Debe existir un monto y debe ser un numero mayor a 0");
    }

    if(!date) {
      toast.error("Se requiere la fecha");
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModal(false);
      toast.success("Ingreso agreado existosamente");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error al intentar agregar el ingreso, intentelo de nuevo",
        error.response?.data?.message || error.message
      );
    }
  }

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Ingreso borrado correctamente");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error al borrar el ingreso, intentelo nuevamente",
        error.response?.data?.message || error.message
      );
    }
};

const handleDownloadIncomeDetails = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.INCOME.DONWLOAD_INCOME,
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "detalles_ingresos.xlsx");

    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar los datos de los ingresos:", error);
    toast.error(
      "No se pudo descargar el archivo. Please try again."
    );
  }
};

  useEffect(() => {
    fetchIncomeDetails();

    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id)=> {
              setOpenDeleteAlert({show:true, data: id});
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
        isOpen={openAddIncomeModal}
        onClose={() => setOpenAddIncomeModal(false)}
        title= "Agregar Ingreso"
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({show: false, data: null})}
        title= "Borrar Ingreso"
        >
          <DeleteAlert 
          content="Estas seguro de querer borrar este ingreso?"
          onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income