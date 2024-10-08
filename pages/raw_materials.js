import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Header from '../components/Header';


export default function RawMaterials() {
    const [materials, setMaterials] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [material, setMaterial] = useState({
        id: '', name: '', size: '', merk: '', surat_jalan: '', supplier: '', purchase_order_code: '', amount: '', unit: ''
    });

    const fetchMaterials = async () => {
        try {
            const response = await axios.get('/api/raw_materials');
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const saveMaterial = async () => {
        try {
            if (material.id) {
                // Update existing material
                await axios.put('/api/raw_materials', material);
            } else {
                // Create new material
                await axios.post('/api/raw_materials', material);
            }
            fetchMaterials();
            resetForm();
            setDialogVisible(false);
        } catch (error) {
            console.error('Error saving material:', error);
            alert('Error saving material. Please check your inputs.');
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
        await axios.delete('/api/raw_materials/[id]', { data: { id } });
        fetchVendors();
    };  


    return (
        <div>
            <Header />

            <h2>Raw Materials</h2>
            <Button label="New Raw Material" icon="pi pi-plus" onClick={openNew} />

            <DataTable value={materials} paginator rows={10} header="Raw Materials">
                <Column field="id" header="ID" />
                <Column field="name" header="Name" />
                <Column field="size" header="Size" />
                <Column field="merk" header="Merk" />
                <Column field="amount" header="Amount" />
                <Column body={(rowData) => (
                    <>
                        <Button icon="pi pi-pencil" onClick={() => editMaterial(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteMaterial(rowData.id)} />
                 
                    </>
                )} header="Actions" />
            </DataTable>

            <Dialog header="Raw Material" visible={dialogVisible} style={{ width: '50vw' }} onHide={() => setDialogVisible(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={material.name} onChange={(e) => setMaterial({ ...material, name: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="size">Size</label>
                        <InputText id="size" value={material.size} onChange={(e) => setMaterial({ ...material, size: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="merk">Merk</label>
                        <InputText id="merk" value={material.merk} onChange={(e) => setMaterial({ ...material, merk: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="surat_jalan">Surat Jalan</label>
                        <InputText id="surat_jalan" value={material.surat_jalan} onChange={(e) => setMaterial({ ...material, surat_jalan: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="supplier">Supplier</label>
                        <InputText id="supplier" value={material.supplier} onChange={(e) => setMaterial({ ...material, supplier: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="purchase_order_code">Purchase Order Code</label>
                        <InputText id="purchase_order_code" value={material.purchase_order_code} onChange={(e) => setMaterial({ ...material, purchase_order_code: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="amount">Amount</label>
                        <InputText id="amount" value={material.amount} onChange={(e) => setMaterial({ ...material, amount: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="unit">Unit</label>
                        <InputText id="unit" value={material.unit} onChange={(e) => setMaterial({ ...material, unit: e.target.value })} />
                    </div>
                </div>
                <Button label="Save" icon="pi pi-check" onClick={saveMaterial} />
            </Dialog>
        </div>
    );
}
