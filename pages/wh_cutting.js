import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import Header from '../components/Header';


export default function Cutting() {
  const [cuttings, setCuttings] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cutting, setCutting] = useState({
    id: '', id_rm: '', name: '', quantity: ''
  });
  const [rawMaterials, setRawMaterials] = useState([]);
  const toast = useRef(null);

  const fetchCuttings = async () => {
    try {
      const response = await axios.get('/api/wh_cutting');
      setCuttings(response.data);
    } catch (error) {
      console.error('Error fetching cutting records:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch cutting records' });
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const response = await axios.get('/api/raw_materials');
      setRawMaterials(response.data);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch raw materials' });
    }
  };

  useEffect(() => {
    fetchCuttings();
    fetchRawMaterials();
  }, []);

  const saveCutting = async () => {
    // Validasi input
    if (!cutting.id_rm || !cutting.name || !cutting.quantity) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all fields.' });
      return;
    }

    const dataToSend = {
      id_rm: cutting.id_rm, // Pastikan hanya mengirimkan ID
      name: cutting.name,
      quantity: Number(cutting.quantity),
    };

    // Menampilkan data yang akan dikirim ke API di konsol
    console.log('Data to send to API:', dataToSend);

    try {
      if (cutting.id) {
        // Update existing cutting record
        console.log('Updating Cutting Record:', dataToSend);
        await axios.put('/api/wh_cutting', { ...dataToSend, id: cutting.id });
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cutting record updated successfully.' });
      } else {
        // Create new cutting record
        console.log('Creating Cutting Record:', dataToSend);
        await axios.post('/api/wh_cutting', dataToSend);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cutting record created successfully.' });
      }
      fetchCuttings();
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error('Error saving cutting record:', error.response ? error.response.data : error.message);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save cutting record.' });
    }
  };

  const openNew = () => {
    resetForm();
    setDialogVisible(true);
  };

  const editCutting = (rowData) => {
    setCutting(rowData);
    setDialogVisible(true);
  };

  const resetForm = () => {
    setCutting({ id: '', id_rm: '', name: '', quantity: '' });
  };

  const deleteCutting = async (id) => {
    if (window.confirm('Are you sure you want to delete this cutting record?')) {
      try {
        await axios.delete('/api/wh_cutting', { data: { id } });
        fetchCuttings();
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cutting record deleted successfully.' });
      } catch (error) {
        console.error('Error deleting cutting record:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete cutting record.' });
      }
    }
  };

  return (
    <div>
      <Header /> 
      <Toast ref={toast} />
      <h2>Cutting Records</h2>
      <Button label="New Cutting Record" icon="pi pi-plus" onClick={openNew} />

      <DataTable value={cuttings} paginator rows={10} header="Cutting Records">
        <Column field="id" header="ID" />
        <Column field="id_rm" header="Raw Material ID" />
        <Column field="name" header="Name" />
        <Column field="quantity" header="Quantity" />
        <Column body={(rowData) => (
          <>
            <Button icon="pi pi-pencil" onClick={() => editCutting(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deleteCutting(rowData.id)} />
          </>
        )} header="Actions" />
      </DataTable>

      <Dialog header="Cutting Record" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="id_rm">Raw Material</label>
            <Dropdown
              id="id_rm"
              value={cutting.id_rm}
              options={rawMaterials}
              onChange={(e) => setCutting({ ...cutting, id_rm: e.value.id })} // Ambil hanya ID
              optionLabel="name"
              placeholder="Select a Raw Material"
            />
          </div>
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={cutting.name}
              onChange={(e) => setCutting({ ...cutting, name: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="quantity">Quantity</label>
            <InputText
              id="quantity"
              value={cutting.quantity}
              onChange={(e) => setCutting({ ...cutting, quantity: e.target.value })}
            />
          </div>
        </div>
        <Button label="Save" icon="pi pi-check" onClick={saveCutting} />
      </Dialog>
    </div>
  );
}