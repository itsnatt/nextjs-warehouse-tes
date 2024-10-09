import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Header from '../components/Header';


export default function RawMaterials() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [material, setMaterial] = useState({
    id: '', name: '', size: '', merk: '', surat_jalan: '', supplier: '', purchase_order_code: '', amount: '', unit: ''
  });
  const toast = useRef(null);

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
    fetchRawMaterials();
  }, []);

  const saveMaterial = async () => {
    if (!material.name || !material.amount) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Name and amount are required.' });
      return;
    }

    try {
      if (material.id) {
        // Update existing material
        await axios.put('/api/raw_materials', material);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Raw material updated successfully.' });
      } else {
        // Create new material
        await axios.post('/api/raw_materials', material);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Raw material created successfully.' });
      }
      fetchRawMaterials();
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error('Error saving raw material:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save raw material.' });
    }
  };

  const openNew = () => {
    resetForm();
    setDialogVisible(true);
  };

  const editMaterial = (rowData) => {
    setMaterial(rowData);
    setDialogVisible(true);
  };

  const resetForm = () => {
    setMaterial({ id: '', name: '', size: '', merk: '', surat_jalan: '', supplier: '', purchase_order_code: '', amount: '', unit: '' });
  };

  const deleteMaterial = async (id) => {
    if (window.confirm('Are you sure you want to delete this raw material?')) {
      try {
        await axios.delete(`/api/raw_materials?id=${id}`);
        fetchRawMaterials();
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Raw material deleted successfully.' });
      } catch (error) {
        console.error('Error deleting raw material:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete raw material.' });
      }
    }
  };

  return (
    <div>
      <Header />

      <Toast ref={toast} />
      <h2>Raw Materials</h2>
      <Button label="New Raw Material" icon="pi pi-plus" onClick={openNew} />

      <DataTable value={rawMaterials} paginator rows={10} header="Raw Materials">
        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="size" header="Size" />
        <Column field="merk" header="Merk" />
        <Column field="surat_jalan" header="Surat Jalan" />
        <Column field="supplier" header="Supplier" />
        <Column field="purchase_order_code" header="Purchase Order Code" />
        <Column field="amount" header="Amount" />
        <Column field="unit" header="Unit" />
        <Column body={(rowData) => (
          <>
            <Button icon="pi pi-pencil" onClick={() => editMaterial(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deleteMaterial(rowData.id)} />
          </>
        )} header="Actions" />
      </DataTable>

      <Dialog header="Raw Material" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={material.name}
              onChange={(e) => setMaterial({ ...material, name: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="size">Size</label>
            <InputText
              id="size"
              value={material.size}
              onChange={(e) => setMaterial({ ...material, size: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="merk">Merk</label>
            <InputText
              id="merk"
              value={material.merk}
              onChange={(e) => setMaterial({ ...material, merk: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="surat_jalan">Surat Jalan</label>
            <InputText
              id="surat_jalan"
              value={material.surat_jalan}
              onChange={(e) => setMaterial({ ...material, surat_jalan: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="supplier">Supplier</label>
            <InputText
              id="supplier"
              value={material.supplier}
              onChange={(e) => setMaterial({ ...material, supplier: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="purchase_order_code">Purchase Order Code</label>
            <InputText
              id="purchase_order_code"
              value={material.purchase_order_code}
              onChange={(e) => setMaterial({ ...material, purchase_order_code: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="amount">Amount</label>
            <InputText
              id="amount"
              value={material.amount}
              onChange={(e) => setMaterial({ ...material, amount: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="unit">Unit</label>
            <InputText
              id="unit"
              value={material.unit}
              onChange={(e) => setMaterial({ ...material, unit: e.target.value })}
            />
          </div>
        </div>
        <Button label="Save" icon="pi pi-check" onClick={saveMaterial} />
      </Dialog>
    </div>
  );
}