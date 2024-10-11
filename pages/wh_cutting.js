import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Toast } from 'primereact/toast';
import Header from '../components/Header';

export default function Cutting() {
  const [cuttings, setCuttings] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cutting, setCutting] = useState({ id: '', id_rm: '', name: '', quantity: '' });
  const [rawMaterials, setRawMaterials] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [filteredQualities, setFilteredQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [sorting, setSorting] = useState({ BON: '', quantity: '', type_name: '' }); // Tambah type_name di sini
  const [sortingDialogVisible, setSortingDialogVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const toast = useRef(null);

  // Fetch data untuk cutting
  const fetchCuttings = async () => {
    try {
      const response = await axios.get('/api/wh_cutting');
      setCuttings(response.data);
    } catch (error) {
      console.error('Error fetching cutting records:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch cutting records' });
    }
  };

  // Fetch data untuk raw materials
  const fetchRawMaterials = async () => {
    try {
      const response = await axios.get('/api/raw_materials');
      setRawMaterials(response.data);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch raw materials' });
    }
  };

  // Fetch data untuk quality
  const fetchQualities = async () => {
    try {
      const response = await axios.get('/api/quality');
      setQualities(response.data);
    } catch (error) {
      console.error('Error fetching quality records:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch quality records' });
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchCuttings();
    fetchRawMaterials();
    fetchQualities();
  }, []);

  // Fungsi untuk menyimpan cutting
  const saveCutting = async () => {
    if (!cutting.id_rm || !cutting.name || !cutting.quantity) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all fields.' });
      return;
    }

    const dataToSend = {
      id_rm: cutting.id_rm,
      name: cutting.name,
      quantity: Number(cutting.quantity), // Pastikan quantity diubah ke angka
    };

    try {
      if (cutting.id) {
        await axios.put('/api/wh_cutting', { ...dataToSend, id: cutting.id });
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cutting record updated successfully.' });
      } else {
        await axios.post('/api/wh_cutting', dataToSend);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cutting record created successfully.' });
      }
      fetchCuttings();
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error('Error saving cutting record:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save cutting record.' });
    }
  };

  // Fungsi untuk membuka dialog baru
  const openNew = () => {
    resetForm();
    setDialogVisible(true);
  };

  // Fungsi untuk mengedit cutting
  const editCutting = (rowData) => {
    setCutting(rowData);
    setDialogVisible(true);
  };

  // Fungsi untuk mereset form
  const resetForm = () => {
    setCutting({ id: '', id_rm: '', name: '', quantity: '' });
    setSelectedQuality(null);
    setSelectedMaterial(null);
    setSorting({ BON: '', quantity: '', type_name: '' }); // Reset sorting juga
  };

  // Fungsi untuk menghapus cutting
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

  // Fungsi untuk menyimpan sorting
  const saveSorting = async () => {
    if (!selectedQuality || !sorting.quantity || !sorting.type_name) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all fields.' });
      return;
    }

    const dataToSend = {
      id_cutting: cutting.id,
      id_quality: selectedQuality.id,
      type_name: sorting.type_name, // Gunakan type_name dari input
      quantity: Number(sorting.quantity), // Pastikan quantity diubah ke angka
      BON: sorting.BON,
    };

    try {
      await axios.post('/api/wh_sortir', dataToSend);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Sorting record created successfully.' });
      fetchCuttings();
      setSortingDialogVisible(false);
    } catch (error) {
      console.error('Error saving sorting record:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save sorting record.' });
    }
  };

  // Konfirmasi sortir
  const confirmSorting = (cuttingData) => {
    setCutting(cuttingData);
    setSortingDialogVisible(true);
    setSelectedQuality(null);
    setSorting({ BON: '', quantity: '', type_name: '' }); // Reset sorting saat konfirmasi
  };

  // Fungsi untuk mencari bahan baku
  const searchMaterials = (event) => {
    let results = [];
    if (event.query.length > 0) {
      results = rawMaterials.filter((material) => {
        return material.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }
    setFilteredMaterials(results);
  };

  // Fungsi untuk mencari kualitas
  const searchQualities = (event) => {
    let results = [];
    if (event.query.length > 0) {
      results = qualities.filter((quality) => {
        return quality.name.toLowerCase().includes(event.query.toLowerCase());
      });
    }
    setFilteredQualities(results);
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
            <Button label="Sortir" icon="pi pi-check" onClick={() => confirmSorting(rowData)} />
          </>
        )} header="Actions" />
      </DataTable>

      <Dialog header="Cutting Record" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="id_rm">Raw Material</label>
            <AutoComplete
              id="id_rm"
              value={selectedMaterial}
              suggestions={filteredMaterials}
              completeMethod={searchMaterials}
              onChange={(e) => {
                setSelectedMaterial(e.value);
                setCutting({ ...cutting, id_rm: e.value.id });
              }}
              field="name"
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
              type="number" // Tambahkan tipe number untuk input quantity
              value={cutting.quantity}
              onChange={(e) => setCutting({ ...cutting, quantity: e.target.value })}
            />
          </div>
        </div>
        <Button label="Save" icon="pi pi-check" onClick={saveCutting} />
      </Dialog>

      <Dialog header="Confirm Sorting" visible={sortingDialogVisible} style={{ width: '50vw' }} onHide={() => setSortingDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="quality">Quality</label>
            <AutoComplete
              id="quality"
              value={selectedQuality}
              suggestions={filteredQualities}
              completeMethod={searchQualities}
              onChange={(e) => setSelectedQuality(e.value)}
              field="name"
              placeholder="Select Quality"
            />
          </div>
          <div className="p-field">
            <label htmlFor="type_name">Type Name</label>
            <InputText
              id="type_name"
              value={sorting.type_name}
              onChange={(e) => setSorting({ ...sorting, type_name: e.target.value })}
              placeholder="Enter Type Name"
            />
          </div>
          <div className="p-field">
            <label htmlFor="quantity">Quantity</label>
            <InputText
              id="quantity"
              type="number"
              value={sorting.quantity}
              onChange={(e) => setSorting({ ...sorting, quantity: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="BON">BON (Optional)</label>
            <InputText
              id="BON"
              value={sorting.BON}
              onChange={(e) => setSorting({ ...sorting, BON: e.target.value })}
            />
          </div>
          <Button label="Save Sorting" icon="pi pi-check" onClick={saveSorting} />
        </div>
      </Dialog>
    </div>
  );
}